import User from "../model/User.model.js";
import Product from "../model/Product.model.js";

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product) return res.json({ message: "Product not found" });

    // check if item already exists in cart
    const item = user.cart.find((item) => item.productId == productId);

    if (item) {
      item.quantity += 1; // increase quantity
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    await user.save();

    res.json({ message: "Added to cart", cart: user.cart });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.json({ message: "User not found" });

    user.cart = user.cart.filter(item => item.productId != productId);

    await user.save();

    res.json({ message: "Item removed", cart: user.cart });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// decrease item qty
export const decreaseQty = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const user = await User.findById(userId);

    const item = user.cart.find(item => item.productId == productId);

    if (!item) return res.json({ message: "Item not in cart" });

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      user.cart = user.cart.filter(item => item.productId != productId);
    }

    await user.save();
    res.json({ message: "Updated cart", cart: user.cart });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get user cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("cart.productId");

    res.json({ cart: user.cart });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
