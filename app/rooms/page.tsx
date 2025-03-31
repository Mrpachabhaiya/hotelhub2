"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Room } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function RoomsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms");
        const data = await response.json();
        if (response.ok) {
          setRooms(data.rooms);
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);
  useEffect(() => {
    if (rooms.length > 0 && !isLoading) {
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
    }
  }, [rooms, isLoading]);

  // Skeleton loader component
  const RoomCardSkeleton = () => (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg">
      <Skeleton className="h-64 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex justify-between items-center pt-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );

  return (
    <div ref={pageRef} className="min-h-screen bg-background pt-20 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="page-title text-4xl md:text-5xl font-bold text-center mb-12">
          Our Luxurious Rooms
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <RoomCardSkeleton key={index} />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg">No rooms available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="room-card bg-card rounded-lg overflow-hidden shadow-lg"
              >
                <Link href={`/rooms/${room.name}`} className="h-full w-full">
                  <div className="relative h-64">
                    <img
                      src={room.image || "/images/room-placeholder.jpg"}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                    <p className="text-muted-foreground mb-4">
                      {room.description || "No description available"}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary text-xl font-bold">
                        ${room.price.toFixed(2)}/night
                      </span>
                      <Link
                        href={{
                          pathname: "/book-now",
                          query: {
                            room_id: room.id,
                            room_name: room.name,
                            room_price: room.price,
                            room_capacity: room.capacity,
                          },
                        }}
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
