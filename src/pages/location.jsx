import React, { useState, useEffect } from "react";
import { MapContainer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Default route (placeholder before user inputs GraphHopper URL)
const dummyRoute = {
  geometry: [
    [-26.17248, 28.05364],
    [-26.17272, 28.05357],
    [-26.17289, 28.05348],
  ],
  directions: ["Awaiting GraphHopper route input..."],
};

const LocationPage = () => {
  const [routeData, setRouteData] = useState(dummyRoute);
  const [animatedCoords, setAnimatedCoords] = useState([]);
  const [graphhopperUrl, setGraphhopperUrl] = useState("");

  // ✅ Animate route gradually
  useEffect(() => {
    if (!routeData || !routeData.geometry || routeData.geometry.length === 0)
      return;

    setAnimatedCoords([]);
    const coords = routeData.geometry;
    let index = 0;

    const interval = setInterval(() => {
      if (index < coords.length) {
        const next = coords[index];
        if (next && next.length === 2) {
          setAnimatedCoords((prev) => [...prev, next]);
        }
        index++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [routeData]);

  // ✅ Extract coordinates from GraphHopper URL and fetch route
  const handleGraphhopperSubmit = async () => {
    if (!graphhopperUrl.includes("graphhopper.com/maps")) {
      alert("Please enter a valid GraphHopper Maps URL.");
      return;
    }

    try {
      // Example URL:
      // https://graphhopper.com/maps/?point=-23.8916%2C29.8772_Current+Location&point=-23.9050%2C29.8900&profile=car
      const urlParams = new URL(graphhopperUrl).searchParams;
      const points = urlParams.getAll("point");

      if (points.length < 2) {
        alert("Please provide at least 2 points in your GraphHopper URL.");
        return;
      }

      const start = points[0].split(",").map((v) => parseFloat(v));
      const end = points[1].split(",").map((v) => parseFloat(v));

      // ✅ Call GraphHopper Directions API
      const apiKey = "YOUR_API_KEY_HERE"; // replace with your key
      const apiUrl = `https://graphhopper.com/api/1/route?point=${start[0]},${start[1]}&point=${end[0]},${end[1]}&vehicle=car&locale=en&key=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.paths || data.paths.length === 0) {
        alert("No routes found from GraphHopper.");
        return;
      }

      const path = data.paths[0];
      const coords = path.points.coordinates.map((c) => [c[1], c[0]]); // flip [lng, lat] → [lat, lng]

      setRouteData({
        geometry: coords,
        directions: path.instructions
          ? path.instructions.map((ins) => ins.text)
          : ["Route loaded successfully!"],
      });
    } catch (err) {
      console.error(err);
      alert("Error fetching GraphHopper route.");
    }
  };

  const center =
    animatedCoords.length > 0
      ? animatedCoords[0]
      : routeData.geometry && routeData.geometry.length > 0
      ? routeData.geometry[0]
      : [-26.17248, 28.05364]; // fallback center

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        🚐 Shuttle Route Viewer (GraphHopper)
      </h2>

      {/* ✅ Input for GraphHopper URL */}
      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Paste GraphHopper Maps URL here..."
          value={graphhopperUrl}
          onChange={(e) => setGraphhopperUrl(e.target.value)}
          className="border border-gray-400 p-2 rounded w-3/4"
        />
        <button
          onClick={handleGraphhopperSubmit}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Get Route from GraphHopper
        </button>
      </div>

      {/* ✅ GraphHopper Map Visualization */}
      <div className="rounded overflow-hidden shadow-lg mb-6">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: "500px", width: "100%" }}
        >
          {animatedCoords.length > 0 && (
            <>
              <Polyline positions={animatedCoords} color="blue" />
              <Marker position={animatedCoords[animatedCoords.length - 1]}>
                <Popup>🚐 Current Position</Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>

      {/* ✅ Directions List */}
      <div className="bg-gray-100 p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">🧭 Directions</h3>
        {routeData.directions && routeData.directions.length > 0 ? (
          <ol className="list-decimal ml-6">
            {routeData.directions.map((step, idx) => (
              <li key={idx} className="mb-1">
                {step}
              </li>
            ))}
          </ol>
        ) : (
          <p>No directions available yet.</p>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
