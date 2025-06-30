"use client";

import { useState } from "react";
import { quoteService } from "@/lib/supabase";
import { trackQuoteSubmission } from "@/lib/gtag";

export default function Quote() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    projectType: "",
    timeline: "",
    description: "",
    features: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Transform form data to match database schema
      const quoteData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        website: formData.website || undefined,
        project_type: formData.projectType,
        budget: "To be discussed",
        timeline: formData.timeline,
        description: formData.description,
        features: formData.features,
      };

      // Submit to Supabase
      await quoteService.createQuote(quoteData);

      // Track successful quote submission
      trackQuoteSubmission(formData.projectType);

      setSubmitStatus("success");

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        website: "",
        projectType: "",
        timeline: "",
        description: "",
        features: [],
      });
    } catch (error: unknown) {
      console.error("Error submitting quote:", error);
      setSubmitStatus("error");

      // Set a user-friendly error message
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorCode =
        error && typeof error === "object" && "code" in error
          ? (error as { code: string }).code
          : null;

      if (errorMessage.includes("Failed to fetch")) {
        setErrorMessage(
          "Connection error. Please check your internet connection and try again."
        );
      } else if (errorMessage.includes("JWT")) {
        setErrorMessage(
          "Authentication error. Please refresh the page and try again."
        );
      } else if (errorCode === "PGRST116") {
        setErrorMessage("Database table not found. Please contact support.");
      } else {
        setErrorMessage(
          errorMessage || "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    "New Website",
    "Website Redesign",
    "E-commerce Store",
    "Landing Page",
    "Web Application",
    "Other",
  ];

  const timelineOptions = [
    "ASAP",
    "1-2 weeks",
    "1 month",
    "2-3 months",
    "3+ months",
  ];

  const featureOptions = [
    "Responsive Design",
    "SEO Optimization",
    "E-commerce",
    "Blog/CMS",
    "Contact Forms",
    "Social Media Integration",
    "Analytics Setup",
    "Payment Processing",
    "User Accounts",
    "Custom Functionality",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-padding section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get Your Free <span className="gradient-text">Quote</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tell us about your project and we&apos;ll provide you with a
              detailed quote within 24 hours. All consultations are completely
              free with no obligation.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Company/Business Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Project Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="projectType"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Project Type *
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      required
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Current Website (if any)
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="timeline"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Timeline *
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      required
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select timeline</option>
                      {timelineOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Desired Features
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {featureOptions.map((feature) => (
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleFeatureChange(feature)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {feature}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Project Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Please describe your project, goals, and any specific requirements..."
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Get My Free Quote"}
                </button>

                {/* Success Message */}
                {submitStatus === "success" && (
                  <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    <p className="font-semibold">
                      Thank you for your quote request!
                    </p>
                    <p>
                      We&apos;ll get back to you within 24 hours with a detailed
                      quote.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === "error" && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <p className="font-semibold">Oops! Something went wrong.</p>
                    <p className="mb-2">{errorMessage}</p>
                    <p className="text-sm">
                      If the problem persists, contact us directly at
                      twilliams@jigsawtechie.com
                    </p>
                  </div>
                )}

                {submitStatus === "idle" && (
                  <p className="text-sm text-gray-500 mt-2">
                    We&apos;ll respond within 24 hours with a detailed quote
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
