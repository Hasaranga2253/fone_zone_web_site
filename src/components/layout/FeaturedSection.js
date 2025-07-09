// src/components/layout/FeaturedSection.js

import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

function FeaturedSection() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 🔥 Carousel Section */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-white animate-glow">
        🔥 Featured Deals
      </h2>

      <Carousel
        autoPlay
        infiniteLoop
        interval={3000}
        showThumbs={false}
        showStatus={false}
        showIndicators={true}
        dynamicHeight={false}
        className="rounded-xl shadow-xl overflow-hidden mb-12"
      >
        <div>
          <img src="/images/iphone14pro.jpg" alt="iPhone 14 Pro" className="object-cover h-72 w-full" />
          <p className="legend">iPhone 14 Pro – Now 20% Off</p>
        </div>
        <div>
          <img src="/images/s23.jpg" alt="Samsung Galaxy S23" className="object-cover h-72 w-full" />
          <p className="legend">Samsung Galaxy S23 – Free Screen Guard</p>
        </div>
        <div>
          <img src="/images/oneplus.jpg" alt="OnePlus Nord CE 3" className="object-cover h-72 w-full" />
          <p className="legend">OnePlus Nord CE 3 – Limited Time Offer</p>
        </div>
      </Carousel>

      {/* ❄️ Feature Cards Section */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-white animate-glow">
        🧊 Why Choose FoneZone?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 text-white hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-bold mb-2">🚚 Free Delivery</h3>
          <p>Same-day delivery in your city on all phone orders.</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 text-white hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-bold mb-2">🔧 Expert Repairs</h3>
          <p>Certified mobile technicians with 48-hour turnaround.</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20 text-white hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-bold mb-2">🛡️ Warranty Guarantee</h3>
          <p>Every phone and repair covered with a 1-year warranty.</p>
        </div>
      </div>
    </div>
  );
}

export default FeaturedSection;
