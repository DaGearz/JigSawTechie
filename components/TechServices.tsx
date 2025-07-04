"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Smartphone,
  Cloud,
  Headphones,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Website Development",
    description:
      "Custom websites, e-commerce platforms, and web applications that drive business growth and convert visitors into customers.",
    features: [
      "Responsive Design",
      "E-commerce",
      "SEO Optimization",
      "CMS Integration",
    ],
    href: "/quote",
    color: "from-blue-500 to-blue-600",
    pricing: "Custom Quote",
  },
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
            Website Development Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Professional website development services to establish your online
            presence and grow your business.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="flex justify-center mb-12">
          <div className="max-w-md w-full">
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
                <div
                  className={`bg-gradient-to-r ${service.color} p-6 text-white`}
                >
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
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Key Features:
                    </h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center text-sm text-gray-600"
                        >
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
            Need Other IT or Software Solutions?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Looking for app development, cloud solutions, IT support, or other
            technology services? Contact us to discuss your specific needs and
            how we can help your business grow.
          </p>
          <div className="flex justify-center">
            <Link
              href="/contact"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Contact Us for Other IT Services
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
