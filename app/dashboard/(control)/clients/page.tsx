"use client";
import { useState } from "react";
import { useLearningOverview } from "@/lib/lms/client";
import {
  Workspace,
  LoadingState,
  ManagerOnly,
  Notice,
  useMutation,
  ActionLink,
} from "@/components/lms/workspace";
export default function Clients() {
  const { data, error, refresh } = useLearningOverview();
  const { busy, message, setMessage, mutate } = useMutation(refresh);
  const [code, setCode] = useState("");
  const [name, setName] = useState<string | null>(null);
  const [accent, setAccent] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  async function connect(e: React.FormEvent) {
    e.preventDefault();
    const r = await mutate({
      action: "client.request",
      payload: { client_org_id: code.trim() },
    });
    if (r) {
      setCode("");
      setMessage(
        "Connection requested. The client's manager must accept before you can access their roster or assign learning.",
      );
    }
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const currentMode =
      mode ||
      (data?.settings
        ? data.settings.provider && data.settings.enterprise
          ? "both"
          : data.settings.provider
            ? "provider"
            : "enterprise"
        : "both");
    const r = await mutate({
      action: "settings.save",
      payload: {
        brand_name: name ?? data?.settings?.brand_name ?? "Experrt learning",
        accent: accent ?? data?.settings?.accent ?? "#7046eb",
        provider: currentMode !== "enterprise",
        enterprise: currentMode !== "provider",
      },
    });
    if (r) setMessage("Workspace identity and operating model saved.");
  }
  return (
    <Workspace
      data={data}
      title="People & organisations"
      description="Run your own academy, deliver learning for clients, or do both. Every organisation keeps a separate workspace and roster."
    >
      {!data ? (
        <LoadingState error={error} retry={refresh} />
      ) : (
        <ManagerOnly data={data}>
          <Notice message={message} />
          <div className="lms-split">
            <form className="lms-panel lms-form" onSubmit={save}>
              <h2>How your company uses Experrt</h2>
              <label>
                Learning workspace name
                <input
                  minLength={2}
                  maxLength={100}
                  required
                  value={
                    name ?? data.settings?.brand_name ?? "Experrt learning"
                  }
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                Operating model
                <select
                  value={
                    mode ||
                    (data.settings
                      ? data.settings.provider && data.settings.enterprise
                        ? "both"
                        : data.settings.provider
                          ? "provider"
                          : "enterprise"
                      : "both")
                  }
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="both">Training provider + our own team</option>
                  <option value="provider">
                    Training provider serving clients
                  </option>
                  <option value="enterprise">Employer / internal L&D</option>
                </select>
              </label>
              <label>
                Workspace accent
                <input
                  type="color"
                  value={accent ?? data.settings?.accent ?? "#7046eb"}
                  onChange={(e) => setAccent(e.target.value)}
                />
              </label>
              <button className="lms-button" disabled={busy}>
                Save workspace
              </button>
              <p>
                These preferences shape your learning overview. Access always
                follows your role and explicit client connections.
              </p>
            </form>
            <section className="lms-panel">
              <h2>Your workspace code</h2>
              <p>
                Share this code with a training provider you want to work with.
                Sharing the code alone grants no access.
              </p>
              <p className="lms-prose">{data.org_id}</p>
              <button
                className="lms-button secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(data.org_id);
                    setMessage("Workspace code copied.");
                  } catch {
                    setMessage("Select and copy the workspace code above.");
                  }
                }}
              >
                Copy workspace code
              </button>
              <p>
                People join through your existing organisation membership. Keep
                employee administration with the employer.
              </p>
              <ActionLink href="/dashboard/settings">
                People & organisation settings
              </ActionLink>
            </section>
          </div>
          <form className="lms-panel lms-form" onSubmit={connect}>
            <h2>Deliver learning for a client</h2>
            <p>
              Ask your client for their workspace code. They approve the
              connection before you can see their people or deliver a programme
              to them.
            </p>
            <label>
              Client workspace code
              <input
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste the client's workspace code"
              />
            </label>
            <button className="lms-button" disabled={busy}>
              Request client connection
            </button>
          </form>
          <h2 className="lms-section-title">Connected organisations</h2>
          <div className="lms-grid">
            {data.clients.map((c) => (
              <section className="lms-panel" key={c.id}>
                <span className={`lms-badge ${c.state}`}>{c.state}</span>
                <h2 style={{ marginTop: 16 }}>
                  {c.provider_org_id === data.org_id
                    ? c.client_name
                    : c.provider_name}
                </h2>
                <p>
                  {c.provider_org_id === data.org_id
                    ? "Your client workspace"
                    : "Your training provider"}
                </p>
                {c.client_org_id === data.org_id && c.state === "pending" && (
                  <>
                    <p>
                      Accepting allows this provider to see your workforce
                      names, assign programmes to your people, and review work
                      submitted to their programmes. They cannot read your
                      unrelated courses or programmes.
                    </p>
                    <div className="lms-row">
                      <button
                        className="lms-button"
                        disabled={busy}
                        onClick={() =>
                          mutate({
                            action: "client.respond",
                            payload: { id: c.id, accept: true },
                          })
                        }
                      >
                        Accept connection
                      </button>
                      <button
                        className="lms-button secondary"
                        disabled={busy}
                        onClick={() =>
                          mutate({
                            action: "client.respond",
                            payload: { id: c.id, accept: false },
                          })
                        }
                      >
                        Decline
                      </button>
                    </div>
                  </>
                )}
                {c.state === "accepted" && (
                  <div className="lms-spaced">
                    <ActionLink href="/dashboard/programmes">
                      View programmes
                    </ActionLink>
                    <details>
                      <summary>Disconnect this relationship</summary>
                      <p>
                        Disconnecting stops roster sharing and new assignments.
                        Both organisations retain records for programmes already
                        delivered.
                      </p>
                      <button
                        className="lms-button secondary"
                        disabled={busy}
                        onClick={() =>
                          mutate({
                            action: "client.disconnect",
                            payload: { id: c.id },
                          })
                        }
                      >
                        Disconnect organisation
                      </button>
                    </details>
                  </div>
                )}
              </section>
            ))}
          </div>
          {!data.clients.length && (
            <p className="lms-muted">No client or provider connections yet.</p>
          )}
        </ManagerOnly>
      )}
    </Workspace>
  );
}
