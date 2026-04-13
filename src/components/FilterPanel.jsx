/* eslint-disable react/prop-types */
import { useState } from "react";
import SkillBadge from "./SkillBadge";

const POPULAR_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust",
  "React", "Next.js", "Vue", "Angular", "Node.js", "Express",
  "MongoDB", "PostgreSQL", "Docker", "AWS", "Tailwind CSS", "GraphQL",
];

const FilterPanel = ({ filters, onChange, onReset }) => {
  const [open, setOpen] = useState(false);

  const toggleSkill = (skill) => {
    const current = filters.skills || [];
    const updated = current.includes(skill)
      ? current.filter((s) => s !== skill)
      : [...current, skill];
    onChange({ ...filters, skills: updated });
  };

  const hasFilters =
    (filters.skills?.length > 0) ||
    filters.minAge ||
    filters.maxAge ||
    filters.gender;

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 font-mono text-xs px-3 py-2 rounded-lg border transition-all duration-200 ${
          hasFilters
            ? "border-accent/40 text-accent bg-accent/5"
            : "border-border text-muted hover:border-accent/20 hover:text-accent"
        }`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        filters
        {hasFilters && (
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        )}
        <span className="text-muted/40 ml-1">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="mt-3 p-4 bg-elevated border border-border rounded-xl space-y-4 animate-fade-in">
          {/* Skills */}
          <div>
            <label className="block font-mono text-xs text-muted mb-2">
              skills
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SKILLS.map((skill) => {
                const active = filters.skills?.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`font-mono text-[11px] px-2 py-1 rounded-md border transition-all duration-150 ${
                      active
                        ? "border-accent text-accent bg-accent/10"
                        : "border-border text-muted/60 hover:border-accent/30 hover:text-muted"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
            {filters.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {filters.skills.map((s) => (
                  <SkillBadge
                    key={s}
                    skill={s}
                    size="xs"
                    onRemove={() => toggleSkill(s)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Age range */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-mono text-xs text-muted mb-1.5">
                minAge
              </label>
              <input
                type="number"
                min="7"
                max="99"
                value={filters.minAge || ""}
                onChange={(e) =>
                  onChange({ ...filters, minAge: e.target.value || "" })
                }
                placeholder="18"
                className="terminal-input"
              />
            </div>
            <div className="flex-1">
              <label className="block font-mono text-xs text-muted mb-1.5">
                maxAge
              </label>
              <input
                type="number"
                min="7"
                max="99"
                value={filters.maxAge || ""}
                onChange={(e) =>
                  onChange({ ...filters, maxAge: e.target.value || "" })
                }
                placeholder="60"
                className="terminal-input"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block font-mono text-xs text-muted mb-1.5">
              gender
            </label>
            <div className="flex gap-2">
              {["", "male", "female", "other"].map((g) => (
                <button
                  key={g}
                  onClick={() => onChange({ ...filters, gender: g })}
                  className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                    filters.gender === g
                      ? "border-accent text-accent bg-accent/10"
                      : "border-border text-muted/60 hover:border-accent/30"
                  }`}
                >
                  {g || "all"}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {hasFilters && (
            <button
              onClick={onReset}
              className="font-mono text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              × clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
