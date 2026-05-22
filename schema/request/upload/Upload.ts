import { z } from 'zod';

export const UploadReqSchema = z.object({
  file: z.instanceof(File),
  uploadedBy: z.string(),
});

export const UpdateUploadReqSchema = z.object({
  file: z.instanceof(File),
  uploadedBy: z.string(),
  oldFileId: z.number(),
});

export type UpdateUploadReq = z.infer<typeof UpdateUploadReqSchema>;

export type UploadReq = z.infer<typeof UploadReqSchema>;