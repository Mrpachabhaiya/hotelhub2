"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { XCircle } from "lucide-react";

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    if (bookingId) {
      // Update booking status to CANCELLED if payment failed
      fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "CANCELLED",
        }),
      }).catch((error) => {
        console.error("Failed to update booking status:", error);
      });
    }

    toast({
      title: "Payment Failed",
      description: "Your payment was not completed successfully.",
      variant: "destructive",
    });
  }, [bookingId, toast]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
          <p className="text-lg mb-8">
            We couldn't process your payment. Please try again or contact
            support.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => router.push("/book-now")}>
              Try Again
            </Button>
            <Button onClick={() => router.push("/contact")}>
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
