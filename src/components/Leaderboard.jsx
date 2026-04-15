import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Avatar from "./Avatar";
import SkillBadge from "./SkillBadge";

const RANK_STYLES = {
  0: "text-yellow-400 font-bold text-lg",
  1: "text-gray-300 font-bold text-lg",
  2: "text-amber-600 font-bold text-lg",
};

const Leaderboard = () => {
  const [developers, setDevelopers] = useState(null);
  const [skillFilter, setSkillFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async (skill = "") => {
    setLoading(true);
    try {
      const url = BASE_URL + "/leaderboard" + (skill ? `?skill=${encodeURIComponent(skill)}` : "");
      const res = await axios.get(url);
      setDevelopers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const handleSkillFilter = (skill) => {
    setSkillFilter(skill);
    fetchLeaderboard(skill);
  };

  const POPULAR_SKILLS = [
    "React", "Node.js", "Python", "TypeScript", "JavaScript",
    "Go", "Rust", "Docker", "AWS", "MongoDB",
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-3xl text-body mb-2">
          🏆 Leaderboard
        </h1>
        <p className="font-mono text-sm text-muted">
          <span className="text-accent">$</span> top developers by connections
        </p>
      </div>

      {/* Skill filter pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <button
          onClick={() => handleSkillFilter("")}
          className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
            !skillFilter
              ? "border-accent text-accent bg-accent/10"
              : "border-border text-muted hover:border-accent/30 hover:text-accent"
          }`}
        >
          All
        </button>
        {POPULAR_SKILLS.map((skill) => (
          <button
            key={skill}
            onClick={() => handleSkillFilter(skill)}
            className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
              skillFilter === skill
                ? "border-accent text-accent bg-accent/10"
                : "border-border text-muted hover:border-accent/30 hover:text-accent"
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Terminal header */}
      <div className="bg-elevated border border-border rounded-xl overflow-hidden shadow-term">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]/90" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/90" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]/90" />
          <span className="ml-3 font-mono text-xs text-muted">
            leaderboard{skillFilter ? `--filter=${skillFilter}` : ""}.sh
          </span>
        </div>

        <div className="p-2">
          {/* Column headers */}
          <div className="flex items-center gap-4 px-4 py-2 font-mono text-[11px] text-muted/50 border-b border-border/50">
            <span className="w-8 text-center">#</span>
            <span className="w-10" />
            <span className="flex-1">developer</span>
            <span className="w-20 text-right">connections</span>
          </div>

          {loading ? (
            <div className="space-y-1 p-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3 animate-pulse">
                  <div className="w-8 h-4 bg-surface rounded" />
                  <div className="w-10 h-10 bg-surface rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-surface rounded w-1/3 mb-1" />
                    <div className="h-3 bg-surface rounded w-1/2" />
                  </div>
                  <div className="w-12 h-4 bg-surface rounded" />
                </div>
              ))}
            </div>
          ) : !developers?.length ? (
            <div className="py-12 text-center font-mono text-sm text-muted">
              <span className="text-accent">$</span> no developers found
            </div>
          ) : (
            <div className="space-y-0.5">
              {developers.map((dev, index) => (
                <Link
                  to={`/dev/${dev._id}`}
                  key={dev._id}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-surface transition-all duration-150 animate-slide-up group ${
                    index < 3 ? "bg-accent/5" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  {/* Rank */}
                  <span className={`w-8 text-center font-mono ${RANK_STYLES[index] || "text-muted text-sm"}`}>
                    {index < 3 ? ["🥇", "🥈", "🥉"][index] : index + 1}
                  </span>

                  {/* Avatar */}
                  <Avatar
                    src={dev.photoUrl}
                    name={`${dev.firstName} ${dev.lastName}`}
                    size="w-10 h-10"
                    className="border-2 border-border group-hover:border-accent/40"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-body text-sm truncate group-hover:text-accent transition-colors">
                      {dev.firstName} {dev.lastName}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {dev.skills?.slice(0, 3).map((s) => (
                        <span key={s} className="font-mono text-[10px] text-muted/60">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Connection count */}
                  <div className="w-20 text-right">
                    <span className="font-mono text-sm text-accent font-semibold">
                      {dev.connections}
                    </span>
                    <p className="font-mono text-[10px] text-muted/40">
                      links
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
