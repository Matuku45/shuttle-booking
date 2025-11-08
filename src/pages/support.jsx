import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaCreditCard,
  FaCalendarCheck,
  FaClock,
  FaUserShield,
  FaSuitcaseRolling,
} from "react-icons/fa";

const Support = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] via-[#eef2f3] to-[#f8f9fa] text-gray-800 px-6 py-12 flex flex-col items-center overflow-x-hidden">
      {/* Header */}
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#1d3557] via-[#457b9d] to-[#a8dadc] bg-clip-text text-transparent mb-3">
          MetroShuttle Help Center
        </h1>
        <p className="text-lg text-gray-600">
          Quick Answers & Step-by-Step Guides
        </p>
      </div>

      <div className="max-w-5xl w-full flex flex-col gap-10 animate-fadeUp">

        {/* Section: Booking & Payments */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <FaCreditCard className="text-[#ff6b00] text-2xl" />
            <h2 className="text-2xl font-bold text-[#1d3557]">Booking & Payments</h2>
          </div>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              <strong>How do I change or cancel my reservation?</strong>
              <br />
              Navigate to <em>“My Bookings” → “Edit Payment”</em> and cancel your trip.
              <br />
              Please note: <span className="text-[#ff6b00] font-semibold">50% of the fare</span> will be charged since the seat was already reserved.
            </li>
            <li>
              <strong>What payment methods do you accept?</strong>
              <br />
              We accept all major debit/credit cards, mobile payments, and secure online transfers.
            </li>
          </ul>
        </div>

        {/* Section: On the Day of Travel */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <FaClock className="text-[#ff6b00] text-2xl" />
            <h2 className="text-2xl font-bold text-[#1d3557]">On the Day of Travel</h2>
          </div>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              <strong>How will the driver confirm my pick-up location?</strong>
              <br />
              Your driver will use the location you provided during booking to confirm your pick-up point.
            </li>
            <li>
              <strong>What if the shuttle is running late?</strong>
              <br />
              We’ll contact you immediately. You can also reach out anytime using our direct number below.
            </li>
          </ul>
        </div>

        {/* Section: Technical Support */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <FaUserShield className="text-[#ff6b00] text-2xl" />
            <h2 className="text-2xl font-bold text-[#1d3557]">Technical Support</h2>
          </div>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              <strong>I'm having trouble logging into my account.</strong>
              <br />
              Try resetting your password from the login page or contact our support team for assistance.
            </li>
            <li>
              <strong>My payment failed — what should I do?</strong>
              <br />
              Double-check your card details and network connection. If it persists, reach out via email or call us.
            </li>
          </ul>
        </div>

        {/* Section: Luggage Policy */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <FaSuitcaseRolling className="text-[#ff6b00] text-2xl" />
            <h2 className="text-2xl font-bold text-[#1d3557]">Luggage Policy</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            <strong>Is there a limit on luggage size?</strong> <br />
            Yes — to ensure a safe and comfortable ride for everyone, each passenger is permitted the following free allowance:
          </p>
          <ul className="list-disc list-inside mt-3 text-gray-700 space-y-2">
            <li>1 medium suitcase (up to 23 kg)</li>
            <li>1 small carry-on bag (up to 7 kg)</li>
            <li>Extra luggage may incur a small handling fee depending on space availability.</li>
          </ul>
        </div>

        {/* Section: Contact Info */}
        <div className="bg-gradient-to-r from-[#1d3557] via-[#457b9d] to-[#a8dadc] text-white rounded-2xl shadow-lg p-6 sm:p-8 text-center animate-fadeIn">
          <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
          <p className="text-base mb-4">
            Our support team is always ready to assist you with bookings, payments, or travel concerns.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-lg">
            <p className="flex items-center gap-2">
              <FaPhoneAlt /> <a href="tel:0813186838" className="hover:underline">081 318 6838</a>
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope /> <a href="mailto:info@metroshuttle.co.za" className="hover:underline">info@metroshuttle.co.za</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
