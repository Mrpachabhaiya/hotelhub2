"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Users, Bath, Coffee, Wifi, Tv } from 'lucide-react';

const roomDetails = {
  "oceanview-deluxe": {
    title: "Oceanview Deluxe",
    image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972",
    price: "$299",
    description: "Experience luxury with stunning ocean views. Our Oceanview Deluxe rooms offer breathtaking vistas of the Pacific, combined with premium amenities and elegant design.",
    amenities: [
      { icon: Users, label: "Up to 2 Guests" },
      { icon: Bath, label: "Luxury Bathroom" },
      { icon: Coffee, label: "Mini Bar" },
      { icon: Wifi, label: "High-Speed WiFi" },
      { icon: Tv, label: "Smart TV" },
      { icon: Calendar, label: "24/7 Room Service" }
    ],
    size: "45 sq m",
    bed: "King Size",
    occupancy: "2 Adults, 1 Child"
  },
  "royal-suite": {
    title: "Royal Suite",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
    price: "$499",
    description: "Our most prestigious accommodation offering unparalleled luxury. The Royal Suite provides an exclusive experience with personalized service and premium amenities.",
    amenities: [
      { icon: Users, label: "Up to 4 Guests" },
      { icon: Bath, label: "Jacuzzi" },
      { icon: Coffee, label: "Full Bar" },
      { icon: Wifi, label: "High-Speed WiFi" },
      { icon: Tv, label: "65\" Smart TV" },
      { icon: Calendar, label: "Butler Service" }
    ],
    size: "90 sq m",
    bed: "King Size + Sofa Bed",
    occupancy: "4 Adults, 2 Children"
  },
  "garden-villa": {
    title: "Garden Villa",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    price: "$399",
    description: "A peaceful retreat surrounded by lush tropical gardens. The Garden Villa offers privacy and tranquility with direct access to our beautiful gardens.",
    amenities: [
      { icon: Users, label: "Up to 3 Guests" },
      { icon: Bath, label: "Outdoor Shower" },
      { icon: Coffee, label: "Kitchenette" },
      { icon: Wifi, label: "High-Speed WiFi" },
      { icon: Tv, label: "Smart TV" },
      { icon: Calendar, label: "Private Garden" }
    ],
    size: "65 sq m",
    bed: "King Size",
    occupancy: "3 Adults, 1 Child"
  }
};

export default function RoomDetail({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const room = roomDetails[params.id as keyof typeof roomDetails];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4">
          <Skeleton className="h-[400px] w-full rounded-lg mb-8" />
          <Skeleton className="h-12 w-1/3 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Room Not Found</h1>
          <p className="text-muted-foreground mb-8">The requested room could not be found.</p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4">
        <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
          <img
            src={room.image}
            alt={room.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-2">{room.title}</h1>
            <p className="text-2xl text-primary font-semibold mb-6">{room.price} <span className="text-sm text-muted-foreground">per night</span></p>
            <p className="text-muted-foreground mb-8">{room.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {room.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <amenity.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm">{amenity.label}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-card p-4 rounded-lg">
                <h3 className="font-semibold mb-1">Room Size</h3>
                <p className="text-muted-foreground">{room.size}</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <h3 className="font-semibold mb-1">Bed Type</h3>
                <p className="text-muted-foreground">{room.bed}</p>
              </div>
              <div className="bg-card p-4 rounded-lg">
                <h3 className="font-semibold mb-1">Occupancy</h3>
                <p className="text-muted-foreground">{room.occupancy}</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-lg h-fit">
            <h2 className="text-2xl font-semibold mb-6">Book This Room</h2>
            <Button className="w-full" size="lg">
              Check Availability
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}