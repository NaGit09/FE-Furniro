"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, TreePine, Sparkles, Send, CheckCircle2, ShieldCheck, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { SubscribeReqSchema, Subscribe } from "@/schema/request/message/Subcribe";
import { SubscribeApi } from "@/services/api/Message/subscribe.service";

const SubscribeForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<Subscribe>({
    resolver: zodResolver(SubscribeReqSchema),
    defaultValues: {
      email: "",
      phone: "",
      fullName: "",
    },
  });

  const onSubmit = async (data: Subscribe) => {
    try {
      const res = await SubscribeApi.subscribe(data);
      if (res?.data?.code === 200 || res?.data?.data === true) {
        setIsSuccess(true);
        toast.success("Subscription successful! Welcome to the exclusive circle.");
        form.reset();
      } else {
        toast.error(res?.data?.message || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  return (
    <section className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header section */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700 flex flex-col gap-2 items-center">
        <h6 className="text-xs font-bold tracking-[0.25em] text-yellow-600 dark:text-yellow-500 uppercase">
          Exclusive Membership
        </h6>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight">
          Join the <span className="text-yellow-600 italic font-medium font-heading">Exclusive Circle</span>
        </h2>
        <div className="h-0.5 w-16 bg-yellow-600 rounded-full mt-2" />
        <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 max-w-xl mx-auto font-medium font-sans mt-2">
          Unlock signature styling privileges, boutique collection releases, and luxury design insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start">
        {/* Left Column: Premium Benefits deck */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            
            {/* Benefit 1: Welcome Privilege */}
            <div className="flex gap-4 p-5 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-850/40 rounded-3xl shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-yellow-600/30 transition-all duration-350 group cursor-default">
              <div className="w-12 h-12 bg-yellow-600/10 dark:bg-yellow-600/15 border border-yellow-600/10 rounded-xl flex items-center justify-center shadow-sm transform group-hover:-translate-y-1.5 transition-transform duration-300">
                <Gift className="text-yellow-600 w-6 h-6" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-50">Welcome Privilege</h4>
                <p className="text-stone-500 dark:text-stone-400 font-sans text-xs sm:text-sm font-medium">
                  Receive a 10% welcome coupon code immediately valid across all luxury collections.
                </p>
              </div>
            </div>

            {/* Benefit 2: Sustainable Wood Priority */}
            <div className="flex gap-4 p-5 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-850/40 rounded-3xl shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-yellow-600/30 transition-all duration-350 group cursor-default">
              <div className="w-12 h-12 bg-yellow-600/10 dark:bg-yellow-600/15 border border-yellow-600/10 rounded-xl flex items-center justify-center shadow-sm transform group-hover:-translate-y-1.5 transition-transform duration-300">
                <TreePine className="text-yellow-600 w-6 h-6" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-50">Eco-Wood Priority</h4>
                <p className="text-stone-500 dark:text-stone-400 font-sans text-xs sm:text-sm font-medium">
                  Get priority access and advance bookings for our FSC-certified sustainable wood releases.
                </p>
              </div>
            </div>

            {/* Benefit 3: Milano Trends */}
            <div className="flex gap-4 p-5 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-850/40 rounded-3xl shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-yellow-600/30 transition-all duration-350 group cursor-default">
              <div className="w-12 h-12 bg-yellow-600/10 dark:bg-yellow-600/15 border border-yellow-600/10 rounded-xl flex items-center justify-center shadow-sm transform group-hover:-translate-y-1.5 transition-transform duration-300">
                <Sparkles className="text-yellow-600 w-6 h-6" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-50">Milano Design Catalog</h4>
                <p className="text-stone-500 dark:text-stone-400 font-sans text-xs sm:text-sm font-medium">
                  Receive monthly lookbooks, styling masterclasses, and curated design trend analysis.
                </p>
              </div>
            </div>

          </div>
          
          {/* Organic Gold Gradient Exclusive Badge */}
          <div className="p-6 md:p-8 bg-linear-to-r from-yellow-600 to-amber-700 rounded-[30px] text-white relative overflow-hidden group shadow-lg">
            <div className="relative z-10 flex flex-col gap-3">
               <h3 className="text-xl sm:text-2xl font-bold font-heading italic">Refined Living Awaits</h3>
               <p className="text-yellow-50 text-xs sm:text-sm leading-relaxed font-sans font-medium max-w-sm">
                 Join 50,000+ design connoisseurs and craft a home that reflects true editorial refinement.
               </p>
               <div className="flex items-center gap-2 font-black text-[11px] sm:text-xs uppercase tracking-widest mt-1">
                 <ShieldCheck className="w-4 h-4 animate-pulse" /> Certified Privacy Protected
               </div>
            </div>
            <div className="absolute right-[-5%] bottom-[-10%] opacity-10 transform scale-150 rotate-[-15deg] pointer-events-none select-none">
              <Mail size={240} strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* Right Column: Premium Form Box */}
        <div className="lg:col-span-7 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200/40 dark:border-stone-850/40 p-6 md:p-10 rounded-[30px] shadow-sm animate-in fade-in slide-in-from-right-10 duration-1000 relative">
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in duration-500">
              <div className="w-16 h-16 bg-yellow-600/10 dark:bg-yellow-600/15 border border-yellow-600/20 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle2 className="text-yellow-600 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50 font-heading mb-2">
                Thank You for Subscribing!
              </h3>
              <p className="text-stone-500 dark:text-stone-400 font-sans text-sm sm:text-base max-w-md mb-8 leading-relaxed">
                Your luxury welcome pack, along with your 10% privilege discount code, has been dispatched to your email address.
              </p>
              <Button 
                onClick={() => setIsSuccess(false)}
                className="rounded-full bg-yellow-600 hover:bg-yellow-750 text-white text-sm font-bold px-8 h-11 transition-all active:scale-95 shadow-md hover:shadow-yellow-600/10 cursor-pointer duration-300"
              >
                Subscribe Another Member
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 font-sans flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" /> Full Name
                </Label>
                <div className="relative">
                  <Input 
                    id="fullName" 
                    autoComplete="off"
                    {...register("fullName")}
                    className={`h-12 rounded-lg bg-stone-100/50 dark:bg-stone-950/40 border ${errors.fullName ? "border-red-500 focus-visible:ring-red-500" : "border-stone-200/50 dark:border-stone-850/50 focus-visible:ring-yellow-600"} px-4 text-xs sm:text-sm font-medium transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600`}
                    placeholder="Enter your full name" 
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs font-bold font-sans mt-1">{errors.fullName.message}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 font-sans flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" /> Email Address
                </Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    autoComplete="off"
                    {...register("email")}
                    className={`h-12 rounded-lg bg-stone-100/50 dark:bg-stone-950/40 border ${errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-stone-200/50 dark:border-stone-850/50 focus-visible:ring-yellow-600"} px-4 text-xs sm:text-sm font-medium transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600`}
                    placeholder="john.doe@example.com" 
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs font-bold font-sans mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 font-sans flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" /> Phone Number
                </Label>
                <div className="relative">
                  <Input 
                    id="phone" 
                    type="tel" 
                    autoComplete="off"
                    {...register("phone")}
                    className={`h-12 rounded-lg bg-stone-100/50 dark:bg-stone-950/40 border ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : "border-stone-200/50 dark:border-stone-850/50 focus-visible:ring-yellow-600"} px-4 text-xs sm:text-sm font-medium transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600`}
                    placeholder="Enter phone number (10 to 15 digits)" 
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs font-bold font-sans mt-1">{errors.phone.message}</p>}
              </div>

              {/* Privacy agreement Checkbox Glass Card */}
              <div className="flex items-start space-x-3 p-4 bg-stone-100/50 dark:bg-stone-950/30 border border-stone-200/20 dark:border-stone-850/20 rounded-2xl hover:border-yellow-600/25 transition-all group">
                <input 
                  type="checkbox" 
                  id="privacyAgree" 
                  required
                  defaultChecked
                  className="w-5 h-5 accent-yellow-600 rounded cursor-pointer mt-0.5" 
                />
                <Label htmlFor="privacyAgree" className="text-[11px] sm:text-xs font-bold text-stone-600 dark:text-stone-400 cursor-pointer select-none leading-relaxed">
                  I consent to receive exclusive promotional campaigns, product previews, and event announcements. I can opt-out at any time.
                </Label>
              </div>

              {/* CTA Submit Button */}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 rounded-full bg-yellow-600 hover:bg-yellow-750 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md hover:shadow-yellow-600/10 cursor-pointer duration-300"
              >
                {isSubmitting ? "Processing..." : (
                  <>
                    <Send className="w-4 h-4" /> Request Welcome Invitation
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default SubscribeForm;
