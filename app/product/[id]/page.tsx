import ProductDetailClient from "@/components/customs/product/ProductDetailClient";
import { get_product_detail } from "@/services/api/product.service";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await get_product_detail(id);

  const product = res.data;

  return <ProductDetailClient product={product} />;
}
