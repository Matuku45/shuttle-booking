// Payment.js
import React from "react";

const STRIPE_TEST_URL = "https://buy.stripe.com/test_7sY28t91X6gegc8gDwcwg00";

const Payment = ({ shuttle, seats, onPaymentSuccess }) => {
  const handleBook = () => {
    // Open Stripe test payment page
    const paymentWindow = window.open(STRIPE_TEST_URL, "_blank");

    // Check every second if user closed the tab
    const paymentCheck = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(paymentCheck);
        // Trigger success callback
        onPaymentSuccess(shuttle, seats);
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
