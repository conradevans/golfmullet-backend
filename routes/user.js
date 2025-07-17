const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// GET full user profile
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET cart for a user
router.get("/:userId/cart", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.cart || []);
  } catch (err) {
    console.error("Error fetching user cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET favorites for a user
router.get("/:userId/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favorites || []);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle favorite (add/remove)
router.post("/favorites", authMiddleware, async (req, res) => {
  const { userId, product } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const index = user.favorites.findIndex(
      (item) => item._id.toString() === product._id
    );

    if (index !== -1) {
      user.favorites.splice(index, 1); // remove from favorites
    } else {
      user.favorites.push(product); // add to favorites
    }

    await user.save();
    res.status(200).json(user.favorites);
  } catch (err) {
    console.error("Failed to toggle favorite:", err);
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
});

// Add to cart
router.post("/cart", authMiddleware, async (req, res) => {
  const { userId, product, size } = req.body;

  try {
    const user = await User.findById(userId);

    const existing = user.cart.find(
      (item) =>
        item._id && item._id.toString() === product._id && item.size === size
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      user.cart.push({ ...product, size, quantity: 1 });
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (err) {
    console.error("Failed to add to cart:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Remove from cart
router.delete("/cart/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { itemId, size } = req.body;

  try {
    const user = await User.findById(userId);
    user.cart = user.cart.filter(
      (item) => !(item._id?.toString() === itemId && item.size === size)
    );
    await user.save();
    res.status(200).json(user.cart);
  } catch (err) {
    console.error("Failed to remove from cart:", err);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

// Checkout (clear cart and log order)
router.delete("/cart/:userId/clear", authMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.cart.length > 0) {
      const newOrder = {
        id: user.orderHistory.length + 1,
        items: user.cart,
        purchasedAt: new Date(),
      };

      user.orderHistory.push(newOrder);
      user.cart = [];
      await user.save();
    }

    res.status(200).json({
      message: "Checkout successful",
      orderHistory: user.orderHistory,
    });
  } catch (err) {
    console.error("Checkout failed:", err);
    res.status(500).json({ error: "Failed to checkout" });
  }
});

// Update quantity in cart
router.put("/cart/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { itemId, size, quantity } = req.body;

  try {
    const user = await User.findById(userId);
    const cartItem = user.cart.find(
      (item) => item._id === itemId && item.size === size
    );

    if (cartItem) {
      cartItem.quantity = quantity;
      await user.save();
      return res.status(200).json(user.cart);
    }

    res.status(404).json({ error: "Item not found in cart" });
  } catch (err) {
    console.error("Failed to update quantity:", err);
    res.status(500).json({ error: "Failed to update cart quantity" });
  }
});

// Remove favorite
router.delete(
  "/:userId/favorites/:productId",
  authMiddleware,
  async (req, res) => {
    const { userId, productId } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.favorites = user.favorites.filter(
        (item) => item._id.toString() !== productId
      );

      await user.save();
      res.status(200).json(user.favorites);
    } catch (err) {
      console.error("Failed to remove favorite:", err);
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  }
);

module.exports = router;
