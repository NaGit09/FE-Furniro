/* eslint-disable @typescript-eslint/no-explicit-any */
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
  MessageCircle,
  X,
  Send,
  Loader2,
  Sparkles,
  User,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function ChatWidget() {
  const auth = useAppSelector((state) => state.authSlice);
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationRes[]>([]);
  const [activeConv, setActiveConv] = useState<ConversationRes | null>(null);
  const [messages, setMessages] = useState<MessageRes[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoadingConvs, setIsLoadingConvs] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isCreatingConv, setIsCreatingConv] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Load user's conversations
  const loadConversations = useCallback(async () => {
    if (!auth.isLoggedIn || !auth.UserID) return;
    setIsLoadingConvs(true);
    try {
      const res = await ConversationApi.get_all_conversation(auth.UserID);
      if (res?.data?.data) {
        setConversations(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setIsLoadingConvs(false);
    }
  }, [auth.isLoggedIn, auth.UserID]);

  // Trigger loading conversations when widget is opened
  useEffect(() => {
    if (isOpen && auth.isLoggedIn) {
      loadConversations();
    }
  }, [isOpen, auth.isLoggedIn, loadConversations]);

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

        // Update last message preview in list
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

  // Start new conversation (Support)
  const startNewConversation = async () => {
    if (!auth.UserID) return;
    setIsCreatingConv(true);
    try {
      const initPayload = {
        buyerId: auth.UserID,
        staffId: 1, // Default support staff ID
        message: "Hello! I would like to start a chat for customer support.",
        messageType: MessageType.TEXT,
      };
      const res = await ConversationApi.create_conversation(initPayload);
      if (res?.data?.data) {
        const newConv = res.data.data;
        setConversations((prev) => [newConv, ...prev]);
        setActiveConv(newConv);
      }
    } catch (err) {
      console.error("Failed to create conversation:", err);
    } finally {
      setIsCreatingConv(false);
    }
  };

  // Send Message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv || !auth.UserID) return;

    const payload: MessageRes = {
      conversationId: activeConv.id,
      content: inputText,
      senderId: auth.UserID,
      receiverId: activeConv.staffId === auth.UserID ? activeConv.buyerId : activeConv.staffId,
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

    setInputText("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-amber-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-amber-400/20 relative"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300 rotate-0" />
        ) : (
          <MessageCircle className="w-6 h-6 transition-transform duration-300" />
        )}
      </button>

      {/* Chat Container */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[520px] rounded-2xl shadow-2xl bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden flex flex-col transition-all duration-300 animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              {activeConv ? (
                <button
                  onClick={() => setActiveConv(null)}
                  className="p-1 hover:bg-white/10 rounded-lg transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
              )}
              <div>
                <h4 className="font-semibold text-sm">
                  {activeConv ? `Support Agent #${activeConv.staffId}` : "Furniro Help Center"}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeConv
                        ? isConnected
                          ? "bg-green-500"
                          : "bg-amber-500 animate-pulse"
                        : "bg-green-500"
                    }`}
                  />
                  <span className="text-[10px] text-zinc-400">
                    {activeConv
                      ? isConnected
                        ? "Active Connection"
                        : "Connecting Socket..."
                      : "We average < 10m responses"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-hidden flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20">
            {!auth.isLoggedIn ? (
              /* Non-authenticated state */
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20">
                  <User className="w-8 h-8 text-amber-500" />
                </div>
                <h5 className="font-bold text-zinc-800 dark:text-zinc-200">Start a Conversation</h5>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-6 max-w-[240px]">
                  Log in to your account to speak with our dedicated customer service agents and track orders.
                </p>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition text-center shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98]"
                >
                  Log In to Start
                </Link>
              </div>
            ) : activeConv ? (
              /* Chat session state */
              <div className="flex-1 flex flex-col overflow-hidden">
                {isLoadingMessages ? (
                  <div className="flex-1 flex items-center justify-center text-zinc-500">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500 mr-2" />
                    <span className="text-xs">Loading history...</span>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                    {messages.length === 0 ? (
                      <div className="text-center text-xs text-zinc-400 my-8">
                        No messages yet. Send a greeting to start chatting!
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
                              className={`max-w-[75%] p-3 rounded-2xl shadow-sm text-sm border ${
                                isMe
                                  ? "bg-zinc-900 border-zinc-800 text-white rounded-br-none"
                                  : "bg-white border-zinc-200/50 text-zinc-800 rounded-bl-none dark:bg-zinc-950 dark:border-zinc-850 dark:text-zinc-200"
                              }`}
                            >
                              <p className="leading-relaxed break-words">{msg.content}</p>
                              {msg.createdAt && (
                                <span className="text-[9px] block text-right mt-1 opacity-60">
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
                )}

                {/* Input Bar */}
                <form
                  onSubmit={handleSend}
                  className="p-3 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 flex gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={!isConnected}
                    placeholder={
                      isConnected ? "Type a message..." : "Socket connecting..."
                    }
                    className="flex-1 border border-zinc-200 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-amber-500 transition disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!isConnected || !inputText.trim()}
                    className="bg-amber-600 hover:bg-amber-700 text-white p-2.5 rounded-xl transition disabled:opacity-40 shadow-md hover:shadow-amber-500/10 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Conversation list state */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/10">
                  <span className="text-xs font-semibold text-zinc-500">Your Chat Rooms</span>
                  <button
                    onClick={startNewConversation}
                    disabled={isCreatingConv}
                    className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 disabled:opacity-50"
                  >
                    {isCreatingConv ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "+ New Chat"
                    )}
                  </button>
                </div>

                {isLoadingConvs ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500 mr-2" />
                    <span className="text-xs text-zinc-500">Retrieving chats...</span>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                      You do not have any open support rooms. Start a conversation with one of our support agents.
                    </p>
                    <button
                      onClick={startNewConversation}
                      disabled={isCreatingConv}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-xl text-xs transition shadow-md active:scale-95"
                    >
                      {isCreatingConv ? "Creating..." : "Start Chatting"}
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {conversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setActiveConv(conv)}
                        className="w-full text-left p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition flex items-center justify-between border border-transparent hover:border-zinc-200/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs">
                            {conv.staffId === 1 ? "🤖" : "👤"}
                          </div>
                          <div className="overflow-hidden max-w-[200px]">
                            <h6 className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">
                              Support Room #{conv.id}
                            </h6>
                            <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                              {conv.lastMessageContent || "Click to open conversation."}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
