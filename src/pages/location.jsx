import React, { useState } from "react";

const LocationPage = () => {
  const [ghUrl, setGhUrl] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = "YOUR_GRAPH_HOPPER_API_KEY"; // replace with your key

  // Extract coordinates from GraphHopper URL
  const extractCoordinatesFromUrl = (url) => {
    try {
      const params = new URL(url).searchParams;
      const points = params.getAll("point");
      if (points.length >= 2) {
        return points.map((p) => p.split("_")[0]); // get lat,lng
      }
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


  

const fetchDirections = async (start, end) => {
  try {
    const payload = {
      points: [
        start.split(",").map(Number).reverse(), // [lon, lat]
        end.split(",").map(Number).reverse(),
      ],
      profile: "car",
      instructions: true,
      calc_points: true, // ✅ must be true to get directions
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
    console.log("GraphHopper response:", data); // debug output

    if (data.paths && data.paths.length > 0) {
      // map instructions with distance
      const steps = data.paths[0].instructions.map(
        (step) => `${step.text} (${step.distance.toFixed(0)} m)`
      );
      setDirections(steps);
    } else {
      setDirections([]);
      alert("⚠️ No directions returned. Check coordinates or API key.");
    }
  } catch (err) {
    console.error("Error fetching directions:", err);
    setDirections([]);
    alert("❌ Error fetching directions from GraphHopper API.");
  }
};


  // Main handler
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

    await fetchDirections(coords[0], coords[1]);
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
          {loading ? "Processing..." : "Extract & Get Directions"}
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
            Paste a GraphHopper URL and click “Extract & Get Directions”.
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
