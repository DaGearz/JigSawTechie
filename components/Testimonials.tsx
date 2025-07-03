'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  projectType: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'Bloom Beauty Salon',
    role: 'Owner',
    content: 'JigsawTechie transformed our online presence completely. The new website is beautiful, fast, and has increased our bookings by 40%. Tyler understood our vision perfectly and delivered beyond expectations.',
    rating: 5,
    projectType: 'Beauty Salon Website',
    date: '2024-01-15',
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'Chen & Associates Law',
    role: 'Managing Partner',
    content: 'Professional, reliable, and incredibly skilled. Our law firm needed a sophisticated website that would instill confidence in potential clients. The result exceeded our expectations and has generated significant new business.',
    rating: 5,
    projectType: 'Professional Services Website',
    date: '2024-02-20',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    company: 'Taste of Home Restaurant',
    role: 'Restaurant Manager',
    content: 'The online ordering system and reservation features have revolutionized our business. Customer feedback has been overwhelmingly positive, and our online orders have tripled since launch.',
    rating: 5,
    projectType: 'Restaurant Website',
    date: '2024-03-10',
  },
  {
    id: '4',
    name: 'David Thompson',
    company: 'Thompson Photography',
    role: 'Photographer',
    content: 'As a photographer, I needed a portfolio that would showcase my work beautifully. The gallery features and client portal have streamlined my entire business process. Highly recommended!',
    rating: 5,
    projectType: 'Portfolio Website',
    date: '2024-02-05',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about working with JigsawTechie.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mx-auto max-w-4xl">
            {/* Quote Icon */}
            <div className="flex justify-center mb-6">
              <Quote className="h-12 w-12 text-blue-500" />
            </div>

            {/* Rating */}
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < currentTestimonial.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <blockquote className="text-xl md:text-2xl text-gray-700 text-center mb-8 leading-relaxed">
              "{currentTestimonial.content}"
            </blockquote>

            {/* Author Info */}
            <div className="text-center">
              <div className="font-semibold text-lg text-gray-900">
                {currentTestimonial.name}
              </div>
              <div className="text-blue-600 font-medium">
                {currentTestimonial.role}
              </div>
              <div className="text-gray-600">
                {currentTestimonial.company}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {currentTestimonial.projectType} • {new Date(currentTestimonial.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200 group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200 group"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex
                  ? 'bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-600">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Compact testimonials for other pages
export function TestimonialsCompact() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Trusted by Businesses Like Yours
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                "{testimonial.content.substring(0, 120)}..."
              </p>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-blue-600">{testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
