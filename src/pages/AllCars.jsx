import React, { useState, useEffect } from "react";
import Benz from "../components/gallery/benz.webp";
import Hybdai from "../components/gallery/hyndaifamilycar.webp";
import Polo from "../components/gallery/polo.webp";

const AdminAllCars = () => {
  const [cars, setCars] = useState([
    { id: 1, name: "Mercedes Benz", numberPlate: "CB 456 123", seats: 6, route: "", image: Benz },
    { id: 2, name: "Hyundai Family Car", numberPlate: "CB 789 321", seats: 8, route: "", image: Hybdai },
    { id: 3, name: "VW Polo", numberPlate: "CB 123 987", seats: 4, route: "", image: Polo },
  ]);

  const [shuttleRoutes, setShuttleRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  const [newCar, setNewCar] = useState({
    name: "",
    numberPlate: "",
    seats: 1,
    route: "",
    image: null,
  });

  const [editingCarId, setEditingCarId] = useState(null);
  const [editingCarData, setEditingCarData] = useState({});

  // Fetch routes from backend
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await fetch("https://shuttle-booking-system.fly.dev/api/shuttles");
        if (!res.ok) throw new Error("Failed to fetch shuttles");

        const data = await res.json();
        const shuttles = Array.isArray(data.shuttles) ? data.shuttles : [];
        const routes = [...new Set(shuttles.map((s) => s.route).filter(Boolean))];

        setShuttleRoutes(routes);
      } catch (err) {
        console.error("Error fetching routes:", err);
        setShuttleRoutes([]);
      } finally {
        setLoadingRoutes(false);
      }
    };

    fetchRoutes();
  }, []);

  const handleAddCar = () => {
    if (!newCar.name || !newCar.numberPlate || !newCar.image || !newCar.route) {
      alert("Please fill all fields, upload an image, and select a route!");
      return;
    }

    setCars([...cars, { ...newCar, id: Date.now() }]);
    setNewCar({ name: "", numberPlate: "", seats: 1, route: "", image: null });
  };

  const handleDeleteCar = (id) => {
    setCars(cars.filter((c) => c.id !== id));
  };

  const startEditing = (car) => {
    setEditingCarId(car.id);
    setEditingCarData({ ...car });
  };

  const saveEdit = (id) => {
    if (!editingCarData.name || !editingCarData.numberPlate || !editingCarData.route) {
      alert("Please fill all fields and select a route!");
      return;
    }
    setCars(cars.map((c) => (c.id === id ? editingCarData : c)));
    setEditingCarId(null);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">🚗 Manage Department Cars</h1>

      {/* Add New Car Section */}
      <div className="w-full max-w-4xl mb-10 bg-white shadow-xl rounded-3xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">➕ Add New Car</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Car Name"
            value={newCar.name}
            onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="text"
            placeholder="Number Plate"
            value={newCar.numberPlate}
            onChange={(e) => setNewCar({ ...newCar, numberPlate: e.target.value })}
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="number"
            min="1"
            placeholder="Seats"
            value={newCar.seats}
            onChange={(e) => setNewCar({ ...newCar, seats: Number(e.target.value) })}
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400"
          />

          {/* Route select */}
          {loadingRoutes ? (
            <p className="text-gray-500 py-2">Loading routes...</p>
          ) : (
            <select
              value={newCar.route}
              onChange={(e) => setNewCar({ ...newCar, route: e.target.value })}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Shuttle Route</option>
              {shuttleRoutes.map((route, index) => (
                <option key={index} value={route}>
                  {route}
                </option>
              ))}
            </select>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) setNewCar({ ...newCar, image: URL.createObjectURL(file) });
            }}
            className="border px-3 py-2 rounded-lg"
          />

          <button
            onClick={handleAddCar}
            className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition col-span-1 md:col-span-2"
          >
            Add Car
          </button>
        </div>
      </div>

      {/* Cars List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-52 object-cover rounded-xl mb-4 shadow-md"
            />

            {editingCarId === car.id ? (
              <>
                <input
                  type="text"
                  value={editingCarData.name}
                  onChange={(e) => setEditingCarData({ ...editingCarData, name: e.target.value })}
                  className="border px-3 py-2 rounded-lg mb-2 w-full text-center"
                />
                <input
                  type="text"
                  value={editingCarData.numberPlate}
                  onChange={(e) =>
                    setEditingCarData({ ...editingCarData, numberPlate: e.target.value })
                  }
                  className="border px-3 py-2 rounded-lg mb-2 w-full text-center"
                />
                <input
                  type="number"
                  min="1"
                  value={editingCarData.seats}
                  onChange={(e) =>
                    setEditingCarData({ ...editingCarData, seats: Number(e.target.value) })
                  }
                  className="border px-3 py-2 rounded-lg mb-2 w-full text-center"
                />
                <select
                  value={editingCarData.route}
                  onChange={(e) => setEditingCarData({ ...editingCarData, route: e.target.value })}
                  className="border px-3 py-2 rounded-lg mb-2 w-full"
                >
                  <option value="">Select Shuttle Route</option>
                  {shuttleRoutes.map((route, index) => (
                    <option key={index} value={route}>
                      {route}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => saveEdit(car.id)}
                  className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-600 w-full"
                >
                  💾 Save
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{car.name}</h2>
                <p className="text-gray-600 mb-1">Number Plate: {car.numberPlate}</p>
                <p className="text-gray-600 font-medium mb-1">Seats: {car.seats}</p>
                <p className="text-gray-600 font-medium mb-4">Route: {car.route || "-"}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(car)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAllCars;
