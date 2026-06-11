import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { MessageRes } from "@/schema/response/message/Message";
import { Page } from "@/schema/common/pagination";

const Base_url = "message-service/message";


export const MessageApi = {

  read_message: async (messageId: number) => {
    return await axiosInstance.patch<ApiResponse<boolean>>(
      `${Base_url}/${messageId}/read`
    );
  },

  get_message_by_conversation: async (conversationId: number) => {
    return await axiosInstance.get<ApiResponse<Page<MessageRes>>>(
      `${Base_url}?conversationID=${conversationId}`
    );
  },
};
 