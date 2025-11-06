import React, { useState, useEffect } from "react";

const LocationPage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const email = user.email || "user@example.com";

  const [graphhopperUrl, setGraphhopperUrl] = useState(
    "https://graphhopper.com/maps/?point=-23.8916%2C29.8772_Current+Location&point=-23.9050%2C29.8900&profile=car&layer=Omnisc"
  );
  const [coordinates, setCoordinates] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [path, setPath] = useState("");
  const [savedDirections, setSavedDirections] = useState([]);

  // Fetch saved directions on mount
  useEffect(() => {
    fetchSavedDirections();
  }, []);

  // ✅ Extract coordinates & fetch directions
  const handleExtractAndDirections = async () => {
    if (!graphhopperUrl.startsWith("https://graphhopper.com/maps")) {
      alert("Please enter a valid GraphHopper Maps URL.");
      return;
    }

    try {
      const urlParams = new URL(graphhopperUrl).searchParams;
      const points = urlParams.getAll("point");

      if (points.length < 2) {
        alert("Please provide at least 2 points in the URL.");
        return;
      }

      const parsedCoords = points.map((p) => {
        const [lat, lon] = p.replace("_Current+Location", "").split(",").map(parseFloat);
        return [lat, lon];
      });

      setCoordinates(parsedCoords);
      setLoading(true);

      // Fetch addresses
      const apiKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY;
      if (!apiKey) {
        alert("GraphHopper API key is not configured. Set VITE_GRAPHHOPPER_API_KEY.");
        setLoading(false);
        return;
      }

      const addressPromises = parsedCoords.map(async ([lat, lon]) => {
        const geocodeUrl = `https://graphhopper.com/api/1/geocode?point=${lat},${lon}&reverse=true&locale=en&key=${apiKey}`;
        const res = await fetch(geocodeUrl);
        if (!res.ok) return { city: "Unknown City", address: "Unknown Address" };
        const data = await res.json();
        if (data.hits && data.hits.length > 0) {
          const hit = data.hits[0];
          return { city: hit.city || hit.name || "Unknown City", address: hit.name || "Unknown Address" };
        }
        return { city: "Unknown City", address: "Unknown Address" };
      });

      const fetchedAddresses = await Promise.all(addressPromises);
      setAddresses(fetchedAddresses);

      // Fetch directions
      const apiUrl = `https://graphhopper.com/api/1/route?point=${parsedCoords[0][0]},${parsedCoords[0][1]}&point=${parsedCoords[1][0]},${parsedCoords[1][1]}&vehicle=car&locale=en&points_encoded=false&key=${apiKey}`;
      const routeRes = await fetch(apiUrl);
      const routeData = await routeRes.json();

      if (!routeData.paths || routeData.paths.length === 0) {
        alert("No route found from GraphHopper.");
        setLoading(false);
        return;
      }

      const instructions = routeData.paths[0].instructions.map((step) => ({
        text: step.text,
        distance: (step.distance / 1000).toFixed(2),
        time: Math.round(step.time / 60000),
      }));

      setDirections(instructions);

      const pathString = instructions.map((s) => s.text).join(" -> ");
      setPath(pathString);
    } catch (err) {
      console.error(err);
      alert("Error extracting or fetching directions.");
    } finally {
      setLoading(false);
    }
  };

  // Save directions to backend
  const handleSaveDirections = async () => {
    if (!email || coordinates.length === 0 || directions.length === 0) {
      alert("Extract directions first.");
      return;
    }

    setSaving(true);
    try {
      const fullDirections = { coordinates, addresses, directions, path };
      const res = await fetch("https://my-payment-session-shuttle-system-cold-glade-4798.fly.dev/api/directions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, path: JSON.stringify(fullDirections) }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Directions saved successfully!");
        fetchSavedDirections();
      } else {
        alert("❌ Failed to save directions.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving directions.");
    }
    setSaving(false);
  };

  // Fetch saved directions
  const fetchSavedDirections = async () => {
    try {
      const res = await fetch(
        `https://my-payment-session-shuttle-system-cold-glade-4798.fly.dev/api/directions?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (data.success && data.directions) setSavedDirections(data.directions);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-gradient-to-br from-blue-50 to-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🚐 Shuttle Route Viewer
      </h2>

      {/* URL Input */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl mb-6">
        <label className="block text-gray-700 font-semibold mb-2 text-center">
          Paste GraphHopper Maps URL
        </label>
        <input
          type="text"
          value={graphhopperUrl}
          onChange={(e) => setGraphhopperUrl(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 transition"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleExtractAndDirections}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
          >
            📍 Extract Directions
          </button>
          <button
            onClick={() => window.open(graphhopperUrl, "_blank")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
          >
            🌍 Open in GraphHopper
          </button>
        </div>
      </div>

      {/* Coordinates & Addresses */}
      {coordinates.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 shadow-lg rounded-2xl p-6 w-full max-w-xl mb-6 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            📌 Extracted Coordinates & Locations
          </h3>
          <div className="space-y-4">
            {coordinates.map(([lat, lon], idx) => (
              <div key={idx} className="bg-white p-4 shadow-sm rounded-lg border-l-4 border-blue-500">
                <p><strong>Point {idx + 1}:</strong> Lat: {lat}, Lon: {lon}</p>
                {addresses[idx] && (
                  <>
                    <p>🏙️ City: {addresses[idx].city}</p>
                    <p>🏠 Address: {addresses[idx].address}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Directions */}
      {loading ? (
        <p className="mt-4 text-blue-600 font-semibold animate-pulse">Fetching directions...</p>
      ) : directions.length > 0 ? (
        <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-xl mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">🧭 Step-by-Step Directions</h3>
          <ol className="list-decimal ml-6 space-y-1 text-gray-700">
            {directions.map((step, idx) => (
              <li key={idx}>{step.text} — <span className="text-gray-500 text-sm">{step.distance} km • {step.time} min</span></li>
            ))}
          </ol>
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleSaveDirections}
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105"
            >
              {saving ? "Saving..." : "💾 Save Directions"}
            </button>
          </div>
        </div>
      ) : null}

      {/* Saved Directions */}
      {savedDirections.length > 0 && (
        <div className="bg-green-50 shadow-lg rounded-2xl p-6 w-full max-w-xl mb-6 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">📂 Saved Directions</h3>
          <div className="space-y-4">
            {savedDirections.map((saved, idx) => {
              let parsedData;
              try { parsedData = JSON.parse(saved.path); } catch { parsedData = { path: saved.path }; }
              return (
                <div key={saved.id || idx} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-600 mb-2">Saved Route {idx + 1}</h4>
                  {parsedData.coordinates && parsedData.coordinates.length > 0 && (
                    <ul className="list-disc ml-4 text-sm mb-2">
                      {parsedData.coordinates.map(([lat, lon], cidx) => <li key={cidx}>Lat: {lat}, Lon: {lon}</li>)}
                    </ul>
                  )}
                  {parsedData.addresses && parsedData.addresses.length > 0 && (
                    <ul className="list-disc ml-4 text-sm mb-2">
                      {parsedData.addresses.map((addr, aidx) => <li key={aidx}>{addr.city}, {addr.address}</li>)}
                    </ul>
                  )}
                  {parsedData.directions && parsedData.directions.length > 0 && (
                    <ol className="list-decimal ml-4 text-sm mb-2">
                      {parsedData.directions.map((step, didx) => <li key={didx}>{step.text} ({step.distance} km, {step.time} min)</li>)}
                    </ol>
                  )}
                  {parsedData.path && <div className="text-sm text-gray-600"><strong>Path Summary:</strong> {parsedData.path}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <footer className="mt-10 text-gray-500 text-sm">Built with ❤️ using GraphHopper Directions API</footer>
    </div>
  );
};

export default LocationPage;
