import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const LocationPage = () => {
  const [routeData, setRouteData] = useState({ geometry: [], directions: [] });
  const [animatedCoords, setAnimatedCoords] = useState([]);
  const [from, setFrom] = useState("-26.17248,28.05364"); // dummy coordinates
  const [to, setTo] = useState("-26.17328,28.05316"); // dummy coordinates
  const [ghUrl, setGhUrl] = useState("");

  // Animate route gradually
  useEffect(() => {
    if (!routeData.geometry.length) return;
    setAnimatedCoords([]);
    let index = 0;
    const interval = setInterval(() => {
      if (index < routeData.geometry.length) {
        setAnimatedCoords((prev) => [...prev, routeData.geometry[index]]);
        index++;
      } else clearInterval(interval);
    }, 400);
    return () => clearInterval(interval);
  }, [routeData]);

  const center = animatedCoords[0] || routeData.geometry[0] || [-26.17248, 28.05364];

  // Decode GraphHopper polyline
  const decodePolyline = (encoded) => {
    if (!encoded) return [];
    try {
      const coords = L.Polyline.fromEncoded(encoded).getLatLngs();
      return coords.map((c) => [c.lat, c.lng]);
    } catch {
      return [];
    }
  };

  // Extract coordinates from GraphHopper URL
  const extractCoordinatesFromUrl = (url) => {
    try {
      const params = new URL(url).searchParams;
      const points = params.getAll("point");
      if (points.length >= 2) {
        return [points[0].split("_")[0], points[1].split("_")[0]]; // from, to
      }
      return [];
    } catch (err) {
      console.error("Invalid GraphHopper URL", err);
      return [];
    }
  };

  const handleExtractFromUrl = () => {
    const coords = extractCoordinatesFromUrl(ghUrl);
    if (coords.length === 2) {
      setFrom(coords[0]);
      setTo(coords[1]);
    } else {
      alert("Could not extract coordinates from URL. Make sure it's a valid GraphHopper map URL.");
    }
  };

  // Fetch route from backend
  const fetchRoute = async () => {
    if (!from || !to) return alert("Enter both From and To coordinates (lat,lng format)");
    try {
      const payload = { points: [from, to], profile: "car" };
      const res = await fetch("http://localhost:3001/api/graphhopper/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.dummy_routes?.length > 0) {
        // Use the first route as example
        const route = data.dummy_routes[0];
        const decoded = decodePolyline(route.encoded_polyline);
        const instructions = route.instructions.map((i) => i.text || "Step");
        setRouteData({ geometry: decoded, directions: instructions });
      } else alert("No route returned");
    } catch (err) {
      console.error(err);
      alert("Error fetching route from backend");
    }
  };

  // Save route to backend
  const saveRoute = async () => {
    if (!routeData.geometry.length) return alert("No route to save");
    try {
      const res = await fetch("http://localhost:3001/api/graphhopper/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routeData),
      });
      const data = await res.json();
      alert(data.message || "Route saved successfully");
    } catch (err) {
      console.error(err);
      alert("Error saving route");
    }
  };

  const resetRoute = () => {
    setRouteData({ geometry: [], directions: [] });
    setAnimatedCoords([]);
    setFrom("");
    setTo("");
    setGhUrl("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-6">🗺️ Shuttle Route Planner</h1>

      {/* Open GraphHopper Maps */}
      <div className="flex justify-center mb-6">
        <a
          href="https://graphhopper.com/maps/?profile=car&layer=Omniscale"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
        >
          Open GraphHopper Map
        </a>
      </div>

      {/* GraphHopper URL input */}
      <div className="max-w-3xl mx-auto bg-white rounded shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Paste GraphHopper Map URL</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Paste GraphHopper map URL here"
            value={ghUrl}
            onChange={(e) => setGhUrl(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2"
          />
          <button
            onClick={handleExtractFromUrl}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold"
          >
            Extract Coordinates
          </button>
        </div>
      </div>

      {/* Coordinates input */}
      <div className="max-w-3xl mx-auto bg-white rounded shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Enter Coordinates Manually</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="From: lat,lng"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="text"
            placeholder="To: lat,lng"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={fetchRoute}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            Get Route
          </button>
          <button
            onClick={saveRoute}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
          >
            Save Route
          </button>
          <button
            onClick={resetRoute}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="max-w-5xl mx-auto rounded shadow-lg overflow-hidden mb-6">
        <MapContainer center={center} zoom={15} style={{ height: "500px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />
          {animatedCoords.length > 0 && <Polyline positions={animatedCoords} color="blue" />}
          {routeData.geometry.map((pt, idx) => (
            <Marker key={idx} position={pt}>
              <Popup>Step {idx + 1}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Directions */}
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-2">🧭 Directions</h3>
        {routeData.directions.length > 0 ? (
          <ol className="list-decimal ml-6">
            {routeData.directions.map((step, idx) => (
              <li key={idx} className="mb-1">{step}</li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500">Enter coordinates or paste GraphHopper URL and click "Get Route"</p>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
