import React, { useState, useEffect } from "react";
import { FaCar, FaRoute, FaClock, FaGlobeAfrica, FaPhone, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://shuttle-booking-system.fly.dev"; // Production API base URL

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [timers, setTimers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get logged-in user's email from localStorage
  const loggedInEmail = JSON.parse(localStorage.getItem("user"))?.email?.toLowerCase();

  // Add one dummy booking for testing
  useEffect(() => {
    const dummyBooking = {
      id: 999999,
      passengerName: "Test Passenger",
      email: loggedInEmail || "test@example.com",
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
  }, [loggedInEmail]);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/bookings`);
        const data = await res.json();

        if (data.success && Array.isArray(data.bookings)) {
          // Filter bookings by logged-in email (ignore case)
          const filteredBookings = data.bookings
            .filter((b) => b.email?.toLowerCase() === loggedInEmail)
            .map((b) => ({
              ...b,
              from: b.route?.split(" -> ")[0] || "",
              to: b.route?.split(" -> ")[1] || "",
            }));
          setBookings((prev) => [...prev, ...filteredBookings]); // Append API bookings after dummy
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (loggedInEmail) fetchBookings();
    else {
      setLoading(false);
    }
  }, [loggedInEmail]);

  // Countdown timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      bookings.forEach((b) => {
        const bookingTime = new Date(b.date).getTime();
        const now = new Date().getTime();
        const diff = bookingTime - now;
        if (diff > 0) {
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          newTimers[b.id] = `${h}h ${m}m ${s}s`;
        } else newTimers[b.id] = "Time passed";
      });
      setTimers(newTimers);
    }, 1000);
    return () => clearInterval(interval);
  }, [bookings]);

  const handleEdit = (booking) => setEditingBooking(booking);

  const handleFieldChange = (e, booking, field) => {
    const updatedBookings = bookings.map((b) =>
      b.id === booking.id ? { ...b, [field]: e.target.value } : b
    );
    setBookings(updatedBookings);
  };

  const goToLocation = () => navigate("/location");

  // Update booking in API
  const handleUpdateBooking = async (booking) => {
    try {
      const updatedBooking = {
        ...booking,
        price: Number(booking.seats) * 75, // Example: dynamic pricing
      };

      const res = await fetch(`${BASE_URL}/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Failed to update booking");

      const updatedBookings = bookings.map((b) => (b.id === booking.id ? updatedBooking : b));
      setBookings(updatedBookings);
      setEditingBooking(null);

      // Redirect to Stripe payment
      window.open("https://buy.stripe.com/test_7sY28t91X6gegc8gDwcwg00", "_blank");
      alert("✅ Booking updated and payment saved!");
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("❌ Failed to update booking!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <p className="text-blue-700 text-lg font-semibold">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-100 py-6 px-4">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-blue-900 drop-shadow-md">
        🛡️ My Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-700 font-semibold text-lg">
          No bookings found for your account.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 rounded-2xl shadow-xl p-5 border-l-8 border-blue-600 transform hover:scale-105 transition-all duration-300 relative"
            >
              <div className="absolute top-4 right-4 flex items-center gap-1 text-sm font-semibold text-red-600">
                <FaClock /> {timers[b.id]}
              </div>

              <h3 className="font-bold text-xl text-white mb-3">{b.passengerName}</h3>

              <p className="text-sm text-white flex items-center gap-2">
                <FaCar className="text-yellow-300" /> {b.car}
              </p>
              <p className="text-sm text-white flex items-center gap-2">
                <FaRoute className="text-green-200" /> {b.from} → {b.to}
              </p>

              <div className="my-3 space-y-2 text-white">
                <label className="block text-sm font-semibold">Seats:</label>
                {editingBooking?.id === b.id ? (
                  <input
                    type="number"
                    value={b.seats}
                    onChange={(e) => handleFieldChange(e, b, "seats")}
                    className="border border-gray-300 rounded-md p-2 w-full text-black"
                  />
                ) : (
                  <p>{b.seats}</p>
                )}

                <label className="block text-sm font-semibold">Phone:</label>
                {editingBooking?.id === b.id ? (
                  <input
                    type="tel"
                    value={b.phone}
                    onChange={(e) => handleFieldChange(e, b, "phone")}
                    className="border border-gray-300 rounded-md p-2 w-full text-black"
                  />
                ) : (
                  <p className="flex items-center gap-2">
                    <FaPhone /> {b.phone}
                  </p>
                )}

                <p className="text-lg font-semibold text-green-200">
                  💰 R {b.price}
                </p>

                <p className="flex items-center gap-2 text-sm">
                  <FaEnvelope /> {b.email}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between mt-4 gap-3">
                <button
                  onClick={goToLocation}
                  className="flex-1 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white px-3 py-2 rounded-lg shadow-md text-sm sm:text-base"
                >
                  <FaGlobeAfrica className="inline mr-2" /> View Location
                </button>

                {editingBooking?.id === b.id ? (
                  <button
                    onClick={() => handleUpdateBooking(b)}
                    className="flex-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white px-3 py-2 rounded-lg shadow-md text-sm sm:text-base"
                  >
                    Update & Pay
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(b)}
                    className="flex-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white px-3 py-2 rounded-lg shadow-md text-sm sm:text-base"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBookings;
