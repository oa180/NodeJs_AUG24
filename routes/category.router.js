const express = require("express");
const { createCategory } = require("../controllers/category.controller");

const categoryRouter = express.Router();

categoryRouter.route("/").get().post(createCategory);

// productRouter.router("/:id").patch(updateProduct).delete(deleteProduct).get(getById);
module.exports = categoryRouter;
