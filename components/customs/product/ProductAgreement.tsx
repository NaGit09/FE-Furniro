import { PhoneCall, ShieldCheck, Trophy, Truck } from "lucide-react";
import React from "react";

const ProductAgreement = () => {
  const agreement = [
    {
      Icon: Trophy,
      title: "Chất lượng cao",
      description: "Được chế tác từ gỗ & vật liệu cao cấp",
    },
    {
      Icon: ShieldCheck,
      title: "Bảo hành 1 đổi 1",
      description: "Chính sách bảo hành lên tới 2 năm",
    },
    {
      Icon: Truck,
      title: "Miễn phí vận chuyển",
      description: "Cho mọi đơn hàng nội thành trên toàn quốc",
    },
    {
      Icon: PhoneCall,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ chăm sóc khách hàng chuyên biệt",
    },
  ];

  return (
    <section className="w-full bg-stone-100/50 dark:bg-stone-900/30 border-t border-stone-200/30 dark:border-stone-850/30 py-10 md:py-14 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {agreement.map((item, index) => {
            const Icon = item.Icon;
            return (
              <div
                key={index}
                className="flex items-center gap-5 group transition-all duration-350 hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Gold Translucent Icon Shell */}
                <div className="p-3.5 rounded-2xl bg-yellow-600/10 dark:bg-yellow-600/15 border border-yellow-600/10 transition-all duration-500 group-hover:bg-yellow-600 group-hover:border-yellow-600 group-hover:shadow-[0_10px_25px_rgba(202,138,4,0.3)]">
                  <div className="transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-105">
                    <Icon className="w-8 h-8 text-yellow-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>

                <div className="flex flex-col gap-0.5">
                  <h4 className="text-base sm:text-lg font-bold font-sans text-stone-900 dark:text-stone-50 tracking-tight group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-stone-500 dark:text-stone-400 font-sans leading-tight">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductAgreement;