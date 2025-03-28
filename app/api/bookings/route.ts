import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
export const dynamic = 'force-dynamic'; // Prevent static optimization
export const revalidate = 0;
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    
    // Enhanced validation
    if (!body.room_id || !body.check_in || !body.check_out || !body.adults) {
      return NextResponse.json(
        { error: 'Missing required fields (room_id, check_in, check_out, adults)' },
        { status: 400 }
      )
    }

    // Validate dates
    const checkInDate = new Date(body.check_in)
    const checkOutDate = new Date(body.check_out)
    
    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: 'Check-out date must be after check-in date' },
        { status: 400 }
      )
    }

    // Check room availability
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId: body.room_id,
        status: { not: 'CANCELLED' },
        OR: [
          {
            checkIn: { lte: checkOutDate },
            checkOut: { gte: checkInDate }
          }
        ]
      }
    })

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Room not available for selected dates' },
        { status: 409 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        roomId: body.room_id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: parseInt(body.adults) || 1,
        children: parseInt(body.children) || 0,
        specialRequests: body.special_requests,
        status: 'CONFIRMED'
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            description: true
          }
        }
      }
    })

    return NextResponse.json({ 
      booking,
      message: 'Booking created successfully' 
    }, { 
      status: 201 
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Booking failed. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            description: true,
            capacity: true
          }
        }
      },
      orderBy: {
        checkIn: 'desc'
      }
    })

    return NextResponse.json({ 
      bookings,
      count: bookings.length
    })
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch bookings',
        details: error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// import { NextResponse } from 'next/server'
// import prisma from '@/lib/prisma'
// import { isAdminRequest } from '@/lib/admin-auth'

// export async function POST(req: Request) {
//   try {
//     // Verify admin
//     const { isAdmin, errorResponse } = await isAdminRequest(req)
//     if (!isAdmin) return errorResponse

//     const body = await req.json()

//     const room = await prisma.room.create({
//       data: {
//         name: body.name,
//         description: body.description,
//         price: parseFloat(body.price),
//         capacity: parseInt(body.capacity),
//         image: body.image
//       }
//     })

//     return NextResponse.json(room)

//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to create room' },
//       { status: 500 }
//     )
//   }
// }

// export async function GET(req: Request) {
//   try {
//     const { isAdmin, errorResponse } = await isAdminRequest(req)
//     if (!isAdmin) return errorResponse

//     const rooms = await prisma.room.findMany()
//     return NextResponse.json(rooms)

//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch rooms' },
//       { status: 500 }
//     )
//   }
// }