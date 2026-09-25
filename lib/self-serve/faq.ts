import { ACCESS_MONTHS } from "./entitlement.ts";
import { TEAM_MAX, TEAM_MIN } from "./team-rules.ts";

export type FaqGroup = { title: string; items: { question: string; answer: string }[] };

export const LEARN_FAQ: FaqGroup[] = [
  {
    title: "Buying a course",
    items: [
      {
        question: "How do I pay?",
        answer:
          "By card, Apple Pay, Google Pay or Link, through Stripe. We never see your card number. You get a receipt by email as soon as payment is confirmed.",
      },
      {
        question: "Can I use a promotion code?",
        answer:
          "Yes. Enter it on the Stripe payment page before you pay. A code cannot be applied after payment.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "No. All sales are final and no refunds are given, because the whole course opens the moment payment is confirmed. If you are charged twice by mistake we reverse the duplicate, and if something in a course does not work we fix it. The course terms of sale set this out in full.",
      },
      {
        question: "What happens if I try to buy a course I already have?",
        answer:
          "You are taken straight to the course instead. You only pay again if your access has ended and you want another 12 months.",
      },
    ],
  },
  {
    title: "Access and your account",
    items: [
      {
        question: "How long do I have access?",
        answer: `${ACCESS_MONTHS} months from the day you pay. The end date is on your receipt and in My learning. We email you a month and a week before it ends if you have not finished.`,
      },
      {
        question: "What happens when my access ends?",
        answer:
          "The lessons close. If you signed your record, your certificate and public record stay yours for good. You can buy another 12 months, and every lesson you passed carries over.",
      },
      {
        question: "Can I use it on my phone?",
        answer:
          "Yes. Courses work in any current browser on a phone, tablet or computer. Save a password at checkout and sign in on any device to carry on where you stopped.",
      },
      {
        question: "How do I change my name, password or email preferences?",
        answer:
          "From My account. You can also download your data or close your account there at any time.",
      },
    ],
  },
  {
    title: "Certificates",
    items: [
      {
        question: "Do I get a certificate?",
        answer:
          "Yes. When you pass every lesson you sign your final work, and we issue a certificate with a unique reference. You can download it as a PDF, open the public record, and add it to LinkedIn in one click.",
      },
      {
        question: "Can an employer check it?",
        answer:
          "Yes. The certificate has a reference and a QR code that open the public record on experrt.com, which shows your name, the course, the date and the work you signed.",
      },
      {
        question: "Is it an accredited qualification?",
        answer:
          "No. It confirms that you completed an Experrt course and signed the work. It is not an accredited qualification and it does not certify compliance with the EU AI Act or any other law.",
      },
    ],
  },
  {
    title: "Teams and organisations",
    items: [
      {
        question: "Can I buy places for my team?",
        answer: `Yes. On any course page choose "Buying for your team?" and pick between ${TEAM_MIN} and ${TEAM_MAX} places. After paying you get a team page where you invite people by email and see who has joined and finished. You also get an invoice for your records.`,
      },
      {
        question: "When does a team member's access start?",
        answer:
          "On the day they accept their invitation, and it lasts 12 months from then. Places must be given out within 12 months of payment.",
      },
      {
        question: "Can we have a trainer run a session?",
        answer:
          "Yes. We run trainer-led sessions in person or live online, built on the same courses. Ask from the Bring this to your team form in My learning, or email hello@experrt.com.",
      },
      {
        question: "We need more than 50 places.",
        answer: "Email hello@experrt.com and we will set it up for you.",
      },
    ],
  },
  {
    title: "Reviews",
    items: [
      {
        question: "Who can review a course?",
        answer:
          "Only people who finished the course and signed their record. Each review shows a Verified learner label. We do not pay for reviews, write them, or edit them.",
      },
      {
        question: "Can I change or delete my review?",
        answer: "Yes, at any time, from your certificate page.",
      },
    ],
  },
];

export function allFaqItems() {
  return LEARN_FAQ.flatMap((group) => group.items);
}
