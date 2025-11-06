import React, { useState, useEffect } from "react";
import { FaCar, FaRoute, FaClock, FaGlobeAfrica, FaPhone, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [timers, setTimers] = useState({});
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = "https://my-payment-session-shuttle-system-cold-glade-4798.fly.dev";

  const loggedInEmail = JSON.parse(localStorage.getItem("user"))?.email?.toLowerCase();

  const normalizeBooking = (b) => ({
    ...b,
    from: b.route?.split(/->|→/)[0]?.trim() || "",
    to: b.route?.split(/->|→/)[1]?.trim() || "",
  });

  // Load bookings from localStorage only
  useEffect(() => {
    const localBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const filtered = localBookings
      .filter((b) => b.email?.toLowerCase() === loggedInEmail)
      .map(normalizeBooking);
    setBookings(filtered);
    setLoading(false);
  }, [loggedInEmail]);

  // Fetch locations from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/locationform`);
        const data = await res.json();
        setLocations(data || []);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      bookings.forEach((b) => {
        const diff = new Date(b.date).getTime() - new Date().getTime();
        if (diff > 0) {
          const h = Math.floor(diff / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          newTimers[b.id] = `${h}h ${m}m ${s}s`;
        } else {
          newTimers[b.id] = "Time passed";
        }
      });
      setTimers(newTimers);
    }, 1000);
    return () => clearInterval(interval);
  }, [bookings]);

  const handleEdit = (booking) => setEditingBooking(booking);

  const handleFieldChange = (e, booking, field) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, [field]: e.target.value } : b))
    );
  };

  const goToLocation = () => navigate("/location");

  // Realistic pricing function
  const calculatePrice = (booking) => {
    let basePerSeat = 50; // default
    if (booking.car?.toLowerCase().includes("lux")) basePerSeat = 120;
    else if (booking.car?.toLowerCase().includes("van")) basePerSeat = 90;
    return Number(booking.seats) * basePerSeat;
  };

  // Update booking in the interface only and redirect to Stripe
  const handleUpdateBooking = (booking) => {
    const updatedBooking = { ...booking, price: calculatePrice(booking) };
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? updatedBooking : b))
    );
    setEditingBooking(null);
    alert(`✅ Booking updated! New price: R${updatedBooking.price}`);
    window.location.href = "https://buy.stripe.com/test_7sY5kFgupfQO7FC4UOcwg01";
  };

  // Delete booking in the interface only and alert 50% charge
  const handleDeleteBooking = (booking) => {
    if (!window.confirm("Are you sure? 50% of your booking price will be charged.")) return;
    setBookings((prev) => prev.filter((b) => b.id !== booking.id));
    alert(`⚠️ Booking deleted. 50% of R${booking.price} has been charged.`);
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
          {bookings.map((b) => {
            const bookingLocation = locations.find(
              (loc) => loc.email.toLowerCase() === b.email.toLowerCase()
            );

            return (
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

                  <p className="text-lg font-semibold text-green-200">💰 R {b.price}</p>
                  <p className="flex items-center gap-2 text-sm">
                    <FaEnvelope /> {b.email}
                  </p>

                  {/* ADDRESSES */}
                  <p className="text-sm flex items-center gap-2">
                    <FaGlobeAfrica /> From: {bookingLocation?.fromLocation || "null"}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <FaGlobeAfrica /> To: {bookingLocation?.toLocation || "null"}
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
                    <>
                      <button
                        onClick={() => handleEdit(b)}
                        className="flex-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white px-3 py-2 rounded-lg shadow-md text-sm sm:text-base"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(b)}
                        className="flex-1 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white px-3 py-2 rounded-lg shadow-md text-sm sm:text-base"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllBookings;
