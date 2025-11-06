import React, { useState } from "react";
import { FaMapMarkerAlt, FaRoute, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LocationForm = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fromLocation && toLocation) {
      navigate("/directions", { state: { fromLocation, toLocation } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="card w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 border border-blue-100 hover:shadow-blue-300 transition-all duration-500"
      >
        {/* Header */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-extrabold text-center text-blue-700 mb-2"
        >
          <FaRoute className="inline text-blue-600 mr-2" />
          Shuttle Booking
        </motion.h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your pickup and destination details
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* FROM */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-medium flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600" /> From
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered textarea-info h-24 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter pickup location (street, suburb, city...)"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              required
            ></textarea>
          </div>

          {/* TO */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-medium flex items-center gap-2">
                <FaArrowRight className="text-green-600" /> To
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered textarea-success h-24 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter destination address (street, suburb, city...)"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Continue Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-center"
          >
            <button
              type="submit"
              className="btn btn-primary w-full text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Continue
              <FaArrowRight className="text-white animate-pulse" />
            </button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center text-gray-500 text-sm"
        >
          🚐 Safe & Comfortable Ride — powered by <span className="text-blue-600 font-semibold">ShuttleGo</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LocationForm;
