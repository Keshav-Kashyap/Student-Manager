import React, { useEffect, useMemo, useRef, useState } from "react";
import { Send, Bot, User, MessageSquare } from "lucide-react";
import { API_BASE } from "@/config/api";

const initialMessages = [
  {
    id: 1,
    sender: "assistant",
    text: "Hi! Welcome to CampusFlow Chat. How can I help you today?",
    time: "09:10 AM",
  },
  {
    id: 2,
    sender: "user",
    text: "I need help checking student records quickly.",
    time: "09:11 AM",
  },
  {
    id: 3,
    sender: "assistant",
    text: "Sure. You can open Student List and use the search bar by name, class, or father name.",
    time: "09:11 AM",
  },
];

const formatTime = (date) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

const getChatSocketUrl = () => {
  const explicitSocketUrl = import.meta.env.VITE_CHAT_WS_URL;
  if (explicitSocketUrl) return explicitSocketUrl;

  if (!API_BASE) return null;
  const wsBase = API_BASE.replace(/^http/i, (match) => (match.toLowerCase() === "https" ? "wss" : "ws"));
  return `${wsBase}/ws/chat`;
};

const Chat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [connectionState, setConnectionState] = useState("connecting");
  const messagesContainerRef = useRef(null);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const queueRef = useRef([]);

  const totalMessages = useMemo(() => messages.length, [messages]);

  useEffect(() => {
    const socketUrl = getChatSocketUrl();

    if (!socketUrl) {
      setConnectionState("offline");
      return;
    }

    let isUnmounted = false;

    const connect = () => {
      if (isUnmounted) return;

      try {
        const ws = new WebSocket(socketUrl);
        socketRef.current = ws;
        setConnectionState("connecting");

        ws.onopen = () => {
          if (isUnmounted) return;
          setConnectionState("connected");

          if (queueRef.current.length > 0) {
            queueRef.current.forEach((payload) => ws.send(JSON.stringify(payload)));
            queueRef.current = [];
          }
        };

        ws.onmessage = (event) => {
          if (isUnmounted) return;

          try {
            const data = JSON.parse(event.data);

            if (data?.type === "chat_message" && data?.payload?.text) {
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now() + Math.random(),
                  sender: data.payload.sender === "user" ? "user" : "assistant",
                  text: data.payload.text,
                  time: formatTime(new Date()),
                },
              ]);
            }

            // Future-ready placeholders for calling signals.
            if (data?.type === "call_offer" || data?.type === "call_answer" || data?.type === "ice_candidate") {
              console.log("Call signal received:", data.type);
            }
          } catch (error) {
            console.error("Invalid websocket message:", error);
          }
        };

        ws.onerror = () => {
          if (isUnmounted) return;
          setConnectionState("offline");
        };

        ws.onclose = () => {
          if (isUnmounted) return;
          setConnectionState("offline");
          reconnectTimeoutRef.current = window.setTimeout(connect, 2500);
        };
      } catch (error) {
        console.error("WebSocket initialization failed:", error);
        setConnectionState("offline");
      }
    };

    connect();

    return () => {
      isUnmounted = true;

      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!messagesContainerRef.current) return;
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }, [messages]);

  const handleSend = (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const now = formatTime(new Date());
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
      time: now,
    };

    const assistantMessage = {
      id: Date.now() + 1,
      sender: "assistant",
      text: "Got it. Your message is saved. Backend chat integration can be connected next.",
      time: now,
    };

    setMessages((prev) => [...prev, userMessage]);

    const payload = {
      type: "chat_message",
      payload: {
        text: trimmed,
        sender: "user",
      },
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    } else {
      queueRef.current.push(payload);
      setMessages((prev) => [...prev, assistantMessage]);
    }

    setInput("");
  };

  const connectionBadgeClass =
    connectionState === "connected"
      ? "bg-emerald-50 text-emerald-700"
      : connectionState === "connecting"
        ? "bg-amber-50 text-amber-700"
        : "bg-slate-100 text-slate-600";

  const connectionLabel =
    connectionState === "connected"
      ? "Realtime Connected"
      : connectionState === "connecting"
        ? "Connecting..."
        : "Offline Mode";

  return (
    <div className="flex h-[calc(100svh-4rem)] flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur sm:mb-6 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <MessageSquare size={18} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">CampusFlow Chat</h1>
              <p className="text-sm text-slate-600">Fast internal messaging for student management support</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${connectionBadgeClass}`}>
              {connectionLabel}
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {totalMessages} messages
            </span>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div ref={messagesContainerRef} className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {messages.map((message) => {
            const isUser = message.sender === "user";

            return (
              <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${isUser
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-800"
                    }`}
                >
                  <div className="mb-2 flex items-center gap-2 text-xs opacity-80">
                    {isUser ? <User size={14} /> : <Bot size={14} />}
                    <span>{isUser ? "You" : "Assistant"}</span>
                    <span>{message.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSend} className="sticky bottom-0 border-t border-slate-200 bg-white p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm text-slate-900 outline-none ring-blue-500 transition focus:border-blue-500 focus:ring-2"
            />
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 font-semibold text-white transition hover:bg-blue-700"
            >
              <Send size={16} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;