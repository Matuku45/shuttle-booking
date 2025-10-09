import React from 'react';
import { FaUser, FaBus, FaHandshake, FaCheckCircle, FaCreditCard } from 'react-icons/fa';

const About = () => (
  <div className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#f1faee] to-[#e0eafc] text-center px-4 overflow-auto">
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-6 sm:p-10 md:p-16 flex flex-col gap-6 animate-fadeIn">
      
      {/* Emoji Header */}
      <div className="text-5xl sm:text-6xl md:text-7xl mb-4 animate-bounce">🚌</div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-to-r from-[#457b9d] via-[#1d3557] to-[#a8dadc] mb-6 bg-clip-text text-transparent">
        About MetroShuttle: Connecting South Africa, One City at a Time
      </h1>

      {/* Intro Paragraph */}
      <p className="text-base sm:text-lg md:text-xl mb-6">
        Welcome to MetroShuttle, your trusted platform for seamless and reliable city-to-city transport across South Africa.
        We believe traveling between major metros and vibrant towns shouldn't be complicated or costly.
        Our mission is simple: to connect passengers with independent, professional shuttle partners using smart technology and a deep understanding of local travel needs.
      </p>

      {/* Our Mission */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1d3557] mb-4 flex items-center justify-center gap-2">
        <FaCheckCircle className="text-[#457b9d] animate-pulse"/> Our Mission
      </h2>
      <p className="text-gray-700 mb-6">
        To empower local commuters and travelers by providing a reliable, safe, and convenient intercity shuttle booking service.
        We envision a connected South Africa where reliable transportation is accessible to everyone, everywhere.
      </p>

      {/* How MetroShuttle Works */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1d3557] mb-4 flex items-center justify-center gap-2">
        <FaBus className="text-[#1d3557] animate-bounce"/> How MetroShuttle Works
      </h2>
      <div className="text-gray-700 text-left space-y-3">
        <p><strong>MetroShuttle is a tech platform:</strong> not a traditional transport company. We act as a bridge connecting passengers and independent Shuttle Partners.</p>
        
        {/* Passenger Section */}
        <h3 className="font-semibold mt-2 flex items-center gap-2 text-[#457b9d]">
          <FaUser className="animate-pulse"/> For the Passenger: Travel Made Simple
        </h3>
        <ul className="list-disc list-inside ml-5 text-gray-700 space-y-1">
          <li><strong>All-Inclusive Pricing:</strong> The fare you see is what you pay, covering the seat, journey, and expected tolls.</li>
          <li><strong>Reliability:</strong> We prioritize Shuttle Partners known for punctuality and high service standards.</li>
          <li><strong>Safety First:</strong> Vehicles are vetted, and clear safety guidelines are maintained. Your peace of mind is our priority.</li>
          <li><strong>Booking Flexibility:</strong> Browse shuttles, select seats, and cancel according to platform policies.</li>
          <li><strong>Transparent Communication:</strong> Connect directly with Shuttle Partners for queries or lost items recovery.</li>
        </ul>

        {/* Shuttle Partner Section */}
        <h3 className="font-semibold mt-4 flex items-center gap-2 text-[#1d3557]">
          <FaHandshake className="animate-bounce"/> For the Shuttle Partner: Growing Together
        </h3>
        <ul className="list-disc list-inside ml-5 text-gray-700 space-y-1">
          <li><strong>Empowerment:</strong> Control over your schedule and routes.</li>
          <li><strong>Growth Support:</strong> 0% commission for the first month to help onboard and grow.</li>
          <li><strong>Future Commission:</strong> Implemented later for marketing, platform maintenance, and secure data handling.</li>
          <li><strong>Independent Contractor:</strong> Responsible for your own vehicle, licensing, and insurance.</li>
          <li><strong>Reliable Payment:</strong> Fare collected minus applicable service fees and taxes.</li>
        </ul>
      </div>

      {/* Booking Steps */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1d3557] mt-6 mb-4 flex items-center gap-2">
        <FaCreditCard className="animate-pulse"/> Booking Steps
      </h2>
      <ol className="list-decimal list-inside space-y-3 text-gray-800 text-sm sm:text-base md:text-lg text-left">
        <li><strong>Sign In:</strong> Log in or create an account to book.</li>
        <li><strong>Search for a Shuttle:</strong> Choose departure, destination, and travel date.</li>
        <li>
          <strong>View Available Shuttles:</strong>
          <ul className="list-disc list-inside ml-5 mt-1 space-y-1 text-gray-700">
            <li>Departure time</li>
            <li>Number of available seats</li>
            <li>Price per seat</li>
          </ul>
        </li>
        <li><strong>Select & Book:</strong> Choose your shuttle and seats, then confirm your booking.</li>
        <li><strong>Payment:</strong> Securely pay online via integrated gateways.</li>
        <li><strong>Confirmation:</strong> Your booking is confirmed and stored in your profile. Optional email confirmation sent.</li>
      </ol>

      {/* MetroShuttle Difference */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1d3557] mt-6 mb-4 flex items-center gap-2">
        <FaBus className="animate-bounce"/> The MetroShuttle Difference
      </h2>
      <p className="text-gray-700 mb-6">
        Proudly South African, we understand the distances, roads, and the need for trustworthy service. Every journey booked supports an independent local business. Join us in building a better, more connected transport network across Mzansi!
      </p>

      {/* Back to Top Button */}
      <div className="flex justify-center mt-6">
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
