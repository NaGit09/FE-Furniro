import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { NotificationRes } from "@/schema/response/message/Notification";
import { NotificationReq } from "@/schema/request/message/Notification";
import { Page } from "@/schema/common/pagination";

const Base_url = "message-service/notification";

export const NotificationApi = {
  get_notifications: async (params: NotificationReq) => {
    return await axiosInstance.get<ApiResponse<Page<NotificationRes>>>(
      Base_url,
      { params }
    );
  },

  read_notification: async (notificationId: number) => {
    return await axiosInstance.patch<ApiResponse<boolean>>(
      `${Base_url}/${notificationId}/read`
    );
  },
};
