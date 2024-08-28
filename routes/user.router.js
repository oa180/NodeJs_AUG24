const express = require("express");
const {
  createUser,
  getUsersList,
  deleteUser,
  forgetPassword,
  resetPassword,
} = require("../controllers/user.controller");

// Product routes
const userRouter = express.Router();

userRouter.route("/").post(createUser).get(getUsersList);
userRouter.route("/:id").delete(deleteUser);
userRouter.post("/forgetPassword", forgetPassword);
userRouter.patch("/resetPassword/:token", resetPassword);

module.exports = userRouter;
