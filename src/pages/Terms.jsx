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

        {/* Business Address */}
        <p className="text-sm text-gray-600 mb-6 text-center">
          <strong>Registered Business Address:</strong> MetroShuttle (Pty) Ltd., 
          580 Jeugd Street, Montana, Pretoria, Gauteng, 0182, South Africa
        </p>

        {/* Terms Content */}
        <div className="text-gray-700 text-sm space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Section 1 */}
          <h2 className="font-semibold text-lg">1. The Service (Platform Role and Liability)</h2>
          <p>
            MetroShuttle acts exclusively as a technology platform connecting passengers with 
            independent, third-party transportation providers (drivers). MetroShuttle does not 
            offer, and is not a provider of, transportation services.
          </p>
          <p>
            MetroShuttle is not responsible for the acts, omissions, negligence, or conduct of any 
            independent driver, nor for any loss, damage, or injury arising from the driver's 
            provision of transportation services.
          </p>

          {/* Section 2 */}
          <h2 className="font-semibold text-lg mt-4">2. Passenger Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Punctuality:</strong> Passengers must follow driver instructions and be ready at the agreed time and location.</li>
            <li><strong>Belongings:</strong> Passengers are responsible for their personal belongings; MetroShuttle is not liable for loss or damage.</li>
            <li>
              <strong>Conduct:</strong> Conduct must be respectful and legal. Misbehavior, harassment, 
              or illegal activity may result in immediate termination of the trip and refusal of service without refund.
            </li>
            <li>
              <strong>Booking Accuracy:</strong> Passengers must provide accurate booking details, 
              including names, contact information, and precise pick-up/drop-off addresses.
            </li>
            <li>
              <strong>Radius Limit:</strong> Standard fares apply only to pick-ups and drop-offs 
              within a 20km radius of the designated city centre. Trips outside this radius require 
              advance arrangements and will incur a pre-agreed surcharge.
            </li>
            <li>
              <strong>Cancellation Fees:</strong> Cancelling a confirmed booking results in a 
              non-refundable fee equal to 50% of the fare, as permitted under Section 17 of the CPA.
            </li>
            <li>
              <strong>No-Show:</strong> If a passenger is not ready within 10 minutes of the 
              scheduled time, the booking is deemed a No-Show and the full fare or applicable fee will be charged.
            </li>
            <li>
              <strong>Account Suspension:</strong> MetroShuttle may suspend or terminate accounts for 
              repeated violations or no-shows.
            </li>
          </ul>

          {/* Section 3 */}
          <h2 className="font-semibold text-lg mt-4">3. Driver Terms (Independent Contractors)</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Drivers are independent contractors, not employees or agents of MetroShuttle.
            </li>
            <li>
              <strong>Driver Obligations:</strong> Drivers are responsible for vehicle maintenance, 
              fuel costs, valid licenses (including PrDP), and commercial passenger liability insurance.
            </li>
            <li>
              <strong>Fees & Payments:</strong> Initial platform use may be free; thereafter a 
              commission applies. Acceptance of bookings indicates agreement to current rates. 
              Payments collected from passengers are remitted to drivers minus service fees and taxes.
            </li>
            <li>
              <strong>Indemnification:</strong> Drivers indemnify MetroShuttle against any claims 
              resulting from negligence, misconduct, or regulatory non-compliance.
            </li>
            <li>
              <strong>Penalties:</strong> Driver no-shows or late cancellations may lead to penalties or suspension.
            </li>
          </ul>

          {/* Section 4 */}
          <h2 className="font-semibold text-lg mt-4">4. Parcel Delivery</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Parcel delivery may be offered at MetroShuttle’s discretion.</li>
            <li>Parcels are carried at the owner’s risk. Liability is limited to the parcel fee paid.</li>
            <li>
              Delivery fee is generally half the equivalent passenger fare and must be arranged 
              directly with MetroShuttle prior to booking.
            </li>
          </ul>

          {/* Section 5 */}
          <h2 className="font-semibold text-lg mt-4">5. Legal & Compliance</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Governing Law: Republic of South Africa.</li>
            <li>Complies with the CPA (68 of 2008) and POPIA (4 of 2013).</li>
            <li>
              Disputes not resolved through negotiation will be submitted to binding arbitration 
              in Johannesburg (AFSA rules). This does not prevent filing a complaint with the NCC.
            </li>
            <li>
              Use of the service is subject to our Privacy Policy regarding personal information management.
            </li>
          </ul>

          <p className="font-medium mt-4">
            By using MetroShuttle, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
          </p>
        </div>

        {/* Back Button */}
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
