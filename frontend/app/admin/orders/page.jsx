"use client";

import { useEffect, useState, useContext } from "react";
import api from "@/lib/api";
import { AuthContext } from "@/context/Authcontext";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}`, { status });
      setOrders(prev =>
        prev.map(o => (o._id === orderId ? { ...o, status } : o))
      );
      toast.success("Order updated");
    } catch {
      toast.error("Failed to update order");
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/admin");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return <p className="p-6 text-center">Loading orders...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      {orders.length === 0 && (
        <p className="text-center text-gray-500">No orders found</p>
      )}

      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="bg-white border rounded-xl p-5 shadow-sm">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-medium">Order ID</p>
                <p className="text-sm text-gray-500">{order._id}</p>
                <p className="text-sm">
                  {order.userId?.username} ({order.userId?.email})
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs bg-yellow-100">
                  {order.status}
                </span>

                <select
                  value={order.status}
                  disabled={updating === order._id}
                  onChange={e => updateStatus(order._id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <p className="text-gray-500">Subtotal</p>
                <p>₹{order.subTotal}</p>
              </div>

              <div>
                <p className="text-gray-500">Discount</p>
                <p>₹{order.discount || 0}</p>
              </div>

              <div>
                <p className="text-gray-500">Coupon</p>
                <p>{order.coupon || "-"}</p>
              </div>

              <div>
                <p className="text-gray-500">Paid</p>
                <p className="font-bold text-green-600">
                  ₹{order.totalPaid}
                </p>
              </div>
            </div>

            {/* ITEMS */}
            <div className="border-t pt-4">
              <p className="font-semibold mb-3">Items</p>

              <div className="space-y-3">
                {order.items.map((item, index) => {
                  const image =
                    item.productId?.images?.[0]
                      ? item.productId.images[0].startsWith("http")
                        ? item.productId.images[0]
                        : `http://localhost:5000/${item.productId.images[0]}`
                      : "https://via.placeholder.com/80x80?text=No+Img";

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 border rounded-lg p-3"
                    >
                      <img
                        src={image}
                        className="w-16 h-16 object-cover rounded"
                        alt={item.productId?.name}
                      />

                      <div className="flex-1">
                        <p className="font-medium">
                          {item.productId?.name || "Product deleted"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>

                      <p className="font-medium">
                        ₹{item.quantity * item.price}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
