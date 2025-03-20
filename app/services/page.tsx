"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Utensils,
  Space as Spa,
  School as Pool,
  Dumbbell,
  Car,
  Wifi,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2,
      });

      gsap.from(".service-card", {
        y: 30,
        duration: 0.8,
        stagger: 0.2,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const services = [
    {
      icon: Utensils,
      title: "Fine Dining",
      description: "Experience culinary excellence with our world-class chefs",
    },
    {
      icon: Spa,
      title: "Luxury Spa",
      description: "Rejuvenate your body and mind in our premium spa",
    },
    {
      icon: Pool,
      title: "Infinity Pool",
      description: "Swim in our stunning infinity pool with ocean views",
    },
    {
      icon: Dumbbell,
      title: "Fitness Center",
      description: "Stay fit with state-of-the-art equipment",
    },
    {
      icon: Car,
      title: "Valet Parking",
      description: "Complimentary valet service for all guests",
    },
    {
      icon: Wifi,
      title: "High-Speed WiFi",
      description: "Stay connected with premium internet access",
    },
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="page-title text-4xl md:text-5xl font-bold text-center mb-12">
          Our Premium Services
        </h1>

        <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card bg-card p-6 rounded-lg shadow-lg"
            >
              <service.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
