const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "User must have a first name"],
      minlength: [3, "User first name must be at least 3 characters"],
      maxlength: [15, "User first name must be less than 15 characters"],
      validate: [validator.isAlpha, "First name must contain alpha only"],
    },
    lastName: {
      type: String,
      required: [true, "User must have a last name"],
      minlength: [3, "User last name must be at least 3 characters"],
      maxlength: [15, "User last name must be less than 15 characters"],
      validate: {
        validator: function (val) {
          console.log(val);
          const locales = ["ar-AE", "en-US"];
          return locales.some((locale) =>
            validator.isAlpha(val, locale, { ignore: " " })
          );
        },
      },
      message: "First name must contain alpha only",
    },
    email: {
      type: String,
      required: [true, "User must have an email"],
      unique: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    username: {
      type: String,
      required: [true, "User must have a username"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User must have a password"],
      select: false,
      // minlength: [8, "Password must be at least 8 characters"],
      // validate: {
      //   validator: function (value) {
      //     return RegExp(
      //       /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-z]).{8,}$/
      //     ).test(value);
      //   },
      //   message:
      //     "Password must be at least 8 characters long and include at least one uppercase letter, one digit, and one special character",
      // },
    },
    phone: {
      type: String,
      required: [true, "User must have a phone number"],
      unique: true,
      validate: {
        validator: function (value) {
          return RegExp(/^01[0-2,5]{1}[0-9]{8}$/gm).test(value);
        },
        message: "Invalid phone number",
      },
      // validate: [
      //   function (value) {
      //     return RegExp(/^01[0-2,5]{1}[0-9]{8}$/gm).test(value);
      //   },
      //   "Invalid phone number",
      // ],
    },
    age: {
      type: Number,
      min: [16, "User must be at least 16 years old"],
      max: [100, "User must be less than 100 years old"],
    },
    profilePicture: {
      type: String,
    },
    // BOD: {
    //   type: Date,
    // },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be male, female or other",
      },
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "customer", "supplier"],
        message: "Role must be admin, customer, supplier ",
      },
      default: "customer",
    },
    passwordResetToken: String,
    passwordResetTokenExpiration: Date,
    passwordChangedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  console.log(!this.isModified(this.password));

  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 12);

  next();
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpiration = Date.now() + 10 * 60 * 1000;
  console.log(this.passwordResetToken, resetToken);

  return resetToken;
};
const User = new mongoose.model("User", userSchema);

module.exports = User;
