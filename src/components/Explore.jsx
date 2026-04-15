import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Avatar from "./Avatar";
import SkillBadge from "./SkillBadge";

const SKILL_ICONS = {
  JavaScript: "⚡", TypeScript: "🔷", Python: "🐍", Java: "☕", Go: "🔵",
  Rust: "🦀", "C++": "⚙️", "C#": "🟣", Ruby: "💎", PHP: "🐘",
  Swift: "🍎", Kotlin: "🟠", React: "⚛️", Vue: "💚", Angular: "🔺",
  Svelte: "🔥", "Next.js": "▲", "Node.js": "🟩", Express: "📡",
  Django: "🎸", Flask: "🧪", "Spring Boot": "🌱", FastAPI: "⚡",
  MongoDB: "🍃", PostgreSQL: "🐘", MySQL: "🐬", Redis: "🔴",
  GraphQL: "◈", Docker: "🐳", Kubernetes: "☸️", AWS: "☁️",
  GCP: "🌐", Azure: "🔵", Terraform: "🏗️", Git: "🔀",
  TailwindCSS: "🎨", Flutter: "💙", "React Native": "📱",
  "Machine Learning": "🤖", "Data Science": "📊", Blockchain: "🔗",
};

const Explore = () => {
  const [categories, setCategories] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(BASE_URL + "/explore");
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBySkill = async (skill) => {
    setLoading(true);
    setSelectedSkill(skill);
    try {
      const res = await axios.get(BASE_URL + "/explore?skill=" + encodeURIComponent(skill));
      setDevelopers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setSelectedSkill(null);
    setDevelopers([]);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading && !categories) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="font-mono text-sm text-muted text-center">
          <span className="text-accent">$</span> loading explore
          <span className="animate-blink ml-1 text-accent">▋</span>
        </div>
      </div>
    );
  }

  // Developer grid view
  if (selectedSkill) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={goBack}
            className="font-mono text-sm text-muted hover:text-accent transition-colors"
          >
            ← back
          </button>
          <h1 className="font-display font-bold text-2xl text-body">
            {SKILL_ICONS[selectedSkill] || "💻"} {selectedSkill} developers
          </h1>
          <span className="font-mono text-xs text-muted">
            ({developers.length} found)
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-elevated border border-border rounded-xl p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-surface" />
                  <div className="flex-1">
                    <div className="h-4 bg-surface rounded w-2/3 mb-2" />
                    <div className="h-3 bg-surface rounded w-1/3" />
                  </div>
                </div>
                <div className="h-3 bg-surface rounded w-full mb-2" />
                <div className="h-3 bg-surface rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : developers.length === 0 ? (
          <div className="text-center font-mono text-sm text-muted py-12">
            <span className="text-accent">$</span> No developers found with {selectedSkill}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {developers.map((dev, index) => (
              <Link
                to={`/dev/${dev._id}`}
                key={dev._id}
                className="bg-elevated border border-border rounded-xl p-5 card-glow animate-slide-up block"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar
                    src={dev.photoUrl}
                    name={`${dev.firstName} ${dev.lastName}`}
                    size="w-12 h-12"
                    className="border-2 border-border"
                  />
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-body truncate">
                      {dev.firstName} {dev.lastName}
                    </h3>
                    {dev.age && dev.gender && (
                      <p className="font-mono text-[11px] text-muted">
                        <span className="text-accent/60">#</span> {dev.age} · {dev.gender}
                      </p>
                    )}
                  </div>
                </div>

                {dev.about && (
                  <p className="text-sm text-muted line-clamp-2 mb-3">{dev.about}</p>
                )}

                {dev.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {dev.skills.slice(0, 4).map((s) => (
                      <SkillBadge key={s} skill={s} size="xs" />
                    ))}
                    {dev.skills.length > 4 && (
                      <span className="font-mono text-[10px] text-muted/50 self-center">
                        +{dev.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Category grid view
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-3xl text-body mb-2">
          Explore Developers
        </h1>
        <p className="font-mono text-sm text-muted">
          <span className="text-accent">$</span> browse by technology
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories?.map((cat, index) => (
          <button
            key={cat.skill}
            onClick={() => fetchBySkill(cat.skill)}
            className="bg-elevated border border-border rounded-xl p-4 text-left card-glow animate-slide-up group"
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            <div className="text-2xl mb-2">
              {SKILL_ICONS[cat.skill] || "💻"}
            </div>
            <h3 className="font-display font-semibold text-body text-sm group-hover:text-accent transition-colors">
              {cat.skill}
            </h3>
            <p className="font-mono text-[11px] text-muted mt-1">
              {cat.count} developer{cat.count !== 1 ? "s" : ""}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Explore;
