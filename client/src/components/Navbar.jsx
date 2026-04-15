import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { clearChat } from "../utils/chatSlice";
import { clearNotifications } from "../utils/notificationSlice";
import { disconnectSocket } from "../utils/socketManager";
import NotificationDropdown from "./NotificationDropdown";
import Avatar from "./Avatar";

const Navbar = () => {
  const user = useSelector((store) => store.user.data);
  const unreadCount = useSelector((store) => store.chat.unreadCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "terminal";
  });

  const toggleTheme = () => {
    const next = theme === "terminal" ? "terminal-light" : "terminal";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      disconnectSocket();
      dispatch(clearChat());
      dispatch(clearNotifications());
      dispatch(removeUser());
      return navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-mono text-accent text-lg font-bold">$</span>
          <span className="font-display font-bold text-xl text-body group-hover:text-accent transition-colors duration-300">
            ConnectDevs
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Public nav links — visible to everyone */}
          <Link
            to="/explore"
            className="hidden sm:block font-mono text-xs text-muted hover:text-accent transition-colors duration-200"
          >
            explore
          </Link>
          <Link
            to="/leaderboard"
            className="hidden sm:block font-mono text-xs text-muted hover:text-accent transition-colors duration-200"
          >
            leaderboard
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted hover:text-accent transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === "terminal" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Guest: show login link */}
          {!user && (
            <Link
              to="/login"
              className="px-3 py-1.5 bg-accent text-bg font-mono text-xs font-semibold rounded-lg hover:bg-accent-bright transition-all duration-200"
            >
              Sign in
            </Link>
          )}

          {user && (
            <>
              {/* Chat icon */}
              <Link
                to="/chat"
                className="relative p-2 rounded-lg text-muted hover:text-accent transition-colors duration-200"
                aria-label="Messages"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-accent text-bg font-mono text-[10px] font-bold rounded-full px-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <NotificationDropdown />

              <span className="hidden sm:block font-mono text-sm text-muted">
                <span className="text-accent/80">~</span> {user.firstName}
              </span>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar border-2 border-border hover:border-accent transition-colors duration-300"
                >
                  <div className="w-10 rounded-full overflow-hidden">
                    <Avatar src={user.photoUrl} name={`${user.firstName} ${user.lastName}`} size="w-10 h-10" />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm terminal-menu dropdown-content bg-elevated border border-border rounded-xl z-[1] mt-3 w-52 p-2 shadow-term"
                >
                  <li>
                    <Link to="/profile">
                      <span className="text-accent/50 mr-1">→</span> profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/connections">
                      <span className="text-accent/50 mr-1">→</span> connections
                    </Link>
                  </li>
                  <li>
                    <Link to="/chat">
                      <span className="text-accent/50 mr-1">→</span> messages
                    </Link>
                  </li>
                  <li>
                    <Link to="/requests">
                      <span className="text-accent/50 mr-1">→</span> requests
                    </Link>
                  </li>
                  <li className="logout-item border-t border-border mt-1 pt-1">
                    <button onClick={handleLogout}>
                      <span className="mr-1">×</span> logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
