"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
  ctaLink: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Website Essentials",
    price: "$2,500",
    period: "starting at",
    description:
      "Perfect for small businesses and startups needing a professional online presence",
    features: [
      "Custom responsive design",
      "Up to 5 pages",
      "Contact forms & basic SEO",
      "Mobile optimization",
      "Free domain & hosting setup",
      "30 days of support",
      "Google Analytics integration",
    ],
    cta: "Get Started",
    ctaLink: "/quote?package=essentials",
  },
  {
    name: "Business Pro",
    price: "$4,500",
    period: "starting at",
    description:
      "Comprehensive solution for growing businesses with advanced features",
    features: [
      "Everything in Essentials",
      "Up to 10 pages",
      "E-commerce functionality",
      "Advanced SEO optimization",
      "Content management system",
      "Social media integration",
      "90 days of support",
      "Performance optimization",
      "Security features",
    ],
    popular: true,
    cta: "Most Popular",
    ctaLink: "/quote?package=business-pro",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "quote",
    description:
      "Tailored solutions for large businesses with complex requirements",
    features: [
      "Everything in Business Pro",
      "Unlimited pages",
      "Custom integrations",
      "Advanced analytics",
      "Multi-language support",
      "Priority support",
      "1 year of maintenance",
      "Training & documentation",
      "Dedicated project manager",
    ],
    cta: "Contact Us",
    ctaLink: "/contact?package=enterprise",
  },
];

export default function Pricing() {
  // Hide pricing section until we have established client base
  return null;
}
