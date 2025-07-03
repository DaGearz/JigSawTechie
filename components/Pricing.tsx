'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
    name: 'Website Essentials',
    price: '$2,500',
    period: 'starting at',
    description: 'Perfect for small businesses and startups needing a professional online presence',
    features: [
      'Custom responsive design',
      'Up to 5 pages',
      'Contact forms & basic SEO',
      'Mobile optimization',
      'Free domain & hosting setup',
      '30 days of support',
      'Google Analytics integration'
    ],
    cta: 'Get Started',
    ctaLink: '/quote?package=essentials'
  },
  {
    name: 'Business Pro',
    price: '$4,500',
    period: 'starting at',
    description: 'Comprehensive solution for growing businesses with advanced features',
    features: [
      'Everything in Essentials',
      'Up to 10 pages',
      'E-commerce functionality',
      'Advanced SEO optimization',
      'Content management system',
      'Social media integration',
      '90 days of support',
      'Performance optimization',
      'Security features'
    ],
    popular: true,
    cta: 'Most Popular',
    ctaLink: '/quote?package=business-pro'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'quote',
    description: 'Tailored solutions for large businesses with complex requirements',
    features: [
      'Everything in Business Pro',
      'Unlimited pages',
      'Custom integrations',
      'Advanced analytics',
      'Multi-language support',
      'Priority support',
      '1 year of maintenance',
      'Training & documentation',
      'Dedicated project manager'
    ],
    cta: 'Contact Us',
    ctaLink: '/contact?package=enterprise'
  }
];

export default function Pricing() {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Transparent Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            No hidden fees, no surprises. Choose the package that fits your business needs.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredTier(tier.name)}
              onMouseLeave={() => setHoveredTier(null)}
              className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 ${
                tier.popular 
                  ? 'ring-2 ring-primary-500 scale-105' 
                  : hoveredTier === tier.name 
                    ? 'shadow-xl scale-105' 
                    : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary-600">{tier.price}</span>
                  <span className="text-gray-500 ml-2">{tier.period}</span>
                </div>
                <p className="text-gray-600">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.ctaLink}
                className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  tier.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {tier.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center bg-white rounded-xl p-8 shadow-md"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Not sure which package is right for you?
          </h3>
          <p className="text-gray-600 mb-6">
            Schedule a free consultation and we'll help you choose the perfect solution for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Schedule Free Consultation
            </Link>
            <Link
              href="/quote"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Get Custom Quote
            </Link>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">💰</div>
              <h4 className="font-semibold text-gray-900 mb-1">No Hidden Fees</h4>
              <p className="text-sm text-gray-600">What you see is what you pay</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="font-semibold text-gray-900 mb-1">Money-Back Guarantee</h4>
              <p className="text-sm text-gray-600">100% satisfaction or refund</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-semibold text-gray-900 mb-1">Fast Delivery</h4>
              <p className="text-sm text-gray-600">Most projects completed in 2-4 weeks</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
