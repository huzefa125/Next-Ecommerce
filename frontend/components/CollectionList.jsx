"use client";

import Link from "next/link";
import getMediaUrl from "@/lib/media";

export default function Collections({ categories }) {
  return (
    <div className="bg-[#F8EEDC] py-10 px-4">
      <h1 className="text-center text-[#A33A22] text-3xl font-bold tracking-wide mb-8">
        COLLECTION LIST
      </h1>

      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <Link key={cat._id} href={`/categories/${cat.slug}`}>
            <div className="group cursor-pointer">

              {/* IMAGE */}
              <div className="overflow-hidden rounded-md">
                <img
                  src={
                    cat.image
                      ? cat.image.startsWith("http")
                        ? cat.image
                        : getMediaUrl(cat.image)
                      : "https://via.placeholder.com/300x200/10b981/ffffff?text=Category"
                  }
                  alt={cat.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* TITLE */}
              <h3 className="text-center mt-2 text-lg font-semibold text-[#A33A22]">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
