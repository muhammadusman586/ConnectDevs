const Bone = ({ className = "" }) => (
  <div className={`bg-border/60 rounded animate-pulse ${className}`} />
);

const SkeletonProfile = () => (
  <div className="flex flex-col lg:flex-row items-start justify-center gap-8 px-4 py-6 max-w-5xl mx-auto">
    {/* Edit form skeleton */}
    <div className="w-full max-w-md">
      <div className="bg-elevated border border-border rounded-xl shadow-term overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
          <Bone className="w-3 h-3 rounded-full" />
          <Bone className="w-3 h-3 rounded-full" />
          <Bone className="w-3 h-3 rounded-full" />
          <Bone className="ml-3 h-3 w-24" />
        </div>

        <div className="p-6 space-y-4">
          <Bone className="h-6 w-1/3" />
          {/* 6 form fields */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Bone className="h-3 w-16" />
              <Bone className="h-10 w-full rounded-lg" />
            </div>
          ))}
          {/* Skills area */}
          <div className="space-y-1.5">
            <Bone className="h-3 w-12" />
            <Bone className="h-20 w-full rounded-lg" />
          </div>
          <Bone className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>

    {/* Preview card skeleton */}
    <div className="w-full max-w-sm">
      <Bone className="h-3 w-16 mb-3" />
      <div className="bg-elevated border border-border rounded-xl shadow-term overflow-hidden">
        <Bone className="aspect-[4/3] rounded-none" />
        <div className="p-5 space-y-3">
          <Bone className="h-5 w-3/5" />
          <Bone className="h-3 w-2/5" />
          <div className="space-y-1.5">
            <Bone className="h-3 w-full" />
            <Bone className="h-3 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonProfile;
