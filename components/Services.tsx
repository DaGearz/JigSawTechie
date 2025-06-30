"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  Search,
  ShoppingCart,
  Settings,
  ArrowRight,
  Check,
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: "Custom Website Development",
      description:
        "Fully custom websites built from scratch to match your brand and business goals.",
      features: [
        "Responsive design for all devices",
        "Custom functionality and features",
        "Content management system",
        "Professional design consultation",
        "Brand integration and styling",
      ],
      popular: false,
    },
    {
      icon: Search,
      title: "SEO Optimization",
      description:
        "Comprehensive search engine optimization to help your business get found online.",
      features: [
        "Keyword research and strategy",
        "On-page SEO optimization",
        "Technical SEO improvements",
        "Local SEO for local businesses",
        "Monthly performance reports",
      ],
      popular: true,
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Solutions",
      description:
        "Complete online store setup with secure payment processing and inventory management.",
      features: [
        "Product catalog setup",
        "Secure payment processing",
        "Inventory management",
        "Order tracking system",
        "Customer account portal",
      ],
      popular: false,
    },
    {
      icon: Settings,
      title: "Website Maintenance",
      description:
        "Ongoing support and maintenance to keep your website secure, updated, and running smoothly.",
      features: [
        "Regular security updates",
        "Content updates and changes",
        "Performance monitoring",
        "Backup and recovery",
        "24/7 technical support",
      ],
      popular: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive web development and tech services designed to help
            your business succeed online. From custom websites to ongoing
            support, we&apos;ve got you covered.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative card p-8 ${
                service.popular ? "ring-2 ring-green-500" : ""
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
              </div>

              <div className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check
                      size={16}
                      className="text-green-500 mr-3 flex-shrink-0"
                    />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/quote"
                className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  service.popular
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                Get Started
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Something Custom?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Every business is unique. If you don&apos;t see exactly what you
              need, let&apos;s talk about creating a custom solution that fits
              your specific requirements and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Discuss Your Project
              </Link>
              <Link href="/templates" className="btn-secondary">
                View Portfolio
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
