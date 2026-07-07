import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  FirstName: string;
  LastName: string;
  UserName: string;
  Email: string;
  AvatarURL: string;
  UserID: number | null;
}

const initAuthSlice: AuthState = {
  isLoggedIn: false,
  FirstName: "",
  LastName: "",
  UserName: "Guest",
  Email: "",
  AvatarURL: "",
  UserID: null,
};

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
      state.AvatarURL = action.payload.AvatarURL || action.payload.AvatarUrl;
      state.UserID =
        action.payload.accountID ||
        action.payload.UserID ||
        action.payload.userID ||
        action.payload.id ||
        null;
    },
    register: (state, action) => {
      state.isLoggedIn = true;
      state.FirstName = action.payload.FirstName;
      state.LastName = action.payload.LastName;
      state.UserName = action.payload.UserName;
      state.Email = action.payload.Email;
      state.AvatarURL = action.payload.AvatarURL || action.payload.AvatarUrl;
      state.UserID =
        action.payload.accountID ||
        action.payload.UserID ||
        action.payload.userID ||
        action.payload.id ||
        null;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.FirstName = "";
      state.LastName = "";
      state.UserName = "Guest";
      state.Email = "";
      state.AvatarURL = "";
      state.UserID = null;
    },
  },
});

export const { login, register, logout } = authSlice.actions;
export default authSlice.reducer;
