import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Avatar from "./Avatar";
import SkillBadge from "./SkillBadge";

const DevProfile = () => {
  const { userId } = useParams();
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [dev, setDev] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/profile/" + userId);
        setDev(res.data.data);
      } catch (err) {
        setError(err.response?.status === 404 ? "Developer not found" : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleConnect = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        BASE_URL + "/request/send/interested/" + userId,
        {},
        { withCredentials: true }
      );
      setRequestSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-elevated border border-border rounded-xl overflow-hidden shadow-term animate-pulse">
          <div className="h-48 bg-surface" />
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-surface -mt-14 border-4 border-elevated" />
              <div className="flex-1">
                <div className="h-6 bg-surface rounded w-1/3 mb-2" />
                <div className="h-4 bg-surface rounded w-1/4" />
              </div>
            </div>
            <div className="h-4 bg-surface rounded w-full" />
            <div className="h-4 bg-surface rounded w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="font-mono text-sm text-muted space-y-3">
          <p><span className="text-red-400">✗</span> {error}</p>
          <Link to="/explore" className="text-accent hover:text-accent-bright transition-colors">
            ← back to explore
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = user && user._id === dev._id;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-elevated border border-border rounded-xl overflow-hidden shadow-term">
        {/* Terminal title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]/90" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/90" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]/90" />
          <span className="ml-3 font-mono text-xs text-muted">
            cat ~/devs/{dev.firstName?.toLowerCase()}.profile
          </span>
        </div>

        {/* Profile content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start gap-5 mb-6">
            <Avatar
              src={dev.photoUrl}
              name={`${dev.firstName} ${dev.lastName}`}
              size="w-24 h-24"
              className="border-4 border-border"
            />
            <div className="flex-1">
              <h1 className="font-display font-bold text-2xl text-body">
                {dev.firstName} {dev.lastName}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                {dev.age && dev.gender && (
                  <p className="font-mono text-sm text-muted">
                    <span className="text-accent/60">#</span> {dev.age} · {dev.gender}
                  </p>
                )}
                {dev.github?.username && (
                  <a
                    href={dev.github.profileUrl || `https://github.com/${dev.github.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-muted/60 hover:text-accent transition-colors"
                  >
                    @{dev.github.username}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 font-mono text-xs text-muted">
                <span>
                  <span className="text-accent font-semibold">{dev.connectionCount}</span> connections
                </span>
                {dev.skills?.length > 0 && (
                  <span>{dev.skills.length} skills</span>
                )}
              </div>
            </div>
          </div>

          {/* About */}
          {dev.about && (
            <div className="mb-6">
              <h2 className="font-mono text-xs text-muted mb-2">
                <span className="text-accent/60">$</span> about
              </h2>
              <p className="text-body leading-relaxed">{dev.about}</p>
            </div>
          )}

          {/* Skills */}
          {dev.skills?.length > 0 && (
            <div className="mb-6">
              <h2 className="font-mono text-xs text-muted mb-2">
                <span className="text-accent/60">$</span> skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {dev.skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} size="sm" />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            {!user ? (
              <Link
                to="/login"
                className="flex-1 py-2.5 px-4 bg-accent text-bg font-display font-semibold rounded-lg text-center hover:bg-accent-bright transition-all duration-200 active:scale-[0.98] shadow-glow-sm"
              >
                Sign up to connect
              </Link>
            ) : isOwnProfile ? (
              <Link
                to="/profile"
                className="flex-1 py-2.5 px-4 bg-surface border border-border text-body font-mono text-sm rounded-lg text-center hover:border-accent/40 hover:text-accent transition-all duration-200"
              >
                Edit your profile →
              </Link>
            ) : requestSent ? (
              <div className="flex-1 py-2.5 px-4 bg-accent/10 border border-accent/30 text-accent font-mono text-sm rounded-lg text-center">
                ✓ Request sent
              </div>
            ) : (
              <>
                <button
                  onClick={handleConnect}
                  className="flex-1 py-2.5 px-4 bg-accent text-bg font-display font-semibold rounded-lg hover:bg-accent-bright transition-all duration-200 active:scale-[0.98] shadow-glow-sm"
                >
                  Connect
                </button>
                <Link
                  to={`/chat/${dev._id}`}
                  className="py-2.5 px-4 bg-surface border border-border text-muted font-mono text-sm rounded-lg hover:border-accent/40 hover:text-accent transition-all duration-200"
                >
                  Message
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="mt-4 text-center">
        <Link
          to="/explore"
          className="font-mono text-xs text-muted/50 hover:text-accent transition-colors"
        >
          ← back to explore
        </Link>
      </div>
    </div>
  );
};

export default DevProfile;
