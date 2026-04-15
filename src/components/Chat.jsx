import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import SkeletonListItem from "./skeletons/SkeletonListItem";
import Avatar from "./Avatar";

const Chat = () => {
  const [connections, setConnections] = useState(null);
  const [lastMessages, setLastMessages] = useState({});
  const onlineUsers = useSelector((store) => store.chat.onlineUsers);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/connections", {
          withCredentials: true,
        });
        setConnections(res.data.data);

        // Fetch last message for each connection
        const msgMap = {};
        await Promise.all(
          res.data.data.map(async (conn) => {
            try {
              const msgRes = await axios.get(
                BASE_URL + "/chat/" + conn._id + "?limit=1",
                { withCredentials: true }
              );
              if (msgRes.data.data?.length > 0) {
                msgMap[conn._id] = msgRes.data.data[msgRes.data.data.length - 1];
              }
            } catch {
              // ignore
            }
          })
        );
        setLastMessages(msgMap);
      } catch (err) {
        console.error(err);
      }
    };

    fetchConnections();
  }, []);

  if (!connections) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <p className="font-mono text-xs text-muted mb-6">
          <span className="text-accent">$</span> loading chats
          <span className="animate-blink ml-1 text-accent">▋</span>
        </p>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonListItem key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="font-mono text-muted text-sm space-y-2">
          <p>
            <span className="text-accent">$</span> ls chats/
          </p>
          <p className="text-muted/60">
            No connections yet. Connect with developers to start chatting!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-body">Messages</h1>
        <p className="font-mono text-xs text-muted mt-1">
          <span className="text-accent">$</span> ls chats/ —{" "}
          {connections.length} conversations
        </p>
      </div>

      <div className="space-y-2">
        {connections.map((conn, index) => {
          const isOnline = onlineUsers.includes(conn._id);
          const lastMsg = lastMessages[conn._id];

          return (
            <Link
              key={conn._id}
              to={`/chat/${conn._id}`}
              className="flex items-center gap-4 p-4 bg-elevated border border-border rounded-xl card-glow hover:border-accent/20 transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div className="relative shrink-0">
                <Avatar
                  src={conn.photoUrl}
                  name={`${conn.firstName} ${conn.lastName}`}
                  size="w-12 h-12"
                  className="border-2 border-border"
                />
                {isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-elevated" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-semibold text-body truncate">
                    {conn.firstName} {conn.lastName}
                  </h2>
                  {isOnline && (
                    <span className="font-mono text-[10px] text-green-500">
                      online
                    </span>
                  )}
                </div>
                {lastMsg ? (
                  <p className="text-sm text-muted/70 truncate mt-0.5">
                    {lastMsg.text}
                  </p>
                ) : (
                  <p className="text-sm text-muted/40 italic mt-0.5">
                    No messages yet
                  </p>
                )}
              </div>

              <span className="font-mono text-accent/40 text-lg">→</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Chat;
