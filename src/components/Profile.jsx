import { useSelector } from "react-redux"
import EditProfile from "./EditProfile"
import SkeletonProfile from "./skeletons/SkeletonProfile"


const Profile = () => {
  const user = useSelector((store) => store.user);

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
    </div>
  );
}

export default Profile
