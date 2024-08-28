const { default: mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [3, "Category must be at least 3 characters"],
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

module.exports = new mongoose.model("Category", categorySchema);
