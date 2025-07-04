"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

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
    id: "1",
    name: "Sarah Johnson",
    company: "Bloom Beauty Salon",
    role: "Owner",
    content:
      "JigsawTechie transformed our online presence completely. The new website is beautiful, fast, and has increased our bookings by 40%. Tyler understood our vision perfectly and delivered beyond expectations.",
    rating: 5,
    projectType: "Beauty Salon Website",
    date: "2024-01-15",
  },
  {
    id: "2",
    name: "Michael Chen",
    company: "Chen & Associates Law",
    role: "Managing Partner",
    content:
      "Professional, reliable, and incredibly skilled. Our law firm needed a sophisticated website that would instill confidence in potential clients. The result exceeded our expectations and has generated significant new business.",
    rating: 5,
    projectType: "Professional Services Website",
    date: "2024-02-20",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    company: "Taste of Home Restaurant",
    role: "Restaurant Manager",
    content:
      "The online ordering system and reservation features have revolutionized our business. Customer feedback has been overwhelmingly positive, and our online orders have tripled since launch.",
    rating: 5,
    projectType: "Restaurant Website",
    date: "2024-03-10",
  },
  {
    id: "4",
    name: "David Thompson",
    company: "Thompson Photography",
    role: "Photographer",
    content:
      "As a photographer, I needed a portfolio that would showcase my work beautifully. The gallery features and client portal have streamlined my entire business process. Highly recommended!",
    rating: 5,
    projectType: "Portfolio Website",
    date: "2024-02-05",
  },
];

export default function Testimonials() {
  // Hide testimonials until we have real client reviews
  return null;
}

// Compact testimonials for other pages
export function TestimonialsCompact() {
  // Hide testimonials until we have real client reviews
  return null;
}
