const express = require("express");
const { protect, restrictTo } = require("../controllers/auth.controller");
const { modifyCart, getCartItems } = require("../controllers/cart.controller");

// Cart routes
const cartRouter = express.Router();

cartRouter.patch("/", protect, restrictTo("customer"), modifyCart);
cartRouter.get("/", protect, restrictTo("customer"), getCartItems);

module.exports = cartRouter;
