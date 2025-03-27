"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Playfair_Display } from "next/font/google";
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {user ,initialLoad , loading, logout} = useAuth()
  const router = useRouter()
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
            {initialLoad ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback>
                          {user.fullName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={() => router.push(`/users/${user.id}/profile`)}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/bookings")}>
                      Bookings
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                    onClick={logout}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) :  (
              <Link
                href="/login"
                className="nav-item text-sm text-white hover:text-primary transition-colors tracking-wider"
              >
                LOGIN
              </Link>
            )}
        
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
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
              {initialLoad ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.fullName || undefined} />
                        <AvatarFallback>
                          {user.fullName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={() => {router.push(`/users/${user.id}/profile`),
                  setIsOpen(false)}}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {router.push("/bookings"),
                      setIsOpen(false)
                    }}>
                      Bookings
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                    onClick={() => { logout(),setIsOpen(false)}}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) :  (
              <Link
                href="/login"
                className="block px-3 py-2 text-white hover:text-primary transition-colors tracking-wider"
                onClick={() => setIsOpen(false)}
              >
                LOGIN
              </Link>
            ) }
        
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
