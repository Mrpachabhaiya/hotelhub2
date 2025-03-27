// "use client";

// import { useRef, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { MapPin, Phone, Mail, Clock } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/context/auth-provider";
// gsap.registerPlugin(ScrollTrigger);

// const contactSchema = z.object({
//   firstName: z.string().min(2, "First name is required"),
//   lastName: z.string().min(2, "Last name is required"),
//   email: z.string().email("Invalid email address"),
//   subject: z.string().min(5, "Subject is required"),
//   message: z.string().min(10, "Message must be at least 10 characters"),
// });

// type ContactForm = z.infer<typeof contactSchema>;

// export default function ContactPage() {
//   const pageRef = useRef<HTMLDivElement>(null);
//   const { toast } = useToast();
//   const { user } = useAuth();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<ContactForm>({
//     resolver: zodResolver(contactSchema),
//     defaultValues: {
//       email: user?.email || "",
//     },
//   });

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.from(".page-title", {
//         opacity: 0,
//         y: 50,
//         duration: 1,
//         delay: 0.2,
//       });

//       gsap.from(".contact-info", {
//         opacity: 0,
//         x: -30,
//         duration: 0.8,
//         stagger: 0.2,
//       });

//       gsap.from(".contact-form", {
//         opacity: 0,
//         x: 30,
//         duration: 0.8,
//         delay: 0.4,
//       });
//     }, pageRef);

//     return () => ctx.revert();
//   }, []);

//   const onSubmit = async (data: ContactForm) => {
//     try {
//       // Using the service function
//       await createContact({
//         firstName: data.firstName,
//         lastName: data.lastName,
//         email: data.email,
//         subject: data.subject,
//         message: data.message,
//         ...(user && { userId: user.id }), // Only add userId if user exists
//       });
  
//       toast({
//         title: "Message Sent",
//         description: "We'll get back to you soon!",
//       });
  
//       reset();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Submission failed",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div
//       ref={pageRef}
//       className="min-h-screen bg-background pt-24 mb-20 w-full "
//     >
//       <div className="container mx-auto px-4 w-full h-full overflow-hidden">
//         <h1 className="page-title text-4xl md:text-5xl font-bold text-center mb-12">
//           Contact Us
//         </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           <div className="space-y-8">
//             <div className="contact-info flex items-start space-x-4">
//               <MapPin className="w-6 h-6 text-primary mt-1" />
//               <div>
//                 <h3 className="font-semibold mb-2">Location</h3>
//                 <p className="text-muted-foreground">
//                   123 Luxury Avenue
//                   <br />
//                   Paradise City, PC 12345
//                   <br />
//                   United States
//                 </p>
//               </div>
//             </div>

//             <div className="contact-info flex items-start space-x-4">
//               <Phone className="w-6 h-6 text-primary mt-1" />
//               <div>
//                 <h3 className="font-semibold mb-2">Phone</h3>
//                 <p className="text-muted-foreground">
//                   +1 (234) 567-8900
//                   <br />
//                   +1 (234) 567-8901
//                 </p>
//               </div>
//             </div>

//             <div className="contact-info flex items-start space-x-4">
//               <Mail className="w-6 h-6 text-primary mt-1" />
//               <div>
//                 <h3 className="font-semibold mb-2">Email</h3>
//                 <p className="text-muted-foreground">
//                   info@maribella.com
//                   <br />
//                   reservations@maribella.com
//                 </p>
//               </div>
//             </div>

//             <div className="contact-info flex items-start space-x-4">
//               <Clock className="w-6 h-6 text-primary mt-1" />
//               <div>
//                 <h3 className="font-semibold mb-2">Hours</h3>
//                 <p className="text-muted-foreground">
//                   Monday - Sunday: 24/7
//                   <br />
//                   Front Desk: Always Open
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="contact-form bg-card p-8 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     First Name
//                   </label>
//                   <Input {...register("firstName")} placeholder="John" />
//                   {errors.firstName && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.firstName.message}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Last Name
//                   </label>
//                   <Input {...register("lastName")} placeholder="Doe" />
//                   {errors.lastName && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.lastName.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Email</label>
//                 <Input
//                   type="email"
//                   {...register("email")}
//                   placeholder="john@example.com"
//                   disabled={!!user?.email}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Subject
//                 </label>
//                 <Input
//                   {...register("subject")}
//                   placeholder="How can we help?"
//                 />
//                 {errors.subject && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.subject.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Message
//                 </label>
//                 <Textarea
//                   {...register("message")}
//                   placeholder="Your message..."
//                   className="h-32"
//                 />
//                 {errors.message && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.message.message}
//                   </p>
//                 )}
//               </div>
//               <Button type="submit" className="w-full" disabled={isSubmitting}>
//                 {isSubmitting ? "Sending..." : "Send Message"}
//               </Button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-provider";
gsap.registerPlugin(ScrollTrigger);

const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-title", {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2,
      });

      gsap.from(".contact-info", {
        opacity: 0,
        x: -30,
        duration: 0.8,
        stagger: 0.2,
      });

      gsap.from(".contact-form", {
        opacity: 0,
        x: 30,
        duration: 0.8,
        delay: 0.4,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const onSubmit = async (data: ContactForm) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          subject: data.subject,
          message: data.message,
          ...(user && { userId: user.id }), // Include userId if user is logged in
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible.",
      });

      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-background pt-24 mb-20 w-full "
    >
      <div className="container mx-auto px-4 w-full h-full overflow-hidden">
        <h1 className="page-title text-4xl md:text-5xl font-bold text-center mb-12">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info (unchanged) */}
          <div className="space-y-8">
            <div className="contact-info flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-muted-foreground">
                  123 Luxury Avenue
                  <br />
                  Paradise City, PC 12345
                  <br />
                  United States
                </p>
              </div>
            </div>

            <div className="contact-info flex items-start space-x-4">
              <Phone className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-muted-foreground">
                  +1 (234) 567-8900
                  <br />
                  +1 (234) 567-8901
                </p>
              </div>
            </div>

            <div className="contact-info flex items-start space-x-4">
              <Mail className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground">
                  info@maribella.com
                  <br />
                  reservations@maribella.com
                </p>
              </div>
            </div>

            <div className="contact-info flex items-start space-x-4">
              <Clock className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Hours</h3>
                <p className="text-muted-foreground">
                  Monday - Sunday: 24/7
                  <br />
                  Front Desk: Always Open
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="contact-form bg-card p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <Input 
                    {...register("firstName")} 
                    placeholder="John" 
                    disabled={isSubmitting}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <Input 
                    {...register("lastName")} 
                    placeholder="Doe" 
                    disabled={isSubmitting}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                  disabled={!!user?.email || isSubmitting}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input
                  {...register("subject")}
                  placeholder="How can we help?"
                  disabled={isSubmitting}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  {...register("message")}
                  placeholder="Your message..."
                  className="h-32"
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}