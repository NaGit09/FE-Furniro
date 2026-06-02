import { z } from "zod";

const status = z.enum(["ACTIVE", "INACTIVE"]);

export const ProductCardResSchema = z.object({
  productID: z.number(),
  name: z.string(),
  status: status,
  brand: z.string(),
  description: z.string(),
  basePrice: z.number(),
  url: z.string(),
});

export type ProductCardRes = z.infer<typeof ProductCardResSchema>;

export const ProductDetailSchema = z.object({
  productId: z.number().int().positive().optional(),
  productID: z.number().int().positive().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description should be longer"),
  basePrice: z.number().nonnegative(),

  brand: z.string(),
  status: status,

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

export const ProductCompareResSchema = z.object({
  productID: z.number(),
  name: z.string(),
  basePrice: z.number(),
  image: z.string(),
  width: z.number(),
  height: z.number(),
  depth: z.number(),
  weight: z.number(),
  material: z.string(),
  warranty: z.string(),
});

export type ProductCompareRes = z.infer<typeof ProductCompareResSchema>;

export const CategoryResSchema = z.object({
  categoryID: z.number(),
  categoryName: z.string(),
  subCategories: z.array(
    z.object({
      categoryID: z.number(),
      categoryName: z.string(),
      subCategories: z.array(z.any()),
    }),
  ),
});

export type CategoryRes = z.infer<typeof CategoryResSchema>;
