const Product = require("../models/product.model");
const Review = require("../models/review.model");

exports.getReviews = async (req, res) => {};

exports.createReview = async (req, res) => {
  const product = await Product.findById(req.body.productId);
  console.log(product);

  const newReview = await Review.create(req.body);
  console.log("🚀 ~ exports.createReview= ~ newReview:", newReview);

  product.review.push(newReview);
  await product.save();
  res.status(201).json({ message: "success", data: newReview });

  try {
  } catch (error) {
    res.status(500).json({ message: "fail", error });
  }
};
