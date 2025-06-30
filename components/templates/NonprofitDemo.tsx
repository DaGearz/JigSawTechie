'use client';

import { useState } from 'react';
import { Heart, Users, Calendar, MapPin, Phone, Mail, Target, Award, Handshake } from 'lucide-react';

export default function NonprofitDemo() {
  const [donationAmount, setDonationAmount] = useState(50);

  const impactStats = [
    { number: '2,500+', label: 'Lives Impacted', icon: '❤️' },
    { number: '150+', label: 'Volunteers', icon: '🤝' },
    { number: '$500K+', label: 'Funds Raised', icon: '💰' },
    { number: '25+', label: 'Programs', icon: '📋' }
  ];

  const programs = [
    {
      title: 'Youth Education Initiative',
      description: 'Providing educational resources and mentorship to underserved youth in our community.',
      impact: '500+ students supported',
      image: '📚'
    },
    {
      title: 'Community Food Bank',
      description: 'Fighting hunger by providing nutritious meals to families in need.',
      impact: '10,000+ meals served',
      image: '🍽️'
    },
    {
      title: 'Senior Care Program',
      description: 'Supporting elderly community members with companionship and essential services.',
      impact: '200+ seniors assisted',
      image: '👴'
    },
    {
      title: 'Job Training Center',
      description: 'Equipping community members with skills for sustainable employment.',
      impact: '300+ people trained',
      image: '💼'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Annual Fundraising Gala',
      date: 'March 15, 2024',
      time: '6:00 PM',
      location: 'Community Center',
      description: 'Join us for an evening of celebration and fundraising for our programs.'
    },
    {
      title: 'Volunteer Training Workshop',
      date: 'March 22, 2024',
      time: '10:00 AM',
      location: 'Main Office',
      description: 'Learn how you can make a difference in your community.'
    },
    {
      title: 'Community Clean-Up Day',
      date: 'April 5, 2024',
      time: '9:00 AM',
      location: 'Central Park',
      description: 'Help us beautify our neighborhood and protect the environment.'
    }
  ];

  const donationAmounts = [25, 50, 100, 250, 500];

  return (
    <div className="bg-purple-50">
      {/* Navigation */}
      <nav className="bg-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Community Impact</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="hover:text-purple-200">Home</a>
              <a href="#about" className="hover:text-purple-200">About</a>
              <a href="#programs" className="hover:text-purple-200">Programs</a>
              <a href="#events" className="hover:text-purple-200">Events</a>
              <a href="#volunteer" className="hover:text-purple-200">Volunteer</a>
              <a href="#contact" className="hover:text-purple-200">Contact</a>
              <button className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700">
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Building Stronger Communities Together</h1>
              <p className="text-xl mb-8">
                We're dedicated to creating positive change in our community through education, 
                support services, and empowerment programs that make a lasting impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-purple-800 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50">
                  Get Involved
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-800">
                  Learn More
                </button>
              </div>
            </div>
            <div className="bg-purple-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Our Impact This Year</h3>
              <div className="grid grid-cols-2 gap-6">
                {impactStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-purple-200">{stat.number}</div>
                    <div className="text-purple-300 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To empower individuals and families in our community through education, 
                resources, and support services that promote self-sufficiency and dignity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                A thriving community where every person has access to opportunities, 
                resources, and support needed to reach their full potential.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <p className="text-gray-600">
                Compassion, integrity, respect, and collaboration guide everything we do 
                as we work together to create positive change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <p className="text-xl text-gray-600">Making a difference through targeted community initiatives</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{program.image}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-gray-600 mb-3">{program.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-600 font-semibold">{program.impact}</span>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Make a Donation</h2>
          <p className="text-xl text-gray-600 mb-8">
            Your contribution helps us continue our vital work in the community
          </p>

          <div className="bg-purple-50 rounded-xl p-8">
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-900 mb-4">Select Amount</label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
                      donationAmount === amount
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-gray-700">$</span>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center"
                />
                <span className="text-gray-700">Custom Amount</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-2">Your ${donationAmount} donation can provide:</p>
              <div className="text-sm text-gray-700">
                {donationAmount >= 25 && <div>• 5 meals for families in need</div>}
                {donationAmount >= 50 && <div>• Educational supplies for 2 students</div>}
                {donationAmount >= 100 && <div>• Job training materials for 1 person</div>}
                {donationAmount >= 250 && <div>• Senior care services for 1 week</div>}
                {donationAmount >= 500 && <div>• Complete program support for 1 month</div>}
              </div>
            </div>

            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 text-lg">
              Donate ${donationAmount} Now
            </button>
            <p className="text-sm text-gray-500 mt-2">Secure payment • Tax deductible</p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600">Join us in making a difference</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 text-purple-600 mr-2" />
                  <span className="text-purple-600 font-semibold">{event.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Time:</span>
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Location:</span>
                    {event.location}
                  </div>
                </div>
                <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                  Register Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Become a Volunteer</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our team of dedicated volunteers and help us create positive change in our community. 
            Every hour you contribute makes a meaningful difference.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Schedule</h3>
              <p className="text-gray-600">Volunteer on your own schedule with opportunities that fit your availability.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Make an Impact</h3>
              <p className="text-gray-600">See the direct impact of your efforts on individuals and families in need.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gain Experience</h3>
              <p className="text-gray-600">Develop new skills and gain valuable experience while helping others.</p>
            </div>
          </div>

          <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 text-lg">
            Apply to Volunteer
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">We'd love to hear from you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">321 Community Way<br />Neighborhood, CA 90213</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">(555) 567-8901<br />Mon-Fri: 9am-5pm</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">info@communityimpact.org<br />We respond within 24 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">Community Impact</span>
          </div>
          <p className="text-purple-200">© 2024 Community Impact Organization. All rights reserved.</p>
          <p className="text-purple-300 text-sm mt-2">Tax ID: 12-3456789 • 501(c)(3) Non-Profit Organization</p>
        </div>
      </footer>
    </div>
  );
}
