import React from "react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        {/* Header */}
        <h1 className="text-3xl font-bold text-blue-800 mb-2 text-center">
          MetroShuttle Terms & Conditions
        </h1>
        <p className="text-sm text-gray-600 mb-2 text-center">
          Effective Date: October 5, 2025
        </p>

        {/* Business Address for Legal Compliance */}
        <p className="text-sm text-gray-600 mb-6 text-center">
          <strong>Registered Business Address:</strong> MetroShuttle (Pty) Ltd.,
          580 Jeugd Street, Montana, Pretoria, Gauteng, 0182, South Africa
        </p>

        {/* Terms content */}
        <div className="text-gray-700 text-sm space-y-4 max-h-[70vh] overflow-y-auto">
          <h2 className="font-semibold text-lg">1. The Service</h2>
          <p>
            MetroShuttle connects passengers with independent shuttle drivers.
            We do not own or operate vehicles and are not responsible for driver actions.
          </p>

          <h2 className="font-semibold text-lg mt-4">2. Passenger Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Follow driver instructions and arrive on time.</li>
            <li>Passengers are responsible for personal belongings; MetroShuttle is not liable for loss or damage.</li>
            <li>Conduct must be respectful and legal. Misbehavior may result in service refusal.</li>
            <li>Provide accurate booking info. Cancellation fees may apply and are non-refundable.</li>
            <li>No-show: Passengers not ready within 10 minutes may be charged full fare.</li>
            <li>MetroShuttle can suspend accounts for violations or repeated no-shows.</li>
            <li>NB: The passenger must fall within 20km of diameter of pick city(location) or make extra arrangements.</li>
          </ul>

          <h2 className="font-semibold text-lg mt-4">3. Driver Terms</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Drivers are independent contractors responsible for vehicle maintenance, licensing, insurance, and legal compliance.</li>
            <li>Initial platform use may be free; a service fee may apply after onboarding.</li>
            <li>Commission rates may change with notice; acceptance of bookings constitutes agreement.</li>
            <li>Payment collected from passengers is remitted to drivers minus service fees and taxes.</li>
            <li>Driver no-show or late cancellations may result in penalties or suspension.</li>
          </ul>

          <h2 className="font-semibold text-lg mt-4">4. Legal & Compliance</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Governing Law: Republic of South Africa.</li>
            <li>Services comply with the Consumer Protection Act (CPA) and Protection of Personal Information Act (POPIA).</li>
            <li>Disputes are resolved by arbitration in Johannesburg, South Africa (AFSA rules).</li>
          </ul>

          <p className="font-medium mt-4">
            By using MetroShuttle, you acknowledge that you have read, understood, and agreed to these Terms.
          </p>

          <p className="font-medium mt-4">
            NB: The parcel delivery fee is half the price of the passenger price (<a href="/contact" className="text-blue-600 underline">contact us</a>).
          </p>
        </div>

        {/* Back button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-700 text-white px-8 py-3 rounded-xl hover:bg-blue-800 transition shadow-lg font-semibold text-lg"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terms;
