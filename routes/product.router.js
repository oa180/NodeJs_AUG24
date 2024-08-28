const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  validateProductData,
  getTopRatedProducts,
  bestSellerProducts,
  computeProductStats,
  mostSoldProducts,
  uploadProductThumbnail,
  uploadProductImages,
  uploadProductImagesAndThumbnail,
} = require("../controllers/product.controller");
const { protect, restrictTo } = require("../controllers/auth.controller");

// Product routes
const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/top-rated", getTopRatedProducts, getAllProducts);
productRouter.get("/best-seller", bestSellerProducts, getAllProducts);
productRouter.get("/most-sold/:year", mostSoldProducts);
productRouter.get("/:id", getProductById);

productRouter.use(protect);
productRouter.use(restrictTo("admin"));
productRouter.get("/stats", computeProductStats);
productRouter.post("/", createProduct);

productRouter.patch(
  "/:id",
  // uploadProductThumbnail,
  // uploadProductImages,
  uploadProductImagesAndThumbnail,
  updateProduct
);
productRouter.delete("/:id", deleteProduct);

module.exports = productRouter;
