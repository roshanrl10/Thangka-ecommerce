import User from "../model/User.model.js";
import Order from "../model/Order.model.js";

// 1️⃣ Place Order (Cash on Delivery)
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, shippingAddress } = req.body;

    const user = await User.findById(userId).populate("cart.productId");
    if (!user) return res.json({ message: "User not found" });

    // Calculate total
    let total = 0;
    user.cart.forEach(item => {
      total += item.productId.price * item.quantity;
    });

    // Create order
    const order = new Order({
      userId,
      items: user.cart.map(i => ({
        productId: i.productId._id,
        quantity: i.quantity
      })),
      shippingAddress,
      totalPrice: total,
      paymentMethod: "Cash On Delivery",
      status: "Pending"
    });

    await order.save();

    // Clear cart
    user.cart = [];
    await user.save();

    res.json({ message: "Order placed successfully", orderId: order._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2️⃣ Online Payment Verification (Esewa / Khalti / Card)
export const verifyPayment = async (req, res) => {
  try {
    const { userId, shippingAddress, paymentMethod } = req.body;

    const user = await User.findById(userId).populate("cart.productId");

    // Calculate total
    let total = 0;
    user.cart.forEach(item => {
      total += item.productId.price * item.quantity;
    });

    // Create order
    const order = new Order({
      userId,
      items: user.cart.map(i => ({
        productId: i.productId._id,
        quantity: i.quantity
      })),
      shippingAddress,
      totalPrice: total,
      paymentMethod,
      status: "Paid"
    });

    await order.save();

    // Clear cart after payment
    user.cart = [];
    await user.save();

    res.json({
      message: "Payment verified & order placed",
      orderId: order._id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3️⃣ Order History for user
export const getOrdersForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).populate("items.productId");

    res.json({ orders });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
