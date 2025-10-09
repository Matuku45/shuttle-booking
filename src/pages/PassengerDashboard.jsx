import React, { useState, useEffect } from "react";
import TrackPayment from "./track-payment";
import Bookings from "./bookings";
import Payment from "../components/payment";
import Benz from "../components/gallery/benz.webp";
import Hybdai from "../components/gallery/hyndaifamilycar.webp";
import Polo from "../components/gallery/polo.webp";
import Terms from "./Terms";

const BASE_URL = "https://shuttle-booking-system.fly.dev";

const PassengerDashboard = () => {
  const [user, setUser] = useState({ name: "Passenger", email: "" });
  const [shuttles, setShuttles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [activeTab, setActiveTab] = useState("book");
  const [seatsSelection, setSeatsSelection] = useState({});
  const [countdowns, setCountdowns] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState("");

  const defaultCars = [
    { name: "Benz", numberPlate: "CA 123 456", registrationNumber: "REG-001", seats: 4, image: Benz },
    { name: "Honda Family Car", numberPlate: "CB 789 321", registrationNumber: "REG-002", seats: 6, image: Hybdai },
    { name: "Polo", numberPlate: "CC 654 987", registrationNumber: "REG-003", seats: 5, image: Polo },
  ];

  const defaultShuttles = [
    { id: 1, route: "City Center → Airport", date: "2025-10-09", time: "10:00", price: 50, selectedCar: "" },
    { id: 2, route: "Airport → City Center", date: "2025-10-09", time: "14:00", price: 50, selectedCar: "" },
  ];

  useEffect(() => {
    setCars(defaultCars);
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
        if (shuttlesData.length === 0) setShuttles(defaultShuttles);
        else setShuttles(shuttlesData.map((s) => ({ ...s, selectedCar: "" })));
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

  const handleCarSelect = (shuttleId, carName) => {
    setShuttles((prev) =>
      prev.map((s) => (s.id === shuttleId ? { ...s, selectedCar: carName } : s))
    );
  };

  const handleSeatChange = (shuttleId, seats) => {
    setSeatsSelection((prev) => ({ ...prev, [shuttleId]: Number(seats) }));
  };

  // Save payment to backend
  const savePayment = async (shuttle, seats) => {
    try {
      const paymentData = {
        passenger_name: user.name,
        shuttle_id: Number(shuttle.id),
        booking_id: Math.floor(Math.random() * 1000000),
        car_name: shuttle.selectedCar || "",
        seats,
        amount: Math.round(shuttle.price * seats),
        status: "Paid",
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      const res = await fetch(`${BASE_URL}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(paymentData),
      });

      const data = await res.json();
      if (data.success || res.ok) {
        setBookingSuccess(
          `Booking confirmed for ${seats} seat(s) on ${shuttle.route} (${shuttle.time}, ${shuttle.date}) with ${shuttle.selectedCar}.`
        );
      } else {
        console.error("Failed to save payment:", data);
        alert("Payment save failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Payment save error", err);
      alert("Payment save error: " + err.message);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-black">
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 shadow-xl">
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <div className="text-2xl font-bold tracking-wide text-red-400">MetroShuttle</div>
        </div>
        <div className="flex flex-col items-center justify-center p-4 border-b border-gray-700">
          <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-xl font-bold text-white mb-2 shadow-md">
            {user.name ? user.name[0].toUpperCase() : "P"}
          </div>
          <div className="text-white font-bold text-lg">{user.name}</div>
          <div className="text-gray-300 text-sm">{user.email}</div>
        </div>

        <nav className="flex flex-col flex-grow p-4 space-y-3">
          {[
            { label: "🚍 Book Shuttles", tab: "book" },
            { label: "🚗 View All Cars", tab: "cars" },
            { label: "💺 View My Bookings", tab: "bookings" },
            { label: "👤 View My Profile", tab: "profile" },
            { label: "💳 Track Payments", tab: "payments" },
            { label: "📜 Terms & Conditions", tab: "terms" },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
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

      <main className="flex flex-col flex-grow overflow-auto p-6 space-y-6">
        {activeTab === "book" && (
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Shuttles</h2>
            {shuttles.map((shuttle) => (
              <div key={shuttle.id} className="border border-gray-200 rounded-md p-4 mb-4">
                <div className="text-blue-700 font-semibold text-lg">{shuttle.route}</div>
                <p className="text-sm text-gray-600">{shuttle.date} • {shuttle.time}</p>
                <p className="text-sm text-gray-500">Countdown: {countdowns[shuttle.id]}</p>

                <label className="block text-sm font-medium mb-1 mt-2">Select a Car:</label>
                <select
                  value={shuttle.selectedCar || ""}
                  onChange={(e) => handleCarSelect(shuttle.id, e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="">-- Choose a Car --</option>
                  {cars.map((car) => (
                    <option key={car.registrationNumber} value={car.name}>
                      {`${car.name} (${car.numberPlate}) - ${car.seats} seats`}
                    </option>
                  ))}
                </select>

                <label className="block text-sm font-medium mb-1 mt-2">Seats:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={seatsSelection[shuttle.id] || 1}
                  onChange={(e) => handleSeatChange(shuttle.id, e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />

                <Payment
                  shuttle={shuttle}
                  seats={seatsSelection[shuttle.id] || 1}
                  onPaymentSuccess={(shuttle, seats) => {
                    const car = cars.find((c) => c.name === shuttle.selectedCar);
                    if (!car) return alert("Please select a valid car.");

                    const totalBookedSeats = bookings
                      .filter((b) => b.car.name === car.name && b.shuttle_id === shuttle.id)
                      .reduce((acc, b) => acc + b.seats, 0);

                    if (seats + totalBookedSeats > car.seats) {
                      return alert(`Not enough seats available in ${car.name}.`);
                    }

                    const newBooking = {
                      id: Math.floor(Math.random() * 1000000),
                      shuttle_id: shuttle.id,
                      route: shuttle.route,
                      date: shuttle.date,
                      time: shuttle.time,
                      seats,
                      car,
                      price: shuttle.price * seats,
                    };

                    const updatedBookings = [...bookings, newBooking];
                    setBookings(updatedBookings);
                    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

                    // Save to backend
                    savePayment(shuttle, seats);
                  }}
                />
              </div>
            ))}
          </section>
        )}

        {activeTab === "cars" && (
          <section className="p-8 rounded-lg shadow-lg bg-gradient-to-r from-red-100 via-white to-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">🚗 Department Cars</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div key={car.registrationNumber} className="bg-white rounded-2xl shadow-md p-4">
                  <img src={car.image} alt={car.name} className="w-full h-40 object-cover rounded-xl mb-3" />
                  <h3 className="text-xl font-semibold">{car.name}</h3>
                  <p>Number Plate: {car.numberPlate}</p>
                  <p>Registration: {car.registrationNumber}</p>
                  <p>Seats: {car.seats}</p>
                </div>
              ))}
            </div>
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
          </section>
        )}
      </main>
    </div>
  );
};

export default PassengerDashboard;
