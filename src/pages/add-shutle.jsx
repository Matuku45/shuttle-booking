import React, { useState, useEffect } from "react";

export default function AllAvailableShuttle({ shuttles, setShuttles }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const cities = [
    { name: "Pretoria", coords: "25.7479° S, 28.2293° E" },
    { name: "Durban", coords: "29.8587° S, 31.0218° E" },
    { name: "Johannesburg", coords: "26.2041° S, 28.0473° E" },
    { name: "Cape Town", coords: "33.9249° S, 18.4241° E" },
  ];

  useEffect(() => {
    if (!shuttles || shuttles.length === 0) fetchShuttles();
  }, []);

  const fetchShuttles = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://shuttle-booking-system.fly.dev/api/shuttles");
      if (!res.ok) throw new Error("Failed to fetch shuttles");
      const data = await res.json();
      setShuttles(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shuttle?")) return;
    try {
      const res = await fetch(`https://shuttle-booking-system.fly.dev/api/shuttles/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete shuttle");
      setShuttles(shuttles.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const startEditing = (s) => {
    setEditingId(s.id);

    // Parse route
    let initCity = "", initCoords = "", finalCity = "", finalCoords = "";
    if (s.route) {
      const parts = s.route.split(" -> ");
      if (parts.length === 2) {
        const startMatch = parts[0].match(/(.*)\((.*)\)/);
        const endMatch = parts[1].match(/(.*)\((.*)\)/);
        if (startMatch && endMatch) {
          initCity = startMatch[1].trim();
          initCoords = startMatch[2].trim();
          finalCity = endMatch[1].trim();
          finalCoords = endMatch[2].trim();
        }
      }
    }

    setEditData({
      initialCity: initCity,
      initialCoords: initCoords,
      finalCity: finalCity,
      finalCoords: finalCoords,
      date: s.date || "",
      time: s.time || "",
      duration: s.duration || "",
      pickup: s.pickup || "",
      seats: s.seats || 1,
      price: s.price || 100,
    });
  };

  const saveEdit = async (id) => {
    const updatedRoute = (editData.initialCity && editData.finalCity)
      ? `${editData.initialCity} (${editData.initialCoords}) -> ${editData.finalCity} (${editData.finalCoords})`
      : shuttles.find((s) => s.id === id).route;

    const payload = {
      route: updatedRoute,
      date: editData.date,
      time: editData.time,
      duration: editData.duration,
      pickup: editData.pickup,
      seats: Number(editData.seats),
      price: Number(editData.price),
    };

    try {
      const res = await fetch(`https://shuttle-booking-system.fly.dev/api/shuttles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update shuttle");
      const updatedShuttle = await res.json();
      setShuttles(shuttles.map((s) => (s.id === id ? { ...s, ...updatedShuttle } : s)));
      setEditingId(null);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">All Available Shuttles</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p className="text-gray-600">Loading shuttles...</p>
      ) : (
        <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="border px-4 py-2">Route</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Time</th>
                <th className="border px-4 py-2">Duration</th>
                <th className="border px-4 py-2">Pickup</th>
                <th className="border px-4 py-2">Seats</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shuttles.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">No shuttles available.</td>
                </tr>
              ) : (
                shuttles.map((s) => (
                  <tr key={s.id} className="even:bg-gray-50">
                    <td className="border px-4 py-2">
                      {editingId === s.id ? (
                        <div className="grid grid-cols-2 gap-2">
                          <select value={editData.initialCity} onChange={(e) => setEditData({ ...editData, initialCity: e.target.value })} className="border p-1 rounded">
                            <option value="">Initial City</option>
                            {cities.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                          </select>
                          <select value={editData.initialCoords} onChange={(e) => setEditData({ ...editData, initialCoords: e.target.value })} className="border p-1 rounded">
                            <option value="">Initial Coords</option>
                            {cities.map((c) => <option key={c.coords} value={c.coords}>{c.coords}</option>)}
                          </select>
                          <select value={editData.finalCity} onChange={(e) => setEditData({ ...editData, finalCity: e.target.value })} className="border p-1 rounded">
                            <option value="">Final City</option>
                            {cities.map((c) => <option key={c.name+"f"} value={c.name}>{c.name}</option>)}
                          </select>
                          <select value={editData.finalCoords} onChange={(e) => setEditData({ ...editData, finalCoords: e.target.value })} className="border p-1 rounded">
                            <option value="">Final Coords</option>
                            {cities.map((c) => <option key={c.coords+"f"} value={c.coords}>{c.coords}</option>)}
                          </select>
                        </div>
                      ) : s.route}
                    </td>
                    <td className="border px-4 py-2">
                      {editingId === s.id ? (
                        <input type="date" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} className="border p-1 rounded w-full"/>
                      ) : s.date || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {editingId === s.id ? (
                        <input type="time" value={editData.time} onChange={(e) => setEditData({ ...editData, time: e.target.value })} className="border p-1 rounded w-full"/>
                      ) : s.time || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {editingId === s.id ? (
                        <input type="text" value={editData.duration} onChange={(e) => setEditData({ ...editData, duration: e.target.value })} className="border p-1 rounded w-full"/>
                      ) : s.duration || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {editingId === s.id ? (
                        <input type="text" value={editData.pickup} onChange={(e) => setEditData({ ...editData, pickup: e.target.value })} className="border p-1 rounded w-full"/>
                      ) : s.pickup || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {editingId === s.id ? (
                        <input type="number" value={editData.seats} onChange={(e) => setEditData({ ...editData, seats: e.target.value })} className="border p-1 rounded w-full"/>
                      ) : s.seats}
                    </td>
                    <td className="border px-4 py-2">
                      {editingId === s.id ? (
                        <input type="number" value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })} className="border p-1 rounded w-full"/>
                      ) : s.price}
                    </td>
                    <td className="border px-4 py-2 text-center space-x-2">
                      {editingId === s.id ? (
                        <button onClick={() => saveEdit(s.id)} className="bg-green-500 px-2 py-1 text-white rounded hover:bg-green-600">💾 Save</button>
                      ) : (
                        <>
                          <button onClick={() => startEditing(s)} className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500">✏️ Edit</button>
                          <button onClick={() => handleDelete(s.id)} className="bg-red-600 px-2 py-1 text-white rounded hover:bg-red-700">🗑️ Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
