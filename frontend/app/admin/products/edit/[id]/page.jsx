"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import getMediaUrl from "@/lib/media";
import { toast } from "sonner";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    featured: false,
    images: [],
  });

  const [newImages, setNewImages] = useState([]); // ✅ FIXED
  const [categories, setCategories] = useState([]);

  // =============================
  //  📌 Fetch product details
  // =============================
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const p = res.data;

      setForm({
        name: p.name || "",
        description: p.description || "",
        price: p.price || "",
        category: p.category?._id || "",
        stock: p.stock || "",
        featured: p.featured || false,
        images: p.images || [],
      });
    } catch (error) {
      console.error("FETCH PRODUCT ERROR:", error);
      toast.error("Failed to load product");
    }
  };

  // =============================
  //  📌 Fetch categories
  // =============================
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
    fetchCategories();
  }, [id]);

  // =============================
  //  📌 Handle input
  // =============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =============================
  //  📌 Handle new images upload
  // =============================
  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  // =============================
  //  📌 Submit updated product
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append form fields (except images)
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "images") data.append(key, value);
    });

    // Append new uploaded images
    if (newImages.length > 0) {
      newImages.forEach((img) => data.append("images", img));
    }

    try {
      await api.put(`/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully!");
      router.push("/admin/products");

    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        ✏️ Edit Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Name */}
          <div>
            <label className="font-semibold">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input w-full"
            />
          </div>

          {/* Price */}
          <div>
            <label className="font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="input w-full"
            />
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="font-semibold">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="input w-full h-28"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={() =>
              setForm({ ...form, featured: !form.featured })
            }
            className="w-5 h-5"
          />
          <span className="font-semibold">Featured Product</span>
        </div>

        {/* Existing Images */}
        <div>
          <label className="font-semibold">Existing Images</label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-2">
            {form.images.map((img, i) => (
              <img
                key={i}
                src={img.startsWith("http") ? img : getMediaUrl(img)}
                className="w-full h-28 object-cover rounded border"
                onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=No+Image"; }}
              />
            ))}
          </div>
        </div>

        {/* Upload new images */}
        <div>
          <label className="font-semibold">Upload New Images</label>
          <input type="file" multiple onChange={handleImageChange} />
        </div>

        {/* Save Button */}
        <button className="bg-blue-600 px-6 py-3 rounded-lg text-white text-lg">
          💾 Save Changes
        </button>
      </form>
    </div>
  );
}
