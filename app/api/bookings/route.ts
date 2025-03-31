// import { NextResponse } from 'next/server'
// import prisma from '@/lib/prisma'
// import { getCurrentUser } from '@/lib/auth'
// export const dynamic = 'force-dynamic'; // Prevent static optimization
// export const revalidate = 0;
// export async function POST(req: Request) {
//   try {
//     const user = await getCurrentUser()
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const body = await req.json()
    
//     // Enhanced validation
//     if (!body.room_id || !body.check_in || !body.check_out || !body.adults) {
//       return NextResponse.json(
//         { error: 'Missing required fields (room_id, check_in, check_out, adults)' },
//         { status: 400 }
//       )
//     }

//     // Validate dates
//     const checkInDate = new Date(body.check_in)
//     const checkOutDate = new Date(body.check_out)
    
//     if (checkInDate >= checkOutDate) {
//       return NextResponse.json(
//         { error: 'Check-out date must be after check-in date' },
//         { status: 400 }
//       )
//     }

//     // Check room availability
//     const conflictingBooking = await prisma.booking.findFirst({
//       where: {
//         roomId: body.room_id,
//         status: { not: 'CANCELLED' },
//         OR: [
//           {
//             checkIn: { lte: checkOutDate },
//             checkOut: { gte: checkInDate }
//           }
//         ]
//       }
//     })

//     if (conflictingBooking) {
//       return NextResponse.json(
//         { error: 'Room not available for selected dates' },
//         { status: 409 }
//       )
//     }

//     const booking = await prisma.booking.create({
//       data: {
//         userId: user.id,
//         roomId: body.room_id,
//         checkIn: checkInDate,
//         checkOut: checkOutDate,
//         adults: parseInt(body.adults) || 1,
//         children: parseInt(body.children) || 0,
//         specialRequests: body.special_requests,
//         status: 'CONFIRMED'
//       },
//       include: {
//         room: {
//           select: {
//             id: true,
//             name: true,
//             price: true,
//             image: true,
//             description: true
//           }
//         }
//       }
//     })

//     return NextResponse.json({ 
//       booking,
//       message: 'Booking created successfully' 
//     }, { 
//       status: 201 
//     })
//   } catch (error) {
//     console.error('Booking error:', error)
//     return NextResponse.json(
//       { error: 'Booking failed. Please try again.' },
//       { status: 500 }
//     )
//   }
// }

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    
    // Validation
    if (!body.room_id || !body.check_in || !body.check_out || !body.adults) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const checkInDate = new Date(body.check_in)
    const checkOutDate = new Date(body.check_out)
    
    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: 'Invalid date range' },
        { status: 400 }
      )
    }

    // Check availability with transaction isolation
    const [conflictingBooking, room] = await Promise.all([
      prisma.booking.findFirst({
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
      }),
      prisma.room.findUnique({
        where: { id: body.room_id }
      })
    ])

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Room not available' },
        { status: 409 }
      )
    }

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    // Create booking with PENDING status initially
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        roomId: body.room_id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: parseInt(body.adults) || 1,
        children: parseInt(body.children) || 0,
        specialRequests: body.special_requests,
        status: 'PENDING' // Changed to PENDING initially
      },
      include: {
        room: true
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
      { error: 'Booking failed' },
      { status: 500 }
    )
  }
}

// Add PATCH endpoint to update booking status
export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const bookingId = searchParams.get('bookingId')
    
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID required' },
        { status: 400 }
      )
    }

    const body = await req.json()
    
    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
        userId: user.id // Ensure user owns the booking
      },
      data: {
        status: body.status,
        paymentId: body.transactionId
      }
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

// // Add this to your existing route.ts
// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const user = await getCurrentUser();
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await req.json();
    
//     // Validate allowed fields to update
//     const allowedUpdates = ['status', 'paymentId'];
//     const updates = Object.keys(body);
//     const isValidOperation = updates.every(update => allowedUpdates.includes(update));

//     if (!isValidOperation) {
//       return NextResponse.json({ error: 'Invalid updates' }, { status: 400 });
//     }

//     // Check if booking belongs to user
//     const existingBooking = await prisma.booking.findUnique({
//       where: { id: params.id },
//       select: { userId: true }
//     });

//     if (!existingBooking) {
//       return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
//     }

//     if (existingBooking.userId !== user.id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//     }

//     const updatedBooking = await prisma.booking.update({
//       where: { id: params.id },
//       data: body,
//       include: {
//         room: {
//           select: {
//             id: true,
//             name: true,
//             price: true,
//             image: true,
//             description: true,
//             capacity: true
//           }
//         }
//       }
//     });

//     return NextResponse.json({ booking: updatedBooking });
//   } catch (error) {
//     console.error('Failed to update booking:', error);
//     return NextResponse.json(
//       { error: 'Failed to update booking' },
//       { status: 500 }
//     );
//   }
// }
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