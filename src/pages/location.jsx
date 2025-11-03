import React, { useState } from "react";

const LocationPage = () => {
  const [graphhopperUrl, setGraphhopperUrl] = useState(
    "https://graphhopper.com/maps/?point=-23.8916%2C29.8772_Current+Location&point=&profile=car&layer=Omnisc"
  );

  const handleRedirect = () => {
    if (!graphhopperUrl.startsWith("https://graphhopper.com/maps")) {
      alert("Please enter a valid GraphHopper Maps URL.");
      return;
    }
    window.open(graphhopperUrl, "_blank"); // open GraphHopper in a new tab
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        🚐 Shuttle Route Viewer — GraphHopper API
      </h2>

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

        <button
          onClick={handleRedirect}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
        >
          🌍 Open GraphHopper Map
        </button>

        <p className="text-gray-500 text-sm mt-4 text-center">
          You’ll be redirected to the live GraphHopper route viewer using the
          provided URL.
        </p>
      </div>

      <footer className="mt-10 text-gray-500 text-sm">
        Built with ❤️ using GraphHopper API integration
      </footer>
    </div>
  );
};

export default LocationPage;
