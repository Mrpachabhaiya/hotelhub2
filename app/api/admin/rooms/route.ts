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