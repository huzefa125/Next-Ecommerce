"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ReviewList({ productId, reload }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get(`/reviews/${productId}`).then((res) => {
      setReviews(res.data);
    });
  }, [productId, reload]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-[#b23a1b]">Customer Reviews</h3>

      {reviews.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">No reviews yet.</p>
      )}

      {reviews.map((rev) => (
        <div
          key={rev._id}
          className="border p-4 rounded mt-3 bg-white shadow-sm"
        >
          <p className="font-semibold">⭐ {rev.rating}</p>
          <p className="mt-1">{rev.comment}</p>
          <p className="text-xs text-gray-500 mt-2">
            By: {rev.userId?.username || "User"}
          </p>
        </div>
      ))}
    </div>
  );
}
