import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [orderItemSchema],

  shippingAddress: {
    name: String,
    phone: String,
    email: String,
    address: String,
    city: String,
    postalCode: String
  },

  totalPrice: Number,

  paymentMethod: String,     // COD, Esewa, Khalti, Card

  status: {
    type: String,
    default: "Pending"        // Pending, Paid, Delivered
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Order", orderSchema);
