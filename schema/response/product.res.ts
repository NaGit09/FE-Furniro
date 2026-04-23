import { z } from "zod";

enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export const ProductCardResSchema = z.object({

  productID: z.number(),
  name: z.string(),
  status: z.enum(ProductStatus),
  brand: z.string(),
  description: z.string(),
  basePrice: z.number(),
  url: z.string(),
});

export type ProductCardRes = z.infer<typeof ProductCardResSchema>;


export const ProductDetailSchema = z.object({
  productId: z.number().int().positive(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description should be longer"),
  basePrice: z.number().nonnegative(),

  brand: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]),

  categoryName: z.string(),

  images: z.array(z.url("Must be a valid URL")),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  skus: z.array(z.string()),

  width: z.number().positive(),
  height: z.number().positive(),
  depth: z.number().positive(),
  weight: z.number().positive(),

  material: z.string(),
  configuration: z.string(),

  warrantyType: z.string(),
  warrantyDuration: z.string(),
  warrantySummary: z.string(),
});

export type ProductDetail = z.infer<typeof ProductDetailSchema>;

