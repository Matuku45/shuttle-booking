import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0f1b2a] text-gray-300 mt-10 pt-12 pb-6 px-6 md:px-12 relative overflow-hidden">
      {/* Animated gradient top line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff6b00] via-orange-400 to-[#ff6b00] animate-pulse"></div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="font-bold text-white mb-3 text-lg">MetroShuttle</h3>
          <p className="text-sm leading-relaxed">
            Smart city-to-city shuttle booking for professionals, travelers, and
            students. Reliable, affordable, and designed for urban efficiency.
          </p>

          {/* Social Links */}
          <div className="flex gap-3 mt-4">
            {[
              { icon: <FaFacebookF />, link: "https://facebook.com" },
              { icon: <FaTwitter />, link: "https://twitter.com" },
              { icon: <FaInstagram />, link: "https://instagram.com" },
              { icon: <FaLinkedinIn />, link: "https://linkedin.com" },
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#ff6b00]/20 rounded-full hover:bg-[#ff6b00] transition transform hover:scale-110"
              >
                {React.cloneElement(item.icon, { className: "text-white" })}
              </a>
            ))}
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="font-semibold text-white mb-3 text-lg">Useful Links</h3>
          {[
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about" },
            { name: "Contact", path: "/contact" },
            { name: "Support", path: "/support" }, // ✅ Full Support link
          ].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block mb-2 text-sm hover:text-[#ff6b00] transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Booking Solutions */}
        <div>
          <h3 className="font-semibold text-white mb-3 text-lg">
            Booking Solutions
          </h3>
          {[
            { name: "City Transfers", path: "/city-transfer" },
            { name: "Corporate Rides", path: "#" },
          ].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block mb-2 text-sm hover:text-[#ff6b00] transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="font-semibold text-white mb-3 text-lg">
            Customer Care
          </h3>
          {[
            { name: "FAQs", path: "/faqs" },
            { name: "Privacy Policy", path: "/privacy-policy" },
            { name: "Terms & Conditions", path: "/terms" },
          ].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block mb-2 text-sm hover:text-[#ff6b00] transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-white mb-3 text-lg">
            Get in Touch
          </h3>
          <p className="flex items-start gap-2 text-sm mb-3">
            <FaMapMarkerAlt className="text-[#ff6b00] mt-1" />
            <span>
              <strong>Our Office Location</strong>
              <br />
              MetroShuttle Headquarters
              <br />
              580 Jeugd Street, Montana
              <br />
              Pretoria, Gauteng, South Africa, 0182
            </span>
          </p>

          <p className="flex items-center gap-2 text-sm mb-2">
            <FaPhoneAlt className="text-[#ff6b00]" /> 081&nbsp;318&nbsp;6838 – Call /
            WhatsApp
          </p>

          <p className="flex items-center gap-2 text-sm">
            <FaEnvelope className="text-[#ff6b00]" /> info@metroshuttle.co.za
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-gray-400 text-sm mt-10 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()}{" "}
        <span className="text-[#ff6b00] font-semibold">MetroShuttle</span> — Smart
        Mobility for Modern Cities
      </div>
    </footer>
  );
};

export default Footer;
