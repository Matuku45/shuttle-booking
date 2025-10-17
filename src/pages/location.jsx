import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Helper component to select points by clicking on the map
const MapClickHandler = ({ addPoint }) => {
  useMapEvents({
    click(e) {
      addPoint([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const LocationPage = () => {
  const [routeData, setRouteData] = useState({ geometry: [], directions: [] });
  const [animatedCoords, setAnimatedCoords] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);

  // Animate route gradually
  useEffect(() => {
    if (!routeData.geometry || routeData.geometry.length === 0) return;
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

  // Add clicked point to selectedPoints
  const addPoint = (point) => setSelectedPoints((prev) => [...prev, point]);

  // GET route from backend
  const fetchRoute = async () => {
    if (selectedPoints.length < 2) return alert("Select at least 2 points on the map");
    try {
      const [origin, destination] = selectedPoints;
      const query = `origin=${origin[0]},${origin[1]}&destination=${destination[0]},${destination[1]}`;
      const res = await fetch(`http://localhost:3001/api/graphhopper/route?${query}`);
      const data = await res.json();
      if (data.success) {
        const decoded = decodePolyline(data.route.encoded_polyline);
        const instructions = data.route.instructions.map((i) => i.text || "Step");
        setRouteData({ geometry: decoded, directions: instructions });
      } else alert("No route returned");
    } catch (err) {
      console.error(err);
      alert("Error fetching route from backend");
    }
  };

  // POST route to backend
  const saveRoute = async () => {
    if (routeData.geometry.length === 0) return alert("No route to save");
    try {
      const payload = routeData;
      const res = await fetch("http://localhost:3001/api/graphhopper/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      alert(data.message || "Route saved successfully");
    } catch (err) {
      console.error(err);
      alert("Error saving route to backend");
    }
  };

  // Decode GraphHopper polyline
  const decodePolyline = (encoded) => {
    if (!encoded) return [];
    const coords = L.Polyline.fromEncoded(encoded).getLatLngs();
    return coords.map((c) => [c.lat, c.lng]);
  };

  // Reset map points
  const resetMap = () => {
    setSelectedPoints([]);
    setRouteData({ geometry: [], directions: [] });
    setAnimatedCoords([]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        🗺️ Shuttle Route Explorer
      </h2>

      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={fetchRoute}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Get Route
        </button>
        <button
          onClick={saveRoute}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
        >
          Save Route
        </button>
        <button
          onClick={resetMap}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 font-semibold"
        >
          Reset
        </button>
      </div>

      <div className="rounded shadow-lg overflow-hidden mb-6">
        <MapContainer center={center} zoom={15} style={{ height: "500px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />

          <MapClickHandler addPoint={addPoint} />

          {selectedPoints.map((pt, idx) => (
            <Marker key={idx} position={pt}>
              <Popup>Point {idx + 1}</Popup>
            </Marker>
          ))}

          {animatedCoords.length > 0 && (
            <Polyline positions={animatedCoords} color="blue" />
          )}
        </MapContainer>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2 text-blue-700">🧭 Directions</h3>
        {routeData.directions.length > 0 ? (
          <ol className="list-decimal ml-6">
            {routeData.directions.map((step, idx) => (
              <li key={idx} className="mb-1">{step}</li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500">Click on the map to select points and fetch route</p>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
