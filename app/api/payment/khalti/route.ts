import { NextResponse } from 'next/server'

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

    const transactionId = `KHALTI-${Date.now()}`
    const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?bookingId=${bookingId}&transactionId=${transactionId}`
    
    // In production, you would call Khalti's API here
    const paymentUrl = `https://khalti.com/payment/?amount=${amount * 100}&transaction_id=${transactionId}&product_name=${encodeURIComponent(productName)}&return_url=${encodeURIComponent(returnUrl)}`

    return NextResponse.json({
      paymentUrl,
      transactionId
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to initiate Khalti payment' },
      { status: 500 }
    )
  }
}