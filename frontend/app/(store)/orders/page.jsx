"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useContext } from "react";
import { AuthContext } from "@/context/Authcontext";

export default function OrdersPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    api
      .get("/orders")
      .then((res) => {
        setOrders(res.data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return <p className="p-6">Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">My Orders</h1>
        <p>You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="border p-4 mb-4 rounded">
          <h2 className="font-semibold">
            Order ID:{" "}
            <span className="text-gray-600">{order._id}</span>
          </h2>

          <p>
            <strong>Status:</strong> {order.status}
          </p>
          
          {order.coupon && (
            <p>
              <strong>Coupon:</strong> {order.coupon}
            </p>
          )}
          
          <p>
            <strong>Subtotal:</strong> ₹{order.subTotal}
          </p>
          
          {order.discount > 0 && (
            <p>
              <strong>Discount:</strong> -₹{order.discount}
            </p>
          )}
          
          <p>
            <strong>Total Paid:</strong> ₹{order.totalPaid}
          </p>
          <p>
            <strong>Placed On:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>

          <h3 className="font-semibold mt-3">Items:</h3>

          <ul>
            {order.items.map((item) => (
              <li key={item._id} className="ml-4">
                Product: {item.productId ? item.productId.name : "Product not available"}{" "}
                <br />
                Quantity: {item.quantity}
                <br />
                Price: ₹{item.price}
                <br />
                <hr className="my-2" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}