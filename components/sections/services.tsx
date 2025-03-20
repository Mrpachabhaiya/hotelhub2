"use client";

import { useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import {
  Utensils,
  Space as Spa,
  School as Pool,
  Dumbbell,
  Car,
  Wifi,
  Phone,
  Coffee,
} from "lucide-react";
import { gsap } from "gsap";

const services = [
  {
    icon: Utensils,
    title: "Hotel Restaurant",
    description:
      "Experience fine dining with our world-class chefs and exquisite menu selections.",
    link: "#",
  },
  {
    icon: Spa,
    title: "Spa & Wellness",
    description:
      "Rejuvenate your body and mind with our premium spa treatments and facilities.",
    link: "#",
  },
  {
    icon: Pool,
    title: "Swimming Pool",
    description:
      "Take a refreshing dip in our temperature-controlled infinity pool with ocean views.",
    link: "#",
  },
  {
    icon: Dumbbell,
    title: "Fitness Center",
    description:
      "Stay fit with state-of-the-art equipment and professional trainers.",
    link: "#",
  },
  {
    icon: Car,
    title: "Transportation",
    description:
      "Convenient airport transfers and luxury car services available.",
    link: "#",
  },
  {
    icon: Wifi,
    title: "High-Speed WiFi",
    description:
      "Stay connected with complimentary high-speed internet throughout the property.",
    link: "#",
  },
  {
    icon: Phone,
    title: "24/7 Room Service",
    description:
      "Round-the-clock in-room dining and concierge services at your disposal.",
    link: "#",
  },
  {
    icon: Coffee,
    title: "Executive Lounge",
    description:
      "Exclusive access to our premium lounge with complimentary refreshments.",
    link: "#",
  },
];

export default function Services() {
  // const [ref, inView] = useInView({
  //   triggerOnce: true,
  //   threshold: 0.1,
  // });

  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // GSAP Animations
  useEffect(() => {
    // if (sectionRef.current) {
    //   // Animate cards from negative Y-axis
    //   gsap.from(cardRefs.current, {
    //     y: 50,
    //     stagger: 0.2,
    //     duration: 1,
    //     ease: "power3.out",
    //   });
    // Animate icons, text, and contents inside the cards
    // cardRefs.current.forEach((card, index) => {
    //   if (card) {
    //     const icon = card.querySelector(".service-icon");
    //     const title = card.querySelector(".service-title");
    //     const description = card.querySelector(".service-description");
    //     const button = card.querySelector(".service-button");
    //     gsap.from([icon, title, description, button], {
    //       opacity: 0,
    //       y: 20,
    //       stagger: 0.1,
    //       duration: 0.8,
    //       delay: index * 0.2 + 0.5, // Delay based on card index
    //       ease: "power3.out",
    //     });
    //   }
    // });
    // }
  }, []);

  return (
    <section className="py-24 bg-background" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="mb-4">Enhancing Your Stay With Exclusive Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our comprehensive range of amenities and services designed
            to make your stay exceptional and memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              // ref={(el) => (cardRefs.current[index] = el)}
              className="service-card p-6 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg"
            >
              <service.icon className="h-10 w-10 text-primary mb-4 service-icon" />
              <h3 className="text-xl font-semibold mb-3 service-title">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 service-description">
                {service.description}
              </p>
              <Button
                variant="link"
                className="text-primary p-0 service-button"
              >
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
