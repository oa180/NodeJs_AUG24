const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      //   required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["new", "pending", "completed", "cancelled"],
        message: "Status can only be pending, completed or cancelled",
      },
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Order", orderSchema);
