import { notFound } from "next/navigation";
import { getTemplateById } from "@/lib/templates";
import RestaurantDemo from "@/components/templates/RestaurantDemo";
import BeautySalonDemo from "@/components/templates/BeautySalonDemo";
import ProfessionalServicesDemo from "@/components/templates/ProfessionalServicesDemo";
import EcommerceDemo from "@/components/templates/EcommerceDemo";
import NonprofitDemo from "@/components/templates/NonprofitDemo";

interface SamplePageProps {
  params: Promise<{
    template: string;
  }>;
}

export async function generateMetadata({ params }: SamplePageProps) {
  const { template: templateId } = await params;
  const template = getTemplateById(templateId);

  if (!template) {
    return {
      title: "Template Not Found - Jigsaw Techie",
    };
  }

  return {
    title: `${template.name} Sample - Jigsaw Techie`,
    description: `Live sample of ${template.name} - ${template.description}`,
  };
}

export default async function SamplePage({ params }: SamplePageProps) {
  const { template: templateId } = await params;
  const template = getTemplateById(templateId);

  if (!template) {
    notFound();
  }

  const renderTemplate = () => {
    switch (template.id) {
      case "restaurant":
        return <RestaurantDemo />;
      case "beauty-salon":
        return <BeautySalonDemo />;
      case "professional-services":
        return <ProfessionalServicesDemo />;
      case "ecommerce":
        return <EcommerceDemo />;
      case "nonprofit":
        return <NonprofitDemo />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Sample Coming Soon
              </h1>
              <p className="text-gray-600">
                The {template.name} sample is currently being developed.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Sample Header */}
      <div className="bg-gray-900 text-white py-2 px-4 text-center text-sm">
        <span>🎨 Live Sample: {template.name} Template</span>
        <a
          href="/templates"
          className="ml-4 text-blue-300 hover:text-blue-200 underline"
        >
          ← Back to Templates
        </a>
      </div>

      {/* Template Sample */}
      {renderTemplate()}
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { template: "restaurant" },
    { template: "beauty-salon" },
    { template: "professional-services" },
    { template: "ecommerce" },
    { template: "nonprofit" },
  ];
}
