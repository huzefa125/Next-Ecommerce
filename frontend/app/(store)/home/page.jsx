"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getFeaturedProducts } from "@/lib/produttApi";
import Link from "next/link";
import CollectionList from "../../../components/CollectionList";
import Footer from "../../../components/Footer";
import GrabColor from "../../../components/GrabColor";
import FeaturedProduct from "../../../components/FeaturedProduct";
import ShopByMetal from "../../../components/ShopByMetal";
export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch featured products
  const fetchFeatured = async () => {
    try {
      const res = await getFeaturedProducts();
      const products = res.data.products || [];
      setFeatured(products.slice(0, 4)); // Show up to 4 featured products
    } catch (error) {
      console.error("Error fetching featured:", error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchFeatured();
    fetchCategories();
  }, []);

  return (
    <div className="bg-gray-50">

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative w-full h-[420px] sm:h-[460px] md:h-[520px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-700"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/25" />

        <div className="relative text-center text-white max-w-3xl px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide">
            Premium Steel & Utensils
          </h1>
          <p className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-200">
            Crafted for durability, designed for elegance.
          </p>

          <Link href="/products" aria-label="Shop our collection">
            <button className="mt-6 sm:mt-8 w-full sm:w-auto bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-gray-200 transition">
              Shop Collection
            </button>
          </Link>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      
      <CollectionList categories={categories} />
      <FeaturedProduct/>

      {/* ================= FEATURED PRODUCTS ================= */}
      
      <GrabColor/>
      <ShopByMetal />

      {/* ================= WHY CHOOSE US ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { title: "Premium Quality", desc: "Top-grade steel & materials" },
            { title: "Long Lasting", desc: "Built for everyday durability" },
            { title: "Trusted Brand", desc: "Thousands of happy customers" },
            { title: "Fast Delivery", desc: "Quick & safe shipping" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-gray-100 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Customers Say
        </h2>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            "Amazing quality! Totally worth the price.",
            "Steel utensils are super durable and stylish.",
            "Fast delivery and premium packaging.",
          ].map((text, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow">
              <p className="text-gray-600 italic">“{text}”</p>
              <p className="mt-4 font-semibold">— Verified Buyer</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-black text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold">
            Get Updates & Exclusive Offers
          </h2>
          <p className="mt-3 text-gray-300">
            Subscribe to our newsletter for latest deals.
          </p>

          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3 rounded-lg text-black w-full md:w-80"
            />
            <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}
