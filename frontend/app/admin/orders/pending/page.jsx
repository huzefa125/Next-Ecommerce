"use client";

import { useEffect, useState, useContext } from "react";
import api from "@/lib/api";
import { AuthContext } from "@/context/Authcontext";
import { toast } from "sonner";

export default function PendingOrdersPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/admin");

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.orders || [];

        // Filter pending orders
        const pendingOrders = data.filter(order => order.status === 'pending');
        setOrders(pendingOrders);
      } catch (err) {
        console.error("Pending orders fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success("Order status updated");
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <p className="p-6 text-center">Loading pending orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-3">Pending Orders</h1>
        <p>No pending orders.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-lg p-5 mb-6 bg-white shadow-sm"
        >
          {/* HEADER */}
          <div className="flex flex-wrap justify-between gap-3 mb-3">
            <div>
              <p className="text-sm">
                <span className="font-semibold">Order ID:</span>{" "}
                <span className="text-gray-600">{order._id}</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold">User:</span>{" "}
                <span className="text-gray-600">{order.userId?.username || "N/A"} ({order.userId?.email || "N/A"})</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                disabled={updating === order._id}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* AMOUNT */}
          <div className="text-sm mb-2"> 
            <p><strong>Subtotal:</strong> ₹{order.subTotal}</p>
            {order.coupon && <p><strong>Coupon:</strong> {order.coupon}</p>}
            {order.discount > 0 && <p><strong>Discount:</strong> ₹{order.discount}</p>}
            <p><strong>Amount Paid:</strong> ₹{order.totalPaid}</p>
          </div>

          <p className="text-sm text-gray-600">
            Placed on: {new Date(order.createdAt).toLocaleString()}
          </p>

          {/* ITEMS */}
          <h3 className="font-semibold mt-4 mb-2">Items</h3>

          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={item._id || index}
                className="border rounded p-3 text-sm"
              >
                <p className="font-medium">
                  {item.productId?.name || "Product not available"}
                </p>

                <p>Qty: {item.quantity}</p>
                <p>Price (at purchase): ₹{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}