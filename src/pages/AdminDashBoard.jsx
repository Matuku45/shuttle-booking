// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import AddShuttle from "./add-shutle";
import AllShuttles from "./all-available-shutle"; // ✅ Import AllShuttles component
import AllCars from "./AllCars";
import AllBookings from "./AllBookings";
import ViewAllLocations from "./ViewAllLocations";

const BASE_URL = "https://shuttle-booking-system.fly.dev";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [shuttles, setShuttles] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user] = useState({
    username: "Admin",
    email: "admin@email.com",
    role: "Admin",
  });

  // Fetch shuttles
  useEffect(() => {
    const fetchShuttles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/shuttles`);
        if (!res.ok) throw new Error("Failed to load shuttles");
        const data = await res.json();
        setShuttles(Array.isArray(data) ? data : data.shuttles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShuttles();
  }, []);

  // Fetch payments
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/payments`);
        if (!res.ok) throw new Error("Failed to load payments");
        const data = await res.json();
        const all = Array.isArray(data) ? data : data.payments || [];
        setPayments(all.filter((p) => p.status === "Paid"));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
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
              Use the sidebar to manage shuttles, cars, bookings, payments, and locations.
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

            {/* Modal for Add Shuttle */}
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

      case "view-locations":
        return <ViewAllLocations />;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside
        className={`w-full md:w-64 bg-gray-900 text-white flex flex-col shadow-lg flex-shrink-0 fixed md:relative top-0 left-0 h-full z-40 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex flex-col items-center justify-center h-24 border-b border-gray-700 relative">
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-2 right-2 text-white hover:text-gray-300 text-xl font-bold"
          >
            ✕
          </button>
          <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-lg font-bold text-black shadow">
            {user.username[0].toUpperCase()}
          </div>
          <p className="font-semibold mt-2">{user.username}</p>
          <p className="text-gray-400 text-sm">{user.role}</p>
        </div>

        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          {[
            { key: "dashboard", label: "🏠 Dashboard", from: "from-blue-400", via: "via-blue-500", to: "to-blue-600" },
            { key: "add-shuttle", label: "🚌 Add Shuttle", from: "from-red-400", via: "via-red-500", to: "to-red-600" },
            { key: "all-shuttles", label: "🛫 View All Shuttles", from: "from-purple-400", via: "via-purple-500", to: "to-purple-600" },
            { key: "cars", label: "🚗 View All Cars", from: "from-green-400", via: "via-green-500", to: "to-green-600" },
            { key: "bookings", label: "📋 View All Bookings", from: "from-pink-400", via: "via-pink-500", to: "to-pink-600" },
            { key: "payments", label: "💳 Payments", from: "from-yellow-400", via: "via-yellow-500", to: "to-yellow-600" },
            { key: "view-locations", label: "📍 View Locations", from: "from-indigo-400", via: "via-indigo-500", to: "to-indigo-600" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => {
                setActiveTab(btn.key);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg font-semibold shadow-md transition ${
                activeTab === btn.key
                  ? `bg-gradient-to-r ${btn.from} ${btn.via} ${btn.to} text-black`
                  : `bg-gradient-to-r ${btn.from} ${btn.via} ${btn.to} text-white hover:brightness-110`
              }`}
            >
              {btn.label}
            </button>
          ))}

          <a
            href="/login"
            className="block text-center bg-gradient-to-r from-red-400 via-red-500 to-red-600 py-2 rounded-lg font-bold mt-6 text-white shadow-md hover:brightness-110 transition"
          >
            🚪 Logout
          </a>
        </nav>

        <footer className="text-center p-4 border-t border-gray-700 text-sm text-gray-400 hidden md:block">
          © {new Date().getFullYear()} MetroShuttle Admin
        </footer>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 md:ml-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition"
        >
          ☰ Menu
        </button>
        {loading ? <p className="text-center mt-10">Loading...</p> : renderTab()}
      </main>
    </div>
  );
};

export default AdminDashboard;
