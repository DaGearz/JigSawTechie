import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";
import PerformanceMonitor from "@/components/PerformanceMonitor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jigsaw Techie - Professional Web Development & Tech Solutions",
  description:
    "Solving your digital puzzle, one piece at a time. Custom websites, SEO optimization, and tech solutions for businesses. Professional web development services in San Diego.",
  keywords:
    "jigsaw techie, web development, tech solutions, custom websites, SEO, digital solutions, San Diego",
  authors: [{ name: "Jigsaw Techie" }],
  creator: "Jigsaw Techie",
  publisher: "Jigsaw Techie",
  icons: {
    icon: [
      { url: "/logo-icon-only.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-icon-only.png", sizes: "64x64", type: "image/png" },
      { url: "/logo-icon-only.png", sizes: "96x96", type: "image/png" },
      { url: "/logo-icon-only.png", sizes: "128x128", type: "image/png" },
    ],
    shortcut: "/logo-icon-only.png",
    apple: [
      { url: "/logo-icon-only.png", sizes: "180x180", type: "image/png" },
      { url: "/logo-icon-only.png", sizes: "152x152", type: "image/png" },
      { url: "/logo-icon-only.png", sizes: "120x120", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/logo-icon-only.png",
        sizes: "any",
      },
      {
        rel: "mask-icon",
        url: "/logo-icon-only.png",
        color: "#2563eb",
      },
    ],
  },
  openGraph: {
    title: "Jigsaw Techie - Solving Your Digital Puzzle",
    description:
      "Professional web development and tech solutions for businesses",
    url: "https://jigsawtechie.com",
    siteName: "Jigsaw Techie",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jigsaw Techie - Solving Your Digital Puzzle",
    description:
      "Professional web development and tech solutions for businesses",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/logo-icon-only.png"
          sizes="32x32"
          type="image/png"
        />
        <link
          rel="icon"
          href="/logo-icon-only.png"
          sizes="64x64"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="/logo-icon-only.png"
          sizes="180x180"
        />
        <link rel="mask-icon" href="/favicon.svg" color="#2563eb" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-TileImage" content="/logo-icon-only.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
        `}
      </Script>
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        <PerformanceMonitor />
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
