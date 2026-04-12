import Image from "next/image";

const ContactHero = () => {
  return (
    <div className="w-full h-[600px] relative overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <Image
        src="/images/contact-hero.png"
        alt="Contact Furniro"
        fill
        priority
        className="object-cover z-0 brightness-[0.85] transition-transform duration-1000 hover:scale-110"
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl italic tracking-tighter">
          Let's <span className="text-yellow-600">Connect</span>
        </h1>
        <div className="h-1.5 w-32 bg-yellow-600 mx-auto mb-8 rounded-full shadow-lg" />
        <p className="text-xl md:text-2xl text-white font-bold max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
          Your journey to a beautiful home begins with a simple conversation.
        </p>
      </div>
      
      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-white/95 to-transparent z-5" />
    </div>
  );
};

export default ContactHero;
