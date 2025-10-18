import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-200 via-white to-red-100 text-center p-6">
      <h1 className="text-4xl font-bold text-red-800 mb-4">❌ Payment Canceled</h1>
      <p className="text-gray-700 mb-6 text-lg">
        Your payment was not completed. You can try again below.
      </p>

      <button
        onClick={() => navigate("/passenger")}
        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default Cancel;
