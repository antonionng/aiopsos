import * as React from "react";

interface InviteEmailProps {
  name: string;
  inviterName: string;
  loginUrl: string;
}

export function InviteEmail({ name, inviterName, loginUrl }: InviteEmailProps) {
  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
        backgroundColor: "#201C29",
        color: "#FFFEFA",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "40px",
            color: "#ffffff",
          }}
        >
          Experrt
        </p>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            margin: "0 0 16px",
            color: "#ffffff",
          }}
        >
          You&apos;re invited, {name}.
        </h1>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#D5C7FF",
            margin: "0 0 8px",
          }}
        >
          {inviterName} has invited you to join their team on Experrt, your space for learning, people and progress.
        </p>

        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#D5C7FF",
            margin: "0 0 32px",
          }}
        >
          Accept your invitation, choose a password and start learning with your team. This link is single-use.
        </p>

        <a
          href={loginUrl}
          style={{
            display: "inline-block",
            backgroundColor: "#E4F477",
            color: "#201C29",
            fontSize: "14px",
            fontWeight: 600,
            padding: "12px 28px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Accept invitation
        </a>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            margin: "40px 0 20px",
          }}
        />

        <p style={{ fontSize: "12px", color: "#BEB3D0", margin: 0 }}>
          Experrt. Stay curious. Get unstoppable.
        </p>
      </div>
    </div>
  );
}
