
const baseAuthURL = "/auth-service/account";
export const AUTH_URL = {
    
    LOGIN: `${baseAuthURL}/login`,

    REGISTER: `${baseAuthURL}/register`,

    ACTIVE: `${baseAuthURL}/active`,

    LOGOUT: `${baseAuthURL}/logout`,

    REFRESH: `${baseAuthURL}/refresh`,

    SEND_OTP: `${baseAuthURL}/send-otp`,

    CONFIRM_OTP: `${baseAuthURL}/confirm-otp`,

    CHANGE_PASSWORD: `${baseAuthURL}/change-password`,
}