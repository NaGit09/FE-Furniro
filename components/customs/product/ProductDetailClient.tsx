"use client";

import { ProductDetail } from "@/schema/response/product.res";
import ProductImageGallery from "./ProductImageGallery";
import ProductInformation from "./ProductInformation";
import PageNavigate from "../common/PageNavigate";
import { Separator } from "@/components/ui/separator";
import ProductDescription from "./ProductDescription";
import ProductListCard from "./ProductListCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductDetailClient({
  product,
}: {
  product: ProductDetail;
}) {
  if (!product) {
    return <div className="text-center mt-10">Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="w-full mx-auto flex flex-col mt-15">
      <PageNavigate
        title={product.name}
        category="Product"
        id={product.productId}
      />

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
        <ProductImageGallery images={product.images} />
        <ProductInformation data={product} />
      </div>

      <Separator />
      <ProductDescription data={product} />

      <div className="w-full mx-auto p-6">
        <div className="flex justify-center flex-col items-center mb-6">
          <h2 className="text-3xl font-bold">Related Products</h2>

          <ProductListCard />

          <Link href="/product">
            <Button
              className="mt-6 text-yellow-700 border-yellow-700 rounded-md w-40 h-10 hover:bg-yellow-700 hover:text-white"
              variant="outline"
            >
              Show more
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
