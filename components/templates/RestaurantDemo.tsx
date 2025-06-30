'use client';

import { useState } from 'react';
import { Star, Clock, MapPin, Phone, Mail } from 'lucide-react';

export default function RestaurantDemo() {
  const [activeTab, setActiveTab] = useState('menu');

  const menuItems = [
    {
      category: 'Appetizers',
      items: [
        { name: 'Crispy Calamari', price: '$12', description: 'Fresh squid rings with marinara sauce' },
        { name: 'Buffalo Wings', price: '$14', description: 'Spicy wings with blue cheese dip' },
        { name: 'Loaded Nachos', price: '$16', description: 'Tortilla chips with cheese, jalapeños, and sour cream' },
      ]
    },
    {
      category: 'Main Courses',
      items: [
        { name: 'Grilled Salmon', price: '$28', description: 'Atlantic salmon with lemon herb butter' },
        { name: 'BBQ Ribs', price: '$24', description: 'Fall-off-the-bone ribs with house BBQ sauce' },
        { name: 'Chicken Alfredo', price: '$22', description: 'Creamy pasta with grilled chicken' },
      ]
    },
    {
      category: 'Desserts',
      items: [
        { name: 'Chocolate Cake', price: '$8', description: 'Rich chocolate cake with vanilla ice cream' },
        { name: 'Cheesecake', price: '$9', description: 'New York style with berry compote' },
      ]
    }
  ];

  return (
    <div className="bg-orange-50">
      {/* Navigation */}
      <nav className="bg-orange-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SD</span>
              </div>
              <span className="text-xl font-bold">Savory Delights</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="hover:text-orange-200">Home</a>
              <a href="#menu" className="hover:text-orange-200">Menu</a>
              <a href="#about" className="hover:text-orange-200">About</a>
              <a href="#contact" className="hover:text-orange-200">Contact</a>
              <button className="bg-orange-600 px-4 py-2 rounded hover:bg-orange-700">
                Order Online
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Savory Delights</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience authentic flavors and exceptional service in the heart of the community. 
            Fresh ingredients, bold flavors, unforgettable moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-800 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50">
              View Menu
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-800">
              Make Reservation
            </button>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h2>
            <p className="text-xl text-gray-600">Crafted with love, served with pride</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {menuItems.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-orange-50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-orange-800 mb-6 text-center">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-b border-orange-200 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <span className="text-orange-600 font-bold">{item.price}</span>
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

      {/* About Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Founded in 2015, Savory Delights has been serving the community with authentic, 
                soul-warming dishes that bring people together. Our commitment to fresh ingredients 
                and traditional recipes has made us a beloved neighborhood destination.
              </p>
              <p className="text-gray-600 mb-6">
                Every dish is prepared with care by our experienced chefs who take pride in 
                delivering exceptional flavors that celebrate our rich culinary heritage.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">4.9/5 from 200+ reviews</span>
              </div>
            </div>
            <div className="bg-orange-200 rounded-xl h-80 flex items-center justify-center">
              <span className="text-orange-800 text-6xl">🍽️</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Visit Us Today</h2>
            <p className="text-xl text-gray-600">We can't wait to serve you!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">123 Main Street<br />Downtown, CA 90210</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hours</h3>
              <p className="text-gray-600">Mon-Thu: 11am-9pm<br />Fri-Sat: 11am-10pm<br />Sun: 12pm-8pm</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact</h3>
              <p className="text-gray-600">(555) 123-4567<br />info@savorydelights.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">SD</span>
            </div>
            <span className="text-xl font-bold">Savory Delights</span>
          </div>
          <p className="text-orange-200">© 2024 Savory Delights. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
