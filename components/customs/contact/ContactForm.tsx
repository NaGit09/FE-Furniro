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
    toast.success("Message sent successfully and you're now registered for news!");
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-100 mb-6 italic">
          Get In <span className="text-yellow-600">Touch</span>
        </h2>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
          Have a project in mind or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Contact Info */}
        <div className="space-y-12 animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="flex gap-6 p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-transparent hover:border-yellow-200 transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="w-14 h-14 bg-white dark:bg-black rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform">
                <MapPin className="text-yellow-600 w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Our Boutique</h4>
                <p className="text-zinc-500 font-medium">123 Design Avenue, <br />Milan, Italy 20121</p>
              </div>
            </div>

            <div className="flex gap-6 p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-transparent hover:border-yellow-200 transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="w-14 h-14 bg-white dark:bg-black rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform">
                <Phone className="text-yellow-600 w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Phone</h4>
                <p className="text-zinc-500 font-medium">+39 (0) 555-1234 <br />Mon-Fri 9:00 - 18:00</p>
              </div>
            </div>

            <div className="flex gap-6 p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-transparent hover:border-yellow-200 transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="w-14 h-14 bg-white dark:bg-black rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform">
                <Mail className="text-yellow-600 w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Email</h4>
                <p className="text-zinc-500 font-medium">hello@furniro.com <br />support@furniro.com</p>
              </div>
            </div>

            <div className="flex gap-6 p-8 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-transparent hover:border-yellow-200 transition-all duration-300 shadow-sm hover:shadow-xl group">
              <div className="w-14 h-14 bg-white dark:bg-black rounded-2xl flex items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform">
                <Clock className="text-yellow-600 w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Working Hours</h4>
                <p className="text-zinc-500 font-medium">Mon-Sat: 9am - 10pm <br />Sun: 10am - 8pm</p>
              </div>
            </div>
          </div>
          
          <div className="p-10 bg-yellow-600 rounded-[40px] text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
               <h3 className="text-2xl font-black mb-4 italic">Join our exclusive circle</h3>
               <p className="text-yellow-50 mb-6 font-medium">Receive weekly inspiration, early access to new collections, and furniture care tips directly to your inbox.</p>
               <div className="flex items-center gap-2 font-black text-sm uppercase tracking-widest">
                 <Sparkles className="w-5 h-5" /> Design better lives
               </div>
            </div>
            <div className="absolute right-[-5%] bottom-[-10%] opacity-10 transform scale-150 rotate-[-15deg]">
              <Mail size={300} strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-zinc-900 p-10 md:p-14 rounded-[50px] shadow-2xl border border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-right-10 duration-1000">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-lg font-bold">Your Name</Label>
                <Input 
                  id="name" 
                  autoComplete="off"
                  {...register("name", { required: "Name is required" })}
                  className="h-16 rounded-2xl bg-zinc-50 border-none focus-visible:ring-2 focus-visible:ring-yellow-600 px-6 text-lg font-medium" 
                  placeholder="John Doe" 
                />
                {errors.name && <p className="text-red-500 text-sm font-bold">{errors.name.message}</p>}
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-lg font-bold">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  autoComplete="off"
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                  className="h-16 rounded-2xl bg-zinc-50 border-none focus-visible:ring-2 focus-visible:ring-yellow-600 px-6 text-lg font-medium" 
                  placeholder="john@example.com" 
                />
                {errors.email && <p className="text-red-500 text-sm font-bold">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="subject" className="text-lg font-bold">Subject</Label>
              <Input 
                id="subject" 
                autoComplete="off"
                {...register("subject")}
                className="h-16 rounded-2xl bg-zinc-50 border-none focus-visible:ring-2 focus-visible:ring-yellow-600 px-6 text-lg font-medium" 
                placeholder="How can we help?" 
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="message" className="text-lg font-bold">Message</Label>
              <textarea 
                id="message" 
                rows={5}
                {...register("message", { required: "Please enter your message" })}
                className="w-full rounded-3xl bg-zinc-50 border-none focus-visible:ring-2 focus-visible:ring-yellow-600 p-6 text-lg font-medium outline-none transition-all duration-200 focus-visible:ring-offset-0 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="Tell us everything..." 
              />
              {errors.message && <p className="text-red-500 text-sm font-bold">{errors.message.message}</p>}
            </div>

            <div className="flex items-center space-x-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border-2 border-transparent hover:border-yellow-200 transition-all cursor-pointer">
              <input 
                type="checkbox" 
                id="registerNews" 
                {...register("registerNews")}
                className="w-6 h-6 accent-yellow-600 rounded cursor-pointer" 
              />
              <Label htmlFor="registerNews" className="text-lg font-bold cursor-pointer select-none">Subscribe to our newsletter & latest arrivals</Label>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-20 rounded-3xl bg-black hover:bg-zinc-800 text-white text-xl font-bold flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl"
            >
              {isSubmitting ? "Sending..." : (
                <>
                  <Send className="w-6 h-6" /> Send Message
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
