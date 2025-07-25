// src/components/layout/FeaturedSection.js
import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "../common/LoginModal";
import Register from "../common/Register";

function FeaturedSection() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/shop");

  // Handles protected navigation (requires login)
  const handleProtectedNavigation = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      setRedirectTo(path);
      setShowLogin(true);
    }
  };

  return (
    <div className="w-full mx-auto px-4 py-12 fade-in relative">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 -left-10 w-72 h-72 bg-white rounded-full"></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text content */}
          <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Upgrade Your Mobile Experience
            </h1>
            <p className="text-xl text-indigo-100 mb-6 max-w-lg">
              Latest smartphones with exclusive discounts. Trade-in offers
              available!
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => handleProtectedNavigation("/shop")}
                className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-indigo-700 transition duration-300"
              >
                Shop Now
              </button>

            </div>

            {/* Benefits */}
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center text-indigo-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Free Delivery
              </div>
              <div className="flex items-center text-indigo-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                1-Year Warranty
              </div>
            </div>
          </div>

          {/* Phone image */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <img
                src="/images/15-Pro-Max.png"
                alt="Premium smartphones"
                className="w-80 h-auto transform rotate-6 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-full shadow-lg">
                Up to 30% OFF!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-white ">
        Why Choose FoneZone?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="glass-card-gradient p-6 rounded-2xl shadow-xl border border-white/10 hover:scale-105 hover:shadow-cyan-400/30 transition-transform duration-300 text-center">
          <img
            src="/images/feature-1.png"
            alt="Free Delivery"
            className="w-16 h-16 mx-auto mb-4 drop-shadow-md"
          />
          <h3 className="text-2xl font-bold text-cyan-300 mb-2"> Free Delivery</h3>
          <p className="text-gray-200">
            Same-day delivery in your city on all phone orders.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-card-gradient p-6 rounded-2xl shadow-xl border border-white/10 hover:scale-105 hover:shadow-cyan-400/30 transition-transform duration-300 text-center">
          <img
            src="/images/feature-4.png"
            alt="Expert Repairs"
            className="w-16 h-16 mx-auto mb-4 drop-shadow-md"
          />
          <h3 className="text-2xl font-bold text-cyan-300 mb-2"> Expert Repairs</h3>
          <p className="text-gray-200">
            Certified mobile technicians with 48-hour turnaround.
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-card-gradient p-6 rounded-2xl shadow-xl border border-white/10 hover:scale-105 hover:shadow-cyan-400/30 transition-transform duration-300 text-center">
          <img
            src="/images/feature-2.png"
            alt="Warranty Guarantee"
            className="w-16 h-16 mx-auto mb-4 drop-shadow-md"
          />
          <h3 className="text-2xl font-bold text-cyan-300 mb-2"> Warranty Guarantee</h3>
          <p className="text-gray-200">
            Every phone and repair covered with a 1-year warranty.
          </p>
        </div>
      </div>

      {/* Modals */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          redirectTo={redirectTo}
          switchToRegister={() => setShowRegister(true)}
        />
      )}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          switchToLogin={() => setShowLogin(true)}
        />
      )}
    </div>
  );
}

export default FeaturedSection;
