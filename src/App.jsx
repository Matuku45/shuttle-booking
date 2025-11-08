import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PassengerDashboard from "./pages/PassengerDashboard";
import AdminDashboard from "./pages/AdminDashBoard";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Location from "./pages/location"; // ✅ Fixed import name
import CityTransfer from "./pages/city-transfer"; // ✅ Added import
import LocationForm from "./pages/LocationForm"; // ✅ Added import
import ViewAllLocations from "./pages/ViewAllLocations";
import TrackAllPayment from "./pages/track-all-payment";
import Support from "./pages/support";
import Contacts from "./pages/Contacts";
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />

        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/passenger" element={<PassengerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/location" element={<Location />} /> {/* ✅ Added route */}
            <Route path="/city-transfer" element={<CityTransfer />} /> {/* ✅ Added route */}
            <Route path="/location-form" element={<LocationForm />} /> {/* ✅ Added route */} 
            <Route path="/view-locations" element={<ViewAllLocations />} /> {/* ✅ Added route */}
            <Route path="/track-payments" element={<TrackAllPayment />} /> {/* ✅ Added route */}
            <Route path="/support" element={<Support />} /> {/* ✅ Added route */}
            <Route path="/contact" element={<Contacts />} /> {/* ✅ Added route */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
