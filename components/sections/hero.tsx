"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full"
        >
          <source src="./hero1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#283618]/60" />
      </div>

      {/* Content */}
      <div className="container relative h-full mx-auto px-4 flex items-center">
        <div className="max-w-2xl">
          <span className="hero-badge inline-block bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm tracking-wider mb-6">
            Luxury Hotel in Nepal
          </span>
          <h1
            className={`${playfair.className} hero-title text-white mb-6 leading-tight text-[2rem] lg:text-[4rem]`}
          >
            Discover Your Next
            <br />
            Luxurious Escapes
          </h1>
          <p className="hero-description text-white/80 text-lg mb-8 max-w-lg">
            Experience unparalleled luxury in our carefully curated spaces
            designed for your ultimate comfort and relaxation
          </p>
          <Link href={"/book-now"}>
            <Button
              size="lg"
              variant="outline"
              className="hero-button border-white text-white hover:bg-white hover:text-[#283618] transition-colors tracking-wider"
            >
              BOOK NOW
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
