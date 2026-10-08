/*
Course: Applying AI in Daily Work
Slug: applying-ai-in-daily-work
For: Professionals in operations, project management, sales support, administration, finance, and professional
  services who have access to an AI tool at work, have tried it a few times, and have not yet made it part of how
  they work. They own recurring work such as reports, updates, meeting follow-ups, and small decisions, and they
  know their organisation's basic rules on what may be shared with the tool.
Outcome: The learner names three pieces of work they already own that suit an AI tool, says for each whether they
  will draft, summarise, or prepare a decision with it, explains why a fourth piece of work should not start with
  the tool, and writes a weekly plan with a day, a move, and a check for each task and a fixed review.
Artefact: The weekly loop.
Record sentence: Wrote and signed a weekly plan that puts an AI tool inside three pieces of work they own, with a
  check on each output, one deliberate exception, and a fixed time to review the habit.
Lessons (id, title, move, interaction, pass rule):
  1. pick-the-work, Pick the work, test a task against four criteria, mark (Good first task / Not a first task),
     every task marked correctly.
  2. draft, Draft, write a draft request with reader, facts, limit, and shape, practice edit then check choose,
     edit keeps the reader, adds a fact, a shape, and a limit sentence on invented dates or figures; choose picks
     the request that supplies all four.
  3. summarise, Summarise, check each summary sentence against its source, mark (In the notes / Not in the notes),
     every sentence marked correctly.
  4. decide, Decide, ask for a comparison against your criteria and keep the choice, practice edit then check
     choose, edit keeps the suppliers, adds criteria and 'not stated', and sets a limit on recommending; choose
     picks the request that keeps the decision.
  5. when-not-to-start-with-the-tool, When not to start with the tool, apply the four reasons, practice choose then
     check mark (Start with the tool / Start without the tool), every piece of work marked correctly.
  6. course-assessment, Course assessment, apply every move to new situations, practice choose then scenario of
     seven questions, six of seven correct.
  7. a-weekly-loop, A weekly loop, write the loop, practice build then build artefact, each task names a day and a
     move, the exception names one of the four reasons, and the review has a day or time and its questions.
Sources: UK Government, AI Playbook for the UK Government; OECD, Recommendation of the Council on Artificial
  Intelligence; UK Information Commissioner's Office, Guidance on AI and data protection; Microsoft 365 Copilot and
  Gemini for Google Workspace documentation for vendor guidance on drafting and summarising.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const GOOD_TASK = "Good first task";
const NOT_FIRST = "Not a first task";
const IN_NOTES = "In the notes";
const NOT_IN_NOTES = "Not in the notes";
const WITH_TOOL = "Start with the tool";
const WITHOUT_TOOL = "Start without the tool";

export const COURSE: CourseContent = {
  slug: "applying-ai-in-daily-work",
  hours: 2.5,
  artefact: {
    lessonId: "a-weekly-loop",
    title: "The weekly loop",
    recordLine:
      "Wrote and signed a weekly plan that puts an AI tool inside three pieces of work they own, with a check on each output, one deliberate exception, and a fixed time to review the habit.",
  },
  lessons: [
    {
      id: "pick-the-work",
      title: "Pick the work",
      emphasis: "work",
      place:
        "This is the first of seven lessons. Everything else in the course is practised on the tasks you choose here, so the choice deserves more care than it usually gets.",
      sections: [
        {
          heading: "Why the first task decides whether the habit holds",
          paragraphs: [
            "Most people who try an AI tool at work and then stop using it did not stop because the tool was poor. They stopped because the first thing they tried was the wrong kind of work. Some started with a task so small that setting it up took longer than doing it. Others started with a task so unfamiliar that they could not tell whether the output was right, so they either trusted it and were caught out, or distrusted it and did the work again by hand.",
            "This course asks you to pick three pieces of work you already do and to build the tool into those, rather than looking for new things the tool could do. Work you already own has a known standard, a known reader, and a known place in the week. That is what makes it possible to judge the output and to keep using the tool after the first attempt.",
          ],
        },
        {
          heading: "Four criteria for a first task",
          paragraphs: [
            "A good first task meets four criteria. First, it repeats, at least weekly or monthly, so the time you spend setting up the request is repaid many times. Second, you own it, which means you decide how it is done and can change the method without asking anyone's permission. Third, you can judge it, because you know what a good version looks like and you would notice a wrong date, a missing risk, or a figure that is out of line. Fourth, its inputs are safe to share with the tool under your organisation's rules.",
            "In this course, a task that meets all four criteria is called a Good first task. A task that fails any one of them is called Not a first task. That label does not mean the task can never be done with a tool. It means the task is the wrong place to build the habit, because a failure on any one criterion either wastes the effort, takes a decision that is not yours, lets an error through, or puts material in the tool that should not be there.",
            "Safe to share deserves particular attention. Your organisation may have a written policy, an approved tool, or only an informal understanding, and public guidance such as the UK Information Commissioner's Office material on AI and data protection explains why personal data needs care. If you are not sure whether a task's inputs may go into the tool, treat it as Not a first task until you have asked.",
          ],
        },
        {
          heading: "What picking the work is not",
          paragraphs: [
            "Picking the work is not the same as picking the task you most dislike. The task you dread is often the one you understand least, or the one that involves difficult people or sensitive material, and those are exactly the conditions in which an error slips through unnoticed. A dull task that you know inside out is a far better place to start.",
            "It is also not a search for the most impressive use. A tool that writes your weekly supplier summary in a form you can check in three minutes is worth more to your week than a tool that once drafted an ambitious strategy paper nobody read. The aim of this lesson is a short list of ordinary work where the tool will be used every week.",
          ],
          beforeAfter: {
            before: "I will use the tool for the quarterly board paper, because it is the piece of work I find hardest.",
            after:
              "I will use the tool for the Monday stand-up notes, because I write them every week, I chair the meeting, and I would notice at once if a decision were missing.",
            reading:
              "The first choice is driven by dislike, and the board paper fails the repeats test and probably the own it test. The second choice meets all four criteria, so it is where the habit can form.",
          },
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The most common mistake is to test a task against one criterion and stop. A task that repeats every week can still fail because its inputs are personal data, and a task you own can still fail because you do not know the subject well enough to judge the output. Run all four criteria on every task, even when the first one looks decisive.",
            "The second mistake is to keep a task on the list because it would save a lot of time if it worked. Time saved on a task you cannot judge is not saved at all, because either you check it so thoroughly that you might as well have written it, or you do not check it and someone else finds the error.",
          ],
        },
      ],
      workedExample: {
        title: "A project coordinator's week",
        inputLabel: "Six tasks from Grace Mensah's week",
        outputLabel: "The three she chose, and why the others were ruled out",
        prompt:
          "Grace Mensah is a project coordinator at Aldermoor Facilities. Her normal week includes: the Friday status update to the project sponsor; notes from the Monday stand-up, which she chairs; a one-off speech for a colleague's leaving party; the monthly supplier performance summary; a salary review recommendation for a team member; and replies to routine questions in the shared project inbox.",
        output:
          "Chosen: the Friday status update, the Monday stand-up notes, and the monthly supplier performance summary. Ruled out: the leaving speech, because it does not repeat. The salary recommendation, because its inputs are personal data she is not permitted to share and because it is a judgement about a person. The inbox replies, for now, because they depend on a policy owned by the facilities director, not by her.",
        reading: [
          "Each of the three tasks she chose repeats, is hers to change, and is one where she would notice at once if a date were wrong or a risk were missing. None of them needs her to paste anything she is not allowed to paste, because the material is her own project information.",
          "The tasks she ruled out each fail a different criterion. The speech fails the repeats test. The salary recommendation fails the safe to share test and is a judgement about a person. The inbox replies fail the own it test, because the answers depend on rules she does not set.",
          "None of the three ruled-out tasks is a bad use of a tool in every circumstance. They are simply poor places to build a weekly habit, and Grace has written down why, which means she can return to them later when the reason changes.",
        ],
      },
      practice: {
        intro:
          "Here are two tasks from a sales support coordinator's week. Mark each one using the four criteria. The criteria and the worked example are above if you want to read them again.",
        check: {
          kind: "mark",
          prompt: "Mark each task as a Good first task or as Not a first task.",
          passLabel: GOOD_TASK,
          failLabel: NOT_FIRST,
          sentences: [
            {
              id: "order-exceptions",
              text: "Writing the weekly order exceptions report from the dispatch log that he maintains himself.",
              fail: false,
              why: "It repeats weekly, he owns the report, he knows the dispatch log well enough to judge it, and the log is internal material he maintains, so it meets all four criteria.",
            },
            {
              id: "keynote",
              text: "Drafting the sales director's keynote for next year's industry conference.",
              fail: true,
              why: "It happens once and the words belong to the sales director, so it fails the repeats test and the own it test.",
            },
          ],
          why: "That is right. The exceptions report meets all four criteria, and the keynote fails two of them, so it is not where the habit should start.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Here are four tasks from Imogen Hart's week. She is a finance analyst at Redbrook Housing. Mark each one using the four criteria from this lesson.",
        passLabel: GOOD_TASK,
        failLabel: NOT_FIRST,
        sentences: [
          {
            id: "cash-commentary",
            text: "Writing the weekly cash position commentary from the figures she prepares herself.",
            fail: false,
            why: "It repeats every week, she owns it, she knows the figures well enough to spot an error, and the figures are internal material she prepares herself. It meets all four criteria.",
          },
          {
            id: "director-speech",
            text: "Drafting a single speech for the finance director's conference appearance.",
            fail: true,
            why: "This task happens once, so it will not build a habit, and the words belong to the finance director. It fails two of the four criteria.",
          },
          {
            id: "budget-notes",
            text: "Summarising the notes from the monthly budget holders' meeting that she chairs.",
            fail: false,
            why: "It repeats monthly, she chairs the meeting and owns the notes, and she was in the room, so she would notice if the summary left out a decision.",
          },
          {
            id: "contracts",
            text: "Preparing a recommendation on which employees' fixed-term contracts should not be renewed.",
            fail: true,
            why: "The inputs are personal data about named employees, and the output is a judgement about their jobs. It fails the safe to share test and is not where to build a habit.",
          },
        ],
        why: "You tested each task against all four criteria rather than choosing the one that felt most tedious. The commentary and the budget notes are good first tasks, and the speech and the contract recommendation each fail at least one criterion, so neither is where the habit should start.",
      },
      bridge:
        "The next lesson takes the first of three moves you can make on a chosen task, which is asking the tool for a draft.",
    },
    {
      id: "draft",
      title: "Draft",
      emphasis: "Draft",
      place:
        "This is the second of seven lessons and the first of three on what you ask the tool to do once you have chosen the work. The three moves are draft, summarise, and decide.",
      sections: [
        {
          heading: "What drafting with a tool means",
          paragraphs: [
            "To draft with a tool is to give it your own material and ask for a first version that you will then edit into the finished piece. The material is what makes the draft useful. It includes the notes you would otherwise have typed up, the facts that are true this week, the person who will read the piece, and the point you need to make to them.",
            "A model asked to write the Friday update with nothing else will still write one. It will produce a plausible update about a project it knows nothing about, with phrases such as strong progress across all workstreams, and you will then have to replace almost every sentence. A request with no material saves you nothing, because the draft has nothing of yours in it.",
          ],
        },
        {
          heading: "The four things a draft request needs",
          paragraphs: [
            "A draft request that gives you something to edit, rather than something to rewrite, does four things. It says who the piece is for, because a sponsor reading on a phone needs something different from a team reading at a desk. It gives the facts, stated plainly, including anything that has not happened or has not been agreed. It says what must not be added, usually dates, figures, risks, or commitments that you have not supplied. It says what shape you want back, such as five lines, three short paragraphs, or a table.",
            "The limit is the part people most often leave out. A model writes what a piece of that kind usually contains, and status updates usually contain a go-live date, so a request without a limit tends to produce one. A single sentence such as 'Do not add any dates or risks I have not listed' closes that gap.",
          ],
          beforeAfter: {
            before: "Write a project status update for the sponsor.",
            after:
              "Draft the Friday status update for our sponsor, the operations director, who reads it on her phone. Facts: the data migration finished on Wednesday; user testing starts on Monday; one risk, the trainer is on leave in week three and no cover is agreed. Do not add any dates or risks I have not listed. Five lines: status, done, next, risk, what I need from her.",
            reading:
              "The second request names the reader, gives three facts and one thing that has not been agreed, sets a limit on invented dates and risks, and asks for five lines. The draft it produces is built from the coordinator's own material.",
          },
        },
        {
          heading: "What drafting is not",
          paragraphs: [
            "A draft is not the finished work. The time you save comes from not starting with a blank page, and it does not come from skipping your own reading. You still own every sentence that goes out under your name, so you read the draft as carefully as you would read a draft from a new colleague.",
            "Drafting is also not a way to find out the facts. If you do not know whether the migration finished, the tool does not know either, and it will write whichever version sounds more like a normal update. Find the facts first, then ask for the draft.",
          ],
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The usual mistake is to ask for tone instead of giving facts. Requests such as 'make it professional' or 'highlight our achievements' feel like instructions, but they give the model nothing to work from and a reason to invent. A request to highlight achievements, with no achievements listed, is an invitation to make some up.",
            "The second mistake is to judge the request by its length. A long request can still be missing the limit, and a short one can hold all four parts. Before you run it, point to the sentence that names the reader, the sentence that gives the facts, the sentence that sets the limit, and the sentence that sets the shape.",
          ],
        },
      ],
      workedExample: {
        title: "Two requests for the same Friday update",
        inputLabel: "Grace's two requests",
        outputLabel: "What each request produced",
        prompt:
          "First request: 'Write a project status update for the sponsor.' Second request: 'Draft the Friday status update for our sponsor, the operations director, who reads it on her phone. Facts: the data migration finished on Wednesday; user testing starts on Monday; one risk, the trainer is on leave in week three and no cover is agreed. Do not add any dates or risks I have not listed. Five lines: status, done, next, risk, what I need from her.'",
        output:
          "First request: three paragraphs about strong progress across all workstreams and continued stakeholder engagement, ending with 'We remain on track for go-live on 30 September.' Second request: 'Status: on track. Done: data migration finished on Wednesday. Next: user testing starts on Monday. Risk: the trainer is on leave in week three and no cover is agreed. From you: a decision on training cover by Thursday's call.'",
        reading: [
          "The first request produced text with no facts from the project in it. Grace would have had to rewrite every line, so the tool saved her nothing.",
          "The first draft also invented a go-live date of 30 September that nobody had agreed. If it had gone to the sponsor, the sponsor could have repeated that date to the board.",
          "The second request took under a minute longer to write. The draft used her facts, kept to five lines, and ended with a clear request. Her only edit was to change 'Thursday's call' to 'Thursday', because she had not asked for a call, which is a reminder that she still reads every line.",
        ],
      },
      practice: {
        intro:
          "Owen Clarke is the office manager at Fenwick and Hale. He needs the Monday update on the office move for the facilities director, Carol Price, who reads it on her phone. Edit his request below so that it names the reader, gives the facts shown, says what must not be added, and asks for a shape. The before and after in the section above is still there to compare.",
        check: {
          kind: "edit",
          prompt:
            "Rewrite Owen's request so that it gives him a draft he can edit rather than rewrite. Keep the reader, add at least one of his facts, add a sentence that says what the draft must not add, and say what shape he wants back.",
          material: {
            label: "The facts Owen has",
            text: "The crates arrive on Tuesday 14 October. 38 of the 45 desks are labelled. The goods lift is booked from 7am on Wednesday. No date has been agreed for moving the server cabinet.",
          },
          label: "The request you are improving",
          start: "Write an update on the office move for the facilities director. Keep it positive.",
          unchanged:
            "You have not changed the request yet. Add Owen's facts, a sentence that starts with do not and names what must not be added, and the shape of the update.",
          keep: [
            {
              id: "reader",
              any: ["facilities director", "carol"],
              missing:
                "Keep the reader. The request should still say that the update is for Carol Price, the facilities director.",
            },
            {
              id: "facts",
              any: ["14 october", "38", "goods lift", "7am", "server cabinet"],
              missing:
                "Add Owen's facts. The request should give at least one of them, such as the crates arriving on Tuesday 14 October or 38 of the 45 desks being labelled.",
            },
            {
              id: "shape",
              any: ["lines", "sentences", "paragraph", "bullet", "points", "table"],
              missing:
                "Say what shape the update should take, for example five short lines or three sentences, so that Carol can read it on her phone.",
            },
          ],
          limits: [
            {
              id: "invention",
              any: ["dates", "a date", "any date", "figure", "number", "risk", "anything", "not listed", "not given"],
              missing:
                "Your request does not yet say what the draft must not add. Write a sentence such as 'Do not add any dates or figures I have not listed', because a move update usually contains dates and the server cabinet has none.",
            },
          ],
          why: "That request will give Owen a draft he can edit. It still names Carol as the reader, it gives the facts, it says the draft must not add dates or figures he has not listed, and it asks for a shape she can read on her phone.",
          result: {
            label: "The draft Owen's request produces",
            text: "Status: on track for the move. Done: 38 of the 45 desks are labelled. Next: the crates arrive on Tuesday 14 October, and the goods lift is booked from 7am on Wednesday. Open: no date has been agreed for moving the server cabinet. From you: who should agree that date.",
          },
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Lucy Adeyemi is a team leader at Parkway Home Insurance. She wants a first draft of the weekly customer service report for her head of department, Martin Shaw. Choose the request that will give her a draft she can edit rather than rewrite.",
        leftLabel: "Request A",
        left: "Write a weekly customer service report. Make it professional and highlight our achievements.",
        rightLabel: "Request B",
        right:
          "Draft this week's customer service report for my head of department, Martin Shaw. Facts: 412 tickets received, 396 closed, average first response 3 hours 10 minutes, one complaint escalated about a delayed refund. Do not add figures or events I have not listed. Four short paragraphs: volumes, response time, the escalation, and one thing I need from him.",
        correct: "right",
        why: "Request B names the reader, supplies the facts, stops the model adding figures or events, and says what shape to return. The draft will be built from Lucy's material, so she can edit it rather than rewrite it.",
        wrong:
          "Look again at Request A. It gives the model no facts, so it will write a report about a team it knows nothing about, and asking it to highlight achievements invites it to invent some. Request B supplies the reader, the facts, a limit, and a shape.",
      },
      bridge:
        "The next lesson turns to the second move, summarising, where the risk is not invention from nothing but a summary that quietly changes its source.",
    },
    {
      id: "summarise",
      title: "Summarise",
      emphasis: "Summarise",
      place:
        "This is the third of seven lessons and the second of the three moves. Summarising is often the first thing people ask a tool to do, and it is the move most often trusted without a check.",
      sections: [
        {
          heading: "What a good summary keeps",
          paragraphs: [
            "To summarise with a tool is to give it a source, such as meeting notes, a report, or an email thread, and ask for a shorter version that keeps what matters. In most workplace summaries, what matters is the decisions that were made, the actions and who owns each one, the dates that were set, and the questions that are still open.",
            "A summary is useful when it keeps all of those and adds nothing that was not in the source. That second condition is the one people forget. A summary can be short, clear, and well organised and still contain a sentence that nobody said, and a short summary is read more quickly and trusted more readily than the notes it came from.",
          ],
        },
        {
          heading: "How a summary changes its source",
          paragraphs: [
            "Models summarise fluently, but they make three kinds of change that matter at work. They can turn a suggestion into a decision, so that 'Tom suggested moving the demo' becomes 'the demo is moving'. They can add an owner or a date that sounds right, so that 'raised with IT' becomes 'IT will fix it by Wednesday'. They can merge two separate points into one, so that two people's actions become a single action with the wrong owner.",
            "Each of these changes produces a sentence that reads naturally and would pass a quick glance. That is why a summary is not something to forward unread. The person who receives it will act on the decision, chase the owner, or plan around the date, and none of those things was agreed.",
          ],
          beforeAfter: {
            before: "Summarise these notes.",
            after:
              "Summarise these notes in three headings: Decisions, Actions with owners, and Open questions. Only include a decision if the notes say it was agreed. Do not add owners or dates that are not in the notes.",
            reading:
              "The second request fixes the shape and sets a limit. The fixed shape makes a missing or invented item easy to see, because every action must have an owner from the notes and every decision must have been agreed.",
          },
        },
        {
          heading: "The check: in the notes or not",
          paragraphs: [
            "The check for a summary is simple, and it takes a few minutes. Put the summary beside the source, read each sentence of the summary, and give it one of two labels. A sentence is In the notes when everything it says, including who, what, and when, can be found in the source. A sentence is Not in the notes when any part of it cannot be found there, including a decision that was only a suggestion, a date that was never set, or an owner who was never named.",
            "When you find a sentence that is Not in the notes, correct it in the summary before it goes anywhere, and if the same kind of change keeps appearing, add a limit to your request. The label is about the source, not about whether the sentence is plausible. A sentence can be very likely true and still be Not in the notes, and in that case it is not yours to send without checking.",
          ],
        },
        {
          heading: "What summarising is not",
          paragraphs: [
            "Summarising is not a substitute for being at the meeting or reading the report. The check works because you can compare the summary with a source you understand. If you were not in the room and the notes are thin, the tool cannot recover what was said, and a fluent summary of thin notes is still thin.",
            "The usual mistake is to check only the parts of the summary that look surprising. The dangerous sentences are the ones that look unsurprising, because they are what the meeting would normally have decided. Read every sentence, including the ones you expected to see.",
          ],
        },
      ],
      workedExample: {
        title: "A stand-up summary with two changes",
        inputLabel: "The stand-up notes",
        outputLabel: "The summary the tool wrote",
        prompt:
          "Priya: testing environment still down, raised with IT, no date yet. Tom suggested we move the client demo to Thursday, not agreed, Sam to check with the client. Travel budget line still unclear.",
        output:
          "Decisions: the client demo is moving to Thursday. Actions: IT will restore the testing environment by Wednesday; Sam will confirm the demo date with the client. Open: travel budget.",
        reading: [
          "Two sentences are Not in the notes. The demo move was a suggestion that had not been agreed, and the summary lists it as a decision. IT has no date in the notes, and the summary gives them Wednesday.",
          "If this summary had gone to the client lead, the demo might have been rebooked for Thursday before the client was asked, and someone might have chased IT for a Wednesday promise they never made.",
          "The other lines are In the notes. Sam's action to check with the client and the open question about the travel budget both appear in the source. The fix is to change the decision to an open question and remove Wednesday, then add a limit to the request so that suggestions stay suggestions next week.",
        ],
      },
      practice: {
        intro:
          "Here are notes from a short planning call and three sentences from the summary a tool wrote. Mark each sentence using the two labels. The section on the check is above if you want to read it again.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence of the summary as In the notes or Not in the notes.",
          material: {
            label: "The notes from the planning call",
            text: "Ella will book the training room for 6 November. Jamal raised whether we need a second trainer. No decision on catering.",
          },
          passLabel: IN_NOTES,
          failLabel: NOT_IN_NOTES,
          sentences: [
            {
              id: "room",
              text: "Ella will book the training room for 6 November.",
              fail: false,
              why: "The owner, the action, and the date are all in the first line of the notes.",
            },
            {
              id: "trainer",
              text: "We agreed to bring in a second trainer.",
              fail: true,
              why: "Jamal only raised the question. The notes record no agreement, so this sentence turns a question into a decision.",
            },
            {
              id: "catering",
              text: "Catering is still to be decided.",
              fail: false,
              why: "The notes say there was no decision on catering, so this sentence is in the notes.",
            },
          ],
          why: "That is right. The room booking and the open catering question are in the notes, and the second trainer was a question that the summary turned into an agreement.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Here are the notes from a supplier call and the summary a tool wrote from them. Mark each sentence of the summary.",
        material: {
          label: "The notes from the supplier call",
          text: "Supplier confirmed the order will ship on 9 October. They asked whether we could accept a partial delivery. We said we would check with the warehouse. No discussion of price.",
        },
        passLabel: IN_NOTES,
        failLabel: NOT_IN_NOTES,
        sentences: [
          {
            id: "ship",
            text: "The order will ship on 9 October.",
            fail: false,
            why: "The first line of the notes says the supplier confirmed 9 October, so this sentence is in the notes.",
          },
          {
            id: "partial",
            text: "We agreed to accept a partial delivery.",
            fail: true,
            why: "The notes say we would check with the warehouse. Nothing was agreed, so this sentence is not in the notes.",
          },
          {
            id: "price",
            text: "The supplier will hold the current price.",
            fail: true,
            why: "The last line of the notes says there was no discussion of price, so this sentence was added.",
          },
        ],
        why: "You checked every sentence against the source. You kept the confirmed shipping date, and you caught a question turned into an agreement and a price commitment that was never discussed.",
      },
      bridge:
        "The next lesson covers the third move, where the tool helps you prepare a decision without making it for you.",
    },
    {
      id: "decide",
      title: "Decide",
      emphasis: "Decide",
      place:
        "This is the fourth of seven lessons and the last of the three moves. It is the move where it matters most that you stay the person responsible.",
      sections: [
        {
          heading: "Preparing a decision, not making it",
          paragraphs: [
            "To use a tool for a decision is to ask it to help you see the decision more clearly. It can list the options, lay each option against the criteria you set, point out what you have not considered, or argue the case against your preferred choice. Each of these gives you more to think with, and none of them makes the choice.",
            "The decision itself stays with you. You know the context, you will answer for the outcome, and you know which of your constraints are firm and which could bend. The tool knows none of that unless you tell it, and even then it does not carry the consequences. Public principles such as the OECD Recommendation on Artificial Intelligence put human agency and oversight at the centre for the same reason.",
          ],
        },
        {
          heading: "The request that keeps the choice with you",
          paragraphs: [
            "A request that keeps the decision with you has four features. It states your criteria, so the tool does not invent its own. It supplies the evidence, such as the quotes, the calendar, or the figures. It asks the tool to write 'not stated' wherever the evidence does not answer a criterion, so that gaps are visible rather than filled. It says plainly that the tool must not recommend or choose.",
            "The 'not stated' instruction is the one that does the most work. Without it, a model asked to compare three quotes on supervision will often describe a supervisor for each, because comparisons usually have something in every cell. With it, the empty cells show you exactly which phone calls to make before you decide.",
          ],
          beforeAfter: {
            before: "Which supplier should we choose?",
            after:
              "Set these three suppliers against our four criteria in a table. Where the quotes do not tell you, write 'not stated'. Then list the questions I should ask before choosing. Do not recommend one.",
            reading:
              "The first request asks the tool to weigh criteria it has invented against facts it may not have. The second gives it the criteria, makes the gaps visible, and leaves the choice where it belongs.",
          },
        },
        {
          heading: "Why the tool should not break the tie",
          paragraphs: [
            "When two options are close, it is tempting to let the tool decide. That is the moment to be most careful. A model tends to favour the criterion it can compare most easily, which is usually price or a number, and it will present its preference with the same confidence whether the evidence is strong or weak.",
            "If you find yourself wanting the tool to choose, ask it for the strongest case against the option you prefer instead. That is still preparing the decision. It gives you an argument to test your own judgement against, and you remain the person who weighs it.",
          ],
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The usual mistake is to ask a neutral-sounding question that is really a request for a choice, such as 'which is best' or 'what would you recommend'. The wording feels like research, but the answer is a decision made on grounds you have not seen.",
            "The second mistake is to give the criteria but not the evidence, or the evidence but not the criteria. With criteria alone, the tool fills the table with what suppliers usually offer. With evidence alone, it decides what matters. Give both, and ask for the gaps.",
          ],
        },
      ],
      workedExample: {
        title: "Three cleaning contractors",
        inputLabel: "The office manager's request",
        outputLabel: "What the tool returned",
        prompt:
          "Dawn Whitfield, office manager at Kestrel Accountancy, pasted three contractor quotes and wrote: 'Our four criteria are: price within £1,400 a month, evening availability, a named supervisor, and references from offices of our size. Set each contractor against each criterion in a table. Where the quotes do not tell you, write not stated. Then list the questions I should ask before choosing. Do not recommend one.'",
        output:
          "A table with three rows and four columns. Brightway: £1,250, evenings yes, supervisor not stated, references not stated. Clearpoint: £1,390, evenings yes, supervisor named as Kim Ashworth, references not stated. Hollis: £1,520, evenings from 7pm, supervisor named, references from two offices. Questions: does the Brightway price include materials; who would supervise Brightway's team; can Clearpoint give references; would Hollis match £1,400.",
        reading: [
          "The table shows Dawn that the cheapest contractor has not named a supervisor and that two of the three have given no references. Those are the gaps she needs to close before she can choose.",
          "The instruction not to recommend one mattered. Without it, the tool would probably have chosen Brightway on price, which is the one criterion it could compare easily, and Dawn might have accepted a quote with no supervisor.",
          "Dawn made two phone calls, learned that Brightway's price excluded materials, and chose Clearpoint. The tool prepared the decision, and she made it.",
        ],
      },
      practice: {
        intro:
          "Nadia Rahman is the operations lead at Castlegate Lettings. She must choose a supplier for twelve laptops for new starters, and her request asks the tool to choose. Edit it so that it sets out her criteria, asks for 'not stated' where the quotes are silent, and tells the tool not to recommend one. The before and after above is still there to compare.",
        check: {
          kind: "edit",
          prompt:
            "Rewrite Nadia's request so that the tool prepares the decision and she makes it. Keep the three suppliers, add her criteria, ask for 'not stated' where a quote is silent, and add a sentence telling the tool not to recommend one.",
          material: {
            label: "Nadia's criteria",
            text: "Price under £9,000 for all twelve. Delivery before Monday 3 November. Three years of on-site support. Laptops arrive set up with our standard build.",
          },
          label: "The request you are improving",
          start:
            "Here are three quotes for twelve new starter laptops, from Brennan IT, Coldwell Supplies, and Harrow Tech. Which one should we buy?",
          unchanged:
            "You have not changed the request yet. Add Nadia's criteria, ask for 'not stated' where a quote is silent, and add a sentence that starts with do not and says the tool must not recommend a supplier.",
          keep: [
            {
              id: "suppliers",
              any: ["brennan", "coldwell", "harrow"],
              missing: "Keep the suppliers. The request should still name Brennan IT, Coldwell Supplies, and Harrow Tech.",
            },
            {
              id: "criteria",
              any: ["9,000", "9000", "3 november", "on-site", "standard build", "criteria", "criterion"],
              missing:
                "Add Nadia's criteria, such as the price under £9,000 or delivery before 3 November, so the tool compares on her grounds rather than its own.",
            },
            {
              id: "gaps",
              any: ["not stated"],
              missing:
                "Ask the tool to write 'not stated' where a quote does not answer a criterion, so that the gaps are visible rather than filled.",
            },
          ],
          limits: [
            {
              id: "choice",
              any: ["recommend", "choose", "pick", "decide", "which one", "select"],
              missing:
                "Your request does not yet keep the choice with Nadia. Add a sentence such as 'Do not recommend one', because otherwise the tool will choose on the criterion it can compare most easily.",
            },
          ],
          why: "That request keeps the decision with Nadia. It names the suppliers, gives her criteria, makes the gaps visible with 'not stated', and tells the tool not to recommend one.",
          result: {
            label: "What the tool returns",
            text: "A table with three rows and four columns. Brennan IT: £8,640, delivery 31 October, on-site support not stated, standard build yes. Coldwell Supplies: £8,950, delivery 10 November, three years on-site, standard build not stated. Harrow Tech: £9,300, delivery 29 October, three years on-site, standard build yes. Questions: does Brennan include on-site support; can Coldwell deliver before 3 November; would Harrow come under £9,000.",
          },
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Rosa Delaney manages the claims team at Northgate Mutual and needs to choose a date for a team away day. Choose the request that keeps the decision with her.",
        leftLabel: "Request A",
        left: "Our criteria for the away day are: nobody on planned leave, not in the week of the quarterly close, and the venue available. Here is the leave calendar, the close dates, and the venue's availability. Set 14, 21, and 28 November against each criterion, write 'not stated' for anything you cannot tell from this information, and do not choose a date.",
        rightLabel: "Request B",
        right: "Which of these three dates is best for our team away day: 14, 21, or 28 November? Here is the leave calendar.",
        correct: "left",
        why: "Request A supplies Rosa's criteria and her evidence, asks the tool to show where information is missing, and keeps the choice with her.",
        wrong:
          "Look again at Request B. It asks the tool to decide without telling it the criteria, and it gives only one of the three pieces of evidence, so the tool will choose on grounds it has invented. Request A sets out her criteria and keeps the decision with her.",
      },
      bridge:
        "Before you build these moves into a weekly habit, the next lesson looks at the work that should not start with the tool at all.",
    },
    {
      id: "when-not-to-start-with-the-tool",
      title: "When not to start with the tool",
      emphasis: "not",
      place:
        "This is the fifth of seven lessons. It comes before the weekly plan so that the plan can include a deliberate decision about which work stays off the tool.",
      sections: [
        {
          heading: "Where work should begin",
          paragraphs: [
            "Some work should begin without the tool, even if you might use the tool on it later. The question in this lesson is not whether a tool may ever touch a piece of work. It is where the work starts, because the starting point shapes everything that follows: what material is shared, whose thinking frames the piece, and who is seen to have done the judging.",
            "This course uses two labels for that question. Start with the tool means the first version comes from the tool, working from your material, and you then edit and check it. Start without the tool means you do the first thinking or the first version yourself, and you decide afterwards whether the tool has any part to play.",
          ],
        },
        {
          heading: "Four reasons to start without the tool",
          paragraphs: [
            "There are four common reasons to start without the tool. The first is that the inputs are not safe to share, such as personal data, confidential client material, or anything your organisation's rules forbid you to enter. The second is that the work is a judgement about a person, such as a performance rating, a disciplinary decision, or a reference, where the thinking must be yours and must be seen to be yours.",
            "The third reason is that the work needs your own first thinking, such as a strategy, a difficult message, or a position you will have to defend. Starting with a generated draft pulls you towards its framing before you have formed your own, and it is hard to notice what the draft left out. The fourth reason is that the task is faster to do by hand than to describe, such as a two-line reply or a quick correction.",
            "When any of the four applies, the work should Start without the tool. When none applies, it can Start with the tool. Guidance such as the UK Government's AI Playbook makes a similar point for public servants: the person using the tool stays responsible for what goes out, and some material and some decisions need particular care.",
          ],
        },
        {
          heading: "What this lesson is not",
          paragraphs: [
            "This is not a rule against ever using a tool on these tasks. You might write your own draft of a difficult message and then ask a tool whether any sentence could be read as a promise you cannot keep. The first thinking was yours, and the tool acted as a second reader. Whether even that is appropriate still depends on whether the content is safe to share.",
            "It is also not a list of tasks the tool does badly. A tool may write a very fluent performance review. The reason to start without it is that the judgement belongs to the manager, and the person being reviewed is entitled to a judgement that the manager actually formed.",
          ],
          beforeAfter: {
            before: "Draft a note to my team announcing that we are considering a restructure.",
            after:
              "I have written the note to my team about the restructure myself. Read it and tell me whether any sentence could be read as a promise about jobs or dates. Do not rewrite it.",
            reading:
              "The first request hands the framing of a sensitive message to the tool. The second keeps the first thinking with the manager and uses the tool only as a second reader, with a limit on what it may change.",
          },
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The usual mistake is to apply one reason and forget the others. People remember that personal data is not safe to share, but they forget that a message which needs their own first thinking should also start without the tool, even when every word of it is safe to share.",
            "The opposite mistake is to treat the four reasons as a reason to avoid the tool altogether. If none of the four applies, starting without the tool is simply slower. The aim is a deliberate choice for each piece of work, and not a general caution.",
          ],
        },
      ],
      workedExample: {
        title: "A department head's list",
        inputLabel: "Three pieces of work on Helen Ogunleye's list",
        outputLabel: "Where each one started, and why",
        prompt:
          "Helen Ogunleye is head of customer operations at Westfield Water. Her list for Tuesday has three items: a note to her team announcing that a restructure is being considered; the monthly departmental newsletter, from her own bullet points; and a reply to a colleague asking which room the Thursday meeting is in.",
        output:
          "Restructure note: started without the tool. Helen wrote it herself, then asked the tool whether any sentence could be read as a promise about jobs or dates. Newsletter: started with the tool, drafted from her bullet points with a limit on adding news she had not listed. Room reply: started without the tool, typed as 'Room 3B, see you there.'",
        reading: [
          "The restructure note is the case where starting with a tool would have been a mistake. The tool would not have written badly, but the note needed Helen's own judgement about what to say and what to leave unsaid, and her team would judge her by it.",
          "Using the tool afterwards as a second reader was a sound choice. The note contained no personal data, and the question she asked was narrow. It found one sentence, 'nobody needs to worry', that could have been read as a promise.",
          "The newsletter met none of the four reasons, so it started with the tool. The room reply was faster to type than to describe, so it started without the tool for the plainest reason of all.",
        ],
      },
      practice: {
        intro:
          "Kieran Moss, a line manager at Abbotsford Logistics, must tell a team member that her probation is being extended. Here are two ways he could begin. Choose the one that starts where it should. The four reasons are above if you want to read them again.",
        check: {
          kind: "choose",
          prompt: "Choose the plan that starts this piece of work in the right place.",
          leftLabel: "Plan A",
          left: "Kieran writes the key points of the conversation himself, based on his own notes from her probation reviews, and decides what he will say before involving anyone or anything else.",
          rightLabel: "Plan B",
          right:
            "Kieran pastes her probation review notes into the tool and asks it to draft what he should say to her, then edits the draft before the meeting.",
          correct: "left",
          why: "Plan A starts without the tool. The work is a judgement about a person, and the review notes are personal data, so two of the four reasons apply and the first thinking must be Kieran's.",
          wrong:
            "Look again at Plan B. It puts personal data into the tool and lets the tool frame a judgement about a person. Two of the four reasons apply, so this work should start without the tool, as in Plan A.",
        },
      },
      check: {
        kind: "mark",
        prompt: "Mark each piece of work with where it should start, using the four reasons from this lesson.",
        passLabel: WITH_TOOL,
        failLabel: WITHOUT_TOOL,
        sentences: [
          {
            id: "review",
            text: "Writing feedback for a team member's end-of-year review.",
            fail: true,
            why: "This is a judgement about a person, and the manager needs to form that judgement first, so it starts without the tool.",
          },
          {
            id: "newsletter",
            text: "Turning your own bullet points into the monthly team newsletter.",
            fail: false,
            why: "None of the four reasons applies. The content is your own, it is safe to share, it is not about a person, and you can judge the draft, so it can start with the tool.",
          },
          {
            id: "merger",
            text: "Summarising a client's confidential merger plans, which your firm's rules say must not be entered into external tools.",
            fail: true,
            why: "The firm's rules forbid entering this material into external tools. When the inputs are not safe to share, you start without the tool.",
          },
          {
            id: "thursday",
            text: "Replying 'Yes, Thursday works' to a colleague.",
            fail: true,
            why: "Describing this reply to a tool would take longer than typing it, so it starts without the tool.",
          },
        ],
        why: "You used the four reasons to decide where each piece of work starts. The review is a judgement about a person, the merger plans are not safe to share, and the reply is faster by hand, while the newsletter meets none of the reasons and can start with the tool.",
      },
      bridge:
        "The next lesson brings every move in the course together and assesses it on situations you have not seen, before the final lesson asks you to write your weekly loop.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It sets out the method from the first five lessons in one place, works one mixed example, and then assesses the whole method on situations you have not seen.",
      sections: [
        {
          heading: "Choosing the work",
          paragraphs: [
            "The course began with the choice of work, because the habit only holds on work that suits it. A good first task meets four criteria: it repeats, you own it, you can judge the output, and its inputs are safe to share under your organisation's rules. A task that fails any one of them is not a first task, which means it is the wrong place to build the habit, not that a tool may never touch it.",
            "The choice is not driven by which task you most dislike or which use would be most impressive. A dull weekly report you know inside out is a better first task than a difficult paper you rarely write, because you can judge the output in minutes and you will use the tool on it every week.",
          ],
        },
        {
          heading: "The three moves",
          paragraphs: [
            "Once the work is chosen, you make one of three moves with the tool. To draft, you give it your reader, your facts, a limit on what must not be added, and the shape you want, and you edit what comes back. To summarise, you give it the source and a fixed shape, then read every sentence of the summary and label it In the notes or Not in the notes before it goes anywhere.",
            "To decide, you give it your criteria and your evidence, ask it to write 'not stated' where the evidence is silent, and tell it not to recommend. The tool prepares the decision by making the options and the gaps visible, and you make the choice. In each of the three moves you still own the result, and the check you run is what makes that ownership real.",
          ],
        },
        {
          heading: "Where work starts, and how the habit holds",
          paragraphs: [
            "Some work should Start without the tool. The four reasons are that the inputs are not safe to share, that the work is a judgement about a person, that it needs your own first thinking, or that it is faster by hand. When none applies, the work can Start with the tool. A tool can sometimes act as a second reader afterwards, but only when the first thinking was yours and the content is safe to share.",
            "A habit holds when each task has a fixed place in the week, a move, and a check, and when a fixed review asks whether the tool was used, whether the check caught anything, and whether the move should change. The final lesson asks you to write that loop for your own work.",
            "The assessment below sets seven situations from different kinds of work. Each question has one right answer, and each draws on one or more of the moves above. You need six of the seven to pass, and after you submit, each question shows the feedback for the option you chose.",
          ],
        },
      ],
      workedExample: {
        title: "One task, taken through the whole method",
        inputLabel: "Marcus Bell's task",
        outputLabel: "What he did at each step",
        prompt:
          "Marcus Bell is a practice administrator at Lindley Surgery. Every Monday he writes the rota gaps email to the practice manager, from the rota spreadsheet he maintains. He asked the tool: 'Write the rota email.' The draft said that 'Dr Kaur has agreed to cover Thursday afternoon', which nobody had agreed.",
        output:
          "Marcus checked the task against the four criteria: it repeats weekly, he owns it, he knows the rota well, and the rota contains staff names but no information his practice's rules bar from the approved tool. He rewrote the request: 'Draft the Monday rota gaps email for the practice manager, Sarah Quinn. Gaps this week: Thursday afternoon, one GP; Friday morning, one nurse. No cover has been agreed for either. Do not name anyone as cover or say that anything was agreed. Three short lines.' He then read each line of the new draft against the rota before sending.",
        reading: [
          "The task is a good first task, and drafting is the right move, because Marcus has the facts and the tool only needs to arrange them. The first request failed because it gave no facts and no limit, so the tool filled the gap with an agreement that sounded normal.",
          "The repaired request names the reader, gives the gaps, states what has not happened, sets a limit on naming cover, and asks for three lines. His check, reading each line against the rota, is the same move as the summary check: every sentence must be in the source.",
          "If the rota had included sickness details about named staff, the safe to share test would have needed a second look, and the right answer might have been to remove those details before drafting or to start without the tool.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose the request that would have stopped Marcus's first draft from inventing cover. The worked example is above if you want to read it again.",
        check: {
          kind: "choose",
          prompt: "Choose the request that a colleague could run without the draft naming someone as cover.",
          leftLabel: "Request A",
          left: "Draft the Monday rota gaps email for Sarah Quinn. Gaps: Thursday afternoon, one GP; Friday morning, one nurse. No cover has been agreed. Please be accurate. Three short lines.",
          rightLabel: "Request B",
          right:
            "Draft the Monday rota gaps email for Sarah Quinn. Gaps: Thursday afternoon, one GP; Friday morning, one nurse. No cover has been agreed. Do not name anyone as cover or say that anything was agreed. Three short lines.",
          correct: "right",
          why: "Request B names what the draft must not add, which is a named cover or an agreement, and it keeps the reader, the facts, and the shape. Request A asks for accuracy but does not say what to leave out.",
          wrong:
            "Look again at Request A. Asking the tool to be accurate does not tell it that it must not name anyone as cover, so it could still write that Dr Kaur has agreed. Request B names the limit directly.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each question has one right answer, and you need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "pick",
            situation:
              "Lewis Hardy is a sales support coordinator at Tern Packaging. He wants to start using the AI tool his company provides. His candidates are a one-off talk at the regional sales conference, the weekly order exceptions report he writes from the dispatch log, the customer credit check notes he finds tedious, and the pricing letter that the commercial director signs.",
            question: "Which task should Lewis start with?",
            options: [
              {
                id: "a",
                text: "The conference talk, because it is the most visible piece of work and a good draft would save him an evening.",
                feedback:
                  "The talk happens once, so the time spent setting it up is never repaid and no habit forms. Start with work that repeats, such as the weekly exceptions report.",
              },
              {
                id: "b",
                text: "The weekly order exceptions report, because it repeats, he owns it, he knows the log well, and the log is internal material.",
                correct: true,
                feedback:
                  "This is the choice the course teaches. The report meets all four criteria, so Lewis can judge the output every week and the habit has somewhere to form.",
              },
              {
                id: "c",
                text: "The credit check notes, because they are the task he dislikes most and would gain the most from.",
                feedback:
                  "Credit checks involve personal and financial data about customers, so they are unlikely to be safe to share, and disliking a task is not one of the four criteria. The exceptions report meets all four.",
              },
              {
                id: "d",
                text: "The pricing letter, because it matters most to customers and should read well.",
                feedback:
                  "The commercial director signs the letter, so Lewis does not own it and cannot change how it is done. Start with work that is his, such as the exceptions report.",
              },
            ],
          },
          {
            id: "draft",
            situation:
              "Hannah Price is a practice manager at Wexcombe Dental. She asked the tool for the Friday update to the partners and gave it her notes on the new booking system. The draft reads well but says the system 'goes live on 1 December', and no go-live date has been agreed.",
            question: "What should Hannah do next?",
            options: [
              {
                id: "a",
                text: "Send the update as it is, because the date is probably close to what the partners will agree.",
                feedback:
                  "A date in a partners' update will be treated as a commitment, and nobody has agreed it. The draft is Hannah's to send, so the invented date has to come out, and the request needs a limit.",
              },
              {
                id: "b",
                text: "Add 'Please be accurate' to the request and send whatever the tool writes next.",
                feedback:
                  "Asking for accuracy does not tell the tool what to leave out, and sending without reading skips the check. Name the limit on dates, then read the new draft.",
              },
              {
                id: "c",
                text: "Stop using the tool for the partners' update, because it cannot be trusted with dates.",
                feedback:
                  "The task still meets all four criteria, and the problem was a missing limit rather than an unsuitable task. Add the limit and keep the habit.",
              },
              {
                id: "d",
                text: "Remove the date, add 'Do not add any dates I have not listed' to her request, run it again, and read the new draft.",
                correct: true,
                feedback:
                  "This is the move the course teaches. Hannah fixes this update and adds the missing limit so that next Friday's draft does not invent a date either, and she still reads what comes back.",
              },
            ],
          },
          {
            id: "summarise",
            situation:
              "Owain Rees is a compliance officer at Mercer Street Lettings. His notes from the Tuesday governance meeting say, 'Priya suggested moving the internal audit to March. To be discussed next month.' The tool's summary lists under Decisions: 'The internal audit will move to March.' He is about to forward the summary to the audit lead.",
            question: "What should Owain do before he forwards it?",
            options: [
              {
                id: "a",
                text: "Read every sentence of the summary against his notes, move the audit line to Open questions as a suggestion, and then forward it.",
                correct: true,
                feedback:
                  "This is the check the course teaches. The audit line is Not in the notes, because a suggestion became a decision, and reading every sentence finds any other change before the audit lead acts on it.",
              },
              {
                id: "b",
                text: "Forward it with a line saying the summary was produced by a tool, so the audit lead knows to check it.",
                feedback:
                  "A label passes the check to someone who was not in the meeting and cannot compare the summary with the notes. Owain was there, so he runs the check before it goes.",
              },
              {
                id: "c",
                text: "Ask the tool to confirm that its summary is accurate, and forward it if the tool says yes.",
                feedback:
                  "The tool will usually confirm its own summary, because it has no better source than the notes you gave it. The check is Owain reading each sentence against the notes himself.",
              },
            ],
          },
          {
            id: "decide",
            situation:
              "Farah Siddiqui is an events coordinator at Holloway Engineering choosing a venue for the April staff conference. She asked the tool which of three venues was best, and it recommended Riverside Hall because it was cheapest. She has four criteria: capacity for 180, step-free access, a date in the week of 14 April, and a cost within budget.",
            question: "What should Farah do next?",
            options: [
              {
                id: "a",
                text: "Book Riverside Hall, because the tool compared all three and price is usually the deciding factor.",
                feedback:
                  "The tool chose on the one criterion it could compare easily and knew nothing of Farah's other three. Booking now hands the decision to it. Give it her criteria and keep the choice.",
              },
              {
                id: "b",
                text: "Ask the tool again which venue is best, and book whichever it recommends twice in a row.",
                feedback:
                  "Asking twice does not add the criteria, and agreement between two answers is not evidence. The request should set out her criteria and tell the tool not to recommend.",
              },
              {
                id: "c",
                text: "Give the tool her four criteria and the three venue packs, ask for a table with 'not stated' for gaps and the questions to ask, tell it not to recommend, and then choose.",
                correct: true,
                feedback:
                  "This is the move the course teaches. The table will show which venues have not confirmed step-free access or April dates, and Farah makes the decision with the gaps visible.",
              },
              {
                id: "d",
                text: "Ask the tool to rank the venues by overall quality and use its ranking as a starting point.",
                feedback:
                  "A ranking by overall quality uses criteria the tool invents, which is still the tool deciding. Set out her four criteria and ask for the gaps instead.",
              },
            ],
          },
          {
            id: "when-not",
            situation:
              "Beth Sandhu leads the accounts payable team at Calder Foods. One of her team, Ryan, has been late to his shift five times this month, and she needs to write to him to arrange a formal conversation. She has the dates in her notes and wonders whether to ask the tool for a first draft.",
            question: "Where should Beth start this piece of work?",
            options: [
              {
                id: "a",
                text: "Start with the tool, giving it the dates and asking for a firm but fair letter, because a first draft will save her time.",
                feedback:
                  "The letter is a judgement about a person and uses personal information about Ryan, so two of the four reasons apply. The first thinking must be Beth's.",
              },
              {
                id: "b",
                text: "Start without the tool, because it is a judgement about a person and the notes are personal data, and write the letter herself.",
                correct: true,
                feedback:
                  "This is the right call. Two of the four reasons apply, so Beth forms the judgement and writes the letter herself. Any second read would come from HR, not from the tool.",
              },
              {
                id: "c",
                text: "Start with the tool, but remove Ryan's name, because then nothing personal is shared.",
                feedback:
                  "Removing the name deals with only one reason. The letter is still a judgement about a person, and the framing of it should be Beth's own. It starts without the tool.",
              },
            ],
          },
          {
            id: "loop",
            situation:
              "Farid Haddad set up a weekly loop three weeks ago. At his Friday 4pm review he notices that he has not used the tool on the monthly supplier summary at all, because the supplier figures arrive late on the Tuesday he set for it, and he ends up writing it in a rush.",
            question: "What should Farid do at this review?",
            options: [
              {
                id: "a",
                text: "Ask the review questions, record that the tool was not used and why, and move the supplier summary to the Wednesday after the figures arrive.",
                correct: true,
                feedback:
                  "This is what the review is for. It asks whether the tool was used and whether the move or the day should change, and moving the day fixes the reason the habit slipped.",
              },
              {
                id: "b",
                text: "Drop the Friday review, because it has shown him the loop is not working and adds another meeting to his week.",
                feedback:
                  "The review has just done its job by finding the problem. Without it, the habit would fade without anyone noticing. Keep the review and change the day for the summary.",
              },
              {
                id: "c",
                text: "Start recording the minutes the tool saves on each task, so he can see which ones are worth keeping.",
                feedback:
                  "The loop is not a productivity target, and a timing record would not tell him why the summary slipped. The review questions already point to the late figures.",
              },
              {
                id: "d",
                text: "Add two more tasks to the loop so that the tool is used more often overall.",
                feedback:
                  "Adding tasks does not fix the one that slipped, and a larger loop is harder to keep. Change the day for the supplier summary first.",
              },
            ],
          },
          {
            id: "safe",
            situation:
              "Alys Morgan is a paralegal at Penrose Clarke Solicitors. Every week she summarises correspondence on the firm's largest client matter for the supervising partner. The firm's written policy says client documents must not be entered into any external AI tool, and the only tool she has access to is external.",
            question: "What should Alys do with this task?",
            options: [
              {
                id: "a",
                text: "Use the tool, because the summary is internal and only the partner will read it.",
                feedback:
                  "Who reads the summary does not change what was entered. The policy forbids putting client documents into an external tool, so this task is not safe to share.",
              },
              {
                id: "b",
                text: "Paste in the correspondence with the client's name removed, because anonymised material is always safe.",
                feedback:
                  "The policy covers client documents, not only names, and a matter can be identified from its details. The task fails the safe to share test.",
              },
              {
                id: "c",
                text: "Ask the supervising partner to approve an exception for this matter, since the task is weekly and suits the tool well.",
                feedback:
                  "The task does repeat, but a written policy is not something to set aside for convenience. Keep this work off the tool and choose a different first task.",
              },
              {
                id: "d",
                text: "Start without the tool for this summary, and choose a different recurring task, whose inputs are safe to share, for her loop.",
                correct: true,
                feedback:
                  "This is the right call. The inputs are not safe to share under the firm's policy, so the task starts without the tool, and Alys builds the habit on work that meets all four criteria.",
              },
            ],
          },
        ],
        why: "You applied the course's method to new situations: you chose work that meets the four criteria, set limits on drafts, checked summaries against their source, kept decisions with the person responsible, recognised when work should start without the tool, and used the review to keep the habit.",
      },
      bridge:
        "The final lesson asks you to write your own weekly loop: three tasks from your week, each with a day, a move, and a check, one deliberate exception, and a review.",
    },
    {
      id: "a-weekly-loop",
      title: "A weekly loop",
      emphasis: "loop",
      place:
        "This is the last of seven lessons. You write the weekly loop, which is the artefact that appears on your signed record.",
      sections: [
        {
          heading: "Why a habit needs a place in the week",
          paragraphs: [
            "Most good intentions about new tools fade within a few weeks, not because the tool stopped working but because nothing in the week reminded anyone to use it. A habit holds when it has a fixed place in the week and a moment when you look back at it. The weekly loop gives each of your three tasks that place, and it gives the whole arrangement a fixed review.",
            "The loop is small on purpose. It is a short written arrangement that you can keep, show your manager, and change. It is not a productivity target, it does not ask you to record the minutes you saved, and it is not a commitment to use the tool on everything.",
          ],
        },
        {
          heading: "The three parts of each task",
          paragraphs: [
            "Each task in the loop has three parts. The first is the task and when it happens, such as the Friday status update on Friday morning, or the supplier summary on the first Tuesday of the month. The second is the move you make with the tool, which is one of the three from this course: draft, summarise, or decide. The third is the check you run on the output before it goes anywhere.",
            "The check is the part people write too loosely. 'Review it' is not a check, because it does not say what you are looking for. A check names something you can see in the output, such as 'every date and risk is one I listed', 'every sentence is in the notes', or 'I choose the rating, and the tool only fills the table'. If you use the decide move, the check must make clear that the choice stays with you.",
          ],
          beforeAfter: {
            before: "Task 1: status update. Use the tool. Check: review it.",
            after:
              "Task 1: the Friday status update to the sponsor, every Friday morning. Move: draft from my own notes. Check: every date and risk in the draft is one I listed.",
            reading:
              "The first version has no day, no move, and a check that says nothing. The second says when, which move, and what you look for, so on Friday you will know whether you followed it.",
          },
        },
        {
          heading: "The exception and the review",
          paragraphs: [
            "The loop also names one piece of work that will start without the tool, and which of the four reasons applies. Writing it down makes the exception a decision you have made rather than a gap you have forgotten, and it shows anyone reading the loop that you have thought about where the tool does not belong.",
            "Finally, the loop sets a review: a day and a time each week, usually ten minutes, when you ask three questions. Did I use the tool on each task? Did the check catch anything? Should the move or the day change? The review is what keeps the loop honest, because it is the moment you notice that a task has slipped and decide what to do about it.",
          ],
        },
        {
          heading: "The usual mistakes",
          paragraphs: [
            "The first mistake is to write the same task three times in different words, such as the Monday update, the Wednesday update, and the Friday update, all drafted the same way. That is one task, not three, and the loop will not teach you the other two moves.",
            "The second mistake is to leave the review without a day or a time. A review that happens when there is a moment will not happen, because there is rarely a moment. Put it in your calendar at the same time each week.",
          ],
        },
      ],
      workedExample: {
        title: "Grace's weekly loop",
        inputLabel: "Grace's three tasks from the first lesson",
        outputLabel: "The loop she wrote",
        prompt:
          "The Friday status update to the sponsor; notes from the Monday stand-up, which she chairs; the monthly supplier performance summary. Ruled out earlier: the salary review recommendation and her one-to-ones, which are judgements about people.",
        output:
          "Task 1: Friday status update, Friday morning. Move: draft from my notes. Check: every date and risk is one I listed. Task 2: Monday stand-up notes, Monday after the call. Move: summarise into decisions, actions with owners, and open questions. Check: every sentence is in the notes. Task 3: monthly supplier summary, first Tuesday of the month. Move: decide, with a comparison table against our four service criteria and 'not stated' for gaps. Check: I choose the rating, not the tool. Not with the tool: one-to-ones with my two team members, because they are judgements about people. Review: Friday at 4pm, ten minutes. Did I use it on each task, did the check catch anything, and should any move or day change?",
        reading: [
          "Every line is specific enough that Grace will know on Friday whether she followed it. Each task has a time, one of the three moves, and a check that names something she can see in the output.",
          "The third task uses the decide move, and the check makes clear that she chooses the rating. The exception is written down with its reason, which makes it a decision rather than a gap.",
          "The review has a day, a time, a length, and three questions. It is short enough that she will keep it, and it is the part that will tell her in a month whether the loop is still working.",
        ],
      },
      practice: {
        intro:
          "Write the first task of your own loop. Give it a day and a move, then say what you check. The before and after in the section above is still there, and the hints under each box say what to include.",
        check: {
          kind: "build",
          prompt: "Write the first task of your weekly loop and the check you run on its output.",
          fields: [
            {
              id: "task",
              label: "Task 1",
              hint: "The task, the day it happens, and the move you use: draft, summarise, or decide.",
              min: 30,
              rule: "fact",
              any: ["draft", "summarise", "summarize", "summary", "decide", "decision", "compar"],
              missing:
                "Task 1 needs a day and a move. Say when it happens, for example every Friday morning, and name the move you use: draft, summarise, or decide.",
            },
            {
              id: "check",
              label: "The check on task 1",
              hint: "Something you can see in the output, such as every date being one you listed.",
              min: 20,
              any: ["every", "in the notes", "listed", "supplied", "source", "against", "match", "i choose", "i decide", "only"],
              missing:
                "The check needs to name something you can see in the output, for example that every date is one you listed or every sentence is in the notes. 'Review it' is not yet a check.",
            },
          ],
          why: "That task has a day, a move, and a check that names something you can see in the output. The other two tasks in your loop need the same three parts.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write your weekly loop for three tasks you own. For each task, say when it happens, which move you use, and the check you run. Then name one piece of work that will start without the tool, and set your review.",
        fields: [
          {
            id: "task-1",
            label: "Task 1",
            hint: "The task, the day, the move (draft, summarise, or decide), and the check you run on the output.",
            min: 40,
            rule: "fact",
            any: ["draft", "summarise", "summarize", "summary", "decide", "decision", "compar"],
            missing:
              "Task 1 needs a day and a move. Say when it happens, name the move you use (draft, summarise, or decide), and say what you check in the output.",
          },
          {
            id: "task-2",
            label: "Task 2",
            hint: "The task, the day, the move (draft, summarise, or decide), and the check you run on the output.",
            min: 40,
            rule: "fact",
            any: ["draft", "summarise", "summarize", "summary", "decide", "decision", "compar"],
            missing:
              "Task 2 needs a day and a move. Say when it happens, name the move you use (draft, summarise, or decide), and say what you check in the output.",
          },
          {
            id: "task-3",
            label: "Task 3",
            hint: "The task, the day, the move (draft, summarise, or decide), and the check you run on the output.",
            min: 40,
            rule: "fact",
            any: ["draft", "summarise", "summarize", "summary", "decide", "decision", "compar"],
            missing:
              "Task 3 needs a day and a move. Say when it happens, name the move you use (draft, summarise, or decide), and say what you check in the output.",
          },
          {
            id: "not-with-the-tool",
            label: "Not with the tool",
            hint: "One piece of work that starts without the tool, and which of the four reasons applies.",
            min: 20,
            any: [
              "safe to share",
              "personal",
              "confidential",
              "judgement",
              "judgment",
              "about a person",
              "first thinking",
              "own thinking",
              "by hand",
              "faster",
              "quicker",
            ],
            missing:
              "Say which of the four reasons applies to the work that starts without the tool: not safe to share, a judgement about a person, needs your own first thinking, or faster by hand.",
          },
          {
            id: "review",
            label: "Review",
            hint: "The day and time you review the loop, and the questions you ask.",
            min: 20,
            rule: "fact",
            any: ["did i", "check", "question", "change", "caught", "used"],
            missing:
              "Give your review a day and a time, and say what you ask at it, for example whether you used the tool, whether the check caught anything, and whether a move should change.",
          },
        ],
        why: "Your loop gives each task a day, a move, and a check, names one deliberate exception with its reason, and sets a review with a day and its questions. This is the plan that will appear on your record.",
      },
      bridge:
        "Your loop is ready. Sign your name below, and the record will show this loop, the course, and the date to anyone who opens the reference.",
    },
  ],
};
