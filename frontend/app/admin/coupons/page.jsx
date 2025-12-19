"use client";

import { useEffect, useState, useContext } from "react";
import api from "@/lib/api";
import { AuthContext } from "@/context/Authcontext";
import { toast } from "sonner";

export default function CouponsPage() {
  const { user } = useContext(AuthContext);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderValue: "",
    maxDiscount: "",
    expiryDate: "",
    isActive: true,
  });

  useEffect(() => {
    if (!user) return;
    fetchCoupons();
  }, [user]);

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/coupons");
      setCoupons(res.data.coupons || []);
    } catch (err) {
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/coupons/${editing}`, form);
        toast.success("Coupon updated");
      } else {
        await api.post("/coupons/create", form);
        toast.success("Coupon created");
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const resetForm = () => {
    setForm({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderValue: "",
      maxDiscount: "",
      expiryDate: "",
      isActive: true,
    });
  };

  const editCoupon = (coupon) => {
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount || "",
      expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
      isActive: coupon.isActive,
    });
    setEditing(coupon._id);
    setShowForm(true);
  };

  const deleteCoupon = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Coupons</h1>
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Coupon
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="border p-4 mb-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              required
              className="border p-2"
            />
            <select
              value={form.discountType}
              onChange={(e) => setForm({ ...form, discountType: e.target.value })}
              className="border p-2"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
            <input
              type="number"
              placeholder="Discount Value"
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
              required
              className="border p-2"
            />
            <input
              type="number"
              placeholder="Min Order Value"
              value={form.minOrderValue}
              onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
              required
              className="border p-2"
            />
            <input
              type="number"
              placeholder="Max Discount (optional)"
              value={form.maxDiscount}
              onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
              className="border p-2"
            />
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              required
              className="border p-2"
            />
          </div>
          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active
          </label>
          <div className="mt-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mr-2">
              {editing ? "Update" : "Create"}
            </button>
            <button
              type="button" 
              onClick={() => {
                setShowForm(false);
                setEditing(null);
                resetForm();
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="border p-4 rounded">
            <h3 className="font-bold">{coupon.code}</h3>
            <p>Type: {coupon.discountType}</p>
            <p>Value: {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : '₹'}</p>
            <p>Min Order: ₹{coupon.minOrderValue}</p>
            {coupon.maxDiscount && <p>Max Discount: ₹{coupon.maxDiscount}</p>}
            <p>Expiry: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
            <p>Used: {coupon.usedCount} times</p>
            <p>Active: {coupon.isActive ? 'Yes' : 'No'}</p>
            <div className="mt-2">
              <button
                onClick={() => editCoupon(coupon)}
                className="bg-yellow-600 text-white px-3 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCoupon(coupon._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}