import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationPage = () => {
  const [ghUrl, setGhUrl] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [routeData, setRouteData] = useState({ geometry: [], directions: [] });
  const [animatedCoords, setAnimatedCoords] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Decode polyline from GraphHopper response
  const decodePolyline = (encoded) => {
    if (!encoded) return [];
    try {
      const coords = L.Polyline.fromEncoded(encoded).getLatLngs();
      return coords.map((c) => [c.lat, c.lng]);
    } catch (err) {
      console.error("Polyline decode error:", err);
      return [];
    }
  };

  // ✅ Extract coordinates directly from GraphHopper URL
  const extractCoordinatesFromUrl = (url) => {
    try {
      const params = new URL(url).searchParams;
      const points = params.getAll("point");
      if (points.length >= 2) {
        const start = points[0].split("_")[0];
        const end = points[1].split("_")[0];
        return [start, end];
      }
      return [];
    } catch (err) {
      console.error("Invalid GraphHopper URL:", err);
      return [];
    }
  };

  // ✅ Animate the polyline path
  useEffect(() => {
    if (!routeData.geometry.length) return;
    setAnimatedCoords([]);
    let index = 0;
    const interval = setInterval(() => {
      if (index < routeData.geometry.length) {
        setAnimatedCoords((prev) => [...prev, routeData.geometry[index]]);
        index++;
      } else clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, [routeData]);

  const center = animatedCoords[0] || routeData.geometry[0] || [-26.2041, 28.0473];

  // ✅ Handle extract + save route to backend
  const handleExtractAndSave = async () => {
    const coords = extractCoordinatesFromUrl(ghUrl);
    if (coords.length !== 2) {
      alert("⚠️ Invalid URL! Paste a valid GraphHopper link with two locations.");
      return;
    }

    const [start, end] = coords;
    setFrom(start);
    setTo(end);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/graphhopper/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: ghUrl }),
      });

      const data = await res.json();

      if (data.success) {
        // Simulate a decoded polyline + route data
        const decoded = [
          start.split(",").map(Number),
          end.split(",").map(Number),
        ];
        setRouteData({
          geometry: decoded,
          directions: [
            "Start your journey",
            "Drive towards destination",
            "Arrive safely 🚐",
          ],
        });
        alert("✅ Coordinates extracted and saved successfully!");
      } else {
        alert(data.error || "⚠️ Failed to save route.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Backend connection error.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset all UI
  const resetAll = () => {
    setGhUrl("");
    setFrom("");
    setTo("");
    setRouteData({ geometry: [], directions: [] });
    setAnimatedCoords([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8 drop-shadow-sm">
        🗺️ Shuttle Route Planner
      </h1>

      {/* Step 1: Open GraphHopper */}
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

      {/* Step 2: Paste URL */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">
          Paste GraphHopper Route URL
        </h2>
        <p className="text-gray-500 mb-4">
          Copy a route link from{" "}
          <a
            href="https://graphhopper.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            GraphHopper Maps
          </a>{" "}
          and paste it below.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={ghUrl}
            onChange={(e) => setGhUrl(e.target.value)}
            placeholder="e.g. https://graphhopper.com/maps/?point=-23.89,29.45&point=-29.86,31.00"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            onClick={handleExtractAndSave}
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white px-5 py-2 rounded-lg font-semibold transition-all`}
          >
            {loading ? "Processing..." : "Extract & Save Route"}
          </button>
        </div>
      </div>

      {/* Step 3: Coordinates */}
      {from && to && (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-4 mb-6 text-gray-700 border border-gray-200">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            📍 Extracted Coordinates
          </h3>
          <p>
            <strong>From:</strong> {from}
          </p>
          <p>
            <strong>To:</strong> {to}
          </p>
        </div>
      )}

      {/* Step 4: Map */}
      <div className="max-w-5xl mx-auto rounded-xl shadow-lg overflow-hidden mb-6">
        <MapContainer
          center={center}
          zoom={6}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />
          {animatedCoords.length > 0 && (
            <Polyline positions={animatedCoords} color="blue" />
          )}
          {routeData.geometry.map((pt, idx) => (
            <Marker key={idx} position={pt}>
              <Popup>Step {idx + 1}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Step 5: Directions */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-blue-700 mb-3">
          🧭 Directions
        </h3>
        {routeData.directions.length > 0 ? (
          <ol className="list-decimal ml-6 space-y-1 text-gray-800">
            {routeData.directions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500">
            Paste a GraphHopper URL and click “Extract & Save Route”.
          </p>
        )}
      </div>

      {/* Reset Button */}
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
