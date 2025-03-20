"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Playfair_Display } from "next/font/google";
import { gsap } from "gsap";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/rooms", label: "ROOMS" },
    { href: "/services", label: "SERVICES" },
    { href: "/dine", label: "DINE" },
    { href: "/sports", label: "SPORTS" },
    { href: "/blog", label: "BLOG" },
    { href: "/contact", label: "CONTACT" },
  ];

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-300 py-6",
        isScrolled ? "bg-[#283618] backdrop-blur-sm" : ""
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`text-2xl font-bold text-white ${playfair.className}`}
          >
            Hotelhub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-item text-sm text-white hover:text-primary transition-colors tracking-wider"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/book-now">
              <Button
                size="lg"
                variant="outline"
                className="nav-item border-white text-white hover:bg-white hover:text-[#283618] transition-colors tracking-wider"
              >
                BOOK NOW
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-[#283618]/95 backdrop-blur-sm mt-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-white hover:text-primary transition-colors tracking-wider"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/book-now" onClick={() => setIsOpen(false)}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white hover:text-[#283618] transition-colors tracking-wider"
                >
                  BOOK NOW
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
