"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ExternalLink,
  Eye,
  Code,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  demoUrl: string;
  technologies: string[];
  features: string[];
  clientType: string;
  completionDate: string;
  isLive?: boolean;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: "restaurant-demo",
    title: "Taste of Home Restaurant",
    category: "Restaurant",
    description:
      "Modern restaurant website with online ordering, reservations, and menu management. Features responsive design and integrated payment processing.",
    image: "/images/portfolio/restaurant-preview.jpg",
    demoUrl: "/demo/restaurant",
    technologies: ["React", "Next.js", "Tailwind CSS", "Stripe", "Node.js"],
    features: [
      "Online Ordering",
      "Table Reservations",
      "Menu Management",
      "Payment Processing",
      "Mobile Responsive",
    ],
    clientType: "Restaurant",
    completionDate: "2024-03-15",
    isLive: true,
  },
  {
    id: "beauty-salon-demo",
    title: "Bloom Beauty Salon",
    category: "Beauty & Wellness",
    description:
      "Elegant beauty salon website with appointment booking, service showcase, and client portal. Optimized for mobile and desktop.",
    image: "/images/portfolio/beauty-salon-preview.jpg",
    demoUrl: "/demo/beauty-salon",
    technologies: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Calendar API",
      "PostgreSQL",
    ],
    features: [
      "Appointment Booking",
      "Service Gallery",
      "Client Portal",
      "Staff Profiles",
      "Mobile App",
    ],
    clientType: "Beauty Salon",
    completionDate: "2024-02-20",
    isLive: true,
  },
  {
    id: "professional-services-demo",
    title: "Chen & Associates Law",
    category: "Professional Services",
    description:
      "Professional law firm website with case studies, attorney profiles, and client consultation booking. Built for trust and credibility.",
    image: "/images/portfolio/law-firm-preview.jpg",
    demoUrl: "/demo/professional-services",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "CMS", "SEO Tools"],
    features: [
      "Case Studies",
      "Attorney Profiles",
      "Consultation Booking",
      "Blog System",
      "SEO Optimized",
    ],
    clientType: "Law Firm",
    completionDate: "2024-01-10",
    isLive: true,
  },
  {
    id: "ecommerce-demo",
    title: "Artisan Marketplace",
    category: "E-commerce",
    description:
      "Full-featured e-commerce platform for artisan products with inventory management, payment processing, and order tracking.",
    image: "/images/portfolio/ecommerce-preview.jpg",
    demoUrl: "/demo/e-commerce",
    technologies: ["Next.js", "Stripe", "PostgreSQL", "Redis", "AWS"],
    features: [
      "Product Catalog",
      "Shopping Cart",
      "Payment Processing",
      "Order Management",
      "Admin Dashboard",
    ],
    clientType: "E-commerce",
    completionDate: "2024-04-05",
    isLive: false,
  },
  {
    id: "portfolio-demo",
    title: "Thompson Photography",
    category: "Demo",
    description:
      "Stunning photography portfolio with gallery management, client proofing, and booking system. Optimized for visual impact.",
    image: "/images/portfolio/photography-preview.jpg",
    demoUrl: "/demo/portfolio",
    technologies: ["Next.js", "Cloudinary", "Tailwind CSS", "Framer Motion"],
    features: [
      "Photo Gallery",
      "Client Proofing",
      "Booking System",
      "Blog",
      "Contact Forms",
    ],
    clientType: "Photography",
    completionDate: "2024-02-28",
    isLive: true,
  },
];

const categories = [
  "All",
  "Restaurant",
  "Beauty & Wellness",
  "Professional Services",
  "E-commerce",
  "Demo",
];

export default function PortfolioShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredItems =
    selectedCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedCategory);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Demo Sites
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our demo websites and templates. See examples of our work
            across different industries.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Demo Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Monitor className="h-16 w-16 text-gray-400" />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4">
                    <Link
                      href={item.demoUrl}
                      className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Demo</span>
                    </Link>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Code className="h-4 w-4" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  {item.isLive && (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                      Live
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {item.technologies.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{item.technologies.length - 3} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Link
                    href={item.demoUrl}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Demo
                  </Link>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Project?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can create a custom solution that perfectly
            fits your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Free Quote
            </Link>
            <Link
              href="/contact"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* Modal for item details */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedItem.title}
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-600 mb-6">{selectedItem.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Key Features
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedItem.features.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Completed:{" "}
                  {new Date(selectedItem.completionDate).toLocaleDateString()}
                </div>
                <Link
                  href={selectedItem.demoUrl}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Live Demo</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
