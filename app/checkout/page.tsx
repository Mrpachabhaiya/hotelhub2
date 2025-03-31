"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, Smartphone } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Room } from "@/lib/types";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get all parameters safely
  const roomId = searchParams.get("room_id");
  const checkIn = searchParams.get("check_in");
  const checkOut = searchParams.get("check_out");
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");
  const specialRequests = searchParams.get("special_requests");

  useEffect(() => {
    if (!roomId || !checkIn || !checkOut || !adults) {
      toast({
        title: "Missing parameters",
        description: "Please provide all booking parameters",
        variant: "destructive",
      });
      router.push("/book-now");
      return;
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate.getTime())) {
      toast({
        title: "Invalid check-in date",
        description: "Please select a valid check-in date",
        variant: "destructive",
      });
      router.push("/book-now");
      return;
    }

    if (isNaN(checkOutDate.getTime())) {
      toast({
        title: "Invalid check-out date",
        description: "Please select a valid check-out date",
        variant: "destructive",
      });
      router.push("/book-now");
      return;
    }

    const fetchRoomDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/rooms/${roomId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch room details");
        }

        if (!data.room) {
          throw new Error("Room not found");
        }

        setRoom(data.room);
      } catch (error) {
        console.error("Error fetching room details:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load room details",
          variant: "destructive",
        });
        router.push("/book-now");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId, checkIn, checkOut, adults, router, toast]);

  const handlePayment = async (method: string) => {
    if (!user || !room) return;

    setIsProcessing(true);
    setSelectedMethod(method);

    try {
      // 1. Create booking record
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: roomId,
          check_in: checkIn,
          check_out: checkOut,
          adults: adults,
          children: children || 0,
          special_requests: specialRequests,
          status: "PENDING",
        }),
      });

      const bookingData = await bookingResponse.json();
      if (!bookingResponse.ok)
        throw new Error(bookingData.error || "Booking creation failed");

      // 2. Calculate total amount
      const checkInDate = new Date(checkIn!);
      const checkOutDate = new Date(checkOut!);
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const totalAmount = nights * room.price;

      // 3. Initiate payment
      const paymentResponse = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: method.toLowerCase(),
          amount: totalAmount.toString(),
          productName: `Booking for ${room.name}`,
          transactionId: `BOOKING-${bookingData.booking.id}`,
        }),
      });

      const paymentData = await paymentResponse.json();
      if (!paymentResponse.ok)
        throw new Error(paymentData.error || "Payment initiation failed");

      // 4. Handle payment gateway specific flows
      if (method.toLowerCase() === "esewa") {
        // Create hidden form for Esewa
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        Object.entries(paymentData.esewaConfig).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else if (method.toLowerCase() === "khalti") {
        // Redirect to Khalti
        window.location.href = paymentData.khaltiPaymentUrl;
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Payment processing failed",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedMethod(null);
    }
  };
  if (isLoading || !room) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-4 text-sm">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total amount
  const checkInDate = new Date(checkIn!);
  const checkOutDate = new Date(checkOut!);
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalAmount = nights * room.price;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room</span>
                  <span className="font-medium">{room.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in</span>
                  <span className="font-medium">
                    {checkInDate.toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out</span>
                  <span className="font-medium">
                    {checkOutDate.toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nights</span>
                  <span className="font-medium">{nights}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests</span>
                  <span className="font-medium">
                    {adults} {parseInt(adults!) === 1 ? "Adult" : "Adults"}
                    {children &&
                      `, ${children} ${
                        parseInt(children) === 1 ? "Child" : "Children"
                      }`}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg mt-8">
              <h2 className="text-xl font-semibold mb-6">
                Select Payment Method
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Esewa Payment Option */}
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => handlePayment("esewa")}
                  disabled={isProcessing}
                >
                  <Wallet className="h-6 w-6" />
                  <span>Pay with Esewa</span>
                  {isProcessing && selectedMethod === "esewa" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </Button>

                {/* Khalti Payment Option */}
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => handlePayment("khalti")}
                  disabled={isProcessing}
                >
                  <Smartphone className="h-6 w-6" />
                  <span>Pay with Khalti</span>
                  {isProcessing && selectedMethod === "khalti" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </Button>

                {/* Stripe Payment Option */}
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => handlePayment("stripe")}
                  disabled={isProcessing}
                >
                  <CreditCard className="h-6 w-6" />
                  <span>Pay with Card</span>
                  {isProcessing && selectedMethod === "stripe" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Your payment is secured with SSL encryption. We do not store
                your payment details.
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Price Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room Price</span>
                  <span className="font-medium">
                    ${room.price.toFixed(2)} × {nights} nights
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-2">
                  By completing this booking, you agree to our Terms of Service
                  and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
