"use client";

import { useEffect} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseGsapProps {
  animationRefs: {
    [key: string]: React.RefObject<HTMLElement>;
  };
}

export const useGsap = ({ animationRefs }: UseGsapProps) => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Section Animations
      if (animationRefs.hero?.current) {
        const heroTl = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        heroTl
          .from(animationRefs.hero.current.querySelector(".hero-badge"), {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.5,
          })
          .from(
            animationRefs.hero.current.querySelector(".hero-title"),
            {
              opacity: 0,
              y: 50,
              duration: 1,
            },
            "-=0.3"
          )
          .from(
            animationRefs.hero.current.querySelector(".hero-description"),
            {
              opacity: 0,
              y: 30,
              duration: 1,
            },
            "-=0.3"
          )
          .from(
            animationRefs.hero.current.querySelector(".hero-button"),
            {
              opacity: 0,
              y: 30,
              duration: 1,
            },
            "-=0.3"
          );
      }
      // Booking Form Animations
      if (animationRefs.bookingForm?.current) {
        gsap.from(animationRefs.bookingForm.current, {
          y: 100,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: animationRefs.bookingForm.current,
            start: "top bottom",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        });
      }

      // About Section Animations
      if (animationRefs.about?.current) {
        const aboutTl = gsap.timeline({
          scrollTrigger: {
            trigger: animationRefs.about.current,
            start: "top 80%",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        });

        aboutTl
          .from(animationRefs.about.current.querySelector("h2"), {
            opacity: 0,
            y: 50,
            duration: 1,
          })
          .from(
            animationRefs.about.current.querySelector("p"),
            {
              opacity: 0,
              y: 30,
              duration: 1,
            },
            "-=0.5"
          )
          .from(
            animationRefs.about.current.querySelector("img"),
            {
              opacity: 0,
              scale: 0.8,
              duration: 1,
            },
            "-=0.5"
          )
          .from(
            animationRefs.about.current.querySelector(".stats-card"),
            {
              opacity: 0,
              x: 30,
              duration: 1,
            },
            "-=0.5"
          );
      }

      // Featured Rooms Animations
      if (animationRefs.rooms?.current) {
        const roomsTl = gsap.timeline({
          scrollTrigger: {
            trigger: animationRefs.rooms.current,
            start: "top 80%",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        });

        roomsTl
          .from(animationRefs.rooms.current.querySelector("h2"), {
            opacity: 0,
            y: 50,
            duration: 1,
          })
          .from(animationRefs.rooms.current.querySelector("p"), {
            opacity: 0,
            y: 50,
            duration: 1,
          })
          .from(
            animationRefs.rooms.current.querySelectorAll(".room-card"),
            {
              opacity: 0,
              y: 50,
              duration: 1,
              stagger: 0.2,
            },
            "-=0.5"
          );
      }

      // Why Choose Us Animations
      if (animationRefs.whyChooseUs?.current) {
        const whyChooseUsTl = gsap.timeline({
          scrollTrigger: {
            trigger: animationRefs.whyChooseUs.current,
            start: "top 80%",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        });

        whyChooseUsTl
          .from(animationRefs.whyChooseUs.current.querySelector("h2"), {
            opacity: 0,
            y: 50,
            duration: 1,
          })
          .from(
            animationRefs.whyChooseUs.current.querySelector("img"),
            {
              opacity: 0,
              scale: 0.8,
              duration: 1,
            },
            "-=0.5"
          )
          .from(
            animationRefs.whyChooseUs.current.querySelectorAll(".feature-card"),
            {
              opacity: 0,
              y: 30,
              duration: 1,
              stagger: 0.2,
            },
            "-=0.5"
          );
      }

      // Services Section Enhanced Animations
      if (animationRefs.services?.current) {
        const servicesTl = gsap.timeline({
          scrollTrigger: {
            trigger: animationRefs.services.current,
            start: "top 80%",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        });

        servicesTl
          .from(animationRefs.services.current.querySelector("h2"), {
            y: 50,
            duration: 1,
          })
          .from(
            animationRefs.services.current.querySelectorAll(".service-card"),
            {
              y: 30,
              scale: 0.9,
              duration: 0.8,
              stagger: {
                amount: 1,
                from: "random",
              },
              ease: "back.out(1.7)",
            },
            "-=0.5"
          );
      }

      // Testimonials Section Enhanced Animations
      if (animationRefs.testimonials?.current) {
        const testimonialsTl = gsap.timeline({
          scrollTrigger: {
            trigger: animationRefs.testimonials.current,
            start: "top 80%",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        });

        testimonialsTl
          .from(animationRefs.testimonials.current.querySelector("h2"), {
            opacity: 0,
            y: 50,
            duration: 1,
          })
          .from(
            animationRefs.testimonials.current.querySelectorAll(
              ".testimonial-card"
            ),
            {
              opacity: 0,
              y: 30,
              rotation: 5,
              duration: 0.8,
              stagger: {
                amount: 0.8,
                from: "edges",
              },
              ease: "none",
            },
            "-=0.5"
          );
      }

      // Footer Animations
      if (animationRefs.footer?.current) {
        const footerTl = gsap.timeline({
          scrollTrigger: {
            trigger: animationRefs.footer.current,
            start: "top 90%",
            end: "bottom bottom",
            toggleActions: "play none none reverse",
          },
        });

        footerTl
          .from(
            animationRefs.footer.current.querySelectorAll(".footer-column"),
            {
              opacity: 0,
              y: 30,
              duration: 0.8,
              stagger: 0.2,
            }
          )
          .from(
            animationRefs.footer.current.querySelector(".footer-bottom"),
            {
              opacity: 0,
              y: 20,
              duration: 0.8,
            },
            "-=0.4"
          );
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [animationRefs]);
};
