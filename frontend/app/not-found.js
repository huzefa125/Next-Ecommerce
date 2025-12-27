import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-3">404</h1>
        <p className="text-gray-600 mb-6">We couldn't find that page.</p>
        <Link href="/" className="bg-black text-white px-4 py-2 rounded">Take me home</Link>
      </div>
    </div>
  );
}