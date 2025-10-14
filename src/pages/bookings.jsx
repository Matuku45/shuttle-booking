import React, { useState, useEffect } from "react";
import { FaCar, FaRoute, FaMapMarkerAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const dummyBookings = [
  {
    id: 1,
    passengerName: "Thabiso Mapoulo",
    email: "thabiso.mapoulo@example.com",
    phone: "+27 82 555 1234",
    from: "Cape Town",
    to: "Stellenbosch",
    date: "2025-10-15",
    seats: 2,
    price: 150,
    car: "Mercedes Benz",
  },
  {
    id: 2,
    passengerName: "Naledi Mokoena",
    email: "naledi.mokoena@example.com",
    phone: "+27 82 999 4321",
    from: "Johannesburg",
    to: "Pretoria",
    date: "2025-10-16",
    seats: 4,
    price: 300,
    car: "Hyundai Family Car",
  },
];

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings"));
    if (storedBookings && storedBookings.length > 0) {
      setBookings(storedBookings);
    } else {
      setBookings(dummyBookings);
      localStorage.setItem("bookings", JSON.stringify(dummyBookings));
    }
  }, []);

  const trackBooking = (b) => {
    // Attempt to get real location, fallback to fake location if unavailable
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Showing a sample location.");
      setUserLocation([-33.9249, 18.4241]); // Cape Town as sample location
      setSelectedBooking(b);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setSelectedBooking(b);
      },
      () => {
        alert("Unable to retrieve your location. Showing a sample location.");
        setUserLocation([-33.9249, 18.4241]); // Cape Town as sample location
        setSelectedBooking(b);
      }
    );
  };

const handleEditPayment = (booking) => {
  // Redirect to Stripe test payment page in a new tab
  window.open("https://buy.stripe.com/test_7sY28t91X6gegc8gDwcwg00", "_blank");
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-100 py-6 px-4">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-blue-900 drop-shadow-md">
        📋 My Bookings
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl shadow-2xl p-5 border-l-8 border-blue-500 transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg sm:text-xl text-blue-700">{b.passengerName}</h3>
              <span className="text-sm sm:text-base font-semibold text-gray-600">{b.date}</span>
            </div>

            <div className="space-y-1">
              <p className="text-sm sm:text-base text-gray-700 mb-1">
                <FaCar className="inline mr-1 text-blue-500" /> {b.car}
              </p>
              <p className="text-sm sm:text-base text-gray-700 mb-1">
                <FaRoute className="inline mr-1 text-green-500" /> {b.from} → {b.to}
              </p>
              <p className="text-sm sm:text-base text-gray-700 mb-1">Seats: {b.seats}</p>
              <p className="text-base font-semibold text-green-700 mb-1">R {b.price}</p>
              <p className="text-sm sm:text-base text-gray-600 truncate">{b.email} | {b.phone}</p>
            </div>

            <div className="flex justify-between mt-4 gap-2">
              <button
                onClick={() => trackBooking(b)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-500 shadow-md transition text-sm sm:text-base"
              >
                <FaMapMarkerAlt /> Track
              </button>

              <button
                onClick={() => handleEditPayment(b)}
                className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 shadow-md transition text-sm sm:text-base"
              >
                Edit / Pay
              </button>
            </div>

            {/* Map view */}
            {selectedBooking?.id === b.id && userLocation && (
              <div className="mt-4 h-48 w-full rounded-lg overflow-hidden">
                <MapContainer
                  center={userLocation}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={userLocation}>
                    <Popup>
                      {navigator.geolocation
                        ? "Your Current Location"
                        : "This is a sample location, actual tracking is unavailable."}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBookings;
