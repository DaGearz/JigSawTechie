"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Users, Award } from "lucide-react";

const CTA = () => {
  const stats = [
    {
      icon: Award,
      number: "100%",
      label: "Project Success",
    },
    {
      icon: Users,
      number: "24/7",
      label: "Support Available",
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-400 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-green-300 rounded-full blur-2xl"></div>
      </div>

      <div className="container-padding relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Take Your Business{" "}
              <span className="bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                Online?
              </span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Join the growing community of successful businesses that have
              transformed their online presence with our professional web
              development and tech services. Let&apos;s build something amazing
              together.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={24} className="text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              href="/quote"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Your Free Quote
              <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link
              href="/templates"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-all duration-200 inline-flex items-center justify-center"
            >
              View Our Portfolio
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="border-t border-gray-700 pt-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h4 className="font-semibold text-green-400 mb-2">
                  Free Consultation
                </h4>
                <p className="text-gray-300 text-sm">
                  No obligation discussion about your project goals and
                  requirements
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-2">
                  Quality Focused
                </h4>
                <p className="text-gray-300 text-sm">
                  Dedicated to delivering high-quality solutions that exceed
                  expectations
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-2">
                  Ongoing Support
                </h4>
                <p className="text-gray-300 text-sm">
                  Continued partnership with maintenance and support services
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-gray-700"
          >
            <p className="text-gray-300 mb-4">
              Questions? We&apos;re here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:twilliams@jigsawtechie.com"
                className="text-green-400 hover:text-green-300 transition-colors break-words text-center sm:text-left"
              >
                twilliams@jigsawtechie.com
              </a>
              <span className="hidden sm:block text-gray-500">•</span>
              <span className="text-gray-300">San Diego, CA</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
