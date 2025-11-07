import React, { useState, useEffect } from "react";
import { FaClock, FaEnvelope, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";

const BASE_URL = "https://my-payment-session-shuttle-system-cold-glade-4798.fly.dev";

const TrackAllPayment = () => {
  const [payments, setPayments] = useState([]);
  const [timers, setTimers] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/payments`);
        const data = await res.json();

        if (data.success && Array.isArray(data.payments)) {
          setPayments(data.payments);
        } else {
          setPayments([]);
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      payments.forEach((p) => {
        const diff = new Date(p.date).getTime() - new Date().getTime();
        newTimers[p.id] =
          diff > 0
            ? `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m ${Math.floor((diff % 60000) / 1000)}s`
            : "Completed";
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [payments]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-base-200">
        <span className="text-lg text-primary font-semibold">Loading payments...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 bg-base-100">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-primary">
        💰 All Payments (Admin)
      </h2>

      {payments.length === 0 ? (
        <p className="text-center text-gray-500 font-semibold text-lg">
          No payments found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((p) => (
            <div
              key={p.id}
              className="card bg-base-200 shadow-xl border-l-4 border-primary transition-transform transform hover:scale-105"
            >
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <h3 className="card-title text-primary">{p.userName}</h3>
                  <span className="badge badge-primary gap-2 flex items-center">
                    <FaClock /> {timers[p.id]}
                  </span>
                </div>

                <p className="flex items-center gap-2 text-secondary">
                  <FaMoneyBillWave /> Amount: <span className="font-semibold">R {p.amount}</span>
                </p>

                <p className="flex items-center gap-2 text-secondary">
                  <FaEnvelope /> {p.email}
                </p>

                <p className="flex items-center gap-2 text-secondary">
                  <FaCheckCircle /> Status: <span className="font-semibold">{p.status}</span>
                </p>

                <p className="text-sm text-gray-500">Payment Date: {new Date(p.date).toLocaleString()}</p>

                <div className="card-actions mt-4">
                  <button className="btn btn-primary btn-sm w-full">View Booking</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackAllPayment;
