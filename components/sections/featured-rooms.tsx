"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "../ui/card";

const rooms = [
  {
    id: "oceanview-deluxe",
    name: "Oceanview Deluxe",
    image:
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
    price: "$299",
    description: "Luxurious room with stunning ocean views",
  },
  {
    id: "royal-suite",
    name: "Royal Suite",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
    price: "$499",
    description: "Spacious suite with premium amenities",
  },
  {
    id: "garden-villa",
    name: "Garden Villa",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
    price: "$399",
    description: "Private villa surrounded by tropical gardens",
  },
  {
    id: "luxury-signature",
    name: "Luxury Signature",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
    price: "$599",
    description: "Our signature room with exclusive benefits",
  },
  {
    id: "garden-villa",
    name: "Garden Villa",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
    price: "$399",
    description: "Private villa surrounded by tropical gardens",
  },
  {
    id: "luxury-signature",
    name: "Luxury Signature",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
    price: "$599",
    description: "Our signature room with exclusive benefits",
  },
];

export default function FeaturedRooms() {
  return (
    <section className="bg-background overflow-hidden h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Sleep in Comfort Choose From Our Rooms & Suites
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Experience ultimate comfort in our thoughtfully designed rooms and
            suites, each offering a perfect blend of luxury and functionality.
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center  px-2">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {rooms.map((room, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Card className="h-full w-full ">
                    <Link href={`/rooms/${room.id}`} className=" w-full h-full">
                      <CardContent className="flex flex-col w-full h-full  p-0 ">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                          />
                        </div>

                        <div className="p-4 bg-background flex flex-col flex-grow">
                          <h3 className="text-lg sm:text-xl font-semibold mb-2">
                            {room.name}
                          </h3>
                          <p className="text-muted-foreground text-sm sm:text-base mb-4">
                            {room.description}
                          </p>
                          <div className="flex justify-between items-center mt-auto">
                            <span className="text-primary text-lg sm:text-xl font-bold">
                              {room.price}
                              <span className="text-sm text-muted-foreground">
                                /night
                              </span>
                            </span>
                            <Button
                              variant="outline"
                              className="text-sm sm:text-base"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex absolute left-4 top-1/2 transform -translate-y-1/2" />
            <CarouselNext className="hidden sm:flex absolute right-4 top-1/2 transform -translate-y-1/2" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
// "use client";

// import { useRef } from "react";
// import { motion } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { Card, CardContent } from "../ui/card";

// const rooms = [
//   {
//     id: "oceanview-deluxe",
//     name: "Oceanview Deluxe",
//     image:
//       "https://images.unsplash.com/photo-1590490359683-658d3d23f972?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
//     price: "$299",
//     description: "Luxurious room with stunning ocean views",
//   },
//   {
//     id: "royal-suite",
//     name: "Royal Suite",
//     image:
//       "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
//     price: "$499",
//     description: "Spacious suite with premium amenities",
//   },
//   {
//     id: "garden-villa",
//     name: "Garden Villa",
//     image:
//       "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
//     price: "$399",
//     description: "Private villa surrounded by tropical gardens",
//   },
//   {
//     id: "luxury-signature",
//     name: "Luxury Signature",
//     image:
//       "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
//     price: "$599",
//     description: "Our signature room with exclusive benefits",
//   },
// ];

// export default function FeaturedRooms() {
//   return (
//     <section className="bg-background overflow-hidden h-screen w-full">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
//         <div className="text-center mb-8 md:mb-12">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
//             Sleep in Comfort Choose From Our Rooms & Suites
//           </h2>
//           <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
//             Experience ultimate comfort in our thoughtfully designed rooms and
//             suites, each offering a perfect blend of luxury and functionality.
//           </p>
//         </div>

//         <div className="flex-1 flex items-center justify-center border border-green-500">
//           <Carousel
//             className="w-full max-w-7xl mx-auto "
//             opts={{
//               align: "start",
//               loop: true,
//             }}
//           >
//             <CarouselContent className="-ml-1 ">
//               {rooms.map((room) => (
//                 <CarouselItem
//                   key={room.id}
//                   className="pl-1 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 "
//                 >
//                   <Card className="h-full w-full ">
//                     <Link href={`/rooms/${room.id}`} className=" w-full h-full">
//                       <CardContent className="flex flex-col w-full h-full  p-0 ">
//                         <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
//                           <img
//                             src={room.image}
//                             alt={room.name}
//                             className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
//                           />
//                         </div>

//                         <div className="p-4 bg-background flex flex-col flex-grow">
//                           <h3 className="text-lg sm:text-xl font-semibold mb-2">
//                             {room.name}
//                           </h3>
//                           <p className="text-muted-foreground text-sm sm:text-base mb-4">
//                             {room.description}
//                           </p>
//                           <div className="flex justify-between items-center mt-auto">
//                             <span className="text-primary text-lg sm:text-xl font-bold">
//                               {room.price}
//                               <span className="text-sm text-muted-foreground">
//                                 /night
//                               </span>
//                             </span>
//                             <Button
//                               variant="outline"
//                               className="text-sm sm:text-base"
//                             >
//                               View Details
//                             </Button>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Link>
//                   </Card>
//                 </CarouselItem>
//               ))}
//             </CarouselContent>
//             <CarouselPrevious />
//             <CarouselNext />
//           </Carousel>
//         </div>
//       </div>
//     </section>
//   );
// }
