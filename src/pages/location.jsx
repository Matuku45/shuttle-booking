import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Corrected dummy coordinates: [latitude, longitude]
const dummyRoute = {
  geometry: [
    [-26.17248, 28.05364],
    [-26.17272, 28.05357],
    [-26.17289, 28.05348],
    [-26.17305, 28.05337],
    [-26.1732, 28.05324],
    [-26.17328, 28.05316],
  ],
  directions: [
    "Start at Point A",
    "Turn right onto Street 1",
    "Continue straight for 200m",
    "Turn left onto Street 2",
    "Arrive at destination",
  ],
};

const LocationPage = () => {
  const [routeData, setRouteData] = useState(dummyRoute);
  const [animatedCoords, setAnimatedCoords] = useState([]);

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
    }, 400); // animation speed

    return () => clearInterval(interval);
  }, [routeData]);

  // ✅ Safe file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.geometry && Array.isArray(json.geometry)) {
          setRouteData(json);
        } else {
          alert("Invalid JSON structure. Must include 'geometry' array.");
        }
      } catch (err) {
        alert("Invalid JSON file");
      }
    };

    reader.readAsText(file);
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
        🚐 Shuttle Route Viewer
      </h2>

      <div className="mb-4 text-center">
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      <div className="rounded overflow-hidden shadow-lg mb-6">
        <MapContainer
          center={center}
          zoom={15}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />

          {animatedCoords.length > 0 && (
            <>
              <Polyline positions={animatedCoords} color="blue" />
              <Marker position={animatedCoords[animatedCoords.length - 1]}>
                <Popup>Current Position</Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>

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
          <p>No directions available.</p>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
