import React, { useState } from "react";

// Dummy bookings data
const dummyBookings = [
  {
    id: 1,
    passengerName: "Thabiso Mapoulo",
    from: "Cape Town",
    to: "Stellenbosch",
    date: "2025-10-15",
    seats: 2,
    price: 150,
    car: "Mercedes Benz",
  },
  {
    id: 2,
    passengerName: "Naledi Mokoena",
    from: "Johannesburg",
    to: "Pretoria",
    date: "2025-10-16",
    seats: 4,
    price: 300,
    car: "Hyundai Family Car",
  },
  {
    id: 3,
    passengerName: "Lerato Khumalo",
    from: "Durban",
    to: "Pietermaritzburg",
    date: "2025-10-17",
    seats: 1,
    price: 100,
    car: "VW Polo",
  },
];

const AllBookings = () => {
  const [bookings, setBookings] = useState(dummyBookings);

  const deleteBooking = (id) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl p-6 border border-gray-300">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900 drop-shadow-sm">
          📋 All Bookings
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-xl overflow-hidden">
            <thead className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black">
              <tr>
                <th className="p-3 border">Passenger</th>
                <th className="p-3 border">Route</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Seats</th>
                <th className="p-3 border">Price (R)</th>
                <th className="p-3 border">Car</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {bookings.map((b) => (
                <tr key={b.id} className="even:bg-gray-50">
                  <td className="p-3 border text-center">{b.passengerName}</td>
                  <td className="p-3 border text-center">
                    {b.from} → {b.to}
                  </td>
                  <td className="p-3 border text-center">{b.date}</td>
                  <td className="p-3 border text-center">{b.seats}</td>
                  <td className="p-3 border text-center font-bold text-green-700">
                    {b.price}
                  </td>
                  <td className="p-3 border text-center">{b.car}</td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => deleteBooking(b.id)}
                      className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-500 shadow-md transition"
                    >
                    ❌ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AllBookings;
