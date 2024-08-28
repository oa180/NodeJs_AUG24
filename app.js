const express = require("express");
const morgan = require("morgan");
const productRouter = require("./routes/product.router");
const userRouter = require("./routes/user.router");
const reviewRouter = require("./routes/review.router");
const categoryRouter = require("./routes/category.router");
const orderRouter = require("./routes/order.router");
const Product = require("./models/product.model");
const authRouter = require("./routes/auth.router");
const cartRouter = require("./routes/cart.router");
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
// app.use((req, res, next) => {
//   console.log(req.headers);

//   next();
// });
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/category", categoryRouter);
app.use("/api/order", orderRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);

// Default router
app.use("*", (req, res, next) => {
  res.status(404).json({
    message: `Cannot find ${req.originalUrl} on this server`,
  });
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({ status: err.status, err: err.message });
});

// app.use((data, req, res, next) => {
//   console.log("2-", data);
//   next();
// });

// app.use((req, res, next) => {
//   console.log("I am in normal middleware");
// });
module.exports = app;
