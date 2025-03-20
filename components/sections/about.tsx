"use client";

import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useGSAP } from "@gsap/react"; // Import useGSAP hook
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);

  // GSAP animation for left content
  useGSAP(() => {
    if (inView && leftContentRef.current) {
      gsap.fromTo(
        leftContentRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8 }
      );
    }
  }, [inView]);

  // GSAP animation for right content
  useGSAP(() => {
    if (inView && rightContentRef.current) {
      gsap.fromTo(
        rightContentRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.8 }
      );
    }
  }, [inView]);

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-background" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div ref={leftContentRef} className="space-y-4 md:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Your Gateway to Comfort, Luxury, and Unmatched World-Class
              Hospitality
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Immersing our guests in extraordinary experiences that combine
              luxury living with authentic local culture. Our commitment to
              exceptional service ensures every stay becomes a cherished memory.
            </p>
            <Button variant="secondary" size="lg" className="mt-4 md:mt-6">
              More About Us
            </Button>
          </div>

          {/* Right Content */}
          <div ref={rightContentRef} className="relative">
            <img
              src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
              alt="Luxury Hotel Interior"
              className="rounded-lg shadow-2xl w-full h-auto"
            />
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-primary p-4 md:p-6 rounded-lg shadow-xl">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground">
                6K+
              </div>
              <div className="text-xs md:text-sm text-primary-foreground/80">
                Happy Guests
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
