"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth-provider";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams, useRouter } from "next/navigation";
import { Room } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

// creating schema for searchRoom
const searchSchema = z.object({
  room_id: z.string().min(1, "Please select a room"),
  check_in: z.date({
    required_error: "Please select a check-in date",
    invalid_type_error: "Please select a valid date",
  }),
  check_out: z.date({
    required_error: "Please select a check-out date",
    invalid_type_error: "Please select a valid date",
  }),
  adults: z
    .string()
    .min(1, "At least one adult is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a valid number",
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 1 && val <= 4, {
      message: "Must be between 1 and 4 adults",
    }),
  children: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a valid number",
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 4, {
      message: "Must be between 0 and 4 children",
    })
    .default("0"),
  special_requests: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

// Mock room data - replace with your actual room data
const ROOM_OPTIONS = [
  { id: "room-1", name: "Oceanview Deluxe", capacity: 2 },
  { id: "room-2", name: "Royal Suite", capacity: 4 },
  { id: "room-3", name: "Garden Villa", capacity: 3 },
];

export default function BookNowPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roomOptions, setRoomOptions] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  // get the room detail's from URL
  const roomId = searchParams.get("room_id");
  const roomName = searchParams.get("room_name");
  const roomPrice = searchParams.get("room_price");
  const roomCapacity = searchParams.get("room_capacity");
  const roomImage = searchParams.get("room_image");

  //  validating and verify and setitng room details
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      room_id: roomId || "",
      adults: 1,
      children: 0,
      special_requests: "",
    },
  });
  //watchivg form input's
  const checkInDate = watch("check_in");
  const checkOutDate = watch("check_out");
  const adultsCount = watch("adults");
  const childrenCount = watch("children");
  const specialRequests = watch("special_requests");
  const selectedRoomId = watch("room_id");

  // Handle auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      setIsRedirecting(true);
      router.push("/login?redirect=/book-now");
    }
  }, [user, authLoading, router]);

  // Fetch all rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms");
        const data = await response.json();
        if (response.ok) {
          setRoomOptions(data.rooms);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load room options",
          variant: "destructive",
        });
      } finally {
        setIsLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  // Set default dates if not set
  useEffect(() => {
    if (!checkInDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setValue("check_in", tomorrow);
    }
    if (!checkOutDate && checkInDate) {
      const nextDay = new Date(checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setValue("check_out", nextDay);
    }
  }, [checkInDate, checkOutDate, setValue]);

  // Add this to handle pre-selecting the room
  useEffect(() => {
    if (roomId) {
      setValue("room_id", roomId);

      // Also set default capacity limits based on the selected room
      if (roomCapacity) {
        const capacity = parseInt(roomCapacity);
        setValue("adults", Math.min(1, capacity));
        setValue("children", 0);
      }
    }
  }, [roomId, roomCapacity, setValue]);

  // Handle form submission
  const onSubmit = async (data: SearchForm) => {
    try {
      setIsSubmitting(true);

      if (!user) {
        throw new Error("You must be logged in to make a booking");
      }

      if (data.check_in >= data.check_out) {
        throw new Error("Check-out date must be after check-in date");
      }

      const nights = Math.ceil(
        (data.check_out.getTime() - data.check_in.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (nights < 1) {
        throw new Error("Minimum stay is 1 night");
      }

      const selectedRoom = roomOptions.find((room) => room.id === data.room_id);
      if (!selectedRoom) {
        throw new Error("Please select a valid room");
      }

      if (data.adults + data.children > selectedRoom.capacity) {
        throw new Error(
          `Selected room can only accommodate ${selectedRoom.capacity} people`
        );
      }

      const params = new URLSearchParams({
        room_id: data.room_id,
        check_in: data.check_in.toISOString(),
        check_out: data.check_out.toISOString(),
        adults: data.adults.toString(),
        children: data.children.toString(),
        ...(data.special_requests && {
          special_requests: data.special_requests,
        }),
      });

      router.push(`/rooms/availability?${params.toString()}`);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form handler
  const handleReset = () => {
    reset({
      room_id: roomId || "",
      adults: 1,
      children: 0,
      special_requests: "",
    });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setValue("check_in", tomorrow);
    setValue("check_out", new Date(tomorrow.getTime() + 86400000)); // +1 day
  };

  if (authLoading || isRedirecting) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-4 text-sm">
              {authLoading
                ? "Loading user session..."
                : "Redirecting to login..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-64">
            <p className="text-sm">You need to be logged in to book a room.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Book Your Stay
        </h1>

        <div className="max-w-4xl mx-auto bg-card p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Room Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Type</label>
              {isLoadingRooms ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Controller
                  name="room_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingRooms}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomOptions.map((room) => (
                          <SelectItem
                            key={room.id}
                            value={room.id}
                            disabled={
                              adultsCount + childrenCount > room.capacity
                            }
                          >
                            {room.name} (Max {room.capacity}{" "}
                            {room.capacity === 1 ? "person" : "people"})
                            {room.price && ` - $${room.price.toFixed(2)}/night`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
              {errors.room_id && (
                <p className="text-red-500 text-sm">{errors.room_id.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Check-in Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Check In</label>
                <Controller
                  name="check_in"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      className="rounded-md border"
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                        date >
                          new Date(
                            new Date().setFullYear(new Date().getFullYear() + 1)
                          )
                      }
                      initialFocus
                    />
                  )}
                />
                {errors.check_in && (
                  <p className="text-red-500 text-sm">
                    {errors.check_in.message}
                  </p>
                )}
              </div>

              {/* Check-out Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Check Out</label>
                <Controller
                  name="check_out"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      className="rounded-md border"
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                        (checkInDate && date <= checkInDate) ||
                        date >
                          new Date(
                            new Date().setFullYear(new Date().getFullYear() + 1)
                          )
                      }
                      initialFocus
                    />
                  )}
                />
                {errors.check_out && (
                  <p className="text-red-500 text-sm">
                    {errors.check_out.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Adults */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Adults</label>
                <Controller
                  name="adults"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select adults" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map((num) => (
                          <SelectItem
                            key={`adult-${num}`}
                            value={num.toString()}
                          >
                            {num} {num === 1 ? "Adult" : "Adults"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.adults && (
                  <p className="text-red-500 text-sm">
                    {errors.adults.message}
                  </p>
                )}
              </div>

              {/* Children */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Children</label>
                <Controller
                  name="children"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select children" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4].map((num) => (
                          <SelectItem
                            key={`child-${num}`}
                            value={num.toString()}
                          >
                            {num} {num === 1 ? "Child" : "Children"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.children && (
                  <p className="text-red-500 text-sm">
                    {errors.children.message}
                  </p>
                )}
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Special Requests (Optional)
              </label>
              <Controller
                name="special_requests"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Any special requests or preferences?"
                    className="min-h-[100px]"
                  />
                )}
              />
              <p className="text-xs text-muted-foreground">
                Please let us know if you have any special requirements
                (dietary, accessibility, etc.)
              </p>
            </div>

            {/* Summary */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="font-medium">
                    {selectedRoomId
                      ? roomOptions.find((r) => r.id === selectedRoomId)
                          ?.name || "Not selected"
                      : "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="font-medium">
                    {checkInDate?.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }) || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="font-medium">
                    {checkOutDate?.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }) || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nights</p>
                  <p className="font-medium">
                    {checkInDate && checkOutDate
                      ? Math.ceil(
                          (checkOutDate.getTime() - checkInDate.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : "0"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Guests</p>
                  <p className="font-medium">
                    {adultsCount} {adultsCount === 1 ? "Adult" : "Adults"}
                    {childrenCount > 0 &&
                      `, ${childrenCount} ${
                        childrenCount === 1 ? "Child" : "Children"
                      }`}
                  </p>
                </div>
                {specialRequests && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">
                      Special Requests
                    </p>
                    <p className="font-medium line-clamp-2">
                      {specialRequests}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isLoadingRooms}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching Availability...
                  </>
                ) : (
                  "Check For Availability"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="max-w-4xl mx-auto mt-8 text-sm text-muted-foreground">
          <h3 className="font-medium mb-2">Need help with your booking?</h3>
          <p>
            Contact our reservations team at{" "}
            <a
              href="mailto:reservations@example.com"
              className="text-primary underline"
            >
              reservations@example.com
            </a>{" "}
            or call{" "}
            <a href="tel:+9771234567890" className="text-primary underline">
              +977-1234567890
            </a>
            .
          </p>
          <p className="mt-2">
            Our front desk is available 24/7 to assist you with any special
            requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
