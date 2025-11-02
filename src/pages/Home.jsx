import React, { useState, useEffect } from "react";
import img1 from "../components/imgs/picture1.webp";
import img2 from "../components/imgs/picture2.webp";
import img3 from "../components/imgs/picture3.webp";
import Shuttle from "../components/imgs/flight.jpg";
import Logo from "../components/imgs/logo.jpg";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    img: img1,
    title: "Connecting Cities, Empowering Journeys",
    description:
      "MetroShuttle connects major cities across the country with comfortable, affordable, and reliable shuttle services. Whether you’re traveling for work, study, or family visits, we make intercity travel simpler than ever.",
  },
  {
    img: img2,
    title: "Smart, Secure & On Time",
    description:
      "With real-time GPS tracking, verified drivers, and a commitment to passenger safety, MetroShuttle ensures your trip is smooth, predictable, and on schedule—every single time.",
  },
  {
    img: img3,
    title: "Travel Made Easy — Anytime, Anywhere",
    description:
      "Book your ride online in seconds, choose your departure city, and get instant confirmation. Our system ensures flexible scheduling, cashless payments, and dependable city-to-city connections.",
  },
];

const Home = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div className="min-h-screen flex flex-col items-center overflow-x-hidden bg-white">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-4 bg-[#0f1b2a] text-white shadow-md">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="MetroShuttle" className="w-12 h-12 rounded-md" />
          <h1 className="text-2xl font-extrabold tracking-wide">
            Metro<span className="text-[#ff6b00]">Shuttle</span>
          </h1>
        </div>
      </nav>

      {/* Hero Card Section */}
      <section className="w-full flex justify-center mt-10">
        <div className="bg-[#0f1b2a] text-white rounded-3xl shadow-2xl px-8 py-12 md:px-16 md:py-16 flex flex-col md:flex-row items-center justify-between max-w-6xl w-[90%]">
          {/* Text section */}
          <div className="text-left max-w-lg space-y-6">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              CLICK YOUR NEXT <br />
              <span className="text-[#ff6b00]">RIDE</span>
            </h2>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed">
              Quick. Easy. Simple. Book your metro shuttle today with{" "}
              <span className="text-[#ff6b00] font-semibold">
                immediate confirmation.
              </span>
              <br />
              MetroShuttle is your all-in-one city-to-city transport solution —
              designed for students, professionals, and families. Enjoy comfort,
              safety, and modern convenience wherever you travel.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
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

          {/* Image section */}
          <div className="relative mt-10 md:mt-0">
            <img
              src={Shuttle}
              alt="MetroShuttle Hero"
              className="w-[450px] md:w-[600px] rounded-xl shadow-[0_0_30px_rgba(255,107,0,0.6)] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#0f1b2a]/20 rounded-xl"></div>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="w-full max-w-6xl py-16 px-6 relative">
        <div className="relative rounded-3xl overflow-hidden shadow-lg">
          <img
            src={slides[current].img}
            alt={slides[current].title}
            className="w-full h-[400px] md:h-[500px] object-cover transition-all duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-10 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-3 text-[#ff6b00]">
              {slides[current].title}
            </h3>
            <p className="text-lg md:text-xl max-w-3xl text-gray-100 leading-relaxed">
              {slides[current].description}
            </p>
            <button
              onClick={() => navigate("/booking")}
              className="mt-6 w-fit bg-[#ff6b00] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-[#0f1b2a] transition"
            >
              Book Your Shuttle
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-6 gap-3">
          {slides.map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-4 h-4 rounded-full cursor-pointer transition-all ${
                i === current ? "bg-[#ff6b00] scale-110" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Extra Info Section */}
      <section className="w-full bg-gray-50 py-20 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f1b2a] mb-6">
          Why Choose MetroShuttle?
        </h2>
        <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
          We are redefining the way people travel between cities — no queues, no
          paper tickets, no uncertainty. MetroShuttle offers a fully digital
          experience with online booking, route visibility, affordable fares,
          and dedicated customer support. Whether it’s Johannesburg to Pretoria,
          Durban to Pietermaritzburg, or anywhere across South Africa, we’re
          here to move you — safely and comfortably.
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-100 text-center text-gray-700 border-t border-gray-200">
        © 2025 MetroShuttle — Connecting Cities. Empowering Mobility.
      </footer>
    </div>
  );
};

export default Home;
