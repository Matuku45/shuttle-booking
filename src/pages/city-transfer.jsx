import React, { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
  FaCar,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

const CityTransfer = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setSubmitted(true);
      setLoading(false);
    }, 2000);
  };

  const features = [
    {
      icon: <FaCar className="text-2xl text-blue-600" />,
      title: "Reliable Transfers",
      description: "Safe and punctual city-to-city transportation",
    },
    {
      icon: <FaClock className="text-2xl text-green-600" />,
      title: "24/7 Service",
      description: "Available whenever you need us",
    },
    {
      icon: <FaStar className="text-2xl text-yellow-500" />,
      title: "Premium Experience",
      description: "Comfortable vehicles with professional drivers",
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-red-600" />,
      title: "Multiple Routes",
      description: "Connecting major cities across South Africa",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            🚐 City Transfers
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Professional shuttle services connecting South African cities
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <FaCheckCircle />
              <span>Safe & Reliable</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <FaCheckCircle />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <FaCheckCircle />
              <span>Competitive Pricing</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Get Your Transfer Quote
            </h2>
            <p className="text-gray-600">
              Fill out the form below and we'll get back to you with personalized transfer options
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600">
                We've received your information and will contact you soon with transfer options.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaWhatsapp className="inline mr-2 text-green-600" />
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>


              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Get Quote
                      <FaArrowRight />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FaPhone className="text-3xl text-blue-600 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Call Us</h3>
            <p className="text-gray-600">+27 68 123 4567</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FaEnvelope className="text-3xl text-green-600 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Email Us</h3>
            <p className="text-gray-600">transfers@metroshuttle.com</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FaWhatsapp className="text-3xl text-green-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
            <p className="text-gray-600">+27 68 123 4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityTransfer;
