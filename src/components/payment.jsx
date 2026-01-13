import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, DollarSign, Fingerprint, Code, User, Send, Scale, Banknote } from 'lucide-react';
import { sha512 } from 'js-sha512';

// ===== FRONTEND DEMO ONLY =====
const OZOW_MERCHANT_CODE = "METROSITESPTYLTD9DEC74AF8E";
const OZOW_PRIVATE_KEY = "8573b1780aca4b3d849bd04ef05097b8";
const OZOW_API_URL = "https://api.ozow.com/postpaymentrequest";

// Redirection URLs
const APP_BASE_URL = "https://yourshuttlebooking.com";
const SUCCESS_URL = `${APP_BASE_URL}/payment/success`;
const CANCEL_URL = `${APP_BASE_URL}/payment/cancel`;
const ERROR_URL = `${APP_BASE_URL}/payment/error`;

// SHA512 hash helper
const generateHashCheck = (data, privateKey) => {
  const fields = [
    data.SiteCode,
    data.CountryCode,
    data.CurrencyCode,
    data.Amount,
    data.TransactionReference,
    data.BankReference
  ];
  const hashString = fields.map(v => encodeURIComponent(String(v || ""))).join('&');
  return sha512(hashString + '&' + privateKey);
};

// Input component
const InputField = ({ label, name, icon: Icon, type = 'text', value, onChange, placeholder, isReadOnly = false }) => (
  <div className="form-control space-y-1">
    <label className="label flex items-center gap-2">
      <Icon className="w-5 h-5 text-pink-500" />
      <span className="label-text font-semibold text-gray-700">{label}</span>
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input input-bordered w-full rounded-xl shadow-sm focus:ring-pink-500 focus:ring-2"
      readOnly={isReadOnly}
    />
  </div>
);

const App = () => {
  // Pre-fill with dummy data
  const [formData, setFormData] = useState({
    SiteCode: OZOW_MERCHANT_CODE,
    CountryCode: "ZA",
    CurrencyCode: "ZAR",
    Amount: "100.00", // as string
    TransactionReference: `TXN-${Date.now()}`,
    BankReference: `REF-${Date.now().toString().slice(-6)}`,
    Customer: "John Doe"
  });

  const [hashCheck, setHashCheck] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = generateHashCheck(formData, OZOW_PRIVATE_KEY);
    setHashCheck(hash);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!formData.Amount || !formData.Customer) {
      alert("Enter a valid amount and customer name");
      return;
    }
    setLoading(true);

    // Ozow expects exact key names
    const payload = {
      ...formData,
      HashCheck: hashCheck,
      SuccessUrl: SUCCESS_URL,
      CancelUrl: CANCEL_URL,
      ErrorUrl: ERROR_URL
    };

    try {
      const res = await fetch(OZOW_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.Url) {
        window.location.href = data.Url;
      } else {
        console.error("Ozow API error:", data);
        alert("Payment initiation failed. Check console for details.");
      }
    } catch (err) {
      console.error("Payment request failed:", err);
      alert("Payment request failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Merchant Site Code", name: "SiteCode", icon: Fingerprint, isReadOnly: true },
    { label: "Amount (ZAR)", name: "Amount", type: "text", icon: DollarSign },
    { label: "Transaction Reference", name: "TransactionReference", icon: Code },
    { label: "Bank Statement Reference", name: "BankReference", icon: Banknote },
    { label: "Customer Name", name: "Customer", icon: User }
  ];

  return (
    <motion.div className="min-h-screen p-6 bg-gradient-to-tr from-pink-50 to-purple-50 flex flex-col items-center">
      <motion.div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-6 sm:p-10 border-t-8 border-pink-500">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800">
            <span className="text-pink-600">ShuttleGo</span> Payment
          </h1>
          <p className="text-gray-500 mt-2 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-orange-400 animate-pulse" /> Secure Instant EFT
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {fields.map(f => (
              <motion.div key={f.name} whileHover={{ scale: 1.02 }}>
                <InputField {...f} value={formData[f.name]} onChange={handleChange} />
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1 p-6 bg-purple-50 rounded-2xl shadow-inner space-y-5 flex flex-col justify-between">
            <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6" /> Integrity
            </h2>

            <div className="flex justify-between items-center text-lg font-bold text-gray-800 border-b border-purple-200 pb-2">
              <span>Amount:</span>
              <span className="text-green-600">ZAR {formData.Amount}</span>
            </div>

            <div className="mt-4 p-3 rounded-xl text-center font-bold bg-green-100 text-green-700 flex items-center justify-center gap-2">
              <Fingerprint className="w-5 h-5" /> Hash Ready
            </div>

            <motion.button
              onClick={handlePayment}
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`btn w-full text-lg font-bold py-3 rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2
                ${loading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600'}`}
            >
              {loading ? "Redirecting..." : <><Send className="w-5 h-5" /> Proceed to Payment</>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default App;
