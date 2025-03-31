import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, bookingId, productName } = body
    console.log(body)
    if (!amount || !bookingId || !productName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const transactionId = `ESEWA-${Date.now()}`
    const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?bookingId=${bookingId}&transactionId=${transactionId}`
    const failureUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure?bookingId=${bookingId}`
    
    const paymentUrl = `https://rc-epay.esewa.com.np/api/epay/main/v2/form?amount=${amount}&tax_amount=0&total_amount=${amount}&transaction_uuid=${transactionId}&product_code=EPAYTEST&product_name=${encodeURIComponent(productName)}&success_url=${encodeURIComponent(successUrl)}&failure_url=${encodeURIComponent(failureUrl)}`

    return NextResponse.json({ 
      paymentUrl,
      transactionId 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to initiate Esewa payment' },
      { status: 500 }
    )
  }
}