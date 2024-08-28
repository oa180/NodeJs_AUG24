const express = require("express");
const { createReview } = require("../controllers/review.controller");

const reviewRouter = express.Router();

reviewRouter.route("/").get().post(createReview);
module.exports = reviewRouter;
