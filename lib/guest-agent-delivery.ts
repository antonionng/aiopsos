import "server-only";
import { Resend } from "resend";
import { captureInbound } from "@/lib/inbound-capture";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { packMarkdown } from "@/lib/guest-agent";
import type { GuestSession } from "@/lib/guest-agent-server";

/** Frozen contact + pack, separate provider keys and persisted send receipts
 * make retries safe even if one email succeeds and the other fails. Sessions
 * expire in 12 hours, inside Resend's 24-hour idempotency window. */
export async function deliverGuestPack(session: GuestSession) {
  if (!session.contact || !session.pack) throw new Error("Pack and contact required");
  const contact = session.contact;
  const markdown = packMarkdown(session.pack);
  await captureInbound({
    request_id: session.id, name: contact.name, email: contact.email,
    organisation_name: contact.organisation_name,
    source: "guest_agent", marketing_consent: false,
    message: `Learning agent enquiry\n\n${session.briefs.join("\n\n")}\n\n${session.pack.summary}`,
    assessment_data: { pack: session.pack, briefs: session.briefs, consent: "Send my pack and allow Experrt to follow up about it." },
  });
  if (session.user_sent && session.lead_sent) return;
  if (!process.env.RESEND_API_KEY) throw new Error("Delivery unavailable");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.EMAIL_FROM || "Experrt <noreply@experrt.com>";
  const attachment = { filename: "experrt-learning-pack.md", content: Buffer.from(markdown) };
  const sends = [
    { sent: session.user_sent, field: "user_sent", key: "visitor", to: contact.email,
      subject: "Your Experrt learning pack",
      text: `Hi ${contact.name},\n\nHere is the learning pack you created with Experrt. The complete materials are below and attached as an editable Markdown file.\n\n${markdown}\n\nReply to discuss putting this into practice with your team.\n\nThe Experrt team`, replyTo: "ag@experrt.com" },
    { sent: session.lead_sent, field: "lead_sent", key: "lead", to: "ag@experrt.com",
      subject: "New learning agent lead",
      text: `Name: ${contact.name}\nEmail: ${contact.email}\nOrganisation: ${contact.organisation_name || "Not supplied"}\n\nThe visitor requested their pack and agreed to follow-up about it. No newsletter opt-in.\n\nBriefs:\n${session.briefs.join("\n\n")}\n\n${markdown}`, replyTo: contact.email },
  ];
  const outcomes = await Promise.allSettled(sends.map(async (send) => {
    if (send.sent) return;
    const result = await resend.emails.send({ from, to: send.to, replyTo: send.replyTo,
      subject: send.subject, text: send.text, attachments: [attachment],
    }, { idempotencyKey: `guest-${session.id}-${send.key}` });
    if (result.error || !result.data?.id) throw new Error("Email delivery not accepted");
    const { error } = await supabaseAdmin.from("guest_agent_sessions").update({ [send.field]: true }).eq("id", session.id);
    if (error) throw new Error("Email receipt could not be saved");
  }));
  if (outcomes.some((result) => result.status === "rejected")) throw new Error("Some delivery is pending");
}
