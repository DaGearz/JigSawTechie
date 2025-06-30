'use client';

import { useState } from 'react';
import { Star, Clock, MapPin, Phone, Mail, Users, Award, FileText, Calendar } from 'lucide-react';

export default function ProfessionalServicesDemo() {
  const services = [
    {
      title: 'Business Consulting',
      description: 'Strategic planning and business development services to help your company grow.',
      features: ['Market Analysis', 'Strategic Planning', 'Process Optimization', 'Growth Strategies']
    },
    {
      title: 'Financial Advisory',
      description: 'Comprehensive financial planning and investment guidance for individuals and businesses.',
      features: ['Investment Planning', 'Tax Strategy', 'Risk Management', 'Retirement Planning']
    },
    {
      title: 'Legal Services',
      description: 'Professional legal counsel for business formation, contracts, and compliance.',
      features: ['Contract Review', 'Business Formation', 'Compliance', 'Legal Documentation']
    }
  ];

  const team = [
    {
      name: 'Marcus Thompson',
      role: 'Senior Business Consultant',
      credentials: 'MBA, CPA',
      experience: '15+ years',
      expertise: 'Strategic Planning & Operations'
    },
    {
      name: 'Jasmine Carter',
      role: 'Financial Advisor',
      credentials: 'CFP, CFA',
      experience: '12+ years',
      expertise: 'Investment & Wealth Management'
    },
    {
      name: 'David Williams',
      role: 'Corporate Attorney',
      credentials: 'JD, LLM',
      experience: '18+ years',
      expertise: 'Business Law & Compliance'
    }
  ];

  const caseStudies = [
    {
      title: 'Tech Startup Growth Strategy',
      client: 'InnovateTech Solutions',
      challenge: 'Scaling operations and securing Series A funding',
      result: '300% revenue growth, $5M funding secured',
      duration: '6 months'
    },
    {
      title: 'Family Business Succession',
      client: 'Heritage Manufacturing',
      challenge: 'Transitioning leadership to next generation',
      result: 'Smooth transition, 25% efficiency improvement',
      duration: '12 months'
    },
    {
      title: 'Financial Restructuring',
      client: 'Metro Retail Group',
      challenge: 'Debt restructuring and cash flow optimization',
      result: '40% debt reduction, positive cash flow',
      duration: '8 months'
    }
  ];

  return (
    <div className="bg-blue-50">
      {/* Navigation */}
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Corporate Excellence</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="hover:text-blue-200">Home</a>
              <a href="#services" className="hover:text-blue-200">Services</a>
              <a href="#team" className="hover:text-blue-200">Team</a>
              <a href="#case-studies" className="hover:text-blue-200">Case Studies</a>
              <a href="#contact" className="hover:text-blue-200">Contact</a>
              <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Professional Excellence in Every Solution</h1>
              <p className="text-xl mb-8">
                Trusted advisors providing strategic consulting, financial planning, and legal services
                to help businesses and individuals achieve their goals with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50">
                  Free Consultation
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900">
                  Our Services
                </button>
              </div>
            </div>
            <div className="bg-blue-700 rounded-xl p-8 text-center">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-200">500+</div>
                  <div className="text-blue-300">Clients Served</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-200">20+</div>
                  <div className="text-blue-300">Years Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-200">98%</div>
                  <div className="text-blue-300">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-200">24/7</div>
                  <div className="text-blue-300">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Comprehensive solutions for your business needs</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end items-center">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Expert Team</h2>
            <p className="text-xl text-gray-600">Experienced professionals dedicated to your success</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-1">{member.role}</p>
                <p className="text-gray-600 text-sm mb-2">{member.credentials}</p>
                <p className="text-gray-500 text-sm mb-2">{member.experience}</p>
                <p className="text-gray-600 text-sm font-medium">{member.expertise}</p>
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

      {/* Case Studies Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Real results for real businesses</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{study.title}</h3>
                <p className="text-blue-600 font-semibold mb-3">{study.client}</p>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Challenge:</span>
                    <p className="text-gray-600 text-sm">{study.challenge}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Result:</span>
                    <p className="text-green-600 text-sm font-semibold">{study.result}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">Duration:</span>
                    <p className="text-gray-600 text-sm">{study.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600">Schedule your free consultation today</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Office</h3>
              <p className="text-gray-600">789 Business Plaza<br />Financial District, CA 90212</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hours</h3>
              <p className="text-gray-600">Mon-Fri: 8am-6pm<br />Sat: 9am-2pm<br />Sun: By appointment</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact</h3>
              <p className="text-gray-600">(555) 345-6789<br />info@corporateexcellence.com</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 text-lg">
              Schedule Free Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">Corporate Excellence</span>
          </div>
          <p className="text-blue-200">© 2024 Corporate Excellence Consulting. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
