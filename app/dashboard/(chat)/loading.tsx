/** Shown while the chat route resolves role and plan on the server. */
export default function ChatLoading() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="h-[45px] shrink-0 border-b border-border" />
      <div className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
