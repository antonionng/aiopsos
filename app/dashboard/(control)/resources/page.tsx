"use client";
import { useLearningOverview } from "@/lib/lms/client";
import {
  Workspace,
  LoadingState,
  ActionLink,
} from "@/components/lms/workspace";
export default function Resources() {
  const { data, error, refresh } = useLearningOverview();
  const resources = [
    {title:"Conversation history",description:"Return to your saved conversations. Ask Experrt is available alongside your everyday work.",href:"/dashboard/chat",staff:false},
    {
      title: "Discover your learning needs",
      description:
        "A free check with immediate results. No sign-up or payment needed.",
      href: "/assessment/start",
      staff: false,
    },
    {
      title: "Your learning transcript",
      description:
        "Programmes, live training and certificates in one personal record.",
      href: "/dashboard/transcript",
      staff: false,
    },
    {
      title: "Your assessment results",
      description:
        "Revisit assessments you completed through your organisation.",
      href: "/dashboard/my-results",
      staff: false,
    },
    {
      title: "Live sessions",
      description: "Your booked training and trainer feedback.",
      href: "/dashboard/my-learning",
      staff: false,
    },
    {
      title: "Knowledge library",
      description:
        "Reference documents for your organisation and AI companion.",
      href: "/dashboard/knowledge",
      staff: true,
    },
    {
      title: "AI policy",
      description: "Your organisation’s guidance for responsible AI use.",
      href: "/dashboard/ai-policy",
      staff: false,
    },
    {
      title: "Training enquiries",
      description: "Customer requests for your training and consulting team.",
      href: "/dashboard/enquiries",
      staff: true,
    },
    {
      title: "Share links",
      description: "Manage invitations and shared assessment journeys.",
      href: "/dashboard/links",
      staff: true,
    },
  ];
  return (
    <Workspace
      data={data}
      title="Useful when you need them."
      description="The supporting tools for your learning, your team and your training business."
    >
      {!data ? (
        <LoadingState error={error} retry={refresh} />
      ) : (
        <div className="lms-grid">
          {resources
            .filter((r) => !r.staff || data.can_manage)
            .map((r) => (
              <section key={r.href} className="lms-panel">
                <h2>{r.title}</h2>
                <p>{r.description}</p>
                <ActionLink href={r.href}>Open</ActionLink>
              </section>
            ))}
        </div>
      )}
    </Workspace>
  );
}
