"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import getMediaUrl from "@/lib/media";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
      setError("");
    } catch (err) {
      console.error("Fetch categories error:", err);
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      if (image) {
        formData.append('image', image);
      }

      if (editing) {
        await api.put(`/categories/${editing._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setError("");
        toast.success("Category updated successfully!");
      } else {
        await api.post("/categories", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setError("");
        toast.success("Category created successfully!");
      }
      setForm({ name: "" });
      setImage(null);
      setImagePreview(null);
      setEditing(null);
      fetchCategories();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || "Error saving category");
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name });
    setImage(null);
    setImagePreview(cat.image ? getMediaUrl(cat.image) : null);
    setEditing(cat);
  };

  const handleCancel = () => {
    setForm({ name: "" });
    setImage(null);
    setImagePreview(null);
    setEditing(null);
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete category");
    }
  };

  if (loading) return <p className="p-10 text-center text-lg">Loading categories...</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage Categories</h1>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

      {/* Add/Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 border">
        <h2 className="text-2xl font-semibold mb-4">
          {editing ? "Edit Category" : "Add New Category"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Category Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-20 h-20 object-cover rounded"
              />
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold"
            >
              {editing ? "Update" : "Add"} Category
            </button>
            {editing && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold"
              >
                Cancel
              </button>
            )}
          </div> 
        </form>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div key={cat._id} className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition">
              {cat.image && (
                <img
                  src={getMediaUrl(cat.image)}
                  alt={cat.name}
                  className="w-full h-40 object-cover rounded mb-4"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div>
                <h3 className="text-xl font-semibold mb-2">{cat.name}</h3>
                <p className="text-gray-500 text-sm mb-4">Slug: {cat.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full py-8">No categories found. Create one to get started!</p>
        )}
      </div>
    </div>
  );
}