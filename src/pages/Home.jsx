import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import img1 from "../components/imgs/picture1.webp";
import img2 from "../components/imgs/picture2.webp";
import img3 from "../components/imgs/picture3.webp";
import ShuttleImg from "../components/imgs/flight.jpg";
import Logo from "../components/imgs/logo.jpg";

const slides = [
  {
    img: img1,
    title: "Connecting Cities, Empowering Journeys",
    description:
      "MetroShuttle connects major cities across the country with comfortable, affordable, and reliable shuttle services. Travel smarter, faster, and safer.",
  },
  {
    img: img2,
    title: "Smart, Secure & On Time",
    description:
      "With real-time GPS tracking, verified drivers, and passenger safety first, MetroShuttle ensures a smooth and timely journey every time.",
  },
  {
    img: img3,
    title: "Travel Made Easy — Anytime, Anywhere",
    description:
      "Book online in seconds, select your seats, and pay instantly. MetroShuttle brings you comfort, flexibility, and convenience on every ride.",
  },
];

const OZOW_API = "https://python-script-ozzowtesting-1.onrender.com/api/pay";
const DEFAULT_CAR = { name: "MetroShuttle Bus", seats: 10 };

// **Static shuttle data**
const STATIC_SHUTTLES = [
  { id: 1, route: "Johannesburg → Pretoria", time: "08:00 AM", price: 150 },
  { id: 2, route: "Cape Town → Stellenbosch", time: "09:30 AM", price: 120 },
  { id: 3, route: "Durban → Pietermaritzburg", time: "07:00 AM", price: 100 },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [seatsSelection, setSeatsSelection] = useState({});
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Slide rotation
  useEffect(() => {
    const timer = setTimeout(
      () => setCurrentSlide((prev) => (prev + 1) % slides.length),
      5000
    );
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleSeatChange = (id, seats) => {
    setSeatsSelection((prev) => ({ ...prev, [id]: Number(seats) }));
  };

  const handlePayNow = async (shuttle) => {
    const seats = seatsSelection[shuttle.id] || 1;
    const totalAmount = shuttle.price * seats;
    setLoadingPayment(true);

    try {
      const payload = {
        booking_id: Math.floor(Math.random() * 1000000), // dummy booking ID
        amount: totalAmount,
        email: "passenger@example.com",
        phone: "0820000000",
        name: "Passenger",
      };

      const res = await fetch(OZOW_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Payment failed. Try again.");
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment error. Try again.");
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-4 bg-[#0f1b2a] text-white shadow-md fixed z-50">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="MetroShuttle" className="w-12 h-12 rounded-md" />
          <h1 className="text-2xl font-extrabold tracking-wide">
            Metro<span className="text-[#ff6b00]">Shuttle</span>
          </h1>
        </div>
      </nav>

      {/* Hero Slider */}
      <section className="flex justify-center mt-24 mb-16 px-4">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-[#0f1b2a] text-white rounded-3xl shadow-2xl px-8 py-12 md:px-16 md:py-16 flex flex-col md:flex-row items-center justify-between max-w-6xl w-full"
        >
          <div className="max-w-lg space-y-6">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              {slides[currentSlide].title}
            </h2>
            <p className="text-white/80 text-lg md:text-xl">
              {slides[currentSlide].description}
            </p>
          </div>
          <div className="mt-10 md:mt-0">
            <img
              src={ShuttleImg}
              alt="Shuttle"
              className="w-[400px] md:w-[600px] rounded-xl shadow-[0_0_30px_rgba(255,107,0,0.6)] object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* Static Shuttle Section */}
      <section className="bg-gray-50 py-16">
        <h2 className="text-4xl font-extrabold text-center mb-12">
          🚍 Available Shuttles
        </h2>
        <div className="flex flex-wrap justify-center gap-6 px-4 md:px-12">
          {STATIC_SHUTTLES.map((shuttle) => {
            const seats = seatsSelection[shuttle.id] || 1;
            return (
              <motion.div
                key={shuttle.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: shuttle.id * 0.2 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg w-80 hover:shadow-2xl transition transform hover:scale-105"
              >
                <h3 className="font-bold text-lg mb-2">{shuttle.route}</h3>
                <p className="text-sm text-gray-500 mb-3">Departure: {shuttle.time}</p>
                <p className="text-sm text-gray-500 mb-3">Price per seat: R{shuttle.price}</p>

                <div className="mb-3">
                  <label className="block text-gray-600 text-sm mb-1">Seats:</label>
                  <input
                    type="number"
                    min="1"
                    max={DEFAULT_CAR.seats}
                    value={seats}
                    onChange={(e) => handleSeatChange(shuttle.id, e.target.value)}
                    className="border rounded p-1 w-full text-center"
                  />
                </div>

                <button
                  onClick={() => handlePayNow(shuttle)}
                  disabled={loadingPayment}
                  className="w-full bg-[#ff6b00] text-white py-2 rounded-md font-bold hover:bg-orange-600 transition"
                >
                  {loadingPayment
                    ? "Processing..."
                    : `Pay R${(seats * shuttle.price).toFixed(2)} →`}
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-100 text-center text-gray-700 border-t mt-16">
        © 2025 MetroShuttle — Connecting Cities. Empowering Mobility.
      </footer>
    </div>
  );
};

export default Home;
