"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Utensils, Wine, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function DinePage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.page-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2
      });

      gsap.from('.restaurant-card', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.restaurants-grid',
          start: 'top 80%',
          end: 'bottom center',
          toggleActions: 'play none none reverse'
        }
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const restaurants = [
    {
      icon: Utensils,
      title: "The Grand Restaurant",
      description: "Experience fine dining with panoramic ocean views",
      cuisine: "International",
      hours: "7:00 AM - 11:00 PM"
    },
    {
      icon: Wine,
      title: "Azure Lounge",
      description: "Sophisticated bar with premium spirits and cocktails",
      cuisine: "Tapas & Drinks",
      hours: "4:00 PM - 1:00 AM"
    },
    {
      icon: Coffee,
      title: "Café Breeze",
      description: "Casual café serving light meals and pastries",
      cuisine: "Café & Bakery",
      hours: "6:00 AM - 8:00 PM"
    }
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4">
        <h1 className="page-title text-4xl md:text-5xl font-bold text-center mb-12">Dining Experience</h1>
        
        <div className="restaurants-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant, index) => (
            <div key={index} className="restaurant-card bg-card p-6 rounded-lg shadow-lg">
              <restaurant.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{restaurant.title}</h3>
              <p className="text-muted-foreground mb-4">{restaurant.description}</p>
              <div className="space-y-2">
                <p className="text-sm"><strong>Cuisine:</strong> {restaurant.cuisine}</p>
                <p className="text-sm"><strong>Hours:</strong> {restaurant.hours}</p>
              </div>
              <Button variant="outline" className="mt-4">Reserve a Table</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}