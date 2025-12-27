"use client";

import Link from "next/link";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "@/context/Authcontext";
import getMediaUrl from "@/lib/media";
import {
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { getCart, removeCart } from "@/lib/cartApi";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const router = useRouter();

  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCartMenu, setShowCartMenu] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  /* ==========================
        REF FOR OUTSIDE CLICK
  ========================== */
  const cartRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setShowCartMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ==========================
        CART FETCH
  ========================== */
  useEffect(() => {
    if (user) {
      getCart()
        .then((res) =>
          setCartItems((res.data.items || []).filter((i) => i.product))
        )
        .catch(console.error);
    }
  }, [user]);

  /* ==========================
        SEARCH API CALL
  ========================== */
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 1) {
        api
          .get(`/products`)
          .then((res) => {
            const list = Array.isArray(res.data)
              ? res.data
              : res.data.products;

            const filtered = list.filter((p) =>
              p.name.toLowerCase().includes(query.toLowerCase())
            );

            setResults(filtered);
          })
          .catch(() => setResults([]));
      } else {
        setResults([]);
      }
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  /* ==========================
        REMOVE FROM CART
  ========================== */
  const handleRemove = async (productId) => {
    await removeCart(productId);
    setCartItems((prev) =>
      prev.filter((i) => i.product._id !== productId)
    );
  };

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/login";
  };

  /* ==========================
        ENTER PRESS → SEARCH PAGE
  ========================== */
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      router.push(`/products?search=${query}`);
      setShowSearch(false);
      setResults([]);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="hidden md:flex items-center gap-6 text-xs tracking-widest font-medium">
          <FiSearch
            className="cursor-pointer"
            onClick={() => setShowSearch(!showSearch)}
          />
          <Link href="/">HOME</Link>
          <Link href="/products">PRODUCTS</Link>
          <Link href="/categories">CATEGORIES</Link>
          <Link href="/offers">OFFERS</Link>
          <Link href="/about">ABOUT</Link>
        </div>

        {/* LOGO */}
        <Link href="/" className="text-3xl font-serif font-bold tracking-widest">
          BRAND
        </Link>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

            {/* MOBILE MENU */}
            <button
              className="md:hidden p-2"
              onClick={() => setShowMenu(!showMenu)}
              aria-label={showMenu ? "Close menu" : "Open menu"}
              title={showMenu ? "Close menu" : "Open menu"}
            >
              {showMenu ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            {/* LOGIN ICON */}
            {!user && (
              <Link href="/login" aria-label="Login" title="Login">
                <FiUser size={18} />
              </Link>
            )}

          {/* IF LOGGED IN */}
          {user && (
            <>
              {/* DESKTOP CART */}
              <div className="relative hidden md:block" ref={cartRef}>
                <button onClick={() => setShowCartMenu(!showCartMenu)} aria-label="Open cart" title="Open cart">
                  <FiShoppingBag size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] px-1.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>

                {showCartMenu && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow text-sm">
                    {cartItems.length === 0 ? (
                      <div className="p-4 text-center">Cart is empty</div>
                    ) : (
                      <>
                        {cartItems.map((item) => (
                          <div
                            key={item.product._id}
                            className="flex gap-3 p-3 border-b"
                          >
                            <img
                              src={
                                item.product.images?.[0]
                                  ? item.product.images[0].startsWith("http")
                                    ? item.product.images[0]
                                    : getMediaUrl(item.product.images[0])
                                  : "https://via.placeholder.com/50x50?text=No+Img"
                              }
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-xs text-gray-500">
                                ₹{item.product.price} × {item.qty}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemove(item.product._id)}
                              className="text-red-500 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <Link
                          href="/categories/cart"
                          className="block m-3 bg-black text-white text-center py-2 rounded"
                        >
                          View Cart
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* MOBILE CART */}
              <Link href="/categories/cart" className="md:hidden relative" aria-label="Open cart" title="Open cart">
                <FiShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] px-1.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* USER DROPDOWN */}
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1"
                >
                  <FiUser />
                  <FiChevronDown size={14} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-44 bg-white border rounded-xl shadow text-sm">
                    <Link href="/categories/profile" className="block px-4 py-2">
                      Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2">
                      Orders
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin" className="block px-4 py-2">
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= SEARCH BAR ================= */}
      {showSearch && (
        <div className="border-t bg-gray-50 relative">
          <div className="max-w-7xl mx-auto px-4 py-3 relative">
            <input
              placeholder="Search products..."
              className="w-full border px-4 py-2 rounded"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              aria-label="Search products"
            />

            {/* SEARCH RESULTS DROPDOWN */}
            {results.length > 0 && (
              <div className="absolute left-0 right-0 top-[60px] bg-white border rounded shadow-lg z-40">
                {results.slice(0, 6).map((item) => (
                  <div
                    key={item._id}
                    onClick={() => router.push(`/products/${item._id}`)}
                    className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                    role="button"
                    tabIndex={0}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {showMenu && (
        <div className="md:hidden bg-white border-t px-6 py-6 space-y-4 text-sm flex flex-col">
          <Link href="/" className="py-2">HOME</Link>
          <Link href="/products" className="py-2">PRODUCTS</Link>
          <Link href="/categories" className="py-2">CATEGORIES</Link>
          <Link href="/offers" className="py-2">OFFERS</Link>
          <Link href="/about" className="py-2">ABOUT</Link>
        </div>
      )}
    </nav>
  );
}
