import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import {PromotionRes } from "@/schema/response/message/Promotion";
import { PromotionReq } from "@/schema/request/message/Promotion";
import { Page } from "@/schema/common/pagination";

export const Base_url = "message-service/promotion";
export const PromotionApi = {

    create_promotion: async (data: PromotionReq) => {
        return await axiosInstance.post<ApiResponse<PromotionRes>>(
            `${Base_url}`,
            data
        );
    },

    get_all_promotion: async () => {
        return await axiosInstance.get<ApiResponse<Page<PromotionRes>>>(
            `${Base_url}`,
        );
    }
}