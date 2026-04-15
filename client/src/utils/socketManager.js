import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket = null;

export const connectSocket = (token) => {
  if (socket?.connected) return socket;

  socket = io(BASE_URL, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
