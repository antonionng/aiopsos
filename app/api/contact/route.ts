import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO = "ag@experrt.com";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM || "AIOPSOS <noreply@aiopsos.com>";

    if (!apiKey) {
      console.warn("[contact] RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { name, email, message } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const htmlBody = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111; margin-bottom: 24px;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email.trim())}">${escapeHtml(email.trim())}</a></p>
        <p><strong>Message:</strong></p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${escapeHtml(message.trim())}</div>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #666; font-size: 12px;">This message was sent via the AIOPSOS contact form.</p>
      </div>
    `;

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: TO,
      replyTo: email.trim(),
      subject: `Contact form: ${name.trim()}`,
      html: htmlBody,
    });

    if (error) {
      console.error("[contact] Resend API error:", JSON.stringify(error));
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
