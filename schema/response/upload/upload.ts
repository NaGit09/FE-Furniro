import { z } from 'zod';

export const UploadResSchema = z.object({
  fileId: z.number(),
  fileName: z.string(),
  fileUrl: z.string(),
  uploadedBy: z.string(),
  uploadedAt: z.string(),
});

export type UploadRes = z.infer<typeof UploadResSchema>;
