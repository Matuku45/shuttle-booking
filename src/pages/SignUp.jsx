import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserShield } from "react-icons/fa";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    whatsapp: "",
    role: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine phone + WhatsApp into one string for backend
    const combinedPhone = `${formData.phone}|${formData.whatsapp}`;

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: combinedPhone, // store both numbers under "phone"
      role: formData.role,
    };

    console.log("Sending body:", payload);

    try {
      const res = await fetch(
        "https://my-payment-session-shuttle-system-cold-glade-4798.fly.dev/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setSuccess("Account created successfully!");
        setError("");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Registration failed. Try again.");
        setSuccess("");
      }
    } catch (err) {
      setError("Server error. Please check connection.");
      console.error(err);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-xl p-8 sm:p-10 w-full max-w-md backdrop-blur-md"
      >
        <div className="text-center mb-6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
            alt="logo"
            className="w-32 mx-auto sm:w-44"
          />
          <h4 className="mt-2 text-gray-700 text-base sm:text-lg font-semibold">
            We are The Lotus Team
          </h4>
        </div>

        <h2 className="text-center text-blue-800 font-bold text-xl sm:text-2xl uppercase mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <label className="block text-gray-800 font-medium text-sm sm:text-base">
            <FaUser className="inline mr-2 text-blue-700" /> Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full p-3 border border-blue-400 rounded-lg text-gray-800 bg-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Email */}
          <label className="block text-gray-800 font-medium text-sm sm:text-base">
            <FaEnvelope className="inline mr-2 text-blue-700" /> Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-3 border border-blue-400 rounded-lg text-gray-800 bg-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Phone */}
          <label className="block text-gray-800 font-medium text-sm sm:text-base">
            <FaPhone className="inline mr-2 text-blue-700" /> Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full p-3 border border-blue-400 rounded-lg text-gray-800 bg-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* WhatsApp */}
          <label className="block text-gray-800 font-medium text-sm sm:text-base">
            <FaPhone className="inline mr-2 text-green-600" /> WhatsApp Number
          </label>
          <input
            type="tel"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="Enter your WhatsApp number"
            className="w-full p-3 border border-green-400 rounded-lg text-gray-800 bg-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Password */}
          <label className="block text-gray-800 font-medium text-sm sm:text-base">
            <FaLock className="inline mr-2 text-blue-700" /> Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="w-full p-3 border border-blue-400 rounded-lg text-gray-800 bg-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Role */}
          <label className="block text-gray-800 font-medium text-sm sm:text-base">
            <FaUserShield className="inline mr-2 text-blue-700" /> Select Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border border-blue-400 rounded-lg text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
          
          
            <option value="passenger">Passenger</option>
          </select>

          {/* Agreement */}
          <div className="flex items-start mt-2 space-x-2">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              id="agree"
              className="w-4 h-4 mt-1 accent-blue-600"
            />
            <label htmlFor="agree" className="text-gray-700 text-sm sm:text-base">
              I agree to the{" "}
              <a href="#!" className="text-blue-600 underline hover:text-blue-700">
                Terms of service
              </a>
            </label>
          </div>

          {/* Error or Success */}
          {error && <div className="text-red-600 text-center font-medium">{error}</div>}
          {success && <div className="text-green-600 text-center font-medium">{success}</div>}

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl text-lg hover:bg-blue-800 transition-all duration-300 shadow-lg"
          >
            Register
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-700 mt-6 text-sm sm:text-base">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold underline hover:text-blue-800">
            Login here
          </a>
        </p>
      </motion.div>
    </section>
  );
};

export default SignUp;
