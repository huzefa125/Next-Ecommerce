"use client";

import { useEffect, useState, useContext } from "react";
import api from "@/lib/api";
import { AuthContext } from "@/context/Authcontext";

export default function UsersPage() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth");

        // Safe response handling
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.users || [];

        setUsers(data);
      } catch (err) {
        console.error("Users fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  if (loading) {
    return <p className="p-6 text-center">Loading users...</p>;
  }

  if (users.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-3">All Users</h1>
        <p>No users found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>

      <div className="grid gap-4">
        {users.map((u) => (
          <div
            key={u._id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <p className="font-semibold">Username: {u.username}</p>
            <p>Email: {u.email}</p>
            <p>Role: {u.role}</p>
            <p>Joined: {new Date(u.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}