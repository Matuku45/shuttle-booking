// src/pages/ViewAllLocations.jsx
import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaArrowRight, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

const BASE_URL = "https://my-payment-session-shuttle-system-cold-glade-4798.fly.dev";

const ViewAllLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/locationform`);
        if (!res.ok) throw new Error("Failed to fetch locations");
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-blue-700 font-semibold text-lg animate-pulse">Loading locations...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-extrabold mb-6 text-center text-blue-900 drop-shadow-md"
      >
        📍 All Shuttle Locations
      </motion.h2>

      {locations.length === 0 ? (
        <p className="text-center text-gray-700 text-lg font-semibold">No locations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc, index) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-400 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold">
                <FaMapMarkerAlt /> From:
              </div>
              <p className="mb-3 text-gray-800">{loc.fromLocation}</p>

              <div className="flex items-center gap-2 mb-2 text-green-700 font-semibold">
                <FaArrowRight /> To:
              </div>
              <p className="mb-3 text-gray-800">{loc.toLocation}</p>

              <div className="flex items-center gap-2 text-gray-600 font-semibold">
                <FaEnvelope /> Email:
              </div>
              <p className="text-gray-800">{loc.email}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAllLocations;
