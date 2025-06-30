import { Metadata } from "next";
import Link from "next/link";
import { templates } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Templates - Jigsaw Techie",
  description:
    "Browse our collection of professional website templates designed for modern businesses.",
};

export default function Templates() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-padding section-padding">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Website <span className="gradient-text">Templates</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional, customizable website templates designed for modern
            businesses. Each template is mobile-responsive, SEO-optimized, and
            ready to launch.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div key={template.id} className="card overflow-hidden">
              <div
                className="h-48 bg-gradient-to-br"
                style={{
                  background: `linear-gradient(to bottom right, ${template.colors.primary}, ${template.colors.secondary})`,
                }}
              ></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {template.name}
                  </h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {template.complexity}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{template.description}</p>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Key Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{template.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  <div className="flex gap-2">
                    <Link
                      href={template.demoUrl}
                      className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      View Demo
                    </Link>
                    <Link
                      href="/quote"
                      className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 transition-colors"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Something Custom?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Don&apos;t see a template that fits your needs? We create fully
              custom websites tailored to your specific business requirements
              and brand identity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/quote" className="btn-primary">
                Request Custom Quote
              </a>
              <a href="/contact" className="btn-secondary">
                Discuss Your Project
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
