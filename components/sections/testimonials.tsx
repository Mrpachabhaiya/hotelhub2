"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Star } from "lucide-react";
import { gsap } from "gsap";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Business Traveler",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    content:
      "An exceptional experience from start to finish. The attention to detail and personalized service exceeded all expectations.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Luxury Enthusiast",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    content:
      "The epitome of luxury hospitality. Every moment of our stay was carefully crafted to ensure maximum comfort and enjoyment.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Family Vacation",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    content:
      "Perfect for families! The staff went above and beyond to make our children feel special. We'll definitely return.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Honeymoon Stay",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    content:
      "Our honeymoon was absolutely perfect thanks to the incredible service and romantic atmosphere of this amazing hotel.",
    rating: 5,
  },
  {
    id: 5,
    name: "David Rodriguez",
    role: "Honeymoon Stay",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    content:
      "Our honeymoon was absolutely perfect thanks to the incredible service and romantic atmosphere of this amazing hotel.",
    rating: 5,
  },
  {
    id: 6,
    name: "David Rodriguez",
    role: "Honeymoon Stay",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    content:
      "Our honeymoon was absolutely perfect thanks to the incredible service and romantic atmosphere of this amazing hotel.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [api, setApi] = useState<CarouselApi | null>(null);

  // Autoplay logic
  useEffect(() => {
    if (api) {
      const interval = setInterval(() => {
        api.scrollNext(); // Move to the next slide
      }, 5000); // 5-second delay

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [api]);

  // useEffect(() => {
  //   if (inView) {
  //     // Animate heading
  //     gsap.from(headingRef.current, {
  //       opacity: 0,
  //       y: 20,
  //       duration: 1,
  //       ease: "power3.out",
  //     });

  //     // Animate description
  //     gsap.from(descriptionRef.current, {
  //       opacity: 0,
  //       y: 20,
  //       duration: 1,
  //       delay: 0.3,
  //       ease: "power3.out",
  //     });

  //     // Animate carousel items
  //   }
  // }, [inView]);

  return (
    <section
      className="py-24 bg-[#283618]/95 relative overflow-hidden"
      ref={ref}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 parallax opacity-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80')",
        }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="mb-4" ref={headingRef}>
            What Our Guests Say About Their Experience
          </h2>
          <p
            className="text-muted-foreground max-w-2xl mx-auto"
            ref={descriptionRef}
          >
            Read authentic reviews from our valued guests who have experienced
            our exceptional service and luxurious accommodations.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
          setApi={setApi}
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 carousel-item"
              >
                <div className="testimonial-card h-full p-6 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg flex flex-col ">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className=" text-sm text-muted-foreground flex-grow overflow-y-auto">
                    {testimonial.content}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
