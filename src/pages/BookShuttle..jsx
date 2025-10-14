import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AddShuttle from "./BookShuttle."; // use this component
import TrackPayment from "./track-payment";
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
        shuttle_id: Number(shuttle.id),
        booking_id: Math.floor(Math.random() * 1000000),
        seats,
        amount: Math.round(shuttle.price * seats),
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
      } else {
        resolve(null);
      }
    });
  };

  const ShuttleMap = ({ path, route }) => {
    if (!path || path.length === 0) return null;
    const center = userLocation || path[0];
    return (
      <MapContainer center={center} zoom={6} style={{ width: "100%", height: "300px", borderRadius: "12px" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {userLocation && <Marker position={userLocation}><Popup>You are here</Popup></Marker>}
        {path.map((coord, idx) => <Marker key={idx} position={coord}><Popup>{route}</Popup></Marker>)}
        <Polyline positions={path} color="red" />
      </MapContainer>
    );
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-black">
      {/* Sidebar omitted for brevity, same as before */}

      <main className="flex flex-col flex-grow overflow-auto p-4 md:p-6 space-y-6">
        {activeTab === "book" && (
          <AddShuttle
            shuttles={shuttles}
            user={user}
            seatsSelection={seatsSelection}
            handleSeatChange={handleSeatChange}
            savePayment={savePayment}
            requestUserLocation={requestUserLocation}
            countdowns={countdowns}
            bookings={bookings}
            setBookings={setBookings}
          />
        )}

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
