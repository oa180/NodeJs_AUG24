const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Cart must have a user"],
  },

  totalAmount: {
    type: Number,
    min: [0, "Cart Total amount must be greater than 0"],
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    },
  ],

  // products: [
  //   {
  //     productId: {
  //       type: mongoose.Schema.ObjectId,
  //       ref: "Product",
  //     },
  //     quantity: {
  //       type: Number,
  //       min: 1,
  //       default: 1,
  //     },
  //   },
  // ],
});

const Cart = new mongoose.model("Cart", cartSchema);

module.exports = Cart;
