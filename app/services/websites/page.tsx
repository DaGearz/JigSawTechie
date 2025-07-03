import { Metadata } from "next";
import Link from "next/link";
import { Check, Globe, Smartphone, Search, ShoppingCart, Zap, Shield } from "lucide-react";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import { TestimonialsCompact } from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Website Development Services | Custom Websites & E-commerce | JigsawTechie",
  description: "Professional website development services. Custom responsive websites, e-commerce platforms, and web applications that convert visitors into customers.",
  keywords: "website development, custom websites, e-commerce, web design, responsive design, website builder",
};

const packages = [
  {
    name: "Starter Website",
    price: "$2,500",
    description: "Perfect for small businesses and startups",
    features: [
      "5 custom pages",
      "Responsive design",
      "Contact forms",
      "Basic SEO setup",
      "Google Analytics",
      "30 days support"
    ],
    popular: false
  },
  {
    name: "Business Pro",
    price: "$4,500", 
    description: "Complete solution for growing businesses",
    features: [
      "10 custom pages",
      "E-commerce functionality",
      "Advanced SEO",
      "CMS integration",
      "Social media integration",
      "90 days support",
      "Performance optimization"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored for large organizations",
    features: [
      "Unlimited pages",
      "Custom integrations",
      "Advanced analytics",
      "Multi-language support",
      "Priority support",
      "1 year maintenance",
      "Training included"
    ],
    popular: false
  }
];

const features = [
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Every website is designed and optimized for mobile devices first, ensuring perfect performance on all screen sizes."
  },
  {
    icon: Search,
    title: "SEO Optimized",
    description: "Built-in SEO best practices to help your website rank higher in search results and attract more customers."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with modern technologies, ensuring your visitors have the best possible experience."
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security measures and reliable hosting to keep your website safe and always online."
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Ready",
    description: "Full e-commerce capabilities with payment processing, inventory management, and order tracking."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Multi-language support and international payment options to help you reach customers worldwide."
  }
];

export default function WebsitesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional Website Development
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Custom websites that convert visitors into customers. From simple business sites 
              to complex e-commerce platforms, we build websites that grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote?service=websites"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                🚀 Get Free Quote
              </Link>
              <Link
                href="#portfolio"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                👀 View Examples
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Website Development?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We don't just build websites - we create digital experiences that drive results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Website Development Packages
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transparent pricing with no hidden fees. Choose the package that fits your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={pkg.name}
                className={`bg-white rounded-xl shadow-lg p-8 ${
                  pkg.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium text-center mb-4">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{pkg.price}</div>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/quote?package=${pkg.name.toLowerCase().replace(' ', '-')}`}
                  className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    pkg.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-gray-50">
        <PortfolioShowcase />
      </section>

      {/* Testimonials */}
      <TestimonialsCompact />

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Development Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A proven process that ensures your website is delivered on time and exceeds expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Discovery", description: "We learn about your business, goals, and target audience" },
              { step: "2", title: "Design", description: "Create wireframes and designs that reflect your brand" },
              { step: "3", title: "Development", description: "Build your website using modern technologies" },
              { step: "4", title: "Launch", description: "Test, optimize, and launch your new website" }
            ].map((phase, index) => (
              <div key={phase.step} className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {phase.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{phase.title}</h3>
                <p className="text-gray-600">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your Website?
          </h2>
          <p className="text-xl mb-8">
            Get a professional website that converts visitors into customers. Free consultation included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote?service=websites"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Free Quote & Strategy Call
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
