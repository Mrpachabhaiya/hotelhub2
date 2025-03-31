import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: params.roomId },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch room details" },
      { status: 500 }
    );
  }
}