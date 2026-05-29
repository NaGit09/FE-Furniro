"use client";
import { useRef, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { makeStore, AppStore } from "../stores/store";
import { getCookie } from "../lib/utils/cookieUtils";
import { login as loginAction } from "../stores/slices/auth.store";
import { UserApi } from "../services/api/Auth/user.service";
import { CartApi } from "../services/api/Order/cart.service";
import { setCart } from "../stores/slices/cart.store";
import "./Header.css";

function AuthInitializer({ children }: { children: React.ReactNode }) {
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
              })
            );
          }

          // Proactively retrieve user's cart session
          const cartRes = await CartApi.get_cart(userId);
          if (cartRes && cartRes.data) {
            dispatch(
              setCart({
                cartID: cartRes.data.cartID,
                items: cartRes.data.items || [],
              })
            );
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

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
