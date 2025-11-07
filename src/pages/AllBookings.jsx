import React, { useState, useEffect } from "react";
import { FaCar, FaRoute, FaClock, FaGlobeAfrica, FaPhone, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://my-payment-session-shuttle-system-cold-glade-4798.fly.dev";

const AllBookingsAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [timers, setTimers] = useState({});
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  const normalizeBooking = (b) => ({
    ...b,
    from: b.from || b.route?.split(/->|→/)[0]?.trim() || "",
    to: b.to || b.route?.split(/->|→/)[1]?.trim() || "",
    fromLocation: b.fromLocation || "",
    toLocation: b.toLocation || "",
  });

  // Load local and API bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const localBookings = JSON.parse(localStorage.getItem("bookings")) || [];
        const res = await fetch(`${BASE_URL}/api/bookings`);
        const data = await res.json();

        const allBookings = [
          ...localBookings.map(normalizeBooking),
          ...(data.success && Array.isArray(data.bookings)
            ? data.bookings.map(normalizeBooking)
            : []),
        ];
        setBookings(allBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Fetch locations for addresses
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/locationform`);
        const data = await res.json();
        setLocations(data || []);
      } catch (err) {
        console.error("Error fetching locations:", err);
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
        newTimers[b.id] =
          diff > 0
            ? `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m ${Math.floor((diff % 60000) / 1000)}s`
            : "Time passed";
      });
      setTimers(newTimers);
    }, 1000);
    return () => clearInterval(interval);
  }, [bookings]);

  const goToLocation = () => navigate("/location");

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
        🛡️ All Bookings (Admin View)
      </h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-700 font-semibold text-lg">
          No bookings available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => {
            const bookingLocation = locations.find(
              (loc) => loc.email?.toLowerCase() === b.email?.toLowerCase()
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
                  <p><span className="font-semibold">Seats:</span> {b.seats}</p>
                  <p className="flex items-center gap-2"><FaPhone /> {b.phone}</p>
                  <p className="text-lg font-semibold text-green-200">💰 R {b.price}</p>
                  <p className="flex items-center gap-2 text-sm"><FaEnvelope /> {b.email}</p>

                  <p className="text-sm flex items-center gap-2">
                    <FaGlobeAfrica /> From: {bookingLocation?.fromLocation || b.from}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <FaGlobeAfrica /> To: {bookingLocation?.toLocation || b.to}
                  </p>
                </div>

                <button
                  onClick={goToLocation}
                  className="mt-4 w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white px-3 py-2 rounded-lg shadow-md text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <FaGlobeAfrica /> View Location
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllBookingsAdmin;
