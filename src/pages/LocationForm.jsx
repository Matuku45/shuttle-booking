import React, { useState } from 'react';
import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

const LocationForm = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('From:', fromLocation, 'To:', toLocation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center p-6">
      <div className="card w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          🚐 Shuttle Booking – Location Details
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* FROM Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-medium flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600" /> From
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24 text-base"
              placeholder="Full address, zip code, street number, and full details about your location"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              required
            ></textarea>
          </div>

          {/* TO Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-medium flex items-center gap-2">
                <FaArrowRight className="text-green-600" /> To
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24 text-base"
              placeholder="Full address, zip code, street number, and full details about your location"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className="btn btn-primary w-full text-lg">
              Confirm Route
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationForm;
