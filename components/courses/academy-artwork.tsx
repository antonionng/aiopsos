import Image from "next/image";
import type { CourseCategory } from "@/lib/constants";

const subjects = {
  hr: { label: "People make the difference", mark: "We", caption: "BETTER SYSTEMS. MORE HUMAN WORK." },
  ai: { label: "Think bigger", mark: "Aa", caption: "HUMAN CURIOSITY. AI POSSIBILITY." },
  technology: { label: "Make room for better", mark: "↗", caption: "LESS REPETITION. MORE POSSIBILITY." },
  robotics: { label: "Meet your next skill", mark: "✳", caption: "NEW CONNECTIONS. REAL PROGRESS." },
};

export function AcademyArtwork({ category, variant = "", className = "" }: {
  category: CourseCategory; variant?: string; className?: string;
}) {
  const subject = subjects[category] ?? subjects.ai;
  const offset = [...variant].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 3;
  return (
    <div className={`academy-art academy-art-${category} academy-art-variant-${offset} ${className}`} aria-hidden="true">
      <Image src="/images/learning/possibility.webp" alt="" fill sizes="(max-width: 640px) 100vw, 50vw" className="academy-art-image" />
      <span className="academy-art-caption">{subject.caption}</span>
      <span className="academy-art-mark">{subject.mark}</span>
      <span className="academy-art-label">{subject.label}</span>
      <span className="academy-art-orbit" />
    </div>
  );
}
