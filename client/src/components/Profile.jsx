import { useSelector } from "react-redux"
import EditProfile from "./EditProfile"
import GitHubProfile from "./GitHubProfile"
import SkeletonProfile from "./skeletons/SkeletonProfile"


const Profile = () => {
  const user = useSelector((store) => store.user.data);

  if (!user)
    return (
      <div>
        <p className="text-center font-mono text-xs text-muted mt-6">
          <span className="text-accent">$</span> loading profile
          <span className="animate-blink ml-1 text-accent">▋</span>
        </p>
        <SkeletonProfile />
      </div>
    );

  return (
    <div>
      <EditProfile user={user} />
      {user.github?.username && (
        <div className="max-w-5xl mx-auto px-4 pb-8">
          <div className="max-w-md">
            <div className="bg-elevated border border-border rounded-xl shadow-term overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]/90" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/90" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]/90" />
                <span className="ml-3 font-mono text-xs text-muted">
                  github.sh
                </span>
              </div>
              <div className="p-6">
                <GitHubProfile userId={user._id} github={user.github} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile
