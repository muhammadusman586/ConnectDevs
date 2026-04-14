/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const GitHubConnect = ({ user }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const isConnected = !!user.github?.username;

  const handleConnect = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        BASE_URL + "/github/connect-username",
        { username: username.trim() },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      setUsername("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await axios.delete(BASE_URL + "/github/disconnect", {
        withCredentials: true,
      });
      // Update user in store — remove github field
      dispatch(addUser({ ...user, github: undefined }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleOAuth = async () => {
    try {
      const res = await axios.get(BASE_URL + "/github/auth", {
        withCredentials: true,
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch {
      setError("OAuth not configured. Use username instead.");
    }
  };

  if (isConnected) {
    return (
      <div className="p-4 bg-surface border border-border rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-body"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <div>
              <p className="font-mono text-sm text-body">
                @{user.github.username}
              </p>
              <p className="font-mono text-[10px] text-muted/50">
                connected
              </p>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="font-mono text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block font-mono text-xs text-muted">github</label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-muted/40 text-sm">
            @
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            placeholder="username"
            className="w-full pl-7 pr-3 py-2.5 bg-surface border border-border rounded-lg font-mono text-sm text-body placeholder:text-muted/30 focus:border-accent/40 focus:shadow-[0_0_0_1px_rgba(255,138,0,0.15)] transition-all duration-200 outline-none"
          />
        </div>
        <button
          onClick={handleConnect}
          disabled={loading || !username.trim()}
          className="py-2.5 px-4 bg-surface border border-border text-body font-mono text-xs rounded-lg hover:border-accent/40 hover:text-accent transition-all duration-200 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          {loading ? "..." : "link"}
        </button>
      </div>

      {error && (
        <p className="font-mono text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
          ✗ {error}
        </p>
      )}

      <p className="font-mono text-[10px] text-muted/30">
        or{" "}
        <button
          onClick={handleOAuth}
          className="text-accent/50 hover:text-accent underline transition-colors"
        >
          connect via OAuth
        </button>
      </p>
    </div>
  );
};

export default GitHubConnect;
