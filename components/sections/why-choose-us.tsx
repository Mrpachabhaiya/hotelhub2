// "use client";

// import { motion } from 'framer-motion';
// import { useInView } from 'react-intersection-observer';
// import { Button } from '@/components/ui/button';
// import { Shield, Star, Users, Clock } from 'lucide-react';

// const features = [
//   {
//     icon: Shield,
//     title: "Luxury Product Quality",
//     description: "Experience unparalleled luxury with our premium amenities and services.",
//   },
//   {
//     icon: Star,
//     title: "Professional Services",
//     description: "Our trained staff delivers exceptional service tailored to your needs.",
//   },
//   {
//     icon: Users,
//     title: "Friendly Team",
//     description: "Warm and welcoming team ready to make your stay memorable.",
//   },
//   {
//     icon: Clock,
//     title: "24/7 Support",
//     description: "Round-the-clock assistance for all your requirements.",
//   },
// ];

// export default function WhyChooseUs() {
//   const [ref, inView] = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   });

//   return (
//     <section className="py-24 bg-background" ref={ref}>
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           <div className="relative">
//             <img
//               src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
//               alt="Luxury Hotel Experience"
//               className="rounded-lg shadow-2xl"
//             />
//             <div className="absolute -bottom-6 -right-6 bg-primary p-6 rounded-lg shadow-xl">
//               <div className="text-4xl font-bold text-primary-foreground">10K+</div>
//               <div className="text-sm text-primary-foreground/80">Happy Customers</div>
//             </div>
//           </div>

//           <div className="space-y-8">
//             <div>
//               <h2 className="mb-4">Why We're the Ideal Destination for Your Getaway</h2>
//               <p className="text-muted-foreground">
//                 We combine luxury with comfort to create an unforgettable experience for our guests.
//                 Our attention to detail and commitment to excellence sets us apart.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               {features.map((feature, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={inView ? { opacity: 1, y: 0 } : {}}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   className="p-4 rounded-lg bg-card/50 backdrop-blur-sm"
//                 >
//                   <feature.icon className="h-8 w-8 text-primary mb-3" />
//                   <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
//                   <p className="text-muted-foreground text-sm">{feature.description}</p>
//                 </motion.div>
//               ))}
//             </div>

//             <Button variant="secondary" size="lg">
//               Learn More
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Shield, Star, Users, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Luxury Product Quality",
    description:
      "Experience unparalleled luxury with our premium amenities and services.",
  },
  {
    icon: Star,
    title: "Professional Services",
    description:
      "Our trained staff delivers exceptional service tailored to your needs.",
  },
  {
    icon: Users,
    title: "Friendly Team",
    description: "Warm and welcoming team ready to make your stay memorable.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance for all your requirements.",
  },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLElement | null)[]>([]);

  // GSAP Animation
  useGSAP(
    () => {
      if (sectionRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        });

        featureRefs.current.forEach((feature, index) => {
          tl.from(
            feature,
            {
              opacity: 0,
              y: 20,
              duration: 0.5,
              delay: index * 0.1,
            },
            "<"
          );
        });
      }
    },
    { scope: sectionRef }
  );

  // Cleanup GSAP animations
  useEffect(() => {
    return () => {
      gsap.killTweensOf(featureRefs.current);
    };
  }, []);

  return (
    <section className="py-12 md:py-24  bg-[#283618]/95" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Section */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
              alt="Luxury Hotel Experience"
              className="rounded-lg shadow-2xl w-full h-auto"
            />
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-primary p-3 sm:p-4 lg:p-6 rounded-lg shadow-xl">
              <div className="text-xl sm:text-2xl lg:text-4xl font-bold text-primary-foreground">
                10K+
              </div>
              <div className="text-xs sm:text-sm lg:text-sm text-primary-foreground/80">
                Happy Customers
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6 lg:space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Why We're the Ideal Destination for Your Getaway
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                We combine luxury with comfort to create an unforgettable
                experience for our guests. Our attention to detail and
                commitment to excellence sets us apart.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  ref={(el) => (featureRefs.current[index] = el)}
                  className="p-4 rounded-lg bg-card/50 backdrop-blur-sm"
                >
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2 sm:mb-3" />
                  <h3 className="text-lg font-semibold mb-1 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Button */}
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
