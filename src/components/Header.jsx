import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/imgs/logo.jpg"; // <-- replace with your actual logo path

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Sell My Car", path: "/sell" },
    { name: "Buy a Car", path: "/buy" },
    { name: "Finance & Services", path: "/finance" },
    { name: "Our Locations", path: "/locations" },
    { name: "About", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Investors", path: "/investors" },
  ];

  return (
    <header className="w-full bg-white text-gray-800 border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Left side: Logo */}
        <div className="flex items-center gap-3">
          <img
            src={Logo}
            alt="MetroShuttle Logo"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-xl font-extrabold text-gray-900 tracking-wide">
            metro<span className="text-[#ff6b00]">shuttle.co.za</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="hover:text-[#ff6b00] transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/signup"
            className="text-[#ff6b00] font-semibold hover:underline ml-4"
          >
            Sign Up
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-3xl text-[#ff6b00] focus:outline-none"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-inner flex flex-col px-6 py-3 space-y-2 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="hover:text-[#ff6b00] transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/signup"
            onClick={() => setMobileOpen(false)}
            className="text-[#ff6b00] font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </div>
      )}

      {/* Bottom dark-blue bar (like in image) */}
      <div className="w-full bg-[#0f1b2a] h-4"></div>
    </header>
  );
};

export default Header;
