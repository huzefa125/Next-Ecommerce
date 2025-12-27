"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import getMediaUrl from "@/lib/media";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("none");

  const [page, setPage] = useState(1);
  const perPage = 9;

  // ===============================
  // FETCH PRODUCTS
  // ===============================
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");

      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (Array.isArray(res.data.products)) data = res.data.products;
      else if (Array.isArray(res.data.product)) data = res.data.product;

      setProducts(data);
      setFiltered(data);
    } catch (err) {
      console.error("Product fetch error:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Category fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ===============================
  // FILTER / SORT
  // ===============================
  useEffect(() => {
    let data = [...products];

    if (search.trim()) {
      data = data.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      data = data.filter((p) => p.category?.slug === category);
    }

    if (minPrice) data = data.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) data = data.filter((p) => p.price <= Number(maxPrice));

    if (sort === "low-high") data.sort((a, b) => a.price - b.price);
    if (sort === "high-low") data.sort((a, b) => b.price - a.price);

    setFiltered(data);
    setPage(1);
  }, [search, category, minPrice, maxPrice, sort, products]);

  // ===============================
  // PAGINATION
  // ===============================
  const startIndex = (page - 1) * perPage;
  const paginatedData = filtered.slice(startIndex, startIndex + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="bg-[#fbf3e8] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ================= TOP BAR ================= */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <button className="border border-[#b23a1b] text-[#b23a1b] px-6 py-2 rounded-md text-sm">
            ☰ Filter
          </button>

          <p className="text-[#b23a1b] font-medium">
            {filtered.length} products
          </p>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-[#b23a1b] text-[#b23a1b] px-4 py-2 rounded-md bg-transparent"
          >
            <option value="none">Alphabetically, A–Z</option>
            <option value="low-high">Price: Low → High</option>
            <option value="high-low">Price: High → Low</option>
          </select>
        </div>

        {/* ================= PRODUCT GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {paginatedData.length === 0 && (
            <p className="col-span-full text-center text-[#b23a1b]">
              No products found
            </p>
          )}

          {paginatedData.map((p) => {
            const discount =
              p.mrp && p.mrp > p.price
                ? Math.round(((p.mrp - p.price) / p.mrp) * 100)
                : null;

            const avg = p.averageRating || 5;
            const count = p.reviewsCount || 0;

            return (
              <div key={p._id} className="group">

                {/* IMAGE */}
                <div className="relative overflow-hidden bg-white">
                  {discount && (
                    <span className="absolute top-3 right-3 bg-[#b23a1b] text-white text-xs px-2 py-1">
                      {discount}% off
                    </span>
                  )}

                  <img
                    src={
                      p.images?.length
                        ? p.images[0].startsWith("http")
                          ? p.images[0]
                          : getMediaUrl(p.images[0])
                        : "https://images.unsplash.com/photo-1603899124506-d55f65f8c52b"
                    }
                    alt={p.name}
                    className="w-full h-[320px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* CONTENT */}
                <div className="pt-4 space-y-2">
                  {/* ⭐ Updated Review Summary */}
                  <div className="flex items-center gap-2 text-[#b23a1b] text-sm">
                    ⭐ {avg.toFixed(1)}
                    <span className="text-xs">({count} reviews)</span>
                  </div>

                  <h3 className="text-sm uppercase tracking-wide text-[#b23a1b]">
                    {p.name}
                  </h3>

                  {/* PRICE */}
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-[#b23a1b]">
                      ₹{Number(p.price || 0).toLocaleString()}
                    </span>

                    {p.mrp && (
                      <span className="text-sm line-through text-[#b23a1b]/60">
                        ₹{Number(p.mrp).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <Link href={`/products/${p._id}`}>
                    <button className="w-full mt-3 bg-[#b23a1b] text-white py-3 text-sm tracking-wide hover:opacity-90 transition">
                      VIEW DETAILS
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-14">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 border ${
                  page === i + 1
                    ? "bg-[#b23a1b] text-white"
                    : "border-[#b23a1b] text-[#b23a1b]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
