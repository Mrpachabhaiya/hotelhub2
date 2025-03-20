"use client";

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

export default function BookingForm() {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  return (
    <section className="relative -mt-20 z-10 container mx-auto px-4">
      <Card className="booking-form">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Check In</label>
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={setCheckIn}
              className="rounded-md border"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Check Out</label>
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Adults</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Adult' : 'Adults'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Children</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Child' : 'Children'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
              Check Availability
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}