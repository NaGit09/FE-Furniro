"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAppSelector } from "@/stores/hooks";

interface WebSocketContextType {
  client: Client | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/furniro";
const WEBSOCKET_URL = `${baseURL}/message-service/ws`;

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const auth = useAppSelector((state) => state.authSlice);
  const UserID = auth?.UserID;

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    // Only connect when user is logged in
    if (!UserID) {
      if (clientRef.current) {
        console.log(
          "[WebSocketContext] Deactivating STOMP connection due to logout",
        );
        clientRef.current.deactivate();
        clientRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    console.log("[WebSocketContext] Initializing unified STOMP connection");
    const client = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      debug: (str) => {
        console.log("[STOMP Unified]: ", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log("[WebSocketContext] Unified STOMP connection connected");
      setIsConnected(true);
    };

    client.onDisconnect = () => {
      console.log("[WebSocketContext] Unified STOMP connection disconnected");
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.error(
        "[WebSocketContext] STOMP Broker error: " + frame.headers["message"],
      );
      console.error(frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log(
        "[WebSocketContext] Cleaning up/deactivating unified STOMP connection",
      );
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
        setIsConnected(false);
      }
    };
  }, [UserID]);

  return (
    <WebSocketContext.Provider
      value={{ client: clientRef.current, isConnected }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider",
    );
  }
  return context;
}
