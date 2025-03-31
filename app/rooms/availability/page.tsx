"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Room } from "@/lib/types";

export default function AvailabilityPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [availability, setAvailability] = useState<{
    isAvailable: boolean;
    requestedRoom: Room | null;
    availableAlternatives: Room[];
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const roomId = searchParams.get("room_id");
  const checkIn = searchParams.get("check_in");
  const checkOut = searchParams.get("check_out");
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");
  const specialRequests = searchParams.get("special_requests");

  useEffect(() => {
    if (!checkIn || !checkOut || !adults || !roomId) {
      toast({
        title: "Missing parameters",
        description: "Please provide all search parameters",
        variant: "destructive",
      });
      router.push("/book-now");
      return;
    }

    const fetchAvailability = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          room_id: roomId,
          check_in: checkIn,
          check_out: checkOut,
          adults: adults,
          children: children || "0",
        });

        const response = await fetch(
          `/api/rooms/availability?${params.toString()}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to check availability");
        }

        setAvailability(data);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to check availability",
          variant: "destructive",
        });
        router.push("/book-now");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [checkIn, checkOut, adults, children, roomId, router, toast]);

  const handleBookNow = (roomId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to book a room",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    setSelectedRoom(roomId);

    // Create URLSearchParams object
    const params = new URLSearchParams();

    // Add required parameters
    params.set("room_id", roomId);
    params.set("check_in", checkIn || "");
    params.set("check_out", checkOut || "");
    params.set("adults", adults || "1");
    params.set("children", children || "0");

    // Add special requests if they exist
    if (specialRequests) {
      params.set("special_requests", specialRequests);
    }

    // Navigate to checkout page with all parameters
    router.push(`/checkout?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-4 text-sm">Checking room availability...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!availability) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-lg">
              Unable to check availability at this time.
            </p>
            <Button className="mt-4" onClick={() => router.push("/book-now")}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Room Availability</h1>

        <div className="mb-8 bg-card p-4 rounded-lg">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>
                {new Date(availability.checkIn).toLocaleDateString()} -{" "}
                {new Date(availability.checkOut).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>
                {availability.adults}{" "}
                {availability.adults === 1 ? "Adult" : "Adults"}
                {availability.children > 0 &&
                  `, ${availability.children} ${
                    availability.children === 1 ? "Child" : "Children"
                  }`}
              </span>
            </div>
          </div>
        </div>

        {/* Requested Room Availability */}
        {availability.requestedRoom && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              {availability.isAvailable ? "Available Rooms" : "Not Available"}
            </h2>
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <div className="md:col-span-1">
                  {availability.requestedRoom.image && (
                    <div className="relative h-48 w-full">
                      <img
                        src={availability.requestedRoom.image}
                        alt={availability.requestedRoom.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {availability.requestedRoom.name}
                    </h3>
                    <p className="text-gray-600">
                      {availability.requestedRoom.description}
                    </p>
                    <p className="text-lg font-semibold mt-2">
                      ${availability.requestedRoom.price.toFixed(2)} per night
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p>
                        {availability.requestedRoom.capacity}{" "}
                        {availability.requestedRoom.capacity === 1
                          ? "Person"
                          : "People"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() =>
                        handleBookNow(availability.requestedRoom!.id)
                      }
                      disabled={
                        !availability.isAvailable ||
                        selectedRoom === availability.requestedRoom.id
                      }
                    >
                      {selectedRoom === availability.requestedRoom.id
                        ? "Processing..."
                        : availability.isAvailable
                        ? "Book Now"
                        : "Not Available"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alternative Rooms */}
        {availability.availableAlternatives.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Alternative Rooms Available
            </h2>
            <div className="grid gap-6">
              {availability.availableAlternatives.map((room) => (
                <div
                  key={room.id}
                  className="border rounded-lg overflow-hidden shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                    <div className="md:col-span-1">
                      {room.image && (
                        <div className="relative h-48 w-full">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold">{room.name}</h3>
                        <p className="text-gray-600">{room.description}</p>
                        <p className="text-lg font-semibold mt-2">
                          ${room.price.toFixed(2)} per night
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium">Capacity</p>
                          <p>
                            {room.capacity}{" "}
                            {room.capacity === 1 ? "Person" : "People"}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleBookNow(room.id)}
                          disabled={selectedRoom === room.id}
                        >
                          {selectedRoom === room.id
                            ? "Processing..."
                            : "Book Now"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!availability.isAvailable &&
          availability.availableAlternatives.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg">
                No rooms available for the selected dates. Please try different
                dates.
              </p>
              <Button className="mt-4" onClick={() => router.push("/book-now")}>
                Try Different Dates
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}
