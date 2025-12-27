"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-xl text-center bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6">{error?.message || "An unexpected error occurred."}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => reset()} className="bg-black text-white px-4 py-2 rounded">Retry</button>
          <Link href="/" className="px-4 py-2 rounded border">Home</Link>
        </div>
      </div>
    </div>
  );
}