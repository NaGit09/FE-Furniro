import { IMessage } from "@stomp/stompjs";
import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/stores/hooks";
import { toast } from "sonner";
import { useWebSocketContext } from "../../app/WebSocketContext";
import { NotificationApi } from "@/services/api/Message/notification.service";
import { NotificationRes } from "@/schema/response/message/Notification";

export type NotificationItem = NotificationRes;

export const useNotifications = () => {
  const auth = useAppSelector((state) => state.authSlice);
  const UserID = auth?.UserID;

  const { client, isConnected } = useWebSocketContext();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 1. Fetch initial notifications list
  const fetchNotifications = useCallback(async () => {
    if (!UserID) return;
    setLoading(true);
    try {
      const response = await NotificationApi.get_notifications({
        receiverID: UserID,
        page: 0,
        size: 15,
        sortBy: "createdAt",
      });
      
      if (response.data && response.data.data && response.data.data.content) {
        setNotifications(response.data.data.content);
      }
    } catch (error: any) {
      // 404 is returned when there are no notifications in the DB.
      // We handle it gracefully by clearing the notifications list.
      if (error.response?.status === 404) {
        setNotifications([]);
      } else {
        console.error("Error fetching notifications:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [UserID]);

  // 2. Mark notification as read
  const markAsRead = useCallback(async (id: number) => {
    try {
      await NotificationApi.read_notification(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  // 3. Connect/Subscribe
  useEffect(() => {
    if (!UserID) {
      setNotifications([]);
      return;
    }

    // Load existing notifications
    fetchNotifications();

    if (!client || !isConnected) return;

    const topic = `/topic/notifications/${UserID}`;

    const subscription = client.subscribe(topic, (message: IMessage) => {
      if (message.body) {
        try {
          const parsed = JSON.parse(message.body);
          
          // Map the parsed JSON payload to our NotificationItem structure
          const newNotify: NotificationItem = {
            id: parsed.id || Date.now(),
            userID: parsed.userID,
            type: (parsed.type || "system").toLowerCase(),
            title: parsed.title || "Notification",
            content: parsed.content || parsed.message || "",
            isRead: parsed.isRead || false,
            createdAt: parsed.createdAt || new Date().toISOString(),
            updatedAt: parsed.updatedAt || new Date().toISOString(),
          };

          // Add to state
          setNotifications((prev) => [newNotify, ...prev]);

          // Trigger sonner toast alert
          toast.info(newNotify.title, {
            description: newNotify.content,
            duration: 5000,
          });
        } catch (err) {
          console.error("Failed to parse incoming WS notification:", err);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [UserID, client, isConnected, fetchNotifications]);

  return {
    notifications,
    loading,
    isConnected,
    markAsRead,
    refresh: fetchNotifications,
  };
};

