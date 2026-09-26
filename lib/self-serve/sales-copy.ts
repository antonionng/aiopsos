export type CourseSalesCopy = {
  overview: string[];
  audience: string[];
  takeaways: string[];
  benefits: { title: string; body: string }[];
  /** Keyed by lesson id. */
  lessons: Record<string, string>;
};

export const COURSE_SALES: Record<string, CourseSalesCopy> = {
  "prompt-engineering-for-professional-work": {
    "overview": [
      "A prompt is the instruction and the material you give an AI tool before it writes, and for that task it is the only information the tool has about your client, your price, or your deadline. When the prompt leaves something out, the tool fills the gap with what a reply of that kind usually says, which is how drafts come to offer discounts, dates, and agreements that nobody approved.",
      "The course teaches you to write prompts in four parts, stating who is speaking, the facts that are true, what the reply must not add or promise, and the shape of the answer. You practise reading each reply sentence by sentence and repairing the prompt behind it, and you finish with a signed prompt card for a real task that a colleague could run without asking what you meant."
    ],
    "audience": [
      "Account managers and customer service leads who use AI tools to draft replies to clients and need those replies to stay within what has actually been agreed.",
      "Office managers, payroll officers, and administrators who send routine messages about dates, amounts, and next steps, where one wrong figure creates work for someone else.",
      "Team leaders who want a prompt their colleagues can reuse, so that the whole team gets consistent drafts rather than each person guessing at the wording.",
      "Professionals who have tried an AI tool, found that its drafts needed heavy rewriting, and want a clear method for getting usable output first time."
    ],
    "takeaways": [
      "You will be able to explain why an AI tool writes confident text about facts it was never given, and to find those sentences in a draft.",
      "You will be able to write a prompt that states who is speaking, the facts that are true, what must not be promised, and the length and form of the reply.",
      "You will be able to read a reply one sentence at a time and label each sentence as safe to send or as adding a promise that was not in the prompt.",
      "You will be able to repair a prompt by adding the missing limit next to the facts it protects, rather than deleting sentences from the reply by hand.",
      "You will leave with a signed prompt card for a real task of your own, which is shown on a record that a manager or verifier can open."
    ],
    "benefits": [
      {
        "title": "Fewer promises nobody agreed",
        "body": "Replies drafted from a four-part prompt are less likely to offer a discount, a refund, or a date that the prompt never mentioned. Your organisation avoids having to honour or retract commitments that were written by a tool rather than made by a person with authority."
      },
      {
        "title": "Drafts that need less rewriting",
        "body": "When the prompt carries the facts and the shape of the answer, the first draft is close to what you would have written yourself. The time the tool saves is no longer spent correcting what it guessed."
      },
      {
        "title": "A prompt your colleagues can reuse",
        "body": "The prompt card is written so that a colleague can paste it into the tool and get a usable reply without asking you what you meant. A team that shares cards like this produces consistent messages and does not have to rediscover the same fixes."
      }
    ],
    "lessons": {
      "what-a-prompt-is": "This lesson explains that the prompt is the only information the model has about your task, and that it cannot see your inbox, your calls, or your contracts. You mark each sentence of a real reply to show whether its information came from the prompt or was supplied by the model.",
      "when-the-prompt-is-silent": "This lesson shows what the model does when a prompt says nothing about the point that matters, and why a confident tone is not evidence of a true fact. You learn the two labels used throughout the course and choose the reply you could send without checking with anyone first.",
      "parts-of-a-prompt": "This lesson names the four parts every workplace prompt needs: who is speaking, the facts that are true, what the reply must not add or promise, and the shape of the answer. You compare two prompts for the same task and choose the one a colleague could run without the model having to guess.",
      "read-a-reply": "This lesson teaches you to read a reply one sentence at a time with the prompt beside you, and to spot where promises usually hide in numbers, dates, and phrases such as 'as agreed'. You then mark every sentence of a full reply as safe to send or as adding a promise.",
      "repair-the-prompt": "This lesson teaches a four-step repair, so that a problem found in one reply does not return in the next one or reach a colleague who reuses the prompt. You edit a real prompt in place, adding the missing limit while keeping who is speaking and the facts unchanged.",
      "course-assessment": "This lesson recaps the whole method and works one mixed example from prompt to repaired reply, so you can see every move used together. You then answer seven scenario questions set in workplace situations you have not seen before, and you need six correct answers to pass.",
      "prompt-card": "This lesson brings the four parts together in a prompt for a piece of writing you actually have to produce in the coming week. You write the prompt card in labelled parts, each part is checked for substance, and you sign the card that your record will show."
    }
  },
  "ai-output-verification": {
    "overview": [
      "AI tools write by predicting likely words, so a wrong figure, a reversed condition, or an invented reference arrives in the same calm, confident voice as a correct one. Anyone who passes AI output on under their own name therefore needs a reliable way to check it against the documents it claims to rest on, rather than judging it by how certain it sounds.",
      "The course teaches a four-step check: list every claim, trace each one to a source with authority over it, test whether the reasoning goes further than the sources allow, and decide whether each claim can be used or must be held. You finish with a signed verification note on a real piece of AI output, written so that a colleague could repeat your check without asking what you did."
    ],
    "audience": [
      "Analysts and consultants who receive AI-drafted summaries of reports, contracts, or research and must stand behind every figure they pass on.",
      "Account managers who send clients letters and updates that mention dates, terms, and policies, where one wrong detail becomes a commitment.",
      "Policy officers and legal and compliance support staff who work from guidance, clauses, and case references that a model may misquote or invent.",
      "Managers who review work that colleagues produced with AI tools and want a clear record of what was checked, against what, and what was held back."
    ],
    "takeaways": [
      "You will be able to explain why the tone of an AI-written sentence tells you nothing about whether it is correct, and to compare it with its source instead.",
      "You will be able to list every checkable claim in a piece of output, including a figure or date hidden inside a sentence that reads like a linking phrase.",
      "You will be able to trace a claim to a source with authority over it, such as the signed contract, the published guidance, or the system of record, and name the exact place that confirms it.",
      "You will be able to spot a conclusion that widens the scope, turns a pattern into a cause, turns a possibility into a certainty, or drops a condition the source attached.",
      "You will leave with a signed verification note that records the claims, where each was traced, what the reasoning test found, and whether each claim was used or held."
    ],
    "benefits": [
      {
        "title": "Confident errors caught before sending",
        "body": "The four-step check finds the one wrong figure, clause, or date in an otherwise sound summary before it reaches a client or a board. Your organisation sends out fewer confident answers that later have to be corrected."
      },
      {
        "title": "Checks a colleague can repeat",
        "body": "Each trace names the source, the place in it, and what it says, so a colleague or manager can open the same document and reach the same decision. That turns a private sense of having checked into a record the team can rely on and audit."
      },
      {
        "title": "Useful output kept, weak claims held",
        "body": "The course teaches you to hold individual claims rather than reject a whole output because one sentence is wrong. Good work produced with AI is kept, and only the sentences that cannot be supported are corrected or removed."
      }
    ],
    "lessons": {
      "how-confident-error-happens": "This lesson explains how a language model produces a sentence that sounds certain and is wrong, and why checking only the hedged sentences is the wrong way round. You read a staff travel policy and mark each sentence of a model's summary as matching the source or not in the source.",
      "list-the-claims": "This lesson introduces the four-step check and teaches you to separate checkable claims, such as figures, dates, names, and commitments, from framing that has nothing to trace. You mark each sentence of a drafted project update, including a claim hidden inside a sentence that reads like a transition.",
      "trace-each-claim": "This lesson teaches you to trace a claim to a source with authority over it and to record the source, the place, and what it says, because a citation the model supplied is only a lead. You compare two colleagues' traces of a notice period and choose the one you would accept.",
      "test-the-reasoning": "This lesson shows the four ways a conclusion goes further than its sources while every fact inside it remains correct, including widened scope and dropped conditions. You mark each sentence a model wrote from an internal pilot report as following from the source or going further than it.",
      "judge-three-outputs": "This lesson adds the final step, deciding whether each claim can be used or must be held, and explains why running out of time is always a reason to hold. You apply that decision to sentences from a board summary, a customer reply, and a legal case list.",
      "course-assessment": "This lesson recaps all four steps and works one short piece of supplier output through the whole check, from listing the claims to the final decision. You then answer seven scenario questions set in situations you have not seen before, and you need six correct answers to pass.",
      "the-verification-note": "This lesson explains what a verification note must contain and why a line such as 'reviewed with AI' tells the reader nothing. You run the four-step check on a real piece of AI output of your own and write the signed note that your record will show."
    }
  },
  "applying-ai-in-daily-work": {
    "overview": [
      "Many people who try an AI tool at work stop using it within a few weeks, usually because the first task they chose was the wrong kind of work rather than because the tool was poor. Building a lasting habit means choosing recurring work you already own and can judge, and knowing what to ask the tool to do with it.",
      "The course teaches three moves you can make with a tool, which are drafting, summarising, and preparing a decision, together with the check that belongs to each and the reasons some work should start without the tool at all. You finish with a signed weekly loop that places the tool inside three pieces of your own work, each with a day, a move, and a check, one deliberate exception, and a fixed review."
    ],
    "audience": [
      "Project coordinators and administrators who write the same status updates, meeting notes, and summaries every week and want the tool to take the first pass.",
      "Operations, finance, and sales support staff who have access to an AI tool at work, have tried it a few times, and have not yet made it part of how they work.",
      "Team leaders and office managers who compare quotes, options, and dates and want help seeing a decision clearly while keeping the choice themselves.",
      "Professionals in client services who want a clear, written view of which work belongs with the tool and which should stay with them."
    ],
    "takeaways": [
      "You will be able to test a task against four criteria, which are that it repeats, you own it, you can judge the output, and its inputs are safe to share, before you build the tool into it.",
      "You will be able to write a draft request that names the reader, gives the facts, sets a limit on what must not be added, and states the shape of the answer.",
      "You will be able to check an AI summary sentence by sentence against the notes it came from, and catch a suggestion turned into a decision or an owner who was never named.",
      "You will be able to ask a tool to compare options against your own criteria, mark gaps as not stated, and leave the final choice with you.",
      "You will leave with a signed weekly loop covering three tasks you own, one piece of work that starts without the tool and why, and a weekly review."
    ],
    "benefits": [
      {
        "title": "A habit that outlasts the course",
        "body": "Because the loop fixes each task to a day, a move, and a check, the tool becomes part of ordinary weekly work rather than an occasional experiment. The weekly review gives you a set moment to notice when a task has slipped and to adjust it."
      },
      {
        "title": "Time saved on work you can judge",
        "body": "The course directs the tool towards recurring work where you already know what a good version looks like, so its output can be checked in minutes. Time saved on work you can judge stays saved, because errors are caught before they reach a colleague or client."
      },
      {
        "title": "Decisions and judgements stay yours",
        "body": "You learn to use the tool to lay out options and gaps without letting it choose, and to keep judgements about people and sensitive material off the tool. Managers can see from the loop exactly where the tool is used and where it deliberately is not."
      }
    ],
    "lessons": {
      "pick-the-work": "This lesson explains why the choice of first task decides whether the habit lasts, and sets out four criteria a good first task must meet. You mark each task from a finance analyst's week as a good first task or not a first task, testing every criterion rather than stopping at the first.",
      "draft": "This lesson teaches the four things a draft request needs, which are the reader, the facts, a limit on what must not be added, and the shape, so that you receive a draft to edit rather than rewrite. You repair a weak request and then choose the stronger of two requests.",
      "summarise": "This lesson shows the three ways an AI summary quietly changes its source, such as turning a suggestion into a decision or adding an owner nobody named. You mark each sentence of a summary of a supplier call as in the notes or not in the notes.",
      "decide": "This lesson teaches you to ask a tool to set options against your own criteria, write 'not stated' where the evidence is silent, and refrain from recommending, so the decision stays with you. You edit a request comparing suppliers and then choose the request that keeps the decision with the manager.",
      "when-not-to-start-with-the-tool": "This lesson sets out four reasons some work should start without the tool, including personal data, judgements about people, and work that needs your own first thinking. You mark each piece of work in a realistic list as start with the tool or start without it.",
      "course-assessment": "This lesson recaps the choice of work, the three moves, and where work should start, then takes one rota email through the whole method. You answer seven scenario questions set in situations you have not seen before, and you need six correct answers to pass.",
      "a-weekly-loop": "This lesson explains why a habit needs a fixed place in the week and how to write a check that names something you can actually see in the output. You write your own weekly loop with three tasks, one exception, and a review, and sign it for your record."
    }
  },
  "ai-for-writing-and-communication": {
    "overview": [
      "An AI tool can produce a clean first draft of an email, briefing, or report in seconds, but it writes for a general reader, adds claims nobody has checked, and fills gaps with polished phrases you would never say. The draft saves the typing, while the judgement about the reader, the evidence, and your own voice still has to be yours before the piece goes out under your name.",
      "The course teaches you to brief the tool with your point, your reader, and your material, and then to take the draft through three passes in order: an audience pass, a claim pass, and a signature pass. You finish with one real piece of writing you are prepared to sign, together with a short personal writing standard that you will apply to the next piece."
    ],
    "audience": [
      "Managers who write updates, requests, and announcements for directors, teams, and clients and want AI drafts that fit each reader.",
      "Communications and policy staff who prepare briefings and notes where every claim and every reported agreement must be supportable.",
      "Consultants and specialists who write proposals and reports and need the finished piece to sound like them rather than like a template.",
      "Professionals who already use an AI tool for occasional drafting and want a dependable method for turning its output into work they are prepared to sign."
    ],
    "takeaways": [
      "You will be able to brief an AI tool with a one-sentence point, a named reader, and your own facts, so that its first draft is specific rather than generic.",
      "You will be able to rewrite a draft for its actual reader, putting the request or decision first and removing sentences that could have been written for anyone.",
      "You will be able to find every claim in a draft, including reported agreements and commitments, and support it, weaken it to fit the evidence, or remove it.",
      "You will be able to apply the signature test and replace padding, inflated language, false warmth, and hedging with plain sentences in your own voice.",
      "You will leave with a finished piece of real work and a signed writing standard naming the kinds of sentence you will never let a model write for you."
    ],
    "benefits": [
      {
        "title": "No promises you cannot keep",
        "body": "The claim pass catches sentences such as 'as agreed' or 'we will roll this out in the spring' before they reach a reader who is entitled to rely on them. Your organisation sends fewer messages that commit it to something nobody decided."
      },
      {
        "title": "Writing that fits its reader",
        "body": "The audience pass shapes each piece around what one named reader knows and must do, so senior readers get the decision first and specialists keep the detail they rely on. Readers act sooner because they do not have to search for the point."
      },
      {
        "title": "A standard that survives busy days",
        "body": "Your writing standard reduces the course to the few rules you personally need, written in your own words and short enough to keep in view. It gives you a quick check to apply when time is short and the temptation is to send the draft unchanged."
      }
    ],
    "lessons": {
      "the-first-draft": "This lesson explains what a model does well in writing and why a request that describes only the tone produces a generic draft. You learn to give the model the point, the reader, and the material, and you choose the request that gives a policy officer all three.",
      "audience": "This lesson teaches you to write for one reader by asking what they know, what they care about, and what they must do after reading. You mark each sentence of a draft for a charity's trustees as written for this reader or written for anyone.",
      "claim": "This lesson defines a claim as a fact, a reported agreement, or a commitment, and explains why models add claims that nobody has checked. You compare a team announcement with the signed policy and meeting notes and mark each claim as one you can support or cannot support yet.",
      "what-you-will-sign": "This lesson introduces the signature test, which asks whether you would say each sentence to the reader in person, and names the four kinds of sentence that fail it. You edit a team leader's report to her manager so that every sentence passes while the facts are kept.",
      "one-finished-piece": "This lesson runs the draft request and the three passes in order on one email and explains why the order matters. You repair an unagreed commitment in practice, then choose which of two versions of a client email has genuinely been through every pass.",
      "course-assessment": "This lesson recaps every move in the course and takes one all-staff announcement through each pass in turn. You then answer seven scenario questions set in project management, estates, HR, IT, policy, and team leadership, and you need six correct answers to pass.",
      "a-standard-for-the-next-one": "This lesson explains what a personal writing standard is and why a line that names a specific kind of sentence is worth more than a general caution. You submit your finished piece, write your standard in labelled parts, and sign it for your record."
    }
  },
  "designing-ai-agents-for-business-workflows": {
    "overview": [
      "An AI agent is a system in which a model chooses its own next step and uses connected tools, such as a mailbox, a finance system, or a records database, until a job is done or it has to stop. Many requests for an agent are for work that a single prompt or a fixed automation would handle more cheaply, and the requests that do need an agent carry real risk if the job, the permissions, and the approval points are left vague.",
      "The course teaches you to decide whether work needs an agent, a prompt, or a fixed automation, and then to design the agent in business terms: one job with a checkable finished state, only the tools it needs, the step where a person must say yes, and a rule for what it does when it cannot finish. You finish with a signed one-page agent brief that an engineer, a vendor, or a colleague could build from without asking what you meant."
    ],
    "audience": [
      "Operations leads and process owners who have been asked to propose or commission an AI agent for a workflow they know well.",
      "Product managers and business analysts who need to turn a request for 'an agent for invoices' into a scoped job that a builder can test.",
      "Team leaders who must decide which steps an agent may take alone and which need a named person's approval before anything changes.",
      "Managers who work with vendors or internal engineers and want to settle the business decisions before any technical choices are made."
    ],
    "takeaways": [
      "You will be able to tell work that needs an agent from work that a prompt or a fixed automation handles, by looking at its steps rather than its topic.",
      "You will be able to define an agent's job by its trigger, its inputs, a finished state someone could check in a system, and its stop condition.",
      "You will be able to grant only the tools a job needs at the lowest level, and record the tools you are deliberately withholding.",
      "You will be able to identify the steps that move money, reach outside the organisation, change personal data, commit the organisation, or cannot easily be undone, and require approval for them.",
      "You will leave with a signed one-page agent brief covering the job, the tools granted and withheld, the approval step, the stop rule, and the role that owns the agent."
    ],
    "benefits": [
      {
        "title": "Agents only where they pay",
        "body": "The course shows you how to recognise when a prompt or a fixed automation would do the same work at lower cost and with less to supervise. Your organisation avoids building and testing agents for work that never needed one."
      },
      {
        "title": "Limits decided before building starts",
        "body": "The brief records which tools the agent may use, which it must never be given, and where a named person approves, so a builder cannot connect extra permissions simply because the platform offers them. That reduces the harm a misread or maliciously worded document can cause."
      },
      {
        "title": "A brief engineers can build from",
        "body": "Each line of the brief is written so that an engineer or vendor can act on it without returning to ask what was meant. Projects start from settled business decisions, and supervisors have a clear standard to test each run against."
      }
    ],
    "lessons": {
      "agent-or-prompt": "This lesson explains the difference between a prompt, a fixed automation, and an agent, and why the simplest arrangement that works is usually the right one. You mark tasks suggested by an HR and IT team as work a prompt can handle or work that needs an agent.",
      "one-job": "This lesson teaches you to define an agent's job by its trigger, inputs, finished state, and stop condition, and explains why a goal such as 'handle invoices' gives an agent no edge. You rewrite a vague job definition and choose the booking agent definition that someone could build and test.",
      "tools-you-will-not-grant": "This lesson explains reading, writing, and acting outside tools, the principle of least privilege, and why granting a tool 'in case it is useful' creates risk. You decide which tools a holiday policy agent should receive and mark each one grant or do not grant.",
      "the-approval-step": "This lesson sets out five reasons a step needs a person's approval first and explains why a notification after the action is not approval. You mark each step of a recruitment agent's job as one the agent may do alone or one where a person says yes first.",
      "when-it-cannot-finish": "This lesson covers the cases every agent meets in its first week, including missing documents and instructions hidden inside an invoice, and the three things a stop rule must say. You edit a stop rule and choose the instruction that stops, changes nothing, and hands over.",
      "course-assessment": "This lesson recaps the whole design method and reads one facilities repair request against every step, from agent or prompt to the stop rule. You then answer seven scenario questions set in situations you have not seen, and you need six correct answers to pass.",
      "the-one-page-brief": "This lesson explains what the agent brief is for, why it is a business decision rather than a technical specification, and how each line is tested for readiness to build. You write and sign a one-page brief for an agent you would like in your own organisation."
    }
  },
  "setting-up-and-supervising-ai-agents": {
    "overview": [
      "Many organisations can now configure an AI agent or assistant inside products they already license, by writing its instructions and connecting it to mailboxes, drives, and business systems. An agent set up with default permissions and tested only on the questions its owner expected can answer from the wrong source, invent details when information is missing, or act on instructions hidden in an email, and it can drift after launch without anyone noticing.",
      "The course takes you through standing up one agent from a written brief: writing standing instructions that hold for inputs you have not seen, connecting only the tools the job needs, and running three recorded tests covering the normal case, the missing input, and the action it must refuse. You finish with a signed supervision note that names the reviewer, the review rhythm, the changes that trigger a retest, and who can switch the agent off, so a colleague could take it over."
    ],
    "audience": [
      "Operations and systems administrators who will configure an agent in a licensed product and remain responsible for how it behaves.",
      "Process owners who have a written brief for an agent and need to turn it into instructions, settings, and tests without writing code.",
      "Team leaders who will supervise an agent after launch and need a review arrangement that someone can realistically keep.",
      "Technically confident specialists who are asked by a manager or auditor to show how an agent in their area is tested and controlled."
    ],
    "takeaways": [
      "You will be able to write standing instructions covering the role, scope, sources, refusals, hand-over, and format, so the agent behaves correctly on inputs nobody anticipated.",
      "You will be able to connect only the tools a job needs, check what each connection actually permits, and choose the lowest permission level, using a service account where the product allows.",
      "You will be able to run and record a normal case test with outcomes written in advance, reading the whole record of each run as well as the final answer.",
      "You will be able to test whether an agent stops and hands over when information is missing, and whether it refuses both a direct request and an instruction hidden in a document.",
      "You will leave with a signed supervision note recording the agent's configuration, the three dated tests and their results, and a named reviewer, rhythm, retest triggers, and switch-off."
    ],
    "benefits": [
      {
        "title": "Agents tested before anyone relies on them",
        "body": "The three tests check the ordinary work, the gaps, and the requests the agent must refuse before colleagues or customers depend on it. Weaknesses are found and fixed by the person responsible rather than by the first user who meets them."
      },
      {
        "title": "Permissions that limit the damage",
        "body": "You learn to leave unnecessary connections off entirely rather than relying on an instruction not to use them. If a hostile email ever persuades the agent to misbehave, the narrow permissions still prevent it from sending, deleting, or revealing what it was never given."
      },
      {
        "title": "An agent a colleague can inherit",
        "body": "The supervision note records what was configured, what was tested, and who is watching, including any tests that failed and how they were fixed. When you move on, a colleague can retest the agent, review it, or switch it off from the note alone."
      }
    ],
    "lessons": {
      "standing-instructions": "This lesson explains why standing instructions must hold for inputs you have not seen and sets out the six parts they need, starting with scope, refusals, and hand-over. You edit instructions for an expenses policy assistant so that they include a scope, a source, a refusal, and a hand-over.",
      "only-the-tools-that-job-needs": "This lesson shows that a connection often permits more than its label suggests and why leaving a tool off is stronger than an instruction about it. You compare two configurations of an equipment catalogue agent and choose the one that gives the job only the tools it needs.",
      "test-the-normal-case": "This lesson teaches you to test an agent on real, typical inputs with the right outcome written before each run, and to read the whole record rather than only the answer. You mark the results of an expenses assistant's test run as within the job or outside it.",
      "test-the-missing-input": "This lesson explains why an agent that fills a gap with a confident answer is the most dangerous failure, and how to test its stop condition deliberately. You choose the response to a question outside its source that correctly stops and hands over.",
      "test-the-action-it-must-refuse": "This lesson covers the two routes by which an agent can be pushed into a forbidden action: a direct request and an instruction hidden in content it reads. You mark each line of an HR policy assistant's refusal test record as refused or acted when it should have refused.",
      "supervise-after-launch": "This lesson explains how a tested agent drifts after launch and the four parts of supervision that catch it: a reviewer, a rhythm, retest triggers, and a switch-off. You add the missing parts to an arrangement and choose which of two supervision plans would catch drift.",
      "course-assessment": "This lesson recaps instructions, tools, the three tests, and supervision, then reads one school leave assistant against every step. You answer eight scenario questions set in facilities, finance, HR, customer service, procurement, IT, and operations, and you need six correct answers to pass.",
      "the-supervision-note": "This lesson explains what the supervision note records, why it includes failed tests, and how each line is judged ready to hand over. You write the note for the agent you set up during the course and sign it for your record."
    }
  },
  "ai-for-customer-communications": {
    "overview": [
      "When an AI tool is asked for a helpful customer reply, it often adds something the customer did not ask for, such as a voucher, a delivery date, a discount, or an admission that the organisation was at fault. Each of those sentences commits the organisation, and a colleague then has to honour a promise nobody authorised or withdraw it and handle a second complaint.",
      "The course teaches you to read every draft one sentence at a time, separating what is safe to send from what commits the company, and gives you a stated pattern for routine replies, proposals, and complaint responses. You learn a four-question check to run before every send, and you finish with a signed send-or-hold note that a colleague or new starter could follow on their first day."
    ],
    "audience": [
      "Customer service advisers who draft replies with an AI tool and need to know which sentences they can send and which must wait for approval.",
      "Account managers and sales support staff who prepare quotes and proposals where every price, date, and term must come from an approved source.",
      "Practice managers and small business owners who answer complaints themselves and want to respond warmly without admitting fault or offering compensation they have not decided on.",
      "Team leaders who want a written rule for AI-assisted customer messages that new starters can follow without guessing where their authority ends."
    ],
    "takeaways": [
      "You will be able to mark each sentence of a customer message as safe to send or as committing the company, and check whether each commitment has been authorised.",
      "You will be able to draft routine replies that acknowledge the question, answer from facts you have checked, and give a clear next step without adding offers.",
      "You will be able to check a proposal figure by figure against the current rate card or price list, including the smaller terms where invented figures usually sit.",
      "You will be able to write a complaint response that names the specific issue, states what has been done, gives the next step, and provides the escalation route.",
      "You will leave with a signed send-or-hold note that names your approved sources, what you may commit to, what you hold and who authorises it, and what you never paste into the tool."
    ],
    "benefits": [
      {
        "title": "Fewer unauthorised customer promises",
        "body": "Reading each sentence against the two labels catches refunds, credits, and dates that the model added before the customer sees them. Your organisation spends less time honouring or retracting commitments that nobody with authority made."
      },
      {
        "title": "Quotes built from approved figures",
        "body": "Every price, quantity, and date in a proposal is traced to a document your organisation has agreed before it reaches the client. That prevents an invented discount or response time from becoming part of a contract the customer signs."
      },
      {
        "title": "Clear rules for new starters",
        "body": "The send-or-hold note turns an experienced adviser's judgement into written lines that name real systems, documents, and roles. New colleagues can follow it from their first day instead of learning the limits of their authority through mistakes."
      }
    ],
    "lessons": {
      "what-can-be-sent": "This lesson gives you the distinction the whole course relies on, between sentences that acknowledge, explain, or ask and sentences that commit the company. You read a returns policy and mark each sentence of a model's reply about a faulty kettle as safe to send or commits the company.",
      "the-reply-pattern": "This lesson teaches the three-part reply pattern of acknowledge, answer from checked facts, and give the next step, and shows how to place it and a limit in the prompt. You choose which reply to a membership freeze question follows the pattern and commits nothing new.",
      "the-proposal-pattern": "This lesson sets out the four parts of a proposal, which are scope, figures, assumptions, and validity, and explains why every figure must trace to an approved source. You mark each part of a drafted quote against the current rate card.",
      "the-complaint-pattern": "This lesson teaches the four-part complaint response and explains the difference between an apology and an admission of fault or offer of compensation. You edit a response about a broken lamp so that it names the issue, states the replacement, removes unauthorised offers, and gives the route onward.",
      "the-check-before-send": "This lesson introduces four questions to ask of every draft, covering sources, commitments, personal data, and whether you would be content for a manager to read it. You choose which of two replies about a replacement bank card passes all four and can be sent.",
      "course-assessment": "This lesson recaps the two labels, the three patterns, and the check before send, then works one message that mixes a proposal question with a complaint. You answer seven scenario questions set in new situations, and you need six correct answers to pass.",
      "the-send-or-hold-note": "This lesson explains what a send-or-hold note contains and why the lines on what you may commit to and what you hold matter most. You write your own note in six labelled parts so a new starter could follow it, and sign it for your record."
    }
  },
  "ai-assisted-analysis-and-reporting": {
    "overview": [
      "AI tools can read a large spreadsheet quickly and draft a report summary in minutes, but a number in their answer may never have been calculated, may come from the wrong rows or date range, or may compare with a period that is not in the file. Once that number is quoted in a board paper or used to set a budget, nobody can explain why it moved or defend how it was produced.",
      "The course teaches the rebuild test, which asks whether a colleague could reproduce each reported number from named data using a stated method, and shows you how to ask the tool for its working so that the test takes minutes. You also learn to rewrite findings so they say only what the data shows, and you finish with a signed working file for one real report that lets a colleague rebuild every figure in it."
    ],
    "audience": [
      "Analysts and insight teams who use AI tools to summarise data files and must be able to explain where every figure came from.",
      "Finance and operations staff who prepare monthly figures for managers and boards and need each number traced to its rows and calculation.",
      "Managers who write performance reports and want findings that state what the data shows without implying a cause, a trend, or a scope it does not support.",
      "Researchers who are comfortable with spreadsheets and simple formulas, have no statistical training, and want a dependable routine for checking AI-assisted analysis."
    ],
    "takeaways": [
      "You will be able to tell a number that can be rebuilt from its rows and calculation from one that a model wrote without calculating it.",
      "You will be able to write a rebuild note that records the source and its extract date, the selection, the calculation, and the result for each reported figure.",
      "You will be able to write a request that makes the tool show its code or formula, count the rows it used and excluded, report blank values, and avoid comparisons with missing periods.",
      "You will be able to spot findings that add a cause, a trend, a scope, or a precision the data does not contain, and rewrite them with the numbers, the scope, and the limit the reader needs.",
      "You will leave with a signed working file for one real report, listing the source data, every number with its method, the findings with their limits, and what you checked yourself."
    ],
    "benefits": [
      {
        "title": "Every reported figure can be rebuilt",
        "body": "Numbers enter the report only after they have been reproduced from the named data with a written method. When a figure is questioned in a meeting, you or a manager can show exactly where it came from in one line."
      },
      {
        "title": "Findings readers can safely act on",
        "body": "Findings state the observation, who and when it covers, and the one limit that would change the reader's decision. Managers are less likely to roll out a change on the strength of a sentence that claimed a cause the data never showed."
      },
      {
        "title": "Reports a colleague can take over",
        "body": "The working file lets someone else produce next month's version while you are away, without asking which rows were excluded or why. The method stays with the report rather than in one person's memory."
      }
    ],
    "lessons": {
      "where-a-number-is-invented": "This lesson explains how a model can write a number it never calculated and the four places a figure in an AI-assisted report goes wrong. You mark each figure in a model's quarterly sales summary as rebuildable from the data or not rebuildable.",
      "the-rebuild-test": "This lesson sets out the central test of the course and the four things that must be written down for a number to pass it, and explains why asking the model whether it is sure is not a rebuild. You choose which of two notes for a renewal figure passes the test.",
      "ask-for-the-working": "This lesson shows how to write a request that makes the tool return its code or formula, the rows used and excluded, and its treatment of blank cells. You edit a weak request so that it asks for the method and rows and sets clear limits on blanks and comparisons.",
      "the-sentence-that-overclaims": "This lesson describes five common overclaims, including cause from a pattern, a trend from too few points, and statistical words used loosely, where every number is correct but the sentence says too much. You mark each sentence a model wrote from a staff survey.",
      "write-the-finding": "This lesson teaches you to write a finding with its observation, scope, and the one limit that would change the reader's decision, at the precision the data supports. You edit a bank branch finding so that it gives both figures, the branch, the months, and the limit.",
      "course-assessment": "This lesson recaps the rebuild test, asking for the working, and writing findings, then checks one board paragraph on catering costs from end to end. You answer seven scenario questions set in situations you have not seen, and you need six correct answers to pass.",
      "a-working-file": "This lesson explains what a working file contains, the three readers it serves, and how to handle confidential figures on your record. You write the working file for one real report you produce, in five labelled parts, and sign it for your record."
    }
  },
  "secure-use-of-ai-tools-at-work": {
    "overview": [
      "Most of the security risk in everyday use of AI tools comes from what people paste into them, because once a customer list, a sick note, or a password is in a prompt it has left your own systems and is held under the terms of whichever account was used. Two further risks grow as tools are connected to mailboxes and files: hidden instructions arriving in content the tool reads, and unchecked output such as code, formulas, or links going out into real work.",
      "The course teaches you to sort what your team pastes against five categories, to record the settings of each account as checked facts rather than assumptions, and to recognise untrusted content coming in and unchecked output going out. You finish with a signed team rule in five parts, tested on one real prompt with a recorded decision, that a new starter could follow on their first day without needing an IT or security background."
    ],
    "audience": [
      "Team leaders who have been asked whether it is all right to paste a spreadsheet, a contract, or an email thread into an AI tool and want a clear answer to give.",
      "Managers in any function whose teams use a mix of work accounts and personal accounts and who need to know what actually happens to information in each.",
      "Experienced staff who handle customer records, staff information, or client material covered by a confidentiality agreement and use AI tools in their daily work.",
      "Line managers who want a short written rule for their team that sits alongside the organisation's information security policy without contradicting it."
    ],
    "takeaways": [
      "You will be able to check a paste for personal data, special category data such as health information, confidential business information, client material, and secrets before it goes into any tool.",
      "You will be able to record the six settings that decide what happens to information in an account, including training use, retention, sharing, connectors, and admin controls, with where and when you checked each one.",
      "You will be able to recognise a hidden instruction in an email or document a tool reads for you, and name the checks that output needs before it is used.",
      "You will be able to write a team rule covering approved tools, what must never be pasted, what may be pasted with a stated method, output checks, and who to tell when something goes wrong.",
      "You will leave with a signed team AI rule and a record of running it on one real prompt, showing where the rule gave a clear decision."
    ],
    "benefits": [
      {
        "title": "Clear answers for your team",
        "body": "Your team gets a written rule that says which tool to open, what to leave out, and how to prepare a document, rather than a general instruction to be sensible. People stop guessing at their desks, and fewer confidential pastes happen by accident."
      },
      {
        "title": "Decisions based on real settings",
        "body": "The course shows that the account, not the brand, decides what happens to pasted information, and teaches you to record each setting from the account itself. Your team's choices rest on checked facts rather than on assumptions about a large provider or a paid plan."
      },
      {
        "title": "Mistakes reported rather than hidden",
        "body": "The rule names who to tell and how soon when something is pasted in error, and makes reporting the expected response. A password that may have been exposed is changed promptly instead of being quietly deleted from a chat history."
      }
    ],
    "lessons": {
      "what-was-pasted": "This lesson explains why a paste is a decision to share information outside your systems and sets out five categories that should make you stop, from personal data to passwords and keys. You mark each item a housing association colleague wants to paste as fine to paste or do not paste.",
      "the-settings-you-have": "This lesson shows that the account type, not the tool's name, decides what happens to pasted information, and names the six settings to find for each account. You choose which of two team leaders' records gives the team what it needs to decide what may be pasted.",
      "what-comes-in-and-what-goes-out": "This lesson covers two further routes a team rule must address: hidden instructions in content the tool reads, known as prompt injection, and output that is used without being checked. You mark each workplace situation as a safe habit or a risk to fix.",
      "the-rule": "This lesson sets out the five parts of a team rule and explains why each line must be specific enough for a new starter to act on without asking. You edit a lettings team's draft rule so that it covers personal accounts, personal data, and secrets while keeping the approved tool.",
      "run-it-on-one-prompt": "This lesson teaches you to test a rule by applying each part to one real prompt and recording a decision, treating any gap the rule leaves open as a finding to fix. You complete a half-finished run record by adding the output check, the report line, and the decision.",
      "course-assessment": "This lesson recaps what goes in, where it goes, what comes in and goes out, and the rule, then works one customer complaint request through every part. You answer seven scenario questions set in situations you have not seen, and you need six correct answers to pass.",
      "the-team-rule": "This lesson asks you to write the rule for the team you actually work in and to describe a real prompt without repeating anything confidential. You write your team AI rule in five parts, run it on one real prompt, record the result, and sign it."
    }
  },
  "ai-literacy-under-the-eu-ai-act": {
    "overview": [
      "Article 4 of the EU AI Act, Regulation (EU) 2024/1689, places a duty on providers and deployers of AI systems to take measures towards a sufficient level of AI literacy among their staff and others who use AI systems on their behalf, and most employers whose staff use AI tools at work are deployers. Much of what managers hear about the provision comes from vendors and hurried announcements claiming that a certificate, a set number of hours, or one course is required, none of which the text says.",
      "The course reads Article 4 and the Act's definition of AI literacy in plain terms, explains what they do not give you, and shows how to write a literacy measure for each role and an honest internal record of what was done. You finish with a signed one-page AI literacy plan for your area, including a plain statement that the plan is not a claim of compliance; the course is not legal advice, and neither the course nor its record makes anyone compliant."
    ],
    "audience": [
      "Managers and team leaders who have been asked what their area needs to do about AI literacy and want to answer from the text rather than from a sales email.",
      "Operations and compliance support staff who must check briefings, board slides, and vendor claims about the Act before they are circulated.",
      "Learning and development and HR professionals who need to design literacy measures that differ by role instead of buying one course for everyone.",
      "Heads of department whose teams, including agency staff and contractors, use AI systems that affect customers, applicants, or colleagues."
    ],
    "takeaways": [
      "You will be able to explain in general terms what Article 4 asks of providers and deployers, and tell a statement that is in the provision from one that goes beyond it.",
      "You will be able to describe AI literacy for one role in terms of the skills, knowledge, and understanding it needs, tied to the systems used and the people affected.",
      "You will be able to identify claims the Act does not support, such as required certificates, approved courses, set hours, or statements that a course makes an organisation compliant.",
      "You will be able to write a literacy measure that names the role, the systems, the context, the people affected, what the person must be able to do, and how you will know.",
      "You will leave with a signed one-page AI literacy plan covering scope, measures for each role, the record to be kept, the owner and review, and what the plan does not claim."
    ],
    "benefits": [
      {
        "title": "Budget spent on measures that fit",
        "body": "Because you can read vendor claims against the text of Article 4, your organisation is less likely to buy a generic course on the strength of requirements the Act does not contain. Effort goes instead to the roles whose outputs affect people's pay, jobs, health, or money."
      },
      {
        "title": "Measures a manager can review",
        "body": "Each measure states an ability someone could watch and the evidence that will show it worked, such as a review of a sample of real work. Managers can check whether a measure has done its job rather than relying on an attendance list."
      },
      {
        "title": "Honest records and clear limits",
        "body": "The course teaches you to write record entries that state what was done and what was found, and to keep words such as 'compliant' and 'certified' out of them. When a director or insurer asks whether the organisation is covered, you can give a factual answer and leave wider judgements to legal or compliance advisers."
      }
    ],
    "lessons": {
      "what-article-4-asks": "This lesson reads Article 4 in general terms, explains who counts as a provider or a deployer, and shows that the duty is reasonable, targeted effort rather than a pass or fail test. You mark each sentence of a colleague's summary as in Article 4 or not in Article 4.",
      "what-ai-literacy-means": "This lesson reads the Act's definition of AI literacy and separates it into skills, knowledge, and understanding, explaining why the sufficient level differs by role. You choose which of two descriptions of literacy for a payroll team follows the definition and fits the role.",
      "what-it-does-not-give-you": "This lesson sets out what the Act does not require, including certificates, approved courses, and set hours, and explains that Article 4 is one provision among many. You mark each sentence of an internal briefing as supported by the Act or a claim the Act does not support.",
      "a-measure-for-your-role": "This lesson explains what a literacy measure is and the six parts it needs, with particular attention to writing an ability someone could actually watch. You edit a finance team measure so that it names the systems, the context, the people affected, the ability, and the evidence.",
      "what-a-record-contains": "This lesson explains what an internal record of literacy measures is for and the five things each entry should contain, including evidence beyond attendance. You mark each line of a draft record as recording what was done or claiming more than was done.",
      "course-assessment": "This lesson recaps what Article 4 asks, what literacy means, what the Act does not give you, and how measures and records work, then answers one director's request with the whole method. You answer seven scenario questions and need six correct answers to pass.",
      "the-plan": "This lesson brings your measures, your record outline, and a required statement of limits together on one page, and explains where claim words must not appear. You write the AI literacy plan for your own area in five labelled parts and sign it for your record."
    }
  },
  "getting-value-from-the-technology-you-already-pay-for": {
    "overview": [
      "Most organisations pay every month for software that their teams open rarely, or open daily while the real work carries on in email, paper diaries and personal spreadsheets. A licence is only the right to use a tool, and its value arrives when a job the team repeats each week is actually done inside it. This course shows team leaders how to find the gap between what the organisation owns and where the work really happens.",
      "The course starts from the work rather than the software, so you build an inventory of your tools beside the jobs still done elsewhere, choose three jobs worth moving, and find out why people have kept away from the tool for each one. You finish with a signed 30-day plan that names the job, the tool, the owner, the first action, the old route that stops, and the sign in the work that shows the change has held."
    ],
    "audience": [
      "Team leaders who suspect their team pays for tools such as Microsoft Planner, Bookings or Google Forms that nobody uses for real work.",
      "Operations managers who have been asked to show better value from existing software before any new purchase is approved.",
      "Office managers who can see or request the list of licences and want a practical way to turn that list into changes in the team's week.",
      "Managers without administrator rights or technical training who need a clear, written plan they can hand to their own manager."
    ],
    "takeaways": [
      "You will be able to tell a tool that is in use for a job from one that is paid for with no job named, using the job, the person, and the last week it happened in the tool.",
      "You will be able to build a four-column inventory of your team's licensed tools that records, for each one, the nearby job still done by hand, by email or on paper.",
      "You will be able to apply four tests to shortlist three jobs worth moving, and write one sentence explaining why each other job is marked as not now.",
      "You will be able to diagnose whether a colleague stays away from a tool because the old way is quicker, nobody showed them, or they are waiting on someone else, and choose the remedy that fits.",
      "You will leave with a signed 30-day plan of three rows, each naming the job, the tool and feature, one owner, the reason and remedy, a first action in week one, what stops, and a sign in the work by week four."
    ],
    "benefits": [
      {
        "title": "More value from existing spend",
        "body": "The course directs attention to licences the organisation already pays for, so improvements come before any new purchase is considered. Your manager receives a plan that moves three repeating jobs into those tools, with the old route closed on a named date."
      },
      {
        "title": "The right remedy for each person",
        "body": "You learn to hear the three different reasons people stay away from a tool and to match each with its own remedy, such as a ready-made template or moving a whole handoff on one day. This avoids the common and costly habit of sending everyone on the same training session."
      },
      {
        "title": "A plan anyone can follow",
        "body": "Every row of your plan names one owner, a first action with a day, and a sign that can be checked in the work itself rather than a count of logins. A colleague who did not take the course can pick it up on Monday and carry it out."
      }
    ],
    "lessons": {
      "a-licence-is-not-a-job": "This lesson explains the difference between owning software and getting work out of it, and why a switched-on feature or a daily login is not proof of value. You practise marking tools as in use for a job or paid for with no job named.",
      "take-the-inventory": "This lesson shows you how to build an inventory with one row per licensed tool and four columns, including the nearby job still done elsewhere, and where to find licence reports. You then write a real row for one of your own team's tools.",
      "three-jobs-worth-moving": "This lesson sets out four tests that decide whether a job is worth moving now, and explains why three jobs is the right number and why rare, high-profile jobs rarely build a habit. You practise marking candidate jobs from a veterinary surgery.",
      "why-people-opt-out": "This lesson replaces the vague idea of resistance to change with three reasons you can hear and act on, each with its own remedy. You diagnose real comments about a tool and choose the remedy that fits the reason behind each one.",
      "repair-a-30-day-plan": "This lesson introduces the seven parts of a plan row and the two parts most often missing, which are what stops and the sign in the work. You repair a weak row written by someone else, keeping the job and tool it already names.",
      "put-the-method-to-work": "This course assessment recaps the whole method, from licence to inventory to three jobs and a plan, and works it through for a nine-person lettings agency. You then apply it to seven new situations drawn from every lesson.",
      "your-30-day-plan": "In this final lesson you write your own 30-day plan, with three rows of seven parts, each checked for the detail a reader needs to act on it. You read it once as your manager would and then sign it for your record."
    }
  },
  "choosing-technology-for-your-team": {
    "overview": [
      "Choosing a tool for a team usually starts with a product someone has already seen, and the comparison then becomes a contest of features in which the longest list wins. The better approach is to describe the work the tool must carry first, then judge every option, including changing nothing, against that work. This course teaches managers without a technical background to make that kind of choice and to record it so it can be defended later.",
      "You write a job statement in the language of your team's week, put the same five questions to every option, test the strongest one on three real cases including an awkward one, and count the cost of moving in and moving out. You finish with a signed one-page choice record that a successor, an auditor or a new finance director could read a year later and still understand."
    ],
    "audience": [
      "Team leaders who have been asked to choose a tool for their team and want a method that does not depend on the best vendor demonstration.",
      "Managers who must recommend an option to the person who holds the budget and need a written case that sets out the weaknesses as well as the strengths.",
      "Office and practice managers who suspect that keeping the current routine might be the right answer and want a fair way to show it.",
      "Anyone who inherits a tool at renewal time and wants a record that explains why it was chosen and when it should be reviewed."
    ],
    "takeaways": [
      "You will be able to write a short job statement that says who does the work, what comes in and goes out, how often it happens and what goes wrong, with features kept out of it.",
      "You will be able to put five questions to every option, covering fit with the work, who runs it, where the data goes, what it connects to and the cost over three years, and tell a checkable answer from vendor copy that leaves the question open.",
      "You will be able to run a trial on three real cases from last week, carried out by the person who does the job, and write one sentence on the result of each.",
      "You will be able to estimate the switching cost in both directions, mostly in people's time for named roles, and keep it separate from the licence price.",
      "You will leave with a signed choice record in six parts: the job, the options including changing nothing, the five questions, the trial, the switching cost, and the decision with its known weakness and a review date."
    ],
    "benefits": [
      {
        "title": "Decisions that survive the renewal",
        "body": "The choice record is written for a reader who was not in the room, so the reasoning is still clear when the contract comes up for renewal. It names a review date, which stops a tool from renewing year after year without anyone asking whether it still does the job."
      },
      {
        "title": "Fewer surprises after signing",
        "body": "Testing on your own awkward cases and asking whether your data can be exported brings problems to light before the contract is signed. Counting the cost of moving out as well as moving in protects the records the team will build up in the tool over several years."
      },
      {
        "title": "A fair hearing for every option",
        "body": "Every option, including changing nothing, is judged against the same job and the same five questions. The organisation gets a comparison that reflects its own work rather than which supplier presented best."
      }
    ],
    "lessons": {
      "start-with-the-job": "This lesson teaches you to write a job statement before looking at any product, because vendor pages quietly turn your needs into their features. You practise building one and then mark draft requirement sentences as describing the job or naming a feature.",
      "five-questions-for-every-option": "This lesson gives you five questions to put to every option, and explains why they are read side by side rather than scored. You read vendor sentences and mark whether each one answers a question with something you could check or leaves it open.",
      "test-it-on-your-own-work": "This lesson explains why a vendor demonstration cannot show whether a tool does your job, and how to run a short trial on three real cases, including an awkward one. You judge trial notes and choose the one built on real evidence.",
      "the-switching-cost": "This lesson separates the licence price from the cost of moving your work in and moving it out again, most of which is people's time. You complete a comparison line with both directions and then mark lines as switching cost or licence cost.",
      "repair-a-choice-record": "This lesson sets out the six parts of a choice record and the two parts most often missing, which are changing nothing and the review date. You repair a weak record in place, keeping what already works and adding what a later reader needs.",
      "judge-a-choice-in-practice": "This course assessment recaps the method and shows where it is usually broken under time pressure, using a mixed case from a veterinary group. You then apply every earlier lesson to eight situations in workplaces you have not yet met.",
      "your-choice-record": "In this final lesson you write the choice record for your own team's decision, drawing on the job statement, answers, trial and switching cost from earlier lessons. You check each part as a reader would and then sign it for your record."
    }
  },
  "no-code-automation-for-everyday-work": {
    "overview": [
      "No-code automation means setting up a tool your organisation already licenses, such as Microsoft Power Automate, Zapier, Make or the rules in Outlook, to carry out a set of steps whenever a particular event happens, without writing any code. It can take repetitive copying, filing and notifying off a person's week, but only if the task is described precisely and the steps that need human judgement stay with a person. This course teaches you to decide what is safe to automate and to build one small automation that holds up in real use.",
      "The course works on one repeating task of your own, from separating rule steps from judgement steps, through a written description and a careful choice of tool and access, to testing on real cases and planning for failure. You finish with a tested automation and a signed automation note that sets out its description, its access, its test log and a failure note a colleague can use while you are away."
    ],
    "audience": [
      "Administrators who spend part of every week copying details from forms and emails into trackers, folders and calendars.",
      "Coordinators who handle requests that follow the same steps each time, such as training bookings, invoices or volunteer sign-ups.",
      "Team leads who want a colleague's automation to be understood, tested and looked after rather than tied to one person's login.",
      "Staff who have access to an approved automation tool but no coding background and want to use it without creating risk for their organisation."
    ],
    "takeaways": [
      "You will be able to mark each step of a task as a rule a tool can follow or a judgement a person makes, and plan the automation around the judgement.",
      "You will be able to write a description with one trigger, steps that name exact places and fields, and conditions that handle awkward cases, so a colleague could build from it without asking.",
      "You will be able to choose the simplest approved tool that does every step, and mark each permission a connector requests as needed or not needed.",
      "You will be able to test an automation on a normal case, a missing field, a duplicate and an unusual case, and record what was handled wrongly and what you changed.",
      "You will leave with a signed automation note covering the description, the access, an honest test log, and a failure note that says how someone will notice it has stopped and how to switch it off."
    ],
    "benefits": [
      {
        "title": "Decisions stay with people",
        "body": "The course teaches you to keep judgement steps, such as approving a request or deciding whether a course is suitable, in human hands while the tool gathers and routes the information. The organisation avoids confirmations and approvals that nobody actually decided."
      },
      {
        "title": "Access your IT team can accept",
        "body": "You learn to build with tools your organisation already allows and to grant only the access the steps use, preferably under an account that exists for the work. That makes the automation easier to approve and less likely to be switched off when someone notices it."
      },
      {
        "title": "Work continues when it breaks",
        "body": "Your failure note names an owner and cover, a check a person can do without opening the tool, the manual route, and how to switch it off. When a password changes or a folder moves, the work carries on and the problem is found quickly."
      }
    ],
    "lessons": {
      "rule-or-judgement": "This lesson explains what an automation actually does and gives you a test for telling a rule a tool can follow from a judgement a person must make. You mark each step of real tasks and plan to automate the rule steps around the judgement.",
      "trigger-steps-and-conditions": "This lesson shows you how to describe an automation as a single trigger, ordered steps that name exact places, and conditions that handle awkward cases. You compare descriptions and choose the one that is ready to build without further questions.",
      "a-no-code-path": "This lesson covers choosing the simplest tool your organisation already allows and the account the automation runs under, which is the part people most often skip. You read the permissions a connector requests and mark each one as needed or not needed.",
      "run-it-on-real-cases": "This lesson explains the difference between a demonstration and a test, and how to run an automation on four kinds of real case before anyone relies on it. You read test results and mark each as handled correctly or handled wrongly.",
      "when-it-breaks": "This lesson explains the ordinary reasons automations stop working and sets out the five parts of a failure note, including a check a person can make without the tool. You repair a weak failure note so a colleague could act on it.",
      "the-whole-method": "This course assessment brings the five moves together, shows the typical mistake at each one, and reviews a colleague's volunteer sign-up flow step by step. You then apply the method to eight new situations, each with a real document or decision.",
      "your-automation-note": "In this final lesson you write the automation note for a real automation you have built and tested, in four sections that bring together every earlier lesson. Each section is checked for substance before you sign it for your record."
    }
  },
  "from-spreadsheets-to-simple-systems": {
    "overview": [
      "Many teams depend on a spreadsheet that has grown over years, such as a tracker, a pricing workbook, a rota or a monthly report, and few people can say exactly how it works. Such a workbook can give a wrong answer for months without anyone noticing, and the work can stop if the one person who understands it is away or leaves. This course teaches you to read a workbook like this clearly and decide what should happen to each part of it.",
      "You learn to name the job each sheet does, trace one important number back to the values someone typed in, spot the kinds of part that could quietly go wrong, and give the records a simpler shape that is safer to keep and easier to move. You finish with a signed one-page workbook map that records, with a reason for each part, what stays, what moves to a list or system, and what is retired."
    ],
    "audience": [
      "Team members whose work relies on a tracker, rota or pricing workbook that they did not build and would struggle to repair.",
      "Managers who are worried about what would happen to an important workbook if its author were ill or left the organisation.",
      "Finance officers and administrators who produce figures for a board or for payroll from a spreadsheet and want to know exactly what those figures depend on.",
      "People who can open a workbook, move between sheets and read a formula, but who do not write macros and are not analysts."
    ],
    "takeaways": [
      "You will be able to label each sheet in a workbook by the job it does, whether it holds the records, does the sums or shows the result, judged by what people do on it rather than by its name.",
      "You will be able to trace a figure that people rely on back to the typed-in values it depends on, including numbers typed directly into formulas, and say who types each one.",
      "You will be able to recognise six kinds of dangerous part, such as a hard-coded rate, a range that stops short, or personal data visible to too many people, and tell them from parts that are safe as they are.",
      "You will be able to reshape a record sheet into one table for each kind of thing with one row per record, using Excel Tables or a clean Google Sheets layout.",
      "You will leave with a signed workbook map in six parts, naming the owner by role, the job of each sheet, one full trace, the dangerous parts, a simpler shape, and a reasoned decision for every part."
    ],
    "benefits": [
      {
        "title": "Hidden spreadsheet risk made visible",
        "body": "The course gives you a short list of the ways a workbook can produce a wrong answer without anyone noticing, or stop when one person is away. Your organisation gets a written record of where those risks sit in a file it depends on."
      },
      {
        "title": "Moves decided part by part",
        "body": "You decide for each part of the workbook whether it stays, moves to a system or is retired, and you give a reason each time. This avoids both an expensive replacement nobody needed and the common mistake of moving a badly shaped sheet into a new tool."
      },
      {
        "title": "A map the next person can use",
        "body": "The workbook map is written so that a colleague who has never opened the file could act on it, down to the cell and the person who types each value. That knowledge no longer depends on one person's memory."
      }
    ],
    "lessons": {
      "what-the-file-is-doing": "This lesson gives you three plain names for the jobs a sheet can do, and explains why a workbook becomes dangerous when those jobs are tangled together. You label the sheets of real workbooks by what people do on them rather than by their tab names.",
      "trace-one-number": "This lesson shows you how to follow a result that people rely on back through its formulas to the values someone typed in, and what Trace Precedents misses. You complete a partial trace and then choose the one that reaches the typed-in values.",
      "the-dangerous-parts": "This lesson names six kinds of part that can give a wrong answer unnoticed or stop the work when one person is away, and describes what safe looks like. You mark features of real workbooks as dangerous or safe as they are.",
      "a-simpler-shape": "This lesson sets out a simpler shape for data, with one table for each kind of thing and one row per record, and explains how to achieve it in Excel and Google Sheets. You reshape a holiday tracker layout to follow it.",
      "what-you-move": "This lesson gives you three decisions for each part of a workbook, which are stays, moves to a system or is retired, and the reasons that justify each one. You make the decisions part by part for workbooks drawn from real teams.",
      "course-assessment": "This course assessment recaps the five moves in order and works them through on a leisure centre's membership workbook. You review a colleague's sentences about a workbook and then apply the method to seven situations you have not met before.",
      "your-workbook-map": "In this final lesson you write a one-page map of a real workbook your team depends on, in six labelled parts, keeping personal data out of it. Each part is checked for the detail a colleague would need before you sign it."
    }
  },
  "data-skills-for-people-who-are-not-analysts": {
    "overview": [
      "Managers and specialists are sent tables, dashboards and summary figures every week and are expected to act on them, often without knowing exactly what was counted, when, or compared with what. A figure such as complaints up 30% can be accurate and still lead to the wrong decision if a filter was left on, a definition changed, or two unlike periods were set side by side. This course teaches people who do not build the numbers to check them quickly before relying on them, with no statistics required.",
      "The course treats every number as a claim and gives you a small set of checks in a fixed order: state the full claim, find its source, definition, date and owner, check the rows behind it, test whether the comparison is fair, and send the data owner one answerable question when a doubt would change your decision. You finish with a five-question checklist in your own words, already applied to a real table from your work and ending in a clear decision on whether the figures are safe to use."
    ],
    "audience": [
      "Managers who take decisions on staffing, budgets or suppliers from figures prepared by someone else.",
      "Coordinators who receive dashboards and weekly reports and pass the numbers on to colleagues or senior leaders.",
      "Specialists in fields such as HR, operations or service delivery who are asked to comment on trends without being analysts themselves.",
      "Anyone who can sort and filter a spreadsheet and read a simple chart but wants a dependable way to judge whether a figure can carry a decision."
    ],
    "takeaways": [
      "You will be able to restate a short figure as a full claim that says what was counted, of whom or of what, over what period, and compared with what.",
      "You will be able to record the source, definition, date and owner behind a figure, and recognise a note that sounds official but leaves those facts unknown.",
      "You will be able to spot the ordinary ways rows go missing, such as a filter left on, an export that stopped at its limit, or an average that skips blank cells.",
      "You will be able to apply four tests of a fair comparison and say what would make an unfair one fair, and write a single message to a data owner that can be answered with a fact.",
      "You will leave with a five-question data checklist applied to one real table, ending in a decision of safe to use, safe to use with a caveat, or ask first."
    ],
    "benefits": [
      {
        "title": "Decisions rest on sound figures",
        "body": "The checks catch the common and honest errors behind workplace figures, such as an old extract, a changed definition or an unlike comparison, before a plan is built on them. Your organisation makes fewer confident decisions that later turn out to rest on an incomplete number."
      },
      {
        "title": "Effort matched to the stakes",
        "body": "You learn to ask whether a different number would change the decision, so time goes on the figures that matter and small, reversible decisions are not delayed. Most figures are cleared quickly once the claim is written out."
      },
      {
        "title": "Questions data owners can answer",
        "body": "Instead of asking a colleague to double-check everything, you send one short message naming the decision, its date, the claim and one factual question. Data owners can reply quickly, and decisions go ahead on time."
      }
    ],
    "lessons": {
      "a-number-is-a-claim": "This lesson shows that a short figure stands for a longer claim, and sets out its four parts: what was counted, of whom, over what period, and compared with what. You rewrite figures as full claims and mark sentences that leave the claim open.",
      "where-the-number-came-from": "This lesson explains the four facts behind every figure, which are its source, definition, date and owner, and why the definition most often changes a decision. You judge notes about figures and choose the one that gives all four facts.",
      "filters-and-missing-rows": "This lesson covers the most common way a correct-looking total turns out to be wrong, which is that some rows behind it are missing. You learn five ordinary causes, including hidden rows in Excel, and mark figures as counting every row or not.",
      "a-fair-comparison": "This lesson gives you four tests of a fair comparison, covering counting, periods, group size and the numbers behind a percentage, and shows how to say what would fix an unfair one. You mark workplace comparisons as fair or unfair.",
      "the-question-before-you-act": "This lesson teaches you to decide whether a doubt would change your decision and, if it would, to write one short message the data owner can answer with a fact. You repair a vague request into a specific question about definition, rows or comparison.",
      "using-every-check-together": "This course assessment joins the five moves into one method ending in three decisions, and shows how to match the effort to the stakes of each decision. You then apply the whole method to eight situations you have not seen before.",
      "your-checklist": "In this final lesson you write the method as five short questions in your own words and apply them to a real table you have been sent. You finish with a decision on the figures and sign the checklist for your record."
    }
  },
  "security-decisions-for-non-technical-teams": {
    "overview": [
      "Team leaders and office managers decide every day how people share logins, files and devices, usually without a security specialist to ask. Most harm to small teams does not come from sophisticated hacking but from ordinary routes: a convincing email that asks for a password, a request to change a supplier's bank details, a reused password, or access that was never removed when someone left. This course teaches people with no technical background to see where their own team is exposed and to act on the items that matter most.",
      "You walk through how your team really gets into its systems, sort each shared item by the worst realistic outcome, learn the habit of checking any request by a route you already trust, and choose changes that can be finished in days rather than months. The course draws on the National Cyber Security Centre's Small Business Guide and Cyber Aware advice, and you finish with a signed exposure list for your own team with at least three changes for this week, each with one owner and a date."
    ],
    "audience": [
      "Office managers in small and medium-sized organisations who look after shared logins, the bank portal and the office devices without an in-house security team.",
      "Team leaders inside larger organisations who decide how access is handed to new starters, temporary staff and suppliers.",
      "Managers who suspect that former staff or contractors can still get into a mailbox, folder or system and want a practical way to find out.",
      "Staff who approve payments or handle supplier details and need a dependable habit against payment diversion and phishing."
    ],
    "takeaways": [
      "You will be able to list how your team really shares access, by walking the work and reading user lists, and label each item as named access or shared access.",
      "You will be able to sort shared access by the worst realistic outcome into serious harm or nuisance, including the harm of being locked out when only one person knows a password.",
      "You will be able to recognise phishing, payment diversion, reused passwords and unrevoked access in workplace examples, and respond by checking the request through a contact you already held.",
      "You will be able to tell a change for this week, such as turning on two-step verification or changing a password a leaver knew, from a project for later.",
      "You will leave with a signed exposure list that records, for each serious harm, what is shared, who can get in, the worst realistic outcome, the change, and the owner with a date."
    ],
    "benefits": [
      {
        "title": "Changes made this week",
        "body": "The course directs your effort to small changes that reduce a serious harm and can be finished now, each with one named owner and a date. The organisation removes real exposure in days instead of waiting for a larger project to be approved."
      },
      {
        "title": "Protection against payment diversion",
        "body": "You learn to confirm any request for money, passwords or changed details by a route you already had before the message arrived. This habit works whether or not the message looks genuine, so it does not rely on spotting a fake."
      },
      {
        "title": "A list others can act on",
        "body": "Your exposure list is written so that a manager or IT provider can act on each row without calling you and can check on the due date whether the change was made. It describes access without containing passwords, account numbers or personal data."
      }
    ],
    "lessons": {
      "what-you-actually-share": "This lesson explains what access means in practice and the difference between named access and shared access, which is common for good reasons. You walk through a normal week of work and mark items such as shared logins and open links as named or shared.",
      "what-would-hurt": "This lesson teaches you to sort shared access by the worst realistic outcome, rather than by how visible or embarrassing a problem would be. You mark items as serious harm or nuisance, including the risk of being locked out of an account.",
      "how-it-usually-goes-wrong": "This lesson describes the four ordinary routes by which small teams are harmed and the habit of checking a request by another route you already trust. You choose between responses to suspicious requests and learn how to report a phishing email.",
      "three-changes-this-week": "This lesson gives you three tests for a good change: it reduces a serious harm, it can be done now, and it has one owner and a date. You mark proposals as a change for this week or a project for later.",
      "repair-an-exposure-list": "This lesson sets out the five parts of an exposure list row and the parts most often missing, which are who can get in and a real owner. You repair a weak row about a bank portal so that someone else could check and act on it.",
      "security-judgement-assessment": "This course assessment recaps the five moves of the method and shows where careful professionals usually slip. You apply the method to eight new situations, reading each one for who holds the access, what could be lost and where the request came from.",
      "your-exposure-list": "In this final lesson you write the exposure list for your own team, with a numbered line for each serious harm and a note of nuisances and projects for later. You check each line is ready to act on and then sign it for your record."
    }
  },
  "digital-change-for-managers": {
    "overview": [
      "When a team moves to a new tool or way of working, such as from email to a shared task board or from paper forms to a system, the decision is usually made above the line manager, but the change succeeds or fails in the manager's team. Most such changes fail in the first fortnight, because the announcement described the tool, the old route stayed open, and nobody decided in advance what success would look like in the work. This course teaches line managers to lead that fortnight well, with no technical knowledge of the tool required.",
      "You learn to restate a tool change as the things your people will stop and start doing, to set a date and a way for the old habit to end, to plan the first two weeks with a lighter load and a named person to ask, and to tell a real cost from a request for reassurance. You finish with a signed two-week plan for a real change in your own team that a colleague covering your leave could run without ringing you."
    ],
    "audience": [
      "Line managers whose team is about to change a tool or a way of working that was chosen by someone else in the organisation.",
      "Team leaders who have been handed a supplier's feature list and need to explain to their team what will actually be different in their week.",
      "Managers who have seen a previous change drift back to the old spreadsheet or inbox and want this one to hold.",
      "Supervisors who expect objections from experienced staff and want to know which ones should change the plan."
    ],
    "takeaways": [
      "You will be able to rewrite a feature announcement as sentences about what people will do, and what it replaces, while keeping the go-live date.",
      "You will be able to name the old habit that must stop, the date it stops and the way it is closed, such as an automatic reply or a spreadsheet made read-only.",
      "You will be able to plan the first two weeks as work people can feel, with a lighter load where the change bites, a named person to ask, and a short regular check-in.",
      "You will be able to tell an objection that names a real cost in the work from one that asks for reassurance, answer each in the way it needs, and set a sign in the work to check at the end of week two instead of a count of logins.",
      "You will leave with a signed two-week plan in eight parts, including what people stop doing, who they ask, the objections you expect, the sign in the work, and what you will not pretend."
    ],
    "benefits": [
      {
        "title": "Changes that hold past week two",
        "body": "The course deals directly with the reasons tool changes stall: the old route left open, a fortnight nobody planned, and success judged by logins. Your organisation's investment in a new tool is more likely to show up in the way the work is actually done."
      },
      {
        "title": "Objections treated as information",
        "body": "You learn to recognise when a team member has found a real cost, such as a case the new tool handles badly, and to act on it before private workarounds spread. Worries that only need reassurance get help instead of an endless list of redesign requests."
      },
      {
        "title": "A plan someone covering could run",
        "body": "Every line of your plan gives a date, a name, a time or a check, so the change does not depend on you being in the office. It also includes an honest sentence on what you will not pretend, which protects your credibility with the team."
      }
    ],
    "lessons": {
      "a-tool-change-is-a-change-in-work": "This lesson explains that your team will feel a new tool as changes in their week rather than as a list of features, and why announcements usually come out the wrong way round. You rewrite a feature announcement and mark sentences as something they do or something the tool has.",
      "what-they-stop-doing": "This lesson shows why changes fail when the old way stays open, and how to give the old habit a name, a date and a way it stops after a supported overlap. You edit a plan with no end and choose the announcement that says what stops.",
      "the-first-two-weeks": "This lesson explains why people are slower before they are faster, and what a plan for the first two weeks must contain beyond emails and training. You mark plan lines as work people can feel or only an announcement.",
      "hearing-the-objection": "This lesson teaches you to hear objections as information and to tell one that names a real cost in the work from one that asks for reassurance. You choose responses that treat a real cost as a cost and mark comments from real teams.",
      "how-you-know": "This lesson shows you how to decide before go-live what you should see in the work at the end of week two, and how you will check it. You turn a login target into a sign in the work and mark measures as signs or counts of activity.",
      "putting-the-two-weeks-together": "This course assessment recaps the whole method and shows how each move depends on the one before it. You compare two managers' notes and then apply every move to six situations set in teams you have not met in the course.",
      "your-two-week-plan": "In this final lesson you write the two-week plan for a real change you are about to lead, in eight parts. You test each line against whether a colleague covering your leave could run it, and then sign the plan for your record."
    }
  },
  "technology-decisions-for-non-technical-leaders": {
    "overview": [
      "Directors, trustees and business owners are regularly handed a business case, a vendor pitch or a team's recommendation and asked to approve a technology proposal they are not equipped to judge on technical grounds. They do not need to understand how the technology works, but they do need to know what will be different in the work once it is bought, and what the organisation is committing to in contracts, costs and people's time. This course teaches leaders to read any technology proposal in those terms and to reach a decision they can defend.",
      "The course gives you a short method: restate the proposal as outcomes in the work, put the same five questions to it, name one owner for each of the four ways a decision can fail, and set a ninety-day test with a measure, a starting point, a threshold, a date and a decision. You finish with a signed one-page decision note for a real proposal, which another leader or an auditor could use to hold the proposer to the result."
    ],
    "audience": [
      "Directors and heads of department who approve or reject technology proposals without being technologists themselves.",
      "Trustees and board members who are asked to vote on a digital investment and want to know which questions the proposal has left open.",
      "Business owners who are presented with vendor pitches and demonstrations and want a way to judge them that does not depend on the presentation.",
      "Senior leaders who want every approved technology decision to have a named owner and a clear test of whether it is working."
    ],
    "takeaways": [
      "You will be able to tell a sentence that states an outcome in the work from one that describes a feature of the product, and ask for the outcome early and politely.",
      "You will be able to put five questions to any proposal, covering what changes in the work, what it replaces, who runs it, its whole-life cost and what happens if it or the supplier fails, and record which are answered and which are left open.",
      "You will be able to name one owner for each of the four kinds of failure: not used, not working, data exposed and supplier failure.",
      "You will be able to set a ninety-day test that someone other than the proposer could check, with a measure, a starting point, a threshold, a date and a decision agreed in advance.",
      "You will leave with a signed one-page decision note for a real proposal, ending in approve, approve with conditions or not yet, with a reason given in terms of the five questions."
    ],
    "benefits": [
      {
        "title": "Decisions not driven by demonstrations",
        "body": "The course replaces the impression left by a smooth demonstration with a fixed set of questions put to every proposal. Your organisation approves technology on the strength of what it will change in the work, with the open questions sent back to the proposer in writing."
      },
      {
        "title": "Clear accountability after launch",
        "body": "Each way the decision could fail has one named person who will notice it and act, rather than a programme board or the supplier. Problems such as a system nobody uses or a sharp price rise at renewal are raised quickly."
      },
      {
        "title": "A record that explains itself",
        "body": "The decision note records the reasoning, not the mood of the meeting, so a new chief executive or trustee can see a year later why the decision was made. The ninety-day test gives the review something definite to measure against."
      }
    ],
    "lessons": {
      "what-you-are-buying": "This lesson explains that approving a proposal means buying a change in the work and taking on obligations such as a contract term and an exit. You read proposal sentences and mark each one as an outcome in the work or a feature of the product.",
      "five-questions": "This lesson gives you five questions to put to every technology proposal and explains why they are worked through in order rather than scored. You mark proposal sentences as answering a question with something checkable or leaving it open.",
      "who-owns-the-failure": "This lesson sets out the four ways a technology decision can fail and explains why a programme board, a sponsor or a supplier cannot own them. You compare ownership sections and choose the one that names one person for each kind of failure.",
      "the-ninety-day-test": "This lesson shows you how to turn the promised outcome into a test with five parts that can be checked ninety days after launch. You mark success statements as ones that can be held to or cannot, often because they lack a starting point or a decision.",
      "repair-a-decision-note": "This lesson sets out the five sections of a decision note, the two readers it is written for, and the three possible decisions. You repair a weak note in place so that it states an outcome, names all four owners and gives a reasoned decision.",
      "apply-the-method": "This course assessment recaps the four moves and the decision note, and shows how a gap in one move tends to appear in another. You then apply the method to six new proposals, choosing the response that follows it in each case.",
      "your-decision-note": "In this final lesson you write a decision note for a real proposal you are deciding on now or decided recently, keeping confidential figures out. Each of the five sections is checked in turn before you sign the note for your record."
    }
  },
  "connecting-the-tools-your-team-already-uses": {
    "overview": [
      "In many teams, work passes from one tool to another only because a person retypes it, copies it or forwards an email so that someone else can key it in, for example from a booking system into an accounting package such as Xero. Each of these handoffs costs time and invites mistakes that reach customers, money or personal data. This course teaches operations leads and managers who do not write code to replace one such handoff with a connection between the two tools that they can trust and explain.",
      "You find the handoff most worth connecting, decide which tool is the source of truth and which identifier both tools share, and write a field map before you touch any settings. You then connect the tools through a built-in integration or an approved connector with only the access the map needs, test it on this week's real inputs including the awkward cases, and finish with a signed handoff map that says what a person must still check, who checks it, when, and what they do if it is wrong."
    ],
    "audience": [
      "Operations leads whose team retypes bookings, orders or new starter details from one system into another every week.",
      "Coordinators who know two tools well enough to say which fields matter and can reach the integration settings of at least one of them.",
      "Team managers who want to reduce double entry without buying a new system or commissioning a developer.",
      "Staff who have used a connector such as Power Automate or Zapier informally and want their connection to be tested, tightly scoped and handed over properly."
    ],
    "takeaways": [
      "You will be able to tell a handoff, where a person moves information between tools, from work within one tool, and choose the handoff that happens often and causes most trouble when it goes wrong.",
      "You will be able to write a field map that names the source of truth, a reliable identifier such as a customer or order number, the direction of flow, and a source for every field.",
      "You will be able to choose a built-in integration or an approved connector and mark each permission requested as access the connection needs or access it does not need.",
      "You will be able to test a connection on this week's real inputs, including a returning customer, a missing field and an unusual format, and judge each result rather than trusting a green tick.",
      "You will leave with a signed handoff map in five parts, including checks that name a role, a time and an action, and a count that catches records that never arrived."
    ],
    "benefits": [
      {
        "title": "Less time lost to double entry",
        "body": "The course helps you remove the retyping at the handoff where it costs your team most, using tools the organisation already has. Staff spend less time copying information and less time correcting the mistakes that copying causes."
      },
      {
        "title": "Connections scoped and owned properly",
        "body": "You grant only the access your field map uses and run the connection under an account that belongs to the team. That keeps the connection working when someone leaves and avoids a sales tool that can read the payroll."
      },
      {
        "title": "Failures found before customers notice",
        "body": "Your handoff map names the checks a person still makes, including a regular count that compares the two tools. Records that fail to cross, or cross wrongly, are caught by a named colleague at a set time."
      }
    ],
    "lessons": {
      "find-the-handoff": "This lesson defines a handoff as any point where a person moves information from one tool to another, and sets out when one is worth connecting first. You mark each step of real processes as a handoff or as work within one tool.",
      "what-moves-and-what-must-match": "This lesson explains the source of truth, the field map and the identifier that lets two tools recognise the same record. You edit an incomplete field map and then choose the one that names the source, the identifier, the direction and every field.",
      "connect-it": "This lesson covers choosing a built-in integration or an approved connector, reading what it actually moves, and deciding whose account it runs under. You read a permissions screen and mark each item as access the connection needs or does not need.",
      "run-this-weeks-inputs": "This lesson shows you how to test a connection safely on this week's real inputs, deliberately including the awkward cases where connections fail. You judge each test result as arrived as it should or needs a person, and record the cause.",
      "what-a-person-still-checks": "This lesson explains where a person must stay involved after a handoff is connected, and sets out the four parts of a check, including a count for records that never arrived. You repair a vague check so that a colleague could run it.",
      "judge-a-connection": "This course assessment recaps the five moves and shows how most real problems come from skipping one or trusting the wrong signal. You work through a new example and then apply the whole method to eight situations you have not seen before.",
      "your-handoff-map": "In this final lesson you write the handoff map for the real connection you built and tested, in five labelled parts, without real personal data. Each part is checked to see whether a colleague could take it over tomorrow, and then you sign it."
    }
  },
  "running-a-technology-rollout": {
    "overview": [
      "A technology rollout is the work of moving people from the way they do a task now to the way a new tool expects, such as a booking system, a shared drive, a sign-in process or a reporting tool. The tool has usually been chosen and the contract signed before a project lead is asked to run the rollout, and success is often defined as a go-live date and a training count, which says nothing about whether anyone now works differently. This course teaches project leads and managers to run a rollout that changes the work and lasts, with no project management qualification needed.",
      "You define success as a behaviour that can be seen in the work, put the groups in an order that lets each one learn from the last, give every group an owner, a helper and three dates, plan a support window followed by a visible stop to the old way, and decide in advance the evidence that the change has held. You finish with a signed one-page rollout sheet for one real tool that each group owner can read and act on without asking you."
    ],
    "audience": [
      "Project leads who have been asked to introduce a tool that someone else has already chosen and paid for.",
      "Operations managers rolling out a system across several sites or teams who want to avoid finding every problem on the same Monday.",
      "Team leaders who will be the owner of the change in their own group and want to know what that role involves.",
      "Managers who have seen a previous rollout declared finished at go-live while staff carried on with the paper book or the old spreadsheet."
    ],
    "takeaways": [
      "You will be able to write success as a behaviour you can see, saying who does what, when, and what will have disappeared, and tell it apart from an activity such as holding training sessions.",
      "You will be able to put a rollout in five steps that learn from each other, starting with a small first group that does the task every day and has a manager who wants the change.",
      "You will be able to give each group an owner inside the group, a named helper with a way to reach them, and calendar dates for the start, the stop and the check.",
      "You will be able to plan a support window with a back-up and a place for problems, followed by a visible stop to the old way that is announced at the start, and choose a sign it stuck rather than a sign it launched.",
      "You will leave with a signed one-page rollout sheet in five sections: the behaviour, the order of groups, who and when, support then stop, and the sign it stuck."
    ],
    "benefits": [
      {
        "title": "Problems found in one team first",
        "body": "Starting with a small first group means problems such as a jammed badge printer or a missing field are met at one site, while there is time to fix them. Later groups receive a tool that already works on real work."
      },
      {
        "title": "No second system left running",
        "body": "The course pairs a fixed support window with a stop to the old way that people can see, such as a spreadsheet made read-only. The organisation avoids data split between two systems and a new tool that only ever receives the easy cases."
      },
      {
        "title": "Evidence the change has held",
        "body": "You decide before the rollout begins what you will check in the work, and when, weeks after the support has ended. The strongest check compares the tool with an independent record, such as the dispatch log or the work schedule, rather than a login count."
      }
    ],
    "lessons": {
      "the-behaviour": "This lesson sets the definition of success for the whole rollout as a behaviour you can see in the work, rather than a go-live date or training count. You choose between success statements and mark sentences as a behaviour or only an activity.",
      "the-order-of-a-rollout": "This lesson explains why going everywhere at once finds every problem at once, and sets out five steps in which each group learns from the one before. You put the steps of a rollout in the order the lesson teaches.",
      "who-and-when": "This lesson shows why each group needs an owner inside the group, a named helper who is a person rather than a service desk, and three calendar dates. You mark group lines as ready to run or not ready and choose the complete one.",
      "support-then-stop": "This lesson plans the fixed support window for each group and the visible stop to the old way that follows it, announced from the first day. You edit a plan so that it names a helper, dates, a back-up, a place for problems and the stop.",
      "the-sign-it-stuck": "This lesson explains how to tell evidence that a rollout stuck from evidence that it merely launched, and why the check should come weeks after the stop. You mark measures such as login counts and sampled work as one kind or the other.",
      "the-rollout-assessment": "This course assessment brings the four modules together and shows the common pattern in which easily reported parts are detailed and decisive parts are vague. You then apply the method to eight situations you have not met in the course.",
      "your-rollout-sheet": "In this final lesson you write a one-page rollout sheet in five sections for a real tool you are rolling out now or soon. Each section is checked to see whether an owner could act on it as it stands, and then you sign it."
    }
  },
  "robotics-for-non-engineers": {
    "overview": [
      "An industrial robot is a machine that repeats programmed motions precisely and for long periods, provided the parts it handles arrive in the same place and the same way round each time. Most first conversations about robots begin with a supplier's demonstration of the normal case and end with a decision that nobody can defend, because the steps that vary, the exceptions, and the unproven claims were never written down.",
      "This course teaches a manager with no engineering background to describe one process they own in plain terms, separate what is shown on their own parts from what a supplier has only claimed, and name the exception that decides the case. You finish with a one-page go or not-yet brief that states the decision, its reason, who owns the stop, and the evidence that would change it."
    ],
    "audience": [
      "Operations and site managers who have been asked whether a robot could take over part of a process they run and want to answer from the facts of that process.",
      "Planners and team leaders who know a task step by step and need a shared way to describe what repeats and what varies before anyone talks to a supplier.",
      "Finance partners who are asked to support a feasibility study or a trial and want a short written case that shows what has been proven and what has not.",
      "Managers who have seen an impressive supplier demonstration and need a disciplined way to test it against their own parts, volumes, and exceptions."
    ],
    "takeaways": [
      "You will be able to break a task into single steps and mark each one as a step that repeats or a step that varies.",
      "You will be able to test a step against three conditions, namely that it repeats, happens often enough to matter, and receives the part in a known place and orientation, before calling it a candidate for a robot.",
      "You will be able to separate what has been shown on your own parts from what a supplier has claimed, so that nobody else's figure ends up in your plan.",
      "You will be able to write each exception with what it is, how often it happens or that it is not yet measured, and which role handles it today.",
      "You will leave with a signed one-page brief that ends in go or not yet, names who owns the stop, and states the evidence that would change the decision."
    ],
    "benefits": [
      {
        "title": "A decision your finance partner can check",
        "body": "The brief states its reason in the terms of the process, so a finance partner or operations director can test it before any money is spent on a study or a trial. A go means the case justifies the next paid stage, and a not yet names the specific work that would close it."
      },
      {
        "title": "Supplier claims kept in their place",
        "body": "You learn to read a trade show pick rate or a laboratory run as a claim about the supplier's parts in the supplier's conditions. Your organisation then asks for evidence on its own parts instead of building a spreadsheet on a figure nobody can trace."
      },
      {
        "title": "Exceptions found before purchase",
        "body": "The course makes you write down the damaged cartons, missing labels, and mixed bins that people handle without noticing today. Finding them before the equipment is bought prevents the common outcome in which the robot is blamed for problems that were always there."
      }
    ],
    "lessons": {
      "what-a-robot-does": "This lesson explains what an industrial robot actually does and gives you the two words the whole course relies on, repeats and varies. You read a description of the end of a packing line, then mark each sentence of a new goods-in task as a step that repeats or a step that varies.",
      "what-it-could-take": "This lesson sets out the three conditions a step must meet before it is a candidate for a robot, and explains why the step people dislike most is often the wrong choice. You sort steps on a moulding machine and then choose which of two laboratory steps a robot could realistically take.",
      "what-it-cannot-do": "This lesson covers the predictable limits of ordinary industrial robots, such as soft or tangled parts and frequent product changes, and the difference between a supplier's demonstration and evidence on your own parts. You read a supplier's email and then mark each claim as shown on your parts or claimed but not yet shown.",
      "the-exception": "This lesson shows that exceptions do not disappear when a robot takes the normal case, and that they often decide whether the project succeeds. You learn to record what each exception is, how often it happens, and who handles it, then edit a warehouse process note so its exception carries all three facts.",
      "go-or-not-yet": "This lesson defines what a go and a not yet mean, the four things a go requires, and why a decision without a reason in the terms of the process cannot be checked. You compare two decisions about the same palletising step, then choose the stronger decision about robot loading for a lathe.",
      "course-assessment": "This lesson recaps the whole method in order and works one mixed example on a box-folding line so you can see every move applied together. You then judge six situations from workplaces you have not met in the course, and you need five correct answers to pass.",
      "the-brief": "This final lesson explains the nine parts of the go or not-yet brief and the test each part must pass, which is whether a colleague could act on it without asking you. You write the brief for a process you own, and once you sign it, it becomes your record."
    }
  },
  "collaborative-robots-at-work": {
    "overview": [
      "A collaborative robot, usually called a cobot, is a robot arm designed to share a working space with people under certain conditions, because it limits its speed and force and stops when it meets unexpected resistance. Whether it is safe to work beside depends on the whole task, including the tool, the part, and where people stand, and most everyday problems arise at the start of a shift, at a stop, during a recovery, or at handover.",
      "This course teaches the order and the reasons behind a good start, the right stop for each situation, and a recovery that finds the cause before the reset, together with a clear line on when to call a person. You finish with a four-part shift handover note that the next shift can act on without having to find you."
    ],
    "audience": [
      "Operators who work alongside a cobot, or are about to, and have completed their site induction and been shown their own robot by someone their employer has authorised.",
      "Team leaders who brief shifts on a cobot cell and want every operator to start, stop, and recover it in the same order for the same reasons.",
      "Technicians who are called to cobot stops and want operators to hand over a clear account of what happened, what was cleared, and what keeps recurring.",
      "Supervisors whose handovers between shifts are thin and who want a note format that carries the robot's state, its stops, and what to watch."
    ],
    "takeaways": [
      "You will be able to explain why collaborative describes the whole application and not only the arm, and to give more weight to what makes the whole task safe to work near.",
      "You will be able to carry out the five-step start in the right order, beginning with the last handover and ending with a watched first cycle, and say why each step comes where it does.",
      "You will be able to choose between an emergency stop and a pause at the pendant according to the situation, and recognise a protective stop triggered by the robot or its safeguards.",
      "You will be able to recover from a protective stop by finding and clearing the cause and checking the path before the reset, and to recognise the repeating stop that should be handed to a person.",
      "You will leave with a signed shift handover note that records the robot's state, each stop and its cause, what was recovered or called in, and what the next shift must watch."
    ],
    "benefits": [
      {
        "title": "The same routine on every shift",
        "body": "Operators learn one start, one choice of stop, and one recovery, each with its reason, so the cell is run the same way by every team. That consistency matters most on the day the night shift changed the gripper fingers or left a tray in the robot's path."
      },
      {
        "title": "Repeating problems reach the right person",
        "body": "The course draws a clear line between the stops an operator recovers and the ones that must be handed to a supervisor or engineer. A worn finger or loose fixture that causes four dropped parts an hour is then reported, instead of being recovered quietly eight times a shift."
      },
      {
        "title": "Handovers the next shift can use",
        "body": "The handover note gives the next operator the facts they need to start well, including stop times, causes, and anything still unknown. Your organisation gains a written trail of stops and causes that engineers and supervisors can read the following morning."
      }
    ],
    "lessons": {
      "what-it-is-for": "This lesson explains what a collaborative robot is and why the word describes the whole task, including the tool, the part, and where people work, rather than the arm alone. You read a team leader's shift briefing, then mark statements about a jar-packing cobot as about the arm or about the whole task.",
      "start-drill": "This lesson teaches the five steps of a good start, from reading the last handover to watching the first cycle, and explains why each step protects the next. You compare the same operator's start on two mornings, then put the start steps for a palletising cobot into the correct order.",
      "stop-drill": "This lesson separates the emergency stop, meant for danger to a person or serious damage, from the routine pause at the pendant, and introduces the protective stop the robot triggers itself. You review two stops from one week, then mark which stop you would use in each situation at a labelling cobot.",
      "recover-drill": "This lesson teaches the five steps of a recovery after a protective stop and explains why resetting first leads to repeated stops or motion while the cause is still in the path. You improve a poor recovery log from a test rig, then order the recovery steps for a gripper that lost its part.",
      "when-to-call-a-person": "This lesson draws the line between stops you recover yourself and those you hand to a supervisor or engineer, and explains why a repeating stop matters more than any single one. You read three notes from one night shift, then mark each problem at a machine-tending cobot as recover it myself or call a person.",
      "course-assessment": "This lesson recaps the five moves and shows how they depend on one another, then works through one complete shift at a packing cell. You then apply the method to eight new situations at cobot cells, with feedback on every option, and you need six correct answers to pass.",
      "the-handover": "This final lesson sets out the four parts of a handover note and the test it must pass, which is whether the next shift could start from it without finding you. You compare a thin note with a useful one, then write and sign a handover note for your own cobot."
    }
  },
  "where-a-robot-belongs-in-the-process": {
    "overview": [
      "Deciding where automation belongs in a process means looking at the individual tasks inside it, each one a single action on a single object, rather than at stages such as goods in or assembly. When the decision is made at the level of stages, or from a desk and from memory, the tasks that look simple but carry hidden checks are the ones that get automated and then fail.",
      "This course teaches you to split a process into tasks from what people actually do, record four observable facts about each task, and mark each one Robot, Person, or Not yet with a reason drawn from those facts. You finish with a five-part recommendation that a colleague could challenge and you could defend, covering the task you recommend, the easy step that is not, the knock-on effect, and the evidence still needed."
    ],
    "audience": [
      "Process owners who have been asked where automation should go in a process they run and want an answer that rests on observations rather than opinion.",
      "Continuous improvement and operations engineers who need a consistent way to compare tasks across a line before a supplier is invited in.",
      "Production managers who have seen a robot fail on a task that looked easy and want to find the hidden work in a task before it is marked for a machine.",
      "Managers with no process mapping training who can watch a process or talk to the people who do it and need a method they can apply the same week."
    ],
    "takeaways": [
      "You will be able to write a process as a numbered list of tasks, each one action on one object with a clear start and end, and split any stage you find.",
      "You will be able to record four facts for each task, which are how often it happens, how much it varies, how the part arrives, and what judgement it needs.",
      "You will be able to mark each task Robot, Person, or Not yet with a reason that refers to those facts and that someone else can check.",
      "You will be able to find the hidden work in a step that looks simple, such as the quiet check a packer makes, and describe what automating one task does to the tasks before and after it and to the person who does it now.",
      "You will leave with a signed recommendation that states where, if anywhere, a robot belongs in one process you own and what evidence is still needed."
    ],
    "benefits": [
      {
        "title": "Automation aimed at the right task",
        "body": "Every mark on the task list carries a reason from four observed facts, so the recommendation points at a task a robot could reasonably take as the process stands. Uncertain tasks are marked Not yet instead of being forced into a yes or a no, which keeps near misses visible for later."
      },
      {
        "title": "Hidden checks found in advance",
        "body": "You learn to watch for the cracked part put aside or the damp box mentioned to a supervisor, which no procedure records. Finding that work before automation protects your organisation from defects that would otherwise travel further down the process."
      },
      {
        "title": "Knock-on costs written into the case",
        "body": "The recommendation records how the task before must present parts, where exceptions will go, and how the operator's job will change. Those costs then belong to the design and the budget from the start, rather than surfacing after installation."
      }
    ],
    "lessons": {
      "split-into-tasks": "This lesson defines a task as one action on one object with a clear start and end, and shows why lists written at a desk become stages that cannot be judged. You sort lines into tasks and stages, then choose which of two changeover lists for a bottling line is written at task level.",
      "four-facts": "This lesson introduces the four facts every task needs, which are how often, how much it varies, how the part arrives, and what judgement it needs, and explains why they must be observations. You build a task record for a test fixture, then edit a dispatch record to add the missing fact.",
      "robot-person-or-not-yet": "This lesson explains the three marks, Robot, Person, and Not yet, and why every mark must carry a reason drawn from the four facts. You judge whether reasons rest on facts or opinion, then mark four bakery packing tasks correctly using the facts provided for each.",
      "the-easy-step-that-is-not": "This lesson shows how a task that looks simple can hide judgement, such as a person quietly setting aside a cracked part, or involve a part that is hard for a machine to handle. You separate visible motion from hidden work, then choose the assessment that finds the hidden work in a cable loom step.",
      "the-knock-on-effect": "This lesson explains how automating one task changes the task before it, the task after it, where exceptions go, and the work of the person who did it. You read a knock-on note for a test fixture, then mark each sentence about a jar-casing robot as staying within the task or changing a neighbour.",
      "judge-a-process": "This lesson recaps the whole method from splitting tasks to writing the knock-on effect and works one mixed example on goods in at a hardware warehouse. You then apply the method to eight processes you have not seen, and you need six correct answers to pass.",
      "the-recommendation": "This final lesson sets out the five parts of the recommendation, how each part is written, and how each is checked for a trace back to the facts you gathered. You write it for a process you own and sign it as your record, which is not an engineering, safety, or financial approval."
    }
  },
  "preparing-a-team-for-automation": {
    "overview": [
      "When a robot or other automation arrives, the work of many people changes, including some who never touch the equipment, such as maintenance technicians, shift planners, and the team upstream. Preparation often goes wrong because the list of affected people is written from memory, training attendance is mistaken for ability, and managers either avoid saying what will stop or promise things that have not been decided.",
      "This course teaches you to list everyone affected, write what each group must be able to do as something a supervisor could watch, name what stops in plain words, and separate what is decided from what is not. You finish with a five-part preparation brief that a colleague could use to run the change if you were away."
    ],
    "audience": [
      "Team leaders whose team will work with a new robot, conveyor, or other automation and who need to prepare every shift for the change.",
      "Operations managers who know which automation is coming, roughly when, and which process it touches, and who are accountable for how the first weeks go.",
      "HR and learning partners who support a change programme and want preparation built on observable capabilities rather than a training calendar.",
      "Managers who must speak to a worried team about automation and want to be honest about what is decided and what is not."
    ],
    "takeaways": [
      "You will be able to list the groups directly affected by an automation, the groups indirectly affected, and the people who believe they are affected.",
      "You will be able to write capability statements, such as starting the palletiser in the order on the shift card, that a supervisor could watch and judge.",
      "You will be able to name in plain words the tasks and routines that stop, without hinting at decisions about roles that have not been made.",
      "You will be able to write a message to the team that says what is decided, what is not, and when people will know and who will tell them.",
      "You will leave with a signed preparation brief that includes a first-weeks plan with a named person and date for each group, covering nights, maintenance, and who to call after the supplier leaves."
    ],
    "benefits": [
      {
        "title": "Nobody affected is left off",
        "body": "The course makes you include indirectly affected groups such as maintenance, planners, and night shifts, which are the groups most often missed. Gaps in the list are found before go-live rather than on the first morning, when someone in one of those groups is left without support."
      },
      {
        "title": "Trust kept through honest messages",
        "body": "You learn to avoid the kind reassurance that turns into a broken promise when shift patterns or grades are later decided differently. A message that says what is not yet decided, and when people will hear, gives the team something to rely on."
      },
      {
        "title": "Evidence that people can do the work",
        "body": "The first-weeks plan names who will watch each group carry out each capability and by what date. Your organisation then knows who can clear a jam or isolate the cell, instead of knowing only who attended a training session."
      }
    ],
    "lessons": {
      "who-is-affected": "This lesson distinguishes people directly affected by an automation, whose daily tasks change, from those indirectly affected, and explains why people who believe they are affected also need recording. You see how walking the flow at a distribution site changes a first list, then mark groups for a factory palletiser correctly.",
      "what-they-must-do": "This lesson explains what a capability statement is, something a supervisor could watch and judge, and why understanding the robot or attending training does not qualify. You see a vague draft for pickers rewritten, then mark statements for maintenance technicians as something you can watch or not yet something you can watch.",
      "what-stops": "This lesson explains why every automation stops tasks and routines, why people notice whether or not they are told, and how naming what stops differs from hinting at job losses. You compare two drafts for a packing team, then choose the paragraph that says plainly what will stop.",
      "what-you-will-not-pretend": "This lesson separates what has been decided by people with authority from what is still open, and explains why well-meant promises about undecided matters do lasting damage. You see a team leader's message corrected after checking with the project and HR, then mark each sentence of a welding cell message.",
      "the-first-weeks": "This lesson turns capabilities into a first-weeks plan with a practice date, a person who watches, and a call route for each group, and shows why a training calendar is not enough. You compare two palletiser plans, then edit an inspection system plan to cover the night shift and the period after the supplier leaves.",
      "course-assessment": "This lesson brings the five moves together, works one change at a laundry through all of them, and explains how the assessment is set. You then answer eight situations you have not met before, each with feedback on every option, and you need six correct answers to pass.",
      "the-preparation-brief": "This final lesson explains the five parts of the preparation brief and how each part is checked, using a distribution site brief as a model. You write the brief for a real change your team is facing, so a colleague could prepare the team from it, and sign it as your record."
    }
  },
  "warehouse-and-logistics-automation": {
    "overview": [
      "Warehouse automation covers equipment such as conveyors, sorters, mobile robots, automated storage, and robotic picking, and each system is sized to the volumes and goods it is told about. Proposals often go wrong because the site describes the part that hurts most instead of one complete path of goods, treats supplier estimates as measurements, and leaves out the goods the system will not handle and the day it stops.",
      "This course teaches you to follow one goods flow from arrival to dispatch, mark where the unit of handling changes, and label every figure as measured or assumed. You finish with a six-part, one-page map that shows where automation would pay, what it would leave for people, and where it would make the flow worse, ready to put in front of a supplier."
    ],
    "audience": [
      "Warehouse managers who are being asked about conveyors, sortation, mobile robots, or automated storage and want to answer from one flow they know well.",
      "Logistics and supply chain leads who need to brief suppliers with figures they can stand behind and a clear statement of what is still assumed.",
      "Operations analysts who can pull volumes from the warehouse management system and want to turn them into a case that separates measured peaks from guesses.",
      "Managers preparing for a supplier meeting who want the supplier to respond to their own flow rather than to a brochure."
    ],
    "takeaways": [
      "You will be able to narrow a whole site to one goods flow and mark each point where the unit of handling changes, for example from pallet to case to single item to parcel.",
      "You will be able to label every figure as measured, with its record and period, or assumed, and to give the peak the attention it needs.",
      "You will be able to identify the step where steady volume, uniform units, and travel come together, and check whether it is the step that constrains the flow.",
      "You will be able to read a supplier proposal for the pile of goods it leaves to people and to write a fallback that says what people would do when the system is down or overloaded.",
      "You will leave with a signed one-page goods flow map that a colleague could put in front of a supplier and expect an answer to."
    ],
    "benefits": [
      {
        "title": "Systems sized to your real volumes",
        "body": "Because every figure on the map carries its source and period, a supplier sizes the system to your measured volumes and peak rather than to an estimate. Your organisation avoids buying equipment that copes on an average day and falls behind in the weeks that matter most."
      },
      {
        "title": "Investment aimed at the constraint",
        "body": "The course teaches you to choose the step where volume, uniformity, and travel meet, instead of the step where complaints are loudest. Money then goes to the step that actually limits dispatch, rather than moving a queue from one place to another."
      },
      {
        "title": "Exceptions and outages planned for",
        "body": "The map names the oversized, bagged, damaged, and unlabelled goods the system will leave for people, and it gives every risk a fallback. Those answers are then designed and priced before the contract is signed, when changes are still cheap."
      }
    ],
    "lessons": {
      "one-goods-flow": "This lesson defines a goods flow as the path one kind of goods takes from arrival to dispatch and explains why the points where the unit of handling changes matter most. You see a distribution centre manager narrow her site to one flow, then choose the description of a depot that follows a single path.",
      "measured-or-assumed": "This lesson explains why every system is sized to a volume and how to label each figure as measured, from a named record over a known period, or assumed, with particular care for the peak. You see a manager's rough figures marked, then label the figures for a parcel sortation flow.",
      "where-it-pays": "This lesson sets out the three conditions under which warehouse automation tends to pay, which are steady volume, uniform units, and travel, and explains why the step that pays is usually the constraint. You weigh two candidate steps, then choose where automation would pay for a clothing retailer.",
      "the-pile-it-will-not-touch": "This lesson shows that every system has goods outside its range, such as oversized items, soft bags, and unreadable labels, and that the pile left behind needs space and labour. You read a goods-to-person proposal for its pile, then mark sentences from a parcel sortation proposal as handled by the system or left for people.",
      "where-it-makes-it-worse": "This lesson explains four ways a working system can make a flow worse, including rigidity at peak, and what a fallback must say about how goods keep moving. You see risks added to a goods-to-person option, then edit a mobile robot note so its fallback says what people would do.",
      "course-assessment": "This lesson sets out the five moves in one place, shows how each move tests the others, and works one mixed case from a pet supplies warehouse. You then apply the method to seven situations from warehouses and transport operations, and you need six correct answers to pass.",
      "the-map": "This final lesson brings the method together into a one-page map in six parts and explains the test for each line, which is whether a supplier would have to answer it with a figure, a place, or a commitment. You write the map for a flow on your site and sign it."
    }
  },
  "specifying-a-robotics-project": {
    "overview": [
      "A specification for a robot cell is the document that tells suppliers and integrators what the cell must achieve before they propose how to build it. When it lists equipment instead of outcomes, gives only an average rate, names no owners, and uses phrases such as up to or typically, a supplier can deliver exactly what was asked for and still hand over a cell that does not meet the need.",
      "This course teaches you to write outcomes a supplier must achieve, give each one an acceptance condition, describe volume and exceptions truthfully, name who owns each kind of stop, and remove wording that commits nobody. You finish with a one-page specification that a supplier must answer line by line and could be held to at acceptance."
    ],
    "audience": [
      "Engineering managers who write or approve the specification for a robot cell before it goes out to suppliers or integrators.",
      "Project leads who already know the process to be automated and the business reason for it and need a specification that protects the project at handover.",
      "Procurement professionals who compare supplier responses and want every line of the specification to be something a supplier must answer.",
      "Operations managers who will own the cell after handover and want the stops, restarts, and responsibility for the complete cell settled before the order is placed."
    ],
    "takeaways": [
      "You will be able to state what the cell must achieve, such as good parts per hour, changeover time, and the part numbers it must handle, instead of naming equipment, and to record any fixed equipment as a constraint with its reason.",
      "You will be able to write an acceptance condition with all four parts, which are the test, your own parts, a duration or quantity, and a pass mark, for factory and site acceptance.",
      "You will be able to describe volume as a range with a peak and to list exceptions with how often they occur, or not yet measured, together with a commitment to supply samples.",
      "You will be able to name an owner for each stop, restart, change, and call-out, and for the complete cell, and to find the phrases in a draft or a proposal that a vendor could hide behind.",
      "You will leave with a signed one-page specification, with a dated wording check, ready to attach to your organisation's contract process."
    ],
    "benefits": [
      {
        "title": "Risk stays with the supplier",
        "body": "When the specification states outcomes and leaves the equipment to the supplier, the supplier is responsible for making those outcomes true. A cell that cannot keep up with your lathes is then the supplier's problem to solve, not a shortfall you specified into the order."
      },
      {
        "title": "Acceptance you can actually test",
        "body": "Each outcome carries a test on your own parts, for a set duration, with a pass mark agreed before the order is placed. Your organisation signs off the cell on its worst parts and a real production run instead of a demonstration chosen by the supplier on the day."
      },
      {
        "title": "Clear ownership of every stop",
        "body": "The specification names who restarts the cell, who authorises changes, who answers a call-out, and who is responsible for the assembled cell as a whole. Those questions are settled while the order is still being negotiated, rather than argued over after the first stop."
      }
    ],
    "lessons": {
      "outcomes-not-equipment": "This lesson explains the difference between an outcome, what must be true when the cell runs, and an equipment choice, and why that difference decides who carries the risk. You see a machine-tending brief rewritten as outcomes, then mark sentences from a case-packing specification as outcome or equipment choice.",
      "how-it-will-be-measured": "This lesson explains what an acceptance condition is, how factory and site acceptance tests differ, and why a supplier's demonstration is no basis for sign-off. You see an output target given a full test, then choose the welding cell acceptance clause a supplier could not argue with afterwards.",
      "volume-and-exceptions": "This lesson shows why suppliers design to the numbers they are given and how to describe volume as a range with a peak, variation in the parts as made, and exceptions with their frequency. You see a volume section rewritten, then edit a tray-destacking section so the supplier cannot say they were not told.",
      "who-owns-the-stop": "This lesson explains that every cell stops and that an assembled cell is a machine in its own right, so each stop, restart, change, and call-out needs a named owner. You see a responsibilities section rewritten, then mark sentences for a palletising cell as naming an owner or leaving it open.",
      "where-a-vendor-can-hide": "This lesson identifies phrases such as up to, typically, and subject to part quality that commit nobody, and shows that they appear in buyers' drafts as often as in proposals. You see a supplier's sentences rewritten as conditions of order, then mark sentences from a bin-picking proposal.",
      "course-assessment": "This lesson recaps the five moves, shows how each depends on the one before, and reviews a mixed extract from a plastics moulding specification. You then judge six situations set in the weeks before a robotics order is placed, and you need five correct answers to continue to the final lesson.",
      "the-specification": "This final lesson brings the course together into a one-page specification in six parts and explains what the page is and is not, including that it does not replace the contract. You write the specification for a real or planned project and sign it as the work your record shows."
    }
  },
  "robotics-safety-and-risk": {
    "overview": [
      "An industrial robot can move quickly, carry a heavy tool, and exert far more force than a person can resist, and a robot that has paused can look exactly like one that has stopped for good. Managers who walk areas with robots are often not robot safety specialists, so they may not know how a cell is meant to protect people, what a defeated safeguard looks like, or which findings cannot wait until the next review.",
      "This course gives you the words to describe how a cell protects people, tell an emergency stop from a protective stop, and recognise a safeguard that has been bypassed or worked around. You finish with a five-part floor walk note that records what you saw, what you asked and were shown, and what you escalated the same day, to whom, and when."
    ],
    "audience": [
      "Managers who walk production or warehouse areas with robots and want to know what to look at and what to ask while they are there.",
      "Supervisors who are responsible for an area with robot cells and need a clear line between what is escalated before the end of the shift and what goes to the review.",
      "Health and safety coordinators who are not robot specialists and want a shared vocabulary with the cell leaders and engineers they work with.",
      "Directors who carry out leadership walks and want their questions to show how a cell really runs rather than invite a reassuring yes."
    ],
    "takeaways": [
      "You will be able to describe each protective measure in a cell as one that keeps the person out, such as fencing and interlocked gates, or one that lets the person in with a limit.",
      "You will be able to tell an emergency stop, chosen by a person because of danger, from a protective stop made automatically by a safeguard, and to read a pattern of stops in the same place.",
      "You will be able to recognise the common signs of a defeated safeguard, such as a spare key left in a gate interlock or a switch held with tape, without testing the safeguard yourself.",
      "You will be able to ask floor walk questions that get you shown how the cell runs and what last happened, and to sort each finding into escalate today or raise at the review.",
      "You will leave with a signed floor walk note that names the cell, how it protects people, what you were shown, and what you escalated to named people at a stated time."
    ],
    "benefits": [
      {
        "title": "Serious findings raised the same day",
        "body": "The course sets a clear standard for escalation, which is telling the person responsible for the area and the site safety contact before the end of the shift and recording who and when. A defeated safeguard found at quarter to two is then dealt with that afternoon rather than in an email nobody reads until morning."
      },
      {
        "title": "Floor walks that find real conditions",
        "body": "You learn to ask to be shown what stops the robot and what happened at the last unexpected stop, and to explain that the walk is not an inspection. Operators then show you how the cell actually runs, which is what leadership walks are meant to reveal."
      },
      {
        "title": "Written records without false assurance",
        "body": "The floor walk note records what you saw, asked, and did, and it never states that a cell is safe or meets a regulation. Your organisation gains a clear written trail of findings and owners without managers signing off matters they are not competent to judge."
      }
    ],
    "lessons": {
      "shared-space": "This lesson explains why a robot has to be kept apart from people and gives you two labels for how a cell protects them, keeps the person out or lets the person in with a limit. You read a welding cell leader's description, then label the protections around a mobile robot and a palletiser.",
      "stops-and-zones": "This lesson separates the emergency stop a person chooses from the protective stop a safeguard makes automatically, explains warning and protective zones, and shows what a pattern of stops can tell you. You read ten minutes of observation beside a mobile robot, then mark events at a cell by the kind of stop.",
      "a-defeated-safeguard": "This lesson explains what it means for a safeguard to be defeated, the signs that look the same from site to site, and why safeguards get defeated when they interrupt production. You read a manager's notes from a packaging cell, then mark observations at a machine-tending cell as a safeguard working or defeated.",
      "the-floor-walk": "This lesson explains what a floor walk is and is not, and why questions that ask to be shown, and ask what actually happened, reveal far more than questions inviting a yes. You compare what two managers learned from the same cell, then choose the stronger question set for a palletiser walk.",
      "same-day-escalation": "This lesson defines escalating today, when to stop a machine first, what goes to the review with a named owner, and who decides whether an event must be reported under RIDDOR. You see a manager sort her findings, then mark findings from an assembly line walk as escalate today or raise at the review.",
      "course-assessment": "This lesson recaps the whole method as a single floor walk, from describing protection to recording and escalating findings, and works one mixed example at a cobot sanding station. You then answer seven new situations, and you need six correct answers to pass.",
      "the-floor-walk-note": "This final lesson explains what the floor walk note records, why it must never claim that a cell is safe, and how to write each of its five parts well. You write the note for one robot cell you have walked or will walk, and sign it as your record."
    }
  },
  "running-a-robotic-cell": {
    "overview": [
      "A guarded industrial robot cell, whether it welds, tends a machine, palletises, or assembles, depends on the operator to start it in the right state, notice when its readings move away from normal, and recover or escalate its stops correctly. Many problems begin when a cell is started before the log is read, when normal exists only in someone's head, or when the same stop is recovered again and again without anyone being told.",
      "This course teaches a start of shift in which each step protects the next, a written normal in numbers and observations, the recovery order, and the triggers for escalation. You finish with a signed one-page shift card for your own cell, covering the start, normal, recovery, escalation, handover, and the site procedure it belongs to."
    ],
    "audience": [
      "Operators who run a guarded robot cell during a shift and have already been authorised by their employer and shown its controls and site procedures.",
      "Cell leaders who want every shift to start, recover, and hand over the cell in the same order and to spot drift before it becomes a stop.",
      "New technicians who need a clear picture of what normal looks like for a cell and when a stop should be passed to an engineer.",
      "Supervisors who find that log entries such as sorted it leave the next shift without the facts they need."
    ],
    "takeaways": [
      "You will be able to carry out a start of shift that reads the log first and checks the guarding, emergency stops, consumables, program, and first part before anything relies on them.",
      "You will be able to write what normal looks like for your cell as ranges, such as cycle time and stops per shift with their usual causes, together with things you would see or hear.",
      "You will be able to compare each reading with written normal and recognise drift by its direction and repetition, before it causes a stop.",
      "You will be able to recover an ordinary stop in the correct order and to recognise the triggers, such as a repeated stop or a needed change to the program, that mean you escalate instead.",
      "You will leave with a signed shift card for one cell and the ability to write log entries that give the time, what happened, what was done, and the state of the cell."
    ],
    "benefits": [
      {
        "title": "Problems caught before the stop",
        "body": "A written normal lets anyone on the shift see a cycle time creeping up or a stop returning more often each hour. Your organisation acts while there is still time, before scrap is made, tooling is damaged, or someone has a near miss."
      },
      {
        "title": "Repeated faults reach an engineer",
        "body": "The shift card sets the number of repeats after which the operator stops recovering and calls for help. Engineers then receive a clear pattern to work from instead of discovering a problem that was quietly reset many times."
      },
      {
        "title": "Every shift starts the same way",
        "body": "The card puts the start, recovery, and handover in one order for one cell, so a new operator who has been shown the cell can follow it. Log entries written to the course standard mean the next shift can carry on without having to phone the last one."
      }
    ],
    "lessons": {
      "start-of-shift": "This lesson explains what the start of shift is for and the order in which each step protects the next, from reading the log to checking the first part, and why it is never the time to change settings. You compare two welding cell starts, then order the start for a machine-tending cell.",
      "what-normal-looks-like": "This lesson shows how to write normal for your cell as ranges and observations, such as cycle time, stops per shift and their causes, and the sound of the cell, and where those figures come from. You rewrite a vague description, then choose the one a new operator could use.",
      "drift": "This lesson defines drift as a steady move away from normal that has not yet caused a stop, and explains how direction and repetition separate it from a single odd reading. You read mid-shift readings from a palletising cell, then mark each reading on a welding cell as normal or drift worth noting.",
      "recover-then-escalate": "This lesson sets out the recovery order for an ordinary stop and the triggers that mean you escalate instead, such as a repeated stop or a needed change to the program. You read a log of repeated gripper stops, then order the recovery steps for a palletising cell.",
      "the-log-entry": "This lesson explains what a log entry must contain, which is the time, what happened, what was done, and the state of the cell, and why feelings and phrases such as sorted it help nobody. You compare two entries about the same stop, then choose the scanner stop entry the next shift could act on.",
      "running-the-whole-shift": "This lesson recaps the four parts of a shift and shows how the log, the written normal, and the repeat limit depend on one another, using one morning on a spot-welding cell. You then apply the method to six new situations, and you need five correct answers to pass.",
      "the-shift-card": "This final lesson sets out the six parts of the shift card and explains that it sits beside the site procedure without replacing it or authorising anyone to operate the cell. You write the card for a cell you run or will run, and sign it as your record."
    }
  },
  "vision-systems-and-automated-inspection": {
    "overview": [
      "A vision inspection system photographs each part under set lighting, measures the features it has been configured to find, and compares each measurement with a threshold to decide pass or fail. Once a camera is installed, people tend to assume it checks everything an inspector used to check by eye, and the system can lose its ability to detect defects through a dimmed lamp, a dusty lens, or a knocked camera while its reject rate appears to improve.",
      "This course teaches you to state exactly what a system judges and what it does not, to understand the two ways it can be wrong, and to prove at set times that it can still see. You finish with a five-part inspection brief, including a challenge test and the checks a person must still make, that a colleague or an auditor could use to run or audit the system."
    ],
    "audience": [
      "Quality engineers who are responsible for a camera-based inspection station and need to explain what it measures and how its threshold is controlled.",
      "Quality managers who read monthly reject figures and need to tell a genuine process improvement from a system that has partly stopped detecting defects.",
      "Production managers who receive complaints about good parts being rejected and want to respond without quietly letting bad parts through.",
      "Inspection team leaders whose work has changed since a camera was installed and who need to know which checks remain with their team."
    ],
    "takeaways": [
      "You will be able to read a setup sheet and separate the features a system measures from the judgements people assume it makes but it does not.",
      "You will be able to tell a false reject, a good part the system fails, from a false accept, a bad part it passes, and explain what moving the threshold trades between them.",
      "You will be able to treat a falling reject rate as a question to test and name the ordinary causes of quiet failure at a station, such as lighting, dust, and camera position.",
      "You will be able to write a challenge test that runs known-bad parts at the start of each shift and after any change, is recorded, and holds output and informs the quality owner if a part passes.",
      "You will leave with a signed inspection brief that sets out what a person still checks, including audits of accepted parts and reviews of the reject bin."
    ],
    "benefits": [
      {
        "title": "Defects are not quietly missed",
        "body": "A routine challenge test proves that the system still rejects the defects it is meant to find, especially after cleaning, a lamp change, or a tool change. Your organisation finds a partly blind camera on the line instead of through a customer complaint."
      },
      {
        "title": "Threshold changes under proper control",
        "body": "The brief names the role that may change the threshold and requires the reason to be recorded. Requests to loosen the threshold because of waste are then answered by finding out why good parts look bad to the camera, rather than by letting more bad parts through."
      },
      {
        "title": "A clear split of inspection work",
        "body": "The course divides the inspection between what the camera judges and what people still check, with a set frequency and record for each. Inspectors know which checks remain theirs, and nobody relies on the phrase the camera does that now for a check the system was never set up to make."
      }
    ],
    "lessons": {
      "what-the-camera-judges": "This lesson explains how a vision system answers only the questions it was configured to ask, and why people on the line come to assume it checks everything. You read a label station setup sheet, then mark statements about a cap inspection system as features it measures or judgements it does not make.",
      "two-ways-to-be-wrong": "This lesson explains false rejects and false accepts, why pressure to loosen the threshold always runs one way, and why a reject rate tells you nothing about false accepts. You read a quality engineer's reply to a request to open up a threshold, then mark events at a tablet line station.",
      "the-quiet-failure": "This lesson explains how a system can lose its ability to detect defects without an alarm, through ordinary causes such as a dimmed lamp or a knocked camera, and why a falling reject rate is a question. You read a monthly report, then choose the explanation that tests the system first.",
      "prove-it-can-still-see": "This lesson explains what a challenge test proves, how to build the set of known-bad parts, when the test runs, and what must happen if a challenge part passes. You see a start-of-shift check rewritten, then edit a seal camera test so it runs after changes and holds output on failure.",
      "the-human-check": "This lesson sets out the four things a person still checks when a vision system is in place, including auditing accepted parts and reviewing the reject bin, and explains why the human check is not a full re-inspection. You read a human check for a label station, then divide checks for a carton line.",
      "inspection-assessment": "This lesson recaps the method as five questions to ask of any vision system and shows how they arrive tangled together at a live station, using one weekly quality meeting. You then answer eight situations from stations you have not seen, and you need six correct answers to pass.",
      "the-inspection-brief": "This final lesson sets out the five parts of the inspection brief and the test each line must pass, which is whether an auditor could check it against the station. You write the brief for a system you rely on, keeping confidential detail out, and sign it as your record."
    }
  },
  "robotics-investment-decisions": {
    "overview": [
      "A capital request for robots or automation usually quotes a payback period, which is the cost of the investment divided by the yearly benefit, and asks a finance or investment committee to approve it. Weak requests open with a supplier's brand, count only the list price of the robot, assume the full saving from the first week, and rest much of the benefit on claims about people that have no plan behind them.",
      "This course teaches you to test a request against the measured process, the full cost of owning the system, a realistic ramp-up, and a plan for the people affected, and to agree a ninety-day review before the money is spent. You finish with a signed five-question review that records the answer to each question, or states plainly which questions remain unanswered."
    ],
    "audience": [
      "Finance directors and finance business partners who approve or challenge capital requests for robots and automation and understand payback and discounting.",
      "Operations directors who sponsor automation projects and want their requests to survive scrutiny from the board.",
      "Members of investment committees who need a consistent set of questions to ask of any robotics request, whatever the supplier.",
      "Owners of small and medium-sized manufacturers who are weighing a first robot cell and want to judge it on their own process rather than on the brand."
    ],
    "takeaways": [
      "You will be able to tell a measured process fact, with its measure, period, and source, from a statement about a brand or a hope, and to insist on a baseline before judging the money.",
      "You will be able to find the optimistic inputs in a payback case, including a missing cost of ownership such as integration, fixtures, guarding, and training, and the absence of a ramp-up.",
      "You will be able to separate claims about people that rest on a plan, saying who is affected, what happens, when, and who is responsible, from claims that do not.",
      "You will be able to ask five questions aimed at the process rather than the brand, and to write a ninety-day review into the approval with a date, an owner, a baseline, and a source.",
      "You will leave with a signed five-question review of one capital request that ends in support, support with conditions, or not yet."
    ],
    "benefits": [
      {
        "title": "Payback figures the cell can reach",
        "body": "The course shows you how to rebuild a payback on the full cost of owning the cell and a realistic ramp-up instead of the list price and a first-day saving. Your committee then approves a payback period the investment can achieve rather than one built on the right arithmetic and the wrong numbers."
      },
      {
        "title": "Meetings focused on your process",
        "body": "The five questions replace questions about the supplier's reputation with questions about your line, your exceptions, your people, and your figures. Suppliers and sponsors have to answer with facts about the request in front of you rather than with a reference site."
      },
      {
        "title": "A review agreed before approval",
        "body": "The ninety-day review is written into the approval with its measures, sources, and owner, so it cannot later be designed around the figures that look best. Your organisation learns whether the case was right while there is still time to correct the way the cell runs."
      }
    ],
    "lessons": {
      "start-with-the-process": "This lesson explains why a capital request must begin with the process it will change and what a baseline of measured figures, each with a period and a source, looks like. You see a welding request opening rewritten, then choose which of two packing requests starts with the process.",
      "payback-honestly": "This lesson explains what simple payback measures, the full cost of owning a robot cell, and why a benefit must be measured against the baseline and ramped up over time. You compare two payback cases for a welding cell, then choose the palletiser case you could defend to the board.",
      "people-in-the-case": "This lesson examines claims about people, such as roles saved or staff redeployed, the new work automation creates, and why consultation with HR matters, without giving legal advice. You mark claims from a warehouse case, then mark sentences from a machine-tending request as supported by a plan or claimed without one.",
      "five-questions": "This lesson sets out five questions aimed at the process rather than the brand, covering the baseline, the exceptions, the cost to own, the people, and the ninety-day measures. You rewrite a first draft of meeting questions, then choose the question for a vision inspection request that is aimed at the process.",
      "ninety-days-on": "This lesson explains what a post-investment review does, why ninety days after go-live is a useful first point, and why the review must be agreed when the investment is approved. You see a vague review line rewritten, then edit a palletiser review plan so it can actually be carried out.",
      "judging-a-whole-request": "This lesson recaps the method, shows how its parts depend on each other, and names the common patterns in weak requests, such as the brochure opening and the list-price payback. You read one sanding cell request with the whole method, then answer eight situations and need six correct to pass.",
      "the-five-question-review": "This final lesson explains how to write each of the five questions for a specific request, record the answer or not yet answered, and state your view with any conditions. You write the review for a real or recent capital request and sign it as your record, which is not financial advice or an approval."
    }
  },
  "ai-for-hr-and-people-teams": {
    "overview": [
      "Generative AI tools can produce a first draft of a policy guide, an interview invitation, or a summary of exit interview themes in seconds, and many HR teams now have one approved for everyday use. The difficulty is that HR work is full of decisions about named people and information that must never leave the organisation's systems, and a model will confidently add entitlements, dates, and services that no policy ever contained.",
      "This course teaches a practical method for deciding which tasks in your own week a model may draft, reading every draft against its source, and repairing a prompt so that held information never enters the tool. You finish with three reusable drafting briefs for your real work and a hold list of the information you will never paste, each line with a reason and an alternative."
    ],
    "audience": [
      "HR advisers and HR business partners who have been given an approved AI chat tool and want a clear rule for what they may use it for.",
      "People operations staff who draft the same letters, guides, and templates every week and want those drafts to stay within approved policy.",
      "HR generalists in small organisations who carry the whole people function and need a dependable way to keep employee data out of AI tools.",
      "Office managers who look after HR alongside other duties and are asked by colleagues whether a letter or summary can be drafted with AI."
    ],
    "takeaways": [
      "You will be able to sort any task in your week into Safe to draft or A person decides, using three tests about ownership, input, and whether the output decides anything about a worker.",
      "You will be able to read an AI draft one sentence at a time beside its source and find the number, right, or service the model added on its own.",
      "You will leave with three reusable briefs, a rewrite, a summary, and a template, each naming its source, its reader, its limit, and its owner.",
      "You will be able to repair a prompt that contains health, disciplinary, pay, or other held information so that the task still works without it.",
      "You will leave with a signed hold list that names the information you will never paste into an AI tool, why it is held, and what you will do instead."
    ],
    "benefits": [
      {
        "title": "Fewer letters that promise too much",
        "body": "The course trains you to find the sentence in a draft that states an entitlement, a timescale, or a service your policy never contained. That is the sentence an employee could rely on or quote back in a grievance, so catching it protects both the employee relationship and the organisation's position."
      },
      {
        "title": "Employee data stays out of the tool",
        "body": "You learn to recognise special category data, criminal offence data, and sensitive HR material such as grievance detail and individual pay, and to see why removing a name or using a pseudonym does not release it. Your hold list turns that into a rule you and your colleagues can follow when a manager is in a hurry."
      },
      {
        "title": "Decisions stay with accountable people",
        "body": "The course draws a clear line between drafting words and deciding something about a named worker, such as a shortlist, a grievance outcome, or the reason a contract ends. Your organisation gains HR staff who can use AI for the wording while every decision is still made and recorded by someone with the authority to make it."
      }
    ],
    "lessons": {
      "safe-to-draft": "This lesson gives you three tests that decide whether a task is safe for a model to draft or must be decided by a person, and shows why judging a task by its verb misleads people. You sort a real Monday task list and then a different team's week using the two labels.",
      "what-the-draft-cannot-know": "This lesson shows how a model fills gaps in your request with plausible policy detail, and why an invented number of days or rate of pay can become an entitlement in HR. You read drafts beside their source and mark each sentence as staying within the source or adding policy.",
      "three-patterns": "This lesson introduces the reusable brief, built from a source, a reader, a limit, and an owner, and the three patterns that cover most HR drafting: a rewrite, a summary, and a template. You check which parts a colleague's brief leaves out and choose the brief you would reuse.",
      "what-you-never-paste": "This lesson defines held information, covering special category data, criminal offence data, and sensitive HR material such as grievance detail and individual pay, and explains why removing a name is not enough. You mark each sentence of real manager prompts as Can go in or Hold.",
      "repair-the-prompt": "This lesson teaches three repairs for a prompt that contains held information, removing, generalising with placeholders, or moving the task out of the tool, followed by a limit that stops the model putting the detail back. You repair an absence prompt so the task survives and nothing held remains.",
      "course-assessment": "This lesson recaps every move in the course and works one mixed request from a site manager about ending agency workers' assignments. You then answer seven new situations from different HR teams, with feedback on each choice, and need six correct to pass.",
      "the-hold-list": "In this final lesson you write the artefact your record will show: three patterns taken from your own week and a hold list about the information that really crosses your desk. Each part is checked for substance, and you sign the finished work so a verifier can read it."
    }
  },
  "eu-ai-act-literacy-for-hr-and-l-and-d": {
    "overview": [
      "Article 4 of the EU AI Act asks organisations that provide or use AI systems to take measures to ensure a sufficient level of AI literacy among the people who deal with those systems on their behalf. HR and learning teams are often the first to be asked what the organisation is doing about it, and they are frequently working from a vendor's summary that claims far more than the text of the Article says.",
      "This course teaches you to read what Article 4 actually asks, to plan literacy measures that fit each role, system, and group of people affected, and to keep a record of what was done without claiming a legal status. You finish with a role map, a record outline, and a statement of what that evidence does not claim, written for your own organisation."
    ],
    "audience": [
      "L&D leads who have been asked to organise AI literacy training and want to plan measures that match what the Article says rather than what a supplier suggests.",
      "HR business partners who need to explain to senior leaders, in plain terms, what Article 4 requires and what it does not.",
      "People operations managers who must keep a record of training and measures that will stand up when someone asks what was done and for whom.",
      "HR generalists who know which AI tools colleagues use, or can find out from IT or procurement, and have been handed the question without legal training."
    ],
    "takeaways": [
      "You will be able to read a statement about Article 4 and say whether the text supports it, including common claims about mandatory exams, certificates, and fixed numbers of hours.",
      "You will be able to judge whether a literacy measure fits the context the Article describes, taking account of the system, its use, and the applicants or employees it affects.",
      "You will be able to write a complete role map row with a role, a system and use, the people affected, what the person must be able to do, a measure, an owner, and a review date.",
      "You will be able to tell a line of a training record that is evidence of a measure from one that makes a claim the record cannot support.",
      "You will leave with a signed role map and record outline, a statement of what the work does not claim, and a note of who answers legal questions about the Act."
    ],
    "benefits": [
      {
        "title": "An accurate reading of Article 4",
        "body": "You learn to separate what the Article says from what vendors and summaries attach to it, such as a required certificate or a set number of hours. Your organisation avoids buying the wrong training and avoids repeating claims that the text does not support."
      },
      {
        "title": "Measures fitted to each role",
        "body": "The course shows why a recruiter using a ranking feature needs a different measure from a payroll officer who uses no AI system at all. Your training budget goes to the roles and uses where the people affected, often applicants and employees, have the most at stake."
      },
      {
        "title": "Evidence that does not overclaim",
        "body": "You learn to write records and statements with verbs of action, saying what was identified, what was provided, and when it will be reviewed. That gives your board and works council honest evidence of the measures taken, and it leaves the question of how the Act applies with the legal adviser who should answer it."
      }
    ],
    "lessons": {
      "what-article-4-asks": "This lesson reads Article 4 and the description of AI literacy in Article 3, and sets out what the text asks of organisations and what it leaves out. You read a vendor's email against the text and mark each statement about the Article as In the text or Not in the text.",
      "the-context-sets-the-level": "This lesson explains why one level of AI literacy cannot fit every role, and how knowledge, context of use, and the people affected shape a sufficient measure. You compare measures for recruiters and learning designers, then choose the measure that fits a recruiter using a feature that ranks applications.",
      "the-role-map": "This lesson introduces the role map, a table with one row per role that uses an AI system, and its seven parts from the system and use to the review date. You learn to write what a person must be able to do as visible work, then complete an unfinished row.",
      "what-a-record-contains": "This lesson explains what a record of measures should hold, including who took part, which role map row it serves, what was provided, and when, and how to keep it with proper data protection care. You mark each line of a draft record as evidence or as an unsupported claim.",
      "what-you-will-not-claim": "This lesson addresses the most common harm in this area, a statement that claims a legal status the evidence cannot support, and shows how verbs of action keep a statement honest. You rewrite an intranet headline and mark sentences from a board paper as describing action or claiming status.",
      "course-assessment": "This lesson recaps the reading of the Article, the role map, the record, and the statement, then works one request to buy a supplier's course for three hundred warehouse staff. You answer seven new situations from HR and L&D work and need six correct to pass.",
      "your-role-map-and-record": "In this final lesson you write the artefact for your own organisation: three role map rows, a record outline, a statement of what the work does not claim, and who answers legal questions. Each part is checked for substance before you sign it for your record."
    }
  },
  "redesigning-workplace-learning": {
    "overview": [
      "Many workplace programmes are built as libraries of videos, documents, webinars, and quizzes, and people click through them to reach a completion mark without being able to do anything new at work. Adding more content to a programme that is not working usually makes the problem worse, because nobody is asked to do the work the programme exists to improve.",
      "This course teaches you to rebuild one real programme around a skill written as observable work, a realistic task that uses it, and a check that shows whether the person can do it. You finish with a one-page redesign sheet that records what you kept, cut, or moved, what the manager will see afterwards, and the first change you will make."
    ],
    "audience": [
      "Learning and development practitioners who own a programme with high completion rates and little evidence that anyone works differently afterwards.",
      "HR business partners with a learning brief who are asked by sponsors to build another module and want a better answer.",
      "Managers who own a programme their team is expected to complete and want it to produce work they can see and discuss.",
      "Programme owners without an instructional design qualification who need a clear, practical method for redesigning one programme at a time."
    ],
    "takeaways": [
      "You will be able to read any programme outline and tell the lines that describe content to consume from the lines that describe work the learner does.",
      "You will be able to rewrite a vague learning aim as a skill someone could watch, a realistic task drawn from real work, and a check with a standard another reviewer could apply.",
      "You will be able to tell a check that tests the task from a quiz that tests recall, and design one that two team leaders would judge the same way.",
      "You will be able to decide for every item in a programme whether to keep it, move it to reference, make it optional, or cut it, with a reason.",
      "You will leave with a signed redesign sheet for one real programme, including the manager view and the question for the next one-to-one."
    ],
    "benefits": [
      {
        "title": "Programmes that show real ability",
        "body": "Each redesigned programme ends with a check on a realistic task, so the organisation can see what people can do rather than what they have watched. Sponsors receive evidence of work instead of completion percentages and quiz scores."
      },
      {
        "title": "Shorter programmes people finish",
        "body": "The course gives you a single test for every piece of content: whether the learner needs it to complete the task or pass the check. Removing or moving the rest shortens the programme and puts the task at the centre, where people treat it as the reason for taking part."
      },
      {
        "title": "Managers who can follow up",
        "body": "You design a manager view that names the task, the state of the check, the work itself, and a question for the next one-to-one. That gives the manager something specific to discuss, which is the point at which learning most often turns into changed work."
      }
    ],
    "lessons": {
      "why-people-finish-nothing": "This lesson explains why programmes built as libraries of content produce completions but nothing a manager can see, and why adding more modules rarely helps. You read an induction outline with two labels and then mark a management programme's lines as content to consume or work the learner does.",
      "skill-task-check": "This lesson teaches the three parts of a redesigned programme, a skill written as observable work, a realistic task that uses it, and a check that gathers evidence. You rewrite a vague aim for a finance team and then choose the rewrite that gives a genuine skill, task, and check.",
      "a-check-that-tests-the-task": "This lesson separates a check that asks the person to do the work from a quiz that tests recall, and explains why a check needs a standard another reviewer could apply. You compare two checks for an induction and mark proposed checks for a safe lifting programme.",
      "cut-the-library": "This lesson teaches the test that every piece of content must pass, that the learner needs it for the task or the check, and the four decisions of keep, move, make optional, or cut. You edit an onboarding outline so it keeps only what the task needs, with reasons.",
      "what-the-manager-will-see": "This lesson explains why the manager is the person most likely to turn learning into changed work, and what a useful manager view contains instead of percentages and minutes. You rewrite a default completion report and choose the view you would send to a new starter's manager.",
      "course-assessment": "This lesson recaps the whole method and works one sponsor's request for a stock count module at a retailer through to a redesign. You then answer seven new situations from organisations such as a hospital trust, a council, and a law firm, needing six correct to pass.",
      "redesign-one-programme": "In this final lesson you write the redesign sheet for a programme you own or influence, from the programme today through the skill, task, check, cuts, and manager view to the first change. Each part is checked for substance before you sign the sheet for your record."
    }
  },
  "hiring-and-selection-with-ai": {
    "overview": [
      "AI features now appear throughout recruitment, from drafting adverts and interview questions to ranking and scoring applications in the applicant tracking system. A recruitment decision changes someone's working life, and the Equality Act 2010 and UK data protection law apply at every stage, so an organisation needs to know which steps a model may draft and which a person must genuinely decide.",
      "This course teaches recruiters and hiring managers to tie every advert requirement to the job, to tell meaningful human review of a shortlist from a formality, to keep an audit trail against the criteria, and to question a vendor about an AI feature. You finish with a one-page selection standard for a real vacancy or role family that a new hiring manager could follow."
    ],
    "audience": [
      "Recruiters and talent acquisition partners whose applicant tracking system has added ranking, matching, or scoring features and who need a clear rule for using them.",
      "HR advisers who run recruitment and want to draft adverts, questions, and candidate emails with AI without introducing wording that excludes people unfairly.",
      "Hiring managers who shortlist and interview and want to be confident that their review of applications is a real decision and is recorded properly.",
      "HR professionals who have been asked to assess a vendor's AI recruitment feature and want to know which questions will produce useful answers."
    ],
    "takeaways": [
      "You will be able to mark every step of a recruitment as one a model may draft or one where a person decides, and explain the difference to a hiring manager.",
      "You will be able to edit an AI-drafted advert so that every requirement is tied to a criterion in the person specification and wording unrelated to the job is removed.",
      "You will be able to tell meaningful review of a shortlist, where the reviewer reads the evidence against the criteria and records reasons, from a signature on a tool's ranking.",
      "You will be able to write audit trail notes that record decisions against the criteria and would make sense to the candidate if they asked to see them.",
      "You will leave with a signed selection standard naming what a model may draft, who decides each judgement, what the audit trail records, and what candidates are told."
    ],
    "benefits": [
      {
        "title": "Fairer adverts from AI drafts",
        "body": "You learn to read a drafted advert for its requirements rather than its tone, and to remove wording that points to age, national origin, sex, disability, or caring responsibilities without a link to the job. Your organisation reaches a wider pool of candidates and reduces the risk of wording that may amount to discrimination."
      },
      {
        "title": "Decisions a person actually made",
        "body": "The course sets out four features of meaningful review, so that a hiring manager reads the candidate's evidence against the criteria and records a reason. That means each shortlisting decision rests on a person's judgement that can be explained, not on a tool's score with a signature attached."
      },
      {
        "title": "Records that explain every decision",
        "body": "You learn to write trail entries that link specific evidence to published criteria, written as if the candidate will read them through a subject access request. Your organisation can then explain how a decision was reached, and vendor questions about an AI feature are asked and answered before it is used."
      }
    ],
    "lessons": {
      "what-may-be-drafted": "This lesson draws the line between recruitment text a model may draft, such as adverts and scheduling emails, and every step that judges a candidate, which a person decides. You mark the steps of a finance analyst vacancy and then a warehouse team leader recruitment with the two labels.",
      "the-criteria-come-first": "This lesson explains why an advert is only as fair as its criteria, and how wording unrelated to the job can amount to direct or indirect discrimination under the Equality Act 2010. You read a drafted advert for its requirements and edit a sales advert so every requirement is tied to a criterion.",
      "what-a-person-decides": "This lesson shows that a person can sign off a shortlist without deciding anything, and sets out four features that make review of the candidate's evidence meaningful. You compare two recruiters using the same ranking feature and choose the hiring manager whose review is a real decision.",
      "the-audit-trail": "This lesson explains what an audit trail for selection should record at each decision point, and why every note should be written as if the candidate will read it. You compare interview notes and mark each line of a trail entry as recording the decision against the criteria or recording an impression.",
      "questions-for-an-ai-feature": "This lesson treats an AI ranking or scoring feature as a decision aid someone else designed, and draws on published UK guidance to set out six questions to ask its vendor. You read a vendor's reassuring claims and choose the message you would send before agreeing to use video interview scoring.",
      "course-assessment": "This lesson recaps drafting and deciding, criteria, meaningful review, the audit trail, and vendor questions, then works a rejection email and the note behind it. You answer seven new recruitment situations with feedback on every choice and need six correct to pass.",
      "the-selection-standard": "In this final lesson you write a one-page selection standard for one real vacancy or role family, covering the criteria, drafted steps, deciders, trail fields, AI features, what candidates are told, and an owner. Each part is checked before you sign the standard for your record."
    }
  },
  "performance-and-feedback-with-ai": {
    "overview": [
      "Managers increasingly ask AI tools to help with feedback and performance reviews, often by pasting in a few notes and asking for a finished paragraph. A model has never seen the person work, so it smooths thin notes into characterisations, causes, and outcomes that the manager never observed, and that can turn an ordinary conversation into a dispute or suggest a formal process has already begun.",
      "This course teaches you to use a model only for preparation, such as a structure, the wording of an open question, or a rehearsal, while keeping every judgement about the person with you. You finish with a signed preparation sheet for one real conversation, built on what you saw rather than what you inferred, with an agreed next step."
    ],
    "audience": [
      "Line managers who hold regular one-to-ones and have a real feedback or performance conversation coming up.",
      "Managers who write or contribute to performance reviews and want to use an AI tool without letting it write the judgement for them.",
      "HR business partners who coach managers through difficult conversations and want a clear method to share with them.",
      "New managers who know their review process in outline and want to prepare fair, evidence-based feedback with confidence."
    ],
    "takeaways": [
      "You will be able to sort every task before a conversation into preparation, which a model may help with, and judgement, which stays with you.",
      "You will be able to separate what you saw, with an action, an occasion, and an effect, from what you inferred, and turn an inference back into evidence or set it aside.",
      "You will be able to repair a model's draft by removing characterisations, invented causes, and outcome statements such as a hint of further action.",
      "You will be able to open a conversation with a purpose, two or three pieces of evidence, and an open question, and to name in advance what would change your view.",
      "You will leave with a signed preparation sheet that records what the model helped with and what is and is not decided."
    ],
    "benefits": [
      {
        "title": "Feedback people can act on",
        "body": "The course teaches you to describe specific actions, occasions, and effects rather than labels about character. People can respond to evidence about their work, whereas a label such as a lack of ownership invites them to defend themselves instead of discussing what would help."
      },
      {
        "title": "Judgements that stay yours",
        "body": "You learn exactly where a model's help ends, so it can suggest a structure or rehearse your opening but never decide whether objectives were met. The organisation gains reviews in which the manager's judgement is visible and can be explained, rather than a fluent paragraph nobody chose."
      },
      {
        "title": "Fewer informal conversations that escalate",
        "body": "The course shows how an outcome sentence in a draft can tell someone they are already in a process, and how to keep an informal conversation informal. It also explains when a concern should go to your HR adviser and your policy instead, so that each route is used for the right situation."
      }
    ],
    "lessons": {
      "what-you-may-draft": "This lesson separates preparation, which a model may help with, from judgement about the person, which stays with the manager, and explains why asking a model to write the review paragraph crosses the line. You mark each task in a manager's plan for a conversation about missed deadlines.",
      "what-you-must-have-seen": "This lesson explains why feedback a person can act on describes something the manager saw, when it happened, and its effect, and why inferences provoke defensiveness. You sort a manager's notes and mark each sentence as something seen or something inferred.",
      "the-draft-that-invents": "This lesson shows the three things a model adds to thin notes, characterisations, causes, and outcomes, and why an outcome sentence can do the most harm. You repair a model's message so that it keeps only observed facts, a purpose, and an open question.",
      "one-conversation": "This lesson sets out the five parts of a prepared conversation and explains why an open question comes before any solution, and how informal and formal conversations differ. You compare two openings for a conversation about missed briefings and choose the one that follows the method.",
      "what-would-change-your-view": "This lesson teaches you to write down in advance the answers that would change your view, how to respond when the answer is personal, and how to agree a next step with an action and a date. You edit a preparation whose listening line and next step would not help in the room.",
      "course-assessment": "This lesson recaps the method from preparation and judgement through to agreeing a next step, and works one preparation that contains several problems. You then answer seven situations from managers' weeks, each with feedback on the option you chose, and need six correct to pass.",
      "the-sheet": "In this final lesson you write the preparation sheet you will take into one real conversation, including what you saw, your first question, what you will listen for, and the next step. It also records what the model helped with and what is decided before you sign it."
    }
  },
  "ai-adoption-for-line-managers": {
    "overview": [
      "Many team members now use AI tools to draft reports, summaries, and customer replies, and their managers are left to decide how to review that work. Fluent text is easy to wave through, and without a shared standard a manager tends either to check every line personally, which does not last, or to stop checking altogether.",
      "This course gives you a four-part standard for AI-touched work, three questions to ask in one-to-ones, and a way to return work with a question instead of rewriting it yourself. You finish with a one-page one-to-one standard card for your team, including the signs in the work that will show you the standard has taken hold."
    ],
    "audience": [
      "Line managers and team leaders whose people have started using AI tools and who want a consistent way to review the work that comes back.",
      "Supervisors who hold regular one-to-ones and want questions that show how a piece of work was made without sounding suspicious.",
      "Middle managers in any function who are asked to encourage AI use and want to know whether it is producing reliable work.",
      "HR business partners who support managers and want a practical standard they can recommend across teams."
    ],
    "takeaways": [
      "You will be able to set a review standard for AI-touched work in four parts: the work is owned, the use is declared, the facts are checked, and it stays within limits.",
      "You will be able to ask three questions about any piece of work, covering what was given to the tool, what came back and was changed, and what was checked.",
      "You will be able to read a team member's work for the factual sentences that have no named source, without proofreading or rewriting the whole document.",
      "You will be able to return work with comments that name the sentence, the part of the standard it misses, and a question the person can resolve.",
      "You will leave with a signed standard card that sets out your questions, three signs in the work, when you will look for them, and what you will ask for next."
    ],
    "benefits": [
      {
        "title": "Work owned by its author",
        "body": "The standard makes the person who hands in the work responsible for every sentence and figure, whoever or whatever drafted it. Checking stays with the team member rather than moving to the manager, which is the only arrangement that lasts beyond the first busy week."
      },
      {
        "title": "Unchecked claims found before sending",
        "body": "You learn where unsupported sentences usually hide in AI-touched work, such as precise percentages, unnamed research, and quoted policy clauses. Finding those sentences in a one-to-one stops them reaching a customer, a director, or a tender panel."
      },
      {
        "title": "Evidence the habit has stuck",
        "body": "The course teaches you to tell signs in the work, such as a source named without being asked, from activity counts such as the number of prompts on a dashboard. Your organisation gains a manager who can say whether AI use is producing reliable work, not only whether the tool is being opened."
      }
    ],
    "lessons": {
      "the-standard": "This lesson defines a one-to-one standard for AI-touched work in four parts, owned, declared, checked, and within limits, and explains why a rule about how much to use AI is not a standard. You draft the four parts and choose the better of two managers' standards.",
      "ask-what-the-tool-did": "This lesson teaches three questions that show how a piece of work was made, and explains why asking only whether AI was used tells you nothing about quality. You practise the questions on a supplier comparison and choose the exchange that leaves the next step with the team member.",
      "review-the-work": "This lesson shows how to read AI-touched work for the sentences that would cause harm if wrong, rather than proofreading every word. You read a briefing on a new shift pattern and mark each factual sentence in an agency staffing note as checked against a source or not yet checked.",
      "return-it-with-a-question": "This lesson explains why fixing a team member's work yourself moves the checking back to you, and how a good comment names the sentence, the standard, and a question. You edit a manager's comments on a customer update so each one returns the work with a question.",
      "signs-it-stuck": "This lesson explains that a habit shows in the work rather than in the tool's statistics, and what activity counts can and cannot tell you. You read a manager's notes after six weeks and mark items from a housing team's review as a sign in the work or an activity count.",
      "the-standard-in-practice": "This lesson brings the standard, the questions, the reading, and the returned comments together in the order they come in a real one-to-one, and names where managers slip under pressure. You then answer eight new situations with feedback on each and need six correct to pass.",
      "what-you-ask-for-next": "In this final lesson you write the one-to-one standard card for your team, with the standard in four lines, your three questions, three signs and when to look, and the next change you will ask for. Each part is checked before you sign the card for your record."
    }
  },
  "building-a-workforce-skills-plan": {
    "overview": [
      "Requests for a skills plan often arrive as a request for a long list, prompted by general claims that AI or digital change will transform every job. A list built from trends is hard to act on and easy to ignore, because it asks everyone to learn everything and ties nothing to a change the organisation has actually decided.",
      "This course teaches you to start from the changes to the work that are already decided for the next six months, and to name no more than three observable skills for each affected role. You finish with a one-page plan for two quarters in which every skill has a measure, an owner, a date, and a clear link to the change it responds to."
    ],
    "audience": [
      "HR business partners who have been asked for a skills plan in response to new systems or technology and want one that managers will act on.",
      "L&D leads who need to decide where training effort should go over the next two quarters and what should be solved another way.",
      "Workforce planners who want a short, defensible plan that does not depend on analytics software or a skills taxonomy.",
      "Heads of function who know the roles in their area and need to show their director what will happen, for whom, and when."
    ],
    "takeaways": [
      "You will be able to tell a change you can point to, such as a system with an approved go-live date, from a trend you are guessing at.",
      "You will be able to write a skill as observable work for a named role and tie it to a dated change.",
      "You will be able to decide for each gap whether to train or to solve it another way, such as redesigning the work or providing a job aid.",
      "You will be able to cut a long list to no more than three skills per role using four questions, and give a reason for each skill you cut or move.",
      "You will leave with a signed one-page skills plan for two quarters, with a measure, an owner by role, and a date for every skill."
    ],
    "benefits": [
      {
        "title": "Training aimed at real change",
        "body": "Every line in the plan rests on a change someone has already decided, such as a new system or a revised process with a date. Training effort therefore goes where the work is actually changing, and each line can be defended by pointing to that change."
      },
      {
        "title": "A plan managers can act on",
        "body": "Each skill carries a measure specific enough to book, an owner named by role, and a time set against its change. A manager can read the plan in a few minutes and know what will happen without contacting HR to ask."
      },
      {
        "title": "Budget spent only where needed",
        "body": "The course treats training as one response among several and shows when redesign, a checklist, or support from a specialist closes a gap more quickly. Stating what will not be trained keeps the plan to one page and keeps the training budget for the gaps that need it."
      }
    ],
    "lessons": {
      "the-work-that-is-changing": "This lesson explains why a skills plan should start from the work that is changing rather than from a list of skills, and how to tell a change with evidence from a general trend. You mark statements from a claims department and then a hospital outpatient team.",
      "skills-by-role": "This lesson defines a skill in the plan as observable work for a named role, tied to the change that creates the need, and explains why topics and traits do not count. You compare rows for a text-first letters change and choose the row written for a new claims system.",
      "what-you-will-not-train": "This lesson treats training as one way among several to close a gap, alongside redesigning the work, providing a job aid, or relying on a specialist. You mark gaps from a claims system change and an outpatient plan as ones to train or to solve another way.",
      "the-few-that-matter": "This lesson explains why a plan should name no more than three skills per role, and teaches four questions for choosing them, starting with the consequence of the skill being missing. You cut a draft list of seven skills for booking clerks and give a reason for each cut.",
      "measures-owners-and-dates": "This lesson shows how to give each skill a measure someone could book, an owner named by role, and a time set against the change. You read lines for an outpatient team and choose the row for triage administrators that a manager could act on without asking.",
      "course-assessment": "This lesson recaps changes, skills, decisions about training, and measures, then works a finance team's request for AI and data skills before a new expenses system. You answer seven new situations with feedback on each choice and need six correct to pass.",
      "the-plan": "In this final lesson you write the one-page skills plan for your area for the next two quarters, from the changes and their evidence to the skills, measures, what is not trained, and the plan's owner. Each part is checked before you sign the plan for your record."
    }
  },
  "hr-operations-with-ai": {
    "overview": [
      "Much of HR operations is repeating work, such as contract variation letters, offer letters, onboarding, policy queries, and leaver processes, and an approved AI tool can speed up the drafting in each of them. The risk is that errors from a model are usually plausible, such as a wrong notice period or start date, so an AI step without a clear check can put a wrong fact in front of an employee.",
      "This course teaches you to add one checked AI step to a single operation, deciding which step a model may take, which fields may go into the tool, and how a person checks the result against a source of truth. You finish with a written workflow a colleague could follow on a day you are away, including a failure note that says how an error is caught and who is told."
    ],
    "audience": [
      "HR administrators who produce the same letters and forms every week and want to use the approved AI tool without introducing errors.",
      "People operations staff who own onboarding, contract changes, or leaver processes and need a documented procedure others can follow.",
      "HR shared service teams who answer common policy queries and want a reliable check before any AI-drafted reply is sent.",
      "HR advisers who carry out operational work alongside casework and need no automation or technical skills to take part."
    ],
    "takeaways": [
      "You will be able to choose a good first operation for an AI step, one with a defined input, a defined output, and a source of truth.",
      "You will be able to mark each step of an operation as one a model may take or one a person keeps, keeping approvals, payroll updates, and system access with people.",
      "You will be able to decide which fields of a form may go into the approved tool and write limits that keep health, bank, and identity details out.",
      "You will be able to write the check that follows a model's step, naming the checker by role, the facts checked, the source, and what happens on a mismatch.",
      "You will leave with a signed workflow for one HR operation, including a failure note a colleague could follow if an error gets through."
    ],
    "benefits": [
      {
        "title": "Errors caught before employees see them",
        "body": "Every model step in the workflow is followed by a named check against the source of truth, such as the approved change form or the HR system. Wrong salaries, dates, and job titles are found by a person before a letter reaches an employee."
      },
      {
        "title": "Less personal data in tools",
        "body": "The course teaches you to send only the fields the draft needs, rather than pasting a whole form into the tool. That reduces the chance of health information, bank details, or personal reasons for a change appearing in a letter or leaving the organisation's systems."
      },
      {
        "title": "Procedures colleagues can follow",
        "body": "The finished workflow is written so a colleague can run the operation without asking you anything. Your team gains continuity when people are away, and a failure note that says who is told and what is done if something goes wrong."
      }
    ],
    "lessons": {
      "one-operation": "This lesson defines an HR operation and the three features of a good first one for an AI step: a defined input, a defined output, and a source of truth. You weigh three candidates from a care group and choose the operation that has all three features.",
      "the-step-a-model-may-take": "This lesson sets out the conditions under which a model may take a step, usually drafting, and explains why approving changes and updating payroll stay with a person. You walk through a contract variation operation and mark each step of a leaver process with the two labels.",
      "what-goes-into-the-tool": "This lesson explains that whatever you paste into the tool is available to the model, so only the fields your organisation allows and the draft needs should go in. You read what happened when a whole change form was pasted and edit a workflow to limit its fields.",
      "the-step-a-person-keeps": "This lesson teaches the check that must follow every model step, naming the checker, the facts checked, and the source, and says what happens when a detail does not match. You add a proper check to a workflow for new starter offer letters.",
      "when-it-goes-wrong": "This lesson explains the failure note, which says what an error would look like, how it would be caught if the check missed it, and who is told, including after a data mistake. You mark each sentence of a failure note as catching the error or merely hoping.",
      "course-assessment": "This lesson recaps choosing an operation, marking its steps, limiting the input, checking the output, and planning for failure, then reads one draft workflow against every lesson. You answer seven new situations from different HR teams and need six correct to pass.",
      "the-workflow": "In this final lesson you write the workflow for your own operation, naming its input, output, and source of truth, marking every step, and adding the check and the failure note. Each part is checked for substance before you sign the workflow for your record."
    }
  },
  "employee-data-privacy-and-ai": {
    "overview": [
      "HR teams are asked every week whether information about staff can go into an AI tool, and the manager asking has usually taken out the name and assumes that settles it. Under UK data protection law, information about a worker can still be personal data without a name, because a role, a location, or a detail such as being the only payroll specialist can identify someone to anyone in the team.",
      "This course teaches you to recognise personal data about workers, to keep a red-list of people data out of AI tools, to anonymise a prompt properly, to answer a manager helpfully, and to act the same day when something goes in by mistake. You finish with a signed team rule that managers can follow without calling HR."
    ],
    "audience": [
      "HR professionals who are asked by managers whether information about staff can be pasted into an AI tool and want a clear, consistent answer.",
      "People operations staff who handle sickness records, grievance letters, and disciplinary material and need to know what must stay out of AI tools.",
      "Data protection leads who support HR and want a practical rule that sits under the organisation's policy in words busy managers will read.",
      "HR advisers without legal training who know which tools are approved and, in outline, what their data protection policy says."
    ],
    "takeaways": [
      "You will be able to tell whether information about a worker is personal data when no name is given, using the test of whether the person could reasonably be identified.",
      "You will be able to separate red-list data, such as health, grievance, and disciplinary information, from data that can go into the approved tool.",
      "You will be able to anonymise a prompt so that no colleague could say who it is about while keeping what the question needs.",
      "You will be able to reply to a manager in three parts, acknowledging their aim, stating the limit with a reason, and offering another route.",
      "You will leave with a signed team rule covering approved tools, the red-list, the answer to managers, and what to report the same day after a mistake."
    ],
    "benefits": [
      {
        "title": "Staff information stays protected",
        "body": "The course shows why removing a name rarely makes information anonymous in a small team, and teaches a colleague test to apply before any prompt is sent. Fewer identifiable details about workers enter AI tools, which protects the people concerned and the organisation."
      },
      {
        "title": "Answers managers accept and follow",
        "body": "You learn to acknowledge what the manager is trying to do before giving the limit, and always to offer a route that still meets their deadline. Managers receive help rather than a refusal, so they are more likely to ask again next time instead of pasting the material anyway."
      },
      {
        "title": "Mistakes reported while it matters",
        "body": "The course explains why a mistake should be reported to the data protection lead the same day and why the conversation should not be quietly deleted. Your data protection lead receives the tool, what went in, and when, in time to judge what needs to happen next."
      }
    ],
    "lessons": {
      "what-counts": "This lesson explains the UK GDPR definition of personal data and why information can identify a worker without a name, while policies and job descriptions usually do not. You read a manager's message with the name removed and mark five items from a law firm as personal data or not.",
      "the-red-list": "This lesson sets out the red-list of people data that never goes into an AI tool without a specific approved route, starting with special category data, and explains why an approved tool does not settle the question. You draft red-list lines and mark requests from a care provider.",
      "anonymised-is-harder-than-it-looks": "This lesson explains what anonymising a prompt properly means, introduces the colleague test, and shows that anonymised does not have to mean vague. You work through a prompt about the only payroll specialist in an office and mark each phrase in a new prompt to remove, generalise, or keep.",
      "the-answer": "This lesson teaches a reply to a manager in three parts, acknowledging the aim, stating the limit and reason, and offering a route, and explains why the order matters. You rewrite a reply about a grievance letter and choose the better answer to a request about sickness records.",
      "when-it-goes-in-by-mistake": "This lesson explains why personal data that goes into the wrong tool should be reported to the data protection lead the same day, what the report needs, and why quiet deletion does not help. You edit a stores supervisor's message so the lead has what they need.",
      "course-assessment": "This lesson recaps what counts as personal data, the red-list, anonymising, answering, and reporting, then takes one shift manager's request through every move in order. You answer seven new situations with feedback on each choice and need six correct to pass.",
      "the-team-rule": "In this final lesson you write the team rule for the managers and staff you support, covering approved tools and purposes, the red-list with reasons, the three-part answer, and what to do after a mistake. Each part is checked before you sign the rule for your record."
    }
  },
  "measuring-whether-training-stuck": {
    "overview": [
      "Most training reports count enrolments, completions, time spent, satisfaction ratings, and quiz scores, because those numbers are easy to collect. None of them shows whether people work differently afterwards, which is the question sponsors and senior leaders actually want answered.",
      "This course teaches you to write signs in the work that someone else could see a few weeks after a programme, to plan a fair before and after comparison, to ask managers for evidence rather than opinion, and to read a missing sign correctly. You finish with a one-page measurement sheet for one real programme."
    ],
    "audience": [
      "L&D practitioners who currently report completions and satisfaction scores and know those numbers do not show whether a programme worked.",
      "HR business partners who are asked by sponsors whether a programme made a difference and want an honest way to find out.",
      "Programme sponsors and managers who pay for or run training and want evidence of change in the work of the people who took part.",
      "Anyone responsible for one real programme who can speak to at least one manager of participants and has no analytics tools or evaluation background."
    ],
    "takeaways": [
      "You will be able to tell a measure that counts activity inside a programme from one that shows the work changed.",
      "You will be able to write a sign in the work that is observable, appears in normal work, is seen by someone other than the learner, and has a before state.",
      "You will be able to plan a fair comparison, with a before sample collected the same way as the after and a window of about two to six weeks.",
      "You will be able to ask a manager three short questions that bring out what they saw, one example of the work, and what got in the way.",
      "You will leave with a signed measurement sheet for one programme that says how it will be judged by signs in the work rather than by activity counts."
    ],
    "benefits": [
      {
        "title": "An honest answer for sponsors",
        "body": "The course replaces an impact slide full of completions and ratings with signs that someone other than the learner can see in normal work. Sponsors receive evidence of whether the programme changed the work, and activity counts are reported for what they are."
      },
      {
        "title": "Comparisons that can be trusted",
        "body": "You learn to collect the before and the after in the same way, from the same kind of work, inside a stated window. That makes a difference you find more likely to reflect the programme, and the course also explains the care needed when signs come from records about individual workers."
      },
      {
        "title": "The right response to gaps",
        "body": "The course teaches you to tell a skill that is missing from a job that gave no chance to use it, such as a team on leave or a missing tool. Your organisation avoids rebuilding a programme when the real problem sits in the work environment, and avoids excusing a programme that did not work."
      }
    ],
    "lessons": {
      "what-you-stop-counting": "This lesson separates measures that count activity, such as completions, ratings, and quiz scores, from measures that show the work changed, and explains what activity counts are still useful for. You read a customer service programme report and mark each line of a new manager programme report.",
      "signs-in-the-work": "This lesson defines a sign in the work and its four features: observable, in normal work, seen by someone else, and with a before state. You compare two draft signs for a delay update programme and choose the sign that follows the lesson for a data handling programme.",
      "when-to-look": "This lesson explains how to choose a collection window, why the before state must be collected in the same way as the after, and the care needed with records about individual workers. You mark lines of a collection plan and choose the fairer plan for an expense claims programme.",
      "the-manager-conversation": "This lesson shows how the question you ask a manager decides whether you get evidence or opinion, and sets out three kinds of question that fit a ten-minute call. You rewrite opinion questions for new managers and edit questions for a complaints handling programme.",
      "reading-what-you-found": "This lesson explains the two explanations for a missing sign: the skill is missing, or the work gave no chance to use it, and why each calls for a different response. You read findings from a delay update programme and mark findings from a one-to-ones programme.",
      "course-assessment": "This lesson recaps activity counts, signs, fair comparison, manager questions, and reading findings, then repairs a coaching programme report from a housing association. You answer seven new situations with feedback on each choice and need six correct to pass.",
      "the-sheet": "In this final lesson you write the measurement sheet for your own programme, naming the skill, up to three signs with before states, when you will collect them, and your manager questions. Each part is checked before you sign the sheet for your record."
    }
  }
};
