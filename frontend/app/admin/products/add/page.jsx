"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    featured: false,
  });

  const [categories, setCategories] = useState([]);

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Fetch categories error:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Preview images
    const imgPreview = files.map((file) => URL.createObjectURL(file));
    setPreview(imgPreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      toast.error("Please fill in all required fields: name, price, and category");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      data.append(key, form[key]); 
    });

    images.forEach((img) => data.append("images", img));

    try {
      await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product added successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error(`Error adding product: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Product Name */}
        <div>
          <label className="font-semibold">Product Name</label>
          <input
            type="text"
            name="name"
            className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            name="description"
            className="w-full mt-1 p-3 border rounded-lg h-28 focus:ring-2 focus:ring-blue-500"
            placeholder="Product description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Price + Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Price (₹)</label>
            <input
              type="number"
              name="price"
              className="w-full mt-1 p-3 border rounded-lg"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="font-semibold">Category</label>
            <select
              name="category"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="font-semibold">Stock</label>
          <input
            type="number"
            name="stock"
            className="w-full mt-1 p-3 border rounded-lg"
            placeholder="Available stock"
            value={form.stock}
            onChange={handleChange}
          />
        </div>

        {/* Featured */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={() => setForm({ ...form, featured: !form.featured })}
          />
          <span className="font-semibold">Mark as Featured Product ⭐</span>
        </label>

        {/* Image Upload */}
        <div>
          <label className="font-semibold">Product Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="mt-2"
          />

          {/* Image Preview */}
          <div className="grid grid-cols-3 gap-3 mt-3">
            {preview.map((src, idx) => (
              <img
                key={idx}
                src={src}
                className="w-full h-24 object-cover rounded-lg border"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}