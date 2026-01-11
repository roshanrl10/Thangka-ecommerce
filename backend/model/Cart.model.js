import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  cart: [cartItemSchema]
});

export default mongoose.model("User", userSchema);
