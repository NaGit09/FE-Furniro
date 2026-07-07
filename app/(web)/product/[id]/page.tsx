import ProductDetailClient from "@/components/customs/product/ProductDetailClient";
import { ProductApi } from "@/services/api/Product/product.service";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product = null;
  try {
    const res = await ProductApi.get_product_detail(id);
    product = res?.data || null;
  } catch (error) {
    console.error("Failed to fetch product detail:", error);
  }

  return <ProductDetailClient product={product} />;
}
