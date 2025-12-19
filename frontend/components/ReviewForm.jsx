"use client";

import { useState, useContext } from "react";
import api from "@/lib/api";
import { AuthContext } from "@/context/Authcontext";
import { toast } from "sonner";

export default function ReviewForm({ productId, onSuccess }) {
  const { user, token } = useContext(AuthContext);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    if (!user) return toast.error("Please login first");

    try {
      const res = await api.post(
        "/reviews",
        { productId, rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Review added successfully!");
      setComment("");
      setRating(5);
      onSuccess(); // reload reviews
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="border p-4 rounded mt-10 bg-white">
      <h3 className="font-bold text-lg text-[#b23a1b]">Write a Review</h3>

      <select
        className="border p-2 mt-3"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      >
        <option value="5">⭐ 5</option>
        <option value="4">⭐ 4</option>
        <option value="3">⭐ 3</option>
        <option value="2">⭐ 2</option>
        <option value="1">⭐ 1</option>
      </select>

      <textarea
        className="border p-2 w-full mt-3"
        placeholder="Your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <button
        onClick={submitReview}
        className="mt-3 bg-[#b23a1b] text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </div>
  );
}
