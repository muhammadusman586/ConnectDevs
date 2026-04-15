import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";
import SkillBadge from "./SkillBadge";
import SkeletonListItem from "./skeletons/SkeletonListItem";
import Avatar from "./Avatar";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!requests)
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <p className="font-mono text-xs text-muted mb-6">
          <span className="text-accent">$</span> loading requests
          <span className="animate-blink ml-1 text-accent">▋</span>
        </p>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonListItem key={i} />
          ))}
        </div>
      </div>
    );

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="font-mono text-muted text-sm space-y-2">
          <p>
            <span className="text-accent">$</span> cat requests.log
          </p>
          <p className="text-muted/60">
            No pending requests. Your inbox is clear.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-body">
          Connection Requests
        </h1>
        <p className="font-mono text-xs text-muted mt-1">
          <span className="text-accent">$</span> cat requests.log —{" "}
          {requests.length} pending
        </p>
      </div>

      <div className="space-y-3">
        {requests.map((request, index) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about, skills } =
            request.fromUserId;

          return (
            <div
              key={_id}
              className="flex items-center gap-4 p-4 bg-elevated border border-border rounded-xl card-glow animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Avatar
                src={photoUrl}
                name={`${firstName} ${lastName}`}
                size="w-14 h-14"
                className="border-2 border-border"
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-semibold text-body truncate">
                  {firstName + " " + lastName}
                </h2>
                {age && gender && (
                  <p className="font-mono text-xs text-muted">
                    <span className="text-accent/60">#</span> {age} · {gender}
                  </p>
                )}
                {about && (
                  <p className="text-sm text-muted/80 mt-1 truncate">{about}</p>
                )}
                {skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {skills.slice(0, 3).map((skill) => (
                      <SkillBadge key={skill} skill={skill} size="xs" />
                    ))}
                    {skills.length > 3 && (
                      <span className="font-mono text-[10px] text-muted/50 self-center">
                        +{skills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  className="py-2 px-4 bg-accent text-bg font-mono text-xs font-semibold rounded-lg hover:bg-accent-bright transition-all duration-200 active:scale-[0.98]"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  accept
                </button>
                <button
                  className="py-2 px-4 bg-surface border border-border text-muted font-mono text-xs rounded-lg hover:border-red-400/40 hover:text-red-400 transition-all duration-200 active:scale-[0.98]"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Requests;
