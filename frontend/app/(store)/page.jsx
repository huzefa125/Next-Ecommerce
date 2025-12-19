"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/Authcontext";
import HomePage from "./home/page";

export default function Home() {
  const auth = useContext(AuthContext);

  // 🛑 SAFE GUARD
  if (!auth || auth.loading) {
    return <div className="p-10">Loading...</div>;
  }

  const { user } = auth;

  return (
    <div className="min-h-screen bg-gray-50">
      <HomePage />
    </div>
  );
}
