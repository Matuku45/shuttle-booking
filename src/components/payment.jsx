// Payment.js
import React from "react";

const STRIPE_TEST_URL = "https://buy.stripe.com/test_7sY28t91X6gegc8gDwcwg00";

const Payment = ({ shuttle, seats, onPaymentSuccess }) => {
  const handleBook = () => {
    if (!shuttle.selectedCar) return alert("Please select a car before payment.");

    // Open Stripe prebuilt test URL directly
    const paymentWindow = window.open(STRIPE_TEST_URL, "_blank");

    // Optional: detect when the Stripe tab is closed
    const paymentCheck = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(paymentCheck);
        // Trigger booking success (no backend verification needed for test)
        onPaymentSuccess(shuttle, seats);
        alert("Payment window closed. Booking marked as complete!");
      }
    }, 1000);
  };

  return (
    <button
      onClick={handleBook}
      className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Pay & Book
    </button>
  );
};

export default Payment;
