"use client";

import { useState, useEffect } from "react";

const metals = [
  {
    name: "BRASS",
    hindi: "पीतल",
    img1: "https://images.unsplash.com/photo-1603190287605-e7e0433e7c3b?auto=format&fit=crop&w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1563720223271-44ec6e52a3e5?auto=format&fit=crop&w=1200&q=80",
    bg: "#c57c1c",
  },
  {
    name: "COPPER",
    hindi: "तांबा",
    img1: "https://images.unsplash.com/photo-1602526216438-4785905a9d3f?auto=format&fit=crop&w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1598514982846-8a6f52c5ab07?auto=format&fit=crop&w=1200&q=80",
    bg: "#b2551a",
  },
  {
    name: "BRONZE",
    hindi: "कांसा",
    img1: "https://imgs.search.brave.com/yCl3AuzJKj6T0Dls6YhuMWVu8xOxYOsvYv9RBMGfEsU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzMxMi8zMTIveGlm/MHEvZGlubmVyLXNl/dC90L3QvbS9uby02/LWJyb256ZS1tYXR0/ZS1maW5pc2hlZC11/dGVuc2lscy1tYXN0/ZXJzLW9yaWdpbmFs/LWltYWdwZ3lxc3hn/anNwaHEuanBlZz9x/PTcwJmNyb3A9ZmFs/c2U",
    img2: "https://imgs.search.brave.com/xm9a3yvhxZQkHZrjU0AQQKpm5c5smknKtg0s1-AAdg0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzQwL2Zl/LzJlLzQwZmUyZTUx/OGU2Yjg0MDQwOWFk/MjMxM2Q2ODVlZTZk/LmpwZw",
    bg: "#8d5e2a",
  },
  {
    name: "STEEL",
    hindi: "स्टील",
    img1: "https://images.unsplash.com/photo-1581092162384-8987c1fe9c71?auto=format&fit=crop&w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    bg: "#b5b5b5",
  },
];

export default function ShopByMetal() {
  const [index, setIndex] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % metals.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const metal = metals[index];

  return (
    <div className="bg-[#fdf3e7] py-12">
      <h2 className="text-center text-3xl font-bold text-[#b23a1b] mb-10">
        SHOP BY METAL
      </h2>

      <div className="relative max-w-6xl mx-auto overflow-hidden rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3">

          {/* LEFT IMAGE */}
          <img
            src={metal.img1}
            className="w-full h-[350px] md:h-[420px] object-cover"
          />

          {/* CENTER TEXT */}
          <div
            className="flex flex-col justify-center items-center text-white p-6"
            style={{ backgroundColor: metal.bg }}
          >
            <h3 className="text-4xl font-bold">{metal.name}</h3>
            <p className="text-2xl mt-2 opacity-90">{metal.hindi}</p>
          </div>

          {/* RIGHT IMAGE */}
          <img
            src={metal.img2}
            className="w-full h-[350px] md:h-[420px] object-cover"
          />
        </div>
      </div>

      {/* Slider Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {metals.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              i === index ? "bg-[#b23a1b]" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
