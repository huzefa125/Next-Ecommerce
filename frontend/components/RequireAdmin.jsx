"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/Authcontext";
import { useRouter } from "next/navigation";

export default function RequireAdmin({ children }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") router.push("/dashboard");
  }, [user]);

  return <>{children}</>;
}
