"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wrench,
  Rocket,
  Lightbulb,
  Handshake,
  Sprout,
  Code,
  Target,
  Award,
  ExternalLink,
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 section-padding">
        <div className="container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                About <span className="gradient-text">Jigsaw Techie</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                <strong>Jigsaw Techie</strong> is a web design and custom
                software company focused on helping small businesses thrive in
                the digital world. Whether you're just starting out or ready to
                scale, we provide powerful, affordable tech solutions to bring
                your ideas to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/quote"
                  className="btn-primary inline-flex items-center justify-center"
                >
                  Get Free Consultation
                  <Rocket className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/contact"
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  Contact Us
                  <Handshake className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </motion.div>

            {/* Image/Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Code className="w-16 h-16 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Todd Williams
                  </h3>
                  <p className="text-primary-600 font-medium mb-4">
                    Founder & Lead Developer
                  </p>
                  <p className="text-gray-600 mb-6">
                    Former Engineer • Software Developer • AI Enthusiast
                  </p>
                  <a
                    href="https://toddwilliams.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    View My Portfolio
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-padding">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none text-gray-600"
            >
              <p className="text-lg leading-relaxed mb-6">
                Founded by <strong>Todd Williams</strong>, a former engineer
                turned software developer, Jigsaw Techie combines real-world
                experience with modern web development to solve real problems.
                With a background in mechanical engineering and utility
                design—and a deep passion for automation and AI—we understand
                both the business side and the tech side of your challenges.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                At Jigsaw Techie, we don't believe in cookie-cutter websites.
                Every project is crafted to match your business goals and brand
                identity. From sleek, mobile-friendly websites to AI-enhanced
                tools and automated systems, we build the digital tools that
                keep your business running smoothly.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                Want to see Todd's technical skills and project portfolio in
                action?{" "}
                <a
                  href="https://toddwilliams.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium underline"
                >
                  Check out his developer portfolio
                </a>{" "}
                to explore his latest projects, technical expertise, and the
                innovative solutions he's built for clients across various
                industries.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-padding">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Target className="w-16 h-16 text-primary-600 mx-auto mb-6" />
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                To empower small businesses with the tools and technology they
                need to compete, grow, and succeed—without breaking the bank.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just developers—we're your long-term technology partners
              committed to your success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Wrench,
                title: "Custom-built solutions, not templates",
                description:
                  "Every project is tailored specifically to your business needs and goals.",
              },
              {
                icon: Rocket,
                title: "Fast turnaround and responsive support",
                description:
                  "Quick delivery without compromising quality, plus ongoing support when you need it.",
              },
              {
                icon: Lightbulb,
                title: "AI + automation integration options",
                description:
                  "Leverage cutting-edge technology to streamline your business processes.",
              },
              {
                icon: Handshake,
                title: "Straightforward pricing and honest advice",
                description:
                  "No hidden fees, no surprises. Just transparent pricing and genuine recommendations.",
              },
              {
                icon: Sprout,
                title: "A long-term partner invested in your success",
                description:
                  "We grow with your business, providing ongoing support and enhancements.",
              },
              {
                icon: Award,
                title: "Engineering expertise meets web development",
                description:
                  "Unique perspective combining technical engineering background with modern web solutions.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8 text-center hover:shadow-xl transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Let's build something amazing together.
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Ready to take your business to the next level? Get started with a
              free consultation and discover how we can help solve your digital
              challenges.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              Get Free Consultation
              <Rocket className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
