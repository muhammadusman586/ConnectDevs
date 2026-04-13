import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-elevated border border-border rounded-xl shadow-term overflow-hidden">
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]/90" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/90" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]/90" />
            <span className="ml-3 font-mono text-xs text-muted">
              bash — 404
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-6 font-mono text-sm space-y-3">
            <p>
              <span className="text-accent">$</span>{" "}
              <span className="text-body">cd {location.pathname}</span>
            </p>
            <p className="text-red-400">
              bash: cd: {location.pathname}: No such file or directory
            </p>
            <div className="border-t border-border my-4" />
            <p className="text-muted text-xs">
              The page you're looking for doesn't exist or has been moved.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-4 py-2.5 px-5 bg-accent text-bg font-display font-semibold text-sm rounded-lg hover:bg-accent-bright transition-all duration-200 active:scale-[0.98] shadow-glow-sm"
            >
              <span className="font-mono">~</span> Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
