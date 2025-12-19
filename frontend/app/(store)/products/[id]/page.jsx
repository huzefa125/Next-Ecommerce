"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { addTocart } from "@/lib/cartApi";
import { toast } from "sonner";
import { FiTruck, FiCheck, FiShield, FiPlus, FiMinus } from "react-icons/fi";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(null);

  /** ⭐ REVIEW STATES */
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [myReview, setMyReview] = useState(null); // Stores logged user's review

  // Fetch product + reviews
  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    const res = await api.get(`/products/${id}`);
    setProduct(res.data.product || res.data);
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data);

      /** Check if logged-in user already reviewed */
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userId = decoded.id;

      const existing = res.data.find((r) => r.userId?._id === userId);

      if (existing) {
        setMyReview(existing);
        setRating(existing.rating);
        setComment(existing.comment);
      }
    } catch (err) {
      console.log("Review fetch error", err);
    }
  };

  /** ⭐ Submit or Update Review */
  const submitReview = async () => {
    try {
      const payload = {
        productId: id,
        rating,
        comment,
      };

      if (myReview) {
        // UPDATE
        await api.put(`/reviews/${myReview._id}`, payload);
        toast.success("Review updated!");
      } else {
        // CREATE NEW
        await api.post("/reviews", payload);
        toast.success("Review added!");
      }

      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  if (!product) return <div className="p-10">Loading…</div>;

  const discount =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  const handleAdd = async () => {
    try {
      await addTocart(product._id, qty);
      toast.success("Added to cart");
      router.push("/categories/cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="bg-[#fbf3e8] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ================= PRODUCT TOP ================= */}
        <p className="text-sm text-[#b23a1b] mb-4">Home / {product.name}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          
          {/* LEFT IMAGES */}
          <div>
            <div className="border bg-white">
              <img
                src={
                  product.images[activeImg].startsWith("http")
                    ? product.images[activeImg]
                    : `http://localhost:5000/${product.images[activeImg]}`
                }
                className="w-full h-[520px] object-cover"
              />
            </div>

            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`border ${
                    activeImg === i ? "border-[#b23a1b]" : "border-gray-200"
                  }`}
                >
                  <img
                    src={
                      img.startsWith("http")
                        ? img
                        : `http://localhost:5000/${img}`
                    }
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT DETAILS */}
          <div className="text-[#b23a1b]">
            <h1 className="text-4xl font-bold">{product.name}</h1>

            {/* REVIEW SUMMARY */}
            <div className="flex items-center gap-2 mt-3 text-sm">
              ★★★★★ <span>({reviews.length} Reviews)</span>
            </div>

            {/* PRICE */}
            <div className="flex items-center gap-4 mt-5">
              <span className="text-3xl font-bold">
                ₹{product.price.toLocaleString()}
              </span>

              {product.mrp && (
                <>
                  <span className="line-through text-lg opacity-70">
                    ₹{product.mrp.toLocaleString()}
                  </span>
                  <span className="text-sm">{discount}% off</span>
                </>
              )}
            </div>

            {/* QTY */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex border">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2"
                >
                  <FiMinus />
                </button>
                <span className="px-5 py-2 border-x">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={qty >= product.stock}
                  className="px-4 py-2 disabled:opacity-50"
                >
                  <FiPlus />
                </button>
              </div>

              {qty >= product.stock && (
                <span className="text-red-500 text-sm">Max stock reached</span>
              )}
            </div>

            {/* ADD TO CART */}
            <button
              onClick={handleAdd}
              className="w-full mt-6 bg-[#b23a1b] text-white py-4 text-lg"
            >
              ADD TO CART
            </button>
          </div>
        </div>

        {/* ===========================================
              ⭐⭐⭐  REVIEW SECTION  ⭐⭐⭐
        ============================================ */}
        <div className="mt-16 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#b23a1b] mb-4">
            Customer Reviews
          </h2>

          {/* REVIEW FORM */}
          <div className="border p-4 rounded-lg mb-8">
            <h3 className="font-semibold mb-2">
              {myReview ? "Update Your Review" : "Write a Review"}
            </h3>

            <select
              className="border p-2 rounded"
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
              className="border p-2 mt-3 w-full rounded"
              placeholder="Your review…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              onClick={submitReview}
              className="mt-3 bg-[#b23a1b] text-white px-4 py-2 rounded"
            >
              {myReview ? "Update Review" : "Submit Review"}
            </button>
          </div>

          {/* DISPLAY REVIEWS */}
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="border-b py-4">
                <p className="text-yellow-600">⭐ {rev.rating}</p>
                <p className="font-medium">{rev.comment}</p>
                <p className="text-xs opacity-70">
                  by {rev.userId?.username || "User"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
