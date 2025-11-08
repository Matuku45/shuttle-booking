import React, { useState, useEffect } from "react";
import {
  FaCar,
  FaRoute,
  FaClock,
  FaGlobeAfrica,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
   FaWhatsapp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [timers, setTimers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BASE_URL =
    "https://my-payment-session-shuttle-system-cold-glade-4798.fly.dev";

  const loggedInEmail = JSON.parse(localStorage.getItem("user"))?.email?.toLowerCase();

  const normalizeBooking = (b) => ({
    ...b,
    from: b.from || b.route?.split(/->|→/)[0]?.trim() || "",
    to: b.to || b.route?.split(/->|→/)[1]?.trim() || "",
    fromAddress: b.fromAddress || "",
    toAddress: b.toAddress || "",
    basePrice: b.basePrice || b.price || 0,
  });

  // Load bookings and populate addresses from API
  useEffect(() => {
    const loadBookings = async () => {
      const localBookings = JSON.parse(localStorage.getItem("bookings")) || [];
      const filtered = localBookings
        .filter((b) => b.email?.toLowerCase() === loggedInEmail)
        .map(normalizeBooking);

      try {
        const res = await fetch(`${BASE_URL}/api/locationform`);
        const locations = await res.json();

        // Map addresses from API to bookings by email
        const bookingsWithAddresses = filtered.map((b) => {
          const loc = locations.find(
            (l) => l.email?.toLowerCase() === b.email?.toLowerCase()
          );
          return {
            ...b,
            fromAddress: loc?.fromLocation || b.fromAddress,
            toAddress: loc?.toLocation || b.toAddress,
          };
        });

        setBookings(bookingsWithAddresses);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setBookings(filtered);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [loggedInEmail]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      bookings.forEach((b) => {
        const diff = new Date(b.date).getTime() - new Date().getTime();
        newTimers[b.id] =
          diff > 0
            ? `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m ${Math.floor((diff % 60000) / 1000)}s`
            : "⏰ Time passed";
      });
      setTimers(newTimers);
    }, 1000);
    return () => clearInterval(interval);
  }, [bookings]);

  const handleEdit = (booking) => setEditingBooking(booking);

  const handleFieldChange = (e, bookingId, field) => {
    const value = e.target.value;
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updated = { ...b, [field]: value };
          if (field === "seats") {
            updated.price = updated.basePrice * Number(updated.seats || 1);
          }
          return updated;
        }
        return b;
      })
    );
  };

  const goToLocation = () => navigate("/location");

  const handleUpdateBooking = async (booking) => {
    const totalAmount = booking.basePrice * Number(booking.seats || 1);
    const updatedBooking = { ...booking, price: totalAmount };

    const updatedBookings = bookings.map((b) =>
      b.id === booking.id ? updatedBooking : b
    );
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    setEditingBooking(null);

    const paymentPayload = {
      passenger_name: booking.passengerName,
      passenger_phone: booking.phone,
      shuttle_id: booking.shuttle_id || booking.id,
      booking_id: booking.id,
      seats: booking.seats,
      amount: totalAmount,
      status: `Booking updated - total R${totalAmount}`,
      car: booking.car,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });

      if (!res.ok) throw new Error("Payment API failed");

      alert(`✅ Booking updated! Please proceed to payment of R${totalAmount}.`);
      window.location.href = "https://buy.stripe.com/test_7sY5kFgupfQO7FC4UOcwg01";
    } catch (err) {
      console.error("Error saving payment:", err);
      alert("⚠️ Failed to save payment. Try again!");
    }
  };

  const handleDeleteBooking = async (booking) => {
    if (!window.confirm("Are you sure? 50% of your booking price will be charged.")) return;

    const chargeAmount = booking.price / 2;

    const paymentPayload = {
      passenger_name: booking.passengerName,
      passenger_phone: booking.phone,
      shuttle_id: booking.id,
      booking_id: booking.id,
      seats: booking.seats,
      amount: booking.price,
      status: `Cancelled - charged 50%: R${chargeAmount}`,
      car: booking.car,
    };

    try {
      await fetch(`${BASE_URL}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });

      const updatedBookings = bookings.filter((b) => b.id !== booking.id);
      setBookings(updatedBookings);
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));

      alert(`⚠️ Booking deleted. 50% of R${booking.price} has been charged. and the charges are R${chargeAmount}`);
    } catch (err) {
      console.error("Error saving deletion charge:", err);
      alert("⚠️ Failed to save deletion charge. Try again!");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <p className="text-blue-700 text-lg font-semibold">Loading bookings...</p>
      </div>
    );

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-100 py-6 px-4">
    <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-blue-900 drop-shadow-md">
      🛡️ My Bookings
    </h2>

    {bookings.length === 0 ? (
      <p className="text-center text-gray-700 font-semibold text-lg">
        No bookings found for your account.
      </p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 rounded-2xl shadow-lg p-5 border-l-8 border-blue-700 hover:scale-[1.03] transition-all duration-300 relative"
          >
            {/* Timer */}
            <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold text-red-700">
              <FaClock /> {timers[b.id]}
            </div>

            <div className="text-white space-y-3">
              {/* Passenger Name */}
              <h3 className="font-bold text-lg">{b.passengerName || "Passenger Name"}</h3>

              {/* Car Info */}
              <p className="text-sm flex items-center gap-2">
                <FaCar /> {b.serviceName || "MetroShuttle"} {b.carMake || "Suzuki"} Car{" "}
                <span className="font-mono text-yellow-100">
                  &lt;{b.registrationNumber || "c1234555666"}&gt;
                </span>
              </p>

              {/* Route */}
              <div className="bg-blue-500/30 p-3 rounded-xl mt-3 space-y-2">
                <p className="font-semibold flex items-center gap-2 text-sm">
                  <FaRoute /> Route:
                </p>
                <p className="text-sm">{b.from} → {b.to}</p>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 gap-3 mt-2">
                <div className="bg-blue-500/20 p-3 rounded-xl">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <FaMapMarkerAlt /> From Address:
                  </p>
                  {editingBooking?.id === b.id ? (
                    <input
                      type="text"
                      value={b.fromAddress}
                      onChange={(e) => handleFieldChange(e, b.id, "fromAddress")}
                      placeholder="Specific address"
                      className="border border-gray-300 rounded-md p-2 w-full text-black"
                    />
                  ) : (
                    <p className="text-sm italic">{b.fromAddress || "Not specified"}</p>
                  )}
                </div>

                <div className="bg-blue-500/20 p-3 rounded-xl">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <FaMapMarkerAlt /> To Address:
                  </p>
                  {editingBooking?.id === b.id ? (
                    <input
                      type="text"
                      value={b.toAddress}
                      onChange={(e) => handleFieldChange(e, b.id, "toAddress")}
                      placeholder="Specific address"
                      className="border border-gray-300 rounded-md p-2 w-full text-black"
                    />
                  ) : (
                    <p className="text-sm italic">{b.toAddress || "Not specified"}</p>
                  )}
                </div>
              </div>

              {/* Seats & Price */}
              <div className="flex justify-between items-center mt-4">
                {editingBooking?.id === b.id ? (
                  <input
                    type="number"
                    min="1"
                    value={b.seats}
                    onChange={(e) => handleFieldChange(e, b.id, "seats")}
                    className="border border-gray-300 rounded-md p-2 w-20 text-black"
                  />
                ) : (
                  <p className="text-sm">🪑 {b.seats} seat(s)</p>
                )}
                <p className="text-lg font-bold text-green-200">💰 R {b.price}</p>
              </div>

              {/* Contact Info */}
              <div className="mt-2 space-y-1">
                <p className="text-sm flex flex-col gap-1">
                  <span className="font-semibold">Contact:</span>
                  {b.phone?.split("|").map((num, idx) => (
                    <span key={idx} className="flex items-center gap-2">
                      {idx === 0 ? (
                        <>
                          <FaPhone /> {num.trim()}
                        </>
                      ) : (
                        <>
                          <FaWhatsapp /> {num.trim()}
                        </>
                      )}
                    </span>
                  ))}
                </p>

                <p className="text-sm flex items-center gap-2">
                  <FaEnvelope /> {b.email}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-between mt-5 gap-3">
              <button
                onClick={goToLocation}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg shadow-md text-sm sm:text-base transition-all"
              >
                <FaGlobeAfrica className="inline mr-2" /> View Location
              </button>

              {editingBooking?.id === b.id ? (
                <button
                  onClick={() => handleUpdateBooking(b)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg shadow-md text-sm sm:text-base transition-all"
                >
                  Update
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(b)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg shadow-md text-sm sm:text-base transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBooking(b)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow-md text-sm sm:text-base transition-all"
                  >
                    Delete
                  </button>
                </>
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
