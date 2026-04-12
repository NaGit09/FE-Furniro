import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
    isLoggedIn: boolean;
    FirstName: String;
    LastName: String;
    UserName: String;
    Email: String;
    AvatarURL: String;
}

const initAuthSlice: AuthState = {
    isLoggedIn: false,
    FirstName: "",
    LastName: "",
    UserName: "Guest",
    Email: "",
    AvatarURL: "",
}

const authSlice = createSlice({
    name: "auth",
    initialState: initAuthSlice,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.FirstName = action.payload.FirstName;
            state.LastName = action.payload.LastName;
            state.UserName = action.payload.UserName;
            state.Email = action.payload.Email;
            state.AvatarURL = action.payload.AvatarURL;
        },
        register: (state, action) => {
            state.isLoggedIn = true;
            state.FirstName = action.payload.FirstName;
            state.LastName = action.payload.LastName;
            state.UserName = action.payload.UserName;
            state.Email = action.payload.Email;
            state.AvatarURL = action.payload.AvatarURL;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.FirstName = "";
            state.LastName = "";
            state.UserName = "Guest";
            state.Email = "";
            state.AvatarURL = "";
        }
    }
})

export const { login, register, logout } = authSlice.actions;
export default authSlice.reducer;
