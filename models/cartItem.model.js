const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.ObjectId,
      ref: "Cart",
      required: [true, "Cart Item must have cart id"],
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Cart Item must have a product id"],
    },
    quantity: {
      type: Number,
      required: [true, "Cart item must have a quantity"],
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const CartItem = new mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;
