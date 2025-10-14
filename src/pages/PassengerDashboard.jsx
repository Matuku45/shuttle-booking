import React, { useState, useEffect } from "react";
import AddShuttle from "./add-shutle";
import AllCars from "./AllCars";
import AllBookings from "./AllBookings";
import AllShuttles from "./all-available-shutle";

const BASE_URL = "https://shuttle-booking-system.fly.dev";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [shuttles, setShuttles] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile toggle

  const [user] = useState({
    username: "Admin",
    email: "admin@email.com",
    role: "Admin",
  });

  useEffect(() => {
    const fetchShuttles = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/shuttles`);
        if (!res.ok) throw new Error("Failed to load shuttles");
        const data = await res.json();
        setShuttles(Array.isArray(data) ? data : data.shuttles || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchShuttles();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/payments`);
        if (!res.ok) throw new Error("Failed to load payments");
        const data = await res.json();
        const all = Array.isArray(data) ? data : data.payments || [];
        setPayments(all.filter((p) => p.status === "Paid"));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPayments();
  }, []);

  const handleShuttleAdded = (newShuttle) => {
    setShuttles((prev) => [...prev, newShuttle]);
    setShowAddModal(false);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome, {user.username}</h2>
            <p className="text-gray-600 font-medium">
              Use the sidebar to manage shuttles, cars, bookings, and payments.
            </p>
          </div>
        );
      case "add-shuttle":
        return (
          <div className="p-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              ➕ Add New Shuttle
            </button>
            {showAddModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-lg max-w-md w-full overflow-y-auto max-h-[90vh] p-6">
                  <AddShuttle
                    title="Add Shuttle"
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleShuttleAdded}
                  />
                </div>
              </div>
            )}
          </div>
        );
      case "all-shuttles":
        return <AllShuttles shuttles={shuttles} setShuttles={setShuttles} />;
      case "cars":
        return <AllCars />;
      case "bookings":
        return <AllBookings />;
      case "payments":
        return (
          <section className="bg-white p-6 rounded-lg shadow overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">💳 Paid Payments</h2>
            {payments.length === 0 ? (
              <p className="text-gray-600">No paid payments found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border text-gray-900 text-sm">
                  <thead className="bg-yellow-400 text-black">
                    <tr>
                      <th className="p-2 border">Passenger</th>
                      <th className="p-2 border">Booking ID</th>
                      <th className="p-2 border">Amount (R)</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={i} className="odd:bg-gray-50 even:bg-white">
                        <td className="p-2 border">{p.passenger_name}</td>
                        <td className="p-2 border">{p.booking_id}</td>
                        <td className="p-2 border font-bold text-green-700">{p.amount}</td>
                        <td className="p-2 border">{p.status}</td>
                        <td className="p-2 border">
                          {new Date(p.payment_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white p-3 shadow-md w-full">
        <span className="font-bold text-lg">MetroShuttle Admin</span>
        <button
          className="text-2xl font-bold"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 bg-gray-900 text-white flex flex-col shadow-lg flex-shrink-0 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-64 h-full`}
      >
        <div className="flex flex-col items-center justify-center h-24 border-b border-gray-700">
          <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-lg font-bold text-black shadow">
            {user.username[0].toUpperCase()}
          </div>
          <p className="font-semibold mt-2">{user.username}</p>
          <p className="text-gray-400 text-sm">{user.role}</p>
        </div>

        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          {[
            { key: "dashboard", label: "🏠 Dashboard" },
            { key: "add-shuttle", label: "🚌 Add Shuttle" },
            { key: "all-shuttles", label: "🛫 View All Shuttles" },
            { key: "cars", label: "🚗 View All Cars" },
            { key: "bookings", label: "📋 View All Bookings" },
            { key: "payments", label: "💳 Payments" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => {
                setActiveTab(btn.key);
                setSidebarOpen(false); // close sidebar on mobile after click
              }}
              className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === btn.key
                  ? "bg-yellow-400 text-black"
                  : "hover:bg-gray-800 text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
          <a
            href="/login"
            className="block text-center bg-red-600 hover:bg-red-700 py-2 rounded-lg font-bold mt-6"
          >
            🚪 Logout
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 ml-0 md:ml-64">
        {loading ? <p className="text-center mt-10">Loading...</p> : renderTab()}
      </main>
    </div>
  );
};

export default AdminDashboard;
