"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        setProfile(res.data.profile);
      } catch (err) {
        console.log("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p className="p-10 text-center">Loading profile...</p>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Profile Not Completed</h2>
          <Link
            href="/profile/edit"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg"
          >
            Complete Your Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= HERO ================= */}
      <div className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
          <img
            src={
              profile.profileImage ||
              "https://via.placeholder.com/200x200/6b7280/FFFFFF?text=Profile"
            }
            className="w-40 h-40 rounded-full object-cover border-4 border-white"
          />

          <div>
            <h1 className="text-4xl font-bold">My Profile</h1>
            <p className="text-gray-300 mt-2">
              Manage your personal information
            </p>

            <Link
              href="/profile/edit"
              className="inline-block mt-4 bg-white text-black px-5 py-2 rounded-md font-medium"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* PERSONAL INFO */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

            <div className="space-y-3 text-sm">
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>City:</strong> {profile.city}</p>
              <p><strong>State:</strong> {profile.state}</p>
              <p><strong>Country:</strong> {profile.country}</p>
              <p><strong>Location:</strong> {profile.location}</p>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Address</h2>

            <p className="text-sm text-gray-700">
              {profile.address || "No address added"}
            </p>
          </div>

          {/* BIO */}
          <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">About You</h2>

            <p className="text-sm text-gray-700">
              {profile.bio || "No bio added yet"}
            </p>
          </div>

          {/* CATEGORIES */}
          <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Favorite Categories</h2>

            <p className="text-sm text-gray-700">
              {profile.categories && profile.categories.length > 0
                ? profile.categories.map(cat => cat.name).join(", ")
                : "No favorite categories selected"}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/orders"
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            View My Orders
          </Link>

          <Link
            href="/profile/edit"
            className="border border-black px-6 py-3 rounded-lg"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
