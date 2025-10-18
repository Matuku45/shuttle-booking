import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const [payment, setPayment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load payment details from localStorage
    const latestPayment = JSON.parse(localStorage.getItem("latestPayment"));
    setPayment(latestPayment);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-white to-green-100 text-center p-6">
      <h1 className="text-4xl font-bold text-green-800 mb-4">🎉 Payment Successful!</h1>
      <p className="text-gray-700 mb-6 text-lg">Thank you for your booking.</p>

      {payment && (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-left">
          <h2 className="text-xl font-semibold text-green-700 mb-3">Payment Details</h2>
          <p><strong>Name:</strong> {payment.passenger_name}</p>
          <p><strong>Email:</strong> {payment.passenger_email}</p>
          <p><strong>Shuttle ID:</strong> {payment.shuttle_id}</p>
          <p><strong>Seats:</strong> {payment.seats}</p>
          <p><strong>Amount Paid:</strong> R{payment.amount}</p>
          <p><strong>Status:</strong> ✅ Paid</p>
        </div>
      )}

      <button
        onClick={() => navigate("/passenger")}
        className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default Success;
