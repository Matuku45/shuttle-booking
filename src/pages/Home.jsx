import React, { useState, useEffect } from "react";
import img1 from "../components/imgs/picture1.webp";
import img2 from "../components/imgs/picture2.webp";
import img3 from "../components/imgs/picture3.webp";
import Shuttle from "../components/imgs/flight.jpg"; // main hero image
import Logo from "../components/imgs/logo.jpg";
import { useNavigate } from "react-router-dom"; // for redirecting

const images = [img1, img2, img3];

const Home = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div className="min-h-screen bg-[#0f1b2a] text-white flex flex-col items-center overflow-x-hidden">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-4 bg-[#0f1b2a] border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="MetroShuttle" className="w-12 h-12 rounded-md" />
          <h1 className="text-2xl font-extrabold tracking-wide text-white">
            Metro<span className="text-[#ff6b00]">Shuttle</span>
          </h1>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-8 py-12 md:py-20">
        <div className="text-left max-w-lg space-y-6">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            CLICK YOUR NEXT <br />
            <span className="text-[#ff6b00]">RIDE</span>
          </h2>
          <p className="text-white/80 text-lg md:text-xl">
            Quick. Easy. Simple. Book your metro shuttle today with{" "}
            <span className="text-[#ff6b00] font-semibold">
              immediate confirmation.
            </span>
          </p>

          {/* Updated Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#ff6b00] px-6 py-3 rounded-md text-lg font-bold hover:bg-white hover:text-[#0f1b2a] transition"
            >
              Passenger
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border-2 border-[#ff6b00] px-6 py-3 rounded-md text-lg font-bold hover:bg-[#ff6b00] hover:text-white transition"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="relative mt-10 md:mt-0">
          <img
            src={Shuttle}
            alt="MetroShuttle Hero"
            className="w-[500px] md:w-[650px] rounded-xl shadow-[0_0_30px_rgba(255,107,0,0.6)] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#0f1b2a]/20 rounded-xl"></div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="w-full max-w-4xl py-12 relative">
        <img
          src={images[current]}
          alt="Shuttle"
          className="w-full h-72 md:h-96 object-cover rounded-xl shadow-lg"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === current ? "bg-[#ff6b00]" : "bg-white/40"
              } transition-all`}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 bg-[#0d1625] text-center text-white/70 border-t border-white/10 mt-8">
        © 2025 MetroShuttle — Designed for smart mobility
      </footer>
    </div>
  );
};

export default Home;
