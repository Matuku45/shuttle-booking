import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaCreditCard,
  FaUserShield,
  FaSuitcaseRolling,
  FaRoute,
  FaInfoCircle,
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
        {/* Booking & Payments */}
        <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <FaCreditCard className="text-[#ff6b00] text-2xl" />
            <h2 className="text-2xl font-bold text-[#1d3557]">
              Booking & Payments
            </h2>
          </div>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              <strong>How do I change or cancel my reservation?</strong>
              <br />
              Navigate to <em>“My Bookings” → “Edit Payment”</em> and cancel
              your trip. <br />
              <span className="text-[#ff6b00] font-semibold">
                50% of the fare
              </span>{" "}
              will be charged since the seat was already reserved.
            </li>
            <li>
              <strong>What payment methods do you accept?</strong>
              <br />
              We accept all major debit/credit cards, mobile payments, and
              secure online transfers.
            </li>
          </ul>
        </section>

        {/* On the Day of Travel */}
        <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <FaClock className="text-[#ff6b00] text-2xl" />
            <h2 className="text-2xl font-bold text-[#1d3557]">
              On the Day of Travel
            </h2>
          </div>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              <strong>How will the driver confirm my pick-up location?</strong>
              <br />
              The driver will use the location you provided during booking to
              confirm your pick-up point.
            </li>
            <li>
              <strong>What if the shuttle is running late?</strong>
              <br />
              We will communicate directly, and you can reach us anytime using
              our contact number below.
            </li>
          </ul>
          <p className="mt-3 text-gray-700">
            <strong>Important Note on Waiting Time:</strong> Our door-to-door
            service relies on punctuality. Drivers wait a maximum of{" "}
            <span className="text-[#ff6b00] font-semibold">10 minutes</span>{" "}
            past the scheduled pick-up time. After that, the trip is considered
            a no-show. Please be ready to depart promptly to avoid impacting
            others.
          </p>
        </section>

        {/* Technical Support */}
        <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <FaUserShield className="text-[#ff6b00] text-2xl" />
            <h2 className="text-2xl font-bold text-[#1d3557]">
              Technical Support
            </h2>
          </div>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              <strong>I'm having trouble logging into my account.</strong>
              <br />
              Try resetting your password or contact our support team for
              assistance.
            </li>
            <li>
              <strong>My payment failed — what should I do?</strong>
              <br />
              Check your card details and internet connection. If the issue
              persists, contact us via email or phone.
            </li>
          </ul>
        </section>

        {/* Luggage Policy */}
        <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-4">
            <FaSuitcaseRolling className="text-[#ff6b00] text-2xl" />
            <h2 className="text-2xl font-bold text-[#1d3557]">
              Luggage Policy
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            <strong>Is there a limit on luggage size?</strong> <br />
            Yes. To ensure a safe and comfortable ride, each passenger is
            permitted:
          </p>
          <ul className="list-disc list-inside mt-3 text-gray-700 space-y-2">
            <li>
              One (1) Standard Checked Bag: Maximum total dimensions (Length +
              Width + Height) not exceeding 158 cm (62 inches) — about 70 × 45 ×
              30 cm.
            </li>
            <li>
              One (1) Personal Carry-on Item: Small enough to fit on your lap or
              at your feet (e.g., laptop bag, purse, or small backpack).
            </li>
          </ul>
          <p className="mt-3 text-gray-700">
            <strong>Important Note:</strong> If traveling with more than the
            standard allowance (e.g., golf clubs, extra suitcases), please book
            an additional seat. Drivers may refuse oversized or unsafe items.
          </p>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-[#1d3557] via-[#457b9d] to-[#a8dadc] text-white rounded-2xl shadow-lg p-6 sm:p-8 text-center animate-fadeIn">
          <h2 className="text-2xl font-bold mb-3">Need More Help?</h2>
          <p className="mb-5 text-base">
            Our support team is available for bookings, payments, and technical
            issues.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-lg">
            <p className="flex items-center gap-2">
              <FaPhoneAlt />{" "}
              <a href="tel:0813186838" className="hover:underline">
                081 318 6838
              </a>
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope />{" "}
              <a
                href="mailto:info@metroshuttle.co.za"
                className="hover:underline"
              >
                info@metroshuttle.co.za
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support;
