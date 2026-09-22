import * as React from "react";
import { EmailShell, emailStyles } from "./academy-shell";

interface RoadmapReadyEmailProps {
  name: string;
  orgName: string;
  phaseCount: number;
  roadmapUrl: string;
}

export function RoadmapReadyEmail({
  name,
  orgName,
  phaseCount,
  roadmapUrl,
}: RoadmapReadyEmailProps) {
  return (
    <EmailShell heading="Your 90-day roadmap is ready" eyebrow="A direction, not just a catalogue">
      <p style={emailStyles.paragraph}>
        Hi {name}, the adoption roadmap for {orgName} is ready to open.
      </p>
      <p style={emailStyles.lastParagraph}>
        It has {phaseCount} phases, with milestones drawn from your assessment
        results.
      </p>
      <a href={roadmapUrl} style={emailStyles.button}>
        View roadmap
      </a>
    </EmailShell>
  );
}
