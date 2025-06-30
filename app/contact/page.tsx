import { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us - Jigsaw Techie",
  description:
    "Get in touch with Jigsaw Techie for custom web development, SEO optimization, and tech solutions. Serving San Diego locally and remote services nationwide.",
  keywords:
    "contact jigsaw techie, web development san diego, custom websites, tech solutions contact",
};

export default function ContactPage() {
  return <ContactForm />;
}
