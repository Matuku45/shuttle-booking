import React from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaGlobeAfrica,
} from "react-icons/fa";
import L from "leaflet";

// Fix default Leaflet icon issue
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Contacts = () => {
  const position = [-25.673, 28.257]; // Pretoria coordinates

  return (
    <div className="min-h-screen bg-[#0f1b2a] text-gray-200 pt-20 pb-16 px-6 md:px-16">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Contact <span className="text-[#ff6b00]">MetroShuttle</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          We’re here to help! Get in touch for bookings, support, or partnership inquiries.
        </p>
      </motion.div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        {/* Email */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#182840] p-6 rounded-2xl shadow-md hover:shadow-lg hover:shadow-[#ff6b00]/20 transition"
        >
          <FaEnvelope className="text-[#ff6b00] text-3xl mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
          <p className="text-sm text-gray-300">info@metroshuttle.co.za</p>
        </motion.div>

        {/* Phone */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#182840] p-6 rounded-2xl shadow-md hover:shadow-lg hover:shadow-[#ff6b00]/20 transition"
        >
          <FaPhoneAlt className="text-[#ff6b00] text-3xl mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Call or WhatsApp</h3>
          <p className="text-sm text-gray-300">081 318 6838</p>
          <p className="text-xs text-gray-400 mt-1">Available Mon - Sat, 8:00 AM - 6:00 PM</p>
        </motion.div>

        {/* Location */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#182840] p-6 rounded-2xl shadow-md hover:shadow-lg hover:shadow-[#ff6b00]/20 transition"
        >
          <FaMapMarkerAlt className="text-[#ff6b00] text-3xl mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Headquarters</h3>
          <p className="text-sm text-gray-300">
            580 Jeugd Street, Montana <br /> Pretoria, Gauteng, South Africa, 0182
          </p>
        </motion.div>
      </div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-[#ff6b00]/20"
      >
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <strong>MetroShuttle HQ</strong>
              <br />
              580 Jeugd Street, Montana
              <br />
              Pretoria, Gauteng
            </Popup>
          </Marker>
        </MapContainer>
      </motion.div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-gray-400 text-sm mt-10"
      >
        <FaGlobeAfrica className="inline text-[#ff6b00] mr-1" /> MetroShuttle —
        Your Smart Travel Partner Across South Africa
      </motion.div>
    </div>
  );
};

export default Contacts;
