// src/pages/public/About.js
import React from 'react';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin
} from 'react-icons/fa';

export default function About() {
  const mapUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.2790153438855!2d79.9348343758495!3d6.735776693260405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae24f4be698ecd7%3A0x29ac6952b2a2f853!2s17%2C%2019%20Visal%20Uyana%2C%20Panadura!5e0!3m2!1sen!2slk!4v1753619119857!5m2!1sen!2slk';

  const team = [
    { id: 1, name: 'Hasaranga Shamika', role: 'CEO', bio: 'Founder with 10+ years in mobile tech.', image: '/images/hasa.png' },
    { id: 2, name: 'Niven Asmitha', role: 'Operations Head', bio: 'Ensuring smooth business operations.', image: '/images/niven.png' },
    { id: 3, name: 'Dilan Theekshana', role: 'Lead Technician', bio: 'Certified expert in mobile hardware repairs.', image: '/images/dilan.png' },
    { id: 4, name: 'Imesh Sandamina', role: 'Customer Success', bio: 'Making every customer experience perfect.', image: '/images/imesh.png' },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-center py-16 border-b border-gray-700 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-4"
        >
          About FoneZone
        </motion.h1>
        <p className="text-gray-200 max-w-2xl mx-auto text-lg">
          Your trusted partner for mobile sales, repairs, and accessories since 2021.
        </p>
      </section>

      {/* WIDER PAGE CONTAINER */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        {/* Our Story Section */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div variants={fadeIn}>
            <h2 className="text-3xl font-bold mb-6 text-blue-400">Our Journey</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Since 2021, FoneZone has delivered affordable and reliable mobile solutions.
              From humble beginnings as a small shop, we've grown into a leading retailer
              and service provider with thousands of satisfied customers.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
                <h3 className="text-2xl text-blue-400 font-bold mb-2">15K+</h3>
                <p className="text-gray-400">Devices Repaired</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
                <h3 className="text-2xl text-blue-400 font-bold mb-2">98%</h3>
                <p className="text-gray-400">Customer Satisfaction</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            variants={fadeIn}
            className="h-80 rounded-xl overflow-hidden border border-gray-700 shadow-lg flex items-center justify-center bg-gray-900"
          >
            <img
              src="/images/fallback.jpg"
              alt="FoneZone Shop"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = '/images/fallback.jpg';
              }}
            />
          </motion.div>
        </motion.div>

        {/* Our Team Section (now benefits from the wider container) */}
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <h2 className="text-3xl font-bold mb-6 text-blue-400">Meet Our Team</h2>

          {/* Wider grid with comfy spacing */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7">
            {team.map((member) => (
              <motion.div
                key={member.id}
                variants={fadeIn}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
              >
                {/* 256x192 visual area (h-48 = 192px) */}
                <div className="h-48 bg-gray-700">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/fallback.jpg';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-blue-400 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Our Values Section */}
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <h2 className="text-3xl font-bold mb-6 text-blue-400">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div variants={fadeIn} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-blue-400 mb-3">Quality Service</h3>
              <p className="text-gray-400 text-sm">
                We use genuine parts and back every repair with a solid warranty.
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-blue-400 mb-3">Customer First</h3>
              <p className="text-gray-400 text-sm">
                Our mission is to provide the best possible service for every client.
              </p>
            </motion.div>
            <motion.div variants={fadeIn} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-blue-400 mb-3">Transparent Process</h3>
              <p className="text-gray-400 text-sm">
                Upfront diagnostics and pricing—no hidden surprises.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Find Us Section */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div variants={fadeIn} className="space-y-6">
            <h2 className="text-3xl font-bold text-blue-400">Visit Our Store</h2>
            <p className="text-gray-300 text-sm">
              Find us at the heart of Colombo with easy parking and access. Come for sales, repairs, and more.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-400 mt-1" />
                <span className="text-gray-300 text-sm">17/19, Visal Uyana, Hirana, Panadura, Sri Lanka</span>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="text-blue-400 mt-1" />
                <span className="text-gray-300 text-sm">+94 771 882 2672</span>
              </div>
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-blue-400 mt-1" />
                <span className="text-gray-300 text-sm">support@fonezone.com</span>
              </div>
              <div className="flex items-start gap-3">
                <FaClock className="text-blue-400 mt-1" />
                <span className="text-gray-300 text-sm">Mon-Fri 9AM - 7PM, Sat 10AM - 6PM</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            variants={fadeIn}
            className="rounded-xl overflow-hidden shadow-lg h-80 border border-gray-700"
          >
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="FoneZone Location"
            ></iframe>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
