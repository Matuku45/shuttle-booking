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
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const BASE_URL = "https://shuttle-booking-system.fly.dev";
const DEFAULT_CAR = { name: "MetroShuttle Bus", seats: 10 };

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

  // Load user and bookings
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) setUser(storedUser);
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(storedBookings);
  }, []);

  // Fetch shuttles
  useEffect(() => {
    const fetchShuttles = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/shuttles`);
        if (!res.ok) throw new Error("Failed to fetch shuttles");
        const data = await res.json();
        const shuttlesData = Array.isArray(data) ? data : data.shuttles || [];
        setShuttles(
          shuttlesData.length
            ? shuttlesData.map((s) => ({
                ...s,
                car: DEFAULT_CAR,
                path: s.path || [],
              }))
            : defaultShuttles
        );
      } catch (err) {
        console.warn("API error, using default shuttles:", err.message);
        setShuttles(defaultShuttles);
      }
    };
    fetchShuttles();
  }, []);

  // Countdown timers
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
        shuttle_id: Number(shuttle.id),
        booking_id: Math.floor(Math.random() * 1000000),
        seats,
        amount: Math.round(shuttle.price * seats),
        status: "Paid",
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        car: DEFAULT_CAR.name,
      };

      const res = await fetch(`${BASE_URL}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(paymentData),
      });

      await res.json();
    } catch (err) {
      console.error("Payment save error:", err.message);
    }
  };

  // Request user location dynamically
  const requestUserLocation = async () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(loc);
            resolve(loc);
          },
          (err) => {
            console.warn("Geolocation failed:", err.message);
            resolve(null);
          }
        );
      } else {
        console.warn("Geolocation not supported.");
        resolve(null);
      }
    });
  };

  const ShuttleMap = ({ path, route }) => {
    if (!path || path.length === 0) return null;
    const center = userLocation || path[0];
    return (
      <MapContainer
        center={center}
        zoom={6}
        style={{ width: "100%", height: "300px", borderRadius: "12px" }}
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

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white flex flex-col flex-shrink-0 shadow-xl ${
          sidebarOpen ? "fixed z-50 top-0 left-0 h-full w-64" : "hidden md:flex md:w-64"
        } transition-all`}
      >
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <div className="text-2xl font-bold tracking-wide text-red-400">MetroShuttle</div>
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
            { label: "🚍 Book Shuttles", tab: "book" },
            { label: "💺 View My Bookings", tab: "bookings" },
            { label: "👤 View My Profile", tab: "profile" },
            { label: "💳 Track Payments", tab: "payments" },
            { label: "📜 Terms & Conditions", tab: "terms" },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => { setActiveTab(item.tab); setSidebarOpen(false); }}
              className={`py-2 px-3 rounded-md font-semibold text-left transition ${
                activeTab === item.tab ? "bg-red-600 text-white" : "text-gray-200 hover:bg-gray-800"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => alert("Logged out successfully!")}
            className="py-2 px-3 rounded-md font-semibold text-left text-gray-200 hover:bg-red-800 transition"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col flex-grow overflow-auto p-4 md:p-6 space-y-6">
        {activeTab === "book" && (
          <section className="bg-white rounded-lg shadow p-4 md:p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Shuttles</h2>

            {shuttles.map((shuttle) => (
              <div key={shuttle.id} className="border border-gray-200 rounded-md p-4 space-y-2">
                <div className="text-blue-700 font-semibold text-lg">{shuttle.route}</div>
                <p className="text-sm text-gray-600">{shuttle.date} • {shuttle.time}</p>
                <p className="text-sm text-gray-500">Countdown: {countdowns[shuttle.id]}</p>
                <p className="text-sm text-gray-500">Car: {DEFAULT_CAR.name}</p>

                <ShuttleMap path={shuttle.path} route={shuttle.route} />

                <label className="block text-sm font-medium mb-1 mt-2">Seats:</label>
                <input
                  type="number"
                  min="1"
                  max={DEFAULT_CAR.seats}
                  value={seatsSelection[shuttle.id] || 1}
                  onChange={(e) => handleSeatChange(shuttle.id, e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />

                <label className="block text-sm font-medium mb-1 mt-2">Phone Number:</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />

                <Payment
                  shuttle={shuttle}
                  seats={seatsSelection[shuttle.id] || 1}
                  onPaymentSuccess={async (shuttle, seats) => {
                    await requestUserLocation(); // dynamically get location
                    const newBooking = {
                      id: Math.floor(Math.random() * 1000000),
                      shuttle_id: shuttle.id,
                      route: shuttle.route,
                      date: shuttle.date,
                      time: shuttle.time,
                      seats,
                      price: shuttle.price * seats,
                      path: shuttle.path,
                      car: DEFAULT_CAR.name,
                      passenger_phone: user.phone || "",
                    };
                    const updatedBookings = [...bookings, newBooking];
                    setBookings(updatedBookings);
                    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
                    savePayment(shuttle, seats);
                  }}
                />
              </div>
            ))}
          </section>
        )}

        {activeTab === "bookings" && <Bookings />}
        {activeTab === "terms" && <Terms />}
        {activeTab === "payments" && <TrackPayment passengerName={user.name} />}
        {activeTab === "profile" && (
          <section className="bg-white rounded-lg shadow-md p-8">
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
