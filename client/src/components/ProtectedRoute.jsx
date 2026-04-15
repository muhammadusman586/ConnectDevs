import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { connectSocket, disconnectSocket, getSocket } from "../utils/socketManager";
import {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  addMessage,
  addTypingUser,
  removeTypingUser,
  setUnreadCount,
} from "../utils/chatSlice";
import { addNotification } from "../utils/notificationSlice";

const ProtectedRoute = () => {
  const user = useSelector((store) => store.user.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (user) {
        setIsVerifying(false);
        return;
      }
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch {
        navigate("/login");
      } finally {
        setIsVerifying(false);
      }
    };
    verifyAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize socket once user is available
  useEffect(() => {
    if (!user) return;

    // Get token from cookie for socket auth
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) return;

    const socket = connectSocket(token);

    socket.on("onlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });
    socket.on("userOnline", ({ userId }) => {
      dispatch(addOnlineUser(userId));
    });
    socket.on("userOffline", ({ userId }) => {
      dispatch(removeOnlineUser(userId));
    });
    socket.on("receiveMessage", (msg) => {
      dispatch(addMessage({ userId: msg.senderId, message: msg }));
      // Bump unread count
      fetchUnread();
    });
    socket.on("userTyping", ({ userId }) => {
      dispatch(addTypingUser(userId));
    });
    socket.on("userStopTyping", ({ userId }) => {
      dispatch(removeTypingUser(userId));
    });
    socket.on("newNotification", (notification) => {
      dispatch(addNotification(notification));
    });

    const fetchUnread = async () => {
      try {
        const res = await axios.get(BASE_URL + "/chat/unread/count", {
          withCredentials: true,
        });
        dispatch(setUnreadCount(res.data.data));
      } catch {
        // ignore
      }
    };
    fetchUnread();

    return () => {
      disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-sm space-y-4 animate-fade-in">
          <div className="font-mono text-sm text-muted text-center">
            <p>
              <span className="text-accent">$</span> authenticating
              <span className="animate-blink ml-1 text-accent">▋</span>
            </p>
          </div>

          {/* Skeleton card */}
          <div className="bg-elevated border border-border rounded-xl overflow-hidden shadow-term">
            <div className="h-44 bg-surface animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-surface rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-surface rounded w-1/2 animate-pulse" />
              <div className="h-3 bg-surface rounded w-full animate-pulse" />
              <div className="flex gap-3 pt-2">
                <div className="h-10 bg-surface rounded-lg flex-1 animate-pulse" />
                <div className="h-10 bg-surface rounded-lg flex-1 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <Outlet />;
};

export default ProtectedRoute;
