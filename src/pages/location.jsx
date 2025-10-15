import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
    "Arrive at destination"
  ]
};

const LocationPage = () => {
  const [routeData, setRouteData] = useState(dummyRoute);
  const [animatedCoords, setAnimatedCoords] = useState([]);

  // Animate route
  useEffect(() => {
    if (!routeData || !routeData.geometry) return;

    setAnimatedCoords([]);
    const coords = routeData.geometry;
    let index = 0;

    const interval = setInterval(() => {
      if (index < coords.length) {
        setAnimatedCoords((prev) => [...prev, coords[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 300); // speed of animation

    return () => clearInterval(interval);
  }, [routeData]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setRouteData(json);
      } catch (err) {
        alert("Invalid JSON file");
      }
    };

    reader.readAsText(file);
  };

  const center = animatedCoords.length
    ? animatedCoords[0]
    : dummyRoute.geometry[0];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Shuttle Route Viewer</h2>

      <div className="mb-4 text-center">
        <input type="file" accept=".json" onChange={handleFileUpload} />
      </div>

      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "500px", width: "100%", marginBottom: "20px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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

      <div className="bg-gray-100 p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Directions</h3>
        <ol className="list-decimal ml-6">
          {routeData.directions.map((step, idx) => (
            <li key={idx} className="mb-1">{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default LocationPage;
