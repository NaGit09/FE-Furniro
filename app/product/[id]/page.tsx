import ProductDetailClient from "@/components/customs/product/ProductDetailClient";
import { ProductApi } from "@/services/api/Product/product.service";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await ProductApi.get_product_detail(id);

  const product = res.data;

  return <ProductDetailClient product={product} />;
}
