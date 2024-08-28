const { default: mongoose } = require("mongoose");
const Product = require("./product.model");

const reviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: [10, "Review must be at least 10 characters"],
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// reviewSchema.pre("save", async function (next) {
//   console.log(this);

//   const product = await Product.findById(this.productId);
//   console.log(product);

//   next();
// });

module.exports = new mongoose.model("Review", reviewSchema);
