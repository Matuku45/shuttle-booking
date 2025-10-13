import React, { useState, useEffect } from 'react';
import img1 from '../components/imgs/picture1.webp';
import img2 from '../components/imgs/picture2.webp';
import img3 from '../components/imgs/picture3.webp';
import Flight from '../components/imgs/flight.jpg';
import Logo from '../components/imgs/logo.jpg';

const images = [img1, img2, img3];

const Home = () => {
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState(false);

  // Auto-slide effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
      setError(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [current, error]);

  const handleError = () => {
    setError(true);
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center text-center px-3 sm:px-6 lg:px-8 py-8 sm:py-12
      bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
      
      {/* Logo */}
      <div className="mb-3 sm:mb-4">
        <img
          src={Logo}
          alt="Shuttle Booking Logo"
          className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full shadow-lg border-2 sm:border-4 border-white object-cover"
        />
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-6 tracking-wide drop-shadow-lg px-2">
        Welcome to Shuttle Booking System
      </h1>
      <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium mb-6 sm:mb-8 max-w-xs sm:max-w-2xl lg:max-w-3xl px-2">
        Book your shuttle easily and manage your trips with <span className="font-bold text-yellow-200">style & convenience</span>.
      </p>

      {/* Carousel */}
      <div className="w-full max-w-sm sm:max-w-2xl lg:max-w-5xl h-48 sm:h-64 md:h-80 lg:h-[28rem] relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center mx-2">
        <img
          src={images[current]}
          alt={`Shuttle ${current + 1}`}
          className={`max-h-full max-w-full object-cover transition-opacity duration-700 rounded-xl sm:rounded-2xl ${
            error ? 'hidden' : 'block'
          }`}
          onError={handleError}
        />
        {error && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center text-red-600 font-bold text-sm sm:text-lg md:text-xl rounded-xl sm:rounded-2xl px-4">
            Image not found. Showing next image...
          </div>
        )}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-lg transition text-sm sm:text-base"
        >
          ⬅️
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-lg transition text-sm sm:text-base"
        >
          ➡️
        </button>

        {/* Dots */}
        <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center gap-1.5 sm:gap-2">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                idx === current ? 'bg-white shadow-md scale-110' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Call to Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-6 sm:mt-10 w-full max-w-xs sm:max-w-none px-2">
        <a
          href="/signup"
          className="inline-block text-base sm:text-lg md:text-xl font-bold text-red-700 bg-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:bg-yellow-100 transition duration-300"
        >
          🚐 Register to Book
        </a>

        <a
          href="/about"
          className="inline-block text-base sm:text-lg md:text-xl font-bold text-white border-2 border-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:bg-white hover:text-red-700 transition duration-300"
        >
          📖 Learn More
        </a>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-16 w-full max-w-xs sm:max-w-2xl lg:max-w-5xl px-2">
        <div className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-xl hover:scale-105 transition">
          <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-2 sm:mb-3">✅ Easy Booking</h3>
          <p className="text-sm sm:text-base text-gray-600">
            Reserve your shuttle in just a few clicks. Hassle-free process for every trip.
          </p>
        </div>
        <div className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-xl hover:scale-105 transition">
          <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-2 sm:mb-3">💰 Affordable</h3>
          <p className="text-sm sm:text-base text-gray-600">
            Enjoy competitive prices with no hidden fees. Best value for your travel needs.
          </p>
        </div>
        <div className="p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-xl hover:scale-105 transition">
          <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-2 sm:mb-3">🛡️ Safe & Reliable</h3>
          <p className="text-sm sm:text-base text-gray-600">
            Your safety is our priority. Trusted drivers and well-maintained shuttles.
          </p>
        </div>
      </div>

      {/* Flight Image */}
      <div className="mt-8 sm:mt-16 w-full max-w-xs sm:max-w-2xl lg:max-w-4xl px-2">
        <img
          src={Flight}
          alt="Flight Shuttle"
          className="w-full h-auto rounded-xl sm:rounded-2xl shadow-lg object-cover hover:scale-105 transition"
        />
      </div>
    </div>
  );
};

export default Home;
