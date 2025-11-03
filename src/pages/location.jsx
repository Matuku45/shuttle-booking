import React, { useState } from "react";

const LocationPage = () => {
  const [graphhopperUrl, setGraphhopperUrl] = useState(
    "https://graphhopper.com/maps/?point=-23.8916%2C29.8772_Current+Location&point=-23.9050%2C29.8900&profile=car&layer=Omnisc"
  );
  const [coordinates, setCoordinates] = useState([]);
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(false);

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

      // ✅ Fetch route directions from GraphHopper API
      const apiKey = "YOUR_API_KEY_HERE"; // Replace with your GraphHopper key
      const apiUrl = `https://graphhopper.com/api/1/route?point=${parsedCoords[0][0]},${parsedCoords[0][1]}&point=${parsedCoords[1][0]},${parsedCoords[1][1]}&vehicle=car&locale=en&points_encoded=false&key=${apiKey}`;

      const response = await fetch(apiUrl);
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
        <div className="mt-6 bg-white shadow-md rounded-xl p-4 w-full max-w-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            📌 Extracted Coordinates
          </h3>
          <ul className="list-disc ml-6 text-gray-700">
            {coordinates.map(([lat, lon], idx) => (
              <li key={idx}>
                <strong>Point {idx + 1}:</strong> Latitude {lat}, Longitude{" "}
                {lon}
              </li>
            ))}
          </ul>
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
          </div>
        )
      )}

      <footer className="mt-10 text-gray-500 text-sm">
        Built with ❤️ using GraphHopper Directions API
      </footer>
    </div>
  );
};

export default LocationPage;
