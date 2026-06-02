import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { UploadRes } from "@/schema/response/upload/upload";

const baseUploadApi = "upload-service/file";

export const UploadApi = {
  
  upload_file: async (file: File, uploadedBy: string) => {

    const formData = new FormData();

    formData.append("file", file);

    formData.append("uploadedBy", uploadedBy);

    const res = await axiosInstance.post<ApiResponse<UploadRes>>(
      `${baseUploadApi}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  },

  update_file: async (file: File, uploadedBy: string, oldFileId: number) => {

    const formData = new FormData();

    formData.append("file", file);

    formData.append("uploadedBy", uploadedBy);

    formData.append("oldFileId", oldFileId.toString());

    const res = await axiosInstance.put<ApiResponse<UploadRes>>(
      `${baseUploadApi}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  },
};
