"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const data = Array.isArray(res.data) ? res.data : res.data.categories || [];
        setCategories(data);
      } catch (err) {
        console.error("Fetch categories error:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO */}
      <section className="relative h-[320px] flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Shop by Category
          </h1>
          <p className="mt-3 text-gray-200">
            Discover our wide range of premium products
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No categories available at the moment.
            </p>
            <Link
              href="/products"
              className="inline-block mt-5 bg-black text-white px-6 py-3 rounded-lg"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                {categories.length} Categories
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                >
                  <div className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4">
                    <img
                      src={
                        category.image
                          ? category.image.startsWith("http")
                            ? category.image
                            : `http://localhost:5000/${category.image}`
                          : "https://via.placeholder.com/300x200/10b981/ffffff?text=Category"
                      }
                      className="w-full h-44 object-cover rounded-xl"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200/10b981/ffffff?text=Category";
                      }}
                    />
                    <h3 className="mt-3 font-semibold text-center">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
