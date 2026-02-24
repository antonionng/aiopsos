export interface PolicyTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
}

export const POLICY_CATEGORIES = [
  { id: "general", label: "General" },
  { id: "data-privacy", label: "Data Privacy" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "procurement", label: "Procurement" },
  { id: "risk-management", label: "Risk Management" },
  { id: "employee-guidelines", label: "Employee Guidelines" },
] as const;

export type PolicyCategory = (typeof POLICY_CATEGORIES)[number]["id"];

export const POLICY_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  POLICY_CATEGORIES.map((c) => [c.id, c.label])
);

export const AI_POLICY_TEMPLATES: PolicyTemplate[] = [
  {
    id: "acceptable-use",
    title: "AI Acceptable Use Policy",
    category: "acceptable-use",
    description:
      "Rules and boundaries for how employees may use AI tools at work.",
    content: `# AI Acceptable Use Policy

## 1. Purpose

This policy defines acceptable and unacceptable uses of artificial intelligence tools within [Organisation Name]. It aims to ensure all employees use AI responsibly while maximising productivity and innovation.

## 2. Scope

This policy applies to all employees, contractors, and third parties who use AI tools in any capacity related to their work for [Organisation Name].

## 3. Approved AI Tools

The following AI tools are approved for use within the organisation:

- [List approved tools here]

Any tools not listed above require explicit approval from management before use. Employees must not sign up for new AI services using company credentials without authorisation.

## 4. Acceptable Uses

Employees may use approved AI tools for:

- Drafting and editing written content (emails, reports, documentation)
- Summarising meeting notes and lengthy documents
- Generating ideas and brainstorming
- Code assistance and review (with human oversight)
- Data analysis of non-sensitive datasets
- Research and information gathering

## 5. Prohibited Uses

The following uses of AI tools are strictly prohibited:

- Inputting confidential, proprietary, or classified information
- Submitting personal data (PII) of employees, customers, or partners
- Making autonomous decisions that affect employment, compensation, or legal matters
- Generating content that is discriminatory, misleading, or harmful
- Using AI outputs without human review for external-facing communications
- Circumventing security controls or using AI to access unauthorised systems

## 6. Data Handling

- Never input customer data, financial records, or trade secrets into AI tools
- Assume all data shared with AI tools may be stored or used for training
- Follow data classification guidelines when deciding what can be shared

## 7. Review and Oversight

- All AI-generated content must be reviewed by a human before publication or use
- Employees are responsible for the accuracy of any AI-assisted output
- Regular audits of AI tool usage will be conducted

## 8. Compliance

Violation of this policy may result in disciplinary action. Employees should report any concerns or incidents to their manager or the compliance team.

## 9. Review Schedule

This policy will be reviewed and updated quarterly to reflect new developments in AI technology and regulation.

---

*Last updated: [Date]*
*Policy owner: [Name/Department]*`,
  },

  {
    id: "data-privacy",
    title: "Data Privacy & AI Policy",
    category: "data-privacy",
    description:
      "Guidelines for handling sensitive and personal data when using AI systems.",
    content: `# Data Privacy & AI Policy

## 1. Purpose

This policy establishes guidelines for protecting personal and sensitive data when using artificial intelligence tools and systems within [Organisation Name].

## 2. Data Classification

Before using any data with AI tools, classify it according to these levels:

| Level | Description | AI Usage |
|-------|-------------|----------|
| Public | Information freely available | Permitted |
| Internal | General business information | Permitted with approved tools only |
| Confidential | Sensitive business data | Prohibited without explicit approval |
| Restricted | PII, financial, legal | Strictly prohibited |

## 3. Personal Data Protection

### 3.1 PII Handling
- Never input personally identifiable information (PII) into AI systems
- PII includes: names, emails, phone numbers, addresses, national insurance/social security numbers, financial details
- If PII is accidentally submitted, report it immediately to the data protection officer

### 3.2 GDPR Compliance
- AI processing of personal data must have a lawful basis
- Data subjects must be informed when AI is used to process their data
- Automated decision-making that significantly affects individuals requires human review
- Data protection impact assessments (DPIAs) must be completed for new AI use cases involving personal data

### 3.3 Data Minimisation
- Only use the minimum data necessary for the AI task
- Anonymise or pseudonymise data before using it with AI tools where possible
- Delete AI conversation histories containing any sensitive data

## 4. Third-Party AI Services

- Verify that AI service providers comply with relevant data protection regulations
- Review data processing agreements before using new AI services
- Ensure data residency requirements are met (data must not leave approved jurisdictions)
- Maintain a register of all AI services that process organisational data

## 5. Data Retention

- AI-generated outputs containing sensitive data must follow standard retention policies
- Clear AI chat histories regularly
- Do not store AI outputs indefinitely without a documented purpose

## 6. Breach Response

If a data breach occurs involving AI systems:

1. Immediately stop using the affected AI tool
2. Report to the data protection officer within 24 hours
3. Document what data was exposed
4. Follow the organisation's incident response procedure

## 7. Training

All employees who use AI tools must complete data privacy awareness training annually.

---

*Last updated: [Date]*
*Policy owner: [Name/Department]*`,
  },

  {
    id: "procurement",
    title: "AI Procurement Policy",
    category: "procurement",
    description:
      "Criteria and process for evaluating and approving new AI vendors and tools.",
    content: `# AI Procurement Policy

## 1. Purpose

This policy establishes the evaluation criteria and approval process for procuring new AI tools, platforms, and services for [Organisation Name].

## 2. Evaluation Criteria

All AI tools must be assessed against the following criteria before procurement:

### 2.1 Security & Compliance
- [ ] SOC 2 Type II certification or equivalent
- [ ] GDPR compliance documentation
- [ ] Data processing agreement available
- [ ] Data residency options (UK/EU)
- [ ] Encryption at rest and in transit
- [ ] Access control and audit logging

### 2.2 Data Handling
- [ ] Clear data usage policy (not used for training without consent)
- [ ] Data deletion capabilities
- [ ] Data export functionality
- [ ] Transparent data retention policies

### 2.3 Functionality
- [ ] Meets identified business need
- [ ] Integration capabilities with existing systems
- [ ] API availability for enterprise use
- [ ] Scalability for team/organisation use
- [ ] Reliability and uptime guarantees (SLA)

### 2.4 Cost
- [ ] Transparent pricing model
- [ ] Total cost of ownership analysis
- [ ] Budget approval obtained
- [ ] ROI projection documented

### 2.5 Vendor Viability
- [ ] Established company with proven track record
- [ ] Financial stability
- [ ] Customer support and SLA commitments
- [ ] Roadmap and future development plans

## 3. Approval Process

1. **Request**: Submit AI tool request with business justification
2. **Initial Review**: IT/Security team assesses against evaluation criteria
3. **Trial Period**: Approved tools enter a 30-day trial with limited users
4. **Risk Assessment**: Complete risk and data protection impact assessment
5. **Final Approval**: Senior leadership sign-off for organisation-wide deployment
6. **Onboarding**: IT configures access, training is provided

## 4. Ongoing Review

- All approved AI tools are reviewed annually
- Usage metrics and ROI are tracked quarterly
- Any security incidents trigger immediate review
- Tools that fall below standards are flagged for replacement

## 5. Shadow AI

Employees must not use unapproved AI tools for work purposes. The IT team conducts regular audits to identify unauthorised AI tool usage.

---

*Last updated: [Date]*
*Policy owner: [Name/Department]*`,
  },

  {
    id: "risk-management",
    title: "AI Risk Management Framework",
    category: "risk-management",
    description:
      "Framework for identifying, assessing, and mitigating AI-related risks.",
    content: `# AI Risk Management Framework

## 1. Purpose

This framework provides a structured approach to identifying, assessing, and mitigating risks associated with the use of artificial intelligence within [Organisation Name].

## 2. Risk Categories

### 2.1 Data Risks
- Data leakage through AI tool inputs
- Unauthorised data processing
- Cross-border data transfers
- Training data contamination

### 2.2 Operational Risks
- Over-reliance on AI outputs
- AI system outages disrupting workflows
- Integration failures with existing systems
- Vendor lock-in

### 2.3 Compliance Risks
- Regulatory non-compliance (GDPR, AI Act, sector-specific regulations)
- Intellectual property infringement
- Failure to meet industry standards
- Audit trail gaps

### 2.4 Reputational Risks
- Biased or discriminatory AI outputs
- Misinformation in AI-generated content
- Customer trust erosion
- Public perception of AI misuse

### 2.5 Security Risks
- Prompt injection attacks
- Model manipulation
- Credential exposure through AI tools
- Supply chain attacks via AI dependencies

## 3. Risk Assessment Matrix

| Likelihood / Impact | Low | Medium | High |
|---------------------|-----|--------|------|
| High | Medium | High | Critical |
| Medium | Low | Medium | High |
| Low | Low | Low | Medium |

## 4. Mitigation Strategies

### Critical Risks
- Immediate escalation to senior leadership
- Suspend AI tool usage if necessary
- Engage external experts for assessment
- Implement compensating controls

### High Risks
- Assign dedicated risk owner
- Implement technical and procedural controls
- Monitor continuously with automated alerts
- Review monthly

### Medium Risks
- Document in risk register
- Implement standard controls
- Review quarterly

### Low Risks
- Accept with documentation
- Review annually

## 5. Monitoring & Reporting

- Monthly AI risk dashboard for leadership
- Quarterly risk register review
- Annual comprehensive risk assessment
- Incident reporting within 24 hours

## 6. Roles & Responsibilities

| Role | Responsibility |
|------|---------------|
| AI Risk Owner | Owns the AI risk register and mitigation plans |
| Department Leads | Identify and report AI risks in their area |
| IT Security | Monitor AI systems for security risks |
| Compliance | Ensure regulatory adherence |
| All Employees | Report AI-related incidents and concerns |

---

*Last updated: [Date]*
*Policy owner: [Name/Department]*`,
  },

  {
    id: "employee-guidelines",
    title: "Employee AI Guidelines",
    category: "employee-guidelines",
    description:
      "Practical dos and don'ts for everyday AI usage by employees.",
    content: `# Employee AI Guidelines

## Welcome

AI tools can significantly boost your productivity and help you do better work. These guidelines will help you use AI effectively and responsibly.

## Quick Reference: Dos and Don'ts

### Do

- **Do** use AI to draft, edit, and improve your written work
- **Do** use AI to brainstorm ideas and explore different angles
- **Do** use AI to summarise long documents and meeting notes
- **Do** always review and verify AI-generated content before sharing
- **Do** cite when you've used AI assistance for significant work products
- **Do** report any concerns about AI outputs to your manager
- **Do** keep learning about new AI capabilities and best practices
- **Do** use AI to automate repetitive, low-value tasks

### Don't

- **Don't** share confidential company information with AI tools
- **Don't** input personal data (names, emails, phone numbers) of colleagues or customers
- **Don't** use AI-generated content without reviewing it for accuracy
- **Don't** rely solely on AI for critical decisions
- **Don't** use AI to produce misleading or deceptive content
- **Don't** sign up for new AI tools without checking with your manager or IT
- **Don't** assume AI outputs are always correct — they can be confidently wrong
- **Don't** use AI in ways that could harm colleagues, customers, or the company

## How to Get the Most from AI

### Writing Better Prompts
1. Be specific about what you need
2. Provide relevant context (without sensitive data)
3. Specify the format you want (bullet points, paragraphs, table)
4. Iterate — refine your request based on the output
5. Break complex tasks into smaller steps

### Quality Checks
Before using any AI output:
- [ ] Is the information accurate and up to date?
- [ ] Does it contain any sensitive or confidential data?
- [ ] Is the tone appropriate for the audience?
- [ ] Have I added my own expertise and judgement?
- [ ] Would I be comfortable if this was attributed to me?

## When to Escalate

Contact your manager or the AI governance team if:
- You're unsure whether a use case is appropriate
- AI produces biased, offensive, or concerning content
- You accidentally share sensitive data with an AI tool
- You discover a colleague misusing AI tools
- You need access to a tool that isn't currently approved

## Training & Support

- Complete the mandatory AI awareness training within your first month
- Attend optional AI skills workshops (check the learning portal)
- Join the #ai-tips internal channel for best practices
- Reach out to the AI Centre of Excellence for advanced use cases

---

*Last updated: [Date]*
*Policy owner: [Name/Department]*`,
  },

  {
    id: "ethics",
    title: "AI Ethics & Responsible Use",
    category: "general",
    description:
      "Principles and commitments for ethical AI deployment across the organisation.",
    content: `# AI Ethics & Responsible Use Policy

## 1. Our Commitment

[Organisation Name] is committed to the ethical and responsible use of artificial intelligence. We believe AI should augment human capabilities, not replace human judgement, and that its deployment must align with our values and societal responsibilities.

## 2. Core Principles

### 2.1 Fairness
- AI systems must not discriminate based on protected characteristics
- We regularly audit AI outputs for bias
- Diverse perspectives are included in AI deployment decisions
- We actively work to identify and mitigate algorithmic bias

### 2.2 Transparency
- We are open about when and how AI is used in our operations
- Customers and employees are informed when interacting with AI systems
- AI decision-making processes are documented and explainable
- We maintain clear records of AI system capabilities and limitations

### 2.3 Accountability
- Every AI system has a designated human owner
- Humans remain responsible for AI-assisted decisions
- We maintain audit trails for AI-driven processes
- Clear escalation paths exist for AI-related concerns

### 2.4 Privacy
- AI systems respect individual privacy rights
- Data minimisation principles are applied
- We comply with all relevant data protection regulations
- Individuals can opt out of AI processing where feasible

### 2.5 Safety
- AI systems are tested for safety before deployment
- Continuous monitoring identifies potential harms
- Kill switches exist for all AI-driven processes
- We prioritise safety over speed of deployment

## 3. Ethical Use Cases

We encourage AI use that:
- Improves employee productivity and wellbeing
- Enhances customer experience
- Drives innovation and creativity
- Reduces tedious, repetitive work
- Supports evidence-based decision making

We prohibit AI use that:
- Manipulates or deceives people
- Conducts unauthorised surveillance
- Makes autonomous decisions about individuals' rights or employment
- Generates harmful, discriminatory, or misleading content
- Exploits vulnerable populations

## 4. Governance Structure

### AI Ethics Board
- Reviews new AI use cases against ethical principles
- Investigates reported ethical concerns
- Publishes annual AI ethics report
- Advises leadership on AI strategy

### AI Champions Network
- Department-level advocates for responsible AI
- First point of contact for ethical questions
- Share best practices across teams

## 5. Reporting Concerns

Employees can report AI ethics concerns through:
- Their direct manager
- The AI Ethics Board (ai-ethics@[company].com)
- The anonymous reporting hotline
- The #ai-ethics internal channel

All reports are treated confidentially and without retaliation.

## 6. Continuous Improvement

We are committed to evolving our approach as AI technology and regulation develop. This policy is reviewed quarterly and updated to reflect:
- New regulatory requirements
- Emerging ethical frameworks
- Lessons learned from incidents
- Employee and stakeholder feedback

---

*Last updated: [Date]*
*Policy owner: [Name/Department]*`,
  },
];
