"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export default function BlogPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2,
      });

      gsap.from(".blog-card", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".blog-grid",
          start: "top 80%",
          end: "bottom center",
          toggleActions: "play none none reverse",
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const blogPosts = [
    {
      title: "Top 10 Luxury Amenities You Can't Miss",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      author: "Sarah Johnson",
      date: "March 15, 2024",
      readTime: "5 min read",
      excerpt:
        "Discover the most exclusive amenities that make our hotel stand out...",
    },
    {
      title: "A Culinary Journey Through Our Restaurants",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      author: "Michael Chen",
      date: "March 12, 2024",
      readTime: "7 min read",
      excerpt: "Experience the finest dining options and culinary delights...",
    },
    {
      title: "Planning Your Perfect Beach Wedding",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
      author: "Emma Thompson",
      date: "March 10, 2024",
      readTime: "6 min read",
      excerpt:
        "Everything you need to know about hosting your dream beach wedding...",
    },
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="page-title text-4xl md:text-5xl font-bold text-center mb-12">
          Latest From Our Blog
        </h1>

        <div className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="blog-card bg-card rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative h-48">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Read More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
