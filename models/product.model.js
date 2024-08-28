const { default: mongoose } = require("mongoose");
const { default: slugify } = require("slugify");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product must have a title"],
      unique: true,
    },
    category: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    rating: {
      type: Number,
      default: 0.0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    shippingInformation: String,
    tags: [String],
    brand: {
      type: String,
      // required: [true, "Product must have a brand"],
    },
    weight: Number,
    dimensions: Object,
    warrantyInformation: String,
    availabilityStatus: {
      type: String,
      required: [true, "Product must have availability status"],
    },
    returnPolicy: String,
    minimumOrderQuantity: Number,
    images: [String],
    thumbnail: {
      type: String,
      // required: [true, "Product must have a thumbnail"],
    },
    orderDates: [Date],
    slug: String,
    priceAfterDiscount: Number,
    review: Array,
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Middlewares
// 1) Document Middleware
productSchema.pre("save", function (next) {
  // works only with => Create save,  won't work with=>   insertMany
  // console.log(this);

  this.slug = slugify(this.title, { lower: true });
  next();
});
productSchema.pre("save", function (next) {
  this.priceAfterDiscount =
    this.price - (this.price * this.discountPercentage) / 100;

  next();
});

productSchema.post("save", function (doc, next) {
  // console.log(doc);
  next();
});

// 2) Query Middleware
productSchema.pre("find", function (next) {
  this.find({ availabilityStatus: { $ne: "Out of Stock" } });
  next();
});
productSchema.pre(/^find/, function (next) {
  // console.log("I am in find");

  // this.select("title price discountPercentage");
  next();
});
productSchema.post("find", function (res, next) {
  // console.log(res);

  next();
});
// 3) Aggregation Middleware
productSchema.pre("aggregate", function (next) {
  this._pipeline.unshift({
    $match: {
      availabilityStatus: { $ne: "Out of Stock" },
    },
  });
  console.log(this._pipeline);
  next();
});

// Virtual Properties
// productSchema.virtual("priceAfterDiscount").get(function () {
//   return this.price - (this.price * this.discountPercentage) / 100;
// });

// productSchema.virtual("slug").get(function () {
//   return slugify(this.title, { lower: true });
// });

const Product = new mongoose.model("Product", productSchema);

module.exports = Product;
