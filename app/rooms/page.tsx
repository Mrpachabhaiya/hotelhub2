"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";

export default function RoomsPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2,
      });

      gsap.from(".room-card", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.5,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-background pt-20 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="page-title text-4xl md:text-5xl font-bold text-center mb-12">
          Our Luxurious Rooms
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Oceanview Deluxe",
              image:
                "https://images.unsplash.com/photo-1590490359683-658d3d23f972",
              price: "$299",
              description: "Experience luxury with stunning ocean views",
            },
            {
              title: "Royal Suite",
              image:
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
              price: "$499",
              description: "Our most prestigious accommodation",
            },
            {
              title: "Garden Villa",
              image:
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
              price: "$399",
              description: "Peaceful retreat surrounded by nature",
            },
          ].map((room, index) => (
            <div
              key={index}
              className="room-card bg-card rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative h-64">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{room.title}</h3>
                <p className="text-muted-foreground mb-4">{room.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary text-xl font-bold">
                    {room.price}/night
                  </span>
                  <Button variant="outline">Book Now</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
