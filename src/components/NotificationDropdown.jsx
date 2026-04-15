import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Avatar from "./Avatar";
import {
  setNotifications,
  markAllRead,
} from "../utils/notificationSlice";

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
};

const typeIcons = {
  request_received: "→",
  request_accepted: "✓",
  new_message: "✉",
};

const NotificationDropdown = () => {
  const { items, unreadCount } = useSelector((store) => store.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(BASE_URL + "/notifications?limit=15", {
          withCredentials: true,
        });
        dispatch(setNotifications(res.data));
      } catch {
        // ignore
      }
    };
    fetchNotifications();
  }, [dispatch]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await axios.patch(
        BASE_URL + "/notifications/read-all",
        {},
        { withCredentials: true }
      );
      dispatch(markAllRead());
    } catch {
      // ignore
    }
  };

  const handleClick = (notification) => {
    setOpen(false);
    switch (notification.type) {
      case "request_received":
        navigate("/requests");
        break;
      case "request_accepted":
        navigate("/connections");
        break;
      case "new_message":
        navigate(`/chat/${notification.fromUserId?._id || notification.fromUserId}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-muted hover:text-accent transition-colors duration-200"
        aria-label="Notifications"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-accent text-bg font-mono text-[10px] font-bold rounded-full px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-elevated border border-border rounded-xl shadow-term z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="font-display font-semibold text-body text-sm">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="font-mono text-[10px] text-accent hover:text-accent-bright transition-colors"
              >
                mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center font-mono text-xs text-muted/50">
                No notifications yet
              </div>
            ) : (
              items.map((notif) => (
                <button
                  key={notif._id}
                  onClick={() => handleClick(notif)}
                  className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-surface transition-colors duration-100 border-b border-border/50 last:border-0 ${
                    !notif.read ? "bg-accent/5" : ""
                  }`}
                >
                  {/* Avatar or icon */}
                  {notif.fromUserId?.photoUrl ? (
                    <Avatar
                      src={notif.fromUserId.photoUrl}
                      name={notif.fromUserId.firstName || "User"}
                      size="w-8 h-8"
                      className="border border-border shrink-0 mt-0.5"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center shrink-0 mt-0.5">
                      <span className="font-mono text-xs text-accent">
                        {typeIcons[notif.type] || "•"}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-body leading-snug">
                      {notif.message}
                    </p>
                    <p className="font-mono text-[10px] text-muted/50 mt-0.5">
                      {timeAgo(notif.createdAt)}
                    </p>
                  </div>

                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
