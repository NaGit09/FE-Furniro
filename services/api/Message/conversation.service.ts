import { ApiResponse } from "@/schema/common/AType";
import { ConversationReq } from "@/schema/request/message/Converstaion";
import { ConversationRes } from "@/schema/response/message/Conversation";
import axiosInstance from "@/services/AxiosInstance";

const Base_url = "message-service/conversation";

export const ConversationApi = {
    
    
    create_conversation: async (conversationReq: ConversationReq) => {
        return await axiosInstance.post<ApiResponse<ConversationRes>>(
            `${Base_url}/create`,
            conversationReq,
        );
    },

    get_all_conversation: async (userId: number) => {
        return await axiosInstance.get<ApiResponse<ConversationRes[]>>(
            `${Base_url}/all/${userId}`,
        );
    }

};
