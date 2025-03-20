"use client";

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">MariBella</h3>
            <p className="text-muted-foreground mb-4">
              Experience unparalleled luxury at MariBella Hotel & Resort, where every moment is crafted for your comfort and pleasure.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Services', 'Rooms', 'Blog', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {[
                'Luxury Accommodation',
                'Fine Dining',
                'Spa & Wellness',
                'Events & Meetings',
                'Concierge Service'
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="text-primary" size={20} />
                <span className="text-muted-foreground">123 Luxury Avenue, Paradise City</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-primary" size={20} />
                <span className="text-muted-foreground">+1 (234) 567-8900</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-primary" size={20} />
                <span className="text-muted-foreground">contact@maribella.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} MariBella. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}