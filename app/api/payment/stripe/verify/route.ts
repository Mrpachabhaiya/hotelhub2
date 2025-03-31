import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { transactionId } = body

    // Verify with Stripe API
    const session = await stripe.checkout.sessions.retrieve(transactionId)
    
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      verified: true,
      bookingId: session.metadata?.bookingId,
      transactionId: session.id
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify Stripe payment' },
      { status: 500 }
    )
  }
}