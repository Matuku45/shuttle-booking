import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import flightImage from "../components/imgs/flight.jpg";

const BASE_URL = "https://shuttle-booking-system.fly.dev";

const Login = ({ onForgotPasswordClick }) => {
  const [form, setForm] = useState({ username: "", password: "", role: "passenger" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.role) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        // Ensure name is saved for passenger dashboard
        const userInfo = {
          name: data.user.name || data.user.username || form.username,
          email: data.user.email || form.username,
          phone: data.user.phone || "",
          role: data.user.role || form.role,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));

        if (userInfo.role === "admin") navigate("/admin");
        else navigate("/passenger");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server unreachable. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-xl overflow-hidden shadow-lg">
        {/* Left Side - Form */}
        <div className="flex-1 bg-white p-6 sm:p-10 md:p-12 flex flex-col justify-center min-w-[280px]">
          <div className="text-center mb-6 sm:mb-10">
            <img
              src={flightImage}
              alt="logo"
              className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl shadow-md mx-auto mb-4"
            />
            <h3 className="text-blue-700 mb-1 text-2xl sm:text-3xl font-semibold">
              Shuttle Booking System
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border border-blue-400 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border border-blue-400 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-3 border border-blue-400 rounded-lg bg-slate-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="passenger">Passenger</option>
              <option value="admin">Admin</option>
            </select>

            {error && <div className="text-red-600 text-center">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? "bg-blue-400" : "bg-blue-700 hover:bg-blue-800"} text-white font-bold py-3 rounded-lg transition`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-center mt-2">
              <a
                href="#"
                className="text-blue-500 underline"
                onClick={(e) => {
                  e.preventDefault();
                  onForgotPasswordClick?.();
                }}
              >
                Forgot password?
              </a>
            </div>

            <div className="text-center flex flex-col sm:flex-row justify-center items-center gap-2 mt-2">
              <span>Don't have an account?</span>
              <button
                type="button"
                className="border border-red-600 text-red-600 font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition"
                onClick={() => navigate("/signup")}
              >
                Create new
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Background Image */}
        <div
          className="flex-1 relative min-w-[280px] flex items-center justify-center text-white p-6 sm:p-8"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(29,78,216,0.8), rgba(69,123,157,0.8)), url(${flightImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-black bg-opacity-30 p-6 rounded-lg max-w-full">
            <h3 className="mb-4 text-lg sm:text-xl md:text-2xl font-semibold">
              We are more than just a company
            </h3>
            <p className="text-sm sm:text-base md:text-lg">
              Plan and book your trips easily. Whether you are a passenger or
              admin, our shuttle booking system ensures a seamless experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
