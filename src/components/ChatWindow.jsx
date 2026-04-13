import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { setMessages, addMessage } from "../utils/chatSlice";
import { getSocket } from "../utils/socketManager";
import MessageBubble from "./MessageBubble";

const ChatWindow = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((store) => store.user);
  const messages = useSelector((store) => store.chat.messages[userId] || []);
  const onlineUsers = useSelector((store) => store.chat.onlineUsers);
  const typingUsers = useSelector((store) => store.chat.typingUsers);

  const [input, setInput] = useState("");
  const [peer, setPeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isOnline = onlineUsers.includes(userId);
  const isTyping = typingUsers.includes(userId);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Fetch peer info + messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const connRes = await axios.get(BASE_URL + "/user/connections", {
          withCredentials: true,
        });
        const peerUser = connRes.data.data.find((c) => c._id === userId);
        setPeer(peerUser);

        const msgRes = await axios.get(BASE_URL + "/chat/" + userId, {
          withCredentials: true,
        });
        dispatch(setMessages({ userId, messages: msgRes.data.data }));

        // Notify sender their messages were read
        const socket = getSocket();
        if (socket) {
          socket.emit("messagesRead", { senderId: userId });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, dispatch]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const tempId = `temp_${Date.now()}`;
    const message = {
      _id: tempId,
      tempId,
      senderId: currentUser._id,
      receiverId: userId,
      text,
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Optimistic update
    dispatch(addMessage({ userId, message }));
    setInput("");

    // Emit via socket for real-time
    const socket = getSocket();
    if (socket) {
      socket.emit("sendMessage", { receiverId: userId, text, tempId });
      socket.emit("stopTyping", { receiverId: userId });
    }

    // Persist via REST
    try {
      await axios.post(
        BASE_URL + "/chat/" + userId,
        { text },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      return;
    }

    // Typing indicator
    const socket = getSocket();
    if (socket) {
      socket.emit("typing", { receiverId: userId });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { receiverId: userId });
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="font-mono text-xs text-muted">
          <span className="text-accent">$</span> loading chat
          <span className="animate-blink ml-1 text-accent">▋</span>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-elevated/50 backdrop-blur-sm shrink-0">
        <Link
          to="/chat"
          className="font-mono text-accent hover:text-accent-bright transition-colors text-sm"
        >
          ←
        </Link>
        {peer && (
          <>
            <div className="relative">
              <img
                src={peer.photoUrl}
                alt={peer.firstName}
                className="w-9 h-9 rounded-full object-cover border border-border"
              />
              {isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-elevated" />
              )}
            </div>
            <div>
              <h2 className="font-display font-semibold text-body text-sm">
                {peer.firstName} {peer.lastName}
              </h2>
              <p className="font-mono text-[10px] text-muted">
                {isTyping ? (
                  <span className="text-accent">
                    typing
                    <span className="animate-blink">▋</span>
                  </span>
                ) : isOnline ? (
                  <span className="text-green-500">online</span>
                ) : (
                  "offline"
                )}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center font-mono text-sm text-muted/50 space-y-1">
              <p>
                <span className="text-accent/40">$</span> echo "hello"
              </p>
              <p>Send the first message!</p>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isMine={msg.senderId === currentUser._id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 px-4 py-3 border-t border-border bg-elevated/50 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-2.5 font-mono text-accent text-sm pointer-events-none">
              $
            </span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full pl-7 pr-3 py-2.5 bg-surface border border-border rounded-lg font-mono text-sm text-body placeholder:text-muted/30 focus:border-accent/40 focus:shadow-[0_0_0_1px_rgba(255,138,0,0.15)] transition-all duration-200 outline-none resize-none"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="py-2.5 px-4 bg-accent text-bg font-mono text-sm font-semibold rounded-lg hover:bg-accent-bright transition-all duration-200 active:scale-[0.97] shadow-glow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
