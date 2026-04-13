import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const ProtectedRoute = () => {
  const user = useSelector((store) => store.user);
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
