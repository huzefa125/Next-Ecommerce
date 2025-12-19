"use client";

import React from "react";
import { FaTag } from "react-icons/fa";

const offers = [
  {
    id: 1,
    title: "50% OFF on Gold Plate",
    description: "Limited time offer — only for first 10 purchases!",
    code: "GOLD50",
    expiry: "2025-12-30",
    image:
      "https://images.pexels.com/photos/4109994/pexels-photo-4109994.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    title: "Buy 1 Get 1 Free",
    description: "Applicable on selected jewellery categories.",
    code: "BOGO",
    expiry: "2025-12-25",
    image:
      "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 3,
    title: "20% OFF on First Order",
    description: "Automatically applied during checkout.",
    code: "WELCOME20",
    expiry: "2026-01-01",
    image:
      "https://images.pexels.com/photos/1328545/pexels-photo-1328545.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

export default function OfferPage() {
  return (
    <div className="bg-[#FAF3E7] min-h-screen">

      {/* ✨ HERO SECTION */}
      <div className="relative h-[320px] w-full flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg?auto=compress&cs=tinysrgb&w=1200')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide">
            Exclusive Offers
          </h1>
          <p className="mt-3 text-gray-200 text-lg">
            Discover the best discounts crafted specially for you.
          </p>
        </div>
      </div>

      {/* OFFERS SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-16">

        <h2 className="text-3xl font-bold text-[#5A2F16] mb-10 tracking-wide">
          Today’s Top Deals
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-[#e8d7c3]"
            >
              {/* Offer Image */}
              <div className="h-52 w-full">
                <img
                  src={offer.image}
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
                />
              </div>

              {/* Offer Content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#5A2F16] flex items-center gap-2">
                  <FaTag className="text-[#BB6F1B]" /> {offer.title}
                </h2>

                <p className="mt-2 text-gray-700">{offer.description}</p>

                {/* Coupon Code */}
                <div className="mt-4">
                  <span className="text-sm font-semibold">Use Code:</span>
                  <span className="bg-[#BB6F1B] text-white px-3 py-1 ml-2 rounded-full text-sm shadow">
                    {offer.code}
                  </span>
                </div>

                {/* Expiry */}
                <p className="mt-3 text-sm text-gray-600">
                  Expires on: <b>{offer.expiry}</b>
                </p>

                {/* Button */}
                <button className="mt-5 w-full bg-[#5A2F16] text-white py-2 rounded-lg font-semibold hover:bg-[#3d1f0f] transition">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
