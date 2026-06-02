"use client";
import { useMemo, useEffect, ReactNode } from "react";
import { Provider, useDispatch } from "react-redux";
import { makeStore } from "../stores/store";
import { getCookie } from "../lib/utils/cookieUtils";
import { login as loginAction } from "../stores/slices/auth.store";
import { UserApi } from "../services/api/Auth/user.service";
import { CartApi } from "../services/api/Order/cart.service";
import { setCart } from "../stores/slices/cart.store";
import { parseJwt } from "../lib/utils/jwt";
import "@/style/Header.css";

function AuthInitializer({ children }: { children: ReactNode }) {

  const dispatch = useDispatch();

  useEffect(() => {

    const token = getCookie("AccessToken") || getCookie("jwt");

    const storedUserId = getCookie("UserID");

    if (token && storedUserId) {

      const userId = Number(storedUserId);

      if (isNaN(userId) || userId <= 0) return;

      const restoreSession = async () => {
        try {
          const res = await UserApi.getUser(userId);
          if (res && res.data) {
            const u = res.data;
            
            dispatch(
              loginAction({
                FirstName: u.firstName,
                LastName: u.lastName,
                UserName: u.firstName || "User",
                Email: getCookie("UserEmail") || "",
                AvatarURL: u.avatar,
                UserID: u.userID,
              }),
            );
          }

          // Decode token and check if the user is an admin
          const decoded = parseJwt(token);

          const role = decoded?.role || decoded?.Role;

          const isAdmin = role && String(role).toUpperCase() === "ADMIN";

          if (!isAdmin) {
            // Proactively retrieve user's cart session
            const cartRes = await CartApi.get_cart(userId);
            
            if (cartRes && cartRes.data) {
              dispatch(
                setCart({
                  cartID: cartRes.data.cartID,
                  items: cartRes.data.items || [],
                }),
              );
            }
          }
        } catch (err) {
          console.error("Failed to restore session details:", err);
        }
      };
      restoreSession();
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function StoreProvider({ children }: { children: ReactNode }) {
  const store = useMemo(() => makeStore(), []);

  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
