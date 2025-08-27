import React from "react";
import { 
  FaFacebookF, 
  FaYoutube, 
  FaTwitter, 
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCreditCard,
  FaShieldAlt,
  FaAward,
  FaPlane,
  FaBus,
  FaTrain,
  FaBed,
  FaHeadset
} from "react-icons/fa";

const Footer = () => {
  const services = [
    { title: "Flight Booking", href: "/flights", icon: <FaPlane className="w-4 h-4" /> },
    { title: "Bus Tickets", href: "/bus", icon: <FaBus className="w-4 h-4" /> },
    { title: "Train Booking", href: "/trains", icon: <FaTrain className="w-4 h-4" /> },
    { title: "Hotel Booking", href: "/hotels", icon: <FaBed className="w-4 h-4" /> }
  ];

  const support = [
    { title: "Help Center", href: "/help" },
    { title: "Customer Support", href: "/support" },
    { title: "Cancellation Policy", href: "/cancellation" },
    { title: "Refund Policy", href: "/refund" },
    { title: "Travel Insurance", href: "/insurance" },
    { title: "Manage Booking", href: "/manage-booking" }
  ];

  const company = [
    { title: "About Us", href: "/about" },
    { title: "Contact Us", href: "/contact" },
    { title: "Careers", href: "/careers" },
    { title: "Press", href: "/press" },
    { title: "Investor Relations", href: "/investors" },
    { title: "Blog", href: "/blog" }
  ];

  const legal = [
    { title: "Terms & Conditions", href: "/terms" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Cookie Policy", href: "/cookies" },
    { title: "Disclaimer", href: "/disclaimer" }
  ];

  const popularDestinations = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
    "Pune", "Ahmedabad", "Jaipur", "Goa", "Kerala", "Agra"
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-orange-50 to-indigo-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Get the Best Travel Deals
            </h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter and never miss out on exclusive offers and travel tips
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img
                src="/images/Logo.png"
                alt="Make A Trip"
                className="h-12 mb-4"
              />
              <p className="text-gray-600 mb-4 leading-relaxed">
                Your trusted travel partner for booking flights, buses, trains, and hotels across India and beyond. 
                Experience seamless travel with our user-friendly platform and 24/7 customer support.
              </p>
              
              {/* Trust Badges */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                  <FaShieldAlt className="text-green-500 w-4 h-4" />
                  <span className="text-sm font-medium text-green-700">100% Secure</span>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full">
                  <FaAward className="text-orange-500 w-4 h-4" />
                  <span className="text-sm font-medium text-orange-700">Trusted by 10M+</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <FaPhone className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">+91-1234-567-890</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <FaEnvelope className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">support@makeatrip.com</span>
                </div>
                <div className="flex items-start gap-3 text-gray-600">
                  <FaMapMarkerAlt className="w-4 h-4 text-orange-500 mt-0.5" />
                  <span className="text-sm">123 Travel Street, Mumbai, Maharashtra 400001</span>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6">Our Services</h4>
            <div className="space-y-3">
              {services.map((service, index) => (
                <a
                  key={index}
                  href={service.href}
                  className="flex items-center gap-3 text-gray-600 hover:text-orange-600 transition-colors group"
                >
                  <div className="text-orange-500 group-hover:text-orange-600 transition-colors">
                    {service.icon}
                  </div>
                  <span className="text-sm">{service.title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6">Support</h4>
            <div className="space-y-3">
              {support.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="block text-sm text-gray-600 hover:text-orange-600 transition-colors"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-6">Company</h4>
            <div className="space-y-3">
              {company.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block text-sm text-gray-600 hover:text-orange-600 transition-colors"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-6 text-center">Popular Destinations</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularDestinations.map((destination, index) => (
              <a
                key={index}
                href={`/destinations/${destination.toLowerCase()}`}
                className="text-sm text-gray-600 hover:text-orange-600 transition-colors text-center py-2 px-3 rounded-lg hover:bg-orange-50"
              >
                {destination}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media, Mobile Apps, Payment Partners */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700 text-sm">Follow Us:</span>
              <div className="flex items-center gap-2">
                <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow hover:text-orange-600" aria-label="Facebook">
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow hover:text-orange-400" aria-label="Twitter">
                  <FaTwitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow hover:text-pink-600" aria-label="Instagram">
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow hover:text-orange-700" aria-label="LinkedIn">
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow hover:text-red-600" aria-label="YouTube">
                  <FaYoutube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Mobile Apps */}
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700 text-sm">Download Apps:</span>
              <div className="flex items-center gap-2">
                <a href="#" aria-label="Google Play Store">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Google Play"
                    className="h-8 hover:transform hover:scale-105 transition-transform"
                  />
                </a>
                <a href="#" aria-label="Apple App Store">
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="App Store"
                    className="h-8 hover:transform hover:scale-105 transition-transform"
                  />
                </a>
              </div>
            </div>

            {/* Payment Partners */}
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700 text-sm">We Accept:</span>
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 bg-orange-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MC</span>
                </div>
                <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">RP</span>
                </div>
                <div className="w-8 h-6 bg-gray-700 rounded flex items-center justify-center">
                  <FaCreditCard className="text-white w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-300 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2025 Make A Trip (India) Private Limited. All rights reserved.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              {legal.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="hover:text-orange-600 transition-colors"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              IATA Accredited Agent | ISO 27001:2013 Certified | PCI DSS Compliant | 24/7 Customer Support
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;