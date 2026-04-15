const Bone = ({ className = "" }) => (
  <div
    className={`bg-border/60 rounded animate-pulse ${className}`}
  />
);

const SkeletonCard = () => (
  <div className="w-full max-w-sm">
    <div className="bg-elevated border border-border rounded-xl shadow-term overflow-hidden">
      {/* Photo placeholder */}
      <Bone className="aspect-[4/3] rounded-none" />

      {/* Info */}
      <div className="p-5 space-y-3">
        <div className="space-y-2">
          <Bone className="h-5 w-3/5" />
          <Bone className="h-3 w-2/5" />
        </div>
        <div className="space-y-1.5">
          <Bone className="h-3 w-full" />
          <Bone className="h-3 w-4/5" />
        </div>
        {/* Skill pills */}
        <div className="flex gap-1.5">
          <Bone className="h-5 w-16 rounded-md" />
          <Bone className="h-5 w-20 rounded-md" />
          <Bone className="h-5 w-14 rounded-md" />
        </div>
      </div>
    </div>

    {/* Fallback buttons placeholder */}
    <div className="flex justify-center gap-4 mt-6">
      <Bone className="w-14 h-14 rounded-full" />
      <Bone className="w-14 h-14 rounded-full" />
    </div>
  </div>
);

export default SkeletonCard;
