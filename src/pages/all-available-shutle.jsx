import React, { useState, useEffect } from "react";
// src/pages/AdminDashboard.jsx

import AddShuttle from "./add-shutle";
import AllCars from "./AllCars";
import AllBookings from "./AllBookings";


import ViewAllLocations from "./ViewAllLocations";

const BASE_URL = "https://shuttle-booking-system.fly.dev";

const AllShuttles = () => {
  const [shuttles, setShuttles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingShuttle, setEditingShuttle] = useState(null);
  const [formData, setFormData] = useState({
    route: "",
    date: "",
    time: "",
    duration: "",
    seats: 1,
    price: 100,
  });

  // Fetch all shuttles
  const fetchShuttles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/shuttles`);
      const data = await res.json();
      if (data.success) setShuttles(data.shuttles);
      else setError(data.message || "Failed to fetch shuttles");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShuttles();
  }, []);

  // Handle create/update
  const handleSave = async () => {
    try {
      const url = editingShuttle
        ? `${BASE_URL}/api/shuttles/${editingShuttle.id}`
        : `${BASE_URL}/api/shuttles/add`;
      const method = editingShuttle ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setFormData({ route: "", date: "", time: "", duration: "", seats: 1, price: 100 });
      setEditingShuttle(null);
      fetchShuttles();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shuttle?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/shuttles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      fetchShuttles();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-gray-300">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center">
          🚐 All Shuttles
        </h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        {/* Shuttle Form */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Route"
            value={formData.route}
            onChange={(e) => setFormData({ ...formData, route: e.target.value })}
            className="border px-3 py-2 rounded-lg w-full"
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="border px-3 py-2 rounded-lg w-full"
          />
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="border px-3 py-2 rounded-lg w-full"
          />
          <input
            type="number"
            placeholder="Duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="border px-3 py-2 rounded-lg w-full"
          />
          <input
            type="number"
            placeholder="Seats"
            min="1"
            value={formData.seats}
            onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
            className="border px-3 py-2 rounded-lg w-full"
          />
          <input
            type="number"
            placeholder="Price"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="border px-3 py-2 rounded-lg w-full"
          />
        </div>

        {/* Add / Update Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg font-semibold shadow-md
              bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600
              text-black hover:brightness-110 transition"
          >
            {editingShuttle ? "Update Shuttle" : "Add Shuttle"}
          </button>
        </div>

        {/* Shuttle List */}
        {loading ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : shuttles.length === 0 ? (
          <p className="text-center text-gray-700">No shuttles available.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {shuttles.map((s) => (
              <div
                key={s.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all"
              >
                {/* ✨ Route with green animated arrow */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  {s.route.includes("->") ? (
                    <>
                      <span>{s.route.split("->")[0].trim()}</span>
                      <span className="text-green-600 text-2xl animate-pulse">➡️</span>
                      <span>{s.route.split("->")[1].trim()}</span>
                    </>
                  ) : (
                    s.route
                  )}
                </h3>

                <p className="text-gray-700 mb-1">
                  📅 <strong>Date:</strong> {s.date}
                </p>
                <p className="text-gray-700 mb-1">
                  ⏰ <strong>Time:</strong> {s.time}
                </p>
                <p className="text-gray-700 mb-1">
                  ⏳ <strong>Duration:</strong> {s.duration} hours
                </p>
                <p className="text-gray-700 mb-1">
                  💺 <strong>Seats:</strong> {s.seats}
                </p>
                <p className="text-gray-900 font-extrabold mt-2">
                  💰 <strong>Price:</strong> R{s.price}
                </p>

                <div className="flex gap-3 mt-4">
                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setEditingShuttle(s);
                      setFormData({
                        route: s.route,
                        date: s.date,
                        time: s.time,
                        duration: s.duration,
                        seats: s.seats,
                        price: s.price,
                      });
                    }}
                    className="px-4 py-2 rounded-lg font-semibold shadow-md
                      bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600
                      text-white hover:brightness-110 transition"
                  >
                    ✏️ Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="px-4 py-2 rounded-lg font-semibold shadow-md
                      bg-gradient-to-r from-red-400 via-red-500 to-red-600
                      text-white hover:brightness-110 transition"
                  >
                    ❌ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllShuttles;
