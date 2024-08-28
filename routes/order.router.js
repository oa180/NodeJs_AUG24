const express = require("express");
const {
  createOrder,
  getOrdersList,
} = require("../controllers/order.controller");
const { protect } = require("../controllers/auth.controller");

const orderRouter = express.Router();

orderRouter.route("/").get(getOrdersList).post(protect,createOrder);

// productRouter.router("/:id").patch(updateProduct).delete(deleteProduct).get(getById);
module.exports = orderRouter;
