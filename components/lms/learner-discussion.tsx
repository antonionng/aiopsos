"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AssistantMessage } from "./assistant-message";
type Post = {
  id: string;
  parent_id: string | null;
  body: string;
  created_at: string;
  author_name: string;
};
export function LearnerDiscussion({ programmeId, cohortId }: { programmeId?: string; cohortId?: string }) {
  const endpoint = cohortId ? `/api/cohorts/${cohortId}/discussion` : `/api/lms/programmes/${programmeId}/discussion`;
  const composer = useRef<HTMLTextAreaElement>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [posts, setPosts] = useState<Post[]>([]),
    [body, setBody] = useState(""),
    [reply, setReply] = useState<Post | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [readOnly, setReadOnly] = useState(false),
    [loading, setLoading] = useState(true);
  const pending = useRef<{
      body: string;
      parent_id: string | null;
      request_id: string;
    } | null>(null),
    lock = useRef(false);
  const load = useCallback(async () => {
    try {
      const r = await fetch(endpoint, {
        cache: "no-store",
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setPosts(d.posts);
      setReadOnly(d.read_only);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load discussion.");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);
  useEffect(() => {
    void load();
  }, [load]);
  async function post(e: React.FormEvent) {
    e.preventDefault();
    if (lock.current || !body.trim()) return;
    lock.current = true;
    setBusy(true);
    setError("");
    const parent = reply?.id ?? null;
    if (
      !pending.current ||
      pending.current.body !== body.trim() ||
      pending.current.parent_id !== parent
    )
      pending.current = {
        body: body.trim(),
        parent_id: parent,
        request_id: crypto.randomUUID(),
      };
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pending.current),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setPosts(d.posts);
      setBody("");
      setReply(null);
      pending.current = null;
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not post. Your message is still here.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const roots = posts.filter(p => !p.parent_id || !posts.some(x => x.id === p.parent_id));
  const visible = roots.filter(p => !search || [p, ...posts.filter(x => x.parent_id === p.id)].some(x => `${x.body} ${x.author_name}`.toLowerCase().includes(search.toLowerCase()))).sort((a,b) => sort === "newest" ? b.created_at.localeCompare(a.created_at) : a.created_at.localeCompare(b.created_at));
  function startReply(p: Post) { setReply(p); setTimeout(() => { composer.current?.focus(); composer.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 0); }
  function avatar(name: string) { return (name || "Group member").split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase(); }
  function renderPost(p: Post, depth = 0): React.ReactNode {
    const replies = posts.filter(x => x.parent_id === p.id);
    return <article key={p.id} className={depth ? (depth < 4 ? "mt-4 border-l-2 border-violet-200 pl-4" : "mt-4 border-t pt-4") : "rounded-3xl border bg-card p-5 shadow-sm sm:p-6"}>
      <header className="mb-4 flex items-center gap-3">
        <div aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-800">{avatar(p.author_name)}</div>
        <div><h3 className="text-sm font-semibold">{p.author_name || "Group member"}</h3><time dateTime={p.created_at} className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</time></div>
      </header>
      <AssistantMessage text={p.body} />
      <div className="mt-4 flex items-center gap-4 border-t pt-3 text-sm">
        {!readOnly && <button onClick={() => startReply(p)} className="font-semibold text-brand">Reply</button>}
        <span className="text-muted-foreground">{replies.length} {replies.length === 1 ? "reply" : "replies"}</span>
      </div>
      {replies.map(r => renderPost(r, depth + 1))}
    </article>;
  }
  return <section id="training-wall" className="training-wall scroll-mt-24 space-y-5">
    <header className="training-wall-hero">
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[36px] border-white/10" />
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">Your people. Your progress.</p>
      <h2 className="text-3xl font-bold tracking-tight">{cohortId ? "Cohort wall" : "Training wall"}</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-violet-100">Share a breakthrough, ask a question or keep the conversation going between sessions. This is your group’s space to learn together.</p>
      <p className="mt-5 text-xs text-violet-200">Private to this training group and its trainers · {roots.length} conversations</p>
    </header>
    <div className={error ? "wall-access-layout" : "training-wall-layout"}>
      <div className="min-w-0 space-y-5">
        {!readOnly && !error && <form onSubmit={post} className="rounded-3xl border bg-card p-5 shadow-sm">
          {reply && <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-violet-50 p-3 text-sm text-violet-900"><span>Replying to {reply.author_name}</span><button type="button" onClick={() => setReply(null)}>Cancel reply</button></div>}
          <label htmlFor={`wall-${cohortId || programmeId}`} className="mb-3 block font-semibold">{reply ? "Add to the conversation" : "What are you learning today?"}</label>
          <textarea id={`wall-${cohortId || programmeId}`} ref={composer} value={body} onChange={e => setBody(e.target.value)} maxLength={4000} required rows={3} className="w-full resize-y rounded-2xl border bg-muted/30 p-4 text-sm outline-none focus:ring-2 focus:ring-violet-400" placeholder="Share a question, an idea or a small win…" />
          <div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{body.length.toLocaleString()} / 4,000</span><button className="lms-button" disabled={busy || loading || !body.trim()}>{busy ? "Posting…" : reply ? "Post reply" : "Post to wall"}</button></div>
        </form>}
        {error && <div role="alert" className="wall-access-card"><span className="wall-access-icon" aria-hidden="true">↗</span><div><h3>Let’s get you to the right group.</h3><p>{error}</p><button onClick={load} className="lms-button secondary">Check access again</button></div></div>}
        {readOnly && <p className="rounded-xl bg-muted p-4 text-sm">This wall is read-only. Earlier conversations remain available.</p>}
        {!error && <div className="flex flex-wrap gap-3">
          <input aria-label="Search wall" placeholder="Search conversations…" value={search} onChange={e => setSearch(e.target.value)} className="min-w-0 flex-1 rounded-full border bg-card px-4 py-2 text-sm" />
          <select aria-label="Sort conversations" value={sort} onChange={e => setSort(e.target.value)} className="rounded-full border bg-card px-3 py-2 text-sm"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select>
          <button onClick={load} className="rounded-full border bg-card px-4 py-2 text-sm">Refresh</button>
        </div>
        }
        {visible.map(p => renderPost(p))}
        {!visible.length && !error && <div className="rounded-3xl border border-dashed bg-card p-10 text-center"><span className="text-4xl" aria-hidden="true">✳</span><h3 className="mt-4 text-xl font-semibold">{loading ? "Opening your wall…" : search ? "No matching conversations" : "Every connection starts with a hello."}</h3><p className="mt-2 text-sm text-muted-foreground">{search ? "Try a different name or phrase." : "Introduce yourself and share one thing you’re hoping to put into practice."}</p></div>}
      </div>
      {!error && <aside className="wall-guide rounded-3xl border bg-card p-6"><span className="text-xs font-semibold uppercase tracking-wider text-brand">Make it your space</span><h3 className="my-3 text-lg font-semibold">Better together.</h3><ul className="space-y-4 text-sm text-muted-foreground"><li>Ask the question someone else might be wondering about.</li><li>Share a small win or something you tried at work.</li><li>Offer helpful, constructive feedback.</li></ul><p className="mt-5 border-t pt-4 text-xs leading-relaxed text-muted-foreground">People from different companies may learn in the same group. Keep confidential information out of posts. Submit assessed work through your activity workspace.</p></aside>}
    </div>
  </section>;
}
