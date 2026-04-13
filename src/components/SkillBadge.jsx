/* eslint-disable react/prop-types */
const SkillBadge = ({ skill, onRemove, size = "sm" }) => {
  const sizeClasses =
    size === "xs"
      ? "text-[10px] px-1.5 py-0.5 gap-1"
      : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-mono border border-accent/30 text-accent rounded-md bg-accent/5 hover:bg-accent/10 transition-colors duration-150 ${sizeClasses}`}
    >
      {skill}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          className="text-accent/50 hover:text-accent transition-colors leading-none"
          aria-label={`Remove ${skill}`}
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
