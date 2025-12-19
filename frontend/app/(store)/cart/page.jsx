"use client";

import { useEffect, useState } from "react";
import { getCart, removeCart, updateCart } from "@/lib/cartApi";
import { FiTrash, FiPlus, FiMinus } from "react-icons/fi";
import Link from "next/link";
import api from "@/lib/api";

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  // 🔖 Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
      setFinalAmount(calculateTotal(res.data.items));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = (items) => {
    return items
      .filter((i) => i.product)
      .reduce((sum, i) => sum + i.product.price * i.qty, 0);
  };

  const updateQtyHandler = async (productId, qty, stock) => {
    if (qty < 1 || qty > stock) return;

    try {
      await updateCart(productId, qty);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    await removeCart(productId);
    fetchCart();
  };


  // =====================
  // APPLY COUPON
  // =====================
  const applyCoupon = async () => {
    try {
      setCouponMsg("");
      const total = calculateTotal(cart.items);

      const res = await api.post("/coupons", {
        code: couponCode,
        cartTotal: total,
      });

      setDiscount(res.data.discount);
      setFinalAmount(res.data.finalAmount);
      setCouponMsg(`✅ Coupon "${res.data.coupon}" applied successfully`);
    } catch (err) {
      setDiscount(0);
      setFinalAmount(calculateTotal(cart.items));
      setCouponMsg(
        err.response?.data?.message || "Coupon apply failed"
      );
    }
  };

  if (loading) return <p className="p-10 text-center">Loading cart...</p>;

  const validItems = cart.items.filter((item) => item.product);
  const totalItems = validItems.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = calculateTotal(validItems);

  if (validItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty 🛒</h1>
        <Link
          href="/products"
          className="inline-block bg-black text-white px-6 py-3 rounded"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {/* CART ITEMS */}
      <div className="space-y-6">
        {validItems.map(({ product, qty }) => (
          <div
            key={product._id}
            className="flex items-center gap-6 border rounded-lg p-4"
          >
            <img
              src={
                product.images?.[0]
                  ? product.images[0]
                  : "https://via.placeholder.com/100x100"
              }
              className="w-24 h-24 object-cover rounded"
            />

            <div className="flex-1">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">₹{product.price}</p>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() =>
                    updateQtyHandler(product._id, qty - 1, product.stock)
                  }
                  disabled={qty <= 1}
                  className="p-2 border rounded"
                >
                  <FiMinus />
                </button>

                <span className="px-3 font-semibold">{qty}</span>

                <button
                  onClick={() =>
                    updateQtyHandler(product._id, qty + 1, product.stock)
                  }
                  disabled={qty >= product.stock}
                  className="p-2 border rounded"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                ₹{product.price * qty}
              </p>
              <button
                onClick={() => removeItem(product._id)}
                className="text-red-500 mt-2"
              >
                <FiTrash />
              </button>
            </div>
          </div>
        ))}
      </div>


      {/* COUPON SECTION */}
      <div className="mt-8 border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Apply Coupon</h3>
        <div className="flex gap-3">
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="border px-3 py-2 flex-1 rounded"
          />
          <button
            onClick={applyCoupon}
            className="bg-black text-white px-6 rounded"
          >
            Apply
          </button>
        </div>
        {couponMsg && (
          <p className="mt-2 text-sm">{couponMsg}</p>
        )}
      </div>

      {/* SUMMARY */}
      <div className="mt-10 border-t pt-6 flex justify-between items-center">
        <div>
          <p>Total Items: {totalItems}</p>
          <p>Subtotal: ₹{totalPrice}</p>
          <p className="text-green-600">Discount: -₹{discount}</p>
          <p className="text-2xl font-bold">
            Final Total: ₹{finalAmount || totalPrice}
          </p>
        </div>

        <Link
          href="/checkout"
          className="bg-black text-white px-6 py-3 rounded text-lg"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
