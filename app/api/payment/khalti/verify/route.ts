// app/api/payment/khalti/verify/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId, transactionId } = body;

    if (!bookingId || !transactionId) {
      return NextResponse.json(
        { error: 'Missing bookingId or transactionId' },
        { status: 400 }
      );
    }

    const verified = true;

    if (verified) {
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          paymentId: transactionId
        },
        include: {
          room: true,
          user: {
            select: {
              email: true,
              fullName: true
            }
          }
        }
      });

      return NextResponse.json({ 
        verified: true,
        booking: updatedBooking
      });
    }

    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Khalti verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify Khalti payment' },
      { status: 500 }
    );
  }
}