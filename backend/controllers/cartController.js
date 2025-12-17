import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// GET USER CART
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart) {
      return res.json({ items: [] });
    }

    // Filter out items with null products (products that were deleted)
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(item => item.product);

    // Save the cart if items were removed
    if (cart.items.length !== originalLength) {
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to load cart" });
  }
};

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (qty > product.stock) {
      return res
        .status(400)
        .json({ message: "Quantity exceeds available stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, qty }],
      });
    } else {
      const existing = cart.items.find(
        (i) => i.product.toString() === productId
      );

      if (existing) {
        existing.qty = Math.min(existing.qty + qty, product.stock);
      } else {
        cart.items.push({ product: productId, qty });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// UPDATE QTY
export const updateQty = async (req, res) => {
  try {
    const { productId } = req.params;
    const { qty } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (qty < 1 || qty > product.stock) {
      return res
        .status(400)
        .json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item)
      return res.status(404).json({ message: "Item not found" });

    item.qty = qty;
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart" });
  }
};

// REMOVE ITEM
export const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};

// CLEAR CART
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
