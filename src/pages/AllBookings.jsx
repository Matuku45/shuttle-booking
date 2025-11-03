import React, { useState, useEffect } from "react";
import { FaCar, FaRoute, FaUser, FaChair, FaPhone, FaMoneyBillWave } from "react-icons/fa";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add a dummy booking for testing
  useEffect(() => {
    const dummyBooking = {
      id: -1,
      passengerName: "Test Passenger",
      email: "test@example.com",
      phone: "0123456789",
      route: "Pretoria -> Cape Town",
      date: "2025-10-05",
      time: "22:36",
      seats: 1,
      price: 100,
      car: "MetroShuttle Bus <c1234555666>",
      from: "Pretoria",
      to: "Cape Town",
    };
    setBookings((prev) => [dummyBooking, ...prev]);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("https://shuttle-booking-system.fly.dev/api/bookings");
        const data = await response.json();

        if (data.success && Array.isArray(data.bookings)) {
          const apiBookings = data.bookings.map((b) => ({
            ...b,
            from: b.route?.split(" -> ")[0] || "",
            to: b.route?.split(" -> ")[1] || "",
          }));
          setBookings(apiBookings);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error("Error fetching bookings from API:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <p className="text-blue-700 text-lg font-semibold">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-6 px-4">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-blue-900 drop-shadow-md">
        🛡️ Admin Dashboard - All Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-700 font-semibold text-lg">
          No bookings found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 rounded-2xl shadow-xl p-5 border-l-8 border-blue-600 transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                  <FaUser /> {b.passengerName}
                </h3>
                <span className="text-sm sm:text-base font-semibold text-white">
                  {new Date(b.date).toLocaleDateString()} {b.time}
                </span>
              </div>

              <div className="space-y-2 text-white">
                <p className="flex items-center gap-2">
                  <FaCar className="text-yellow-300" /> {b.car}
                </p>
                <p className="flex items-center gap-2">
                  <FaRoute className="text-green-200" /> {b.from} → {b.to}
                </p>
                <p className="flex items-center gap-2">
                  <FaChair className="text-orange-200" /> Seats: {b.seats}
                </p>
                <p className="flex items-center gap-2 font-semibold">
                  <FaMoneyBillWave className="text-green-200" /> R {b.price}
                </p>
                <p className="flex items-center gap-2 text-sm truncate">
                  <FaPhone className="text-blue-100" /> {b.phone} | {b.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBookings;
