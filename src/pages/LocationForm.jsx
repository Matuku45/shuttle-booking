import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaArrowRight, FaRoute } from "react-icons/fa";
import { motion } from "framer-motion";

const LocationForm = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // ✅ New loading state

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) setEmail(user.email);

    const savedLocation = JSON.parse(localStorage.getItem("locationForm"));
    if (savedLocation) {
      setFromLocation(savedLocation.fromLocation || "");
      setToLocation(savedLocation.toLocation || "");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fromLocation || !toLocation) {
      alert("Please fill in both pickup and destination locations.");
      return;
    }

    setLoading(true); // ✅ Start slider animation

    const locationFormData = {
      id: Math.floor(Math.random() * 1000000),
      fromLocation,
      toLocation,
      email,
    };

    try {
      const response = await fetch(
        "https://my-payment-session-shuttle-system-cold-glade-4798.fly.dev/api/locationform",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(locationFormData),
        }
      );

      if (!response.ok) throw new Error(`Backend error: ${response.status}`);
      const result = await response.json();
      console.log("Location saved:", result);

      localStorage.setItem("locationForm", JSON.stringify(locationFormData));
      window.location.href = "https://buy.stripe.com/test_7sY5kFgupfQO7FC4UOcwg01";
    } catch (err) {
      console.error(err);
      alert("Failed to save location. Please try again.");
      setLoading(false); // ✅ Stop slider on error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl p-8 bg-white rounded-3xl shadow-2xl border border-gradient-to-r from-blue-400 via-pink-400 to-purple-500"
      >
        {/* Header */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold text-center text-gradient bg-clip-text text-transparent from-blue-500 via-pink-500 to-purple-600 flex justify-center items-center gap-2 mb-4"
        >
          <FaRoute /> Shuttle Booking
        </motion.h1>
        <p className="text-center text-gray-600 mb-8">
          Enter your pickup and destination details
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* From Card */}
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 border-l-4 border-blue-400 shadow-md"
            >
              <label className="label flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600 text-lg" /> From
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-28 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="Pickup location (street, suburb, city...)"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                required
              />
            </motion.div>

            {/* To Card */}
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)" }}
              className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 border-l-4 border-green-400 shadow-md"
            >
              <label className="label flex items-center gap-2">
                <FaArrowRight className="text-green-600 text-lg" /> To
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-28 text-base focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                placeholder="Destination address (street, suburb, zip, postal code)"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                required
              />
            </motion.div>
          </div>

          {/* Continue Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full text-lg flex justify-center items-center gap-3 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-600 shadow-lg hover:shadow-2xl text-white transition-all duration-300 ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {loading ? "Processing..." : "Continue"}
              <FaArrowRight className={`animate-pulse ${loading ? "text-yellow-300" : "text-white"}`} />
            </button>
          </motion.div>

          {/* Progress Slider */}
          {loading && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "linear" }}
              className="h-2 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-600 rounded-full mt-3"
            />
          )}
        </form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-gray-500 text-sm"
        >
          🚐 Safe & Comfortable Ride — powered by{" "}
          <span className="text-blue-600 font-semibold">ShuttleGo</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LocationForm;
