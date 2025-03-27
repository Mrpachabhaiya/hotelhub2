import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
export default async function ProfilePage({
  params,
}: {
  params: { userId: string }
}) {
  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      mobile: true,
      createdAt: true,
      bookings: {
        include: {
          room: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          checkIn: 'desc',
        },
        take: 3, // Only show 3 most recent bookings
      },
    },
  })

  if (!user) {
    return <div className="container mx-auto py-12">User not found</div>
  }

  return (
    <div className="container mx-auto py-20">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card>
            <CardHeader className="items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" />
                <AvatarFallback className="text-3xl">
                  {user.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-center">{user.fullName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              {user.mobile && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{user.mobile}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>
                  Member since{' '}
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          <Button asChild className="w-full">
            <Link href={`/bookings`}>View All Bookings</Link>
          </Button>
        </div>

        {/* Recent Bookings */}
        <div className="w-full md:w-2/3 space-y-6">
          <h2 className="text-2xl font-bold">Recent Bookings</h2>
          {user.bookings.length > 0 ? (
            <div className="space-y-4">
              {user.bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <CardTitle>{booking.room.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {booking.room.image && (
                      <img
                        src={booking.room.image}
                        alt={booking.room.name}
                        className="rounded-lg mb-4 w-full h-48 object-cover"
                      />
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Check-in
                        </p>
                        <p>
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Check-out
                        </p>
                        <p>
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No bookings found
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}