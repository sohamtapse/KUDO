"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-6 py-5 text-white">
        <Link href="/" className="text-2xl font-semibold ">
          KUDO
        </Link>

        <div className="hidden md:flex items-center space-x-10">
          <Link href="/" className="hover:opacity-80 transition">
            Home
          </Link>
          <Link href="/" className="hover:opacity-80 transition">
            Products
          </Link>
          <Link href="/" className="hover:opacity-80 transition">
            AboutUs
          </Link>
          <Link href="/" className="hover:opacity-80 transition">
            ContactUs
          </Link>
          <Link href="/dashboard" className="hover:opacity-80 transition">
            DashBoard
          </Link>
        </div>

        {/* Get in touch button */}
        <div className="hidden md:block">
          <Link
            href="/sign-in"
            className="px-5 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition flex items-center gap-2"
          >
            Sign-in →
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/10"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md text-white text-center space-y-3 py-6">
          <div className="flex flex-col justify-center items-center">
            <Link href="/" className="hover:opacity-80 transition">
              Home
            </Link>
            <Link href="/dashboard" className="hover:opacity-80 transition">
              DashBoard
            </Link>
            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="inline-block mt-4 px-5 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
            >
              Sign-Up →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
