"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const bookingId = searchParams.get("bookingId");
  const transactionId = searchParams.get("transactionId");
  useEffect(() => {
    const confirmBooking = async () => {
      try {
        if (!bookingId || !transactionId) {
          throw new Error("Missing booking information");
        }

        // Verify payment based on transaction ID format
        let verifyEndpoint = "/api/payment/esewa/verify";
        if (transactionId.startsWith("KHALTI-")) {
          verifyEndpoint = "/api/payment/khalti/verify";
        } else if (transactionId.startsWith("pi_")) {
          // Stripe pattern
          verifyEndpoint = "/api/payment/stripe/verify";
        }

        const response = await fetch(verifyEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId,
            transactionId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Payment verification failed");
        }

        // Update booking status
        await fetch(`/api/bookings/${bookingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "CONFIRMED",
            paymentId: transactionId,
          }),
        });

        toast({
          title: "Payment Successful",
          description: "Your booking has been confirmed!",
        });
      } catch (error) {
        toast({
          title: "Payment Verification Error",
          description:
            error instanceof Error ? error.message : "Failed to verify payment",
          variant: "destructive",
        });
        router.push("/bookings");
      }
    };

    confirmBooking();
  }, [bookingId, transactionId, router, toast]);
  // useEffect(() => {
  //   const confirmBooking = async () => {
  //     try {
  //       if (!bookingId || !transactionId) {
  //         throw new Error("Missing booking or transaction information");
  //       }

  //       // Verify payment with Esewa and confirm booking
  //       const response = await fetch("/api/payment/esewa/verify", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           bookingId,
  //           transactionId,
  //         }),
  //       });

  //       const data = await response.json();

  //       if (!response.ok) {
  //         throw new Error(data.error || "Payment verification failed");
  //       }

  //       // Update booking status to CONFIRMED
  //       const bookingResponse = await fetch(`/api/bookings/${bookingId}`, {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           status: "CONFIRMED",
  //           paymentId: transactionId,
  //         }),
  //       });

  //       if (!bookingResponse.ok) {
  //         throw new Error("Failed to confirm booking");
  //       }

  //       toast({
  //         title: "Payment Successful",
  //         description: "Your booking has been confirmed!",
  //       });
  //     } catch (error) {
  //       toast({
  //         title: "Payment Verification Error",
  //         description:
  //           error instanceof Error ? error.message : "Failed to verify payment",
  //         variant: "destructive",
  //       });
  //       router.push("/bookings");
  //     }
  //   };

  //   confirmBooking();
  // }, [bookingId, transactionId, router, toast]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-lg mb-8">
            Thank you for your payment. Your booking has been confirmed.
          </p>
          <div className="bg-card p-6 rounded-lg mb-8">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-muted-foreground">Booking ID</p>
                <p className="font-medium">{bookingId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Transaction ID</p>
                <p className="font-medium">{transactionId}</p>
              </div>
            </div>
          </div>
          <Button onClick={() => router.push("/bookings")}>
            View My Bookings
          </Button>
        </div>
      </div>
    </div>
  );
}
