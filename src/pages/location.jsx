import React, { useState } from "react";

const LocationPage = () => {
  const [ghUrl, setGhUrl] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = "0aab22de-93bc-4aeb-a6d6-f405f07211ab"; // GraphHopper key
  const BASE_URL = "http://localhost:3001"; // backend API base URL

  // Get logged-in user info
  const user = JSON.parse(localStorage.getItem("user"));
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const userBooking = bookings.find(
    (b) => b.email?.toLowerCase() === user?.email?.toLowerCase()
  );

  // Extract coordinates from GraphHopper URL
  const extractCoordinatesFromUrl = (url) => {
    try {
      const params = new URL(url).searchParams;
      const points = params.getAll("point");
      if (points.length >= 2) return points.map((p) => p.split("_")[0]);
      return [];
    } catch (err) {
      console.error("Invalid GraphHopper URL:", err);
      return [];
    }
  };

  // Reverse geocode coordinates -> readable address
  const reverseGeocode = async (coord) => {
    try {
      const res = await fetch(
        `https://graphhopper.com/api/1/geocode?reverse=true&point=${coord}&key=${API_KEY}`
      );
      const data = await res.json();
      if (data.hits && data.hits.length > 0) return data.hits[0].name;
      return coord;
    } catch (err) {
      console.error("Reverse geocode error:", err);
      return coord;
    }
  };

  // Fetch directions from GraphHopper
  const fetchDirections = async (start, end) => {
    try {
      const payload = {
        points: [
          start.split(",").map(Number).reverse(),
          end.split(",").map(Number).reverse(),
        ],
        profile: "car",
        instructions: true,
        calc_points: true,
        elevation: false,
        locale: "en",
      };

      const res = await fetch(
        `https://graphhopper.com/api/1/route?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.paths && data.paths.length > 0) {
        const steps = data.paths[0].instructions.map(
          (step) => `${step.text} (${step.distance.toFixed(0)} m)`
        );
        setDirections(steps);
        return steps;
      } else {
        setDirections([]);
        alert("⚠️ No directions returned. Check coordinates or API key.");
        return [];
      }
    } catch (err) {
      console.error("Error fetching directions:", err);
      setDirections([]);
      alert("❌ Error fetching directions from GraphHopper API.");
      return [];
    }
  };

  // Update user's booking path in backend and localStorage
  const updateBookingPath = async (pathSteps) => {
    if (!userBooking) return;

    const pathString = pathSteps.join(" -> ");

    // Update localStorage
    const updatedBookings = bookings.map((b) =>
      b.id === userBooking.id ? { ...b, path: pathString } : b
    );
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    // Update backend API
    try {
      const res = await fetch(`${BASE_URL}/bookings/${userBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userBooking, path: pathString }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to update booking");
      console.log("Booking path updated on backend:", pathString);
    } catch (err) {
      console.error("Failed to update booking on backend:", err);
      alert("❌ Failed to update booking path on server.");
    }
  };

  const handleExtractAndSave = async () => {
    setLoading(true);
    setDirections([]);

    const coords = extractCoordinatesFromUrl(ghUrl);
    if (coords.length !== 2) {
      alert("⚠️ Invalid URL! Paste a valid GraphHopper link with two locations.");
      setLoading(false);
      return;
    }

    setFrom(coords[0]);
    setTo(coords[1]);

    const fromAddr = await reverseGeocode(coords[0]);
    const toAddr = await reverseGeocode(coords[1]);
    setFromAddress(fromAddr);
    setToAddress(toAddr);

    const steps = await fetchDirections(coords[0], coords[1]);
    await updateBookingPath(steps);

    setLoading(false);
  };

  const resetAll = () => {
    setGhUrl("");
    setFrom("");
    setTo("");
    setFromAddress("");
    setToAddress("");
    setDirections([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8 drop-shadow-sm">
        🗺️ Shuttle Route Planner
      </h1>

      <div className="flex justify-center mb-6">
        <a
          href="https://graphhopper.com/maps/?profile=car&layer=Omniscale"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all"
        >
          🌍 Open GraphHopper Map
        </a>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">
          Paste GraphHopper Route URL
        </h2>
        <input
          type="text"
          value={ghUrl}
          onChange={(e) => setGhUrl(e.target.value)}
          placeholder="Paste your GraphHopper URL here"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none mb-4"
        />
        <button
          onClick={handleExtractAndSave}
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-5 py-2 rounded-lg font-semibold transition-all`}
        >
          {loading ? "Processing..." : "Extract & Save Directions"}
        </button>
      </div>

      {from && to && (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-4 mb-6 text-gray-700 border border-gray-200">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">📍 Route</h3>
          <p>
            <strong>From:</strong> {fromAddress} ({from})
          </p>
          <p>
            <strong>To:</strong> {toAddress} ({to})
          </p>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-blue-700 mb-3">🧭 Directions</h3>
        {directions.length > 0 ? (
          <ol className="list-decimal ml-6 space-y-1 text-gray-800">
            {directions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500">
            Paste a GraphHopper URL and click “Extract & Save Directions”.
          </p>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={resetAll}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Reset All
        </button>
      </div>
    </div>
  );
};

export default LocationPage;
