// app/api/contacts/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    const body = await req.json()

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Create the contact
    const contact = await prisma.contact.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        subject: body.subject,
        message: body.message,
        userId: user?.id, // Will be null if not logged in
        status: 'UNREAD' // Default status
      }
    })

    return NextResponse.json({ 
      contact,
      message: 'Your message has been sent successfully' 
    }, { 
      status: 201 
    })
  } catch (error) {
    console.error('Contact submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    
    // Only allow admins to view all contacts
    // Add your admin check logic here if needed
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      // For non-admin users, show only their own contacts
      where: user.role !== 'ADMIN' ? { userId: user.id } : undefined
    })

    return NextResponse.json({ 
      contacts,
      count: contacts.length
    })
  } catch (error) {
    console.error('Failed to fetch contacts:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch contacts',
        details: error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    )
  }
}