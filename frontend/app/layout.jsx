import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}

          {/* 🔔 GLOBAL TOASTER */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={3500}
            toastOptions={{
              classNames: {
                toast:
                  "bg-white border border-gray-200 shadow-xl rounded-xl px-4 py-3 flex items-center gap-3",
                title: "text-sm font-semibold text-gray-900",
                description: "text-sm text-gray-600",
                actionButton:
                  "bg-black text-white px-3 py-1 rounded-md text-xs",
                cancelButton:
                  "bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-xs",
                closeButton:
                  "text-gray-500 hover:text-gray-900",
              },
            }}
          />

        </Providers>
      </body>
    </html>
  );
}
