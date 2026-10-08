import type { InsightTopic } from './types.ts';
export const INSIGHT_TOPIC_PAGES: {slug: string; topic: InsightTopic; description: string}[] = [
  {slug:'ai-implementation',topic:'AI implementation',description:'Practical guides to commissioning and delivering AI systems, agents, digital products, robotics and HR transformation.'},
  {slug:'hr-transformation',topic:'HR transformation',description:'Practical guides to HR transformation, AI in people operations, workflow automation and people analytics. Start with a roadmap or a working checklist.'},
  {slug:'learning-platforms',topic:'Learning platforms',description:'Evaluate learning platforms through real tasks, reliable records and accountable AI actions. Understand what an agentic LMS should do for your team.'},
  {slug:'ai-literacy',topic:'AI literacy',description:'Build practical AI literacy at work: useful prompts, output verification and the judgement to recognise when an answer needs checking.'},
  {slug:'commissioning',topic:'Commissioning',description:'Plan training around the work that needs to change. Explore needs analysis, workshop briefs, blended learning and learning-platform buying guides.'},
  {slug:'adoption',topic:'Adoption',description:'Turn AI and technology investment into useful working practices with focused pilots, manager support and clear ownership.'},
  {slug:'measurement',topic:'Measurement',description:'Measure learning and AI adoption with clear definitions, practical evidence and business cases that make their assumptions visible.'},
  {slug:'robotics',topic:'Robotics',description:'Plan robotics training around the people operating, supervising and maintaining the work, with practical guidance for delivery teams.'},
];
export function insightTopicPath(topic: InsightTopic) {
  return `/insights/topic/${INSIGHT_TOPIC_PAGES.find(entry => entry.topic === topic)!.slug}`;
}
