import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-900/50 py-12 px-6 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
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

          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/home" className="hover:text-cyan-400 transition-colors">Home</a></li>
              <li><a href="/shop" className="hover:text-cyan-400 transition-colors">Shop</a></li>
              <li><a href="/repairs" className="hover:text-cyan-400 transition-colors">Repairs</a></li>
              <li><a href="/about" className="hover:text-cyan-400 transition-colors">About</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Services</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Screen Repair</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Battery Replacement</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Water Damage</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Data Recovery</a></li>
            </ul>
          </div>

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
  );
};

export default Footer;
