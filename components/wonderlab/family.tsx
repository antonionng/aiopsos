"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ParentRegistration } from "./register";
import { PictureTile } from "./art";
import { downloadWork } from "./player";
import type {
  Band,
  Child,
  Order,
  Picture,
  SavedProgress,
} from "@/lib/wonderlab/types";
type Lesson = { slug: string; title: string; band: Band; outcome: string };
type FamilyData = {
  children: Child[];
  memberships: {
    id: string;
    child_id: string;
    state: string;
    cancel_at_period_end: boolean;
    paid_until: string | null;
    canCancel: boolean;
  }[];
  orders: (Order & { lesson: { title: string; outcome: string } | null })[];
  progress: (SavedProgress & {
    child_id: string;
    mission_slug: string;
    passed: string[];
  })[];
  launch: { commerce: boolean; ai: boolean; terms: string | null };
};
const levels: Record<Band, string> = {
  explorers: "Little Explorers · 4–6",
  inventors: "Inventors · 7–10",
  creators: "Creators · 11–13",
  studio: "Future Studio · 14–16",
};
export function Family({ lessons }: { lessons: Lesson[] }) {
  const router = useRouter();
  const [register, setRegister] = useState(false);
  const [data, setData] = useState<FamilyData | null>(null);
  const [locked, setLocked] = useState(true);
  const [signedOut, setSignedOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [band, setBand] = useState<Band>("explorers");
  const [avatar, setAvatar] = useState<Picture>("robot");
  const [guardian, setGuardian] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [immediate, setImmediate] = useState(false);
  const [uk, setUk] = useState(false);
  const [deletion, setDeletion] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/wonderlab/family", { cache: "no-store" });
      const d = await r.json();
      if (r.status === 401 || r.status === 403) {
        setLocked(true);
        setSignedOut(r.status === 401);
        setData(null);
        return;
      }
      if (!r.ok) throw new Error(d.error);
      setData(d);
      setLocked(false);
      setSignedOut(false);
      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "The family area could not load.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  async function post(path: string, body: unknown) {
    const r = await fetch(`/api/wonderlab/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error);
    return d;
  }
  async function action(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  if (loading && !data)
    return (
      <div className="wl-lockscreen">
        <h1>Your family space</h1>
        <p role="status">Your family space is loading…</p>
      </div>
    );
  if (locked)
    return (
      <div className="wl-lockscreen">
        <span className="wl-eyebrow">FOR PARENTS & GUARDIANS</span>
        <h1>
          Help your child learn
          <br />
          in your family space.
        </h1>
        <p>
          Manage child profiles, memberships and private creations. We ask you
          to unlock this area before changing family settings.
        </p>
        {error && (
          <p role="alert" className="wl-error">
            {error}
          </p>
        )}
        {signedOut ? (
          <div className="wl-actions">
            <Link
              className="wl-button"
              href="/login?next=%2Fwonderlab%2Ffamily"
            >
              Parent sign in →
            </Link>
            <button
              className="wl-button wl-outline"
              onClick={() => setRegister((v) => !v)}
            >
              Create parent account
            </button>
          </div>
        ) : (
          <form
            className="wl-box wl-form"
            onSubmit={(e) => {
              e.preventDefault();
              void action(async () => {
                await post("session", { action: "unlock", password });
                setPassword("");
                await load();
              });
            }}
          >
            <label>
              Parent account password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={256}
              />
            </label>
            <button className="wl-button" disabled={busy}>
              Unlock family space
            </button>
            <Link className="wl-quiet-link" href="/forgot-password">
              Reset your parent password
            </Link>
          </form>
        )}
        {signedOut && register && (
          <ParentRegistration onCreated={() => void load()} />
        )}
        <p className="wl-caption">
          Child profiles do not need an email address.{" "}
          <Link href="/wonderlab/parents">See how family access works.</Link>
        </p>
      </div>
    );
  return (
    <div className="wl-family">
      <div className="wl-section-heading">
        <div>
          <span className="wl-eyebrow">THE GROWN-UP AREA</span>
          <h1>
            Follow your child’s
            <br />
            learning and creations.
          </h1>
          <p>
            You can manage your child’s profile, see what they have practised
            and download their private creations.
          </p>
        </div>
        <button
          className="wl-button wl-outline wl-button-small"
          disabled={busy}
          onClick={() =>
            void action(async () => {
              await post("session", { action: "lock" });
              setLocked(true);
              setData(null);
            })
          }
        >
          Lock parent area
        </button>
      </div>
      {error && (
        <p role="alert" className="wl-error">
          {error}
        </p>
      )}
      {!data?.launch.commerce && (
        <div className="wl-notice">
          Paid enrolment is not open yet. Explore the four free activities while
          the family pilot and launch review are completed.
        </div>
      )}
      <div className="wl-family-grid">
        {data?.children.map((child) => (
          <article className="wl-box" key={child.id}>
            <div className="wl-child-header">
              <PictureTile picture={child.avatar} />
              <div>
                <h2>{child.nickname}</h2>
                <p>{levels[child.band]}</p>
              </div>
            </div>
            {child.deletion_requested_at ? (
              <p className="wl-notice">
                Deletion requested. This profile is paused. You can export saved
                work while the request is processed.
              </p>
            ) : (
              <>
                <div className="wl-actions">
                  <button
                    disabled={busy}
                    className="wl-button wl-button-small"
                    onClick={() =>
                      void action(async () => {
                        await post("session", {
                          action: "play",
                          childId: child.id,
                        });
                        router.push("/wonderlab/play");
                        router.refresh();
                      })
                    }
                  >
                    Open mission map →
                  </button>
                </div>
                <label className="wl-check">
                  <input
                    type="checkbox"
                    disabled={
                      busy ||
                      !data.launch.ai ||
                      !["creators", "studio"].includes(child.band)
                    }
                    checked={child.ai_enabled}
                    onChange={(e) =>
                      void action(async () => {
                        await post("family", {
                          action: "preferences",
                          childId: child.id,
                          aiEnabled: e.target.checked,
                          narration: child.narration,
                        });
                        await load();
                      })
                    }
                  />
                  Allow guided AI creation in eligible teen lessons
                </label>
                <label className="wl-check">
                  <input
                    type="checkbox"
                    disabled={busy}
                    checked={child.narration}
                    onChange={(e) =>
                      void action(async () => {
                        await post("family", {
                          action: "preferences",
                          childId: child.id,
                          aiEnabled: child.ai_enabled,
                          narration: e.target.checked,
                        });
                        await load();
                      })
                    }
                  />
                  Prefer spoken instructions where the browser supports them
                </label>
              </>
            )}
            <details style={{ marginTop: 24 }}>
              <summary>Courses & creations</summary>
              {data.orders.filter((o) => o.child_id === child.id).length ===
                0 && (
                <p className="wl-caption">
                  Your child’s included courses will appear after membership
                  payment is confirmed.
                </p>
              )}
              {data.orders
                .filter((o) => o.child_id === child.id)
                .sort(
                  (a, b) =>
                    Number(
                      b.state === "paid" &&
                        new Date(b.expires_at ?? 0).getTime() > Date.now(),
                    ) -
                    Number(
                      a.state === "paid" &&
                        new Date(a.expires_at ?? 0).getTime() > Date.now(),
                    ),
                )
                .filter(
                  (order, index, list) =>
                    list.findIndex(
                      (o) => o.mission_slug === order.mission_slug,
                    ) === index,
                )
                .map((order) => {
                  const lesson = order.lesson;
                  const progress = data.progress.find(
                    (p) =>
                      p.child_id === child.id &&
                      p.mission_slug === order.mission_slug,
                  );
                  return (
                    <div className="wl-order-row" key={order.id}>
                      <div>
                        <strong>{lesson?.title ?? order.mission_slug}</strong>
                        <small>
                          {order.state === "pending"
                            ? "Awaiting confirmed payment"
                            : order.state === "refunded"
                              ? "Refunded"
                              : `Access until ${new Date(order.expires_at!).toLocaleDateString("en-GB", { timeZone: "Europe/London" })}`}
                        </small>
                        <small>
                          {progress?.completed
                            ? "Mission complete"
                            : `${progress?.passed?.length ?? 0} of 4 activities complete`}
                        </small>
                      </div>
                      {progress && (
                        <button
                          className="wl-button wl-outline wl-button-small"
                          onClick={() =>
                            downloadWork(
                              lesson?.title ?? order.mission_slug,
                              `${child.nickname} · ${lesson?.title}\n\n${progress.creation}\n\nParent summary\nYour child practised how to ${lesson ? lesson.outcome.charAt(0).toLowerCase() + lesson.outcome.slice(1) : "complete this activity"}.\n${progress.completed ? "Your child completed all activities and the project checks." : "Your child is still practising."}`,
                            )
                          }
                        >
                          Export
                        </button>
                      )}
                    </div>
                  );
                })}
            </details>
            {!child.deletion_requested_at && (
              <>
                <div className="wl-membership-panel">
                  <span className="wl-eyebrow">
                    ONE MEMBERSHIP. EVERY ADVENTURE.
                  </span>
                  <h3>
                    £20 <small>/ month for {child.nickname}</small>
                  </h3>
                  <p>
                    All {lessons.length} game-based courses, across every age
                    level. Start with {levels[child.band]} and explore at their
                    pace.
                  </p>
                  {(() => {
                    const membership = data.memberships.find(
                      (m) => m.child_id === child.id,
                    );
                    const live =
                      membership &&
                      !["pending", "canceled", "incomplete_expired"].includes(
                        membership.state,
                      );
                    return live ? (
                      <>
                        <p role="status">
                          <strong>
                            {membership.cancel_at_period_end
                              ? "Renewal cancelled"
                              : membership.state === "past_due" ||
                                  membership.state === "unpaid"
                                ? "Payment needs attention"
                                : "Membership active"}
                          </strong>
                          {membership.paid_until
                            ? ` · Access until ${new Date(membership.paid_until).toLocaleDateString("en-GB", { timeZone: "Europe/London" })}.`
                            : " · Waiting for confirmed payment."}
                        </p>
                        {["past_due", "unpaid"].includes(membership.state) && (
                          <p className="wl-caption">
                            <Link href="/contact">Contact Experrt</Link> for
                            help updating your payment method. Access ends if
                            the next payment is not confirmed by the end of your
                            paid month.
                          </p>
                        )}
                        {membership.canCancel &&
                          !membership.cancel_at_period_end &&
                          (cancelConfirm === membership.id ? (
                            <div>
                              <p>
                                Stop the next monthly payment? Access continues
                                until the end of the paid month.
                              </p>
                              <div className="wl-actions">
                                <button
                                  className="wl-button wl-button-small"
                                  disabled={busy}
                                  onClick={() =>
                                    void action(async () => {
                                      await post("membership", {
                                        action: "cancel",
                                        membershipId: membership.id,
                                      });
                                      setCancelConfirm(null);
                                      await load();
                                    })
                                  }
                                >
                                  Confirm cancellation
                                </button>
                                <button
                                  className="wl-read"
                                  onClick={() => setCancelConfirm(null)}
                                >
                                  Keep membership
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              className="wl-read"
                              disabled={busy}
                              onClick={() => setCancelConfirm(membership.id)}
                            >
                              Cancel monthly renewal
                            </button>
                          ))}
                      </>
                    ) : (
                      <button
                        style={{ marginTop: 15 }}
                        className="wl-button wl-button-small"
                        disabled={
                          busy ||
                          !data.launch.commerce ||
                          !accepted ||
                          !immediate ||
                          !uk
                        }
                        onClick={() =>
                          void action(async () => {
                            const result = await post("checkout", {
                              childId: child.id,
                              acceptedTerms: data.launch.terms,
                              immediateAccess: immediate,
                              ukResident: uk,
                            });
                            window.location.assign(result.url);
                          })
                        }
                      >
                        Join for {child.nickname} · £20/month
                      </button>
                    );
                  })()}
                  <p className="wl-caption">
                    Renews monthly. Cancel any time in this family area; access
                    continues until the end of the paid month. No separate
                    lesson charges.
                  </p>
                  {["creators", "studio"].includes(child.band) && (
                    <p className="wl-caption">
                      When enabled, eligible courses include 30 successful
                      guided AI generations per course in each paid month. Game
                      replays are unlimited while membership is active.
                    </p>
                  )}
                </div>
                <details style={{ marginTop: 20 }}>
                  <summary>Request profile deletion</summary>
                  <p className="wl-caption">
                    Export any work you want to keep first. We cancel monthly
                    renewal before accepting the request and pausing this
                    profile. If a checkout is still pending or cancellation
                    fails, we will explain what needs to be resolved. Billing
                    records may need to be retained separately.
                  </p>
                  {deletion === child.id ? (
                    <div className="wl-actions">
                      <button
                        className="wl-button wl-button-small"
                        disabled={busy}
                        onClick={() =>
                          void action(async () => {
                            await post("family", {
                              action: "delete-request",
                              childId: child.id,
                            });
                            setDeletion(null);
                            await load();
                          })
                        }
                      >
                        Confirm deletion request
                      </button>
                      <button
                        className="wl-read"
                        onClick={() => setDeletion(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="wl-read"
                      style={{ marginTop: 15 }}
                      onClick={() => setDeletion(child.id)}
                    >
                      Request deletion
                    </button>
                  )}
                </details>
              </>
            )}
          </article>
        ))}
      </div>
      <div className="wl-box">
        <h2>Create a profile for your child.</h2>
        <p className="wl-caption">
          Use a nickname, not a full name. Choose the child’s current age level.
          No date of birth, school or address is needed.
        </p>
        <form
          className="wl-form"
          onSubmit={(e) => {
            e.preventDefault();
            void action(async () => {
              await post("family", {
                action: "create",
                nickname,
                band,
                avatar,
                guardian,
              });
              setNickname("");
              setGuardian(false);
              await load();
            });
          }}
        >
          <label>
            Nickname
            <input
              required
              maxLength={30}
              autoComplete="off"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </label>
          <label>
            Age level
            <select
              value={band}
              onChange={(e) => setBand(e.target.value as Band)}
            >
              {Object.entries(levels).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Avatar
            <select
              value={avatar}
              onChange={(e) => setAvatar(e.target.value as Picture)}
            >
              <option value="robot">Robot</option>
              <option value="flower">Flower</option>
              <option value="rocket">Rocket</option>
              <option value="star">Star</option>
            </select>
          </label>
          <label className="wl-check">
            <input
              required
              type="checkbox"
              checked={guardian}
              onChange={(e) => setGuardian(e.target.checked)}
            />
            I am this child’s parent or guardian and have selected their current
            age level.
          </label>
          <button className="wl-button" disabled={busy}>
            Create child profile
          </button>
        </form>
      </div>
      {data?.launch.commerce && (
        <div className="wl-box">
          <h2>Review these details before starting a membership.</h2>
          <label className="wl-check">
            <input
              type="checkbox"
              checked={uk}
              onChange={(e) => setUk(e.target.checked)}
            />
            I am purchasing as a UK resident.
          </label>
          <label className="wl-check">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>
              I agree to £20 per month for each child I enrol, renewing until
              cancelled, and accept the{" "}
              <Link href="/wonderlab/terms">Wonderlab membership terms</Link> (
              {data.launch.terms}).
            </span>
          </label>
          <label className="wl-check">
            <input
              type="checkbox"
              checked={immediate}
              onChange={(e) => setImmediate(e.target.checked)}
            />
            I request immediate access and acknowledge the cancellation
            information in the purchase terms.
          </label>
        </div>
      )}
      <div className="wl-actions">
        <button
          className="wl-button wl-outline"
          onClick={() => void load()}
          disabled={loading}
        >
          Refresh memberships & progress
        </button>
      </div>
      <p className="wl-caption">
        A successful checkout return does not itself activate a membership.
        Access appears after payment confirmation.
      </p>
    </div>
  );
}
