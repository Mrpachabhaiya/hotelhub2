"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wine, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Utensils,
  Space as Spa,
  School as Pool,
  Dumbbell,
  Car,
  Wifi,
} from "lucide-react";
import { Trophy, Tent as Tennis } from "lucide-react";
// import { Button } from "react-day-picker";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const dinepageRef = useRef<HTMLDivElement>(null);
  const sportspageRef = useRef<HTMLDivElement>(null);
  //  services animations
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
  // dine animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dine-page-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2,
      });

      gsap.from(".restaurant-card", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".restaurants-grid",
          start: "top 80%",
          end: "bottom center",
          toggleActions: "play none none reverse",
        },
      });
    }, dinepageRef);

    return () => ctx.revert();
  }, []);

  // sports animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".sport-page-title", {
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
    }, sportspageRef);

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
  const restaurants = [
    {
      icon: Utensils,
      title: "The Grand Restaurant",
      description: "Experience fine dining with panoramic ocean views",
      cuisine: "International",
      hours: "7:00 AM - 11:00 PM",
    },
    {
      icon: Wine,
      title: "Azure Lounge",
      description: "Sophisticated bar with premium spirits and cocktails",
      cuisine: "Tapas & Drinks",
      hours: "4:00 PM - 1:00 AM",
    },
    {
      icon: Coffee,
      title: "Café Breeze",
      description: "Casual café serving light meals and pastries",
      cuisine: "Café & Bakery",
      hours: "6:00 AM - 8:00 PM",
    },
  ];
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
      <div>
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
      <div>
        <div ref={dinepageRef} className="min-h-screen bg-background pt-24">
          <div className="container mx-auto px-4">
            <h1 className="dine-page-title text-4xl md:text-5xl font-bold text-center mb-12">
              Dining Experience
            </h1>

            <div className="restaurants-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.map((restaurant, index) => (
                <div
                  key={index}
                  className="restaurant-card bg-card p-6 rounded-lg shadow-lg"
                >
                  <restaurant.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {restaurant.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {restaurant.description}
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Cuisine:</strong> {restaurant.cuisine}
                    </p>
                    <p className="text-sm">
                      <strong>Hours:</strong> {restaurant.hours}
                    </p>
                  </div>
                  <Button variant="outline" className="mt-4">
                    Reserve a Table
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div ref={sportspageRef} className="min-h-screen bg-background pt-24">
          <div className="container mx-auto px-4">
            <h1 className="sport-page-title text-4xl md:text-5xl font-bold text-center mb-12">
              Sports & Recreation
            </h1>

            <div className="facilities-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {facilities.map((facility, index) => (
                <div
                  key={index}
                  className="facility-card bg-card p-6 rounded-lg shadow-lg"
                >
                  <facility.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {facility.title}
                  </h3>
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
      </div>
    </div>
  );
}
