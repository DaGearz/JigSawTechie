import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Image
                src="/logo-white.png"
                alt="Jigsaw Techie Logo"
                width={240}
                height={80}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Solving your digital puzzle, one piece at a time. We create custom
              websites and tech solutions that help your business thrive online.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-accent-400 flex-shrink-0" />
                <a
                  href="mailto:twilliams@jigsawtechie.com"
                  className="text-gray-300 hover:text-accent-400 transition-colors break-words"
                >
                  twilliams@jigsawtechie.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-accent-400" />
                <span className="text-gray-300">San Diego, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-accent-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-gray-300 hover:text-accent-400 transition-colors"
                >
                  Demo Sites
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-accent-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-accent-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300">Custom Websites</span>
              </li>
              <li>
                <span className="text-gray-300">SEO Optimization</span>
              </li>
              <li>
                <span className="text-gray-300">E-commerce Solutions</span>
              </li>
              <li>
                <span className="text-gray-300">Website Maintenance</span>
              </li>
              <li>
                <Link
                  href="/quote"
                  className="text-accent-400 hover:text-accent-300 transition-colors"
                >
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Jigsaw Techie. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/admin"
              className="text-gray-400 hover:text-accent-400 text-sm transition-colors"
            >
              Admin
            </Link>
            <span className="text-gray-400 text-sm">
              Built with ❤️ for the community
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
