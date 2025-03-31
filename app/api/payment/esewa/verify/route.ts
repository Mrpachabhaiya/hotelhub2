import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { bookingId, transactionId } = body

    if (!bookingId || !transactionId) {
      return NextResponse.json(
        { error: 'Missing booking or transaction ID' },
        { status: 400 }
      )
    }

    // In production, you would verify with Esewa's API here
    // For now, we'll mock a successful verification
    const verified = true

    if (verified) {
      // Update booking status
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          paymentId: transactionId
        },
        include: {
          room: true
        }
      })

      return NextResponse.json({ 
        verified: true,
        booking: updatedBooking
      })
    } else {
      // If verification fails
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' }
      })

      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify Esewa payment' },
      { status: 500 }
    )
  }
}