import Order from "../model/Order.model.js";
import User from "../model/User.model.js";

// Make sure paths are correct. The provided user context showed models in ../model/ not ../models/

// 0️⃣ Create Order
export const createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, totalPrice, paymentMethod } = req.body;
    console.log("createOrder Request Body:", JSON.stringify(req.body, null, 2));

    const newOrder = new Order({
      userId,
      items,
      shippingAddress,
      totalPrice,
      paymentMethod,
      status: 'Pending'
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 1️⃣ Order Success - fetch single order by orderId
export const getOrderSuccess = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({
      message: "Order retrieved successfully",
      order
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 2️⃣ Order History - fetch all orders for a user
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

export const getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).populate("items.productId");

    res.json({
      message: "Order history retrieved successfully",
      orders
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
