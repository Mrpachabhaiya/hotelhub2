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
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import { Loader2 } from "lucide-react";

const bookingSchema = z.object({
  room_id: z.string().min(1, "Please select a room"),
  check_in: z.date({
    required_error: "Please select a check-in date",
    invalid_type_error: "Please select a valid date",
  }),
  check_out: z.date({
    required_error: "Please select a check-out date",
    invalid_type_error: "Please select a valid date",
  }),
  adults: z.string().min(1).refine(val => !isNaN(Number(val)), {
    message: "Expected number, received a string"
  }).transform(val => Number(val)),
  children: z.string().min(0).refine(val => !isNaN(Number(val)), {
    message: "Expected number, received a string"
  }).transform(val => Number(val)),
  special_requests: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

export default function BookNowPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      adults: 1,
      children: 0,
    },
  });

  // Handle auth redirect
  useEffect(() => {
    if (!loading && !user) {
      setIsRedirecting(true);
      router.push("/login");
    }
  }, [user, loading, router]);

  const checkInDate = watch("check_in");
  const checkOutDate = watch("check_out");

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

  const onSubmit = async (data: BookingForm) => {
    try {
      if (!user) {
        throw new Error("You must be logged in to make a booking");
      }

      if (data.check_in >= data.check_out) {
        throw new Error("Check-out date must be after check-in date");
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_id: data.room_id,
          check_in: data.check_in.toISOString(),
          check_out: data.check_out.toISOString(),
          adults: Number(data.adults),
          children: Number(data.children),
          special_requests: data.special_requests
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Booking failed');
      }

      toast({
        title: "Booking Successful",
        description: "We'll send you a confirmation email shortly.",
      });

      router.push("/bookings");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-4 text-sm">
              {loading ? "Loading user session..." : "Redirecting to login..."}
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

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  )}
                />
                {errors.check_in && (
                  <p className="text-red-500 text-sm">{errors.check_in.message}</p>
                )}
              </div>

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
                        date < new Date() || 
                        (checkInDate && date <= checkInDate)
                      }
                      initialFocus
                    />
                  )}
                />
                {errors.check_out && (
                  <p className="text-red-500 text-sm">{errors.check_out.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Type</label>
                <Controller
                  name="room_id"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Room Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="room-1">Oceanview Deluxe</SelectItem>
                        <SelectItem value="room-2">Royal Suite</SelectItem>
                        <SelectItem value="room-3">Garden Villa</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.room_id && (
                  <p className="text-red-500 text-sm">{errors.room_id.message}</p>
                )}
              </div>

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
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Adult" : "Adults"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.adults && (
                  <p className="text-red-500 text-sm">{errors.adults.message}</p>
                )}
              </div>
            </div>

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
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Child" : "Children"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.children && (
                <p className="text-red-500 text-sm">{errors.children.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Special Requests</label>
              <Controller
                name="special_requests"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Any special requests or preferences?"
                    rows={3}
                  />
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}