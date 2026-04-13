import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { clearChat } from "../utils/chatSlice";
import { clearNotifications } from "../utils/notificationSlice";
import { disconnectSocket } from "../utils/socketManager";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const unreadCount = useSelector((store) => store.chat.unreadCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

        {user && (
          <div className="flex items-center gap-4">
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
                  <img alt={user.firstName} src={user.photoUrl} />
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
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
