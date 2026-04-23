import ProductPage from "@/components/customs/product/ProductPage";
import { get_product_list } from "@/services/api/product.service";

export default async function Page() {
  const res = await get_product_list(0, 10);

  const data = res.data;

  return <ProductPage initialData={data} />;
}
