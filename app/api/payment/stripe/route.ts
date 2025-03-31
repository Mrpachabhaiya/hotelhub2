import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, bookingId, productName } = body

    if (!amount || !bookingId || !productName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?bookingId=${bookingId}&transactionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure?bookingId=${bookingId}`,
      metadata: {
        bookingId
      }
    })

    return NextResponse.json({
      paymentUrl: session.url,
      transactionId: session.id
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to initiate Stripe payment' },
      { status: 500 }
    )
  }
}