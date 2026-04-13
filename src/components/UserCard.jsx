import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import SkillBadge from "./SkillBadge";

/* eslint-disable react/prop-types */
const UserCard = ({ user, hideActions = false, swipeDirection = null }) => {
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="font-mono text-sm text-muted text-center p-8">
        <span className="text-accent">$</span> No user data available
      </div>
    );
  }

  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = user;
  const MAX_DISPLAY = 4;
  const displaySkills = skills?.slice(0, MAX_DISPLAY) || [];
  const overflowCount = (skills?.length || 0) - MAX_DISPLAY;

  return (
    <div className="w-full max-w-sm animate-slide-up select-none">
      <div className="relative bg-elevated border border-border rounded-xl shadow-term overflow-hidden card-glow">
        {/* Swipe overlay */}
        {swipeDirection && (
          <div
            className={`absolute inset-0 z-10 flex items-center justify-center rounded-xl transition-opacity duration-150 ${
              swipeDirection === "right"
                ? "bg-accent/15 border-2 border-accent"
                : "bg-red-400/15 border-2 border-red-400"
            }`}
          >
            <span
              className={`font-display font-bold text-3xl tracking-wider ${
                swipeDirection === "right" ? "text-accent" : "text-red-400"
              }`}
            >
              {swipeDirection === "right" ? "CONNECT" : "PASS"}
            </span>
          </div>
        )}
        {/* Photo */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={photoUrl}
            alt={`${firstName}'s photo`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-elevated via-transparent to-transparent" />
        </div>

        {/* Info */}
        <div className="p-5 space-y-3">
          <div>
            <h2 className="font-display font-bold text-xl text-body">
              {firstName + " " + lastName}
            </h2>
            {age && gender && (
              <p className="font-mono text-xs text-muted mt-1">
                <span className="text-accent/60">#</span> {age} · {gender}
              </p>
            )}
          </div>

          {about && (
            <p className="text-sm text-muted leading-relaxed">{about}</p>
          )}

          {displaySkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {displaySkills.map((skill) => (
                <SkillBadge key={skill} skill={skill} size="xs" />
              ))}
              {overflowCount > 0 && (
                <span className="font-mono text-[10px] text-muted/60 self-center">
                  +{overflowCount} more
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          {_id && !hideActions && (
            <div className="flex gap-3 pt-2">
              <button
                className="flex-1 py-2.5 px-4 bg-surface border border-border text-muted font-mono text-sm rounded-lg hover:border-red-400/40 hover:text-red-400 transition-all duration-200 active:scale-[0.98]"
                onClick={() => handleSendRequest("ignore", _id)}
              >
                pass
              </button>
              <button
                className="flex-1 py-2.5 px-4 bg-accent text-bg font-mono text-sm font-semibold rounded-lg hover:bg-accent-bright transition-all duration-200 active:scale-[0.98] shadow-glow-sm"
                onClick={() => handleSendRequest("interested", _id)}
              >
                connect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
