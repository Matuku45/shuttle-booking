import React, { useState } from "react";
import { FaMapMarkedAlt, FaRoute, FaArrowRight, FaRedo } from "react-icons/fa";

const LocationPage = () => {
  const [ghUrl, setGhUrl] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = "0aab22de-93bc-4aeb-a6d6-f405f07211ab"; 
  const BASE_URL = "http://localhost:3001"; 

  const user = JSON.parse(localStorage.getItem("user"));
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const userBooking = bookings.find(
    (b) => b.email?.toLowerCase() === user?.email?.toLowerCase()
  );

  const extractCoordinatesFromUrl = (url) => {
    try {
      const params = new URL(url).searchParams;
      const points = params.getAll("point");
      if (points.length >= 2) return points.map((p) => p.split("_")[0]);
      return [];
    } catch {
      return [];
    }
  };

  const reverseGeocode = async (coord) => {
    try {
      const res = await fetch(
        `https://graphhopper.com/api/1/geocode?reverse=true&point=${coord}&key=${API_KEY}`
      );
      const data = await res.json();
      return data.hits?.[0]?.name || coord;
    } catch {
      return coord;
    }
  };

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

      const res = await fetch(`https://graphhopper.com/api/1/route?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const steps = data.paths?.[0]?.instructions.map(
        (step) => `${step.text} (${step.distance.toFixed(0)} m)`
      ) || [];
      setDirections(steps);
      return steps;
    } catch {
      setDirections([]);
      return [];
    }
  };

  const updateBookingPath = async (pathSteps) => {
    if (!userBooking) return;
    const pathString = pathSteps.join(" -> ");

    const updatedBookings = bookings.map((b) =>
      b.id === userBooking.id ? { ...b, path: pathString } : b
    );
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    try {
      await fetch(`${BASE_URL}/bookings/${userBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userBooking, path: pathString }),
      });
    } catch {}
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
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8 drop-shadow-lg animate-pulse">
        🗺️ Shuttle Route Planner
      </h1>

      <div className="flex justify-center mb-6">
        <a
          href="https://graphhopper.com/maps/?profile=car&layer=Omniscale"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:scale-105 transition-transform text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2"
        >
          <FaMapMarkedAlt className="animate-bounce" /> Open GraphHopper Map
        </a>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-6 mb-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Paste GraphHopper Route URL</h2>
        <input
          type="text"
          value={ghUrl}
          onChange={(e) => setGhUrl(e.target.value)}
          placeholder="Paste your GraphHopper URL here"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none mb-4 text-gray-800"
        />
        <button
          onClick={handleExtractAndSave}
          disabled={loading}
          className={`w-full text-white font-bold py-3 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105"
          }`}
        >
          {loading ? "Processing..." : <><FaArrowRight /> Extract & Save Directions</>}
        </button>
      </div>

      {from && to && (
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-green-200 via-green-100 to-green-50 rounded-xl shadow-xl p-5 mb-6 border border-green-300 animate-fadeIn">
          <h3 className="text-xl font-bold text-green-800 mb-2 flex items-center gap-2">
            <FaRoute className="text-green-600" /> Route
          </h3>
          <p className="text-gray-800"><strong>From:</strong> {fromAddress} ({from})</p>
          <p className="text-gray-800"><strong>To:</strong> {toAddress} ({to})</p>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
          🧭 Directions
        </h3>
        {directions.length > 0 ? (
          <ul className="space-y-4">
            {directions.map((step, idx) => (
              <li key={idx} className="relative pl-10">
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                <div className="transition-transform hover:translate-x-2 hover:text-blue-600 text-gray-800">{step}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Paste a GraphHopper URL and click “Extract & Save Directions”.</p>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={resetAll}
          className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:scale-105 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-transform"
        >
          <FaRedo /> Reset All
        </button>
      </div>
    </div>
  );
};

export default LocationPage;
