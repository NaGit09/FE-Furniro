"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "@/stores/hooks";
import { useWebSocket } from "@/services/socket/socket";
import { MessageApi } from "@/services/api/Message/message.service";
import { ConversationApi } from "@/services/api/Message/conversation.service";
import { ConversationRes } from "@/schema/response/message/Conversation";
import { MessageRes } from "@/schema/response/message/Message";
import { MessageType } from "@/lib/enum/message";
import {
  Send,
  Loader2,
  User,
  MessageSquare,
  ChevronRight,
  Shield,
  Search,
  Hash,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminChatPage() {
  const auth = useAppSelector((state) => state.authSlice);
  const [conversations, setConversations] = useState<ConversationRes[]>([]);
  const [filteredConvs, setFilteredConvs] = useState<ConversationRes[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConv, setActiveConv] = useState<ConversationRes | null>(null);
  const [messages, setMessages] = useState<MessageRes[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoadingConvs, setIsLoadingConvs] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations (both assigned to this staff, and default support staff ID 1)
  const loadConversations = useCallback(async () => {
    if (!auth.UserID) return;
    setIsLoadingConvs(true);
    try {
      // Fetch conversations for the current staff ID
      const res = await ConversationApi.get_all_conversation(auth.UserID);
      let combined: ConversationRes[] = res?.data?.data || [];

      // If the current staff ID is not 1, also fetch conversations for default support ID 1 (unclaimed)
      if (auth.UserID !== 1) {
        const resDefault = await ConversationApi.get_all_conversation(1);
        const defaultConvs = resDefault?.data?.data || [];
        
        // Merge without duplicates
        const existingIds = new Set(combined.map((c) => c.id));
        const uniqueDefaults = defaultConvs.filter((c) => !existingIds.has(c.id));
        combined = [...combined, ...uniqueDefaults];
      }

      // Sort by last message timestamp (latest first)
      combined.sort((a, b) => {
        const dateA = new Date(a.lastMessageAt || a.createdAt).getTime();
        const dateB = new Date(b.lastMessageAt || b.createdAt).getTime();
        return dateB - dateA;
      });

      setConversations(combined);
      setFilteredConvs(combined);
    } catch (err) {
      console.error("Failed to load conversations:", err);
      toast.error("Failed to fetch customer conversations");
    } finally {
      setIsLoadingConvs(false);
    }
  }, [auth.UserID]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Search filter
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setFilteredConvs(conversations);
    } else {
      const filtered = conversations.filter(
        (c) =>
          c.id.toString().includes(q) ||
          c.buyerId.toString().includes(q) ||
          (c.lastMessageContent && c.lastMessageContent.toLowerCase().includes(q))
      );
      setFilteredConvs(filtered);
    }
  }, [searchQuery, conversations]);

  // Load message history on active conversation select
  const loadMessages = useCallback(async (convId: number) => {
    setIsLoadingMessages(true);
    try {
      const res = await MessageApi.get_message_by_conversation(convId);
      if (res?.data?.data?.content) {
        // Reverse array if backend returns latest first
        setMessages(res.data.data.content.slice().reverse());
      }
    } catch (err) {
      console.error("Failed to load message history:", err);
      toast.error("Failed to fetch conversation history");
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (activeConv) {
      loadMessages(activeConv.id);
    } else {
      setMessages([]);
    }
  }, [activeConv, loadMessages]);

  // Handle incoming real-time socket messages
  const handleIncomingMessage = useCallback(
    (newMsg: MessageRes) => {
      if (activeConv) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === newMsg.id);
          if (exists) return prev;
          return [...prev, newMsg];
        });

        // Update the last message in the left-side conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConv.id
              ? {
                  ...c,
                  lastMessageContent: newMsg.content,
                  lastMessageAt: newMsg.createdAt as any,
                }
              : c
          )
        );
      }
    },
    [activeConv]
  );

  // Initialize socket client
  const { isConnected, sendMessage } = useWebSocket(
    activeConv ? activeConv.id : null,
    handleIncomingMessage
  );

  // Send Message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv || !auth.UserID) return;

    const payload: MessageRes = {
      conversationId: activeConv.id,
      content: inputText,
      senderId: auth.UserID,
      receiverId: activeConv.buyerId,
      messageType: MessageType.TEXT,
      createdAt: new Date().toISOString(),
    };

    // Send payload over WebSocket
    sendMessage({
      conversationId: payload.conversationId!,
      senderId: payload.senderId,
      receiverId: payload.receiverId,
      content: payload.content,
      messageType: payload.messageType as any,
    });

    // Update left-side list preview
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? {
              ...c,
              lastMessageContent: inputText,
              lastMessageAt: payload.createdAt as any,
            }
          : c
      )
    );

    setInputText("");
  };

  return (
    <div className="flex h-[calc(100vh-140px)] w-full gap-6 overflow-hidden">
      {/* 1. Left Panel - Conversations List */}
      <div className="w-80 xl:w-96 bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/40 rounded-2xl flex flex-col overflow-hidden shrink-0 shadow-sm">
        
        {/* Header Search */}
        <div className="p-4 border-b border-stone-200/60 dark:border-stone-800/40 bg-stone-50/40 dark:bg-stone-950/20 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h3 className="font-serif font-bold text-sm text-stone-850 dark:text-stone-100 uppercase tracking-wider">
              Support Conversations
            </h3>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500" />
            <input
              type="text"
              placeholder="Search Customer ID or Room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-100/50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold outline-none focus:border-amber-600 transition"
            />
          </div>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoadingConvs ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 dark:text-stone-500 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
              <span className="text-xs">Fetching sessions...</span>
            </div>
          ) : filteredConvs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-stone-400 dark:text-stone-550 gap-2">
              <MessageSquare className="w-8 h-8 opacity-30 text-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                No active requests
              </span>
            </div>
          ) : (
            filteredConvs.map((conv) => {
              const active = activeConv?.id === conv.id;
              const isUnclaimed = conv.staffId === 1 && auth.UserID !== 1;
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className={`w-full text-left p-3.5 rounded-xl transition flex items-center justify-between border cursor-pointer ${
                    active
                      ? "bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/15"
                      : "bg-transparent border-transparent hover:bg-stone-100/55 dark:hover:bg-stone-800/40 text-stone-800 dark:text-stone-200"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                        active 
                          ? "bg-white/20 border-white/30 text-white" 
                          : isUnclaimed
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                          : "bg-stone-100 border-stone-200 text-stone-700 dark:bg-stone-850 dark:border-stone-750 dark:text-stone-300"
                      }`}>
                        {isUnclaimed ? "🆕" : "👤"}
                      </div>
                      {!active && (
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white dark:ring-stone-900 ${
                          isUnclaimed ? "bg-rose-500 animate-pulse" : "bg-emerald-500"
                        }`} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate flex items-center gap-1.5">
                        <span>Customer #{conv.buyerId}</span>
                        {isUnclaimed && (
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                            active ? "bg-white/20 text-white" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                          }`}>
                            NEW
                          </span>
                        )}
                      </h4>
                      <p className={`text-[10px] truncate mt-1 leading-snug ${
                        active ? "text-white/80" : "text-stone-400 dark:text-stone-500"
                      }`}>
                        {conv.lastMessageContent || "Click to begin conversation."}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                    active ? "translate-x-0.5 text-white" : "text-stone-400 dark:text-stone-500"
                  }`} />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Right Panel - Selected Chat Log */}
      <div className="flex-1 bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/40 rounded-2xl flex flex-col overflow-hidden shadow-sm">
        {activeConv ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Active Chat Header */}
            <div className="p-4 bg-stone-900 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center border border-amber-500/20 shadow">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Customer Support Session</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Hash className="w-3 h-3 text-amber-500" />
                      Room {activeConv.id}
                    </span>
                    <span className="text-[10px] text-stone-400 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-amber-500" />
                      Client: #{activeConv.buyerId}
                    </span>
                    {activeConv.lastMessageAt && (
                      <span className="text-[10px] text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        Last Active: {new Date(activeConv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isConnected ? "bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse" : "bg-amber-500 animate-pulse"
                }`} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-300">
                  {isConnected ? "Active Tunnel" : "Connecting..."}
                </span>
              </div>
            </div>

            {/* Chat Messages Logs */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/30 dark:bg-stone-950/10">
              {isLoadingMessages ? (
                <div className="h-full flex items-center justify-center gap-2 text-stone-400 dark:text-stone-500">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                  <span className="text-xs">Loading message logs...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-400 dark:text-stone-550 gap-2">
                  <Sparkles className="w-8 h-8 text-amber-500 opacity-20" />
                  <span className="text-xs uppercase tracking-wider opacity-60 font-semibold">
                    No conversation history.
                  </span>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.senderId === auth.UserID;
                  return (
                    <div
                      key={msg.id || index}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm border leading-relaxed ${
                          isMe
                            ? "bg-amber-600 border-amber-500 text-white rounded-br-none"
                            : "bg-white border-stone-200/50 text-stone-850 rounded-bl-none dark:bg-stone-950 dark:border-stone-850 dark:text-stone-200"
                        }`}
                      >
                        <p className="break-words font-medium">{msg.content}</p>
                        {msg.createdAt && (
                          <span className={`text-[9px] block text-right mt-1.5 opacity-60 ${
                            isMe ? "text-white" : "text-stone-400 dark:text-stone-500"
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-stone-200/60 dark:border-stone-800/40 bg-white dark:bg-stone-900 flex gap-3.5"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={!isConnected}
                placeholder={
                  isConnected
                    ? "Type customer service response..."
                    : "Connecting to secure WebSocket channel..."
                }
                className="flex-1 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 px-4 py-3 rounded-xl text-sm outline-none focus:border-amber-600 transition disabled:opacity-50 font-medium text-stone-800 dark:text-stone-200"
              />
              <button
                type="submit"
                disabled={!isConnected || !inputText.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 rounded-xl transition disabled:opacity-40 shadow-md active:scale-95 flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>

          </div>
        ) : (
          /* Empty Active Panel State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-450 dark:text-stone-500">
            <div className="w-16 h-16 rounded-2xl bg-amber-600/10 flex items-center justify-center mb-4 border border-amber-600/20 shadow-sm animate-pulse">
              <MessageSquare className="w-8 h-8 text-amber-600" />
            </div>
            <h4 className="font-serif font-bold text-stone-800 dark:text-stone-200 text-lg uppercase tracking-wide">
              Admin Support Desk
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 max-w-[260px] leading-relaxed">
              Select an active customer conversation from the list to start responding in real-time. New queries will display a badge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
