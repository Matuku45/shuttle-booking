import React, { useState } from "react";

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
        const [lat, lon] = p
          .replace("_Current+Location", "")
          .split(",")
          .map((v) => parseFloat(v));
        return [lat, lon];
      });

      setCoordinates(parsedCoords);
      setLoading(true);

      // ✅ Fetch addresses for coordinates using reverse geocoding
      const apiKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY;
      if (!apiKey) {
        alert("GraphHopper API key is not configured. Please set VITE_GRAPHHOPPER_API_KEY in your environment variables.");
        setLoading(false);
        return;
      }
      const addressPromises = parsedCoords.map(async ([lat, lon]) => {
        const geocodeUrl = `https://graphhopper.com/api/1/geocode?point=${lat},${lon}&reverse=true&locale=en&key=${apiKey}`;
        const response = await fetch(geocodeUrl);
        if (!response.ok) {
          console.error(`Geocoding failed for ${lat},${lon}: ${response.status}`);
          return { city: "Unknown City", address: "Unknown Address" };
        }
        const data = await response.json();
        if (data.hits && data.hits.length > 0) {
          const hit = data.hits[0];
          return {
            city: hit.city || hit.name || "Unknown City",
            address: hit.name || "Unknown Address"
          };
        }
        return { city: "Unknown City", address: "Unknown Address" };
      });

      const fetchedAddresses = await Promise.all(addressPromises);
      setAddresses(fetchedAddresses);

      // ✅ Fetch route directions from GraphHopper API
      const apiUrl = `https://graphhopper.com/api/1/route?point=${parsedCoords[0][0]},${parsedCoords[0][1]}&point=${parsedCoords[1][0]},${parsedCoords[1][1]}&vehicle=car&locale=en&points_encoded=false&key=${apiKey}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        console.error(`Route fetch failed: ${response.status}`);
        alert("Failed to fetch route from GraphHopper. Please check your API key and try again.");
        setLoading(false);
        return;
      }
      const data = await response.json();

      if (!data.paths || data.paths.length === 0) {
        alert("No route found from GraphHopper.");
        setLoading(false);
        return;
      }

      const instructions = data.paths[0].instructions.map((step, idx) => ({
        text: step.text,
        distance: (step.distance / 1000).toFixed(2),
        time: Math.round(step.time / 60000), // in minutes
      }));

      setDirections(instructions);

      // ✅ Create path string from directions
      const pathString = instructions.map(step => step.text).join(" -> ");
      setPath(pathString);

      // ✅ Send directions to backend API
      if (email && addresses.length > 0) {
        try {
          const backendResponse = await fetch('https://my-payment-session-shuttle-system-cold-glade-4798.fly.dev/api/directions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              path: pathString,
            }),
          });
          const backendData = await backendResponse.json();
          console.log('Directions saved to backend:', backendData);
        } catch (backendError) {
          console.error('Error saving to backend:', backendError);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Error extracting or fetching directions.");
      setLoading(false);
    }
  };

  // ✅ Redirect to GraphHopper map
  const handleRedirect = () => {
    window.open(graphhopperUrl, "_blank");
  };

  // ✅ Save directions to backend
  const handleSaveDirections = async () => {
    if (!email || addresses.length === 0) {
      alert("Please enter your email and extract directions first.");
      return;
    }

    setSaving(true);
    try {
      const fullDirectionsData = {
        coordinates,
        addresses,
        directions,
        path,
      };
      const response = await fetch('https://my-payment-session-shuttle-system-cold-glade-4798.fly.dev/api/directions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          path: JSON.stringify(fullDirectionsData),
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Directions saved successfully!");
        fetchSavedDirections(); // Refresh saved directions after saving
      } else {
        alert("Failed to save directions.");
      }
    } catch (error) {
      console.error('Error saving directions:', error);
      alert("Error saving directions.");
    }
    setSaving(false);
  };

  // ✅ Fetch saved directions from backend
  const fetchSavedDirections = async () => {
    try {
      const response = await fetch(`https://my-payment-session-shuttle-system-cold-glade-4798.fly.dev/api/directions?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (data.success && data.directions) {
        setSavedDirections(data.directions);
      }
    } catch (error) {
      console.error('Error fetching saved directions:', error);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        🚐 Shuttle Route Viewer — GraphHopper API
      </h2>



      {/* ✅ URL input section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl">
        <label className="block text-gray-700 font-semibold mb-2 text-center">
          Enter or Paste GraphHopper Maps URL:
        </label>

        <input
          type="text"
          value={graphhopperUrl}
          onChange={(e) => setGraphhopperUrl(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleExtractAndDirections}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
          >
            📍 Extract Coordinates & Directions
          </button>

          <button
            onClick={handleRedirect}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
          >
            🌍 Open in GraphHopper
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-4 text-center">
          Paste your GraphHopper route link above to get coordinates and
          step-by-step directions.
        </p>
      </div>

      {/* ✅ Coordinates */}
      {coordinates.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-100 shadow-lg rounded-2xl p-6 w-full max-w-xl border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-2">📌</span> Extracted Coordinates & Locations
          </h3>
          <div className="space-y-4">
            {coordinates.map(([lat, lon], idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold text-blue-600">Point {idx + 1}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
               <div className="flex items-center">
                    <span className="text-gray-600 mr-2">📍</span>
                    <span><strong>Latitude:</strong> {lat}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">📍</span>
                    <span><strong>Longitude:</strong> {lon}</span>
                  </div>
                  {addresses[idx] && (
                    <>
                      <div className="flex items-center col-span-1 md:col-span-2">
                        <span className="text-gray-600 mr-2">🏙️</span>
                        <span><strong>City:</strong> {addresses[idx].city}</span>
                      </div>
                      <div className="flex items-center col-span-1 md:col-span-2">
                        <span className="text-gray-600 mr-2">🏠</span>
                        <span><strong>Address:</strong> {addresses[idx].address}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Directions list */}
      {loading ? (
        <p className="mt-4 text-blue-600 font-semibold animate-pulse">
          Fetching directions...
        </p>
      ) : (
        directions.length > 0 && (
          <div className="mt-6 bg-white shadow-md rounded-xl p-4 w-full max-w-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              🧭 Step-by-Step Directions
            </h3>
            <ol className="list-decimal ml-6 text-gray-700 space-y-1">
              {directions.map((step, idx) => (
                <li key={idx}>
                  {step.text} —{" "}
                  <span className="text-gray-500 text-sm">
                    {step.distance} km • {step.time} min
                  </span>
                </li>
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
        )
      )}

      {/* ✅ Saved Directions */}
      {savedDirections.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-teal-100 shadow-lg rounded-2xl p-6 w-full max-w-xl border border-green-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-2">📂</span> Saved Directions
          </h3>
          <div className="space-y-4">
            {savedDirections.map((saved, idx) => {
              let parsedData;
              try {
                parsedData = JSON.parse(saved.path);
              } catch (e) {
                parsedData = { path: saved.path };
              }
              return (
                <div key={saved.id || idx} className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-600 mb-2">Saved Route {idx + 1}</h4>
                  {parsedData.coordinates && parsedData.coordinates.length > 0 && (
                    <div className="mb-2">
                      <strong>Coordinates:</strong>
                      <ul className="list-disc ml-4 text-sm">
                        {parsedData.coordinates.map(([lat, lon], cidx) => (
                          <li key={cidx}>Lat: {lat}, Lon: {lon}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {parsedData.addresses && parsedData.addresses.length > 0 && (
                    <div className="mb-2">
                      <strong>Addresses:</strong>
                      <ul className="list-disc ml-4 text-sm">
                        {parsedData.addresses.map((addr, aidx) => (
                          <li key={aidx}>{addr.city}, {addr.address}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {parsedData.directions && parsedData.directions.length > 0 && (
                    <div className="mb-2">
                      <strong>Directions:</strong>
                      <ol className="list-decimal ml-4 text-sm">
                        {parsedData.directions.map((step, didx) => (
                          <li key={didx}>{step.text} ({step.distance} km, {step.time} min)</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {parsedData.path && (
                    <div className="text-sm text-gray-600">
                      <strong>Path Summary:</strong> {parsedData.path}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <footer className="mt-10 text-gray-500 text-sm">
        Built with ❤️ using GraphHopper Directions API
      </footer>
    </div>
  );
};

export default LocationPage;
