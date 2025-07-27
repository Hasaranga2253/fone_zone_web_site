// src/pages/public/About.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin
} from 'react-icons/fa';

export default function About() {
  const [activeTab, setActiveTab] = useState('story');

  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7926.616877543092!2d79.8588!3d6.9271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2595c7f!2sColombo,%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk";

  const team = [
    { id: 1, name: "Alex Johnson", role: "CEO", bio: "Founder with 10+ years in mobile tech." },
    { id: 2, name: "Sarah Williams", role: "Operations Head", bio: "Ensuring smooth business operations." },
    { id: 3, name: "Michael Chen", role: "Lead Technician", bio: "Certified expert in mobile hardware repairs." },
    { id: 4, name: "Jessica Brown", role: "Customer Success", bio: "Making every customer experience perfect." },
  ];

  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 py-16 text-center border-b border-gray-700">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-4"
        >
          About FoneZone
        </motion.h1>
        <p className="text-gray-200 max-w-2xl mx-auto text-lg">
          Your trusted partner for mobile sales, repairs, and accessories since 2015.
        </p>
      </section>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 mt-10 flex flex-wrap justify-center gap-4 border-b border-gray-700 pb-6">
        {['story', 'team', 'values', 'location'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {tab === 'story' && 'Our Story'}
            {tab === 'team' && 'Our Team'}
            {tab === 'values' && 'Our Values'}
            {tab === 'location' && 'Find Us'}
          </button>
        ))}
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Story Tab */}
        {activeTab === 'story' && (
          <motion.div initial="hidden" animate="visible" variants={stagger} className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl font-bold mb-6 text-blue-400">Our Journey</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Since 2015, FoneZone has delivered affordable and reliable mobile solutions.
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
            <motion.div variants={fadeIn} className="h-80 bg-gray-800 border-2 border-dashed rounded-xl" />
          </motion.div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <motion.div initial="hidden" animate="visible" variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <motion.div key={member.id} variants={fadeIn} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="h-48 bg-gray-700" />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-blue-400 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Values Tab */}
        {activeTab === 'values' && (
          <motion.div initial="hidden" animate="visible" variants={stagger} className="grid md:grid-cols-3 gap-6">
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
          </motion.div>
        )}

        {/* Location Tab with Google Map */}
        {activeTab === 'location' && (
          <motion.div initial="hidden" animate="visible" variants={stagger} className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeIn} className="space-y-6">
              <h2 className="text-3xl font-bold text-blue-400">Visit Our Store</h2>
              <p className="text-gray-300 text-sm">
                Find us at the heart of Colombo with easy parking and access. Come for sales, repairs, and more.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-blue-400 mt-1" />
                  <span className="text-gray-300 text-sm">123 Tech Avenue, Colombo, Sri Lanka</span>
                </div>
                <div className="flex items-start gap-3">
                  <FaPhone className="text-blue-400 mt-1" />
                  <span className="text-gray-300 text-sm">+94 77 123 4567</span>
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
            <motion.div variants={fadeIn} className="rounded-xl overflow-hidden shadow-lg h-80 border border-gray-700">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="FoneZone Location"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 mt-16 border-t border-gray-800 text-center text-sm">
        <p>© {new Date().getFullYear()} FoneZone. All Rights Reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <FaFacebook className="hover:text-white cursor-pointer" />
          <FaTwitter className="hover:text-white cursor-pointer" />
          <FaInstagram className="hover:text-white cursor-pointer" />
          <FaLinkedin className="hover:text-white cursor-pointer" />
        </div>
      </footer>
    </div>
  );
}
