export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="skeleton-shimmer h-8 w-48 rounded-lg" />
        <div className="skeleton-shimmer mt-2 h-4 w-72 rounded-lg" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-shimmer h-40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
