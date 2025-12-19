"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function CategoryViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    // Special case for profile or cart
    if (id === "profile") {
      router.push("/profile");
      return;
    }
    if (id === "cart") {
      router.push("/cart");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Category ID:", id);

        // ✅ CATEGORY
        const catRes = await api.get(`/categories/${id}`);
        const categoryData = catRes.data.category || catRes.data;
        setCategory(categoryData);

        // ✅ PRODUCTS
        const prodRes = await api.get(`/products?category=${id}`);
        const productData =
          prodRes.data.products ||
          prodRes.data.product ||
          prodRes.data ||
          [];

        setProducts(Array.isArray(productData) ? productData : []);
      } catch (err) {
        console.error("Category view error:", err);
        if (err.response && err.response.status === 404) {
          setError("Category not found");
        } else {
          setError("Failed to load category");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/categories" className="underline">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  /* ================= CATEGORY NOT FOUND ================= */
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold mb-3">Category Not Found</h2>
          <Link href="/categories" className="underline">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section
        className="relative h-[320px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            category.image
              ? category.image.startsWith("http")
                ? category.image
                : `http://localhost:5000/${category.image}`
              : "linear-gradient(to right, #10b981, #3b82f6)"
          })`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            {category.name}
          </h1>
          <p className="mt-3 text-gray-200">
            Explore our premium {category.name?.toLowerCase()} collection
          </p>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No products found in this category.
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
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {products.length} Products
              </h2>
              <Link href="/categories" className="text-sm underline">
                ← Back to Categories
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                >
                  <div className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4">
                    <img
                      src={
                        product.images?.length
                          ? product.images[0].startsWith("http")
                            ? product.images[0]
                            : `http://localhost:5000/${product.images[0]}`
                          : "https://via.placeholder.com/300x200/6b7280/ffffff?text=No+Image"
                      }
                      className="w-full h-44 object-cover rounded-xl"
                    />
                    <h3 className="mt-3 font-semibold">{product.name}</h3>
                    <p className="text-gray-500 text-sm">
                      ₹{product.price}
                    </p>
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
