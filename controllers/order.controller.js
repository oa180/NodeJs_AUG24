const Order = require("../models/order.model");

exports.createOrder = async (req, res) => {
  try {
    console.log(req.user);

    const newOrder = await Order.create({ ...req.body, userId: req.user._id });
    // req.body.userId = req.user._id;
    // const newObj = { ...req.body };
    // const newOrder = await Order.create(newObj);

    res.status(201).json({ message: "success", data: newOrder });
  } catch (error) {
    res.status(500).json({ message: "fail", error });
  }
};
exports.getOrdersList = async (req, res) => {
  try {
    const newOrder = await Order.find().populate("userId").populate("products");

    res.status(201).json({ message: "success", data: newOrder });
  } catch (error) {
    res.status(500).json({ message: "fail", error });
  }
};
