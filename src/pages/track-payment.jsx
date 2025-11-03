import React, { useState, useEffect } from "react";

const BASE_URL = "https://my-payment-session-shuttle-system-cold-glade-4798.fly.dev/api/payments";

export default function TrackPayment({ passengerName, refreshTrigger }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error("Failed to fetch payments");

        const data = await res.json();
        const allPayments = Array.isArray(data) ? data : data.payments || [];

        // Filter by logged-in passenger (case-insensitive)
     const userPayments = allPayments.filter(
  (p) =>
    p.passenger_name &&
    p.passenger_name.toLowerCase().includes(passengerName.toLowerCase())
);


        setPayments(userPayments);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch payments. Please try again later.");
        setLoading(false);
      }
    };

    if (passengerName) fetchPayments();
  }, [passengerName, refreshTrigger]); // re-fetch when a new payment is made

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-ZA") : "-";

  if (loading)
    return <p className="text-center py-4 text-gray-500">Loading payments...</p>;
  if (error)
    return <p className="text-center py-4 text-red-500">{error}</p>;

  return (
    <section className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payments Tracker</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 px-4 py-2 text-left">Passenger</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Shuttle ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Booking ID</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Amount (ZAR)</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  No payments recorded for you.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.booking_id || payment.id} className="even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{payment.passenger_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.shuttle_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.booking_id}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">R {payment.amount}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment.status}</td>
                  <td className="border border-gray-300 px-4 py-2">{formatDate(payment.payment_date)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
