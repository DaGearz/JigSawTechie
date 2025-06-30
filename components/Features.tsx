"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Search,
  ShoppingCart,
  Headphones,
  Palette,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description:
        "Every website we build looks perfect on all devices, ensuring your customers have a great experience whether they&apos;re on mobile, tablet, or desktop.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Search,
      title: "SEO Optimized",
      description:
        "Built-in search engine optimization helps your business get found online. We implement best practices to improve your visibility on Google.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Ready",
      description:
        "Sell your products online with secure payment processing, inventory management, and a seamless checkout experience for your customers.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Optimized for speed and performance. Fast-loading websites keep visitors engaged and improve your search engine rankings.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security features protect your website and customer data. SSL certificates and regular backups included.",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Headphones,
      title: "Ongoing Support",
      description:
        "24/7 support and maintenance services ensure your website stays updated, secure, and running smoothly at all times.",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Palette,
      title: "Custom Design",
      description:
        "Unique designs tailored to your brand identity. No templates - every website is crafted specifically for your business.",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: TrendingUp,
      title: "Growth Focused",
      description:
        "Built with scalability in mind. Your website grows with your business, supporting increased traffic and new features.",
      color: "bg-teal-100 text-teal-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="gradient-text">Jigsaw Techie</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine technical expertise with deep understanding of the unique
            challenges and opportunities facing modern businesses in
            today&apos;s digital landscape.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card p-6 text-center group hover:scale-105 transition-transform duration-300"
            >
              <div
                className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-green-600 to-yellow-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Online Presence?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join the growing community of successful businesses thriving
              online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/quote"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Start Your Project
              </a>
              <a
                href="/templates"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-green-600 transition-colors duration-200"
              >
                View Our Work
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
