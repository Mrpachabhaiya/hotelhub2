import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateEsewaSignature } from "@/lib/generateEsewaSignature";
import { PaymentMethod, PaymentRequestData ,BookingWithRelations} from "@/lib/types";
import prisma from "@/lib/prisma";

function validateEnvironmentVariables() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_BASE_URL",
    "NEXT_PUBLIC_ESEWA_MERCHANT_CODE",
    "NEXT_PUBLIC_ESEWA_SECRET_KEY",
    "NEXT_PUBLIC_KHALTI_SECRET_KEY",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  }
}

export async function POST(req: Request) {
  try {
    validateEnvironmentVariables();

    const paymentData: PaymentRequestData = await req.json();
    const { amount, productName, transactionId, method } = paymentData;

    if (!amount || !productName || !transactionId || !method) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the booking exists and is in PENDING status
    const bookingId = transactionId.replace('BOOKING-', '');
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { 
        room: true,
        user: {
          select: {
            email: true,
            fullName: true,
            mobile: true
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { error: "Booking is not in a payable state" },
        { status: 400 }
      );
    }
      // Type assertion if needed
      const typedBooking = booking as BookingWithRelations;

    switch (method as PaymentMethod) {
      case "esewa": {
        const transactionUuid = `ESEWA-${Date.now()}-${uuidv4()}`;
        const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?transactionId=${transactionUuid}&bookingId=${bookingId}`;
        const failureUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure?bookingId=${bookingId}`;

        const esewaConfig = {
          amount: amount,
          tax_amount: "0",
          total_amount: amount,
          transaction_uuid: transactionUuid,
          product_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE!,
          product_service_charge: "0",
          product_delivery_charge: "0",
          success_url: successUrl,
          failure_url: failureUrl,
          signed_field_names: "total_amount,transaction_uuid,product_code",
        };

        const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
        const signature = generateEsewaSignature(
          process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY!,
          signatureString
        );

        // Update booking with payment reference
        await prisma.booking.update({
          where: { id: bookingId },
          data: { paymentId: transactionUuid }
        });

        return NextResponse.json({
          amount: amount,
          esewaConfig: {
            ...esewaConfig,
            signature,
            product_service_charge: Number(esewaConfig.product_service_charge),
            product_delivery_charge: Number(esewaConfig.product_delivery_charge),
            tax_amount: Number(esewaConfig.tax_amount),
            total_amount: Number(esewaConfig.total_amount),
          },
        });
      }

      case "khalti": {
      const userEmail = typedBooking.user?.email || "guest@example.com";
        const userName = typedBooking.user?.fullName || "Guest";
        const userPhone = typedBooking.user?.mobile || "9800000000";
        const khaltiConfig = {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?method=khalti&bookingId=${bookingId}`,
          website_url: process.env.NEXT_PUBLIC_BASE_URL!,
          amount: Math.round(parseFloat(amount) * 100), // Convert to paisa
          purchase_order_id: transactionId,
          purchase_order_name: productName,
          customer_info: {
            name: userName,
            email: userEmail,
            phone: userPhone,
          },
        };

        const response = await fetch(
          "https://a.khalti.com/api/v2/epayment/initiate/",
          {
            method: "POST",
            headers: {
              Authorization: `Key ${process.env.NEXT_PUBLIC_KHALTI_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(khaltiConfig),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Khalti API Error: ${JSON.stringify(errorData)}`
          );
        }

        const khaltiResponse = await response.json();

        // Update booking with payment reference
        await prisma.booking.update({
          where: { id: bookingId },
          data: { paymentId: `KHALTI-${Date.now()}` }
        });

        return NextResponse.json({
          khaltiPaymentUrl: khaltiResponse.payment_url,
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid payment method" },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("Payment API Error:", err);
    return NextResponse.json(
      {
        error: "Error creating payment session",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}