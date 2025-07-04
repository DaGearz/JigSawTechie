import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Smartphone,
  Cloud,
  Headphones,
  BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tech Services - Complete Technology Solutions | JigsawTechie",
  description:
    "Comprehensive technology services including website development, app creation, cloud solutions, IT support, and data analytics. Your complete tech partner.",
  keywords:
    "tech services, website development, app development, cloud solutions, IT support, data analytics, technology consulting",
};

const services = [
  {
    icon: Globe,
    title: "Website Development",
    description:
      "Custom websites, e-commerce platforms, and web applications that drive business growth.",
    features: [
      "Responsive Design",
      "E-commerce",
      "CMS Integration",
      "SEO Optimization",
    ],
    href: "/quote",
    color: "bg-blue-500",
    pricing: "Custom Quote",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Website Development Services
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Professional website development services to establish your online
            presence and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Free Consultation
            </Link>
            <Link
              href="/quote"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Website Development
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional website development services to help your business
              succeed online.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="max-w-md w-full">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-8">
                    <div
                      className={`${service.color} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}
                    >
                      <service.icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 mb-6">{service.description}</p>

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
                            <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-primary-600">
                        {service.pricing}
                      </div>
                      <Link
                        href={service.href}
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Other IT Services */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Need Other IT or Software Solutions?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Looking for app development, cloud solutions, IT support, or other
            technology services? Contact us to discuss your specific needs and
            how we can help your business grow.
          </p>
          <Link
            href="/contact"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-block"
          >
            Contact Us for Other IT Services
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose JigsawTechie?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're not just service providers - we're your technology partners
              committed to your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                One-Stop Solution
              </h3>
              <p className="text-gray-600 text-sm">
                All your tech needs handled by one trusted team
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                Quick turnaround without compromising quality
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600 text-sm">
                Enterprise-grade security and reliability
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-600 text-sm">
                Round-the-clock support when you need it
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8">
            Let's discuss how our technology services can accelerate your growth
            and streamline your operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Schedule Free Consultation
            </Link>
            <Link
              href="/quote"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Get Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
