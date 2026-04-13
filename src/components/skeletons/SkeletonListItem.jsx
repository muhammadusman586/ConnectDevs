const Bone = ({ className = "" }) => (
  <div className={`bg-border/60 rounded animate-pulse ${className}`} />
);

const SkeletonListItem = () => (
  <div className="flex items-center gap-4 p-4 bg-elevated border border-border rounded-xl">
    {/* Avatar */}
    <Bone className="w-14 h-14 rounded-full shrink-0" />

    <div className="flex-1 min-w-0 space-y-2">
      <Bone className="h-4 w-2/5" />
      <Bone className="h-3 w-1/4" />
      <Bone className="h-3 w-3/4" />
      {/* Skill pills */}
      <div className="flex gap-1 pt-0.5">
        <Bone className="h-4 w-12 rounded-md" />
        <Bone className="h-4 w-16 rounded-md" />
      </div>
    </div>
  </div>
);

export default SkeletonListItem;
