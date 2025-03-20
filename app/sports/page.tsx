"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Dumbbell, School as Pool, Trophy, Tent as Tennis } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export default function SportsPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2,
      });

      gsap.from(".facility-card", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".facilities-grid",
          start: "top 80%",
          end: "bottom center",
          toggleActions: "play none none reverse",
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const facilities = [
    {
      icon: Dumbbell,
      title: "Fitness Center",
      description: "State-of-the-art equipment and personal trainers",
      hours: "24/7 Access",
      features: ["Modern Equipment", "Personal Training", "Yoga Studio"],
    },
    {
      icon: Pool,
      title: "Swimming Pool",
      description: "Olympic-sized pool with dedicated lanes",
      hours: "6:00 AM - 10:00 PM",
      features: ["Heated Pool", "Swimming Lessons", "Aqua Fitness"],
    },
    {
      icon: Tennis,
      title: "Tennis Courts",
      description: "Professional-grade courts with coaching",
      hours: "7:00 AM - 9:00 PM",
      features: ["4 Courts", "Equipment Rental", "Private Lessons"],
    },
    {
      icon: Trophy,
      title: "Sports Complex",
      description: "Multi-purpose sports facility",
      hours: "8:00 AM - 8:00 PM",
      features: ["Basketball", "Volleyball", "Badminton"],
    },
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="page-title text-4xl md:text-5xl font-bold text-center mb-12">
          Sports & Recreation
        </h1>

        <div className="facilities-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="facility-card bg-card p-6 rounded-lg shadow-lg"
            >
              <facility.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{facility.title}</h3>
              <p className="text-muted-foreground mb-4">
                {facility.description}
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Hours:</strong> {facility.hours}
                </p>
                <div className="mt-4">
                  <strong className="text-sm">Features:</strong>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                    {facility.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <Button variant="outline" className="mt-4">
                Book Session
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
