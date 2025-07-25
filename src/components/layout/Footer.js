import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "../common/LoginModal";
import Register from "../common/Register";

const Footer = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/home");

  // Handle protected navigation
  const handleProtectedNav = (path) => {
    if (!currentUser) {
      setRedirectTo(path);
      setShowLogin(true);
      return;
    }
    navigate(path);
  };

  return (
    <>
      <footer className="bg-slate-900/50 py-12 px-6 border-t border-white/10 mt-20 fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/images/FoneZoneLogo.png"
                  alt="FoneZone Logo"
                  className="h-10 w-10 rounded-md shadow-lg"
                />
                <h4 className="text-xl font-bold gradient-text">FoneZone</h4>
              </div>
              <p className="text-gray-400">
                The future of mobile shopping, repairs & delivery.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => handleProtectedNav("/home")}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleProtectedNav("/shop")}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    Shop
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleProtectedNav("/user/ContactSupport")}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    Contact Support
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleProtectedNav("/about")}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    About
                  </button>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h5 className="font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Screen Repair</li>
                <li>Battery Replacement</li>
                <li>Water Damage</li>
                <li>Data Recovery</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +94 71 8822 672</li>
                <li>📧 info@fonezone.com</li>
                <li>📍 123 Pettah Main Street, Mobile City</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FoneZone. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login/Register Modals (for guests) */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          redirectTo={redirectTo}
          switchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          switchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
};

export default Footer;
