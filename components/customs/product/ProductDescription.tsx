import { ProductDetail } from "@/schema/response/product/product.res";
import React from "react";
import { FileText, Ruler, ShieldCheck } from "lucide-react";

interface ProductDescriptionProps {
  data: ProductDetail;
}

const ProductDescription = ({ data }: ProductDescriptionProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Description Card */}
        <div className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-md rounded-[28px] border border-stone-200/40 dark:border-stone-850/40 p-8 shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-yellow-600/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-yellow-600/10 dark:bg-yellow-600/15 rounded-2xl flex items-center justify-center border border-yellow-600/10">
              <FileText className="text-yellow-600 w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight">
              Mô tả sản phẩm
            </h2>
          </div>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-sans font-medium text-sm sm:text-base">
            {data.description || "Chưa có thông tin mô tả chi tiết."}
          </p>
        </div>

        {/* Dimensions Card */}
        <div className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-md rounded-[28px] border border-stone-200/40 dark:border-stone-850/40 p-8 shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-yellow-600/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-yellow-600/10 dark:bg-yellow-600/15 rounded-2xl flex items-center justify-center border border-yellow-600/10">
              <Ruler className="text-yellow-600 w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight">
              Kích thước & Trọng lượng
            </h2>
          </div>
          <div className="space-y-3.5 text-sm sm:text-base font-sans font-medium">
            <div className="flex justify-between border-b border-stone-200/40 dark:border-stone-800/40 pb-2">
              <span className="text-stone-400 dark:text-stone-500">Chiều cao:</span>
              <span className="text-stone-800 dark:text-stone-100 font-semibold">{data.height} cm</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/40 dark:border-stone-800/40 pb-2">
              <span className="text-stone-400 dark:text-stone-500">Chiều rộng:</span>
              <span className="text-stone-800 dark:text-stone-100 font-semibold">{data.width} cm</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/40 dark:border-stone-800/40 pb-2">
              <span className="text-stone-400 dark:text-stone-500">Chiều sâu:</span>
              <span className="text-stone-800 dark:text-stone-100 font-semibold">{data.depth} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400 dark:text-stone-500">Trọng lượng:</span>
              <span className="text-stone-800 dark:text-stone-100 font-semibold">{data.weight} kg</span>
            </div>
          </div>
        </div>

        {/* Warranty Card */}
        <div className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-md rounded-[28px] border border-stone-200/40 dark:border-stone-850/40 p-8 shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-yellow-600/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-yellow-600/10 dark:bg-yellow-600/15 rounded-2xl flex items-center justify-center border border-yellow-600/10">
              <ShieldCheck className="text-yellow-600 w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight">
              Chính sách bảo hành
            </h2>
          </div>
          <div className="space-y-3.5 text-sm sm:text-base font-sans font-medium">
            <div className="flex justify-between border-b border-stone-200/40 dark:border-stone-800/40 pb-2">
              <span className="text-stone-400 dark:text-stone-500">Loại bảo hành:</span>
              <span className="text-stone-800 dark:text-stone-100 font-semibold">{data.warrantyType || "Bảo hành chính hãng"}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/40 dark:border-stone-800/40 pb-2">
              <span className="text-stone-400 dark:text-stone-500">Thời gian:</span>
              <span className="text-stone-800 dark:text-stone-100 font-semibold">{data.warrantyDuration || "12 tháng"}</span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-stone-400 dark:text-stone-500 shrink-0">Chi tiết:</span>
              <span className="text-stone-800 dark:text-stone-100 font-semibold text-right text-xs leading-relaxed">
                {data.warrantySummary || "Bảo hành các lỗi từ nhà sản xuất, hỗ trợ vận chuyển và lắp đặt tận nơi."}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDescription;
