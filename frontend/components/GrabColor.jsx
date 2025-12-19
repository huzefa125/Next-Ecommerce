"use client";
import Link from "next/link";

export default function GrabOurFavourites() {
  return (
    <section className="w-full bg-[#fbf3e8]">
      {/* HEADER STRIP */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl md:text-5xl font-bold tracking-wide text-[#b23a1b]">
          GRAB OUR FAVOURITES
        </h2>
      </div>

      {/* ================= CORE COLLECTION ================= */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[520px]">
        {/* LEFT TEXT */}
        <div className="bg-[#c47a1f] text-white flex flex-col justify-center px-10 md:px-20 py-20">
          <h3 className="text-4xl font-semibold mb-6">
            Core Collection
          </h3>
          <p className="text-lg leading-relaxed max-w-md mb-10">
            Chef-Approved, Culture-Backed. Handpicked essentials trusted
            by culinary experts and rooted in tradition.
          </p>

          <Link href="/products">
            <button className="w-fit bg-[#fbf3e8] text-[#b23a1b] px-8 py-3 font-semibold rounded-md hover:opacity-90 transition">
              SHOP NOW
            </button>
          </Link>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full h-[520px]">
          <img
            src="/1.webp"
            alt="Core Collection"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ================= TRADITIONAL COLLECTION ================= */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[520px]">
        {/* LEFT IMAGE */}
        <div className="w-full h-[520px]">
          <img
            src="/2.webp"
            alt="Traditional Collection"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT TEXT */}
        <div className="bg-[#c47a1f] text-white flex flex-col justify-center px-10 md:px-20 py-20">
          <h3 className="text-4xl font-semibold mb-6">
            Traditional Collection
          </h3>
          <p className="text-lg leading-relaxed max-w-md mb-10">
            Time-honored designs that bring warmth, meaning, and
            function to your everyday rituals.
          </p>

          <Link href="/products">
            <button className="w-fit bg-[#fbf3e8] text-[#b23a1b] px-8 py-3 font-semibold rounded-md hover:opacity-90 transition">
              SHOP NOW
            </button>
          </Link>
        </div>
      </div>

      {/* ================= WEDDING COLLECTION ================= */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 min-h-[520px]">
        {/* LEFT TEXT */}
        <div className="bg-[#c47a1f] text-white flex flex-col justify-center px-10 md:px-20 py-20">
          <h3 className="text-4xl font-semibold mb-6">
            Wedding Collection
          </h3>
          <p className="text-lg leading-relaxed max-w-md mb-10">
            Celebrate new beginnings with timeless heirlooms;
            gifts that shine with the promise of forever.
          </p>

          <Link href="/products">
            <button className="w-fit bg-[#fbf3e8] text-[#b23a1b] px-8 py-3 font-semibold rounded-md hover:opacity-90 transition">
              SHOP NOW
            </button>
          </Link>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full h-[520px]">
          <img
            src="/3.webp"
            alt="Wedding Collection"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
