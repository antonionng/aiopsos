import { z } from 'zod';
export const labServices = ['AI systems & automation', 'Technology products', 'Robotics implementation', 'HR transformation', 'Help me scope it'] as const;
export const projectStages = ['Exploring an idea', 'Ready to scope', 'Prototype or pilot', 'Improve an existing system'] as const;
export const projectTimelines = ['As soon as practical', 'Within 3 months', '3–6 months', 'Exploring timing'] as const;
export const contactSchema = z.object({
  request_id: z.string().uuid(), name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  message: z.string().trim().min(1).max(5000),
  organisation_name: z.string().trim().max(300).default(''),
  interest: z.enum(['Train my team', 'Explore the platform', 'Deliver training with Experrt', 'AI Labs consulting & delivery', 'Something else']).optional(),
  team_size: z.enum(['', 'Just me', '2–10', '11–50', '51–200', '201+']).default(''),
  source_article: z.string().regex(/^[a-z0-9-]{0,150}$/).default(''),
  source_case_study: z.string().regex(/^[a-z0-9-]{0,150}$/).default(''),
  project_service: z.enum(['', ...labServices]).default(''),
  project_stage: z.enum(['', ...projectStages]).default(''),
  project_timeline: z.enum(['', ...projectTimelines]).default(''),
  project_systems: z.string().trim().max(1000).default(''),
});
export function formatContactEnquiry(input: z.infer<typeof contactSchema>) {
  const labs = input.interest === 'AI Labs consulting & delivery';
  return [input.message, input.interest && `Enquiry: ${input.interest}`,
    labs ? [input.project_service && `Delivery area: ${input.project_service}`, input.project_stage && `Project stage: ${input.project_stage}`, input.project_timeline && `Timing: ${input.project_timeline}`, input.project_systems && `Existing systems and integrations: ${input.project_systems}`].filter(Boolean).join('\n') : input.team_size && `People learning: ${input.team_size}`,
    input.source_article && (input.source_article === 'ai-labs' ? 'From: /ai-labs' : `From insight: /insights/${input.source_article}`),
    input.source_case_study && `From case study: /case-studies/${input.source_case_study}`,
  ].filter(Boolean).join('\n\n');
}
