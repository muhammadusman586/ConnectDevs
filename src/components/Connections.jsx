import axios from "axios";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../utils/connectionSlice";
import SkillBadge from "./SkillBadge";
import SkeletonListItem from "./skeletons/SkeletonListItem";
import SearchBar from "./SearchBar";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!connections)
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <p className="font-mono text-xs text-muted mb-6">
          <span className="text-accent">$</span> loading connections
          <span className="animate-blink ml-1 text-accent">▋</span>
        </p>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonListItem key={i} />
          ))}
        </div>
      </div>
    );

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="font-mono text-muted text-sm space-y-2">
          <p>
            <span className="text-accent">$</span> ls connections/
          </p>
          <p className="text-muted/60">
            Directory empty. Start connecting with developers!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-body">
          Connections
        </h1>
        <p className="font-mono text-xs text-muted mt-1">
          <span className="text-accent">$</span> ls connections/ —{" "}
          {connections.length} found
        </p>
      </div>

      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="grep connections..."
        />
      </div>

      <div className="space-y-3">
        {(() => {
          const filtered = search
            ? connections.filter((c) => {
                const name = `${c.firstName} ${c.lastName}`.toLowerCase();
                return name.includes(search.toLowerCase());
              })
            : connections;

          if (filtered.length === 0) {
            return (
              <div className="py-8 text-center font-mono text-sm text-muted/50">
                <span className="text-accent/40">$</span> no matches for "{search}"
              </div>
            );
          }

          return filtered.map((connection, index) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about, skills } =
            connection;

          return (
            <div
              key={_id}
              className="flex items-center gap-4 p-4 bg-elevated border border-border rounded-xl card-glow animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <img
                alt={firstName}
                className="w-14 h-14 rounded-full object-cover border-2 border-border"
                src={photoUrl}
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
              <Link
                to={`/chat/${_id}`}
                className="shrink-0 py-2 px-3 bg-surface border border-border text-muted font-mono text-xs rounded-lg hover:border-accent/40 hover:text-accent transition-all duration-200 active:scale-[0.97]"
              >
                message
              </Link>
            </div>
          );
        });
        })()}
      </div>
    </div>
  );
};
export default Connections;