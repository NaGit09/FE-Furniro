import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { Subscribe } from "@/schema/request/message/Subcribe";
import { SubcribeRes } from "@/schema/response/message/Subscribe";
import { Page } from "@/schema/common/pagination";

const Base_url = "message-service/subscribe";

export const SubscriptionApi = {
    // For user
    subscribe: async (subscribeData: Subscribe) => {
        return await axiosInstance.post<ApiResponse<boolean>>(
            `${Base_url}`,
            subscribeData,
        );

    },
    // For admin
    get_all_subscribe: async () => {
        return await axiosInstance.get<ApiResponse<Page<SubcribeRes>>>(
            `${Base_url}/all`,
        );
    }
}