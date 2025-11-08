import React from "react";
import { motion } from "framer-motion";
import { FaUserTie, FaMapMarkedAlt, FaShieldAlt, FaMoneyCheckAlt, FaHandshake } from "react-icons/fa";

const About = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0eafc] to-[#f9f9f9] flex flex-col items-center justify-center px-6 py-16 overflow-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-14 space-y-10"
      >
        {/* Title */}
        <motion.h1
          variants={fadeUp}
          className="text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-[#1d3557] via-[#457b9d] to-[#a8dadc] bg-clip-text text-transparent"
        >
          About MetroShuttle
        </motion.h1>

        <motion.p variants={fadeUp} className="text-center text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
          Connecting South Africa — One City at a Time.  
          We redefine intercity travel by making it <strong>simple</strong>, <strong>reliable</strong>, and <strong>stress-free</strong>.
        </motion.p>

        {/* Section 1: Mission and Origin */}
        <motion.div variants={fadeUp} className="card bg-gradient-to-r from-[#e8f0f7] to-[#f1faee] p-8 rounded-2xl shadow-md hover:shadow-xl transition">
          <h2 className="text-2xl font-bold text-[#1d3557] mb-4 flex items-center gap-2">
            <FaUserTie className="text-[#457b9d]" /> Our Mission and Origin
          </h2>
          <p className="text-gray-700 leading-relaxed">
            MetroShuttle was founded by <strong>Kgabo Manamela</strong> through <strong>SnM Holdings</strong> to make intercity travel what it should be: simple, reliable, and stress-free.
            The idea for this platform was born from the realization that travelers shouldn’t have to choose between expensive, rigid options and inconvenient, time-consuming public transport.
          </p>
          <p className="text-gray-700 mt-4 leading-relaxed">
            Our goal is to connect cities by providing a premium, on-demand shuttle service booked entirely through our seamless website — offering a modern alternative that respects your time and comfort.
          </p>
        </motion.div>

        {/* Section 2: Why Choose Us */}
        <motion.div variants={fadeUp} className="card bg-gradient-to-r from-[#f1faee] to-[#e0f7fa] p-8 rounded-2xl shadow-md hover:shadow-xl transition">
          <h2 className="text-2xl font-bold text-[#1d3557] mb-6 flex items-center gap-2">
            <FaMapMarkedAlt className="text-[#1d3557]" /> Why Choose MetroShuttle?
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div className="p-4 rounded-xl border border-[#a8dadc]/40 bg-white/70 hover:bg-white transition">
              <h3 className="font-semibold text-[#1d3557]">Seamless Booking</h3>
              <p>From search to payment, book your ride in minutes — no calls, no waiting, just instant confirmation.</p>
            </div>

            <div className="p-4 rounded-xl border border-[#a8dadc]/40 bg-white/70 hover:bg-white transition">
              <h3 className="font-semibold text-[#1d3557]">Door-to-Door Convenience</h3>
              <p>Forget fixed terminals. We pick you up and drop you off exactly where you need to be.</p>
            </div>

            <div className="p-4 rounded-xl border border-[#a8dadc]/40 bg-white/70 hover:bg-white transition">
              <h3 className="font-semibold text-[#1d3557]">Optimized Travel Routes</h3>
              <p>We use major national roads for the fastest, safest, and most comfortable route — tolls included.</p>
            </div>

            <div className="p-4 rounded-xl border border-[#a8dadc]/40 bg-white/70 hover:bg-white transition">
              <h3 className="font-semibold text-[#1d3557]">Safety First</h3>
              <p>Our vetted driver network and modern fleet ensure every journey is secure and comfortable.</p>
            </div>

            <div className="p-4 rounded-xl border border-[#a8dadc]/40 bg-white/70 hover:bg-white transition md:col-span-2">
              <h3 className="font-semibold text-[#1d3557]">Transparent Pricing</h3>
              <p>Know your fare upfront — our integrated payment system means no hidden fees or cash hassles.</p>
            </div>
          </div>
        </motion.div>

        {/* Section 3: Our Team and Promise */}
        <motion.div variants={fadeUp} className="card bg-gradient-to-r from-[#e0f7fa] to-[#f1faee] p-8 rounded-2xl shadow-md hover:shadow-xl transition">
          <h2 className="text-2xl font-bold text-[#1d3557] mb-4 flex items-center gap-2">
            <FaHandshake className="text-[#457b9d]" /> Our Team and Promise
          </h2>
          <p className="text-gray-700 leading-relaxed">
            While founded by <strong>Kgabo Manamela</strong>, MetroShuttle is powered by a passionate team of <strong>18 professionals</strong> across operations, technology, and customer support.
          </p>
          <p className="text-gray-700 mt-4 leading-relaxed">
            We are committed to making your next inter-city trip the easiest one yet — handling the logistics so you can focus on your destination.
          </p>
          <p className="text-[#1d3557] font-semibold mt-6 text-lg text-center italic">
            “Welcome aboard! Your journey to simplicity, safety, and comfort starts here.” ✨
          </p>
        </motion.div>

        {/* Back to Top */}
        <motion.div variants={fadeUp} className="flex justify-center mt-10">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="btn bg-gradient-to-r from-[#457b9d] to-[#1d3557] text-white border-none hover:scale-105 transition-transform shadow-lg"
          >
            Back to Top
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
