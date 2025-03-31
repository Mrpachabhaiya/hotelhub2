import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  try {
    const roomId = searchParams.get('room_id');
    const checkIn = new Date(searchParams.get('check_in') as string);
    const checkOut = new Date(searchParams.get('check_out') as string);
    const adults = parseInt(searchParams.get('adults') as string);
    const children = parseInt(searchParams.get('children') || '0');

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // Find the requested room
    const requestedRoom = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!requestedRoom) {
      return NextResponse.json(
        { error: "Requested room not found" },
        { status: 404 }
      );
    }

    // Check if the requested room is available
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        roomId,
        OR: [
          {
            checkIn: { lt: checkOut },
            checkOut: { gt: checkIn }
          }
        ],
        status: {
          not: 'CANCELLED'
        }
      }
    });

    const isAvailable = overlappingBookings.length === 0;

    // Find alternative rooms that can accommodate the guests
    const capacity = adults + children;
    const alternativeRooms = await prisma.room.findMany({
      where: {
        id: { not: roomId },
        capacity: { gte: capacity }
      }
    });

    // Check availability for each alternative room
    const availableAlternatives = await Promise.all(
      alternativeRooms.map(async (room) => {
        const bookings = await prisma.booking.findMany({
          where: {
            roomId: room.id,
            OR: [
              {
                checkIn: { lt: checkOut },
                checkOut: { gt: checkIn }
              }
            ],
            status: {
              not: 'CANCELLED'
            }
          }
        });
        return bookings.length === 0 ? room : null;
      })
    ).then(rooms => rooms.filter(room => room !== null));

    return NextResponse.json({
      isAvailable,
      requestedRoom,
      availableAlternatives,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      adults,
      children
    });
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}