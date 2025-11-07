import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import TrackPayment from "./track-payment";
import Bookings from "./bookings";
import Payment from "../components/payment";
import Terms from "./Terms";
import "../pages/LocationForm.jsx"
import { FaUser, FaEnvelope, FaPhone, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

// Fix default Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const SHUTTLE_BASE = "https://shuttle-booking-system.fly.dev";
const PAYMENT_BASE = "https://my-payment-session-shuttle-system-cold-glade-4798.fly.dev";
const DEFAULT_CAR = { name: "MetroShuttle Suzuki Car <c1234555666>", seats: 10 };

const PassengerDashboard = () => {
  const [user, setUser] = useState({ name: "Passenger", email: "", phone: "" });
  const [shuttles, setShuttles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("book");
  const [seatsSelection, setSeatsSelection] = useState({});
  const [countdowns, setCountdowns] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingProgress, setBookingProgress] = useState(0);
  const [bookingShuttleId, setBookingShuttleId] = useState(null);

  const defaultShuttles = [
  
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUser({
      name: storedUser.name || "Passenger",
      email: storedUser.email || "",
      phone: storedUser.phone || ""
    });
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(storedBookings);
  }, []);

  useEffect(() => {
    const fetchShuttles = async () => {
      try {
        const res = await fetch(`${SHUTTLE_BASE}/api/shuttles`);
        if (!res.ok) throw new Error("Failed to fetch shuttles");
        const data = await res.json();
        const shuttlesData = Array.isArray(data) ? data : data.shuttles || [];
        // Sort admin-added shuttles first by updated_at descending, then by date/time
        const sortedShuttles = shuttlesData.sort((a, b) => {
          if (a.updated_at && b.updated_at) {
            return new Date(b.updated_at) - new Date(a.updated_at);
          }
          return new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time);
        });
        setShuttles(
          sortedShuttles.length
            ? sortedShuttles.map((s) => ({ ...s, car: DEFAULT_CAR, path: s.path || [] }))
            : defaultShuttles
        );
      } catch (err) {
        console.warn("API error, using default shuttles:", err.message);
        setShuttles(defaultShuttles);
      }
    };
    fetchShuttles();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      shuttles.forEach((shuttle) => {
        const shuttleDate = new Date(`${shuttle.date}T${shuttle.time}:00`);
        const diff = shuttleDate - new Date();
        if (diff > 0) {
          const hours = Math.floor(diff / 1000 / 3600);
          const minutes = Math.floor((diff / 1000 % 3600) / 60);
          const seconds = Math.floor((diff / 1000) % 60);
          newCountdowns[shuttle.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newCountdowns[shuttle.id] = "Departed";
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, [shuttles]);

  const handleSeatChange = (shuttleId, seats) => {
    setSeatsSelection((prev) => ({ ...prev, [shuttleId]: Number(seats) }));
  };

const savePayment = async (shuttle, seats, bookingId) => {
  try {
    const paymentData = {
      
      passenger_name: user.name,
      passenger_phone: user.phone || "",
      shuttle_id: shuttle.id,
      booking_id: bookingId, // Use actual booking ID
      seats,
      amount: shuttle.price * seats,
      status: "Paid",
      payment_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      car: DEFAULT_CAR.name,
    };

    // 1️⃣ Save to backend
    const response = await fetch(`${PAYMENT_BASE}/api/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) throw new Error("Payment API failed");

    const result = await response.json();
    if (!result.success) throw new Error("Payment failed at API");

    // 2️⃣ Save to localStorage
    const storedPayments = JSON.parse(localStorage.getItem("payments")) || [];
    storedPayments.push(result.payment); // Save the API-returned payment object
    localStorage.setItem("payments", JSON.stringify(storedPayments));

    console.log("Payment saved locally and sent to backend:", result.payment);

    return result.payment;

  } catch (err) {
    console.error("Payment save error:", err.message);
    alert("Payment could not be saved. Please try again.");
    return null;
  }
};


  const requestUserLocation = async () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
            setUserLocation(loc);
            resolve(loc);
          },
          () => resolve(null)
        );
      } else resolve(null);
    });
  };

  const ShuttleMap = ({ path, route }) => {
    if (!path || path.length === 0) return null;
    const center = userLocation || path[0];
    return (
      <MapContainer
        center={center}
        zoom={6}
        style={{ width: "100%", height: "250px", borderRadius: "12px", marginTop: "10px" }}
        className="shadow-md"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {userLocation && <Marker position={userLocation}><Popup>You are here</Popup></Marker>}
        {path.map((coord, idx) => (
          <Marker key={idx} position={coord}><Popup>{route}</Popup></Marker>
        ))}
        <Polyline positions={path} color="red" />
      </MapContainer>
    );
  };



const handleBooking = async (shuttle) => {
  const seats = seatsSelection[shuttle.id] || 1;

  if (!user.phone || !user.phone.trim()) return alert("Enter your phone number!");
  if (!user.email || !user.email.trim()) return alert("User email not found!");

  // ✅ Calculate total amount correctly
  const totalAmount = shuttle.price * seats;

  setBookingLoading(true);
  setBookingProgress(0);

  try {
    setBookingProgress(10);
    await requestUserLocation();
    setBookingProgress(20);

    // ✅ Create booking payload with correct total amount
    const bookingPayload = {
      shuttle_id: shuttle.id,
      passengerName: user.name,
      email: user.email,
      phone: user.phone,
      route: shuttle.route,
      date: shuttle.date,
      time: shuttle.time,
      seats,
      price: totalAmount, // ✅ fixed: total price now stored
      path: shuttle.path,
      car: DEFAULT_CAR.name,
    };

    // ✅ Send booking to backend (removed /api as per your setup)
    const bookingRes = await fetch(`${PAYMENT_BASE}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
    });

    if (!bookingRes.ok) throw new Error(`Booking API failed: ${bookingRes.status}`);

    const bookingResult = await bookingRes.json();
    if (!bookingResult.success) throw new Error("Booking failed at API");

    const savedBooking = bookingResult.booking;

    // ✅ Save booking locally
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    storedBookings.push(savedBooking);
    localStorage.setItem("bookings", JSON.stringify(storedBookings));

    setBookingProgress(50);

    // ✅ Payment payload using the same total amount
    const paymentPayload = {
      passenger_name: user.name,
      passenger_phone: user.phone,
      shuttle_id: shuttle.id,
      booking_id: savedBooking.id,
      seats,
      amount: totalAmount, // ✅ same total as booking
      status: "Booked", // better to mark as pending until confirmed
      payment_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      car: DEFAULT_CAR.name,
    };

    const paymentRes = await fetch(`${PAYMENT_BASE}/api/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(paymentPayload),
    });

    if (!paymentRes.ok) throw new Error(`Payment API failed: ${paymentRes.status}`);

    const paymentResult = await paymentRes.json();
    if (!paymentResult.success) throw new Error("Payment failed at API");

    // ✅ Save payment locally
    const storedPayments = JSON.parse(localStorage.getItem("payments")) || [];
    storedPayments.push(paymentResult.payment);
    localStorage.setItem("payments", JSON.stringify(storedPayments));

    setBookingProgress(100);

    alert(`Booking In Pending! Total: R${totalAmount.toFixed(2)} — Redirecting to payment page...`);
    window.location.href = "/location-form";

  } catch (err) {
    console.error("Booking/Payment error:", err.message);
    alert("Error during booking or payment: " + err.message);
  } finally {
    setBookingLoading(false);
    setBookingProgress(0);
  }
};





  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 text-black overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white flex flex-col flex-shrink-0 shadow-xl fixed md:relative z-50 md:z-auto md:flex w-64 h-full transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between h-20 border-b border-gray-700 px-4 md:px-0">
          <div className="text-2xl font-bold tracking-wide text-red-400">MetroShuttle</div>
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setSidebarOpen(false)}
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col items-center justify-center p-4 border-b border-gray-700">
          <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-xl font-bold text-white mb-2 shadow-md">
            {user.name ? user.name[0].toUpperCase() : "P"}
          </div>
          <div className="text-white font-bold text-lg">{user.name}</div>
          <div className="text-gray-300 text-sm">{user.email}</div>
          <div className="text-gray-300 text-sm">{user.phone}</div>
        </div>
<nav className="flex flex-col flex-grow p-4 space-y-3">
  {[
    { label: "🚍 Book Shuttles", tab: "book", from: "from-red-400", via: "via-red-500", to: "to-red-600" },
    { label: "💺 View My Bookings", tab: "bookings", from: "from-green-400", via: "via-green-500", to: "to-green-600" },
    { label: "👤 View My Profile", tab: "profile", from: "from-blue-400", via: "via-blue-500", to: "to-blue-600" },
    { label: "💳 Track Payments", tab: "payments", from: "from-purple-400", via: "via-purple-500", to: "to-purple-600" },
    { label: "📜 Terms & Conditions", tab: "terms", from: "from-yellow-400", via: "via-yellow-500", to: "to-yellow-600" },
  ].map((item) => (
    <button
      key={item.tab}
      onClick={() => { setActiveTab(item.tab); setSidebarOpen(false); }}
      className={`py-2 px-3 rounded-md font-semibold text-left text-white shadow-md
        bg-gradient-to-r ${item.from} ${item.via} ${item.to} transition`}
    >
      {item.label}
    </button>
  ))}
  
  <button
    onClick={() => { alert("Logged out successfully!"); window.location.href = "/login"; }}
    className="py-2 px-3 rounded-md font-semibold text-left text-white shadow-md mt-4
      bg-gradient-to-r from-red-400 via-red-500 to-red-600 transition"
  >
    🚪 Logout
  </button>
</nav>

      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6 w-full">
        {/* Hamburger Menu Button */}
        <button
          className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg font-bold mb-4 self-start shadow-lg hover:scale-105 transition-transform duration-300"
          onClick={() => setSidebarOpen(true)}
        >
          ☰ Menu
        </button>
{activeTab === "book" && (
  <section className="space-y-6">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide">
        🚍 Available Shuttles
      </h2>
      <button
        onClick={async () => {
          try {
            const res = await fetch(`/api/shuttles`);
            if (!res.ok) throw new Error("Failed to fetch shuttles");
            const data = await res.json();
            const shuttlesData = Array.isArray(data) ? data : data.shuttles || [];
            setShuttles(
              shuttlesData.length
                ? shuttlesData.map((s) => ({ ...s, car: DEFAULT_CAR, path: s.path || [] }))
                : defaultShuttles
            );
          } catch (err) {
            console.warn("API error, using default shuttles:", err.message);
            setShuttles(defaultShuttles);
          }
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        🔄 Refresh Shuttles
      </button>
    </div>

    {/* Info Card */}
    <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg p-3 flex items-center gap-2 mb-4">
      🚐 Shuttle picks you up at your home and drops you at your destination.
    </div>

    {/* Shuttle List */}
    <div className="flex flex-col space-y-4">
      {shuttles.map((shuttle) => {
        const seats = seatsSelection[shuttle.id] || 1;
        const price = Number(shuttle.price) || 300;
        const [from, to] = shuttle.route ? shuttle.route.split("→").map(s => s.trim()) : ["17 Thabo Mbeki St, Polokwane", "Pretoria Luxury Coach Terminal"];
        const depTime = shuttle.time || "9:35am";
        const arrTime = "1:40pm";
        const duration = "4h 5m";
        const company = "CITILINER PLUS";
        const isActiveBooking = bookingLoading && bookingShuttleId === shuttle.id; // Only active shuttle shows progress

        return (
   <div
  key={shuttle.id}
  className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 w-full max-w-md mx-auto"
>
  {/* Company */}
  <div className="flex items-center gap-2 mb-3">
    <img src="/src/assets/react.svg" alt="Logo" className="w-6 h-6" />
    <span className="font-semibold text-gray-800 text-sm">CITILINER PLUS</span>
  </div>

  {/* Times */}
  <div className="flex justify-between items-center mb-2">
    <span className="text-sm font-bold text-gray-900">{depTime}</span>
    <span className="text-gray-400 text-xs">→</span>
    <span className="text-sm font-bold text-gray-900">{arrTime}</span>
  </div>

  {/* Locations */}
  <div className="text-xs text-gray-600 mb-3">
    <p>From: <span className="font-medium">{from}</span></p>
    <p>To: <span className="font-medium">{to}</span></p>
  </div>

  {/* Duration & Seats */}
  <div className="flex items-center justify-between mb-3">
    <span className="text-xs text-gray-700">🚌 Bus | {duration}</span>
    <div className="flex gap-1">
      {Array.from({ length: seats }, (_, i) => (
        <span key={i} className="text-gray-500 text-xs animate-pulse">👤</span>
      ))}
    </div>
  </div>

  {/* Seats Input */}
  <div className="mb-3 space-y-1 text-xs">
    <label className="block text-gray-600 font-medium mb-1">Select Seats:</label>
    <input
      type="number"
      min="1"
      max={DEFAULT_CAR.seats}
      value={seats}
      onChange={(e) => handleSeatChange(shuttle.id, e.target.value)}
      className="border border-gray-200 rounded p-1 w-full text-center focus:ring focus:ring-blue-200 outline-none"
      placeholder="Enter number of seats"
    />
  </div>

  {/* Total Price Display */}
  <div className="flex items-center justify-between mb-3 bg-gray-50 border border-gray-100 p-2 rounded-lg">
    <span className="text-sm text-gray-700 flex items-center gap-2">
      💰 <span className="font-medium">Total Amount</span>
    </span>
    <span className="text-sm font-semibold text-green-700">
      R{(seats * price).toFixed(2)}
    </span>
  </div>

  {/* Price & Booking Button */}
  <div className="flex justify-between items-center mb-3">
    <button
      onClick={() => handleBooking(shuttle)}
      disabled={bookingLoading}
      className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-full shadow-sm hover:bg-orange-600 transition transform hover:scale-105 text-sm disabled:opacity-50"
    >
      {bookingLoading && isActiveBooking ? "Booking..." : `Book for R${(seats * price).toFixed(2)} →`}
    </button>
  </div>

  {/* Booking Progress Slider */}
  {isActiveBooking && (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
      <div
        className="bg-blue-500 h-3 rounded-full transition-all duration-500"
        style={{ width: `${bookingProgress}%` }}
      ></div>
    </div>
  )}
</div>


        );
      })}
    </div>
  </section>
)}

        {activeTab === "bookings" && <Bookings />}
        {activeTab === "terms" && <Terms />}
        {activeTab === "payments" && <TrackPayment passengerName={user.name} />}

{activeTab === "profile" && (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen p-10"
  >
    <div className="max-w-3xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-blue-800 flex items-center gap-3">
        <FaUser /> My Profile
      </h2>

      <div className="space-y-6">

        {/* Name */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4 bg-white rounded-2xl shadow-lg p-6"
        >
          <FaUser className="text-blue-500 text-2xl" />
          <div>
            <p className="text-gray-600 text-sm">Full Name</p>
            <p className="font-semibold text-gray-800 text-lg">{user.name}</p>
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4 bg-white rounded-2xl shadow-lg p-6"
        >
          <FaEnvelope className="text-green-500 text-2xl" />
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="font-semibold text-gray-800 text-lg">{user.email || "Not provided"}</p>
          </div>
        </motion.div>

        {/* Cell Number */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4 bg-white rounded-2xl shadow-lg p-6"
        >
          <FaPhone className="text-blue-700 text-2xl" />
          <div>
            <p className="text-gray-600 text-sm">Cell Number</p>
            <p className="font-semibold text-gray-800 text-lg">
              {user.phone?.split("|")[0] || "Not provided"}
            </p>
          </div>
        </motion.div>

        {/* WhatsApp Number */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-4 bg-white rounded-2xl shadow-lg p-6"
        >
          <FaWhatsapp className="text-green-600 text-2xl" />
          <div>
            <p className="text-gray-600 text-sm">WhatsApp Number</p>
            <p className="font-semibold text-gray-800 text-lg">
              {user.phone?.split("|")[1] || "Not provided"}
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  </motion.section>
)}
      </main>
    </div>
  );
};

export default PassengerDashboard;