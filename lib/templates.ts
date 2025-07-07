// Template configuration and metadata
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  demoUrl: string;
  previewImage: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  industries: string[];
  complexity: "Simple" | "Moderate" | "Advanced";
  estimatedHours: number;
}

export const templates: Template[] = [
  {
    id: "restaurant",
    name: "Savory Delights",
    description:
      "Perfect for restaurants, cafes, and food businesses with online ordering capabilities",
    category: "Food & Beverage",
    features: [
      "Online Menu Display",
      "Table Reservations",
      "Online Ordering System",
      "Photo Gallery",
      "Location & Hours",
      "Social Media Integration",
      "Mobile Responsive",
    ],
    demoUrl: "/templates/demo/restaurant",
    previewImage: "/templates/restaurant/preview.jpg",
    colors: {
      primary: "#D97706", // Orange
      secondary: "#92400E", // Dark Orange
      accent: "#FEF3C7", // Light Yellow
    },
    industries: ["Restaurant", "Cafe", "Food Truck", "Catering", "Bar"],
    complexity: "Moderate",
    estimatedHours: 40,
  },
  {
    id: "beauty-salon",
    name: "Elegant Beauty",
    description:
      "Designed for beauty salons, spas, and wellness centers with booking functionality",
    category: "Beauty & Wellness",
    features: [
      "Service Booking System",
      "Staff Profiles",
      "Before/After Gallery",
      "Price List",
      "Contact Forms",
      "Social Media Feed",
      "Gift Card Sales",
    ],
    demoUrl: "/templates/demo/beauty-salon",
    previewImage: "/templates/beauty-salon/preview.jpg",
    colors: {
      primary: "#EC4899", // Pink
      secondary: "#BE185D", // Dark Pink
      accent: "#FCE7F3", // Light Pink
    },
    industries: [
      "Beauty Salon",
      "Spa",
      "Nail Salon",
      "Barbershop",
      "Wellness Center",
    ],
    complexity: "Advanced",
    estimatedHours: 50,
  },
  {
    id: "professional-services",
    name: "Corporate Excellence",
    description:
      "Professional template for consultants, lawyers, and service-based businesses",
    category: "Professional Services",
    features: [
      "Service Portfolio",
      "Team Profiles",
      "Case Studies",
      "Contact Forms",
      "Blog/News Section",
      "Document Downloads",
      "Appointment Scheduling",
    ],
    demoUrl: "/templates/demo/professional-services",
    previewImage: "/templates/professional-services/preview.jpg",
    colors: {
      primary: "#1E40AF", // Blue
      secondary: "#1E3A8A", // Dark Blue
      accent: "#DBEAFE", // Light Blue
    },
    industries: [
      "Consulting",
      "Legal",
      "Accounting",
      "Real Estate",
      "Insurance",
    ],
    complexity: "Moderate",
    estimatedHours: 35,
  },
  {
    id: "ecommerce",
    name: "Shop Supreme",
    description:
      "Complete e-commerce solution with payment processing and inventory management",
    category: "E-commerce",
    features: [
      "Product Catalog",
      "Shopping Cart",
      "Secure Checkout",
      "Payment Processing",
      "Inventory Management",
      "Order Tracking",
      "Customer Accounts",
      "Admin Dashboard",
      "SEO Optimization",
      "Analytics Integration",
    ],
    demoUrl: "/templates/demo/ecommerce",
    previewImage: "/templates/ecommerce/preview.jpg",
    colors: {
      primary: "#059669", // Green
      secondary: "#047857", // Dark Green
      accent: "#D1FAE5", // Light Green
    },
    industries: [
      "Retail",
      "Fashion",
      "Electronics",
      "Handmade",
      "Digital Products",
    ],
    complexity: "Advanced",
    estimatedHours: 80,
  },
  {
    id: "nonprofit",
    name: "Community Impact",
    description:
      "Designed for non-profits and community organizations with donation capabilities",
    category: "Non-Profit",
    features: [
      "Donation System",
      "Volunteer Registration",
      "Event Calendar",
      "Impact Stories",
      "Newsletter Signup",
      "Social Media Integration",
      "Photo Gallery",
      "Contact Forms",
    ],
    demoUrl: "/templates/demo/nonprofit",
    previewImage: "/templates/nonprofit/preview.jpg",
    colors: {
      primary: "#7C3AED", // Purple
      secondary: "#5B21B6", // Dark Purple
      accent: "#EDE9FE", // Light Purple
    },
    industries: [
      "Non-Profit",
      "Community Organization",
      "Charity",
      "Foundation",
      "Religious",
    ],
    complexity: "Simple",
    estimatedHours: 25,
  },
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find((template) => template.id === id);
};

export const getTemplatesByCategory = (category: string): Template[] => {
  return templates.filter((template) => template.category === category);
};

export const getTemplatesByIndustry = (industry: string): Template[] => {
  return templates.filter((template) =>
    template.industries.some((ind) =>
      ind.toLowerCase().includes(industry.toLowerCase())
    )
  );
};
