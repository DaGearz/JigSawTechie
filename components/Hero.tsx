"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code, Palette, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 section-padding overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-600 rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-500 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary-400 rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-secondary-400 rounded-full"></div>
      </div>

      <div className="container-padding relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                <Zap size={16} className="mr-2" />
                Solving Your Digital Puzzle
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Complete{" "}
                <span className="gradient-text">Technology Solutions</span> for
                Your Business
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                From websites to cloud infrastructure, we provide comprehensive
                technology services that power your business growth. Get
                professional solutions that actually convert visitors into
                customers and streamline your operations.
                <span className="font-semibold text-primary-600">
                  {" "}
                  Free consultation included.
                </span>
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/quote"
                className="btn-primary inline-flex items-center justify-center transform hover:scale-105 transition-transform"
              >
                🚀 Get Free Quote & Strategy Call
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link
                href="/templates"
                className="btn-secondary inline-flex items-center justify-center"
              >
                👀 See Live Examples
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-lg">✓</span>
                <span>Free consultation & strategy call</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-lg">✓</span>
                <span>24-hour response guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-lg">✓</span>
                <span>100% satisfaction rate</span>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">50+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">100%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">24hr</div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              {/* Mock Browser Window */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="flex-1 bg-gray-100 rounded-md h-6 ml-4"></div>
              </div>

              {/* Mock Website Content */}
              <div className="space-y-4">
                <div className="h-8 bg-gradient-to-r from-green-200 to-yellow-200 rounded-md"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    <Code size={24} className="text-gray-400" />
                  </div>
                  <div className="h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    <Palette size={24} className="text-gray-400" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                <div className="h-10 bg-green-100 rounded-md"></div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
            >
              <Zap size={24} className="text-white" />
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Code size={16} className="text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
