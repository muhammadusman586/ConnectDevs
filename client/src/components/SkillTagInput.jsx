/* eslint-disable react/prop-types */
import { useState } from "react";
import SkillBadge from "./SkillBadge";

const SUGGESTIONS = [
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++",
  "React", "Next.js", "Vue", "Angular", "Svelte", "Node.js", "Express",
  "Django", "FastAPI", "Spring Boot", "Ruby on Rails",
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure",
  "GraphQL", "REST", "gRPC", "Tailwind CSS", "Swift", "Kotlin",
  "Flutter", "React Native", "Electron", "Git", "Linux",
];

const SkillTagInput = ({ skills, onChange, maxSkills = 10 }) => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = input.trim()
    ? SUGGESTIONS.filter(
        (s) =>
          s.toLowerCase().includes(input.toLowerCase()) &&
          !skills.includes(s)
      ).slice(0, 6)
    : [];

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed || skills.includes(trimmed) || skills.length >= maxSkills)
      return;
    onChange([...skills, trimmed]);
    setInput("");
    setShowSuggestions(false);
  };

  const removeSkill = (skill) => {
    onChange(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filtered.length > 0) {
        addSkill(filtered[0]);
      } else if (input.trim()) {
        addSkill(input);
      }
    }
    if (e.key === "Backspace" && !input && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div className="relative">
      <label className="block font-mono text-xs text-muted mb-1.5">
        skills
      </label>

      {/* Tags + input row */}
      <div className="flex flex-wrap gap-1.5 p-2.5 bg-surface border border-border rounded-lg focus-within:border-accent/40 accent-focus-ring-within transition-all duration-200">
        {skills.map((skill) => (
          <SkillBadge key={skill} skill={skill} onRemove={removeSkill} />
        ))}
        {skills.length < maxSkills && (
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={skills.length === 0 ? "Type a skill + Enter" : ""}
            className="flex-1 min-w-[120px] bg-transparent text-body font-mono text-sm outline-none placeholder:text-muted/40"
          />
        )}
      </div>

      <p className="font-mono text-[10px] text-muted/50 mt-1">
        {skills.length}/{maxSkills} skills
      </p>

      {/* Autocomplete dropdown */}
      {showSuggestions && filtered.length > 0 && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-elevated border border-border rounded-lg shadow-term overflow-hidden">
          {filtered.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={() => addSkill(suggestion)}
              className="w-full text-left px-3 py-2 font-mono text-xs text-muted hover:bg-surface hover:text-accent transition-colors duration-100"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillTagInput;
