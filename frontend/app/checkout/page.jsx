"use client";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/Authcontext";
import api from "@/lib/api";
import { getCart, clearCart } from "@/lib/cartApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  // 🔥 Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");  
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    getCart()
      .then((res) => {
        setCart(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, router]);

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (!user) return null;

  const validItems = cart.items.filter((item) => item.product);

  if (validItems.length === 0) {
    return (
      <div className="p-10 text-center">
        <p>Your cart is empty.</p>
        <a href="/products" className="text-blue-600">
          Continue shopping
        </a>
      </div>
    );
  }

  const total = validItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  // ✅ Apply Coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Enter coupon code");
      return;
    }

    setApplying(true);
    try {
      const res = await api.post("/coupons", {
        code: couponCode,
        cartTotal: total,
      });

      setDiscount(res.data.discount);
      setFinalTotal(res.data.finalAmount);
      setAppliedCoupon(couponCode.toUpperCase());

      toast.success(`Coupon applied: ${res.data.coupon}`);
    } catch (err) {
      setDiscount(0);
      setFinalTotal(0);
      setAppliedCoupon("");
      toast.error(err.response?.data?.message || "Invalid coupon");
    } finally {
      setApplying(false);
    }
  };

  // ✅ Place Order
  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const items = validItems.map((item) => ({
        productId: item.product._id,
        quantity: item.qty,
        price: item.product.price,
      }));

      await api.post("/orders", {
        items,
        couponCode: appliedCoupon || null,
      });

      await clearCart();

      toast.success("Order placed successfully!");
      router.push("/orders");
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ORDER SUMMARY */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {validItems.map((item) => (
            <div key={item.product._id} className="flex gap-4 border-b pb-4 mb-4">
              <img
                src={
                  item.product.images?.[0]
                    ? item.product.images[0]
                    : "https://via.placeholder.com/64"
                }
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-gray-600">
                  ₹{item.product.price} × {item.qty}
                </p>
              </div>
              <p className="font-semibold">
                ₹{item.product.price * item.qty}
              </p>
            </div>
          ))}

          {/* COUPON SECTION */}
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Apply Coupon</h3>
            
            {appliedCoupon ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded mb-2">
                <p className="text-green-700 text-sm">
                  ✅ Coupon "{appliedCoupon}" applied successfully!
                </p>
                <button
                  onClick={() => {
                    setAppliedCoupon("");
                    setDiscount(0);
                    setFinalTotal(0);
                    setCouponCode("");
                  }}
                  className="text-red-600 text-sm underline mt-1"
                >
                  Remove Coupon
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="border px-3 py-2 flex-1 rounded"
                />
                <button
                  onClick={applyCoupon}
                  disabled={applying}
                  className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {applying ? "Applying..." : "Apply"}
                </button>
              </div>
            )}
          </div>

          {/* TOTAL */}
          <div className="mt-6 border-t pt-4 space-y-2">
            <p>Subtotal: ₹{total}</p>
            {discount > 0 && <p className="text-green-600">Discount: -₹{discount}</p>}
            <p className="text-xl font-bold">
              Total: ₹{finalTotal > 0 ? finalTotal : total}
            </p>
          </div>
        </div>

        {/* PLACE ORDER */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Place Order</h2>
          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="w-full bg-black text-white py-3 rounded font-semibold disabled:opacity-50"
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
