/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import RepoCard from "./RepoCard";

const GitHubProfile = ({ userId, github }) => {
  const [repos, setRepos] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!github?.username) return;

    const fetchData = async () => {
      try {
        const [reposRes, profileRes] = await Promise.all([
          axios.get(BASE_URL + "/github/repos/" + userId + "?limit=6", {
            withCredentials: true,
          }),
          axios.get(BASE_URL + "/github/profile/" + userId, {
            withCredentials: true,
          }),
        ]);
        setRepos(reposRes.data.data);
        setProfile(profileRes.data.data);
      } catch (err) {
        console.error("GitHub data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, github]);

  if (!github?.username) return null;

  if (loading) {
    return (
      <div className="animate-fade-in">
        <p className="font-mono text-xs text-muted mb-4">
          <span className="text-accent">$</span> fetching github data
          <span className="animate-blink ml-1 text-accent">▋</span>
        </p>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-14 bg-border/40 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Profile summary */}
      {profile && (
        <div className="flex items-center gap-3 p-3 bg-surface border border-border rounded-lg">
          <img
            src={profile.avatarUrl}
            alt={profile.username}
            className="w-10 h-10 rounded-full border border-border"
          />
          <div className="flex-1 min-w-0">
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-accent hover:text-accent-bright transition-colors"
            >
              @{profile.username}
            </a>
            <div className="flex items-center gap-3 font-mono text-[10px] text-muted/50 mt-0.5">
              <span>{profile.publicRepos} repos</span>
              <span>{profile.followers} followers</span>
            </div>
          </div>
        </div>
      )}

      {/* Languages */}
      {profile?.languages?.length > 0 && (
        <div>
          <p className="font-mono text-[10px] text-muted/40 mb-2">
            languages
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.languages.slice(0, 8).map((lang) => (
              <span
                key={lang.name}
                className="font-mono text-[10px] px-2 py-0.5 rounded-md border border-border text-muted/70"
              >
                {lang.name}{" "}
                <span className="text-muted/30">({lang.count})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Repos */}
      {repos && repos.length > 0 && (
        <div>
          <p className="font-mono text-xs text-muted mb-2">
            <span className="text-accent/60">$</span> ls repos/
          </p>
          <div className="space-y-1.5">
            {repos.map((repo) => (
              <RepoCard key={repo.name} repo={repo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubProfile;
