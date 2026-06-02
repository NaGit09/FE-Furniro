import { z } from 'zod';

export const UploadResSchema = z.object({
  id: z.number().optional(),
  fileId: z.number().optional(),
  fileName: z.string().optional(),
  url: z.string().optional(),
  fileUrl: z.string().optional(),
  uploadedBy: z.string().optional(),
  uploadedAt: z.string().optional(),
});

export type UploadRes = z.infer<typeof UploadResSchema>;
