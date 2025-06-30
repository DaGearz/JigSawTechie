'use client';

import { useState } from 'react';
import { Star, Clock, MapPin, Phone, Mail, Calendar, Scissors, Sparkles } from 'lucide-react';

export default function BeautySalonDemo() {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      category: 'Hair Services',
      icon: <Scissors className="w-6 h-6" />,
      items: [
        { name: 'Haircut & Style', price: '$65', duration: '60 min', description: 'Professional cut and styling' },
        { name: 'Hair Color', price: '$120', duration: '120 min', description: 'Full color transformation' },
        { name: 'Highlights', price: '$150', duration: '150 min', description: 'Partial or full highlights' },
        { name: 'Blowout', price: '$45', duration: '45 min', description: 'Professional styling and blowout' },
      ]
    },
    {
      category: 'Nail Services',
      icon: <Sparkles className="w-6 h-6" />,
      items: [
        { name: 'Classic Manicure', price: '$35', duration: '45 min', description: 'Traditional manicure with polish' },
        { name: 'Gel Manicure', price: '$50', duration: '60 min', description: 'Long-lasting gel polish' },
        { name: 'Pedicure', price: '$45', duration: '60 min', description: 'Relaxing foot treatment' },
        { name: 'Nail Art', price: '$15', duration: '30 min', description: 'Custom nail designs' },
      ]
    },
    {
      category: 'Spa Services',
      icon: <Sparkles className="w-6 h-6" />,
      items: [
        { name: 'Facial Treatment', price: '$85', duration: '75 min', description: 'Deep cleansing facial' },
        { name: 'Eyebrow Shaping', price: '$25', duration: '30 min', description: 'Professional brow styling' },
        { name: 'Lash Extensions', price: '$120', duration: '120 min', description: 'Individual lash application' },
        { name: 'Massage Therapy', price: '$90', duration: '60 min', description: 'Relaxing full body massage' },
      ]
    }
  ];

  const team = [
    { name: 'Maya Johnson', role: 'Master Stylist', experience: '8 years', specialty: 'Color & Cuts' },
    { name: 'Zara Williams', role: 'Nail Technician', experience: '5 years', specialty: 'Nail Art' },
    { name: 'Keisha Davis', role: 'Esthetician', experience: '6 years', specialty: 'Skincare' },
  ];

  return (
    <div className="bg-pink-50">
      {/* Navigation */}
      <nav className="bg-pink-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Elegant Beauty</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="hover:text-pink-200">Home</a>
              <a href="#services" className="hover:text-pink-200">Services</a>
              <a href="#team" className="hover:text-pink-200">Team</a>
              <a href="#gallery" className="hover:text-pink-200">Gallery</a>
              <a href="#contact" className="hover:text-pink-200">Contact</a>
              <button className="bg-pink-600 px-4 py-2 rounded hover:bg-pink-700">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-600 to-pink-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Elegant Beauty Salon</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Where beauty meets excellence. Transform your look with our expert stylists 
            and premium services in a luxurious, welcoming environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-pink-800 px-8 py-3 rounded-lg font-semibold hover:bg-pink-50">
              Book Appointment
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-800">
              View Services
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Professional beauty services tailored to you</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-pink-50 rounded-xl p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                    <div className="text-pink-600">{category.icon}</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-pink-800 mb-6 text-center">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-b border-pink-200 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <span className="text-sm text-gray-500">{item.duration}</span>
                        </div>
                        <span className="text-pink-600 font-bold">{item.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">Expert stylists dedicated to your beauty</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="w-24 h-24 bg-pink-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-pink-800 text-2xl">👩‍💼</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-pink-600 font-semibold mb-1">{member.role}</p>
                <p className="text-gray-600 text-sm mb-2">{member.experience} experience</p>
                <p className="text-gray-500 text-sm">Specialty: {member.specialty}</p>
                <div className="flex justify-center mt-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Before & After Gallery</h2>
            <p className="text-xl text-gray-600">See the amazing transformations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-pink-100 rounded-lg h-48 flex items-center justify-center">
                <span className="text-pink-600 text-4xl">✨</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h2>
            <p className="text-xl text-gray-600">Ready to look and feel amazing?</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">456 Beauty Blvd<br />Uptown, CA 90211</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hours</h3>
              <p className="text-gray-600">Tue-Fri: 9am-7pm<br />Sat: 8am-6pm<br />Sun-Mon: Closed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact</h3>
              <p className="text-gray-600">(555) 234-5678<br />hello@elegantbeauty.com</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 text-lg">
              Book Online Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-pink-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">Elegant Beauty</span>
          </div>
          <p className="text-pink-200">© 2024 Elegant Beauty Salon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
