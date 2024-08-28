const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model");
const Product = require("../models/product.model");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

// exports.addToCart = catchAsync(async (req, res, next) => {
//   // logged in User id
//   const userId = req.user._id;
//   // get his cart
//   const userCart = await Cart.findOne({
//     userId,
//   });

//   // validate product ids

//   const foundProducts = await Promise.all(
//     req.body.products.map(async (product) => {
//       const foundProd = await Product.findById(product.productId);
//       if (!foundProd) return "not-found";
//       return product;
//     })
//   );

//   if (foundProducts.includes("not-found"))
//     return next(new AppError("Product not found", 404));

//   //   // add products to cart
//   //   console.log(foundProducts);
//   //   console.log(userCart.products);

//   await Promise.all(
//     foundProducts.map(async (product) => {
//       const foundProd = await Cart.findOne(
//         {
//           id: userCart._id,
//           "products.productId": product.productId,
//         },
//         "_id"
//       );

//       if (foundProd) {
//         userCart.products = userCart.products.map((element) => {
//           if (element.productId == product.productId) {
//             element.quantity += product.quantity;
//             return element;
//           }
//           return element;
//         });
//       } else userCart.products.push(product);
//     })
//   );

//   await userCart.save();
//   // product id => update quantity
//   // !product id => create new cart item

//   //   userCart.products.push(...foundProducts);
//   //   await userCart.save();

//   res.status(200).json({
//     status: "success",
//     message: "Products added to cart",
//   });
// });

// Add item to cart, change quantity , delete item from cart
exports.modifyCart = catchAsync(async (req, res, next) => {
  // Get user's cart
  const userId = req.user._id;
  // get his cart
  const userCart = await Cart.findOne({
    userId,
  });

  // validate products
  const foundProducts = await Promise.all(
    req.body.products.map(async (product) => {
      const foundProd = await Product.findById(product.productId);
      if (!foundProd) return "not-found";
      return product;
    })
  );

  if (foundProducts.includes("not-found"))
    return next(new AppError("Product not found", 404));

  // modify cart
  await Promise.all(
    foundProducts.map(async (product) => {
      const cartItemExists = await CartItem.findOne({
        cartId: userCart._id,
        productId: product.productId,
      });
      if (cartItemExists) {
        if (product.quantity < 1) {
          await CartItem.findByIdAndDelete(cartItemExists._id);
        } else {
          cartItemExists.quantity = product.quantity;
          await cartItemExists.save();
        }
      } else {
        await CartItem.create({
          cartId: userCart._id,
          productId: product.productId,
          quantity: product.quantity > 0 ? product.quantity : 1,
        });
      }
    })
  );

  res.status(200).json({
    status: "success",
    message: "Cart Changed",
  });
});

exports.getCartItems = catchAsync(async (req, res, next) => {
  // Get user's cart
  const userId = req.user._id;
  // get his cart
  const userCart = await Cart.findOne({
    userId,
  });

  const cartItems = await CartItem.find({
    cartId: userCart._id,
  });

  let totalAmount = 0;
  const items = await Promise.all(
    cartItems.map(async (item) => {
      const foundProd = await Product.findById(item.productId).select("price");
      console.log(foundProd.price, item.quantity);

      totalAmount += +foundProd.price * +item.quantity;

      return item;
    })
  );

  res.status(200).json({
    status: "success",
    message: "Cart items",
    data: { items, totalAmount },
  });
});
