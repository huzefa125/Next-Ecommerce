"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/Authcontext";
import { redirect } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

import {
  FiPackage,
  FiTag,
  FiShoppingBag,
  FiUsers,
  FiPlus,
} from "react-icons/fi";

export default function AdminDashboard() {
  const { user, loading } = useContext(AuthContext);
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchStats = async () => {
      try {
        const [products, categories, orders] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
          api.get("/orders/admin"),
        ]);

        setStats({
          products: products.data.length || 0,
          categories: categories.data.length || 0,
          orders: orders.data.orders?.length || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user.username}</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard icon={<FiPackage />} label="Products" value={stats.products} />
          <StatCard icon={<FiTag />} label="Categories" value={stats.categories} />
          <StatCard icon={<FiShoppingBag />} label="Orders" value={stats.orders} />
        </div>

        {/* QUICK ACTIONS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <QuickLink href="/admin/products/add" label="Add Product" />
            <QuickLink href="/admin/categories/add" label="Add Category" />
            <QuickLink href="/admin/coupons" label="Manage Coupons" />
          </div>
        </div>

        {/* MANAGEMENT */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ManageCard title="Products" links={[
              { label: "View Products", href: "/admin/products" },
            ]} />

            <ManageCard title="Orders" links={[
              { label: "View Orders", href: "/admin/orders" },
            ]} />

            <ManageCard title="Users" links={[
              { label: "View Users", href: "/admin/users" },
            ]} />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-5 rounded-lg border flex items-center gap-4">
    <div className="text-2xl text-gray-700">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const QuickLink = ({ href, label }) => (
  <Link
    href={href}
    className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded hover:opacity-90"
  >
    <FiPlus />
    {label}
  </Link>
);

const ManageCard = ({ title, links }) => (
  <div className="bg-white p-5 rounded-lg border">
    <h3 className="font-semibold mb-3">{title}</h3>
    <ul className="space-y-2 text-sm">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="text-blue-600 hover:underline">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
