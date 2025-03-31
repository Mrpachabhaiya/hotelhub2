"use client";

import "./globals.css";
import { useEffect } from "react";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AuthProvider } from "@/context/auth-provider";
import { Toaster } from "@/components/ui/toaster";
gsap.registerPlugin(ScrollTrigger);

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      // lerp: 0.08,
      // smoothWheel: true,
      // infinite: false,
      // gestureOrientation: "vertical",
      // normalizeWheel: true,  // Now properly typed
      // smoothTouch: false,
    } as any);
    let frameCount = 0;
    const throttleFactor = 2;
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);

      if (frameCount % throttleFactor === 0) {
        ScrollTrigger.update();
      }
      frameCount++;
    };

    requestAnimationFrame(raf);
    if (process.env.NODE_ENV === "production") {
      lenis.on("scroll", ScrollTrigger.update);
    }
    // Connect GSAP ScrollTrigger with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(() => {});
    };
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
