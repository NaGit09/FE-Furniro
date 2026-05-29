"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  registerNews: boolean;
}

const ContactForm = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>();
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API call
    console.log("Form Data:", data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSuccess(true);
    toast.success("Tin nhắn của bạn đã được gửi thành công!");
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <section className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header section */}
      <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700 flex flex-col gap-2 items-center">
        <h6 className="text-xs font-bold tracking-[0.25em] text-yellow-600 dark:text-yellow-500 uppercase">
          Contact Boutique
        </h6>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight">
          Get In <span className="text-yellow-600 italic font-medium font-heading">Touch</span>
        </h2>
        <div className="h-0.5 w-16 bg-yellow-600 rounded-full mt-2" />
        <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 max-w-xl mx-auto font-medium font-sans mt-2">
          Have a project in mind or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-start">
        {/* Contact Info Decks */}
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            
            {/* Boutique Address */}
            <div className="flex gap-4 p-5 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-850/40 rounded-3xl shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-yellow-600/30 transition-all duration-350 group cursor-default">
              <div className="w-12 h-12 bg-yellow-600/10 dark:bg-yellow-600/15 border border-yellow-600/10 rounded-xl flex items-center justify-center shadow-sm transform group-hover:-translate-y-1.5 transition-transform duration-300">
                <MapPin className="text-yellow-600 w-6 h-6" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-50">Our Boutique</h4>
                <p className="text-stone-500 dark:text-stone-400 font-sans text-xs sm:text-sm font-medium">
                  123 Design Avenue, <br />Milan, Italy 20121
                </p>
              </div>
            </div>

            {/* Phone Info */}
            <div className="flex gap-4 p-5 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-850/40 rounded-3xl shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-yellow-600/30 transition-all duration-350 group cursor-default">
              <div className="w-12 h-12 bg-yellow-600/10 dark:bg-yellow-600/15 border border-yellow-600/10 rounded-xl flex items-center justify-center shadow-sm transform group-hover:-translate-y-1.5 transition-transform duration-300">
                <Phone className="text-yellow-600 w-6 h-6" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-50">Phone Support</h4>
                <p className="text-stone-500 dark:text-stone-400 font-sans text-xs sm:text-sm font-medium">
                  +39 (0) 555-1234 <br />Mon-Fri 9:00 - 18:00
                </p>
              </div>
            </div>

            {/* Email Support */}
            <div className="flex gap-4 p-5 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-850/40 rounded-3xl shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-yellow-600/30 transition-all duration-350 group cursor-default">
              <div className="w-12 h-12 bg-yellow-600/10 dark:bg-yellow-600/15 border border-yellow-600/10 rounded-xl flex items-center justify-center shadow-sm transform group-hover:-translate-y-1.5 transition-transform duration-300">
                <Mail className="text-yellow-600 w-6 h-6" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-50">Email Care</h4>
                <p className="text-stone-500 dark:text-stone-400 font-sans text-xs sm:text-sm font-medium">
                  hello@furniro.com <br />support@furniro.com
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex gap-4 p-5 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-850/40 rounded-3xl shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-yellow-600/30 transition-all duration-350 group cursor-default">
              <div className="w-12 h-12 bg-yellow-600/10 dark:bg-yellow-600/15 border border-yellow-600/10 rounded-xl flex items-center justify-center shadow-sm transform group-hover:-translate-y-1.5 transition-transform duration-300">
                <Clock className="text-yellow-600 w-6 h-6" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-50">Working Hours</h4>
                <p className="text-stone-500 dark:text-stone-400 font-sans text-xs sm:text-sm font-medium">
                  Mon-Sat: 9am - 10pm <br />Sun: 10am - 8pm
                </p>
              </div>
            </div>

          </div>
          
          {/* Organic Gold Gradient Exclusive Badge */}
          <div className="p-6 md:p-8 bg-linear-to-r from-yellow-600 to-amber-700 rounded-[30px] text-white relative overflow-hidden group shadow-lg">
            <div className="relative z-10 flex flex-col gap-3">
               <h3 className="text-xl sm:text-2xl font-bold font-heading italic">Join our exclusive circle</h3>
               <p className="text-yellow-50 text-xs sm:text-sm leading-relaxed font-sans font-medium max-w-sm">
                 Receive weekly inspiration, early access to new collections, and furniture care tips directly to your inbox.
               </p>
               <div className="flex items-center gap-2 font-black text-[11px] sm:text-xs uppercase tracking-widest mt-1">
                 <Sparkles className="w-4 h-4 animate-pulse" /> Design better lives
               </div>
            </div>
            <div className="absolute right-[-5%] bottom-[-10%] opacity-10 transform scale-150 rotate-[-15deg] pointer-events-none select-none">
              <Mail size={240} strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* Premium Form Box */}
        <div className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-850/40 p-6 md:p-8 rounded-[30px] shadow-sm animate-in fade-in slide-in-from-right-10 duration-1000">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 font-sans">
                  Your Name
                </Label>
                <Input 
                  id="name" 
                  autoComplete="off"
                  {...register("name", { required: "Name is required" })}
                  className="h-11 rounded-lg bg-stone-100/50 dark:bg-stone-950/40 border border-stone-200/50 dark:border-stone-850/50 focus-visible:ring-2 focus-visible:ring-yellow-600 px-4 text-xs sm:text-sm font-medium transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600"
                  placeholder="John Doe" 
                />
                {errors.name && <p className="text-red-500 text-xs font-bold font-sans">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 font-sans">
                  Email Address
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  autoComplete="off"
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                  className="h-11 rounded-lg bg-stone-100/50 dark:bg-stone-950/40 border border-stone-200/50 dark:border-stone-850/50 focus-visible:ring-2 focus-visible:ring-yellow-600 px-4 text-xs sm:text-sm font-medium transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600"
                  placeholder="john@example.com" 
                />
                {errors.email && <p className="text-red-500 text-xs font-bold font-sans">{errors.email.message}</p>}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <Label htmlFor="subject" className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 font-sans">
                Subject
              </Label>
              <Input 
                id="subject" 
                autoComplete="off"
                {...register("subject")}
                className="h-11 rounded-lg bg-stone-100/50 dark:bg-stone-950/40 border border-stone-200/50 dark:border-stone-850/50 focus-visible:ring-2 focus-visible:ring-yellow-600 px-4 text-xs sm:text-sm font-medium transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600"
                placeholder="How can we help?" 
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 font-sans">
                Message
              </Label>
              <textarea 
                id="message" 
                rows={5}
                {...register("message", { required: "Please enter your message" })}
                className="w-full rounded-lg bg-stone-100/50 dark:bg-stone-950/40 border border-stone-200/50 dark:border-stone-850/50 p-4 text-xs sm:text-sm font-medium focus-visible:ring-2 focus-visible:ring-yellow-600 transition-all outline-none placeholder:text-stone-400 dark:placeholder:text-stone-600 resize-none"
                placeholder="Tell us everything..." 
              />
              {errors.message && <p className="text-red-500 text-xs font-bold font-sans">{errors.message.message}</p>}
            </div>

            {/* Newsletter Checkbox Glass Card */}
            <div className="flex items-center space-x-3 p-3 bg-stone-100/50 dark:bg-stone-950/30 border border-stone-200/20 dark:border-stone-850/20 rounded-xl hover:border-yellow-600/25 transition-all cursor-pointer">
              <input 
                type="checkbox" 
                id="registerNews" 
                {...register("registerNews")}
                className="w-5 h-5 accent-yellow-600 rounded cursor-pointer" 
              />
              <Label htmlFor="registerNews" className="text-[11px] sm:text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer select-none">
                Subscribe to our newsletter & latest arrivals
              </Label>
            </div>

            {/* CTA Submit Button */}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-yellow-600 hover:bg-yellow-750 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md hover:shadow-yellow-600/10 cursor-pointer duration-300"
            >
              {isSubmitting ? "Sending..." : (
                <>
                  <Send className="w-4 h-4" /> Send Message
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
