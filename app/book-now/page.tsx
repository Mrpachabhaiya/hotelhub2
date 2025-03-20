// "use client";

// import { useRef, useEffect } from "react";
// import { gsap } from "gsap";
// import { Calendar } from "@/components/ui/calendar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Link from "next/link";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";

// export default function BookNowPage() {
//   const [checkIn, setCheckIn] = useState<Date>();
//   const [checkOut, setCheckOut] = useState<Date>();
//   const pageRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.from(".page-title", {
//         opacity: 0,
//         y: 50,
//         duration: 1,
//         delay: 0.2,
//       });

//       gsap.from(".booking-form", {
//         opacity: 0,
//         y: 30,
//         duration: 0.8,
//         delay: 0.4,
//       });
//     }, pageRef);

//     return () => ctx.revert();
//   }, []);
//   const rooms = [
//     {
//       id: "oceanview-deluxe",
//       name: "Oceanview Deluxe",
//       image:
//         "https://images.unsplash.com/photo-1590490359683-658d3d23f972?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
//       price: "$299",
//       description: "Luxurious room with stunning ocean views",
//     },
//     {
//       id: "royal-suite",
//       name: "Royal Suite",
//       image:
//         "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
//       price: "$499",
//       description: "Spacious suite with premium amenities",
//     },
//     {
//       id: "garden-villa",
//       name: "Garden Villa",
//       image:
//         "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
//       price: "$399",
//       description: "Private villa surrounded by tropical gardens",
//     },
//     {
//       id: "luxury-signature",
//       name: "Luxury Signature",
//       image:
//         "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
//       price: "$599",
//       description: "Our signature room with exclusive benefits",
//     },
//     {
//       id: "garden-villa",
//       name: "Garden Villa",
//       image:
//         "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
//       price: "$399",
//       description: "Private villa surrounded by tropical gardens",
//     },
//     {
//       id: "luxury-signature",
//       name: "Luxury Signature",
//       image:
//         "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
//       price: "$599",
//       description: "Our signature room with exclusive benefits",
//     },
//   ];
//   return (
//     <div ref={pageRef} className="min-h-screen bg-background pt-24 pb-10">
//       <div className="container mx-auto px-4">
//         <h1 className="page-title text-4xl md:text-5xl font-bold text-center mb-12">
//           Book Your Stay
//         </h1>

//         <div className="max-w-4xl mx-auto">
//           <div className="booking-form bg-card p-8 rounded-lg shadow-lg">
//             <form className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Check In</label>
//                   <Calendar
//                     mode="single"
//                     selected={checkIn}
//                     onSelect={setCheckIn}
//                     className="rounded-md border"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Check Out</label>
//                   <Calendar
//                     mode="single"
//                     selected={checkOut}
//                     onSelect={setCheckOut}
//                     className="rounded-md border"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Adults</label>
//                   <Select>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {[1, 2, 3, 4].map((num) => (
//                         <SelectItem key={num} value={num.toString()}>
//                           {num} {num === 1 ? "Adult" : "Adults"}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Children</label>
//                   <Select>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {[0, 1, 2, 3].map((num) => (
//                         <SelectItem key={num} value={num.toString()}>
//                           {num} {num === 1 ? "Child" : "Children"}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Room Type</label>
//                 <Select>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Room Type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="deluxe">Deluxe Room</SelectItem>
//                     <SelectItem value="suite">Executive Suite</SelectItem>
//                     <SelectItem value="family">Family Room</SelectItem>
//                     <SelectItem value="presidential">
//                       Presidential Suite
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Full Name</label>
//                   <Input placeholder="John Doe" />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Email</label>
//                   <Input type="email" placeholder="john@example.com" />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Special Requests</label>
//                 <Input placeholder="Any special requests or preferences?" />
//               </div>

//               <Button className="w-full">Confirm Booking</Button>
//             </form>
//           </div>
//         </div>
//         <div className="pt-10">
//           <h1 className="page-title text-xl  font-bold  pb-5">
//             See Related Rooms
//           </h1>
//           <div className="flex-1 flex items-center justify-center">
//             <Carousel
//               opts={{
//                 align: "start",
//                 loop: true,
//               }}
//               className="w-full"
//             >
//               <CarouselContent>
//                 {rooms.map((room, index) => (
//                   <CarouselItem
//                     key={index}
//                     className="pl-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
//                   >
//                     <Card className="h-full w-full ">
//                       <Link
//                         href={`/rooms/${room.id}`}
//                         className=" w-full h-full"
//                       >
//                         <CardContent className="flex flex-col w-full h-full  p-0 ">
//                           <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
//                             <img
//                               src={room.image}
//                               alt={room.name}
//                               className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
//                             />
//                           </div>

//                           <div className="p-4 bg-background flex flex-col flex-grow">
//                             <h3 className="text-lg sm:text-xl font-semibold mb-2">
//                               {room.name}
//                             </h3>
//                             <p className="text-muted-foreground text-sm sm:text-base mb-4">
//                               {room.description}
//                             </p>
//                             <div className="flex justify-between items-center mt-auto">
//                               <span className="text-primary text-lg sm:text-xl font-bold">
//                                 {room.price}
//                                 <span className="text-sm text-muted-foreground">
//                                   /night
//                                 </span>
//                               </span>
//                               <Button
//                                 variant="outline"
//                                 className="text-sm sm:text-base"
//                               >
//                                 View Details
//                               </Button>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Link>
//                     </Card>
//                   </CarouselItem>
//                 ))}
//               </CarouselContent>
//               <CarouselPrevious className="hidden sm:flex absolute left-4 top-1/2 transform -translate-y-1/2" />
//               <CarouselNext className="hidden sm:flex absolute right-4 top-1/2 transform -translate-y-1/2" />
//             </Carousel>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBooking } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const bookingSchema = z.object({
  room_id: z.string().min(1, "Please select a room"),
  check_in: z.date(),
  check_out: z.date(),
  adults: z.number().min(1),
  children: z.number().min(0),
  special_requests: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

export default function BookNowPage() {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingForm) => {
    try {
      const bookingData = {
        ...data,
        check_in: data.check_in.toISOString(), // Convert to ISO string
        check_out: data.check_out.toISOString(), // Convert to ISO string
        user_id: "user_id", // Replace with actual user ID after authentication
      };

      await createBooking(bookingData);

      toast({
        title: "Booking Successful",
        description: "We'll send you a confirmation email shortly.",
      });

      router.push("/my-bookings");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Book Your Stay
        </h1>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Check In</label>
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  className="rounded-md border"
                  {...register("check_in")}
                />
                {errors.check_in && (
                  <p className="text-red-500 text-sm">
                    {errors.check_in.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Check Out</label>
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  className="rounded-md border"
                  {...register("check_out")}
                />
                {errors.check_out && (
                  <p className="text-red-500 text-sm">
                    {errors.check_out.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Type</label>
                <Select {...register("room_id")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Room Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oceanview-deluxe">
                      Oceanview Deluxe
                    </SelectItem>
                    <SelectItem value="royal-suite">Royal Suite</SelectItem>
                    <SelectItem value="garden-villa">Garden Villa</SelectItem>
                  </SelectContent>
                </Select>
                {errors.room_id && (
                  <p className="text-red-500 text-sm">
                    {errors.room_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Adults</label>
                <Select {...register("adults")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Adult" : "Adults"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.adults && (
                  <p className="text-red-500 text-sm">
                    {errors.adults.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Children</label>
              <Select {...register("children")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Child" : "Children"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.children && (
                <p className="text-red-500 text-sm">
                  {errors.children.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Special Requests</label>
              <Input
                {...register("special_requests")}
                placeholder="Any special requests or preferences?"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm Booking"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
