/*
Course: AI Output Verification
Slug: ai-output-verification
For: Analysts, account managers, policy officers, consultants, legal and compliance support staff, and
  anyone who receives text from a model, or from a colleague who used one, and is about to pass it on
  under their own name. They can already use at least one AI tool and read a contract, report, or policy.
Outcome: Takes a piece of AI output that is about to leave their desk, lists every checkable claim,
  traces each claim to a source they have opened, tests whether the reasoning goes further than the
  sources allow, decides use or hold for each claim, and records it in a note a colleague can repeat.
Artefact: The verification note (output checked, claims, traced, reasoning, decision).
Record sentence: Ran the four-step check on a real piece of AI output and wrote a verification note a
  colleague could follow and repeat.
Lessons (id, title, move, interaction, pass rule):
  1. how-confident-error-happens, How confident error happens, compare a sentence with its source rather
     than its tone, mark (Matches the source / Not in the source), every sentence marked correctly.
  2. list-the-claims, List the claims, separate checkable claims from framing, mark (Checkable claim /
     Framing only), every sentence marked correctly, including a claim hidden in a linking sentence.
  3. trace-each-claim, Trace each claim, trace a claim to a source with authority and a place in it,
     choose (Trace A / Trace B), the trace that names the signed agreement, version, and clause.
  4. test-the-reasoning, Test the reasoning, find widened scope, added certainty, and dropped conditions,
     mark (Follows from the source / Goes further than the source), every sentence marked correctly.
  5. judge-three-outputs, Judge three outputs, decide use or hold from the trace note, mark (Use / Hold),
     every sentence marked correctly.
  6. course-assessment, Course assessment, the whole method on new situations, scenario of seven
     questions, six of seven correct.
  7. the-verification-note, The verification note, write the artefact, build, every field present with
     a course-specific word or a concrete fact, as set by each field's rule and any list.
Sources: UK Information Commissioner's Office guidance on the right of access (time limits); NIST AI RMF
  1.0 (NIST AI 100-1) and the Generative AI Profile (NIST AI 600-1), which discusses confabulation;
  UK Government AI Playbook, on human checking of AI output; Mata v. Avianca, Inc. (S.D.N.Y. 2023).
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/

import type { CourseContent } from "./types.ts";

const MATCHES = "Matches the source";
const NOT_IN = "Not in the source";
const CLAIM = "Checkable claim";
const FRAMING = "Framing only";
const FOLLOWS = "Follows from the source";
const FURTHER = "Goes further than the source";
const USE = "Use";
const HOLD = "Hold";
const REPEATABLE = "Repeatable";
const ASK = "A colleague would have to ask";

export const COURSE: CourseContent = {
  slug: "ai-output-verification",
  hours: 2.5,
  artefact: {
    lessonId: "the-verification-note",
    title: "The verification note",
    recordLine:
      "Ran the four-step check on a real piece of AI output and wrote a verification note a colleague could follow and repeat.",
  },
  lessons: [
    {
      id: "how-confident-error-happens",
      title: "How confident error happens",
      emphasis: "confident",
      place:
        "This is the first of seven lessons. It explains why a model can write a sentence that sounds certain and is wrong, before the rest of the course teaches the method for catching it.",
      sections: [
        {
          heading: "How a model produces a sentence",
          paragraphs: [
            "A language model writes by predicting which words are likely to come next, given everything it has been shown in the prompt and everything it absorbed during training. Most of the writing it learned from is smooth, organised, and stated with confidence, because that is how contracts, reports, and articles are written. So the text it produces is smooth, organised, and confident as well.",
            "The model does not check a sentence against the world before it writes it. It has no reliable internal signal that tells it a figure is wrong or a clause has been misread. When it writes thirty days where the contract says ninety, it uses the same calm voice it would have used for the correct figure, because the calm voice belongs to the writing and not to the fact.",
            "Public guidance describes the same problem. The US National Institute of Standards and Technology, in its Generative Artificial Intelligence Profile (NIST AI 600-1), names confabulation as a risk of generative systems: the production of confident statements that are false. The UK Government's AI Playbook asks that people check AI output before they rely on it. Neither document suggests that the wording of an answer tells you whether it is right.",
          ],
        },
        {
          heading: "What this lesson is not saying",
          paragraphs: [
            "This lesson is not saying that model output is usually wrong, and it is not saying that you should stop using it. Much of what a model writes from a source you gave it will be accurate, and a good summary can save you an hour. The point is narrower than that, and more useful.",
            "The point is that the only way to know whether a sentence is right is to compare it with a source. The tone of the sentence tells you nothing about which way that comparison will go. A hedged sentence can be right, and a firm sentence can be wrong, so neither the hedge nor the firmness is evidence.",
          ],
        },
        {
          heading: "Two labels for comparing with a source",
          paragraphs: [
            "In this lesson you will judge each sentence of a summary with one of two labels. A sentence Matches the source when it says the same thing as the document it was written from: the same figure, the same condition, the same party, and the same method. Different words are fine, provided the meaning has not moved.",
            "A sentence is Not in the source when it says something the document does not say. That includes a changed number, a condition that has been dropped or reversed, a method that has been swapped for a more common one, and anything the model added that the document never mentioned. One word, such as including in place of excluding, is enough to put a sentence in this group.",
          ],
          beforeAfter: {
            before: "Reading the summary on its own and asking whether it sounds right.",
            after:
              "Reading the summary with the source open beside it, and asking of each sentence whether it matches the source or is not in the source.",
            reading:
              "The first habit tests the writing, and fluent writing always passes it. The second habit tests the content, which is the only thing the reader will act on.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to check the sentences that look uncertain and wave through the ones that look settled. People slow down when a summary says 'may' or 'it appears', and speed up when it gives a clean figure. That is the wrong way round, because a clean figure is exactly the kind of sentence that a reader will copy into an email or a plan.",
            "A second mistake is to check a summary against your memory of the source rather than the source itself. If you last read the contract three months ago, your memory of the notice period is no more reliable than the model's. Open the document, find the line, and compare.",
          ],
        },
      ],
      workedExample: {
        title: "A two-line summary of a termination clause",
        inputLabel: "Clause 14 of the supplier agreement",
        outputLabel: "The summary the model wrote",
        prompt:
          "A contracts officer at Harrow Freight pastes clause 14 of a supplier agreement into a model and asks for a two-line summary for the operations manager.\n\nClause 14: 'Either party may terminate this Agreement by giving not less than ninety (90) days' written notice to the other party. Notice must be served by recorded delivery to the registered office.'",
        output:
          "Either side can end the contract with 30 days' notice. Notice can be given by email to the account contact.",
        reading: [
          "Both sentences are fluent, and both are not in the source. The first changes ninety days to thirty. Nothing in the wording signals the change, and the figure sits in the sentence as calmly as the correct one would have.",
          "The second sentence replaces recorded delivery to the registered office with email to an account contact. Email notice is common in other contracts, which is probably why the model reached for it. It is a likely sentence, and it is not what this clause says.",
          "If the operations manager had acted on this summary, notice could have been served late and by the wrong method. Harrow Freight would still be bound for the full ninety days, and the notice might not count at all. Comparing each line with the clause would have taken under a minute.",
        ],
      },
      practice: {
        intro:
          "Here is a paragraph from a staff policy and a summary a model wrote from it. The policy stays on the screen, so compare each sentence with it line by line. The definitions of the two labels are in the section above if you want them.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence of the summary as Matches the source or Not in the source.",
          material: {
            label: "Lone working policy, Pennine Mutual, section 3",
            text: "Staff visiting a client's home alone must record the address and expected finish time on the visits log before they leave the office. They must call the duty manager within 30 minutes of the expected finish time. Visits after 6pm require a second member of staff.",
          },
          passLabel: MATCHES,
          failLabel: NOT_IN,
          sentences: [
            {
              id: "log",
              text: "Before a lone home visit, staff must record the address and expected finish time on the visits log.",
              fail: false,
              why: "The first line of the policy says the same thing, so this sentence matches the source.",
            },
            {
              id: "call",
              text: "Staff must call the duty manager within an hour of finishing.",
              fail: true,
              why: "The second line of the policy says within 30 minutes of the expected finish time. The summary doubled the window and changed what it is measured from.",
            },
            {
              id: "evening",
              text: "Visits after 6pm require a second member of staff.",
              fail: false,
              why: "The third line of the policy says exactly this, so it matches the source.",
            },
          ],
          why: "That is right. The first and third sentences match the source, and the second doubles the call window from 30 minutes to an hour, which is the one change that could leave someone unaccounted for.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Here is part of a staff travel policy and a summary a model wrote from it. Read the policy, then mark each sentence of the summary.",
        material: {
          label: "Staff travel policy",
          text: "Economy class must be booked for all flights under six hours. Rail travel should be booked at standard class unless the trip is longer than three hours. Hotel bookings in London are capped at £180 per night, excluding breakfast.",
        },
        passLabel: MATCHES,
        failLabel: NOT_IN,
        sentences: [
          {
            id: "economy",
            text: "Flights under six hours must be booked in economy.",
            fail: false,
            why: "Look again at the first line of the policy. It says economy for flights under six hours, which is exactly what this sentence says, so it matches the source.",
          },
          {
            id: "rail",
            text: "First class rail is allowed for any trip over two hours.",
            fail: true,
            why: "Read the second line of the policy again. It says three hours, not two, and it never says first class is allowed. The summary changed both the threshold and the class, so it is not in the source.",
          },
          {
            id: "hotel",
            text: "London hotels are capped at £180 a night including breakfast.",
            fail: true,
            why: "The figure is right, but look at the end of the third line. The policy says excluding breakfast, and the summary says including it, so the sentence is not in the source.",
          },
        ],
        why: "You compared each sentence with the source rather than with how sure it sounded. The rail sentence changed a threshold and a class, and the hotel sentence reversed one word, and both read as confidently as the sentence that was right. That is the habit the rest of this course builds on.",
      },
      bridge:
        "The next lesson starts the four-step check by showing you how to find every sentence in an output that needs this comparison.",
    },
    {
      id: "list-the-claims",
      title: "List the claims",
      emphasis: "claims",
      place:
        "This is the second of seven lessons, and the first step of the four-step check. You cannot trace a claim you have not noticed, so the check begins by listing every claim before you test any of them.",
      sections: [
        {
          heading: "The four-step check",
          paragraphs: [
            "The method in this course has four steps, and every later lesson uses the same words for them. First, list the claims: write down every sentence that says something could be true or false. Second, trace each claim: open a source that could confirm it and find the place where it does. Third, test the reasoning: ask whether the conclusion follows from what the sources say, or goes further. Fourth, decide use or hold: a claim that is traced and follows from its source can be used, and anything else is held.",
            "The steps are in this order for a practical reason. Tracing is where most of the time goes, and it is wasted if you trace the sentences that caught your eye and miss the one that mattered. A list made first, before you start opening documents, is what stops a claim slipping through.",
          ],
        },
        {
          heading: "What a claim is",
          paragraphs: [
            "A claim is a sentence, or part of a sentence, that could turn out to be true or false when you compare it with the world. Figures, dates, and the names of people and organisations are claims. So are quotations, references to a law, a policy, or a clause, statements about what someone said or agreed, and commitments about what will happen.",
            "In this lesson a sentence that contains anything checkable is a Checkable claim. It does not matter whether the sentence also contains opinion or linking words. If there is one figure, one date, one name, or one commitment in it, the whole sentence goes on the list, and you note each checkable part separately.",
          ],
        },
        {
          heading: "What framing is",
          paragraphs: [
            "Framing is the part of the writing that introduces, connects, or expresses a view. 'This is an important development', 'In summary', and 'We are pleased with progress' are framing. Framing can still be poorly judged, and a manager may want it changed, but there is no source you could open to prove it true or false.",
            "In this lesson a sentence that contains nothing checkable is Framing only. You do not trace it, because there is nothing to trace. Separating it out is useful in its own right, because it tells you how much of an output actually needs checking, which is often less than it first appears.",
          ],
        },
        {
          heading: "Listing is not checking, and the claim hidden in a link",
          paragraphs: [
            "Listing the claims is not the same as checking them. At this step you only write them down, one per line, and resist the urge to start looking things up. The discipline of finishing the list first is what makes the next step reliable.",
            "The most common miss is a claim hidden inside a sentence that reads like framing. 'Following last year's 12% rise, the board is reviewing costs' sounds like a transition, but the 12%, the timing of last year, and the board's review are all claims. Split sentences like this into their parts, because each part could be wrong on its own.",
          ],
          beforeAfter: {
            before: "Following last year's 12% rise, the board is reviewing costs.",
            after:
              "1. Costs rose last year. 2. The rise was 12%. 3. The board is reviewing costs.",
            reading:
              "The first version reads as one linking sentence. The second shows three claims, and the 12% could be wrong while the other two are right.",
          },
        },
      ],
      workedExample: {
        title: "Listing the claims in an internal briefing",
        inputLabel: "The paragraph the model drafted",
        outputLabel: "The list of claims",
        prompt:
          "The new data protection guidance is a welcome step. It was published by the ICO in March and replaces the 2019 version. Organisations now have 60 days to respond to a subject access request. Overall, the changes should make life easier for small teams.",
        output:
          "1. The guidance was published by the ICO.\n2. It was published in March.\n3. It replaces the 2019 version.\n4. Organisations have 60 days to respond to a subject access request.",
        reading: [
          "The first and last sentences are framing only. 'A welcome step' and 'should make life easier' are views, and no document could prove them true or false.",
          "The second sentence holds three separate claims: who published the guidance, when, and what it replaced. Each could be wrong independently, which is why the list gives each its own line.",
          "The third sentence is a claim about a legal deadline, and it is the one that would cause harm if it were wrong. The ICO's published guidance on the right of access says an organisation must respond within one month, which can be extended by a further two months in some circumstances. Sixty days is not in that guidance. Listing the claim on its own line is what makes it visible for tracing in the next lesson.",
        ],
      },
      practice: {
        intro:
          "Two colleagues listed the claims in the same paragraph from a client update. The paragraph is shown with the question. Choose the list you would trace from, using the section above on the claim hidden in a link.",
        check: {
          kind: "choose",
          prompt:
            "Choose the list of claims that would let nothing slip past when you begin tracing.",
          material: {
            label: "The paragraph from the client update",
            text: "Thank you for a productive quarter. After the April price review, your monthly fee is now £2,150. Support hours were extended to 8pm from 1 May. We look forward to the next phase.",
          },
          leftLabel: "List A",
          left: "1. The monthly fee is £2,150.\n2. Support hours were extended to 8pm.",
          rightLabel: "List B",
          right:
            "1. There was a price review in April.\n2. The monthly fee is now £2,150.\n3. Support hours were extended to 8pm.\n4. The extension started on 1 May.",
          correct: "right",
          why: "List B splits each sentence into its separate claims, including the April price review hidden in the linking phrase and the 1 May start date. Either of those could be wrong while the rest is right, so each needs its own line.",
          wrong:
            "Look again at List A. It misses the April price review, which is hidden in the words 'after the April price review', and it drops the 1 May start date. Both could be wrong on their own, so List B is the one to trace from.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A model drafted this paragraph for a project update. Mark each sentence as a Checkable claim or Framing only.",
        passLabel: FRAMING,
        failLabel: CLAIM,
        sentences: [
          {
            id: "pleased",
            text: "We are pleased with progress this quarter.",
            fail: false,
            why: "There is no figure, date, name, or commitment in this sentence. It expresses a feeling about progress, so it is framing only.",
          },
          {
            id: "migration",
            text: "The migration finished on 14 June, two weeks ahead of plan.",
            fail: true,
            why: "This sentence contains a date and a comparison with the plan. Both could be checked against the project log, so it is a checkable claim.",
          },
          {
            id: "foundation",
            text: "It is a strong foundation for the next phase.",
            fail: false,
            why: "Nothing in this sentence could be traced to a record. It is a judgement about the work, so it is framing only.",
          },
          {
            id: "vendor",
            text: "Following the vendor's confirmation last week, licence costs will fall from April.",
            fail: true,
            why: "This reads like a link between ideas, but it says the vendor confirmed something, when they did, and what will happen in April. Each of those could be checked, so it is a checkable claim.",
          },
        ],
        why: "You separated what could be checked from what only frames the writing, including the claim hidden inside a linking sentence about the vendor. Those claims are the list you trace in the next step.",
      },
      bridge:
        "The next lesson takes the list you have just made and shows you how to trace each claim to a source you have actually opened.",
    },
    {
      id: "trace-each-claim",
      title: "Trace each claim",
      emphasis: "Trace",
      place:
        "This is the third of seven lessons, and the second step of the four-step check. It is where most of the time in a real verification is spent.",
      sections: [
        {
          heading: "What tracing is",
          paragraphs: [
            "To trace a claim is to open a source that could confirm it and find the exact place where it does. You finish with three things you could hand to someone else: the name of the source, the place in it, and what it says at that place. If you cannot give all three, you have not yet traced the claim.",
            "Tracing is slower than reading, and it should be. A trace is only worth anything because someone could repeat it. 'I checked' tells a colleague that you felt confident. 'Signed agreement, clause 14.1' tells them where to look.",
          ],
        },
        {
          heading: "A source with authority",
          paragraphs: [
            "A good source is one with authority over the claim. For a contract term, that is the signed contract, in the version that is in force. For a regulator's rule, it is the regulator's published guidance or the law itself. For a figure, it is the system of record, such as the finance system or the payroll report. For what was agreed at a meeting, it is the approved minutes or the email in which the decision was made.",
            "Authority matters because other documents can repeat a claim without being able to confirm it. An account manager's email that mentions 90 days' notice is evidence that the account manager believes it. It is not evidence of what the contract says, and it may have been copied from the same wrong summary you are now checking.",
          ],
        },
        {
          heading: "What tracing is not",
          paragraphs: [
            "A citation that the model supplied is not a source until you have opened it. Models can produce references that look correct, with a title, a year, and a paragraph number, that point to documents that do not exist or that do not say what is claimed. In Mata v. Avianca, Inc., decided in the US District Court for the Southern District of New York in 2023, lawyers were sanctioned after filing a brief that cited cases a chatbot had produced and that did not exist.",
            "Tracing is also not finding a second page that repeats the claim. Two articles, two slides, or two emails can carry the same mistake, and agreement between them tells you only that the mistake has travelled. Two copies of a claim are not a trace. One source with authority is.",
          ],
        },
        {
          heading: "Traced and not traced",
          paragraphs: [
            "In this course a claim is Traced when you can name the source with authority over it, the place in it, and what it says, and what it says confirms the claim. Write the trace as one line: the claim, the source, the place, and what it says.",
            "A claim is Not traced when you could not find it, when you only found it repeated in documents without authority, when the source says something different, or when the only support is the model's own reference. Write 'not traced' and say what you found instead, because what you found is often the correction.",
          ],
          beforeAfter: {
            before: "90 days' notice: confirmed.",
            after:
              "90 days' notice: traced. Signed supplier agreement dated 3 February, clause 14.1: 'not less than ninety (90) days' written notice'.",
            reading:
              "The first line records a feeling. The second names the source, the version, the clause, and the words, so anyone could open the agreement and see the same thing.",
          },
        },
      ],
      workedExample: {
        title: "Tracing a deadline and its citation",
        inputLabel: "The claim and the citation the model gave",
        outputLabel: "The trace entry",
        prompt:
          "Claim from the briefing: 'Organisations now have 60 days to respond to a subject access request.'\nCitation the model added: 'ICO, Subject Access Code of Practice, 2023, para 4.2.'",
        output:
          "60 days to respond: not traced. ICO guidance on the right of access, section on time limits, says one month, which can be extended by a further two months for complex or numerous requests. No paragraph 4.2 saying 60 days could be found. The reference the model gave does not support the claim.",
        reading: [
          "The model's reference looked specific, with a title, a year, and a paragraph number, and that made it feel authoritative. The analyst treated it as a lead to follow, not as a source, and opened the ICO's published guidance directly.",
          "Opening the real source showed two things at once. The figure was wrong, and the reference did not support it. The trace entry records both, and it records what the source actually says, which gives the correction.",
          "Without this step, the wrong deadline would have gone out with a citation attached. That is worse than no citation, because a reader who sees a paragraph number is less likely to check.",
        ],
      },
      practice: {
        intro:
          "A colleague has written the trace entry below for a claim in a model's summary of a lease. Edit it so that it is traced to the source with authority, with the place in it. The extract from the lease is shown with the task, and the section on traced and not traced is above.",
        check: {
          kind: "edit",
          prompt:
            "Edit this trace entry so that it names the source with authority over the claim and the place in it, and still states the claim.",
          material: {
            label: "Extract from the signed lease, Unit 4 Calder Park, dated 12 January",
            text: "Clause 7.3: The Tenant may end this Lease on the fifth anniversary of the Term Commencement Date by giving not less than six months' written notice to the Landlord.",
          },
          label: "The trace entry you are repairing",
          start: "Break option after five years: confirmed. The model's summary and the facilities manager's email both say so.",
          unchanged:
            "You have not changed the trace entry yet. Replace the model's summary and the email with the signed lease and the clause that confirms the break option.",
          keep: [
            {
              id: "claim",
              any: ["five", "5", "break"],
              missing:
                "Keep the claim in the entry. It should still say what is being traced, which is the break option after five years.",
            },
          ],
          limits: [
            {
              id: "source",
              any: ["lease"],
              missing:
                "Name the source with authority over the claim. For a lease term that is the signed lease, not the model's summary or an email.",
            },
            {
              id: "place",
              any: ["clause", "7.3"],
              missing:
                "Name the place in the lease where the claim is confirmed, which is clause 7.3, so a colleague could open it and find the words.",
            },
          ],
          limitWording: false,
          why: "That trace works. It keeps the claim, names the signed lease as the source with authority, and points to clause 7.3, so a colleague could open the lease and see the same words.",
          result: {
            label: "A trace entry that would pass",
            text: "Break option after five years: traced. Signed lease for Unit 4 Calder Park dated 12 January, clause 7.3: the tenant may end the lease on the fifth anniversary by giving not less than six months' written notice.",
          },
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two colleagues traced the same claim: 'The supplier must give 90 days' notice to terminate.' Choose the trace you would accept.",
        leftLabel: "Trace A",
        left: "Confirmed. The model's summary and the account manager's email both say 90 days.",
        rightLabel: "Trace B",
        right:
          "Traced. Signed supplier agreement, version dated 3 February, clause 14.1: 'not less than ninety (90) days' written notice'.",
        correct: "right",
        why: "Trace B names the source with authority over the claim, the version, the clause, and the words it contains. Anyone could open it and see the same thing.",
        wrong:
          "Trace A only shows the claim repeated in two places. Neither the model's summary nor an email has authority over a contract term, and both could carry the same mistake. Trace B opens the signed agreement and names the clause.",
      },
      bridge:
        "Once every claim is traced, the next lesson asks the harder question of whether the conclusions drawn from those claims actually follow.",
    },
    {
      id: "test-the-reasoning",
      title: "Test the reasoning",
      emphasis: "reasoning",
      place:
        "This is the fourth of seven lessons, and the third step of the four-step check. Every individual fact in an output can be traced and the output can still mislead, and this step is where you find out.",
      sections: [
        {
          heading: "What testing the reasoning means",
          paragraphs: [
            "Testing the reasoning means asking whether the conclusion a piece of output reaches is supported by what its sources actually say. Tracing tells you that each fact is right. This step tells you whether the facts, taken together, carry the weight the sentence puts on them.",
            "Models often join accurate facts into a conclusion that goes further than the facts allow. They do it for the same reason they write confidently: summaries and reports usually end with a clear finding, so the model writes one. The finding reads as if it came from the evidence, even when the evidence was more limited.",
          ],
        },
        {
          heading: "Four ways a conclusion goes further",
          paragraphs: [
            "There are four common forms. Widening the scope takes a result from one region, one team, or one period and states it for the whole business. Turning a pattern into a cause takes two things that happened together and says one produced the other. Turning a possibility into a certainty takes 'may', 'could', or 'will review' and writes 'will' or 'expects'. Dropping a condition removes a limit the source attached, such as a small sample, a voluntary survey, or a group that stopped taking part.",
            "Each form is easy to miss because the facts inside the sentence are still correct. The figure is right, the region is real, and the survey happened. What has changed is the claim the sentence makes about those facts, and that is what the reader will repeat.",
          ],
        },
        {
          heading: "Two labels for a conclusion",
          paragraphs: [
            "In this lesson a sentence Follows from the source when a careful reader of the source would reach the same conclusion, with the same scope, the same level of certainty, and the same conditions. It can be shorter than the source and use different words.",
            "A sentence Goes further than the source when it adds scope, certainty, or cause that the source did not give, or drops a condition the source attached. One such addition is enough.",
          ],
          beforeAfter: {
            before: "The new rota has cut overtime across all depots.",
            after:
              "At the Wakefield depot, overtime was lower in the eight weeks after the new rota started. No other depot has used it yet.",
            reading:
              "The first version widens one depot to all depots and turns a change over time into a cause. The second follows from the source and keeps its conditions.",
          },
        },
        {
          heading: "What this step is not, and the usual mistake",
          paragraphs: [
            "This step is not about whether you agree with the conclusion, and it is not about style. You may believe the new portal is a success. The question is only whether the evidence you traced in step two can support the sentence as written.",
            "The usual mistake is to stop once every figure has been traced. A reader who has just confirmed three numbers feels the work is done, and the conclusion slips through on the strength of the facts inside it. Read the conclusion again, on its own, and ask what it says that the sources did not.",
          ],
        },
      ],
      workedExample: {
        title: "A survey summary for a leadership pack",
        inputLabel: "The survey report",
        outputLabel: "The sentence the model wrote",
        prompt:
          "In the north region, 62% of respondents who used the new portal rated support as good or very good, compared with 48% of those who did not. The survey was voluntary and the portal was offered first to larger accounts.",
        output:
          "The new portal has improved customer satisfaction across the business, raising support ratings by 14 points.",
        reading: [
          "Both figures trace correctly to the report, and the gap between them is fourteen points. A reader who only traced the numbers would pass this sentence.",
          "The sentence still goes further than the source in three ways. It widens the north region to the whole business. It says the portal raised the ratings, when the report only compares two groups, and larger accounts were offered the portal first, which could explain the difference on its own. It also drops the condition that the survey was voluntary.",
          "A sentence that follows from the source would read: 'In the north region, portal users rated support more highly than non-users, though larger accounts were offered the portal first and the survey was voluntary.' It is less exciting, and it is what the evidence supports.",
        ],
      },
      practice: {
        intro:
          "Here is a line from a complaints report and two conclusions a model could have drawn from it. The four ways a conclusion goes further are listed above, so read each conclusion against them.",
        check: {
          kind: "choose",
          prompt: "Choose the conclusion that follows from the source.",
          material: {
            label: "Complaints report, Fenby Homes, quarter two",
            text: "Complaints about repair times at the Sheffield office fell from 41 to 29 after the online booking form was introduced in May. The Sheffield office also hired two additional schedulers in April.",
          },
          leftLabel: "Conclusion A",
          left: "Complaints about repair times at Sheffield fell from 41 to 29 after May, over the same period in which the online form and two new schedulers were introduced.",
          rightLabel: "Conclusion B",
          right: "The online booking form cut repair complaints by nearly a third and should be rolled out to every office.",
          correct: "left",
          why: "Conclusion A keeps the office, the figures, and both changes, so it follows from the source. Conclusion B turns a pattern into a cause, ignores the two new schedulers who could explain the fall, and widens one office to every office.",
          wrong:
            "Look again at Conclusion B. The report does not say the form caused the fall, and it mentions two new schedulers who arrived at the same time. Rolling out to every office widens the scope beyond Sheffield. Conclusion A follows from the source.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "This source comes from an internal pilot report. Mark each sentence the model wrote from it as Follows from the source or Goes further than the source.",
        material: {
          label: "Pilot report extract",
          text: "Across the six-week pilot, the eight staff in the Leeds office who used the scheduling tool reported spending less time arranging meetings. Two staff stopped using it after week two. No other office took part.",
        },
        passLabel: FOLLOWS,
        failLabel: FURTHER,
        sentences: [
          {
            id: "leeds",
            text: "Staff in the Leeds pilot reported spending less time arranging meetings.",
            fail: false,
            why: "Compare it with the first line of the source. It keeps the same office, the same group, and the same word, reported, so it follows from the source.",
          },
          {
            id: "every-office",
            text: "The tool will save every office time on scheduling.",
            fail: true,
            why: "The source says no other office took part. This sentence claims a result for every office and turns a report into a promise, so it goes further than the source.",
          },
          {
            id: "kept-using",
            text: "Everyone who tried the tool kept using it.",
            fail: true,
            why: "Look at the second line of the source. Two people stopped using the tool after week two, so this sentence drops a condition and goes further than the source.",
          },
        ],
        why: "You tested each conclusion against what the source can carry. You kept the sentence that stayed within Leeds and within what staff reported, and you caught the widened scope, the added certainty, and the dropped condition in the other two.",
      },
      bridge:
        "You now have every step except the decision, and the next lesson puts all four together on three real outputs.",
    },
    {
      id: "judge-three-outputs",
      title: "Judge three outputs",
      emphasis: "Judge",
      place:
        "This is the fifth of seven lessons. It adds the fourth step, the decision, and has you run the whole check on three different pieces of work, as you would in a normal week.",
      sections: [
        {
          heading: "Use or hold",
          paragraphs: [
            "The fourth step is to decide, for each claim, whether it can be used or must be held. In this course a claim is ready to Use when it has been traced to a source with authority over it and the sentence it sits in follows from that source. Both conditions have to be met.",
            "A claim must be put on Hold when it is not traced, when the sentence goes further than its source, or when you ran out of time to check it. A held claim stays held until it is corrected, supported by a source you have opened, or removed. Running out of time is a reason to hold, never a reason to use.",
          ],
        },
        {
          heading: "Holding a claim is not rejecting the output",
          paragraphs: [
            "Holding a claim is not the same as rejecting the whole output. Most outputs are mostly usable, and the work of this step is to find the few sentences that are not. A summary with eleven good sentences and one held claim is a useful summary once that claim is fixed.",
            "This matters because the alternative habits are both costly. Accepting the whole output because most of it is right lets the one wrong sentence through. Throwing the whole output away because one sentence is wrong wastes the work that was sound and teaches people to stop checking at all.",
          ],
        },
        {
          heading: "The decision does not depend on how important the claim feels",
          paragraphs: [
            "It is tempting to trace the claims that feel important and wave through the small ones. The decision rule does not allow that, because a small wrong date in a letter to a client can do as much harm as a wrong figure in a board report. The client reads the date, puts it in a diary, and holds you to it.",
            "Every listed claim gets a decision, and the decision is always recorded. A colleague who picks up the work next week needs to know what was checked, what was used, and what was held, so they do not repeat your work or, worse, assume you checked something you did not.",
          ],
          beforeAfter: {
            before: "Checked the main figures. The rest looked fine.",
            after:
              "Claims 1 to 4: use, traced to the finance report. Claim 5: hold, the case could not be found in the court database, removed before sending.",
            reading:
              "The first note leaves a colleague unable to tell what was checked. The second gives a decision for every claim and says what happened to the one that was held.",
          },
        },
      ],
      workedExample: {
        title: "Three outputs on one morning",
        inputLabel: "What arrived",
        outputLabel: "What the check found",
        prompt:
          "1. A model's summary of a board paper for the finance director.\n2. A draft reply to a customer, Mr Lister, that mentions the refund policy.\n3. A list of five recent cases for a legal briefing, each with a case name and a year.",
        output:
          "1. Board summary: one figure rounded from £1.46 million to £1.5 million in a sentence about a threshold of £1.5 million. Corrected to the exact figure, then used.\n2. Customer reply: the refund window of 30 days matches the published returns policy, section 2. Used.\n3. Legal briefing: two of the five cases could not be found in any law report or court database, and a third exists but concerns a different point. All three held and removed before the briefing went out.",
        reading: [
          "The same four steps worked on three very different documents. The analyst listed the claims in each, traced them, tested the reasoning, and gave every claim a decision.",
          "Most sentences could be used. The rounding in the board summary was harmless in most sentences, but in a sentence about a £1.5 million threshold it changed the meaning, so it was corrected before use.",
          "The held claims were the ones that would have caused real harm. A misstated figure in front of a board leads to a wrong decision, and invented legal authorities in a briefing are the kind of error that has led to lawyers being sanctioned, as in Mata v. Avianca, Inc.",
        ],
      },
      practice: {
        intro:
          "Here are three sentences from a model's summary of a board paper, each with the trace note a colleague wrote. The definitions of Use and Hold are in the first section above, so apply them to each note.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence as Use or Hold, based on its trace note.",
          passLabel: USE,
          failLabel: HOLD,
          sentences: [
            {
              id: "headcount",
              text: "Headcount at the end of March was 312. Trace note: HR system, month-end report for March, total line: 312.",
              fail: false,
              why: "The figure is traced to the system of record and the sentence says no more than the report, so you can use it.",
            },
            {
              id: "attrition",
              text: "Attrition has fallen because of the new hybrid working policy. Trace note: HR report shows attrition fell from 14% to 11%. The report gives no reason.",
              fail: true,
              why: "The figures are traced, but the report gives no reason for the fall. The sentence turns a pattern into a cause, so it goes further than the source and must be held.",
            },
            {
              id: "office",
              text: "The Bristol office lease ends in 2027. Trace note: not yet checked, the lease is in the legal team's system.",
              fail: true,
              why: "A claim that has not been checked is held, however likely it seems. It stays held until someone opens the lease.",
            },
          ],
          why: "That is right. The headcount is traced and follows from its source, so it can be used. The attrition sentence adds a cause and the lease date has not been checked, so both are held.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Each sentence below comes from one of three outputs you have already traced. The trace note is shown with each sentence. Mark each sentence with your decision.",
        passLabel: USE,
        failLabel: HOLD,
        sentences: [
          {
            id: "revenue",
            text: "Revenue for the quarter was £2.4 million. Trace note: finance system, quarter-end report, line 3: £2,412,000.",
            fail: false,
            why: "The trace note shows the figure in the finance report, and the rounding is fair in this sentence. This claim is traced and follows from its source, so you can use it.",
          },
          {
            id: "refunds",
            text: "Refunds are available within 30 days of delivery. Trace note: published returns policy, section 2: refunds within 30 days of delivery.",
            fail: false,
            why: "The trace note shows the same wording in the published policy. There is nothing left to correct, so you can use it.",
          },
          {
            id: "case",
            text: "Smith v Harlow Logistics (2021) confirms this approach. Trace note: not found in the law reports or the court database searched.",
            fail: true,
            why: "The trace note says this case could not be found. A claim that is not traced is held, however specific it looks, and it must not go out until it is found or removed.",
          },
          {
            id: "margins",
            text: "As a result, the board expects margins to recover next year. Trace note: board paper says the board 'will review' margins next year. No expectation stated.",
            fail: true,
            why: "Read the trace note again. The board paper says it will review margins, not that it expects them to recover. The sentence goes further than the source, so it is held.",
          },
        ],
        why: "You used what was traced and followed from its source, and you held the case that could not be found and the sentence that turned a review into an expectation. That is the whole four-step check.",
      },
      bridge:
        "The next lesson brings the four steps together on situations you have not seen, and assesses the whole method before you write your own verification note.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It brings together the method from the first five lessons, works one mixed example, and then assesses the whole method on situations you have not seen, before the final lesson asks you to write your own verification note.",
      sections: [
        {
          heading: "Why confident error needs a method",
          paragraphs: [
            "A language model writes by predicting likely words, and likely words are smooth and confident. It does not check a sentence against the world before writing it, so a wrong figure, a reversed condition, or an invented reference arrives in the same calm voice as a correct one. The tone of a sentence is a property of the writing and tells you nothing about the fact.",
            "The only way to know whether a sentence is right is to compare it with a source you have opened. The four-step check is the routine that makes that comparison complete and repeatable, so that the one wrong sentence in twelve does not leave your desk under your name.",
          ],
        },
        {
          heading: "List, then trace",
          paragraphs: [
            "The first step is to list the claims. A checkable claim is anything that could be true or false: a figure, a date, a name, a quotation, a reference to a law, a policy, or a clause, a statement about what someone agreed, or a commitment. Framing only introduces, connects, or expresses a view, and there is nothing in it to trace. Split sentences that hold more than one claim, and watch for the claim hidden inside a linking phrase.",
            "The second step is to trace each claim to a source with authority over it: the signed contract, the published guidance, the system of record, or the approved minutes. A claim is traced when you can name the source, the place in it, and what it says. A citation the model supplied is a lead to follow, not a source, and two documents repeating the same claim are two copies, not a trace.",
          ],
        },
        {
          heading: "Test, then decide",
          paragraphs: [
            "The third step is to test the reasoning. A sentence can contain only traced facts and still go further than its sources, by widening the scope, turning a pattern into a cause, turning a possibility into a certainty, or dropping a condition. Read each conclusion on its own and ask what it says that the sources did not.",
            "The fourth step is to decide use or hold for every listed claim. A claim is used only when it is traced and follows from its source. Anything else is held until it is corrected, supported, or removed, and running out of time is a reason to hold. The decision does not depend on how important the claim feels, and it is always recorded so a colleague can see what was checked.",
            "The assessment at the end of this lesson sets seven situations you have not seen, in policy, analysis, sales, operations, HR, legal support, and finance. Each question has one right answer, and each draws on one or more of the four steps. You need six of the seven to pass, and after you submit, each question shows the feedback for the option you chose.",
          ],
        },
      ],
      workedExample: {
        title: "One output, all four steps",
        inputLabel: "The paragraph the model drafted for a tender response",
        outputLabel: "The check, step by step",
        prompt:
          "Brennan Facilities has maintained the council's leisure centres since 2019. Our response times meet the four-hour target set in schedule 3 of the current contract. Customer satisfaction has risen every year, which shows our approach is working.",
        output:
          "List: (1) maintained the leisure centres since 2019; (2) four-hour response target in schedule 3; (3) response times meet that target; (4) satisfaction has risen every year.\nTrace: (1) contract start date, signed contract page 1: 1 April 2019, traced. (2) Schedule 3, paragraph 2: target is four hours, traced. (3) Helpdesk report, last 12 months: 91% of jobs within four hours, so the target is met on most jobs but not all. (4) Annual surveys: rose in 2021 and 2022, fell in 2023, not traced as written.\nReasoning: 'which shows our approach is working' turns a pattern into a cause.\nDecision: (1) and (2) use; (3) hold, rewritten as '91% of jobs met the four-hour target'; (4) hold, removed.",
        reading: [
          "The list found four claims, including the rise in satisfaction, which sat in a sentence that read partly as framing.",
          "Tracing confirmed two claims directly. It showed that the third was true for most jobs but not all, and that the fourth was wrong for one of the years. Each trace names the source and the place.",
          "The reasoning test caught the phrase that turned a trend into proof. The decisions then gave every claim an outcome, and the two held claims were rewritten or removed before the response went to the council.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose the better record of the check on the tender paragraph above. The worked example and the section on test, then decide are there if you want them.",
        check: {
          kind: "choose",
          prompt:
            "Choose the record a colleague could use to see what was checked in the Brennan Facilities paragraph.",
          leftLabel: "Record A",
          left: "Reviewed the paragraph against the contract and our reports. Mostly accurate, a couple of tweaks made. Good to submit.",
          rightLabel: "Record B",
          right:
            "Claims 1 and 2 traced to the signed contract, page 1 and schedule 3 paragraph 2, and used. Claim 3 held and rewritten to '91% of jobs met the four-hour target' from the helpdesk report. Claim 4 held and removed, because satisfaction fell in 2023.",
          correct: "right",
          why: "Record B gives each claim its source, its place, and its decision, and says what was changed for each held claim. A colleague could repeat the check from it.",
          wrong:
            "Look again at Record A. It does not say which claims were checked, where, or what the tweaks were, so a colleague could not tell that satisfaction fell in 2023 or that one claim was removed. Record B names each claim, its source, and its decision.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each question has one right answer, and you need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "consultation",
            situation:
              "Gemma Ashworth is a policy officer at Weaver Vale Housing. A model has summarised a council consultation on licensing for her director, and the summary says responses must be in by 30 November. Gemma remembers reading a closing date in December when the consultation was first announced. The summary goes to her director this afternoon.",
            question: "What should Gemma do before the summary goes out?",
            options: [
              {
                id: "a",
                text: "Change the date to December, because she remembers reading it.",
                feedback:
                  "Memory is not a source. Gemma's recollection of a December date is no more reliable than the model's 30 November. Open the consultation document and find the closing date there.",
              },
              {
                id: "b",
                text: "Open the council's consultation document, find the stated closing date, and correct or keep the summary to match it.",
                correct: true,
                feedback:
                  "This is tracing. The consultation document has authority over its own closing date, so finding the date there settles the question, and the trace can go in the note to the director.",
              },
              {
                id: "c",
                text: "Leave the date as it is, because the model stated it precisely.",
                feedback:
                  "A precise date is still only a claim until it is traced. The model writes wrong dates as calmly as right ones. Open the consultation document and check.",
              },
              {
                id: "d",
                text: "Ask a colleague who also read the announcement which date they remember.",
                feedback:
                  "Two memories are two copies of an impression, not a trace. The consultation document is the source with authority, and it is quicker to open than to compare recollections.",
              },
            ],
          },
          {
            id: "citation",
            situation:
              "Daniel Obi is an analyst at Marlow Consulting. A model's draft for a client says regional vacancy rates rose last year and cites 'Office for Regional Statistics, Vacancy Bulletin 2024, table 6'. His manager, Clare, glances at it and says the citation looks fine. The deck goes to the client tomorrow.",
            question: "What should Daniel do with the vacancy claim?",
            options: [
              {
                id: "a",
                text: "Use it, because it has a specific citation and his manager has approved it.",
                feedback:
                  "A specific citation from the model is a lead, not a source, and Clare glanced at it rather than opening it. Models can produce references to tables that do not exist or say something else.",
              },
              {
                id: "b",
                text: "Search for another article that mentions rising vacancy rates, and cite that as well.",
                feedback:
                  "A second article that repeats the claim is a copy, not a trace, and it may have come from the same wrong source. Open the bulletin the model named and look for table 6.",
              },
              {
                id: "c",
                text: "Soften the sentence to 'vacancy rates appear to have risen' and keep the citation.",
                feedback:
                  "Softening the wording does not make the claim traced, and it keeps a citation that nobody has opened. Open the bulletin first, then decide.",
              },
              {
                id: "d",
                text: "Open the named bulletin and find table 6. If it is not there or says something different, hold the claim until it is corrected or removed.",
                correct: true,
                feedback:
                  "This treats the citation as a lead to follow. If table 6 confirms the claim, Daniel has a real trace. If not, the claim is held, which is exactly what the check is for.",
              },
            ],
          },
          {
            id: "hidden-claim",
            situation:
              "Sofia Marsh is an account manager at Pemberton Print. A model drafted an update for a client, and she is listing the claims before tracing. One sentence reads: 'Building on the success of the spring campaign, which reached 40,000 households, we propose a second run in September.'",
            question: "How should Sofia list this sentence?",
            options: [
              {
                id: "a",
                text: "As three claims: the spring campaign happened, it reached 40,000 households, and a September run is proposed.",
                correct: true,
                feedback:
                  "That is right. The linking phrase hides a figure and an event, and the proposal is a commitment. Each could be wrong on its own, so each gets its own line.",
              },
              {
                id: "b",
                text: "As framing only, because 'building on the success' is a view.",
                feedback:
                  "'Building on the success' is a view, but the sentence also holds a figure, 40,000 households, and a proposed date. Those are checkable claims hidden inside a linking phrase.",
              },
              {
                id: "c",
                text: "As one claim, the 40,000 households, because that is the only number.",
                feedback:
                  "The figure is a claim, but so are the fact that the spring campaign ran and the proposal for September. Listing only the number lets the other two slip past.",
              },
            ],
          },
          {
            id: "depot",
            situation:
              "Liam Carter is an operations analyst at Northgate Logistics. The source is a report that says late deliveries at the Doncaster depot fell from 9% to 6% in the three months after route software was installed, and that two new drivers joined in the same period. A model's summary for the operations director says: 'The route software has reduced late deliveries across the network by a third.'",
            question: "What is the problem with the summary sentence?",
            options: [
              {
                id: "a",
                text: "The figures are wrong, because 9% to 6% is not a fall of a third.",
                feedback:
                  "The arithmetic holds: a fall from 9% to 6% is a third. The problem is what the sentence claims about those figures, which is where the reasoning test looks.",
              },
              {
                id: "b",
                text: "Nothing, because every figure in it can be traced to the report.",
                feedback:
                  "Traced figures are not enough. The sentence widens one depot to the network and credits the software when two new drivers joined at the same time. It goes further than the source.",
              },
              {
                id: "c",
                text: "It widens Doncaster to the whole network and turns a pattern into a cause, ignoring the two new drivers.",
                correct: true,
                feedback:
                  "That is the reasoning test. The facts are right, but the sentence adds scope and cause that the report did not give, so it is held and rewritten to stay within Doncaster and mention both changes.",
              },
              {
                id: "d",
                text: "It should say 'may have reduced' to sound less certain.",
                feedback:
                  "Adding 'may' softens the certainty but leaves the widened scope. The sentence still claims a result for the network from one depot. It needs rewriting to follow from the source.",
              },
            ],
          },
          {
            id: "out-of-time",
            situation:
              "Aisha Rahman is an HR adviser at Tarn Valley NHS Trust. She is checking a model's draft of a letter to a staff member about a return-to-work meeting. Every claim is traced except one: 'Your phased return can last up to eight weeks under the Trust's policy.' The policy portal is down, and the letter is due to go by 5pm.",
            question: "What should Aisha do with the phased return sentence?",
            options: [
              {
                id: "a",
                text: "Use it, because eight weeks sounds about right and the rest of the letter is traced.",
                feedback:
                  "A claim that sounds right is not traced. The staff member will plan around eight weeks, and if the policy says something else the Trust has made a promise it may not keep. Hold it.",
              },
              {
                id: "b",
                text: "Hold it: send the letter without that sentence, or say the length will be confirmed, and record that the claim was not traced.",
                correct: true,
                feedback:
                  "Running out of time is a reason to hold, never a reason to use. The rest of the letter can still go, and the record tells a colleague exactly what is still to be checked.",
              },
              {
                id: "c",
                text: "Delay the whole letter until the portal is back, even if it misses the deadline.",
                feedback:
                  "Holding one claim does not mean holding the whole output. The rest of the letter is traced and can go on time without the one sentence that is not.",
              },
              {
                id: "d",
                text: "Ask the model to confirm the Trust's policy on phased returns.",
                feedback:
                  "The model has not read the Trust's policy, so its answer would be another unchecked claim. The source with authority is the policy itself. Hold the sentence until it can be opened.",
              },
            ],
          },
          {
            id: "note",
            situation:
              "Ben Hollis is a paralegal at Ferris & Lowe. A colleague, Marta, hands him a model's summary of a lease with a note that reads: 'Produced with AI and reviewed. Looks accurate.' Ben is asked to send the summary to the client this morning.",
            question: "What should Ben do?",
            options: [
              {
                id: "a",
                text: "Send it, because Marta has already reviewed it.",
                feedback:
                  "Marta's note does not say what she checked or against which source, so Ben cannot tell whether the break clause or the rent review was traced. A review that cannot be repeated is not a verification.",
              },
              {
                id: "b",
                text: "Add a disclaimer to the summary saying it was produced with AI.",
                feedback:
                  "A disclaimer tells the client nothing about what was checked, and it does not make any claim traced. Ben needs to know which claims were traced and what was decided.",
              },
              {
                id: "c",
                text: "Rewrite the summary himself from scratch without using the model's version.",
                feedback:
                  "Rewriting throws away work that may be sound and gives no more reason to trust the new version. The better move is to find out what was checked, and check what was not.",
              },
              {
                id: "d",
                text: "Ask Marta which claims she traced and to which clauses, and check any claim that has no trace before sending.",
                correct: true,
                feedback:
                  "That turns 'looks accurate' into something a colleague can rely on. Every claim needs a source, a place, and a decision, and anything without them is held until it is checked.",
              },
            ],
          },
          {
            id: "tone",
            situation:
              "Omar Siddiqui is a finance business partner at Kestrel Foods. A model's commentary for the monthly pack contains two sentences: 'It appears that distribution costs may have risen slightly in June' and 'Marketing spend was £84,000, exactly on budget.' He has ten minutes before the pack is locked.",
            question: "Which sentences does Omar need to trace?",
            options: [
              {
                id: "a",
                text: "Only the first, because it is hedged and the model sounds unsure.",
                feedback:
                  "The hedge tells you about the writing, not the fact. The marketing figure is stated firmly and is the one a reader will copy, so it needs tracing just as much.",
              },
              {
                id: "b",
                text: "Only the second, because the first is too vague to be a claim.",
                feedback:
                  "The first sentence is hedged, but it still says distribution costs rose in June, which the ledger could confirm or contradict. Both sentences contain checkable claims.",
              },
              {
                id: "c",
                text: "Both, against the ledger and the budget, because tone is not evidence either way.",
                correct: true,
                feedback:
                  "That is the opening lesson of the course. A hedged sentence can be right and a firm sentence can be wrong. Both contain claims, so both are traced before the pack is locked.",
              },
            ],
          },
        ],
        why: "You applied the whole method to situations you had not seen. You traced to sources with authority rather than memory, repeats, or the model's own citations, listed hidden claims, caught conclusions that went further than their sources, held what was not traced, and did not let tone decide what to check.",
      },
      bridge:
        "You have now used every step of the check on new situations. In the last lesson you will run it on a real piece of AI output of your own and write the verification note that your record will show.",
    },
    {
      id: "the-verification-note",
      title: "The verification note",
      emphasis: "note",
      place:
        "This is the last lesson. You will run the four-step check on a real piece of AI output and write the verification note, which is the work your record will show.",
      sections: [
        {
          heading: "What a verification note is",
          paragraphs: [
            "A verification note is a short written record of the four-step check on one real piece of output. It says what the output is and who it is for, lists the claims, names where each was traced, records what the reasoning test found, and gives the decision for each claim. It fits on one screen.",
            "Its purpose is to let a colleague or a manager see what was checked, repeat the check if they need to, and know what was held and why. If the source changes later, such as a contract that is amended, the note tells them which claims depend on it.",
          ],
        },
        {
          heading: "What a verification note is not",
          paragraphs: [
            "A verification note is not a disclaimer. A line such as 'This was produced with AI and reviewed' is not a verification note, because it tells the reader nothing about what was reviewed or against what. The reader cannot repeat a review that is not described.",
            "It is also not a certificate that the output is correct in every respect. It is an honest account of what you traced and what you decided. If you held a claim because you ran out of time, the note says so, and that honesty is what makes the rest of the note worth trusting.",
          ],
        },
        {
          heading: "Write each part so a colleague could repeat it",
          paragraphs: [
            "The test for each line of the note is whether a colleague could repeat your check from it without asking you what you did. A line is Repeatable when a colleague could open the same source, go to the same place, and reach the same decision. 'Signed agreement, clause 14.1' is repeatable. 'Checked against the contract' is not, because the contract has forty clauses.",
            "A line where A colleague would have to ask is one that leaves out the source, the place, or the decision, or that describes a feeling rather than a check. Number the claims, and use the same numbers in the traced, reasoning, and decision parts, so that every claim can be followed from one end of the note to the other.",
          ],
        },
        {
          heading: "How the note is checked",
          paragraphs: [
            "When you continue, each part of the note is checked in turn. Output checked has to say what the output is and who it is for or where it will be used, with at least one name, date, or number. Claims has to be a numbered list with at least two claims. Traced has to name a place in a source, such as a clause, section, paragraph, page, schedule, or table, or say 'not traced'. Reasoning has to say whether any sentence goes further than its source, and if none does, it says so. Decision has to give use or hold for the claims.",
            "Do not put anything confidential into the note. It will appear on a record that a second person can open, so use names and figures you would be comfortable showing, or replace them with realistic examples that keep the same shape. When every part is present, you can sign your name against the note.",
          ],
        },
      ],
      workedExample: {
        title: "A note on a supplier agreement summary",
        inputLabel: "The output checked",
        outputLabel: "The verification note",
        prompt:
          "A model's two-paragraph summary of the Northway supplier agreement, prepared for the operations manager before the renewal meeting on 12 May.",
        output:
          "Output checked: summary of the Northway supplier agreement for the operations manager, for use in the renewal meeting on 12 May.\nClaims: (1) 90 days' notice to terminate; (2) notice by recorded delivery to the registered office; (3) prices fixed until 31 March; (4) the supplier must offer a renewal discount.\nTraced: (1) and (2) signed agreement, clause 14.1 and 14.2; (3) schedule 2, paragraph 1; (4) not traced, schedule 2 says a discount 'may be discussed'.\nReasoning: the summary called the discount a right, which goes further than the source.\nDecision: (1) to (3) use; (4) held and rewritten as 'a discount may be discussed at renewal'.",
        reading: [
          "A manager reading this note can see what was checked, where to look, and the one sentence that changed. Every claim has a number, and the number appears in each later part.",
          "The held claim is the one that mattered most in a renewal meeting. Walking in believing the supplier must offer a discount would have weakened the negotiation the moment the supplier pointed to schedule 2.",
          "If the agreement is later amended, the note tells the next reader which clauses to recheck. That is the difference between a note and a line saying the summary was reviewed.",
        ],
      },
      practice: {
        intro:
          "Before you write your own note, read these lines from a colleague's draft note and mark each one. The definitions of Repeatable and A colleague would have to ask are in the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each line of this draft note as Repeatable or A colleague would have to ask.",
          passLabel: REPEATABLE,
          failLabel: ASK,
          sentences: [
            {
              id: "output",
              text: "Output checked: model summary of the Q2 staff survey for the leadership team meeting on 3 July.",
              fail: false,
              why: "This names the output, the audience, and the meeting, so a colleague knows what the check was for. It is repeatable.",
            },
            {
              id: "trace-vague",
              text: "Traced: all claims checked against the survey results.",
              fail: true,
              why: "This does not say which claims, or where in the results each was found. A colleague would have to ask which table or page to open.",
            },
            {
              id: "trace-good",
              text: "Traced: (2) survey results workbook, tab 'Engagement', row 14: 71% agree.",
              fail: false,
              why: "This names the source, the place, and what it says for a numbered claim, so a colleague could open the same row and see the same figure.",
            },
            {
              id: "decision-vague",
              text: "Decision: fine to use.",
              fail: true,
              why: "This does not say which claims were used or whether any were held. A colleague would have to ask what was decided for each one.",
            },
          ],
          why: "That is right. The output line and the numbered trace to row 14 are repeatable, and the other two lines would leave a colleague asking which claims were checked and what was decided for each.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Choose one real piece of AI output you need to use this week. Run the four-step check on it and write your verification note. A colleague should be able to repeat your check from what you write.",
        fields: [
          {
            id: "output",
            label: "Output checked",
            hint: "What the output is, who it is for, and where it will be used, with a name, a date, or a number.",
            min: 20,
            rule: "fact",
            any: ["for", "use", "meeting", "send", "report", "brief", "client", "manager", "team"],
            missing:
              "Output checked needs more. Say what the output is, who it is for, and where it will be used, with at least one name, date, or number, so a reader knows what the check was for.",
          },
          {
            id: "claims",
            label: "Claims",
            hint: "Every checkable claim, one per line, numbered (1), (2), and so on.",
            min: 20,
            rule: "fact",
            any: ["2"],
            missing:
              "List each checkable claim on its own numbered line, starting (1), (2). Most real outputs contain more than one claim.",
          },
          {
            id: "traced",
            label: "Traced",
            hint: "For each numbered claim, the source, the place in it, and what it says, or 'not traced'.",
            min: 30,
            any: ["clause", "section", "paragraph", "page", "schedule", "table", "article", "minute", "tab", "not traced"],
            missing:
              "A trace needs a source with authority over the claim and the place in it, such as a clause, section, paragraph, page, or table, or the words 'not traced'. The model's answer or a colleague's note is not a source.",
          },
          {
            id: "reasoning",
            label: "Reasoning",
            hint: "Any sentence that goes further than its source, and what it adds. If none does, say so.",
            min: 15,
            any: ["goes further", "go further", "went further", "follows", "adds", "added", "widen", "cause", "no sentence", "nothing"],
            missing:
              "Say whether any sentence goes further than its source and what it adds. If none does, write 'no sentence goes further than its source'.",
          },
          {
            id: "decision",
            label: "Decision",
            hint: "Use or hold for each numbered claim, and what you changed for each held claim.",
            min: 10,
            any: ["use", "hold", "held"],
            missing:
              "Give a decision of use or hold for each numbered claim, and say what you did with each held claim: corrected it, found support, or removed it.",
          },
        ],
        why: "Your note lists the claims, traces each one to a place in a source, records the reasoning test, and gives a decision a colleague could follow. This is the work that will appear on your record.",
      },
      bridge:
        "Your note is ready. Sign your name below, and the record will show this note, the course, and the date to anyone who opens the reference.",
    },
  ],
};
