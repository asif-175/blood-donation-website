import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-white font-bold text-lg">LifeLink</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Connecting blood donors with patients in emergency. Every donation saves up to 3 lives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/home" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Become a Donor</Link></li>
              <li><Link to="/request" className="hover:text-white transition-colors">Request Blood</Link></li>
              <li><Link to="/donors" className="hover:text-white transition-colors">Find Donors</Link></li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">More</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/feedback" className="hover:text-white transition-colors">Feedback</Link></li>
              <li><Link to="/alerts" className="hover:text-white transition-colors">Alerts</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-400 shrink-0" />
                <span>1800-LIFELINK</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-red-400 shrink-0" />
                <span>help@lifelink.in</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>Available across India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <span>© 2024 LifeLink. All rights reserved. Saving lives, one donation at a time.</span>
          <span className="mt-2 md:mt-0">Built with ❤️ to serve humanity</span>
        </div>
      </div>
    </footer>
  );
}