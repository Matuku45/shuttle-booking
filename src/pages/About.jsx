import React from 'react';
import { FaUser, FaBus, FaHandshake, FaCheckCircle, FaCreditCard } from 'react-icons/fa';

const About = () => (
  <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#f1faee] to-[#e0eafc] text-center px-4 overflow-auto py-12">
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-6 sm:p-10 md:p-16 flex flex-col gap-6 animate-fadeIn">
      
      {/* Emoji Header */}
      <div className="text-5xl sm:text-6xl md:text-7xl mb-4 animate-bounce">🚌</div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#457b9d] via-[#1d3557] to-[#a8dadc] bg-clip-text text-transparent mb-6">
        About MetroShuttle: Connecting South Africa, One City at a Time
      </h1>

      {/* Section 1: Our Mission and Origin */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1d3557] flex items-center justify-center gap-2 mb-4">
        <FaCheckCircle className="text-[#457b9d] animate-pulse" /> About Us – Our Mission and Origin
      </h2>
      <p className="text-gray-700 text-left leading-relaxed">
        MetroShuttle was founded by <strong>Kgabo Manamela</strong> through <strong>SnM Holdings</strong> to make intercity travel what it should be: simple, reliable, and stress-free.
        The idea for this platform was born out of a realization that travelers shouldn't have to choose between expensive, rigid options and inconvenient, time-consuming public transport.
      </p>
      <p className="text-gray-700 text-left leading-relaxed">
        Our goal is to connect cities by providing a premium, on-demand shuttle service booked entirely through our seamless website, offering a modern alternative that respects your time and comfort.
      </p>

      {/* Section 2: Why Choose MetroShuttle */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1d3557] flex items-center justify-center gap-2 mt-8 mb-4">
        <FaBus className="text-[#1d3557] animate-bounce" /> Why Choose MetroShuttle?
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-left space-y-3 ml-4">
        <li>
          <strong>Seamless Booking:</strong> From search to payment, book your ride in minutes. No calls, no waiting—just instant confirmation.
        </li>
        <li>
          <strong>Door-to-Door Convenience:</strong> Forget fixed terminals. We pick you up and drop you off exactly where you need to be, providing true point-to-point service.
        </li>
        <li>
          <strong>Optimized Travel Routes:</strong> We exclusively use major national roads and highways for the fastest, safest, and most comfortable route. Tollgate fees are always included in your fare, ensuring a smooth, uninterrupted journey every time.
        </li>
        <li>
          <strong>Safety First:</strong> Our vetted driver network and modern fleet ensure every journey is safe and comfortable.
        </li>
        <li>
          <strong>Transparent Pricing:</strong> Know your full fare upfront. Our integrated payment system means no hidden fees or cash hassles.
        </li>
      </ul>

      {/* Section 3: Our Team and Promise */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1d3557] flex items-center justify-center gap-2 mt-8 mb-4">
        <FaHandshake className="text-[#457b9d] animate-bounce" /> Our Team and Promise
      </h2>
      <p className="text-gray-700 text-left leading-relaxed">
        While founded by <strong>Kgabo Manamela</strong>, MetroShuttle is driven by a dedicated team of <strong>18 members</strong> across our operations, technology, and customer support departments.
      </p>
      <p className="text-gray-700 text-left leading-relaxed">
        We are committed to making your next inter-city trip the easiest one yet. We handle the logistics so you can focus on the destination.
      </p>
      <p className="text-[#1d3557] font-semibold mt-4 text-lg text-center italic">
        Welcome aboard! 🚐 Your journey to simplicity, safety, and comfort starts here.
      </p>

      {/* Back to Top Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gradient-to-r from-[#457b9d] via-[#1d3557] to-[#a8dadc] text-white px-8 py-3 rounded-xl hover:scale-105 transition-transform shadow-lg font-semibold text-lg"
        >
          Back to Top
        </button>
      </div>
    </div>
  </div>
);

export default About;
