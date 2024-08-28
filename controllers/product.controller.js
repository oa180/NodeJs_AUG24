const fs = require("fs");
const Product = require("../models/product.model");
const ApiFilters = require("../utils/apiFilter");
const { catchAsync } = require("../utils/catchAsync");
const multer = require("multer");
// const upload = multer({ dest: "./public/img/products" });

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/products");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `product-${req.params.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] == "image") {
    cb(null, true);
  } else {
    cb("Only image files are allowed", false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductThumbnail = upload.single("thumbnail");
exports.uploadProductImages = upload.array("images", 5);
exports.uploadProductImagesAndThumbnail = upload.fields([
  {
    name: "thumbnail",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.createProduct = async (req, res) => {
  try {
    // const newProduct = new Product(req.body);

    // newProduct.priceAfterDiscount =
    //   req.body.price - (req.body.price * req.body.discountPercentage) / 100;
    // await newProduct.save();

    const newProduct = await Product.create(req.body);

    res.status(201).json({ message: "success", data: newProduct });
  } catch (error) {
    res.status(500).json({ message: "fail", error });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    // console.log(req.query);

    // equal near salt
    // gte gt lte lt ne eq
    // {price: {$lte: 10}}
    // console.log(productsList);

    const filter = new ApiFilters(Product.find(), req.query)
      .filter()
      .sort()
      .fields()
      .pagination();

    // console.log(filter.query);

    const productsList = await filter.query;

    // let query = Product.find(JSON.parse(queryStr));

    // // Sort
    // console.log(req.query);

    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");

    //   query = query.sort(sortBy);
    //   // "price -rating"
    //   // ['price', '-rating'].join(' ')
    // }

    // if (req.query.fields) {
    //   const selectBy = req.query.fields.split(",").join(" ");
    //   query = query.select(selectBy);
    //   // select('price title' )
    // }

    // // Pagination
    // /**
    //  * 30
    //  * page 1 , limit 7 => 7    1 2 3 4 5 6 7
    //  * page 2, limit 7 => 7     8 9 10 11 12 16 14
    //  * page 3, limit 7 => 10    11 12 13 14 15  (page - 1) * limit
    //  */
    // const page = +req.query.page || 1;
    // const limit = +req.query.limit || 50;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    res.status(200).json({
      message: "success",
      length: productsList.length,
      data: productsList,
    });
  } catch (error) {
    res.status(500).json({ message: "fail", error: error.message });
  }
};

exports.getProductById = catchAsync(async (req, res, next) => {
  // console.log(req.user);

  const product = await Product.findById(req.params.id);

  // const product = await Product.findById(req.params.id).populate(
  //   "categoryId",
  //   "title createdAt"
  // );

  // return next("Go to next middleware");
  // find
  if (!product) return next(new Error("Product not found"));
  res.status(200).json({ message: "success", product });
});

exports.updateProduct = async (req, res) => {
  try {
    console.log(req.files);

    console.log(req.body);

    const productExists = await Product.findById(req.params.id);
    if (!productExists) throw new Error("Product not found");

    const newProductData = { ...req.body };

    // if (req.file) {
    //   newProductData.thumbnail = req.file.filename;
    // }

    // if (req.files) {
    //   newProductData.images = req.files.map((image) => {
    //     return image.filename;
    //   });
    // }

    const updateProduct = await Product.findOneAndUpdate(
      { _id: req.params.id },
      newProductData,
      {
        new: true,
      }
    ).select("_id title images thumbnail");

    if (req.files) {
      updateProduct.thumbnail = req.files.thumbnail[0].filename;
      req.files.images.forEach((image) => {
        updateProduct.images.push(image.filename);
      });

      await updateProduct.save();
    }

    res.status(200).json({
      message: "success",
      data: updateProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "fail", err: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: "fail", error });
  }
};

exports.getTopRatedProducts = async (req, res, next) => {
  req.query.sort = "-rating";
  req.query.limit = "5";

  next();
};

exports.bestSellerProducts = async (req, res, next) => {
  req.query.sort = "-minimumOrderQuantity";
  req.query.limit = "10";
  req.query.fields = "title,price";

  next();
};

exports.computeProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      // Stages {}
      // {
      //   $match: { rating: { $gte: 3.5 } },
      // },

      {
        $group: {
          _id: "$category",
          avgRating: { $avg: "$rating" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          numOfProducts: { $sum: 1 },
        },
      },

      {
        $sort: { price: -1 },
      },
    ]);

    res.status(200).json({
      message: "success",
      length: stats.length,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ message: "fail", err: error.message });
  }
};

exports.mostSoldProducts = async (req, res) => {
  try {
    const productsStats = await Product.aggregate([
      {
        $unwind: "$orderDates",
      },
      {
        $match: {
          orderDates: {
            $gte: new Date(`${req.params.year}-01-01`),
            $lte: new Date(`${req.params.year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$orderDates" },
          numOfOrders: { $sum: 1 },
          products: { $push: { title: "$title", price: "$price" } },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      { $sort: { numOfOrders: -1 } },
      // { $limit: 1 },
      { $project: { _id: 0 } },
    ]);

    res.status(200).json({
      message: "success",
      length: productsStats.length,
      data: productsStats,
    });
  } catch (error) {
    res.status(500).json({ message: "fail", err: error.message });
  }
};
