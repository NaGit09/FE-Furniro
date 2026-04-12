"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductDetail } from "@/schema/response/product.res";
import { get_product_detail } from "@/services/api/product.service";
import ProductImageGallery from "@/components/customs/product/ProductImageGallery";
import ProductInformation from "@/components/customs/product/ProductInformation";
import PageNavigate from "@/components/customs/common/PageNavigate";
import { Separator } from "@/components/ui/separator";
import ProductDescription from "@/components/customs/product/ProductDescription";
import ProductListCard from "@/components/customs/product/ProductListCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await get_product_detail(id as string);
        setProduct(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center mt-10">Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="w-full mx-auto flex flex-col mt-15">
      <PageNavigate
        title={product.name}
        category="Product"
        id={product.productId.toString()}
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
          <ProductListCard page={1} size={4} />
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
