import axiosInstance from "@/services/AxiosInstance";
import { ApiResponse } from "@/schema/common/AType";
import { Address } from "@/schema/response/auth/address.res";

export const getAddress = async () => {
    try {
        const res = await axiosInstance.get<ApiResponse<Address[]>>(
            "/address",
        );
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
