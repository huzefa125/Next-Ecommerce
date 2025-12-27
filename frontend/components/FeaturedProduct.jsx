"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFeaturedProducts } from "../lib/produttApi.js";
import getMediaUrl from "@/lib/media";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getFeaturedProducts();
        setProducts(res.data.products || []);
      } catch (error) {
        console.error("Featured products error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading || !products.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">
          Featured Products
        </h2>
        <p className="text-gray-500 mt-3">
          Our premium coating & metal finishing work
        </p>
      </div>

      {/* HORIZONTAL SCROLL */}
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product.slug}`}
            className="min-w-[240px] md:min-w-[280px] max-w-[280px] bg-white rounded-2xl shadow hover:shadow-xl transition group snap-start"
          >
            {/* IMAGE */}
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden rounded-t-2xl">
              <img
                src={product.images?.[0] ? (product.images[0].startsWith('http') ? product.images[0] : getMediaUrl(product.images[0])) : undefined}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h3 className="text-lg font-semibold">
                {product.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {product.category?.name}
              </p>

              <p className="mt-3 font-medium">
                ₹{product.price.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
