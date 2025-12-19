"use client";

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/Authcontext";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

export default function EditProfile() {
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);

  const [form, setForm] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    bio: "",
    profileImage: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        if (res.data.profile) {
          setForm(res.data.profile);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadProfile();
  }, [user]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return router.push("/login");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      try {
        const res = await api.post("/upload/profile-image", {
          image: reader.result,
        });
        setForm({ ...form, profileImage: res.data.url });
      } catch {
        toast.error("Image upload failed");
      }
      setUploading(false);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await api.put("/profile", {
      ...form,
      completeProfile: true,
    });

    if (res.data.success) {
      toast.success("Profile updated");
      router.push("/profile");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Edit Your Profile
      </h1>

      {/* PROFILE IMAGE */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32">
          <Image
            src={form.profileImage || "/profile-placeholder.png"}
            fill
            className="rounded-full object-cover border"
            alt="Profile"
          />
        </div>

        <label className="mt-3 text-sm text-blue-600 cursor-pointer">
          Change Photo
          <input type="file" onChange={uploadImage} hidden />
        </label>

        {uploading && <p className="text-sm mt-2">Uploading...</p>}
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* PHONE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone Number
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Address
          </label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="House no, street, area"
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        {/* CITY + STATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              City
            </label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              State
            </label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full border px-4 py-2 rounded"
            />
          </div>
        </div>

        {/* COUNTRY */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Country
          </label>
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Country"
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        {/* BIO */}
        <div>
          <label className="block text-sm font-medium mb-1">
            About You
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell us something about you"
            className="w-full border px-4 py-2 rounded h-28"
          />
        </div>

        <button className="w-full bg-black text-white py-3 rounded text-lg">
          Save Profile
        </button>
      </form>
    </div>
  );
}
