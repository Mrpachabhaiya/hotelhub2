"use client";

import { useRef } from "react";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import FeaturedRooms from "@/components/sections/featured-rooms";
import WhyChooseUs from "@/components/sections/why-choose-us";
import Services from "@/components/sections/services";
import Testimonials from "@/components/sections/testimonials";
import Awards from "@/components/sections/awards";
import { useGsap } from "@/hooks/useGsap";

export default function Home() {
  // Create refs for each section
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const roomsRef = useRef<HTMLDivElement>(null);
  const whyChooseUsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const awardsRef = useRef<HTMLDivElement>(null);

  // Initialize GSAP animations
  useGsap({
    animationRefs: {
      hero: heroRef,
      about: aboutRef,
      rooms: roomsRef,
      whyChooseUs: whyChooseUsRef,
      services: servicesRef,
      testimonials: testimonialsRef,
      awards: awardsRef,
    },
  });

  return (
    <div>
      <div ref={heroRef}>
        <Hero />
      </div>
      <div ref={aboutRef}>
        <About />
      </div>
      <div ref={roomsRef}>
        <FeaturedRooms />
      </div>
      <div ref={whyChooseUsRef}>
        <WhyChooseUs />
      </div>
      <div ref={servicesRef}>
        <Services />
      </div>
      <div ref={testimonialsRef}>
        <Testimonials />
      </div>
      <div ref={awardsRef}>
        <Awards />
      </div>
    </div>
  );
}
