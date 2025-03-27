// import { useEffect, useState } from 'react';
// import { useAuth } from '@/context/auth-provider';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';

// type BookingWithRoom = {
//   id: string;
//   checkIn: string;
//   checkOut: string;
//   status: string;
//   adults: number;
//   children: number;
//   specialRequests?: string;
//   room: {
//     name: string;
//     description: string;
//     price: number;
//     image: string | null;
//   };
// };

// export default function BookingsPage() {
//   const { user } = useAuth();
//   const [bookings, setBookings] = useState<BookingWithRoom[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const response = await fetch('/api/bookings');
//         if (response.ok) {
//           const data = await response.json();
//           setBookings(data.bookings);
//         }
//       } catch (error) {
//         console.error('Failed to fetch bookings:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user) {
//       fetchBookings();
//     }
//   }, [user]);

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-background pt-24 pb-20">
//         <div className="container mx-auto px-4">
//           <h1 className="text-4xl font-bold mb-8">My Bookings</h1>
//           <p>Please log in to view your bookings.</p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background pt-24 pb-20">
//         <div className="container mx-auto px-4">
//           <h1 className="text-4xl font-bold mb-8">My Bookings</h1>
//           <p>Loading your bookings...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background pt-24 pb-20">
//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl font-bold mb-8">My Bookings</h1>
        
//         {bookings.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-lg">You have no bookings yet.</p>
//             <Button 
//               className="mt-4"
//               onClick={() => window.location.href = '/book-now'}
//             >
//               Book a Room Now
//             </Button>
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {bookings.map((booking) => (
//               <div key={booking.id} className="border rounded-lg overflow-hidden shadow-sm">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
//                   <div className="md:col-span-1">
//                     {booking.room.image && (
//                       <div className="relative h-48 w-full">
//                         <Image
//                           src={booking.room.image}
//                           alt={booking.room.name}
//                           fill
//                           className="object-cover rounded-lg"
//                         />
//                       </div>
//                     )}
//                   </div>
//                   <div className="md:col-span-2 space-y-4">
//                     <div>
//                       <h3 className="text-xl font-bold">{booking.room.name}</h3>
//                       <p className="text-gray-600">{booking.room.description}</p>
//                       <p className="text-lg font-semibold mt-2">
//                         ${booking.room.price.toFixed(2)} per night
//                       </p>
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <p className="font-medium">Check-in</p>
//                         <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium">Check-out</p>
//                         <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium">Adults</p>
//                         <p>{booking.adults}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium">Children</p>
//                         <p>{booking.children}</p>
//                       </div>
//                     </div>
                    
//                     {booking.specialRequests && (
//                       <div>
//                         <p className="font-medium">Special Requests</p>
//                         <p>{booking.specialRequests}</p>
//                       </div>
//                     )}
                    
//                     <div className="flex justify-between items-center">
//                       <span className={`px-3 py-1 rounded-full text-sm ${
//                         booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
//                         booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
//                         'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {booking.status}
//                       </span>
                      
//                       <Button 
//                         variant="outline"
//                         disabled={booking.status === 'CANCELLED'}
//                         // onClick={() => handleCancelBooking(booking.id)}
//                       >
//                         {booking.status === 'CANCELLED' ? 'Cancelled' : 'Cancel Booking'}
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type BookingWithRoom = {
  id: string;
  checkIn: string;
  checkOut: string;
  status: string;
  adults: number;
  children: number;
  specialRequests?: string;
  room: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
    capacity: number;
  };
};

export default function BookingsPage() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<BookingWithRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">My Bookings</h1>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">My Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg">You have no bookings yet.</p>
            <Button 
              className="mt-4"
              onClick={() => router.push('/book-now')}
            >
              Book a Room Now
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                  <div className="md:col-span-1">
                    {booking.room.image && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={booking.room.image}
                          alt={booking.room.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">{booking.room.name}</h3>
                      <p className="text-gray-600">{booking.room.description}</p>
                      <p className="text-lg font-semibold mt-2">
                        ${booking.room.price.toFixed(2)} per night
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Check-in</p>
                        <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium">Check-out</p>
                        <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium">Adults</p>
                        <p>{booking.adults}</p>
                      </div>
                      <div>
                        <p className="font-medium">Children</p>
                        <p>{booking.children}</p>
                      </div>
                    </div>
                    
                    {booking.specialRequests && (
                      <div>
                        <p className="font-medium">Special Requests</p>
                        <p>{booking.specialRequests}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                      
                      <Button 
                        variant="outline"
                        disabled={booking.status === 'CANCELLED'}
                        // onClick={() => handleCancelBooking(booking.id)}
                      >
                        {booking.status === 'CANCELLED' ? 'Cancelled' : 'Cancel Booking'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}