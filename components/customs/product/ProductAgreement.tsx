import { PhoneCall, ShieldCheck, Trophy, Truck } from 'lucide-react'
import React from 'react'

const ProductAgreement = () => {
    const agreement = [
      {
        icon: Trophy,
        title: "High Quality",
        description: "crafted from top materials",
      },
      {
        icon: ShieldCheck,
        title: "Warranty Protection",
        description: "1 year warranty",
      },
      {
        icon: Truck,
        title: "Free Shipping",
        description: "on all orders",
      },
      {
        icon: PhoneCall,
        title: "24/7 Support",
        description: "Dedicated support",
      },
    ];
  return (
      <div className='h-[270px] px-20 w-full bg-amber-50 flex items-center justify-between'>
          {agreement.map((item, index) => (
              <div key={index} className='flex items-center gap-4'>
                  <item.icon className='w-15 h-15' />
                  <div className='flex flex-col'>
                      <h3 className='font-bold text-black text-xl'>{item.title}</h3>
                      <p className='text-gray-500 text-lg'>{item.description}</p>
                  </div>
              </div>
          ))}
      </div>
  )
}

export default ProductAgreement