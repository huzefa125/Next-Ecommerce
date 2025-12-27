"use client";

import { useEffect } from "react";
import { AuthProvider } from "@/context/Authcontext";

export default function Providers({ children }) {
  useEffect(() => {
    function onUnhandledRejection(e) {
      // Log details for debugging and prevent app-level crash
      // some libraries reject with undefined — capture that here
      // eslint-disable-next-line no-console
      console.error("Unhandled promise rejection:", e?.reason ?? e);
      // avoid default devtools handling that surfaces vague runtime errors
      if (e && typeof e.preventDefault === "function") e.preventDefault();
    }

    function onGlobalError(message, source, lineno, colno, error) {
      // eslint-disable-next-line no-console
      console.error("Global error:", { message, source, lineno, colno, error });
    }

    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("error", onGlobalError);

    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("error", onGlobalError);
    };
  }, []);

  return <AuthProvider>{children}</AuthProvider>;
}
