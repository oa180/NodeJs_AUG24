const User = require("../models/user.model");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const { sendEmail } = require("../utils/email");
const crypto = require("crypto");

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    res.status(200).json({
      message: "success",
      length: newUser.length,
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({ message: "fail", err: err.message });
  }
};

exports.getUsersList = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    message: "success",
    length: users.length,
    data: users,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const userExists = await User.findById(req.params.id);

  if (!userExists) return next(new AppError("user not found", 404));
  // if (!userExists) return next(new Error("User not found", 404));

  await User.findByIdAndDelete(req.params.id);
  res.status(204).json();
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // Get user by email
  const { email } = req.body;

  const userExists = await User.findOne({
    email,
  }).select("+password");
  if (!userExists)
    return res.status(200).json({
      status: "success",
    });

  // generate random token
  const resetToken = userExists.createPasswordResetToken();
  // await userExists.save({ validationBeforeSave: false });
  await userExists.save();
  // send email with token

  // http://localhost:3000/api
  const resetUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}/api/users/resetPassword/${resetToken}`;
  const mailOptions = {
    emilTo: email,
    emailSubject: "E-Commerce Reset password",
    message: `You are receiving this message because you have requested to reset your password, if not please ignore this message \n Click here to reset your password:\n${resetUrl}\nThis link is valid for 10 minutes.`,
  };
  try {
    await sendEmail(mailOptions);

    res.status(200).json({
      status: "success",
      message: "Mail Sent",
    });
  } catch (error) {
    res.status(200).json({
      status: "error",
      message: error.message,
    });
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get token from params
  const { token } = req.params;

  // 2) get user from token
  // 3) check if token is not expired
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log(hashedToken);

  const userExists = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiration: { $gt: Date.now() },
  });

  // 4) if so, set new password
  if (!userExists) {
    return next(new AppError("Token is invalid or expired", 400));
  }
  userExists.password = req.body.password;
  userExists.passwordResetToken = undefined;
  userExists.passwordResetTokenExpiration = undefined;
  // userExists.passwordChangedAt = Date.now();

  await userExists.save();
  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});
