/* eslint-disable react/prop-types */
const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

const RepoCard = ({ repo }) => {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 bg-surface border border-border rounded-lg hover:border-accent/25 transition-all duration-200 group"
    >
      <span className="font-mono text-[11px] text-muted/40 mt-0.5 shrink-0 hidden sm:block">
        drwxr-xr-x
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-accent group-hover:text-accent-bright transition-colors truncate">
            {repo.name}
          </span>
          {repo.language && (
            <span className="flex items-center gap-1 shrink-0">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: LANG_COLORS[repo.language] || "#999",
                }}
              />
              <span className="font-mono text-[10px] text-muted/60">
                {repo.language}
              </span>
            </span>
          )}
        </div>
        {repo.description && (
          <p className="text-xs text-muted/60 mt-0.5 truncate">
            {repo.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0 font-mono text-[10px] text-muted/50">
        <span className="flex items-center gap-0.5">
          ★ {repo.stars}
        </span>
        {repo.forks > 0 && (
          <span className="flex items-center gap-0.5">
            ⑂ {repo.forks}
          </span>
        )}
      </div>
    </a>
  );
};

export default RepoCard;
