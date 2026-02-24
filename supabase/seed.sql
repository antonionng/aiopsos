-- Seed: Default prompt templates (global, org_id = null)
insert into prompt_templates (org_id, department_type, title, content, category) values
  (null, 'engineering', 'Code Review', 'Review the following code for bugs, performance issues, and best practices. Suggest improvements with explanations.\n\n```\n{{code}}\n```', 'development'),
  (null, 'engineering', 'Architecture Design', 'Design a system architecture for the following requirements. Include component diagram, data flow, and technology recommendations.\n\nRequirements:\n{{requirements}}', 'development'),
  (null, 'engineering', 'Debug Assistant', 'I''m encountering the following error. Help me debug it step by step.\n\nError: {{error}}\nContext: {{context}}', 'development'),
  (null, 'sales', 'Email Draft', 'Write a professional sales email for the following scenario.\n\nProduct: {{product}}\nTarget: {{target}}\nKey value proposition: {{value_prop}}', 'communication'),
  (null, 'sales', 'Meeting Summary', 'Summarise the following meeting notes into action items, key decisions, and follow-ups.\n\nNotes:\n{{notes}}', 'productivity'),
  (null, 'sales', 'Proposal Writer', 'Create a business proposal outline for:\n\nClient: {{client}}\nService: {{service}}\nBudget range: {{budget}}', 'communication'),
  (null, 'operations', 'Process Documentation', 'Document the following business process in a clear, step-by-step format. Include roles, inputs, outputs, and decision points.\n\nProcess: {{process}}', 'documentation'),
  (null, 'operations', 'Data Summarisation', 'Summarise the following data/report into key insights, trends, and recommended actions.\n\nData:\n{{data}}', 'analysis'),
  (null, 'leadership', 'Strategic Analysis', 'Analyse the following business situation and provide strategic recommendations with pros, cons, and risk assessment.\n\nSituation: {{situation}}', 'strategy'),
  (null, 'leadership', 'Decision Framework', 'Create a decision matrix for the following options. Evaluate against the criteria provided.\n\nOptions: {{options}}\nCriteria: {{criteria}}', 'strategy'),
  (null, 'marketing', 'Content Brief', 'Create a content brief for the following topic. Include target audience, key messages, SEO keywords, and distribution channels.\n\nTopic: {{topic}}', 'content'),
  (null, 'marketing', 'Social Media Post', 'Write engaging social media posts for the following announcement. Create versions for LinkedIn, Twitter, and internal comms.\n\nAnnouncement: {{announcement}}', 'content'),
  (null, 'legal', 'Policy Review', 'Review the following policy document for compliance gaps, ambiguities, and areas that need updating.\n\nPolicy:\n{{policy}}', 'compliance'),
  (null, 'hr', 'Job Description', 'Write a job description for the following role. Include responsibilities, requirements, and nice-to-haves.\n\nRole: {{role}}\nDepartment: {{department}}\nLevel: {{level}}', 'recruitment'),
  (null, 'finance', 'Report Analysis', 'Analyse the following financial data and provide insights on trends, anomalies, and recommendations.\n\nData:\n{{data}}', 'analysis'),
  (null, 'support', 'Response Template', 'Draft a customer support response for the following issue. Be empathetic, clear, and solution-oriented.\n\nIssue: {{issue}}\nContext: {{context}}', 'support');
