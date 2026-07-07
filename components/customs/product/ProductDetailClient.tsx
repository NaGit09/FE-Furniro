"use client";

import Link from "next/link";
import { ProductDetail } from "@/schema/response/product/product.res";
import ProductImageGallery from "./ProductImageGallery";
import ProductInformation from "./ProductInformation";
import PageNavigate from "../common/PageNavigate";
import { Separator } from "@/components/ui/separator";
import ProductDescription from "./ProductDescription";
import ProductListCard from "./ProductListCard";
import { Button } from "@/components/ui/button";
import ProductAgreement from "./ProductAgreement";

export default function ProductDetailClient({
  product,
}: {
  product: ProductDetail | null;
}) {
  if (!product) {
    return (
      <div className="text-center py-20 font-sans text-stone-500">
        Không tìm thấy thông tin chi tiết sản phẩm.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto flex flex-col bg-stone-50 dark:bg-stone-950 min-h-screen">
      {/* Dynamic Glass Breadcrumbs */}
      <PageNavigate
        title={product.name}
        category="Product"
        id={product.productID || product.productId || 0}
      />

      {/* Main Showcase Grid */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
        <ProductImageGallery images={product.images || []} />
        <ProductInformation data={product} />
      </div>

      <Separator className="max-w-7xl mx-auto opacity-50 my-4" />

      {/* Specifications & Tech Details */}
      <ProductDescription data={product} />

      <Separator className="max-w-7xl mx-auto opacity-50 my-6" />

      {/* Related Products Showcase */}
      <div className="w-full mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-center flex-col items-center text-center mb-10">
          <h6 className="text-xs font-bold tracking-[0.25em] text-yellow-600 dark:text-yellow-500 uppercase mb-2">
            Showcase liên quan
          </h6>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight mb-2">
            Sản phẩm <span className="text-yellow-600 italic font-medium font-heading">Tương tự</span>
          </h2>
          <div className="h-0.5 w-16 bg-yellow-600 rounded-full mt-2" />
        </div>

        <ProductListCard limit={4} autoFetch={true} />

        <div className="flex justify-center mt-8 mb-10">
          <Link href="/product">
            <Button
              className="h-12 px-8 text-yellow-600 border-yellow-600 hover:bg-yellow-600 hover:text-white rounded-full font-bold shadow-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              variant="outline"
            >
              Xem thêm sản phẩm
            </Button>
          </Link>
        </div>
      </div>

      {/* Trust Deck Agreement */}
      <ProductAgreement />
    </div>
  );
}
