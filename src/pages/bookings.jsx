import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Dummy bookings
const dummyBookings = [
  {
    id: 1,
    passengerName: "Thabiso Mapoulo",
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
  const [bookings, setBookings] = useState(dummyBookings);
  const [bookingsWithCoords, setBookingsWithCoords] = useState([]);

  // Fetch coordinates for each booking
  useEffect(() => {
    const fetchCoords = async (place) => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
      );
      const data = await res.json();
      if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      return null;
    };

    const loadBookingsCoords = async () => {
      const updated = await Promise.all(
        bookings.map(async (b) => {
          const fromCoords = await fetchCoords(b.from);
          const toCoords = await fetchCoords(b.to);
          return { ...b, path: fromCoords && toCoords ? [fromCoords, toCoords] : [] };
        })
      );
      setBookingsWithCoords(updated);
    };

    loadBookingsCoords();
  }, [bookings]);

  const deleteBooking = (id) => {
    setBookingsWithCoords((prev) => prev.filter((b) => b.id !== id));
  };

  const BookingMap = ({ path, from, to }) => {
    if (!path || path.length < 2) return <span>Loading map...</span>;

    return (
      <MapContainer
        center={path[0]}
        zoom={8}
        style={{ width: "100%", height: "200px", borderRadius: "12px", marginTop: "8px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />
        {path.map((coord, idx) => (
          <Marker key={idx} position={coord}>
            <Popup>{idx === 0 ? `From: ${from}` : `To: ${to}`}</Popup>
          </Marker>
        ))}
        <Polyline positions={path} color="blue" />
      </MapContainer>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl p-6 border border-gray-300">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900 drop-shadow-sm">
          📋 All Bookings
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-xl overflow-hidden">
            <thead className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black">
              <tr>
                <th className="p-3 border text-center">Passenger</th>
                <th className="p-3 border text-center">Phone</th>
                <th className="p-3 border text-center">Route</th>
                <th className="p-3 border text-center">Date</th>
                <th className="p-3 border text-center">Seats</th>
                <th className="p-3 border text-center">Price (R)</th>
                <th className="p-3 border text-center">Car</th>
                <th className="p-3 border text-center">Map</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {bookingsWithCoords.map((b) => (
                <tr key={b.id} className="even:bg-gray-50">
                  <td className="p-3 border text-center">{b.passengerName}</td>
                  <td className="p-3 border text-center">{b.phone}</td>
                  <td className="p-3 border text-center">
                    {b.from} → {b.to}
                  </td>
                  <td className="p-3 border text-center">{b.date}</td>
                  <td className="p-3 border text-center">{b.seats}</td>
                  <td className="p-3 border text-center font-bold text-green-700">{b.price}</td>
                  <td className="p-3 border text-center">{b.car}</td>
                  <td className="p-3 border">
                    <BookingMap path={b.path} from={b.from} to={b.to} />
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => deleteBooking(b.id)}
                      className="bg-red-600 text-white font-semibold px-3 py-1 rounded-lg hover:bg-red-500 shadow-md transition text-sm"
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))}
              {bookingsWithCoords.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center p-4 text-gray-500 font-semibold">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllBookings;
