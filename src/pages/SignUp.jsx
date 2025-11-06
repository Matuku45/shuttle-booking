import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserShield } from "react-icons/fa";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    repeatPassword: "",
    role: "",
    agree: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password || !form.repeatPassword || !form.role) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password !== form.repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.agree) {
      setError("You must agree to the Terms of service.");
      return;
    }

    try {
      const response = await fetch("https://shuttle-booking-system.fly.dev/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setError("");
        setForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          repeatPassword: "",
          role: "",
          agree: false,
        });
        navigate("/login");
      } else {
        setError(data.message || "Something went wrong");
        setSuccess("");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
      setSuccess("");
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
          {/* Name */}
          <label className="block text-gray-800 font-medium text-sm sm:text-base">
            <FaUser className="inline mr-2 text-blue-700" /> Full Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
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
            value={form.email}
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
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full p-3 border border-blue-400 rounded-lg text-gray-800 bg-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password */}
          <label className="block text-gray-800 font-medium text-sm sm:text-base">
            <FaLock className="inline mr-2 text-blue-700" /> Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="w-full p-3 border border-blue-400 rounded-lg text-gray-800 bg-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Repeat Password */}
          <label className="block text-gray-800 font-medium text-sm sm:text-base">
            <FaLock className="inline mr-2 text-blue-700" /> Confirm Password
          </label>
          <input
            type="password"
            name="repeatPassword"
            value={form.repeatPassword}
            onChange={handleChange}
            placeholder="Repeat your password"
            className="w-full p-3 border border-blue-400 rounded-lg text-gray-800 bg-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Role */}
          <label className="block text-gray-800 font-medium text-sm sm:text-base">
            <FaUserShield className="inline mr-2 text-blue-700" /> Select Role
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 border border-blue-400 rounded-lg text-gray-800 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose your role --</option>
            <option value="admin">Admin</option>
            <option value="passenger">Passenger</option>
          </select>

          {/* Agreement */}
          <div className="flex items-start mt-2 space-x-2">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
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
