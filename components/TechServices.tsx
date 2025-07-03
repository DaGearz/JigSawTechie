'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Smartphone, Cloud, Headphones, BarChart3, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: "Website Development",
    description: "Custom websites, e-commerce platforms, and web applications that drive business growth and convert visitors into customers.",
    features: ["Responsive Design", "E-commerce", "SEO Optimization", "CMS Integration"],
    href: "/services/websites",
    color: "from-blue-500 to-blue-600",
    pricing: "Starting at $2,500"
  },
  {
    icon: Smartphone,
    title: "App Development", 
    description: "Native and cross-platform mobile applications for iOS and Android that engage users and grow your business.",
    features: ["iOS & Android", "Cross-platform", "API Integration", "App Store Deployment"],
    href: "/services/apps",
    color: "from-purple-500 to-purple-600",
    pricing: "Starting at $8,000"
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure, DevOps automation, and server management for reliable, secure operations.",
    features: ["Cloud Migration", "DevOps Setup", "Server Management", "24/7 Monitoring"],
    href: "/services/cloud", 
    color: "from-green-500 to-green-600",
    pricing: "Starting at $500/month"
  },
  {
    icon: Headphones,
    title: "IT Support",
    description: "Comprehensive technical support, system maintenance, and IT consulting to keep your business running smoothly.",
    features: ["24/7 Support", "System Maintenance", "Security Updates", "Remote Assistance"],
    href: "/services/support",
    color: "from-orange-500 to-orange-600", 
    pricing: "Starting at $200/month"
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    description: "Transform your data into actionable insights with custom dashboards, reporting, and business intelligence solutions.",
    features: ["Custom Dashboards", "Data Visualization", "Business Intelligence", "Automated Reporting"],
    href: "/services/data",
    color: "from-indigo-500 to-indigo-600",
    pricing: "Starting at $1,500"
  }
];

export default function TechServices() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
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
            Complete Technology Services
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            From websites to cloud infrastructure, we provide comprehensive technology solutions 
            that power your business growth and digital transformation.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${service.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <service.icon className="h-8 w-8" />
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    {service.pricing}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-white/90 text-sm">{service.description}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={service.href}
                  className="inline-flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors group-hover:bg-primary-600 group-hover:text-white"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center bg-white rounded-2xl p-8 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need Multiple Services?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get a custom package that combines multiple services for maximum value. 
            We'll create a comprehensive technology solution tailored to your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Schedule Free Consultation
            </Link>
            <Link
              href="/services"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View All Services
            </Link>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">2+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
