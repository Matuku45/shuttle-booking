import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import TrackPayment from "./track-payment";
import Bookings from "./bookings";
import Payment from "../components/payment";
import Terms from "./Terms";

// Fix default Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const BASE_URL = "https://shuttle-booking-system.fly.dev";
const DEFAULT_CAR = { name: "MetroShuttle Bus <c1234555666>", seats: 10 };

const PassengerDashboard = () => {
  const [user, setUser] = useState({ name: "Passenger", email: "", phone: "" });
  const [shuttles, setShuttles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("book");
  const [seatsSelection, setSeatsSelection] = useState({});
  const [countdowns, setCountdowns] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const defaultShuttles = [
    {
      id: 1,
      route: "Pretoria → Cape Town",
      date: "2025-10-05",
      time: "22:36",
      price: 100,
      car: DEFAULT_CAR,
      path: [
        { lat: -25.7479, lng: 28.2293 },
        { lat: -33.9249, lng: 18.4241 },
      ],
    },
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) setUser(storedUser);
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(storedBookings);
  }, []);

  useEffect(() => {
    const fetchShuttles = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/shuttles`);
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

  const savePayment = async (shuttle, seats) => {
    try {
      const paymentData = {
        passenger_name: user.name,
        passenger_phone: user.phone || "",
        shuttle_id: shuttle.id,
        booking_id: Math.floor(Math.random() * 1000000),
        seats,
        amount: shuttle.price * seats,
        status: "Paid",
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        car: DEFAULT_CAR.name,
      };

      await fetch(`${BASE_URL}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(paymentData),
      });
    } catch (err) {
      console.error("Payment save error:", err.message);
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

  if (!user.phone.trim()) return alert("Enter your phone number!");
  if (!user.email.trim()) return alert("User email not found!");

  // Get user location if needed
  await requestUserLocation();

  const newBooking = {
    id: Math.floor(Math.random() * 1000000),
    shuttle_id: shuttle.id,
    passengerName: user.name,
    email: user.email,
    phone: user.phone,
    route: shuttle.route,
    date: shuttle.date,
    time: shuttle.time,
    seats,
    price: shuttle.price * seats,
    path: shuttle.path,
    car: DEFAULT_CAR.name,
  };

  // Save locally as before
  const updatedBookings = [...bookings, newBooking];
  setBookings(updatedBookings);
  localStorage.setItem("bookings", JSON.stringify(updatedBookings));
  localStorage.setItem("user", JSON.stringify(user));

  try {
    // Send booking to your API without token
    const response = await fetch("http://localhost:3001/bookings", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newBooking),
});


    const result = await response.json();

    if (!result.success) {
      console.error("API Booking failed:", result);
      alert("Booking could not be saved to the server!");
      return;
    }

    // Proceed with Stripe payment
    await savePayment(shuttle, seats);
    window.open("https://buy.stripe.com/test_7sY28t91X6gegc8gDwcwg00", "_blank");
    alert("Booking saved! Redirecting to payment...");
  } catch (err) {
    console.error("Error sending booking to API:", err);
    alert("An error occurred while saving booking to API.");
  }
};


  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 text-black overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white flex flex-col flex-shrink-0 shadow-xl fixed md:relative z-50 md:z-auto md:flex md:w-64 h-full transition-transform transform ${
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

      {/* Overlay for small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6 w-full">
        {/* Hamburger for small screens */}
        <button
  className="md:hidden bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg font-bold mb-4 self-start shadow-lg hover:scale-105 transition-transform duration-300"
  onClick={() => setSidebarOpen(true)}
>
  ☰ Menu
</button>

{activeTab === "book" && (
  <section className="space-y-6">
    <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center tracking-wide">
      🚍 Available Shuttles
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
      {shuttles.map((shuttle) => {
        const seats = seatsSelection[shuttle.id] || 1;
        const price = Number(shuttle.price) || 0;

        // Standardize route parts (split by "->")
        const routeParts = shuttle.route ? shuttle.route.split("->") : ["Route not available"];

        return (
          <div
            key={shuttle.id}
            className="bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-500 text-white space-y-3"
          >
            {/* Route Display with Animated Arrows */}
            <div className="flex flex-col items-center text-center mb-3">
              {routeParts.map((city, index) => (
                <React.Fragment key={index}>
                  <h3 className="text-xl font-bold">{city.trim()}</h3>
                  {index < routeParts.length - 1 && (
                    <div className="text-yellow-300 text-3xl animate-bounce mt-1 mb-1">➡️</div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Shuttle Details */}
            <div className="space-y-1 text-white text-sm">
              <p>
                <span className="font-semibold">🕒 Departure:</span> {shuttle.date || "N/A"} • {shuttle.time || "N/A"}
              </p>
              <p>
                <span className="font-semibold">💰 Price per Seat:</span>{" "}
                <span className="font-bold text-lg">R{price.toFixed(2)}</span>
              </p>
              <p>
                <span className="font-semibold">⏳ Countdown:</span>{" "}
                <span className="font-mono">{countdowns[shuttle.id] || "N/A"}</span>
              </p>
              <p>
                <span className="font-semibold">🚗 Vehicle:</span> {DEFAULT_CAR.name}
              </p>
            </div>

            {/* Inputs */}
            <div className="mt-3 space-y-3">
              <div>
                <label className="block font-semibold">🎟️ Seats:</label>
                <input
                  type="number"
                  min="1"
                  max={DEFAULT_CAR.seats}
                  value={seats}
                  onChange={(e) => handleSeatChange(shuttle.id, e.target.value)}
                  className="border border-gray-200 rounded-md p-2 w-full text-black"
                />
              </div>
              <div>
                <label className="block font-semibold">📞 Phone Number:</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={user.phone || ""}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="border border-gray-200 rounded-md p-2 w-full text-black"
                />
              </div>
            </div>

            {/* Total Price */}
            <div className="mt-2 font-semibold text-lg">
              Total: R{(price * seats).toFixed(2)}
            </div>

            {/* Book Button */}
            <button
              onClick={() => handleBooking(shuttle)}
              className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold text-lg py-3 mt-3 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105 hover:from-orange-400 hover:via-red-500 hover:to-pink-600"
            >
              🚐 Book & Pay
            </button>
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
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">👤 My Profile</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email || "Not provided"}</p>
            <p>Phone: {user.phone || "Not provided"}</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default PassengerDashboard;
