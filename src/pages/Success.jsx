import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const [latestPayment, setLatestPayment] = useState(null);
  const [filteredCheckouts, setFilteredCheckouts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load latest payment info
    const payment = JSON.parse(localStorage.getItem("latestPayment"));
    setLatestPayment(payment);

    // Get current logged-in user
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userEmail = storedUser?.email || payment?.passenger_email;

    // Fetch all checkout sessions
    const fetchCheckouts = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/checkout/sessions");
        const data = await res.json();

        if (data.success && data.sessions) {
          // Filter based on user email
          const userCheckouts = data.sessions.filter(
            (s) =>
              s.userEmail?.toLowerCase() === userEmail?.toLowerCase() ||
              s.email?.toLowerCase() === userEmail?.toLowerCase()
          );
          setFilteredCheckouts(userCheckouts);
        }
      } catch (err) {
        console.error("Failed to fetch checkouts:", err.message);
      }
    };

    fetchCheckouts();
  }, []);

  // 🧭 Continue to Stripe Payment
  const handleContinue = () => {
    // Updated test link
    window.location.href = "https://buy.stripe.com/test_7sY5kFgupfQO7FC4UOcwg01";
  };

  // ❌ Delete Payment and go back
  const handleDelete = () => {
    localStorage.removeItem("latestPayment");
    navigate("/passenger");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-yellow-200 text-center p-6">
      <h1 className="text-4xl font-bold text-yellow-800 mb-4 animate-pulse">
        ⏳ Payment Pending
      </h1>
      <p className="text-gray-700 mb-6 text-lg">
        Your payment has been recorded but is still awaiting completion.
      </p>

      {latestPayment ? (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-left mb-6 border-l-4 border-yellow-400">
          <h2 className="text-xl font-semibold text-yellow-700 mb-3">
            Payment Details
          </h2>
          <p><strong>Name:</strong> {latestPayment.passenger_name}</p>
          <p><strong>Email:</strong> {latestPayment.passenger_email}</p>
          <p><strong>Shuttle ID:</strong> {latestPayment.shuttle_id}</p>
          <p><strong>Seats:</strong> {latestPayment.seats}</p>
          <p><strong>Amount Due:</strong> R{latestPayment.amount}</p>
          <p><strong>Status:</strong> ⏳ Pending</p>
        </div>
      ) : (
        <p className="text-gray-600 italic mb-6">
          Loading payment information...
        </p>
      )}

      {filteredCheckouts.length > 0 && (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg text-left mb-8">
          <h2 className="text-xl font-semibold text-yellow-700 mb-3">
            Your Checkout Sessions
          </h2>
          <ul className="space-y-2">
            {filteredCheckouts.map((c) => (
              <li key={c.id} className="border-b border-gray-200 pb-2">
                <p><strong>Shuttle:</strong> {c.shuttleRoute || c.shuttle_id}</p>
                <p><strong>Seats:</strong> {c.seats}</p>
                <p><strong>Amount:</strong> R{c.price || c.amount}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔘 Buttons (Always Visible) */}
      <div className="flex flex-col sm:flex-row gap-6 mt-8 justify-center">
        <button
          onClick={handleContinue}
          className="bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out w-64"
        >
          💳 Continue to Complete Payment
        </button>

      <button
  onClick={handleDelete}
  className="bg-red-600 text-white text-center px-6 sm:px-8 py-4 rounded-xl font-extrabold text-lg sm:text-xl shadow-lg hover:bg-red-700 transition duration-300 ease-in-out w-64 whitespace-normal break-words"
>
  ❌ Cancel & Go Back
</button>

      </div>
    </div>
  );
};

export default Success;
