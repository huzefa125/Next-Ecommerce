"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/Authcontext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/login");
      else if (user.role === "admin") router.replace("/admin");
    }
  }, [loading, user, router]);

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome {user.username}!</p>
    </div>
  );
}
