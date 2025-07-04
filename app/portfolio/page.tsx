import { Metadata } from "next";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import { TestimonialsCompact } from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Demo Sites - Website Examples & Templates | JigsawTechie",
  description:
    "Explore our demo sites and website templates. See examples of our work across different industries and website types.",
  keywords:
    "demo sites, website examples, website templates, web development examples, website demos",
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Demo Sites</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Explore our demo websites and templates. See examples of our work
            across different industries and website types.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#demo-sites"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Our Work
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Start Your Project
            </a>
          </div>
        </div>
      </section>

      {/* Demo Sites Showcase */}
      <section id="demo-sites" className="py-20">
        <PortfolioShowcase />
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technology Solutions We Provide
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From simple websites to complex enterprise applications, we
              deliver comprehensive technology solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Website Development
              </h3>
              <p className="text-gray-600 mb-4">
                Custom responsive websites, e-commerce platforms, and web
                applications.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Business Websites</li>
                <li>• E-commerce Stores</li>
                <li>• Web Applications</li>
                <li>• Demo Sites</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                App Development
              </h3>
              <p className="text-gray-600 mb-4">
                Native and cross-platform mobile applications for iOS and
                Android.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• iOS Applications</li>
                <li>• Android Applications</li>
                <li>• Cross-platform Apps</li>
                <li>• Progressive Web Apps</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl mb-4">☁️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cloud Solutions
              </h3>
              <p className="text-gray-600 mb-4">
                Scalable cloud infrastructure and DevOps automation.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cloud Migration</li>
                <li>• Server Management</li>
                <li>• DevOps Setup</li>
                <li>• Monitoring & Security</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                IT Support
              </h3>
              <p className="text-gray-600 mb-4">
                Comprehensive technical support and system maintenance.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 24/7 Technical Support</li>
                <li>• System Maintenance</li>
                <li>• Security Updates</li>
                <li>• Remote Assistance</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Data Analytics
              </h3>
              <p className="text-gray-600 mb-4">
                Business intelligence and data visualization solutions.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Custom Dashboards</li>
                <li>• Data Visualization</li>
                <li>• Business Intelligence</li>
                <li>• Automated Reporting</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Custom Solutions
              </h3>
              <p className="text-gray-600 mb-4">
                Tailored technology solutions for unique business needs.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Custom Integrations</li>
                <li>• API Development</li>
                <li>• Automation Tools</li>
                <li>• Enterprise Solutions</li>
              </ul>
            </div>
          </div>
        </div>
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
              A proven methodology that ensures successful project delivery and
              exceeds client expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Discovery & Planning",
                description:
                  "We analyze your business needs, goals, and technical requirements to create a comprehensive project plan.",
              },
              {
                step: "2",
                title: "Design & Architecture",
                description:
                  "Create user-focused designs and robust technical architecture that scales with your business.",
              },
              {
                step: "3",
                title: "Development & Testing",
                description:
                  "Build your solution using modern technologies with continuous testing and quality assurance.",
              },
              {
                step: "4",
                title: "Launch & Support",
                description:
                  "Deploy your solution and provide ongoing support, maintenance, and optimization.",
              },
            ].map((phase, index) => (
              <div key={phase.step} className="text-center">
                <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {phase.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {phase.title}
                </h3>
                <p className="text-gray-600">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8">
            Let's discuss your technology needs and create a solution that
            drives your business forward.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/quote"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Free Quote
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Schedule Consultation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
