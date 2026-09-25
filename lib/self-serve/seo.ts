import { SELF_SERVE_COURSES, coursesByTrack, trackLabel } from "./catalog.ts";
import { courseArtefact } from "./engine.ts";
import { formatCourseHours } from "./landing.ts";
import { COURSE_SALES } from "./sales-copy.ts";
import { getPublicSiteUrl } from "../site.ts";
import type { ReviewSummary } from "./reviews.ts";
import type { SelfServeCourse, SelfServeTrack } from "./types.ts";

export type Faq = { question: string; answer: string };

export type TopicHub = {
  track: SelfServeTrack;
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string[];
  faqs: Faq[];
};

export const TOPIC_HUBS: TopicHub[] = [
  {
    track: "ai",
    slug: "ai-courses",
    title: "Self-paced AI courses for professionals",
    metaTitle: "AI Courses Online for Professionals, with Certificate",
    description:
      "Self-paced online AI courses for UK professionals: prompt engineering, checking AI output, AI agents, secure use, and EU AI Act literacy. Each ends with signed, verifiable work.",
    intro: [
      "These courses teach the working skills employers now expect from people who use AI tools: writing a clear instruction, checking what the tool produces, keeping company data safe, and knowing what the EU AI Act asks of staff.",
      "Every course is built on realistic workplace material. You practise with immediate feedback, pass a scenario assessment, and finish with a piece of work you sign, which a manager or client can verify online.",
    ],
    faqs: [
      {
        question: "Which AI course should I take first?",
        answer:
          "Most professionals start with Prompt Engineering for Professional Work, because it teaches how a model uses the instruction it is given. AI Output Verification is the natural second course, because it teaches how to check what the model produced before anyone relies on it.",
      },
      {
        question: "Do I need a technical background?",
        answer:
          "No. The courses are written for people in operations, customer, people, finance, and management roles. Every term is explained before it is used, and every exercise uses the kind of document you already handle at work.",
      },
      {
        question: "Do these courses help with the EU AI Act literacy duty?",
        answer:
          "Article 4 of the EU AI Act has required providers and deployers of AI systems to take measures to ensure a sufficient level of AI literacy among their staff since 2 February 2025. Our courses provide documented, assessed training that can form part of those measures. The signed record states what was completed and does not claim compliance with any regulation.",
      },
    ],
  },
  {
    track: "technology",
    slug: "technology-courses",
    title: "Self-paced technology courses for non-technical teams",
    metaTitle: "Technology and Digital Skills Courses for Non-Technical Teams",
    description:
      "Self-paced online courses on choosing software, no-code automation, data skills, security decisions, and running a technology rollout. Written for managers and teams who are not IT specialists.",
    intro: [
      "These courses help managers and teams make sound decisions about the software they buy, connect, and roll out, without needing to become IT specialists.",
      "Each course works through realistic cases, from a licence review to a rollout plan, and ends with a document you sign and can hand to your organisation, such as a decision note or a rollout sheet.",
    ],
    faqs: [
      {
        question: "Who are the technology courses for?",
        answer:
          "They are written for managers, team leads, and operations staff who choose, buy, or introduce software but do not work in IT. No coding or technical training is assumed.",
      },
      {
        question: "What will I produce?",
        answer:
          "Every course ends with a practical document built from your own work, such as a choice record, an automation note, or a rollout sheet. You sign it, and it becomes the record an employer can verify online.",
      },
      {
        question: "How long do the courses take?",
        answer:
          "Most take between two and three hours, studied at your own pace. Progress is saved to your account, so you can stop and return whenever you need to.",
      },
    ],
  },
  {
    track: "robotics",
    slug: "robotics-courses",
    title: "Self-paced robotics and automation courses for non-engineers",
    metaTitle: "Robotics and Automation Courses for Non-Engineers",
    description:
      "Self-paced online courses on robotics for managers, planners, and finance partners: where a robot belongs, cobots, safety and risk, warehouse automation, vision inspection, and investment decisions.",
    intro: [
      "Automation projects succeed or fail on the judgement of the people who specify, fund, run, and supervise them. These courses build that judgement for professionals who are not engineers.",
      "You work through real process decisions, from whether a task suits a robot to how an investment case should be tested, and finish with a signed brief or plan your organisation can act on.",
    ],
    faqs: [
      {
        question: "Do I need an engineering background?",
        answer:
          "No. The courses are written for operations managers, planners, finance partners, and team leaders who make or influence automation decisions. Technical terms are explained before they are used.",
      },
      {
        question: "Which robotics course should I start with?",
        answer:
          "Robotics for Non-Engineers is the foundation course, because it teaches how to judge whether a robot could take on part of a process. The other courses build on that judgement for specific decisions such as safety, investment, and running a robotic cell.",
      },
      {
        question: "Will the course qualify me to operate or program a robot?",
        answer:
          "No. These courses teach the decisions around automation, not machine operation or programming. The signed record states exactly what you completed, and machine-specific training still comes from the manufacturer or integrator.",
      },
    ],
  },
  {
    track: "hr",
    slug: "hr-courses",
    title: "Self-paced AI courses for HR and people teams",
    metaTitle: "AI Courses for HR and L&D Teams, with Certificate",
    description:
      "Self-paced online courses for HR and L&D: AI in hiring, performance and feedback, employee data privacy, EU AI Act literacy, workforce skills planning, and measuring whether training worked.",
    intro: [
      "People teams are being asked to lead the responsible use of AI at work and to show evidence of the learning behind it. These courses give HR and L&D professionals methods and documents they can use with managers and employees straight away.",
      "Each course covers one area of HR practice, from hiring and performance to privacy and skills planning, and ends with a signed piece of work, such as a selection standard or a measurement sheet, that a manager can verify online.",
    ],
    faqs: [
      {
        question: "Are these courses suitable for HR generalists?",
        answer:
          "Yes. They are written for HR business partners, L&D specialists, people operations staff, and line managers. No technical knowledge of AI is assumed.",
      },
      {
        question: "Do the courses cover the EU AI Act for employment uses?",
        answer:
          "Yes. The EU AI Act lists AI used in recruitment and in decisions about workers as high risk in Annex III, and Article 4 sets an AI literacy duty for staff. EU AI Act Literacy for HR and L&D explains both in practical terms. The signed record does not claim compliance with any regulation.",
      },
      {
        question: "Can I train a whole people team?",
        answer:
          "Yes. Individuals can buy any course online, and teams can book a trainer-led course through the Experrt Academy.",
      },
    ],
  },
];

export function hubForTrack(track: SelfServeTrack): TopicHub {
  return TOPIC_HUBS.find((hub) => hub.track === track)!;
}

export function hubBySlug(slug: string): TopicHub | undefined {
  return TOPIC_HUBS.find((hub) => hub.slug === slug);
}

function lowerFirst(value: string): string {
  return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}

function sentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+/g)?.map((part) => part.trim()) ?? [text];
}

export function isoDuration(hours: number): string {
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  return `PT${whole ? `${whole}H` : ""}${minutes ? `${minutes}M` : ""}` || "PT0H";
}

function assessmentOf(course: SelfServeCourse) {
  const check = course.lessons?.find((lesson) => lesson.check.kind === "scenario")?.check;
  if (check?.kind !== "scenario") return null;
  return {
    questions: check.questions.length,
    needed: Math.min(check.passMark ?? check.questions.length, check.questions.length),
  };
}

export function courseMetaTitle(course: SelfServeCourse): string {
  return `${course.title}: Online Course with Certificate`;
}

export function courseMetaDescription(course: SelfServeCourse): string {
  const lead = sentences(course.promise)[0];
  const tails = [
    ` Self-paced, ${formatCourseHours(course.hours)}, £${course.priceGbp}, with a verifiable certificate.`,
    ` Online, ${formatCourseHours(course.hours)}, £${course.priceGbp}, with certificate.`,
    ` £${course.priceGbp}, with certificate.`,
  ];
  const tail = tails.find((candidate) => lead.length + candidate.length <= 160) ?? "";
  return `${lead}${tail}`;
}

export function courseFaqs(course: SelfServeCourse): Faq[] {
  const artefact = courseArtefact(course);
  const artefactName = artefact ? lowerFirst(artefact.title) : "a finished piece of work";
  const lessons = course.lessons ?? [];
  const teaching = lessons.filter(
    (lesson) => lesson.check.kind !== "scenario" && lesson.id !== artefact?.lessonId
  ).length;
  const assessment = assessmentOf(course);
  const [first, ...rest] = sentences(course.promise);
  const sales = COURSE_SALES[course.slug];
  return [
    {
      question: `What is ${course.title} about?`,
      answer: sales?.overview.join(" ") ?? course.promise,
    },
    {
      question: `Who is ${course.title} for?`,
      answer: sales?.audience.length
        ? `${sales.audience.join(" ")} No specialist background is assumed, and every term is explained before it is used.`
        : `${first} No specialist background is assumed, and every term is explained before it is used.`,
    },
    {
      question: `What will I be able to do after ${course.title}?`,
      answer: sales?.takeaways.length
        ? sales.takeaways.join(" ")
        : `${rest.join(" ") || first} You finish with ${artefactName}, built from your own work and signed as your record.`,
    },
    {
      question: "How long does the course take, and how is it taught?",
      answer: `The course takes about ${formatCourseHours(course.hours)} and is studied online at your own pace. It has ${teaching} lessons, each with a worked example, a practice exercise, and a check on a new case${
        assessment
          ? `, followed by a course assessment of ${assessment.questions} scenario questions in which you need ${assessment.needed} correct to pass`
          : ""
      }. Your progress is saved to your account.`,
    },
    {
      question: "Do I get a certificate?",
      answer: `Yes. When you pass, you sign a record that names you, the course, and ${artefactName}. Anyone you share it with can verify it online and download it as a PDF. The record confirms what you completed and does not claim compliance with any regulation.`,
    },
    {
      question: "How much does it cost, and when can I start?",
      answer: `The course costs £${course.priceGbp}, paid once by card through Stripe. Access begins as soon as payment is confirmed and lasts 12 months, and you can save a sign-in to return to the course from any device.`,
    },
    {
      question: "Can my organisation train a whole team?",
      answer:
        `Yes. You can buy between 2 and 50 places in one payment from this page, at £${course.priceGbp} a place, then invite each person by email. Everyone gets their own sign-in, progress and signed record, and you can see who has finished. Organisations can also book trainer-led courses for teams, in person or online, through the Experrt Academy.`,
    },
  ];
}

export function faqLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  const base = getPublicSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}

export function selfServeCourseLd(course: SelfServeCourse, rating?: ReviewSummary) {
  const base = getPublicSiteUrl();
  const url = `${base}/learn/${course.slug}`;
  const artefact = courseArtefact(course);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": url,
    url,
    name: course.title,
    description: course.promise,
    inLanguage: "en-GB",
    provider: {
      "@type": "EducationalOrganization",
      "@id": `${base}/#organisation`,
      name: "Experrt",
      url: base,
    },
    about: trackLabel(course.track),
    educationalLevel: "Beginner",
    coursePrerequisites: "No specialist background is required.",
    teaches: course.lessons?.map((lesson) => lesson.title) ?? course.modules,
    isAccessibleForFree: false,
    timeRequired: isoDuration(course.hours),
    educationalCredentialAwarded: artefact
      ? `Signed, verifiable Experrt record naming ${lowerFirst(artefact.title)}`
      : "Signed, verifiable Experrt record",
    syllabusSections: (course.lessons ?? []).map((lesson) => ({
      "@type": "Syllabus",
      name: lesson.title,
      description: lesson.sections.map((section) => section.heading).join(". "),
    })),
    offers: [
      {
        "@type": "Offer",
        category: "Paid",
        price: course.priceGbp,
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
        url,
      },
    ],
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "Online",
        courseWorkload: isoDuration(course.hours),
        inLanguage: "en-GB",
      },
    ],
    ...(rating && rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.average,
            reviewCount: rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

export function courseListLd(courses: SelfServeCourse[], name: string, path: string) {
  const base = getPublicSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: `${base}${path}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: courses.map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${base}/learn/${course.slug}`,
        name: course.title,
      })),
    },
  };
}

export function allSelfServeCourses(): SelfServeCourse[] {
  return SELF_SERVE_COURSES.filter((course) => course.playable);
}

export function hubCourses(hub: TopicHub): SelfServeCourse[] {
  return coursesByTrack(hub.track).filter((course) => course.playable);
}
