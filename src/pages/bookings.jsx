import React, { useState, useEffect } from "react";

// Car options
const carsList = [
  { name: "Benz", numberPlate: "CA 123 456", registrationNumber: "REG-001", seats: 4 },
  { name: "Honda Family Car", numberPlate: "CB 789 321", registrationNumber: "REG-002", seats: 6 },
  { name: "Polo", numberPlate: "CC 654 987", registrationNumber: "REG-003", seats: 5 },
];

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [userName, setUserName] = useState("Passenger");
  const [editingSeat, setEditingSeat] = useState(null);
  const [editingCar, setEditingCar] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.name) setUserName(user.name);

    const saved = JSON.parse(localStorage.getItem("bookings")) || [];
    const updated = saved.map((b) => ({
      ...b,
      passengerName: b.passengerName || user?.name || "Passenger",
      seatNumber: b.seatNumber || 1,
    }));

    const filtered = updated.filter((b) => b.passengerName === (user?.name || "Passenger"));
    setBookings(filtered);
  }, []);

  const saveBookings = (updated) => {
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
  };

  const handleSeatsChange = (bookingId, newSeats) => {
    const updated = bookings.map((b) =>
      b.id === bookingId
        ? { ...b, seats: Number(newSeats), price: (b.price / b.seats) * Number(newSeats) }
        : b
    );
    saveBookings(updated);
  };

  const handleCarChange = (bookingId, newCarName) => {
    const newCar = carsList.find((c) => c.name === newCarName);
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, car: newCar } : b
    );
    saveBookings(updated);
  };

  const handleDeleteBooking = (bookingId) => {
    const updated = bookings.filter((b) => b.id !== bookingId);
    saveBookings(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-gray-300">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-10 text-center tracking-wide drop-shadow-sm">
          🚐 {userName}'s Shuttle Bookings
        </h2>

        {bookings.length === 0 ? (
          <p className="text-gray-700 text-center font-semibold text-lg">
            No bookings found for {userName}.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-gradient-to-br from-white to-blue-50 border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {b.route}
                </h3>
                <p className="text-gray-700 mb-1">
                  📅 <strong>Date:</strong> {b.date}
                </p>
                <p className="text-gray-700 mb-1">
                  ⏰ <strong>Time:</strong> {b.time}
                </p>
                <p className="text-gray-700 mb-1">
                  🚗 <strong>Car:</strong> {b.car.name} ({b.car.numberPlate})
                </p>
                <p className="text-gray-700 mb-1">
                  💺 <strong>Seats:</strong> {b.seats}
                </p>
                <p className="text-gray-700 mb-1">
                  🔢 <strong>Seat No:</strong> {b.seatNumber}
                </p>
                <p className="text-gray-900 font-extrabold mt-3">
                  💰 <strong>Price:</strong> R{b.price}
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    onClick={() => setEditingSeat(b.id)}
                    className="bg-blue-600 text-white font-extrabold text-sm px-5 py-2 rounded-lg hover:bg-blue-500 shadow-md hover:scale-105 transition-transform"
                  >
                    ✏️ Edit Seats
                  </button>

                  <button
                    onClick={() => setEditingCar(b.id)}
                    className="bg-green-600 text-white font-extrabold text-sm px-5 py-2 rounded-lg hover:bg-green-500 shadow-md hover:scale-105 transition-transform"
                  >
                    🚗 Change Car
                  </button>

                  <button
                    onClick={() => handleDeleteBooking(b.id)}
                    className="bg-red-600 text-white font-extrabold text-sm px-5 py-2 rounded-lg hover:bg-red-500 shadow-md hover:scale-105 transition-transform"
                  >
                    ❌ Delete
                  </button>
                </div>

                {/* EDIT SEATS SECTION */}
                {editingSeat === b.id && (
                  <div className="mt-5 bg-white border border-blue-300 rounded-lg p-4 shadow-inner">
                    <h4 className="text-center font-bold text-blue-800 mb-3">
                      ✏️ Edit Seats
                    </h4>
                    <input
                      type="number"
                      min="1"
                      max={b.car.seats}
                      value={b.seats}
                      onChange={(e) => handleSeatsChange(b.id, e.target.value)}
                      className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 text-center font-semibold text-gray-900"
                    />
                    <button
                      onClick={() => setEditingSeat(null)}
                      className="mt-3 bg-blue-700 text-white font-extrabold px-4 py-2 rounded-lg hover:bg-blue-600 w-full transition shadow-lg"
                    >
                      ✅ Save
                    </button>
                  </div>
                )}

                {/* CHANGE CAR SECTION */}
                {editingCar === b.id && (
                  <div className="mt-5 bg-white border border-green-300 rounded-lg p-4 shadow-inner">
                    <h4 className="text-center font-bold text-green-800 mb-3">
                      🚗 Change Car
                    </h4>
                    <select
                      value={b.car.name}
                      onChange={(e) => handleCarChange(b.id, e.target.value)}
                      className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-400 font-semibold text-gray-900"
                    >
                      {carsList.map((c) => (
                        <option key={c.registrationNumber} value={c.name}>
                          {c.name} ({c.numberPlate})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setEditingCar(null)}
                      className="mt-3 bg-green-700 text-white font-extrabold px-4 py-2 rounded-lg hover:bg-green-600 w-full transition shadow-lg"
                    >
                      ✅ Save
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
