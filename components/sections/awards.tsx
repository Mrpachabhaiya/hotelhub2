"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Star, Trophy, Medal } from 'lucide-react';

export default function Awards() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const awards = [
    {
      icon: Trophy,
      title: "Best Luxury Hotel",
      organization: "World Travel Awards",
      year: "2024"
    },
    {
      icon: Star,
      title: "5-Star Excellence",
      organization: "Forbes Travel Guide",
      year: "2024"
    },
    {
      icon: Award,
      title: "Best Hotel Spa",
      organization: "Luxury Spa Awards",
      year: "2024"
    },
    {
      icon: Medal,
      title: "Sustainable Luxury",
      organization: "Green Globe",
      year: "2024"
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            Our Awards & Recognition
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Recognition of our commitment to excellence in luxury hospitality
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg shadow-lg text-center"
            >
              <award.icon className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{award.title}</h3>
              <p className="text-muted-foreground text-sm mb-2">{award.organization}</p>
              <p className="text-primary font-semibold">{award.year}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}