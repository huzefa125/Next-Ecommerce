"use client";

import { FaInstagram, FaFacebook, FaYoutube, FaPinterest } from "react-icons/fa";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-[#BB6F1B] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* LEFT SECTION */}
        <div>
          <h2 className="text-2xl font-bold mb-4">BE A PART OF OUR COMMUNITY!</h2>

          <div className="flex items-center border border-white rounded-lg overflow-hidden w-full md:w-80">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 w-full bg-transparent text-white placeholder-white outline-none"
            />
            <button className="px-4 py-3 bg-white text-[#BB6F1B] font-bold">
              →
            </button>
          </div>

          <p className="mt-3 text-sm opacity-90">
            Be the first to hear about our latest promotions, new products and more.
          </p>

          <h3 className="mt-6 text-lg font-bold">OWNED BY</h3>
          <p className="text-sm mt-2 leading-6">
            Karshini Artysun Private Limited, Plot no. 249,  
            HSIIDC Alipur, Industrial Estate Barwala,  
            Barwala, Panchkula, Haryana–134118  
            GSTIN: 06AAKCK0953B1ZU
          </p>
        </div>

        {/* KNOW MORE */}
        <div>
          <h3 className="text-lg font-bold mb-4">KNOW MORE</h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link href="/about">About P•TAL</Link></li>
            <li>Become an affiliate</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h3 className="text-lg font-bold mb-4">HELP</h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Brass Care</li>
            <li>Kansa Care</li>
            <li>Copper Care</li>
            <li>Shipping</li>
            <li>Return/Exchange Request</li>
            <li>Grievance Redressal Mechanism</li>
          </ul>
        </div>
      </div>

      {/* LOGO & SOCIALS */}
      <div className="max-w-7xl mx-auto mt-12 border-t border-white/40 pt-6 flex flex-col md:flex-row items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" className="h-10 w-10" />
          <h1 className="text-3xl font-serif tracking-widest">P • TAL</h1>
        </div>

        {/* SOCIAL ICONS */}
        <div className="flex gap-5 text-2xl mt-5 md:mt-0">
          <FaInstagram className="cursor-pointer hover:opacity-80" />
          <FaFacebook className="cursor-pointer hover:opacity-80" />
          <FaYoutube className="cursor-pointer hover:opacity-80" />
          <FaPinterest className="cursor-pointer hover:opacity-80" />
        </div>
      </div>

      {/* POLICIES */}
      <div className="max-w-7xl mx-auto mt-6 flex flex-wrap justify-center gap-4 text-sm opacity-90">
        <span>© 2025 P•TAL All Rights Reserved</span> |
        <span>Privacy Policy</span> |
        <span>Terms of Service</span> |
        <span>Refund Policy</span> |
        <span>Shipping Policy</span>
      </div>
    </footer>
  );
}
