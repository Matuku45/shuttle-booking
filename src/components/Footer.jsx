import React from "react";
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
      {/* Animated glow line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff6b00] via-orange-400 to-[#ff6b00] animate-pulse"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="font-bold text-white mb-3 text-lg">MetroShuttle</h3>
          <p className="text-sm leading-relaxed">
            Smart city-to-city shuttle booking for professionals, travelers,
            and students. Reliable, affordable, and designed for urban
            efficiency.
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#ff6b00]/20 rounded-full hover:bg-[#ff6b00] transition transform hover:scale-110"
            >
              <FaFacebookF className="text-white" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#ff6b00]/20 rounded-full hover:bg-[#ff6b00] transition transform hover:scale-110"
            >
              <FaTwitter className="text-white" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#ff6b00]/20 rounded-full hover:bg-[#ff6b00] transition transform hover:scale-110"
            >
              <FaInstagram className="text-white" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#ff6b00]/20 rounded-full hover:bg-[#ff6b00] transition transform hover:scale-110"
            >
              <FaLinkedinIn className="text-white" />
            </a>
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="font-semibold text-white mb-3 text-lg">Useful Links</h3>
          {["Home", "About Us", "Contact", "Support"].map((link) => (
            <a
              key={link}
              href="#"
              className="block mb-2 text-sm hover:text-[#ff6b00] transition"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Booking Solutions */}
        <div>
          <h3 className="font-semibold text-white mb-3 text-lg">
            Booking Solutions
          </h3>
          {["City Transfers", "Airport Shuttle", "Corporate Rides"].map(
            (link) => (
              <a
                key={link}
                href="#"
                className="block mb-2 text-sm hover:text-[#ff6b00] transition"
              >
                {link}
              </a>
            )
          )}
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="font-semibold text-white mb-3 text-lg">Customer Care</h3>
          {["FAQs", "Privacy Policy", "Terms & Conditions"].map((link) => (
            <a
              key={link}
              href="#"
              className="block mb-2 text-sm hover:text-[#ff6b00] transition"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-white mb-3 text-lg">Get in Touch</h3>
          <p className="flex items-center gap-2 text-sm mb-2">
            <FaMapMarkerAlt className="text-[#ff6b00]" /> Johannesburg, South Africa
          </p>
          <p className="flex items-center gap-2 text-sm mb-2">
            <FaPhoneAlt className="text-[#ff6b00]" /> +27 68 123 4567
          </p>
          <p className="flex items-center gap-2 text-sm">
            <FaEnvelope className="text-[#ff6b00]" /> support@metroshuttle.com
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-gray-400 text-sm mt-10 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} <span className="text-[#ff6b00] font-semibold">MetroShuttle</span> — 
        Smart Mobility for Modern Cities
      </div>
    </footer>
  );
};

export default Footer;
