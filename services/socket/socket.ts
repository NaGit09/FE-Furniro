import { MessageReq } from "@/schema/request/message/Message";
import { MessageRes } from "@/schema/response/message/Message";
import { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect } from "react";
import { useWebSocketContext } from "../../app/WebSocketContext";

export const useWebSocket = (
  conversationId: number | null,
  onMessageReceived: (msg: MessageRes) => void,
) => {
  const { client, isConnected } = useWebSocketContext();

  useEffect(() => {
    if (!conversationId || !client || !isConnected) return;

    const topic = `/topic/conversation/${conversationId}`;

    const subscription = client.subscribe(topic, (message: IMessage) => {
      if (message.body) {
        const parsedMessage: MessageRes = JSON.parse(message.body);
        onMessageReceived(parsedMessage);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, client, isConnected, onMessageReceived]);

  // Send Message via Socket
  // Maps to backend: "/app/chat.sendMessage"
  const sendMessage = useCallback((payload: MessageReq) => {
    if (client && client.connected) {
      client.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(payload),
      });
    } else {
      console.warn("STOMP client is not connected.");
    }
  }, [client]);

  return { isConnected, sendMessage };
};

