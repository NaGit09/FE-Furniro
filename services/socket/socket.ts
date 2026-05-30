import { MessageReq } from "@/schema/request/message/Message";
import { MessageRes } from "@/schema/response/message/Message";
import { Client, IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/furniro";

const WEBSOCKET_URL = `${baseURL}/message-service/ws`;

export const useWebSocket = (
  conversationId: number | null,

  onMessageReceived: (msg: MessageRes) => void,
) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    // 1. Initialize STOMP Client with SockJS fallback

    const client = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),

      debug: (str) => {
        console.log("[STOMP]: ", str);
      },

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setIsConnected(true);

      const topic = `/topic/conversation/${conversationId}`;

      client.subscribe(topic, (message: IMessage) => {
        if (message.body) {
          const parsedMessage: MessageRes = JSON.parse(message.body);
          onMessageReceived(parsedMessage);
        }
      });
    };

    client.onDisconnect = () => {
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    client.activate();

    stompClientRef.current = client;

    // 3. Clean up on unmount or when conversation changes
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [conversationId, onMessageReceived]);

  // 4. Send Message via Socket
  // Maps to backend: "/app/chat.sendMessage"
  const sendMessage = useCallback((payload: MessageReq) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: "/app/chat.sendMessage",

        body: JSON.stringify(payload),
      });
    } else {
      console.warn("STOMP client is not connected.");
    }
  }, []);
  return { isConnected, sendMessage };
};
