import type { MarketStat } from "./landing.ts";

/** Each figure was checked against the text of the linked source page. */
export const MARKET_STATS: Record<string, MarketStat> = {
  "ai-uk-ai-skills-confidence": {
    "value": "36%",
    "line": "Of UK adults feel able to use AI appropriately.",
    "label": "In the UK, 48% of people believe they can use AI tools effectively, but only 36% feel they have the skills and knowledge to use AI appropriately, according to a nationally representative survey of 1,029 people carried out between November 2024 and January 2025.",
    "source": "KPMG and the University of Melbourne, Trust, attitudes and use of AI: UK insights, 2025",
    "href": "https://kpmg.com/uk/en/insights/ai/uk-attitudes-to-ai.html"
  },
  "ai-ai-training-gap-2024": {
    "value": "39%",
    "line": "Of AI users had received AI training from their employer.",
    "label": "Only 39% of people who use AI at work said their company had given them AI training, even though two thirds of leaders said they would not hire someone without AI skills. The figures come from a 2024 survey of 31,000 people across 31 countries.",
    "source": "Microsoft and LinkedIn, 2024 Work Trend Index Annual Report",
    "href": "https://blogs.microsoft.com/blog/2024/05/08/microsoft-and-linkedin-release-the-2024-work-trend-index-on-the-state-of-ai-at-work/"
  },
  "ai-uk-ai-text-generation": {
    "value": "85%",
    "line": "Of UK AI adopters use AI for language and text generation.",
    "label": "Among UK businesses currently using AI, 85% use natural language processing and text generation, which makes it the most common form of AI in use. DSIT fieldwork took place in 2025 and the report was published in January 2026.",
    "source": "Department for Science, Innovation and Technology, AI Adoption Research, 2026",
    "href": "https://www.gov.uk/government/publications/ai-adoption-research/ai-adoption-research"
  },
  "ai-ai-hallucination-range": {
    "value": "22% to 94%",
    "line": "Hallucination range across 26 leading AI models.",
    "label": "On a new accuracy benchmark reported in the 2026 AI Index, hallucination rates across 26 leading AI models ranged from 22% to 94%, so even the strongest models still state false information as fact.",
    "source": "Stanford HAI, AI Index Report 2026, Responsible AI chapter",
    "href": "https://hai.stanford.edu/ai-index/2026-ai-index-report/responsible-ai"
  },
  "ai-uk-ai-work-mistakes": {
    "value": "54%",
    "line": "Of UK workers using AI have made mistakes because of it.",
    "label": "More than half of UK workers who use AI (54%) say they have made mistakes in their work due to AI, based on a survey of 617 UK workers carried out between November 2024 and January 2025.",
    "source": "KPMG and the University of Melbourne, Trust, attitudes and use of AI: UK insights, 2025",
    "href": "https://kpmg.com/uk/en/insights/ai/uk-attitudes-to-ai.html"
  },
  "ai-ai-incidents-2025": {
    "value": "362",
    "line": "Documented AI incidents in 2025, up from 233 in 2024.",
    "label": "The AI Incident Database recorded 362 documented AI incidents in 2025, up from 233 in 2024, a sign that failures of AI systems are reaching the public record more often.",
    "source": "Stanford HAI, AI Index Report 2026, Responsible AI chapter",
    "href": "https://hai.stanford.edu/ai-index/2026-ai-index-report/responsible-ai"
  },
  "ai-uk-ai-unchecked-output": {
    "value": "58%",
    "line": "Of UK workers have relied on AI output without checking it.",
    "label": "In the UK, 58% of workers who use AI say they have relied on AI output at work without evaluating its accuracy, based on a survey carried out between November 2024 and January 2025.",
    "source": "KPMG and the University of Melbourne, Trust, attitudes and use of AI: UK insights, 2025",
    "href": "https://kpmg.com/uk/en/insights/ai/uk-attitudes-to-ai.html"
  },
  "ai-uk-workers-intentional-ai": {
    "value": "65%",
    "line": "Of UK workers say they intentionally use AI for work.",
    "label": "Almost two thirds (65%) of UK workers say they intentionally use AI in their work, according to a survey of 617 UK workers carried out between November 2024 and January 2025.",
    "source": "KPMG and the University of Melbourne, Trust, attitudes and use of AI: UK insights, 2025",
    "href": "https://kpmg.com/uk/en/insights/ai/uk-attitudes-to-ai.html"
  },
  "ai-uk-ai-productivity": {
    "value": "56%",
    "line": "Of UK AI users report higher employee productivity.",
    "label": "Over half (56%) of UK businesses currently using AI reported an increase in their employees’ overall productivity since adopting it. The figures are self reported, from DSIT research published in January 2026.",
    "source": "Department for Science, Innovation and Technology, AI Adoption Research, 2026",
    "href": "https://www.gov.uk/government/publications/ai-adoption-research/ai-adoption-research"
  },
  "ai-uk-business-ai-use-2026": {
    "value": "29%",
    "line": "Of UK businesses used at least one AI technology in June 2026.",
    "label": "Nearly three in ten (29%) UK businesses reported using at least one type of AI technology in June 2026, up 8 percentage points on June 2025. Among businesses with 250 or more employees the figure was 49%.",
    "source": "Office for National Statistics, Business insights and impact on the UK economy, 2 July 2026",
    "href": "https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/bulletins/businessinsightsandimpactontheukeconomy/2july2026"
  },
  "ai-uk-ai-content-creation": {
    "value": "77%",
    "line": "Of UK AI users apply it to creative and content work.",
    "label": "Among UK businesses that use or plan to use AI, 77% cited creative and content creation as a use, ahead of administration (70%) and data and analytics (56%). DSIT research published in January 2026.",
    "source": "Department for Science, Innovation and Technology, AI Adoption Research, 2026",
    "href": "https://www.gov.uk/government/publications/ai-adoption-research/ai-adoption-research"
  },
  "ai-uk-content-trust": {
    "value": "72%",
    "line": "Of UK adults are unsure online content can be trusted.",
    "label": "Almost three quarters (72%) of people in the UK say they are unsure whether online content can be trusted because it may be AI generated, according to a survey carried out between November 2024 and January 2025.",
    "source": "KPMG and the University of Melbourne, Trust, attitudes and use of AI: UK insights, 2025",
    "href": "https://kpmg.com/uk/en/insights/ai/uk-attitudes-to-ai.html"
  },
  "ai-uk-llm-text-generation": {
    "value": "17%",
    "line": "Of UK businesses used LLM text generation in June 2026.",
    "label": "In June 2026, text generation using large language models was the AI technology UK businesses had adopted most, at 17% of businesses, up 12 percentage points since September 2023.",
    "source": "Office for National Statistics, Business insights and impact on the UK economy, 2 July 2026",
    "href": "https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/bulletins/businessinsightsandimpactontheukeconomy/2july2026"
  },
  "ai-agentic-projects-cancelled": {
    "value": "Over 40%",
    "line": "Of agentic AI projects forecast to be cancelled by 2027.",
    "label": "Gartner predicts that over 40% of agentic AI projects will be cancelled by the end of 2027 because of escalating costs, unclear business value or inadequate risk controls. Prediction published in June 2025.",
    "source": "Gartner, press release: Gartner Predicts Over 40% of Agentic AI Projects Will Be Canceled by End of 2027, 2025",
    "href": "https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027"
  },
  "ai-uk-agentic-adoption": {
    "value": "7%",
    "line": "Of UK AI adopters use agentic AI, the least used type.",
    "label": "Among UK businesses currently using AI, only 7% use agentic AI, the least adopted of the AI technologies DSIT measured. DSIT research published in January 2026.",
    "source": "Department for Science, Innovation and Technology, AI Adoption Research, 2026",
    "href": "https://www.gov.uk/government/publications/ai-adoption-research/ai-adoption-research"
  },
  "ai-uk-agentic-barriers": {
    "value": "32%",
    "line": "Of UK businesses face significant barriers with agentic AI.",
    "label": "Agentic AI is where UK businesses most often face significant implementation barriers (32%), compared with 18% for natural language processing and text generation. DSIT research published in January 2026.",
    "source": "Department for Science, Innovation and Technology, AI Adoption Research, 2026",
    "href": "https://www.gov.uk/government/publications/ai-adoption-research/ai-adoption-research"
  },
  "ai-agentic-decisions-2028": {
    "value": "15%",
    "line": "Of daily work decisions forecast to be made by AI agents by 2028.",
    "label": "Gartner predicts that at least 15% of day to day work decisions will be made autonomously through agentic AI by 2028, up from 0% in 2024. Prediction published in June 2025.",
    "source": "Gartner, press release: Gartner Predicts Over 40% of Agentic AI Projects Will Be Canceled by End of 2027, 2025",
    "href": "https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027"
  },
  "ai-leaders-expect-agent-management": {
    "value": "36%",
    "line": "Of leaders expect their teams to manage AI agents in five years.",
    "label": "Leaders surveyed for the 2025 Work Trend Index expect their teams to be training AI agents (41%) and managing them (36%) within five years. Report published in April 2025.",
    "source": "Microsoft, 2025 Work Trend Index Annual Report",
    "href": "https://blogs.microsoft.com/blog/2025/04/23/the-2025-annual-work-trend-index-the-frontier-firm-is-born/"
  },
  "ai-agent-task-failure": {
    "value": "1 in 3",
    "line": "Agent attempts still failing on structured benchmarks in 2025.",
    "label": "AI agents improved from 12% to about 66% task success on OSWorld, a benchmark of real computer tasks, but still fail roughly one in three attempts on structured benchmarks, according to the 2026 AI Index.",
    "source": "Stanford HAI, AI Index Report 2026",
    "href": "https://hai.stanford.edu/ai-index/2026-ai-index-report"
  },
  "ai-service-cases-handled-by-ai": {
    "value": "30%",
    "line": "Of customer service cases now handled by AI.",
    "label": "Service teams estimate that 30% of customer service cases are currently handled by AI and expect this to reach 50% by 2027. Salesforce surveyed 6,500 service professionals, including in the UK, for its 2025 report.",
    "source": "Salesforce, State of Service Report, seventh edition, 2025",
    "href": "https://www.salesforce.com/news/stories/state-of-service-report-announcement-2025/"
  },
  "ai-cx-unresolved-issues": {
    "value": "85%",
    "line": "Of CX leaders say one unresolved issue can lose a customer.",
    "label": "In Zendesk’s CX Trends 2026 research, 85% of customer experience leaders say customers will drop a brand over an unresolved issue, even on the first contact.",
    "source": "Zendesk, CX Trends 2026",
    "href": "https://cxtrends.zendesk.com/"
  },
  "ai-uk-service-failure-cost": {
    "value": "£6.5bn",
    "line": "Monthly cost of service failures to UK organisations.",
    "label": "UK organisations lose approximately £6.5bn a month dealing with the consequences of service failures, according to the Institute of Customer Service’s UK Customer Satisfaction Index, January 2026.",
    "source": "Institute of Customer Service, UK Customer Satisfaction Index (UKCSI), January 2026",
    "href": "https://www.instituteofcustomerservice.com/support-growth-agenda/"
  },
  "ai-uk-ai-data-analytics": {
    "value": "56%",
    "line": "Of UK AI users apply it to data and analytics.",
    "label": "Among UK businesses that use or plan to use AI, 56% cited data and analytics as a use case. DSIT research published in January 2026.",
    "source": "Department for Science, Innovation and Technology, AI Adoption Research, 2026",
    "href": "https://www.gov.uk/government/publications/ai-adoption-research/ai-adoption-research"
  },
  "ai-uk-finance-ai-skills": {
    "value": "45%",
    "line": "Of UK businesses build finance teams on finance plus AI skills.",
    "label": "In Robert Half’s 2026 UK Salary Guide research, 45% of businesses said a blend of deep financial knowledge with AI and digital skills will form the foundation of their finance team growth plans for 2026. The survey of 500 UK hiring managers and 1,000 workers ran in June and July 2025.",
    "source": "Robert Half, 2026 UK Salary Guide: skills in demand",
    "href": "https://www.roberthalf.com/gb/en/insights/research/expert-insights-skills-in-demand-for-the-uk-hiring-market"
  },
  "ai-uk-ai-security-practices": {
    "value": "24%",
    "line": "Of UK businesses using AI have practices to manage its risks.",
    "label": "Of UK businesses that use, are adopting or are considering AI, around a quarter (24%) have cyber security practices or processes in place to manage the risks from AI. Official statistics published in April 2026.",
    "source": "DSIT and Home Office, Cyber Security Breaches Survey 2025/2026",
    "href": "https://www.gov.uk/government/statistics/cyber-security-breaches-survey-20252026/cyber-security-breaches-survey-20252026"
  },
  "ai-uk-company-data-public-ai": {
    "value": "39%",
    "line": "Of UK workers have put company data into a public AI tool.",
    "label": "In the UK, 39% of workers who use AI say they have uploaded company information, such as financial, sales or customer data, into a public AI tool, based on a survey carried out between November 2024 and January 2025.",
    "source": "KPMG and the University of Melbourne, Trust, attitudes and use of AI: UK insights, 2025",
    "href": "https://kpmg.com/uk/en/insights/ai/uk-attitudes-to-ai.html"
  },
  "ai-shadow-ai-breach-cost": {
    "value": "$670,000",
    "line": "Added breach cost where shadow AI use is high.",
    "label": "Organisations with high levels of shadow AI, meaning staff using AI tools without approval, saw average breach costs USD 670,000 higher than those with little or none. Global study of 600 organisations, published July 2025.",
    "source": "IBM, Cost of a Data Breach Report 2025",
    "href": "https://newsroom.ibm.com/2025-07-30-ibm-report-13-of-organizations-reported-breaches-of-ai-models-or-applications,-97-of-which-reported-lacking-proper-ai-access-controls"
  },
  "ai-eu-ai-act-article-4-date": {
    "value": "2 Feb 2025",
    "line": "Date the EU AI Act literacy duty in Article 4 began to apply.",
    "label": "Article 4 of the EU AI Act, which requires providers and deployers to take measures to ensure a sufficient level of AI literacy among their staff, sits in Chapter I, which has applied since 2 February 2025.",
    "source": "EUR-Lex, Regulation (EU) 2024/1689 (Artificial Intelligence Act), 2024",
    "href": "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689"
  },
  "ai-eu-ai-act-top-fine": {
    "value": "€35 million",
    "line": "Or 7% of turnover: the top EU AI Act fine tier.",
    "label": "Under Article 99 of the EU AI Act, breaching the prohibited AI practices in Article 5 can bring fines of up to EUR 35 000 000 or 7% of worldwide annual turnover, whichever is higher. Article 4 itself is not listed among these fine tiers.",
    "source": "EUR-Lex, Regulation (EU) 2024/1689 (Artificial Intelligence Act), 2024",
    "href": "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689"
  },
  "ai-uk-ai-training-reach": {
    "value": "27%",
    "line": "Of UK adults have any AI education or training.",
    "label": "Only a quarter (27%) of people in the UK say they have had AI education or training, placing the UK in the bottom third of 47 countries surveyed between November 2024 and January 2025.",
    "source": "KPMG and the University of Melbourne, Trust, attitudes and use of AI: UK insights, 2025",
    "href": "https://kpmg.com/uk/en/insights/ai/uk-attitudes-to-ai.html"
  },
  "hr-cipd-uk-orgs-ai-tools-76": {
    "value": "76%",
    "line": "of UK organisations have employees using AI tools at work.",
    "label": "In the CIPD Labour Market Outlook for Autumn 2025, employees in 76% of UK organisations were using AI tools at work, rising to 87% in the public sector.",
    "source": "CIPD, Labour Market Outlook, Autumn 2025",
    "href": "https://www.cipd.org/globalassets/media/knowledge/knowledge-hub/reports/2025-pdfs/9024-lmo-autumn-2025-report-web.pdf"
  },
  "hr-cipd-genai-policy-31": {
    "value": "31%",
    "line": "of UK employers worked on a generative AI policy in the past year.",
    "label": "CIPD analysis of its Autumn 2025 employer survey found that 31% of UK employers had worked on a generative AI policy in the previous 12 months, up from 16% two years earlier.",
    "source": "CIPD, Generative AI at work: can it deliver the productivity boost UK employers need?, 2026",
    "href": "https://www.cipd.org/uk/about/blogs/can-ai-deliver-productivity-boost-uk-needs/"
  },
  "hr-cipd-genai-training-35": {
    "value": "35%",
    "line": "of UK employers gave staff training to use generative AI at work.",
    "label": "CIPD analysis of its Autumn 2025 employer survey found that 35% of UK employers had provided training and support to help employees use generative AI in their work over the previous 12 months.",
    "source": "CIPD, Generative AI at work: can it deliver the productivity boost UK employers need?, 2026",
    "href": "https://www.cipd.org/uk/about/blogs/can-ai-deliver-productivity-boost-uk-needs/"
  },
  "hr-cipd-genai-privacy-48": {
    "value": "48%",
    "line": "of UK employers report privacy and security concerns about GenAI.",
    "label": "In CIPD's Autumn 2025 employer survey, 48% of UK employers reported privacy and security concerns as a drawback of generative AI, up from 36% in Autumn 2023.",
    "source": "CIPD, Generative AI at work: can it deliver the productivity boost UK employers need?, 2026",
    "href": "https://www.cipd.org/uk/about/blogs/can-ai-deliver-productivity-boost-uk-needs/"
  },
  "hr-cisco-employee-info-genai-45": {
    "value": "45%",
    "line": "of surveyed professionals had entered employee information into GenAI.",
    "label": "Cisco's 2024 Data Privacy Benchmark Study, based on 2,600 privacy and security professionals in 12 countries, found that 45% had entered employee names or information into generative AI tools.",
    "source": "Cisco, 2024 Data Privacy Benchmark Study",
    "href": "https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2024/m01/organizations-ban-use-of-generative-ai-over-data-privacy-security-cisco-study.html"
  },
  "hr-cisco-data-entry-limits-63": {
    "value": "63%",
    "line": "of organisations limit what data can be entered into GenAI tools.",
    "label": "Cisco's 2024 Data Privacy Benchmark Study found that 63% of organisations had set limits on the data that can be entered into generative AI tools, and 27% had banned them for the time being.",
    "source": "Cisco, 2024 Data Privacy Benchmark Study",
    "href": "https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2024/m01/organizations-ban-use-of-generative-ai-over-data-privacy-security-cisco-study.html"
  },
  "hr-eu-ai-act-article-4-date": {
    "value": "2 February 2025",
    "line": "is when the EU AI Act's AI literacy duty in Article 4 began to apply.",
    "label": "Under Article 113 of Regulation (EU) 2024/1689, Chapters I and II apply from 2 February 2025, which includes the Article 4 duty on providers and deployers to ensure a sufficient level of AI literacy among staff.",
    "source": "EUR-Lex, Regulation (EU) 2024/1689 (Artificial Intelligence Act), Article 113, 2024",
    "href": "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689"
  },
  "hr-eu-ai-act-annex-iii-employment": {
    "value": "Annex III",
    "line": "of the EU AI Act lists AI used in recruitment as high risk.",
    "label": "Point 4 of Annex III to Regulation (EU) 2024/1689 classes AI systems used for recruitment, selection, promotion, termination, task allocation and performance monitoring as high-risk AI systems.",
    "source": "EUR-Lex, Regulation (EU) 2024/1689 (Artificial Intelligence Act), Annex III, 2024",
    "href": "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689"
  },
  "hr-cipd-ld-proactive-57": {
    "value": "57%",
    "line": "of L&D professionals diagnose a performance issue before designing.",
    "label": "CIPD's Learning at Work 2023 survey of 1,108 learning professionals found that 57% are proactive in understanding a performance issue before recommending a solution, up from 32% in 2021.",
    "source": "CIPD, Learning at Work 2023",
    "href": "https://www.cipd.org/uk/knowledge/reports/learning-at-work/"
  },
  "hr-cipd-ld-time-to-learn-39": {
    "value": "39%",
    "line": "of L&D staff say people get time away from their role to learn.",
    "label": "CIPD's Learning at Work 2023 survey found that 51% of learning practitioners say managers encourage participation in learning, but only 39% believe people are given time away from their day-to-day role to take part.",
    "source": "CIPD, Learning at Work 2023 survey report",
    "href": "https://www.cipd.org/globalassets/media/knowledge/knowledge-hub/reports/2023-pdfs/2023-learning-at-work-survey-report-8378.pdf"
  },
  "hr-cipd-ld-impact-process-50": {
    "value": "50%",
    "line": "of L&D professionals have a process for assessing learning impact.",
    "label": "CIPD's Learning at Work 2023 survey found that only half of learning professionals agreed they had a process in place for assessing learning impact, and 55% had a process for using feedback to improve interventions.",
    "source": "CIPD, Learning at Work 2023 survey report",
    "href": "https://www.cipd.org/globalassets/media/knowledge/knowledge-hub/reports/2023-pdfs/2023-learning-at-work-survey-report-8378.pdf"
  },
  "hr-cipd-ld-transfer-7": {
    "value": "7%",
    "line": "of L&D professionals strongly agree they support learning transfer.",
    "label": "CIPD's Learning at Work 2023 survey found that only 7% of learning professionals strongly agree they have a process for supporting the transfer of learning into the workplace.",
    "source": "CIPD, Learning at Work 2023 survey report",
    "href": "https://www.cipd.org/globalassets/media/knowledge/knowledge-hub/reports/2023-pdfs/2023-learning-at-work-survey-report-8378.pdf"
  },
  "hr-dfe-ess-training-spend-53bn": {
    "value": "£53.0bn",
    "line": "total UK employer spend on training in 2024.",
    "label": "The Department for Education's Employer Skills Survey 2024 put total UK training expenditure at £53.0bn in 2024, down from £59.0bn in 2022 in 2024 prices.",
    "source": "Department for Education, Employer Skills Survey 2024",
    "href": "https://explore-education-statistics.service.gov.uk/find-statistics/employer-skills-survey/2024"
  },
  "hr-dfe-ess-spend-per-employee-1700": {
    "value": "£1,700",
    "line": "average UK employer training spend per employee in 2024.",
    "label": "The Department for Education's Employer Skills Survey 2024 found UK training expenditure equated to £1,700 per employee, down from £1,960 in 2022 and 29.5% lower than in 2011.",
    "source": "Department for Education, Employer Skills Survey 2024",
    "href": "https://explore-education-statistics.service.gov.uk/find-statistics/employer-skills-survey/2024"
  },
  "hr-dfe-ess-skills-gaps-1-26m": {
    "value": "1.26 million",
    "line": "UK employees were judged by employers to have a skills gap in 2024.",
    "label": "The Department for Education's Employer Skills Survey 2024 found 1.26 million UK employees were judged by their employer to lack full proficiency, equivalent to 4.0% of the workforce.",
    "source": "Department for Education, Employer Skills Survey 2024",
    "href": "https://explore-education-statistics.service.gov.uk/find-statistics/employer-skills-survey/2024"
  },
  "hr-cipd-rtp-develop-in-house-48": {
    "value": "48%",
    "line": "of UK employers increased efforts to develop talent in-house.",
    "label": "CIPD's Resourcing and Talent Planning 2026 report found that 48% of UK employers increased their efforts to develop talent in-house over the previous year, with upskilling the most common response to recruitment difficulties.",
    "source": "CIPD, Resourcing and Talent Planning report 2026",
    "href": "https://www.cipd.org/uk/knowledge/reports/resourcing-surveys"
  },
  "hr-wef-skill-gaps-barrier-63": {
    "value": "63%",
    "line": "of employers see skill gaps as a major barrier to transformation.",
    "label": "The World Economic Forum's Future of Jobs Report 2025, based on over 1,000 employers worldwide, found 63% identify skill gaps as a major barrier to business transformation over 2025 to 2030.",
    "source": "World Economic Forum, The Future of Jobs Report 2025",
    "href": "https://www.weforum.org/publications/the-future-of-jobs-report-2025/digest/"
  },
  "hr-cipd-rtp-unsuitable-applicants-58": {
    "value": "58%",
    "line": "of UK employers saw more applications from unsuitable candidates.",
    "label": "CIPD's Resourcing and Talent Planning 2026 report found that 58% of UK employers reported rising applications from unsuitable candidates over the previous year, against 33% from suitable candidates.",
    "source": "CIPD, Resourcing and Talent Planning report 2026",
    "href": "https://www.cipd.org/uk/knowledge/reports/resourcing-surveys"
  },
  "hr-ico-ai-recruitment-audit-300": {
    "value": "Almost 300",
    "line": "ICO recommendations issued to AI recruitment tool providers.",
    "label": "In November 2024 the Information Commissioner's Office reported that its audits of AI recruitment tool providers produced almost 300 recommendations on fairness, data minimisation and transparency to candidates.",
    "source": "Information Commissioner's Office, AI recruitment tools audit outcomes, 2024",
    "href": "https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2024/11/ico-intervention-into-ai-recruitment-tools-leads-to-better-data-protection-for-job-seekers/"
  },
  "hr-ico-public-ai-hiring-65": {
    "value": "65%",
    "line": "of UK adults say using AI in hiring decisions is unacceptable.",
    "label": "An ICO commissioned YouGov survey of 2,157 UK adults in March 2026 found 65% consider it unacceptable to use AI in hiring or recruitment decisions such as screening applications or scoring interviews.",
    "source": "Information Commissioner's Office, AI omnibus survey: summary of findings, 2026",
    "href": "https://ico.org.uk/media2/zeunavqg/ai-omnibus-summary-of-findings-2026.pdf"
  },
  "hr-ico-public-ai-monitoring-62": {
    "value": "62%",
    "line": "of UK adults reject AI for workplace monitoring or appraisal.",
    "label": "An ICO commissioned YouGov survey of 2,157 UK adults in March 2026 found 62% consider it unacceptable to use AI for workplace monitoring or performance evaluation, with only 17% finding it acceptable.",
    "source": "Information Commissioner's Office, AI omnibus survey: summary of findings, 2026",
    "href": "https://ico.org.uk/media2/zeunavqg/ai-omnibus-summary-of-findings-2026.pdf"
  },
  "hr-ico-public-human-review-51": {
    "value": "51%",
    "line": "of UK adults would trust automated decisions more after human review.",
    "label": "An ICO commissioned YouGov survey of 2,157 UK adults in March 2026 found that knowing a human has reviewed or checked a decision is the factor most likely to increase trust in automated systems, chosen by 51%.",
    "source": "Information Commissioner's Office, AI omnibus survey: summary of findings, 2026",
    "href": "https://ico.org.uk/media2/zeunavqg/ai-omnibus-summary-of-findings-2026.pdf"
  },
  "hr-cipd-bosses-ai-underperformers-77": {
    "value": "77.3%",
    "line": "of UK bosses resist AI flagging underperformers on unclear criteria.",
    "label": "A CIPD survey of 814 UK bosses published in 2023 found a net 77.3% were uncomfortable letting AI identify underperforming employees where performance criteria were unclear, against 54.1% where criteria were clear.",
    "source": "CIPD, Using AI responsibly in people management, 2023",
    "href": "https://www.cipd.org/uk/views-and-insights/thought-leadership/insight/ai-people-management/"
  },
  "hr-gallup-manager-engagement-22": {
    "value": "22%",
    "line": "of managers worldwide were engaged at work in 2025, down from 27%.",
    "label": "Gallup's State of the Global Workplace 2026 report found global manager engagement fell by five points between 2024 and 2025, from 27% to 22%, the largest year-on-year drop recorded.",
    "source": "Gallup, State of the Global Workplace 2026",
    "href": "https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx"
  },
  "hr-gallup-manager-support-ai-79": {
    "value": "79%",
    "line": "use AI frequently when managers actively support it, against 46%.",
    "label": "Gallup's Q1 2026 survey of US employees found frequent AI use reached 79% where employees strongly agree their manager actively supports AI use, compared with 46% where they do not.",
    "source": "Gallup, State of the Global Workplace 2026",
    "href": "https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx"
  },
  "hr-cmi-ai-confident-managers-12": {
    "value": "12%",
    "line": "of UK managers feel very confident managing teams that use AI.",
    "label": "CMI polling of more than 1,000 UK managers, published in June 2026, found just 12% feel very confident managing teams using AI, falling to 10% for more advanced agentic AI systems.",
    "source": "Chartered Management Institute, Artificial Intelligence; Real Leadership, 2026",
    "href": "https://www.managers.org.uk/about-cmi/media-centre/press-releases/uk-firms-embrace-ai-boom-but-bosses-lack-training-to-deliver-it-new-report-finds/"
  },
  "hr-cmi-accidental-managers-82": {
    "value": "82%",
    "line": "of new UK managers have had no formal management training.",
    "label": "CMI and YouGov research published in October 2023, covering over 4,500 UK workers and managers, found 82% of people entering management roles had no formal management and leadership training.",
    "source": "Chartered Management Institute, Taking Responsibility: Why UK plc needs better managers, 2023",
    "href": "https://www.managers.org.uk/about-cmi/media-centre/press-releases/bad-managers-and-toxic-work-culture-causing-one-in-three-staff-to-walk/"
  },
  "hr-cipd-gwi-tasks-automated-16": {
    "value": "16%",
    "line": "of UK employees have had some of their tasks automated by AI.",
    "label": "The CIPD Good Work Index 2025 found 16% of UK employees reported that tasks had been automated using AI, typically repetitive tasks, and 85% of them said it had improved their performance.",
    "source": "CIPD, Good Work Index 2025",
    "href": "https://www.cipd.org/uk/about/news/good-work-index-2025-investment-line-managers-employee-wellbeing-ai/"
  },
  "hr-acas-ai-errors-17": {
    "value": "17%",
    "line": "of British employees name AI errors as their top AI concern at work.",
    "label": "An Acas commissioned YouGov poll of 1,023 employees in Great Britain in spring 2025 found 17% said AI making errors was their biggest concern about AI use in their workplace.",
    "source": "Acas, 1 in 4 workers worry that AI will lead to job losses, 2025",
    "href": "https://www.acas.org.uk/1-in-4-workers-worry-that-ai-will-lead-to-job-losses"
  },
  "robotics-ifr-uk-installations-2024": {
    "value": "2,500",
    "line": "Industrial robots installed in the UK in 2024, down 35%.",
    "label": "The International Federation of Robotics counted 2,500 new industrial robot installations in the UK in 2024, a fall of 35% from the one-off peak of 3,800 in 2023 that was driven by the super-deduction tax incentive.",
    "source": "International Federation of Robotics, World Robotics 2025 Industrial Robots press release, 2025",
    "href": "https://ifr.org/ifr-press-releases/news/global-robot-demand-in-factories-doubles-over-10-years"
  },
  "robotics-ifr-cobot-share-2023": {
    "value": "10.5%",
    "line": "Share of new industrial robots worldwide that were cobots in 2023.",
    "label": "Collaborative robots designed to work alongside people made up 10.5% of the 541,302 industrial robots installed worldwide in 2023, according to the International Federation of Robotics.",
    "source": "International Federation of Robotics, Collaborative Robots position paper update, 2024",
    "href": "https://ifr.org/ifr-press-releases/news/how-robots-work-alongside-humans"
  },
  "robotics-ons-robotics-adoption-uk": {
    "value": "4%",
    "line": "Share of UK firms that had adopted robotics in 2023.",
    "label": "The Office for National Statistics Management and Expectations Survey found that 4% of UK firms used robotics in their methods or processes in 2023, far below adoption of cloud computing and specialised software.",
    "source": "Office for National Statistics, Management practices and the adoption of technology and artificial intelligence in UK firms: 2023, published 2025",
    "href": "https://www.ons.gov.uk/economy/economicoutputandproductivity/productivitymeasures/articles/managementpracticesandtheadoptionoftechnologyandartificialintelligenceinukfirms2023/2025-03-24"
  },
  "robotics-ons-robotics-manufacturing": {
    "value": "14%",
    "line": "Share of UK manufacturing firms using robotics in 2023.",
    "label": "Robotics adoption was highest in the manufacturing sector, where 14% of UK firms used robotics in 2023, compared with 3% of firms in the services sector.",
    "source": "Office for National Statistics, Management practices and the adoption of technology and artificial intelligence in UK firms: 2023, published 2025",
    "href": "https://www.ons.gov.uk/economy/economicoutputandproductivity/productivitymeasures/articles/managementpracticesandtheadoptionoftechnologyandartificialintelligenceinukfirms2023/2025-03-24"
  },
  "robotics-hse-machinery-fatal-2526": {
    "value": "10",
    "line": "Workers killed by contact with moving machinery in 2025/26.",
    "label": "Health and Safety Executive RIDDOR figures record 10 worker deaths from contact with moving machinery in Great Britain in 2025/26, one of the five main kinds of fatal accident. The figures are provisional until July 2027.",
    "source": "Health and Safety Executive, Work-related fatal injuries in Great Britain, 2025/26",
    "href": "https://www.hse.gov.uk/statistics/fatals-overview.htm"
  },
  "robotics-hse-manufacturing-fatal-2526": {
    "value": "18",
    "line": "Workers killed in manufacturing in Great Britain in 2025/26.",
    "label": "Health and Safety Executive RIDDOR figures record 18 fatal injuries to workers in manufacturing in Great Britain in 2025/26, the third highest of any main industry. The figures are provisional until July 2027.",
    "source": "Health and Safety Executive, Work-related fatal injuries in Great Britain, 2025/26",
    "href": "https://www.hse.gov.uk/statistics/fatals-overview.htm"
  },
  "robotics-hse-handling-injuries-2425": {
    "value": "17%",
    "line": "Share of reported injuries from handling, lifting or carrying.",
    "label": "Handling, lifting or carrying caused 17% of non-fatal injuries to employees reported by employers under RIDDOR in Great Britain in 2024/25, the second most common accident kind after slips and trips.",
    "source": "Health and Safety Executive, Non-fatal injuries at work in Great Britain, 2024/25",
    "href": "https://www.hse.gov.uk/statistics/causinj/overview.htm"
  },
  "robotics-ukwa-warehouse-workforce": {
    "value": "760,000",
    "line": "People working in warehousing in the UK.",
    "label": "Analysis for the UK Warehousing Association published in 2026 estimates that 760,000 people work in UK warehousing once roles inside retail and manufacturing are counted, over 70% more than official figures suggest.",
    "source": "UK Warehousing Association, Warehousing sector much larger than previously thought, 2026",
    "href": "https://www.ukwa.org.uk/warehousing-sector-much-larger-than-previously-thought/"
  },
  "robotics-ukwa-warehouse-automation": {
    "value": "Under 20%",
    "line": "Share of UK warehouses estimated to feature automation.",
    "label": "In its 2025 Spending Review submission, the UK Warehousing Association cited estimates that fewer than one in five UK warehouses feature automation, while noting that adoption is expected to grow.",
    "source": "UK Warehousing Association, Representation to the Spending Review 2025 Phase 2, 2025",
    "href": "https://www.ukwa.org.uk/wp-content/uploads/2025/05/Spending-Review-Phase-Two-Submission-Feb-2025.pdf"
  },
  "robotics-interact-warehouse-orders-2025": {
    "value": "7%",
    "line": "Growth in global warehouse automation order intake in 2025.",
    "label": "Interact Analysis reports that global warehouse automation order intake rose by 7% in 2025, helped by rising project prices and large facility investments from retailers such as Amazon, Walmart and Tesco.",
    "source": "Interact Analysis, Warehouse automation order intake up by 7% press release, 2026",
    "href": "https://interactanalysis.com/warehouse-automation-order-intake-up-by-7/"
  },
  "robotics-vdma-mv-forecast-2026": {
    "value": "+3%",
    "line": "Forecast 2026 turnover growth for European machine vision.",
    "label": "VDMA Machine Vision forecasts turnover growth of around 3% for the European machine vision industry in 2026, following a 2% decline in 2025 and three years of falling sales.",
    "source": "VDMA Machine Vision market forecast, reported by Wiley Industry News, 2026",
    "href": "https://wileyindustrynews.com/en/news/european-machine-vision-expects-slight-recovery-and-growth-in-2026"
  },
  "robotics-vdma-mv-components-2025": {
    "value": "+4%",
    "line": "Sales growth for European machine vision components in 2025.",
    "label": "Within the European machine vision industry, component manufacturers grew sales by 4% in 2025, while sales of complete machine vision systems fell by 6%, according to VDMA Machine Vision.",
    "source": "VDMA Machine Vision market survey, reported by Wiley Industry News, 2026",
    "href": "https://wileyindustrynews.com/en/news/european-machine-vision-expects-slight-recovery-and-growth-in-2026"
  },
  "robotics-makeuk-skills-barrier-2023": {
    "value": "46%",
    "line": "UK manufacturers citing lack of technical skills as a barrier.",
    "label": "In the Make UK and Infor automation survey of 2023, a lack of technical skills was the most common barrier to adopting automation, reported by 46% of UK manufacturers.",
    "source": "Make UK, Manufacturing and Automation: Opening the Gates for Productive and Efficient Growth, 2023",
    "href": "https://www.makeuk.org/docs/manufacturing-and-automation-report-2023/download?attachment="
  },
  "robotics-makeuk-integration-barrier-2023": {
    "value": "41%",
    "line": "UK manufacturers facing integration and data challenges.",
    "label": "The same 2023 Make UK survey found that integration and data challenges were the second largest barrier to automation, reported by 41% of UK manufacturers.",
    "source": "Make UK, Manufacturing and Automation: Opening the Gates for Productive and Efficient Growth, 2023",
    "href": "https://www.makeuk.org/docs/manufacturing-and-automation-report-2023/download?attachment="
  },
  "robotics-makeuk-partial-automation-2023": {
    "value": "Over 60%",
    "line": "UK manufacturers that have automated only some processes.",
    "label": "Make UK reported in 2023 that more than 60% of UK manufacturers have automated only some of the processes that could be automated, partly because firms move slowly to make sure returns are justified.",
    "source": "Make UK, Manufacturing and Automation: Opening the Gates for Productive and Efficient Growth, 2023",
    "href": "https://www.makeuk.org/docs/manufacturing-and-automation-report-2023/download?attachment="
  },
  "robotics-makeuk-roi-expectation-2023": {
    "value": "39%",
    "line": "UK manufacturers expecting automation payback in 1 to 2 years.",
    "label": "In 2023, 39% of UK manufacturers expected a positive return on automation investment between one and two years after purchase, and a further 33% expected it within three to five years.",
    "source": "Make UK, Manufacturing and Automation: Opening the Gates for Productive and Efficient Growth, 2023",
    "href": "https://www.makeuk.org/docs/manufacturing-and-automation-report-2023/download?attachment="
  },
  "robotics-makeuk-automation-spend-2023": {
    "value": "4.1%",
    "line": "Average share of turnover UK manufacturers spent on automation.",
    "label": "Make UK found that a typical UK manufacturer spent an average of 4.1% of annual turnover on automation technologies in the twelve months before its 2023 survey.",
    "source": "Make UK, Manufacturing and Automation: Opening the Gates for Productive and Efficient Growth, 2023",
    "href": "https://www.makeuk.org/docs/manufacturing-and-automation-report-2023/download?attachment="
  },
  "robotics-makeuk-skills-priority-2025": {
    "value": "47.6%",
    "line": "UK manufacturers naming skills their top investment priority.",
    "label": "Make UK and RSM UK found in 2025 that skills development had overtaken plant and machinery as manufacturers' top investment priority for the year ahead, at 47.6% against 44.1%.",
    "source": "Make UK and RSM UK, Investment Monitor 2025",
    "href": "https://www.makeuk.org/insights/reports/investment-monitor-2025"
  },
  "robotics-madesmarter-nw-upskill": {
    "value": "3,200",
    "line": "Existing roles forecast to be upskilled by Made Smarter North West.",
    "label": "Made Smarter Adoption North West reported in 2024 that £25m of technology investment by participating SME manufacturers is forecast to upskill 3,200 existing roles and create over 1,700 new jobs over three years.",
    "source": "Made Smarter, £230k funding boost to help digital transformation of SME manufacturers, 2024",
    "href": "https://www.madesmarter.uk/resources/news-230k-funding-boost-to-help-digital-transformation-of-sme-manufacturers/"
  },
  "robotics-siemens-downtime-cost-2024": {
    "value": "11%",
    "line": "Share of revenue the 500 largest firms lose to unplanned downtime.",
    "label": "Siemens estimates that unplanned downtime costs the world's 500 largest companies almost $1.4 trillion a year, equivalent to 11% of their revenues.",
    "source": "Siemens, The True Cost of Downtime 2024",
    "href": "https://assets.new.siemens.com/siemens/assets/api/uuid:1b43afb5-2d07-47f7-9eb7-893fe7d0bc59/tcod-2024_original.pdf"
  },
  "robotics-siemens-sme-downtime-2024": {
    "value": "$150,000",
    "line": "Top-end hourly cost of unplanned downtime for SME manufacturers.",
    "label": "The same Siemens report finds that for small and medium-sized manufacturers, an hour of unplanned downtime can cost up to $150,000 at the top end.",
    "source": "Siemens, The True Cost of Downtime 2024",
    "href": "https://assets.new.siemens.com/siemens/assets/api/uuid:1b43afb5-2d07-47f7-9eb7-893fe7d0bc59/tcod-2024_original.pdf"
  },
  "technology-zylo-unused-licences-2026": {
    "value": "36%",
    "line": "Average share of SaaS licences left unused by organisations.",
    "label": "Measured against recommended utilisation levels, organisations leave an average of 36% of their SaaS licences unused, according to Zylo's 2026 index of more than 40 million licences.",
    "source": "Zylo, 2026 SaaS Management Index announcement, January 2026",
    "href": "https://zylo.com/news/2026-saas-management-index"
  },
  "technology-zylo-business-unit-spend-2026": {
    "value": "81%",
    "line": "Share of SaaS spend now controlled by business units, not IT.",
    "label": "Business units control 81% of SaaS spend while IT directly manages 15%, so teams outside IT increasingly own the value of the tools they buy, according to Zylo's 2026 index.",
    "source": "Zylo, 2026 SaaS Management Index announcement, January 2026",
    "href": "https://zylo.com/news/2026-saas-management-index"
  },
  "technology-ons-cloud-adoption-2023": {
    "value": "69%",
    "line": "UK firms using cloud-based computing systems and applications.",
    "label": "In 2023, 69% of UK firms had adopted cloud-based computing systems and applications, the most widely adopted technology in the ONS Management and Expectations Survey.",
    "source": "ONS, Management practices and the adoption of technology and AI in UK firms: 2023, March 2025",
    "href": "https://www.ons.gov.uk/economy/economicoutputandproductivity/productivitymeasures/articles/managementpracticesandtheadoptionoftechnologyandartificialintelligenceinukfirms2023/2025-03-24"
  },
  "technology-ons-management-tech-adoption-2023": {
    "value": "88% vs 51%",
    "line": "Tech adoption in best managed UK firms against the worst managed.",
    "label": "In 2023, 88% of UK firms in the top decile for management practice adopted at least one advanced technology, compared with 51% of firms in the bottom decile.",
    "source": "ONS, Management practices and the adoption of technology and AI in UK firms: 2023, March 2025",
    "href": "https://www.ons.gov.uk/economy/economicoutputandproductivity/productivitymeasures/articles/managementpracticesandtheadoptionoftechnologyandartificialintelligenceinukfirms2023/2025-03-24"
  },
  "technology-ons-little-analysis-2023": {
    "value": "4x",
    "line": "More likely that weaker managed UK firms use little or no analysis.",
    "label": "UK firms with below median management scores in 2023 were four times more likely to use little to no analysis to support business decisions, according to the ONS.",
    "source": "ONS, Management practices in the UK: 2016 to 2023",
    "href": "https://www.ons.gov.uk/economy/economicoutputandproductivity/productivitymeasures/bulletins/managementpracticesintheuk/2016to2023"
  },
  "technology-capterra-purchase-regret-2025": {
    "value": "59%",
    "line": "Businesses that regret a software purchase from the last 18 months.",
    "label": "Capterra's 2025 Tech Trends Report, a survey of more than 3,500 businesses across eight countries including the UK, found that 59% regret at least one software purchase made in the previous 18 months.",
    "source": "Capterra (Gartner Digital Markets), 2025 Tech Trends Report, November 2024",
    "href": "https://www.businesswire.com/news/home/20241119695741/en/Businesses-Set-to-Increase-Software-Spending-in-2025-Despite-High-Levels-of-Purchase-Regret"
  },
  "technology-capterra-clarify-goals-2025": {
    "value": "36%",
    "line": "Regretful buyers who would clarify goals first next time.",
    "label": "Among businesses that regretted a software purchase, the most cited change for future purchases was clarifying goals and desired outcomes at the outset, named by 36%, in Capterra's 2025 survey.",
    "source": "Capterra (Gartner Digital Markets), 2025 Tech Trends Report, November 2024",
    "href": "https://www.businesswire.com/news/home/20241119695741/en/Businesses-Set-to-Increase-Software-Spending-in-2025-Despite-High-Levels-of-Purchase-Regret"
  },
  "technology-iplicit-historical-data-2024": {
    "value": "42%",
    "line": "UK finance leaders held back from switching by fear of data loss.",
    "label": "In an August 2024 survey of 1,000 UK finance leaders, 42% said fear of losing historical data was the main reason for not changing their finance system.",
    "source": "iplicit, Adding to the Pressure: survey of 1,000 UK finance leaders, 2024",
    "href": "https://20452320.fs1.hubspotusercontent-na1.net/hubfs/20452320/iplicit-AddingToThePressure-FINAL.pdf"
  },
  "technology-iplicit-spreadsheet-time-2024": {
    "value": "38%",
    "line": "UK finance leaders citing too much time managing spreadsheet data.",
    "label": "In an August 2024 survey of 1,000 UK finance leaders, 38% named too much time spent managing data in spreadsheets as a top cause of inefficiency.",
    "source": "iplicit, Adding to the Pressure: survey of 1,000 UK finance leaders, 2024",
    "href": "https://20452320.fs1.hubspotusercontent-na1.net/hubfs/20452320/iplicit-AddingToThePressure-FINAL.pdf"
  },
  "technology-iplicit-manual-automation-2024": {
    "value": "38%",
    "line": "UK finance leaders citing manual data work and lack of automation.",
    "label": "In an August 2024 survey of 1,000 UK finance leaders, 38% named manual data management and a lack of automation as a top cause of inefficiency.",
    "source": "iplicit, Adding to the Pressure: survey of 1,000 UK finance leaders, 2024",
    "href": "https://20452320.fs1.hubspotusercontent-na1.net/hubfs/20452320/iplicit-AddingToThePressure-FINAL.pdf"
  },
  "technology-iplicit-multiple-software-2024": {
    "value": "38%",
    "line": "UK finance leaders slowed by managing several separate systems.",
    "label": "In an August 2024 survey of 1,000 UK finance leaders, 38% named having to access and manage multiple instances of software as a top cause of inefficiency.",
    "source": "iplicit, Adding to the Pressure: survey of 1,000 UK finance leaders, 2024",
    "href": "https://20452320.fs1.hubspotusercontent-na1.net/hubfs/20452320/iplicit-AddingToThePressure-FINAL.pdf"
  },
  "technology-gartner-lowcode-users-outside-it": {
    "value": "80%",
    "line": "Forecast share of low-code tool users based outside formal IT.",
    "label": "Gartner predicts that by 2026 developers outside formal IT departments will account for at least 80% of low-code tool users, up from 60% in 2021.",
    "source": "Gartner, low-code development technologies forecast press release, December 2022",
    "href": "https://www.gartner.com/en/newsroom/press-releases/2022-12-13-gartner-forecasts-worldwide-low-code-development-technologies-market-to-grow-20-percent-in-2023"
  },
  "technology-mulesoft-nontechnical-automation-2025": {
    "value": "65%",
    "line": "Organisations with a strategy for non-technical automation users.",
    "label": "In MuleSoft's 2025 survey of 1,050 enterprise IT leaders, 65% of organisations had a complete or near-complete strategy for enabling non-technical users with automation tools.",
    "source": "MuleSoft, 2025 Connectivity Benchmark Report, January 2025",
    "href": "https://blogs.mulesoft.com/news/connectivity-benchmark-report-2025/"
  },
  "technology-mulesoft-europe-connected-apps-2025": {
    "value": "32%",
    "line": "Average share of applications connected in European enterprises.",
    "label": "Only 32% of applications are typically connected within European enterprises, based on 400 IT leaders in the UK, France, Germany and the Netherlands surveyed for MuleSoft's 2025 report.",
    "source": "MuleSoft and Salesforce UK, 2025 Connectivity Benchmark Report announcement, January 2025",
    "href": "https://www.salesforce.com/uk/news/stories/connectivity-report-announcement-2025/"
  },
  "technology-mulesoft-europe-app-count-2025": {
    "value": "789",
    "line": "Average number of applications used by a European enterprise.",
    "label": "European enterprises with at least 1,000 employees use 789 applications on average, according to MuleSoft's 2025 Connectivity Benchmark Report.",
    "source": "MuleSoft and Salesforce UK, 2025 Connectivity Benchmark Report announcement, January 2025",
    "href": "https://www.salesforce.com/uk/news/stories/connectivity-report-announcement-2025/"
  },
  "technology-poon-spreadsheet-errors-2024": {
    "value": "94%",
    "line": "Business decision spreadsheets found to contain errors.",
    "label": "A 2024 review of spreadsheet quality research, published in Frontiers of Computer Science, found that 94% of spreadsheets used in business decision-making contain errors.",
    "source": "Poon et al., Frontiers of Computer Science, reported by Newswise, August 2024",
    "href": "https://www.newswise.com/articles/study-finds-94-of-business-spreadsheets-have-critical-errors"
  },
  "technology-dcms-data-skills-need-2021": {
    "value": "46%",
    "line": "UK workers who say their need for data skills has grown.",
    "label": "In government research with 5,000 UK workers, 46% said the need for them to have data skills had increased over the past five years, while only 4% said it had decreased.",
    "source": "DCMS, Quantifying the UK Data Skills Gap: full report, 2021",
    "href": "https://www.gov.uk/government/publications/quantifying-the-uk-data-skills-gap/quantifying-the-uk-data-skills-gap-full-report"
  },
  "technology-dcms-no-data-training-2021": {
    "value": "Half",
    "line": "UK workers with no data skills training in the last two years.",
    "label": "Half of the 5,000 UK workers surveyed for government research reported receiving no data skills training in the previous two years, despite strong interest in training.",
    "source": "DCMS, Quantifying the UK Data Skills Gap: full report, 2021",
    "href": "https://www.gov.uk/government/publications/quantifying-the-uk-data-skills-gap/quantifying-the-uk-data-skills-gap-full-report"
  },
  "technology-csbs-breach-prevalence-2025": {
    "value": "43%",
    "line": "UK businesses reporting a cyber breach or attack in 12 months.",
    "label": "In the government's 2025 Cyber Security Breaches Survey, 43% of UK businesses and 30% of charities reported a cyber security breach or attack in the previous 12 months.",
    "source": "DSIT and Home Office, Cyber Security Breaches Survey 2025",
    "href": "https://www.gov.uk/government/statistics/cyber-security-breaches-survey-2025/cyber-security-breaches-survey-2025"
  },
  "technology-csbs-phishing-2025": {
    "value": "85%",
    "line": "UK businesses hit by a breach where phishing was involved.",
    "label": "Of UK businesses that experienced a breach or attack in the previous 12 months, 85% experienced phishing, the most prevalent and disruptive type, according to the 2025 Cyber Security Breaches Survey.",
    "source": "DSIT and Home Office, Cyber Security Breaches Survey 2025",
    "href": "https://www.gov.uk/government/statistics/cyber-security-breaches-survey-2025/cyber-security-breaches-survey-2025"
  },
  "technology-dbir-human-element-2025": {
    "value": "60%",
    "line": "Approximate share of breaches involving a human element.",
    "label": "Verizon's 2025 Data Breach Investigations Report, covering 12,195 confirmed breaches worldwide, found that the human element was involved in around 60% of breaches.",
    "source": "Verizon, 2025 Data Breach Investigations Report executive summary",
    "href": "https://www.verizon.com/business/resources/reports/2025-dbir-executive-summary.pdf"
  },
  "technology-ibm-uk-supply-chain-2025": {
    "value": "18%",
    "line": "UK breaches traced to third-party vendor or supply chain compromise.",
    "label": "Third-party vendor and supply chain compromises were the most commonly reported cause of data breaches among UK organisations, at 18%, in IBM's 2025 Cost of a Data Breach Report.",
    "source": "IBM, Cost of a Data Breach Report 2025: UK findings, July 2025",
    "href": "https://uk.newsroom.ibm.com/2025-cost-of-data-breach-UK"
  },
  "technology-gartner-managers-change-2023": {
    "value": "82%",
    "line": "HR leaders who say managers are not equipped to lead change.",
    "label": "In a July 2023 Gartner survey, 82% of HR leaders agreed that managers are not equipped to lead change.",
    "source": "Gartner, HR leaders survey on 2024 priorities, November 2023",
    "href": "https://www.gartner.com/en/newsroom/press-releases/2023-11-07-gartner-hr-leaders-survey-reveals-top-two-priorities-in-2024"
  },
  "technology-gartner-change-fatigue-2023": {
    "value": "77%",
    "line": "HR leaders who report employees fatigued by constant change.",
    "label": "In a July 2023 Gartner survey, 77% of HR leaders reported that their employees are fatigued from the amount of change.",
    "source": "Gartner, HR leaders survey on 2024 priorities, November 2023",
    "href": "https://www.gartner.com/en/newsroom/press-releases/2023-11-07-gartner-hr-leaders-survey-reveals-top-two-priorities-in-2024"
  },
  "technology-gartner-fatigue-retention-2023": {
    "value": "42%",
    "line": "Potential fall in intent to stay among change-fatigued staff.",
    "label": "Gartner reported in 2023 that change fatigue can reduce employees' intent to stay with their employer by as much as 42% and performance by as much as 27%.",
    "source": "Gartner, HR leaders survey on 2024 priorities, November 2023",
    "href": "https://www.gartner.com/en/newsroom/press-releases/2023-11-07-gartner-hr-leaders-survey-reveals-top-two-priorities-in-2024"
  },
  "technology-gartner-healthy-adoption-2025": {
    "value": "32%",
    "line": "Leaders whose last change achieved healthy employee adoption.",
    "label": "Only 32% of mid-to-senior business leaders surveyed by Gartner in 2025 said the last change they led achieved healthy adoption by employees.",
    "source": "Gartner, HR research on change adoption, July 2025",
    "href": "https://www.gartner.com/en/newsroom/press-releases/2025-07-08-gartner-hr-research-finds-just-32-percent-of-business-leaders-report-achieving-healthy-change-adoption-by-employees"
  },
  "technology-gartner-low-change-trust-2025": {
    "value": "79%",
    "line": "Employees who have low trust in organisational change.",
    "label": "An April 2025 Gartner survey of more than 2,850 employees found that 79% have low trust in change.",
    "source": "Gartner, HR research on change adoption, July 2025",
    "href": "https://www.gartner.com/en/newsroom/press-releases/2025-07-08-gartner-hr-research-finds-just-32-percent-of-business-leaders-report-achieving-healthy-change-adoption-by-employees"
  },
  "technology-prosci-excellent-change-objectives": {
    "value": "88%",
    "line": "Projects with excellent change management meeting objectives.",
    "label": "In Prosci's benchmarking research, 88% of projects with excellent change management met or exceeded objectives, compared with 13% of those with poor change management.",
    "source": "Prosci, The Correlation Between Change Management and Project Success, 2023",
    "href": "https://www.prosci.com/blog/the-correlation-between-change-management-and-project-success"
  }
};

export const COURSE_MARKET: Record<
  string,
  { stats: string[]; benefit: { title: string; body: string } }
> = {
  "prompt-engineering-for-professional-work": {
    "stats": [
      "ai-uk-ai-skills-confidence",
      "ai-uk-ai-text-generation",
      "ai-ai-training-gap-2024"
    ],
    "benefit": {
      "title": "Clear instructions, fewer rewrites",
      "body": "KPMG and the University of Melbourne found that only 36% of people in the UK feel they have the skills and knowledge to use AI appropriately. Employers need staff who can write instructions that produce usable drafts first time, and a shared prompt card makes that standard visible across a team."
    }
  },
  "ai-output-verification": {
    "stats": [
      "ai-ai-hallucination-range",
      "ai-uk-ai-work-mistakes",
      "ai-ai-incidents-2025"
    ],
    "benefit": {
      "title": "Every claim traced to a source",
      "body": "The Stanford AI Index 2026 reports hallucination rates between 22% and 94% across 26 leading models on a new accuracy benchmark. Any organisation that sends AI assisted text out under a person’s name needs someone who checks each claim before it leaves the building."
    }
  },
  "applying-ai-in-daily-work": {
    "stats": [
      "ai-uk-workers-intentional-ai",
      "ai-uk-ai-productivity",
      "ai-uk-business-ai-use-2026"
    ],
    "benefit": {
      "title": "From trial to steady habit",
      "body": "DSIT research published in 2026 found that 56% of UK businesses using AI report higher employee productivity since adopting it. That benefit depends on staff using the tool regularly on real work, with a check on each task, rather than trying it once and stopping."
    }
  },
  "ai-for-writing-and-communication": {
    "stats": [
      "ai-uk-ai-content-creation",
      "ai-uk-content-trust",
      "ai-uk-llm-text-generation"
    ],
    "benefit": {
      "title": "Drafts you are prepared to sign",
      "body": "KPMG and the University of Melbourne found that 72% of people in the UK are unsure whether online content can be trusted because it may be AI generated. Readers judge an organisation by what it signs, so employers need writers who turn fast drafts into clear claims they can stand behind."
    }
  },
  "designing-ai-agents-for-business-workflows": {
    "stats": [
      "ai-agentic-projects-cancelled",
      "ai-uk-agentic-adoption",
      "ai-uk-agentic-barriers"
    ],
    "benefit": {
      "title": "Scope agents before building them",
      "body": "Gartner predicts that over 40% of agentic AI projects will be cancelled by the end of 2027, citing escalating costs, unclear business value and inadequate risk controls. A clear agent brief that states the value, the limits and the human checkpoint helps an organisation decide early which projects deserve funding."
    }
  },
  "setting-up-and-supervising-ai-agents": {
    "stats": [
      "ai-agentic-decisions-2028",
      "ai-leaders-expect-agent-management",
      "ai-agent-task-failure"
    ],
    "benefit": {
      "title": "Named oversight for every agent",
      "body": "Gartner predicts that at least 15% of day to day work decisions will be made autonomously through agentic AI by 2028. When agents act on their own, employers need a named person who tests each agent, reviews its work and can switch it off."
    }
  },
  "ai-for-customer-communications": {
    "stats": [
      "ai-service-cases-handled-by-ai",
      "ai-cx-unresolved-issues",
      "ai-uk-service-failure-cost"
    ],
    "benefit": {
      "title": "Customer replies that commit carefully",
      "body": "The Institute of Customer Service estimates that service failures cost UK organisations approximately £6.5bn a month. As more replies are drafted with AI, employers need staff who can spot every sentence that commits the organisation before it reaches a customer."
    }
  },
  "ai-assisted-analysis-and-reporting": {
    "stats": [
      "ai-uk-ai-data-analytics",
      "ai-uk-finance-ai-skills",
      "ai-uk-ai-unchecked-output"
    ],
    "benefit": {
      "title": "Figures a colleague can rebuild",
      "body": "DSIT research found that 56% of UK businesses using or planning to use AI apply it to data and analytics. Reports built with AI still need a recorded source and method for each figure, so that finance and management teams can reproduce and defend the numbers."
    }
  },
  "secure-use-of-ai-tools-at-work": {
    "stats": [
      "ai-uk-ai-security-practices",
      "ai-uk-company-data-public-ai",
      "ai-shadow-ai-breach-cost"
    ],
    "benefit": {
      "title": "A clear rule for AI inputs",
      "body": "The Cyber Security Breaches Survey 2025/2026 found that only 24% of UK businesses using or considering AI have practices in place to manage its security risks. A written team rule on what may and may not be pasted into AI tools is a simple, practical control that closes part of that gap."
    }
  },
  "ai-literacy-under-the-eu-ai-act": {
    "stats": [
      "ai-eu-ai-act-article-4-date",
      "ai-uk-ai-training-reach",
      "ai-eu-ai-act-top-fine"
    ],
    "benefit": {
      "title": "A documented AI literacy plan",
      "body": "Article 4 of the EU AI Act has applied since 2 February 2025 and asks providers and deployers to ensure a sufficient level of AI literacy among their staff. KPMG and the University of Melbourne found that only 27% of people in the UK have any AI education or training, so organisations serving EU markets need a plan and a record of the measures they take."
    }
  },
  "ai-for-hr-and-people-teams": {
    "stats": [
      "hr-cipd-uk-orgs-ai-tools-76",
      "hr-cisco-employee-info-genai-45",
      "hr-cipd-genai-policy-31"
    ],
    "benefit": {
      "title": "AI use is outpacing policy",
      "body": "The CIPD found employees in 76% of UK organisations use AI tools at work, yet only 31% of employers worked on a generative AI policy in the past year. People teams that can say which tasks a tool may draft, and which data stays out, give their organisation a working rule before the policy catches up."
    }
  },
  "eu-ai-act-literacy-for-hr-and-l-and-d": {
    "stats": [
      "hr-eu-ai-act-article-4-date",
      "hr-eu-ai-act-annex-iii-employment",
      "hr-cipd-genai-training-35"
    ],
    "benefit": {
      "title": "The literacy duty already applies",
      "body": "EUR-Lex confirms that the AI Act's general provisions, including the Article 4 literacy duty, have applied since 2 February 2025. HR and L&D teams that can map literacy measures to roles and keep a record of what was done give their organisation evidence it can show when asked."
    }
  },
  "redesigning-workplace-learning": {
    "stats": [
      "hr-cipd-ld-proactive-57",
      "hr-cipd-ld-time-to-learn-39",
      "hr-dfe-ess-training-spend-53bn"
    ],
    "benefit": {
      "title": "Training spend needs visible results",
      "body": "The Department for Education's Employer Skills Survey puts UK employer training spend at £53.0bn in 2024. Employers expect that investment to show up as skills people can demonstrate in their work, which is what a programme built around a realistic task and a check is designed to show."
    }
  },
  "hiring-and-selection-with-ai": {
    "stats": [
      "hr-ico-ai-recruitment-audit-300",
      "hr-ico-public-ai-hiring-65",
      "hr-cipd-rtp-unsuitable-applicants-58"
    ],
    "benefit": {
      "title": "Regulators are auditing AI hiring",
      "body": "The Information Commissioner's Office made almost 300 recommendations after auditing AI recruitment tool providers, covering fairness, data minimisation and transparency to candidates. Employers need recruiters and hiring managers who can show where a person decided and keep an audit trail that stands up to that level of scrutiny."
    }
  },
  "performance-and-feedback-with-ai": {
    "stats": [
      "hr-ico-public-ai-monitoring-62",
      "hr-cipd-bosses-ai-underperformers-77",
      "hr-gallup-manager-engagement-22"
    ],
    "benefit": {
      "title": "Judgement on performance stays human",
      "body": "An ICO survey found 62% of UK adults consider AI unacceptable for workplace monitoring or performance evaluation. Employers therefore need managers who use AI only to prepare, and who base every performance judgement on what they have actually seen."
    }
  },
  "ai-adoption-for-line-managers": {
    "stats": [
      "hr-cmi-ai-confident-managers-12",
      "hr-gallup-manager-support-ai-79",
      "hr-cmi-accidental-managers-82"
    ],
    "benefit": {
      "title": "Managers shape how AI is used",
      "body": "Gallup found frequent AI use reaches 79% where managers actively support it, against 46% where they do not. Yet the Chartered Management Institute reports that only 12% of UK managers feel very confident managing teams that use AI, so a simple review standard for one-to-ones addresses a real capability gap."
    }
  },
  "building-a-workforce-skills-plan": {
    "stats": [
      "hr-dfe-ess-skills-gaps-1-26m",
      "hr-cipd-rtp-develop-in-house-48",
      "hr-wef-skill-gaps-barrier-63"
    ],
    "benefit": {
      "title": "Skill gaps block planned change",
      "body": "The World Economic Forum's Future of Jobs Report 2025 found 63% of employers see skill gaps as a major barrier to business transformation. A short skills plan tied to changes already decided helps an organisation direct training to the roles where the work is actually moving."
    }
  },
  "hr-operations-with-ai": {
    "stats": [
      "hr-cipd-gwi-tasks-automated-16",
      "hr-acas-ai-errors-17",
      "hr-ico-public-human-review-51"
    ],
    "benefit": {
      "title": "A human check builds trust",
      "body": "An ICO survey found that knowing a human has reviewed a decision is the factor most likely to increase trust in automated systems, chosen by 51% of UK adults. HR operations that build a named human check into each AI step protect employees from errors and keep that trust intact."
    }
  },
  "employee-data-privacy-and-ai": {
    "stats": [
      "hr-cisco-data-entry-limits-63",
      "hr-cisco-employee-info-genai-45",
      "hr-cipd-genai-privacy-48"
    ],
    "benefit": {
      "title": "Employers are drawing data lines",
      "body": "Cisco's 2024 Data Privacy Benchmark Study found 63% of organisations limit what data can be entered into generative AI tools, while 45% of respondents had entered employee information. A clear team rule on people data turns that limit into something staff and managers can follow every day."
    }
  },
  "measuring-whether-training-stuck": {
    "stats": [
      "hr-cipd-ld-impact-process-50",
      "hr-cipd-ld-transfer-7",
      "hr-dfe-ess-spend-per-employee-1700"
    ],
    "benefit": {
      "title": "Half of L&D lack impact checks",
      "body": "The CIPD's Learning at Work 2023 survey found only 50% of learning professionals have a process for assessing learning impact. With UK employers spending £1,700 per employee on training, according to the Department for Education, sponsors increasingly expect evidence of change in the work rather than completion counts."
    }
  },
  "robotics-for-non-engineers": {
    "stats": [
      "robotics-ons-robotics-adoption-uk",
      "robotics-ons-robotics-manufacturing",
      "robotics-ifr-uk-installations-2024"
    ],
    "benefit": {
      "title": "Few firms have made the call",
      "body": "The Office for National Statistics found that only 4% of UK firms used robotics in 2023, so most managers will face this decision without in-house precedent. A clear go or not-yet judgement from the people who own the process helps an employer commit money only where the case is sound."
    }
  },
  "collaborative-robots-at-work": {
    "stats": [
      "robotics-ifr-cobot-share-2023",
      "robotics-hse-handling-injuries-2425",
      "robotics-hse-machinery-fatal-2526"
    ],
    "benefit": {
      "title": "Cobots now share the floor",
      "body": "The International Federation of Robotics reports that cobots made up 10.5% of new industrial robots worldwide in 2023, so more operators now work beside one every shift. Teams that start, stop and recover a cobot in the right order keep the line running and give employers a safer, more predictable handover between shifts."
    }
  },
  "where-a-robot-belongs-in-the-process": {
    "stats": [
      "robotics-makeuk-partial-automation-2023",
      "robotics-ons-robotics-manufacturing",
      "robotics-makeuk-integration-barrier-2023"
    ],
    "benefit": {
      "title": "Choosing the right tasks",
      "body": "Make UK found in 2023 that more than 60% of UK manufacturers have automated only some of the processes that could be automated. Employers need people who can show, task by task, where a robot will pay and where a person or a later decision is the better answer."
    }
  },
  "preparing-a-team-for-automation": {
    "stats": [
      "robotics-makeuk-skills-barrier-2023",
      "robotics-makeuk-skills-priority-2025",
      "robotics-madesmarter-nw-upskill"
    ],
    "benefit": {
      "title": "Skills decide the outcome",
      "body": "Make UK reports that a lack of technical skills is the most common barrier to automation, cited by 46% of UK manufacturers in 2023. A clear preparation brief helps an employer plan who must learn what before the equipment arrives, so the change keeps the trust of the people it affects."
    }
  },
  "warehouse-and-logistics-automation": {
    "stats": [
      "robotics-ukwa-warehouse-automation",
      "robotics-ukwa-warehouse-workforce",
      "robotics-interact-warehouse-orders-2025"
    ],
    "benefit": {
      "title": "Most warehouses are still manual",
      "body": "The UK Warehousing Association cites estimates that fewer than 20% of UK warehouses feature automation, so most sites still have the decision ahead of them. A goods flow map that separates measured facts from assumptions lets an employer judge supplier proposals on evidence rather than sales claims."
    }
  },
  "specifying-a-robotics-project": {
    "stats": [
      "robotics-makeuk-integration-barrier-2023",
      "robotics-siemens-downtime-cost-2024",
      "robotics-makeuk-automation-spend-2023"
    ],
    "benefit": {
      "title": "Integration is where projects stall",
      "body": "Make UK found that 41% of UK manufacturers face integration and data challenges when adopting automation. A specification that states outcomes, acceptance measures and ownership of every stop gives an employer a firm basis for holding a vendor to account."
    }
  },
  "robotics-safety-and-risk": {
    "stats": [
      "robotics-hse-machinery-fatal-2526",
      "robotics-hse-manufacturing-fatal-2526",
      "robotics-ifr-cobot-share-2023"
    ],
    "benefit": {
      "title": "Machinery risk is still real",
      "body": "Provisional Health and Safety Executive figures record 10 worker deaths from contact with moving machinery in Great Britain in 2025/26. Supervisors who can recognise a defeated safeguard and escalate it the same day help an employer meet its duty of care and protect the people on the floor."
    }
  },
  "running-a-robotic-cell": {
    "stats": [
      "robotics-siemens-downtime-cost-2024",
      "robotics-siemens-sme-downtime-2024",
      "robotics-makeuk-skills-barrier-2023"
    ],
    "benefit": {
      "title": "Every unplanned stop costs",
      "body": "Siemens estimates that an hour of unplanned downtime can cost a smaller manufacturer up to $150,000 at the top end. Operators who start a cell in the right order and notice drift before it becomes a stop protect output that an employer has already paid for."
    }
  },
  "vision-systems-and-automated-inspection": {
    "stats": [
      "robotics-vdma-mv-forecast-2026",
      "robotics-vdma-mv-components-2025",
      "robotics-makeuk-integration-barrier-2023"
    ],
    "benefit": {
      "title": "Vision spending is returning",
      "body": "VDMA Machine Vision forecasts turnover growth of around 3% for the European machine vision industry in 2026, after three years of decline. As more inspection moves to cameras, employers need quality staff who can prove a system still sees what it should and know what a person must still check."
    }
  },
  "robotics-investment-decisions": {
    "stats": [
      "robotics-makeuk-roi-expectation-2023",
      "robotics-makeuk-automation-spend-2023",
      "robotics-ifr-uk-installations-2024"
    ],
    "benefit": {
      "title": "Payback expectations are short",
      "body": "Make UK found in 2023 that 39% of UK manufacturers expect automation to pay back within one to two years. A structured review of process, full cost of ownership and ramp-up helps a finance director test that expectation before the money is approved."
    }
  },
  "getting-value-from-the-technology-you-already-pay-for": {
    "stats": [
      "technology-zylo-unused-licences-2026",
      "technology-zylo-business-unit-spend-2026",
      "technology-ons-cloud-adoption-2023"
    ],
    "benefit": {
      "title": "Paid-for licences left unused",
      "body": "Zylo's 2026 SaaS Management Index found that organisations leave an average of 36% of their SaaS licences unused. Managers who can match existing licences to the work their team repeats help recover value from spend already committed."
    }
  },
  "choosing-technology-for-your-team": {
    "stats": [
      "technology-capterra-purchase-regret-2025",
      "technology-capterra-clarify-goals-2025",
      "technology-iplicit-historical-data-2024"
    ],
    "benefit": {
      "title": "Fewer regretted software purchases",
      "body": "Capterra's 2025 Tech Trends Report found that 59% of businesses regret at least one software purchase from the previous 18 months. Teams that compare options against the real work and record why they chose give employers decisions that still hold up a year later."
    }
  },
  "no-code-automation-for-everyday-work": {
    "stats": [
      "technology-gartner-lowcode-users-outside-it",
      "technology-mulesoft-nontechnical-automation-2025",
      "technology-iplicit-manual-automation-2024"
    ],
    "benefit": {
      "title": "Automation built outside IT",
      "body": "Gartner predicts that by 2026 at least 80% of low-code tool users will sit outside formal IT departments. Staff who can build, test and safely switch off a small automation give employers a practical way to reduce repetitive manual work."
    }
  },
  "from-spreadsheets-to-simple-systems": {
    "stats": [
      "technology-poon-spreadsheet-errors-2024",
      "technology-iplicit-spreadsheet-time-2024",
      "technology-dcms-no-data-training-2021"
    ],
    "benefit": {
      "title": "Spreadsheet risk made visible",
      "body": "A 2024 review published in Frontiers of Computer Science found that 94% of spreadsheets used in business decision-making contain errors. People who can map what a critical workbook does, and where it could fail, help employers decide what to keep, move or retire."
    }
  },
  "data-skills-for-people-who-are-not-analysts": {
    "stats": [
      "technology-ons-little-analysis-2023",
      "technology-dcms-data-skills-need-2021",
      "technology-dcms-no-data-training-2021"
    ],
    "benefit": {
      "title": "Decisions resting on checked numbers",
      "body": "The ONS found that UK firms with weaker management practices were four times more likely to use little or no analysis to support business decisions. Managers who can test where a figure came from and whether a comparison is fair help their organisation act on numbers that are safe to use."
    }
  },
  "security-decisions-for-non-technical-teams": {
    "stats": [
      "technology-csbs-breach-prevalence-2025",
      "technology-csbs-phishing-2025",
      "technology-dbir-human-element-2025"
    ],
    "benefit": {
      "title": "Everyday habits drive cyber risk",
      "body": "The government's Cyber Security Breaches Survey 2025 found that 43% of UK businesses experienced a breach or attack in the previous year, with phishing the most common type. Team leaders who can see how their people share accounts, files and devices can close common gaps before they cause harm."
    }
  },
  "digital-change-for-managers": {
    "stats": [
      "technology-gartner-managers-change-2023",
      "technology-gartner-change-fatigue-2023",
      "technology-gartner-fatigue-retention-2023"
    ],
    "benefit": {
      "title": "Managers equipped to lead change",
      "body": "A 2023 Gartner survey found that 82% of HR leaders believe managers are not equipped to lead change. Line managers who can describe a tool change as specific new habits, and plan for the first two weeks, help employers make change hold without adding to fatigue."
    }
  },
  "technology-decisions-for-non-technical-leaders": {
    "stats": [
      "technology-ons-management-tech-adoption-2023",
      "technology-capterra-purchase-regret-2025",
      "technology-ibm-uk-supply-chain-2025"
    ],
    "benefit": {
      "title": "Accountable technology decisions",
      "body": "The ONS found that 88% of the best managed UK firms adopted at least one advanced technology, compared with 51% of the least well managed. Leaders who can read a proposal in terms of the work, obligations and risks being bought give their organisation clearer ownership of the result."
    }
  },
  "connecting-the-tools-your-team-already-uses": {
    "stats": [
      "technology-mulesoft-europe-connected-apps-2025",
      "technology-mulesoft-europe-app-count-2025",
      "technology-iplicit-multiple-software-2024"
    ],
    "benefit": {
      "title": "Less work retyped between tools",
      "body": "MuleSoft's 2025 Connectivity Benchmark Report found that only 32% of applications are typically connected within European enterprises. Operations leads who can replace one manual handoff with a tested connection reduce double entry while keeping a person on the checks that matter."
    }
  },
  "running-a-technology-rollout": {
    "stats": [
      "technology-gartner-healthy-adoption-2025",
      "technology-prosci-excellent-change-objectives",
      "technology-gartner-low-change-trust-2025"
    ],
    "benefit": {
      "title": "Rollouts that actually stick",
      "body": "Gartner's 2025 research found that only 32% of business leaders said their last change achieved healthy adoption by employees. Project leads who stage a rollout with clear owners, dates and a sign of adoption give employers a better chance of a tool being used as intended."
    }
  }
};
