import React, { useState, useEffect } from "react";
import { FaCar, FaRoute, FaClock, FaGlobeAfrica, FaPhone, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://shuttle-booking-system.fly.dev";

const dummyBookings = [
  {
    id: 1,
    passengerName: "Thabiso Mapoulo",
    email: "thabiso.mapoulo@example.com",
    phone: "+27 82 555 1234",
    from: "Cape Town",
    to: "Stellenbosch",
    date: "2025-10-15T12:00:00",
    seats: 2,
    price: 150,
    car: "Mercedes Benz",
  },
  {
    id: 2,
    passengerName: "Naledi Mokoena",
    email: "naledi.mokoena@example.com",
    phone: "+27 82 999 4321",
    from: "Johannesburg",
    to: "Pretoria",
    date: "2025-10-16T09:00:00",
    seats: 4,
    price: 300,
    car: "Hyundai Family Car",
  },
];

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [timers, setTimers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings"));
    if (storedBookings?.length > 0) setBookings(storedBookings);
    else {
      setBookings(dummyBookings);
      localStorage.setItem("bookings", JSON.stringify(dummyBookings));
    }
  }, []);

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

  // Save payment to backend API
  const savePayment = async (booking) => {
    try {
      const paymentData = {
        passenger_name: booking.passengerName,
        passenger_phone: booking.phone,
        shuttle_id: booking.id,
        booking_id: booking.id,
        seats: booking.seats,
        amount: booking.price,
        status: "Paid",
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        car: booking.car,
      };

      const res = await fetch(`${BASE_URL}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (!res.ok) throw new Error("Failed to save payment");
      console.log("✅ Payment saved successfully");
    } catch (err) {
      console.error("❌ Payment API error:", err.message);
    }
  };

  const handleUpdatePayment = async (booking) => {
    const updated = bookings.map((b) =>
      b.id === booking.id
        ? { ...b, price: Number(booking.seats) * 75 } // dynamic pricing
        : b
    );
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));

    await savePayment(booking);

    window.open("https://buy.stripe.com/test_7sY28t91X6gegc8gDwcwg00", "_blank");
    alert("✅ Booking updated and payment saved!");
    setEditingBooking(null);
  };

  const goToLocation = () => navigate("/location");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-100 py-6 px-4">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-blue-900 drop-shadow-md">
        🚐 My Bookings
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl shadow-2xl p-5 border-l-8 border-blue-500 transform hover:scale-105 transition-all duration-300 relative"
          >
            {/* Countdown Timer */}
            <div className="absolute top-4 right-4 flex items-center gap-1 text-sm font-semibold text-red-600">
              <FaClock /> {timers[b.id]}
            </div>

            <h3 className="font-bold text-xl text-blue-700 mb-3">
              {b.passengerName}
            </h3>

            <p className="text-sm text-gray-700">
              <FaCar className="inline mr-2 text-blue-500" />
              {b.car}
            </p>

            <p className="text-sm text-gray-700">
              <FaRoute className="inline mr-2 text-green-500" /> {b.from} → {b.to}
            </p>

            <div className="my-3 space-y-2">
              <label className="block text-sm font-semibold">Seats:</label>
              {editingBooking?.id === b.id ? (
                <input
                  type="number"
                  value={b.seats}
                  onChange={(e) => handleFieldChange(e, b, "seats")}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              ) : (
                <p>{b.seats}</p>
              )}

              <label className="block text-sm font-semibold">Phone Number:</label>
              {editingBooking?.id === b.id ? (
                <input
                  type="tel"
                  value={b.phone}
                  onChange={(e) => handleFieldChange(e, b, "phone")}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              ) : (
                <p>{b.phone}</p>
              )}

              <p className="text-lg font-semibold text-green-700">
                💰 R {b.price}
              </p>

              <p className="text-gray-700 text-sm flex items-center">
                <FaEnvelope className="mr-2 text-gray-500" /> {b.email}
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
                  onClick={() => handleUpdatePayment(b)}
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
    </div>
  );
};

export default AllBookings;
