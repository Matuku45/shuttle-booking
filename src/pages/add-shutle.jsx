import React, { useState } from "react";

const BASE_URL = "https://shuttle-booking-system.fly.dev";

// Dummy route list (South African cities)
const ROUTE_OPTIONS = [
  "Pretoria → Cape Town",
  "Johannesburg → Durban",
  "Polokwane → Bloemfontein",
  "Cape Town → Port Elizabeth",
  "Durban → East London",
  "Nelspruit → Pretoria",
  "Kimberley → Johannesburg",
];

export default function AddShuttle({ onClose, onSubmit }) {
  const [shuttleData, setShuttleData] = useState({
    route: "",
    date: "",
    time: "",
    duration: "",
    seats: 1,
    price: 100,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper: Convert empty fields to null, pickup always null
  const sanitizePayload = (data) => {
    const payload = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === "" || value === undefined) {
        payload[key] = null;
      } else if (key === "seats" || key === "price" || key === "duration") {
        payload[key] = Number(value);
      } else {
        payload[key] = value;
      }
    }
    payload.pickup = null; // Always null since pickup point removed
    return payload;
  };

  const handleAdd = async () => {
    const payload = sanitizePayload(shuttleData);
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/api/shuttles/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add shuttle");
      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Server error");

      onSubmit(result.shuttle);

      // Reset form
      setShuttleData({
        route: "",
        date: "",
        time: "",
        duration: "",
        seats: 1,
        price: 100,
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          ➕ Add New Shuttle
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Route selection dropdown */}
          <select
            value={shuttleData.route}
            onChange={(e) =>
              setShuttleData({ ...shuttleData, route: e.target.value })
            }
            className="border px-3 py-2 rounded-lg w-full"
          >
            <option value="">Select Route</option>
            {ROUTE_OPTIONS.map((route, index) => (
              <option key={index} value={route}>
                {route}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={shuttleData.date}
            onChange={(e) =>
              setShuttleData({ ...shuttleData, date: e.target.value })
            }
            className="border px-3 py-2 rounded-lg w-full"
          />

          <input
            type="time"
            value={shuttleData.time}
            onChange={(e) =>
              setShuttleData({ ...shuttleData, time: e.target.value })
            }
            className="border px-3 py-2 rounded-lg w-full"
          />

          <input
            type="text"
            placeholder="Duration (hours)"
            value={shuttleData.duration}
            onChange={(e) =>
              setShuttleData({ ...shuttleData, duration: e.target.value })
            }
            className="border px-3 py-2 rounded-lg w-full"
          />

          <input
            type="number"
            min="1"
            placeholder="Seats"
            value={shuttleData.seats}
            onChange={(e) =>
              setShuttleData({
                ...shuttleData,
                seats: Number(e.target.value),
              })
            }
            className="border px-3 py-2 rounded-lg w-full"
          />

          <input
            type="number"
            min="0"
            placeholder="Price"
            value={shuttleData.price}
            onChange={(e) =>
              setShuttleData({
                ...shuttleData,
                price: Number(e.target.value),
              })
            }
            className="border px-3 py-2 rounded-lg w-full"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
          >
            ❌ Cancel
          </button>

          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500"
          >
            {loading ? "Adding..." : "➕ Add Shuttle"}
          </button>
        </div>
      </div>
    </div>
  );
}
