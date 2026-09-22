/*
Course: Technology Decisions for Non-Technical Leaders
Slug: technology-decisions-for-non-technical-leaders
For: Directors, heads of department, trustees and business owners who approve or reject technology
  proposals without being technologists. They are handed a business case, a vendor pitch or a team's
  recommendation and asked to say yes, no, or not yet. They do not need to know how the technology works.
Outcome: The learner reads a technology proposal and says what is being bought in terms of work and
  obligations, puts five questions to it and says which are answered, names one owner for each of the four
  kinds of failure, and sets a ninety-day test with a measure, a starting point, a threshold, a date and a
  decision. A colleague could watch them turn a vendor summary into a one-page decision note.
Artefact: The decision note, in five parts: what we are buying, five questions, who owns the failure,
  the ninety-day test, and the decision and reason.
Record sentence: Wrote and signed a one-page decision note for a real technology proposal that another
  leader could hold the proposer to.
Lessons (id, title, move, interaction, pass rule):
  1. what-you-are-buying, What you are buying, tell an outcome in the work from a feature of the product,
     mark, every sentence marked correctly.
  2. five-questions, Five questions, tell a sentence that answers one of the five questions from one that
     leaves it open, mark, every sentence marked correctly.
  3. who-owns-the-failure, Who owns the failure, judge which ownership section names one person for each
     kind of failure, choose, the section with four named owners.
  4. the-ninety-day-test, The ninety-day test, tell a success statement that can be held to from one that
     cannot, mark, every statement marked correctly.
  5. repair-a-decision-note, Repair a decision note, repair a weak note in place, edit, the edit states an
     outcome, marks the questions, names all four owners, sets a test with a starting point and threshold,
     and gives a decision with a reason.
  6. apply-the-method, Apply the method to new proposals, judgement across six new situations, scenario,
     five of six correct.
  7. your-decision-note, Your decision note, write the note for a real proposal, build, each of the five
     parts meets its rule or word list.
Sources: National Cyber Security Centre, Cyber Security Board Toolkit. GOV.UK, Technology Code of Practice.
  GOV.UK Service Manual, the Service Standard. National Audit Office, The challenges in implementing digital
  change (2021). National Cyber Security Centre, Supply Chain Security Guidance.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const OUTCOME = "Outcome in the work";
const FEATURE = "Feature of the product";
const ANSWERS = "Answers a question";
const OPEN = "Leaves it open";
const HELD = "Can be held to";
const NOT_HELD = "Cannot be held to";

export const COURSE: CourseContent = {
  slug: "technology-decisions-for-non-technical-leaders",
  hours: 2,
  artefact: {
    lessonId: "your-decision-note",
    title: "The decision note",
    recordLine:
      "Wrote and signed a one-page decision note for a real technology proposal that another leader could hold the proposer to.",
  },
  lessons: [
    {
      id: "what-you-are-buying",
      title: "What you are buying",
      emphasis: "buying",
      place:
        "This is the first of seven lessons. It changes the question you ask of every technology proposal from what the product does to what will be different in the work once you have bought it.",
      sections: [
        {
          heading: "You are buying a change in the work",
          paragraphs: [
            "When you approve a technology proposal, you are not really buying a product. You are buying a change in how a piece of work is done: who does it, how long it takes, what the customer or the tenant or the member of staff experiences, and what stops happening. The product is the means. The change in the work is the thing you will be asked about in a year's time.",
            "You are also taking on obligations. There is a contract with a start date, a term and an exit. There is people's time to set the product up and to run it after launch. There is a dependence on a supplier who may be bought, may raise prices at renewal, or may stop trading. And there is a responsibility for the data the product will hold, which stays with your organisation whatever the supplier's brochure says.",
            "A leader who reads a proposal this way does not need to understand how the technology works. They need to know what the organisation will be doing differently on a Tuesday morning three months after go-live, and what the organisation has signed up to in order to get there.",
          ],
        },
        {
          heading: "Two kinds of sentence in a proposal",
          paragraphs: [
            "Most proposals mix two kinds of sentence, and this course gives each a label. A sentence is an Outcome in the work when it says what will be different in the work and for whom. 'Applications will be acknowledged within one working day instead of five' is an outcome in the work. It names the work, the people affected and the size of the change.",
            "A sentence is a Feature of the product when it describes what the product can do, how it is built or what it contains. 'AI-powered triage', 'real-time dashboards' and 'a cloud-based platform with a self-service portal' are all features of the product. They may be true and they may be useful, but they do not say what anyone will do differently.",
            "A proposal made mostly of features is not necessarily a bad idea. The trouble is that it leaves you to imagine the outcome, and each person in the room will imagine a different one. The finance director pictures lower costs, the operations director pictures fewer complaints, and the proposer pictures a successful launch. When the outcome is written down, everyone is approving the same thing.",
          ],
          beforeAfter: {
            before: "The system offers automated scheduling and a mobile app for engineers.",
            after:
              "Engineers will receive the next day's jobs on their phones by 6pm, instead of phoning the office at 7am for their list.",
            reading:
              "The first sentence describes the product. The second says who is affected, what they will do differently and what stops, so the board can ask whether it is happening.",
          },
        },
        {
          heading: "What this is not",
          paragraphs: [
            "Asking for outcomes is not a way of rejecting technical detail. The team that will run the product needs the detail, and a good proposal will include it in an appendix. Your job as the person approving is different. You need the sentence that says what the detail is for.",
            "It is also not a demand for precise forecasts. An outcome can be stated with honest uncertainty, such as 'we expect most routine repairs to be reported online within six months'. What matters is that the sentence describes the work, so that someone can later look at the work and say whether it changed.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The common mistake is to be persuaded by the demonstration. A good demonstration shows features working smoothly on clean data, and it is easy to leave the room feeling that the case has been made. It has not. You have seen what the product can do. You have not yet been told what your organisation will do with it.",
            "The repair is one question, asked politely and early: what will be different in the work, and for whom? If the proposer can answer it in two or three sentences, you have the outcome. If they cannot, the proposal is not ready to decide, however good the product looked.",
          ],
        },
      ],
      workedExample: {
        title: "Restating the Platform X summary",
        inputLabel: "The proposal summary to the board",
        outputLabel: "The director's restatement",
        prompt:
          "We recommend Platform X, a cloud-based, AI-enabled tenant engagement platform with omnichannel messaging, a self-service portal and advanced analytics.",
        output:
          "Tenants will be able to report repairs online at any time, and will get a text when a repair is booked and when the operative is on the way. The repairs team will stop taking most routine reports by phone. The contact centre expects to handle fewer calls chasing repairs.",
        reading: [
          "The summary went to the board of Westmere Housing Association. Every phrase in it is a feature of the product: cloud-based, AI-enabled, omnichannel messaging, a self-service portal and advanced analytics. None of them says what a tenant or a member of staff will do differently.",
          "The director of operations, Ruth Abiola, restated the summary after one conversation with the proposer. Her version names three changes in the work: how tenants report repairs, what the repairs team stops doing, and what happens to calls into the contact centre.",
          "The restatement also exposes an assumption. Fewer chasing calls is an expectation, and the board can now ask how it will be measured. The rest of this course uses the Platform X case to test that assumption.",
        ],
      },
      practice: {
        intro:
          "Here is one sentence from a proposal for a field service system, with two attempts to restate it. The section on the two kinds of sentence is still above if you want to read it again.",
        check: {
          kind: "choose",
          prompt:
            "The proposal says: 'The new system offers route optimisation and a mobile app for engineers.' Choose the restatement that is an outcome in the work.",
          leftLabel: "Restatement A",
          left: "Engineers will have access to a modern, optimised mobile scheduling tool.",
          rightLabel: "Restatement B",
          right:
            "Each engineer will complete five visits a day instead of four, because their route is set the evening before rather than at the depot.",
          correct: "right",
          why: "Restatement B says who is affected, what they will do differently and by how much, so it is an outcome in the work. Restatement A still describes the product, with the word 'modern' added.",
          wrong:
            "Look again at Restatement A. It tells you what the engineers will have, not what they will do differently, so it is still a feature of the product. Restatement B names the change in visits and the reason for it.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These four sentences come from a proposal for a new finance system at Carrow Foods. Mark each sentence with the label it deserves.",
        passLabel: OUTCOME,
        failLabel: FEATURE,
        sentences: [
          {
            id: "matching",
            text: "The system uses machine learning to match transactions.",
            fail: true,
            why: "This says how the product works, not what will be different in the work. Ask what changes for someone in the finance team, because the sentence does not say.",
          },
          {
            id: "close",
            text: "Month-end close will take three working days instead of eight, freeing the finance team for forecasting.",
            fail: false,
            why: "This names a change in the work, by how much, and who benefits, so it is an outcome in the work.",
          },
          {
            id: "dashboards",
            text: "It provides real-time dashboards.",
            fail: true,
            why: "A dashboard is a capability. Nothing in this sentence tells you who will use it or what they will do differently, so it is a feature of the product.",
          },
          {
            id: "budget",
            text: "Budget holders will see their spending against budget each Monday without asking finance for a report.",
            fail: false,
            why: "This says who, when, and what they will no longer have to do, which is a change in the week of the budget holders and the finance team.",
          },
        ],
        why: "That is the right reading. The shorter close and the Monday view for budget holders say what will be different in the work and for whom. Machine learning and real-time dashboards describe the product, and they leave you to imagine the outcome.",
      },
      bridge:
        "With the outcome clear, the next lesson gives you five questions to put to every proposal, so that you are not relying on how confident the presenter sounds.",
    },
    {
      id: "five-questions",
      title: "Five questions",
      emphasis: "questions",
      place:
        "In the first lesson you learned to find the outcome in a proposal. This lesson gives you one set of questions to put to every proposal you see, and two labels for reading the answers.",
      sections: [
        {
          heading: "The five questions",
          paragraphs: [
            "The first question is what will be different in the work, and how will we see it. This is the outcome from the last lesson, with one addition: the proposal should say what you would look at to know the change had happened. The second question is what this replaces, and when the old way stops. A new system that runs alongside the old one for ever doubles the work rather than changing it.",
            "The third question is who will run it after launch, and how much of their time it will take. The fourth is what it will cost over its whole life, including people's time and including the cost of leaving at the end of the contract. The fifth is what happens if it fails or the supplier fails, and how you would get your data and your work back.",
            "The GOV.UK Technology Code of Practice makes similar points for public bodies, including planning for the whole life of a technology and avoiding being locked in to one supplier. You do not need to be in government to find the questions useful. They apply equally to a charity's fundraising database and a manufacturer's stock system.",
          ],
        },
        {
          heading: "What the questions are not",
          paragraphs: [
            "The questions are not a test of the proposer. A good proposal will welcome them, because they are the questions the team will face after launch whether or not the board asks them now. Asking them early is a courtesy to the people who will have to live with the answer.",
            "They are not a scoring system either. You do not add up the answers and approve anything that scores four out of five. One unanswered question can outweigh four good answers. A proposal with a strong outcome and a clear cost, but no idea how you would retrieve your data if the supplier failed, may still not be ready to approve.",
          ],
        },
        {
          heading: "Answers a question, or leaves it open",
          paragraphs: [
            "When you read a proposal against the five questions, each sentence that bears on them does one of two things. A sentence Answers a question when it gives something that could be checked: a date, a named role, an amount of time, a cost, or a described arrangement such as a contract clause. 'The old booking spreadsheet will be switched off on 30 April' answers the second question.",
            "A sentence Leaves it open when it sounds relevant but gives nothing that could be checked. 'The supplier is a market leader' sounds as though it bears on the fifth question, but it says nothing about what happens if the supplier fails. 'Staff will absorb the administration' sounds as though it answers the third, but it names no person and no time.",
          ],
          beforeAfter: {
            before: "The team will manage the platform day to day.",
            after:
              "The customer services team leader, Priya Nair, will administer the platform, estimated at one day a week for the first three months and half a day after that.",
            reading:
              "The first sentence leaves the third question open, because 'the team' is not a person and there is no estimate of time. The second names a role and a person and gives an estimate someone could check.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The common mistake is to let a confident answer to one question stand in for the others. A detailed cost table, or a well-known supplier name, gives the feeling that the case has been thought through. The board moves on, and the question about who runs it, or when the old way stops, is never asked.",
            "The repair is to go through the questions in order, every time, and to write down which are answered and which are left open. That list is what you send back to the proposer. It is far more useful to them than a general sense that the board was not convinced.",
          ],
        },
      ],
      workedExample: {
        title: "Reading the Platform X business case",
        inputLabel: "Four sentences from the business case",
        outputLabel: "The director's reading against the five questions",
        prompt:
          "The platform will go live in September. The supplier is a market leader. Licence costs are £38,000 a year on a three-year term. The contact centre will absorb day-to-day administration.",
        output:
          "The licence cost partly answers the fourth question, but it leaves out implementation, staff time and the cost of leaving at the end of the term. 'The contact centre will absorb administration' leaves the third question open, because it names no person and no time. 'Market leader' leaves the fifth question open, because it says nothing about what happens if the supplier fails. Nothing answers the second question, because the case never says when phone reporting stops.",
        reading: [
          "The go-live date is useful, but it is a project date rather than an answer to any of the five questions. Ruth Abiola noted it and moved on.",
          "The licence cost is the only sentence that answers a question, and only in part. A whole-life cost would include the work to set the platform up, the time of the staff who run it, and what it would cost to move the data elsewhere at the end of three years.",
          "The reading shows that a well-presented case answered one question in part. Ruth now has four specific questions to send back, rather than a general unease she would struggle to explain.",
        ],
      },
      practice: {
        intro:
          "Here are two sentences from a proposal for a new visitor booking system at a museum. Use the two labels from the section above to mark each one.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence as Answers a question or as Leaves it open.",
          passLabel: ANSWERS,
          failLabel: OPEN,
          sentences: [
            {
              id: "phone",
              text: "Phone bookings will stop on 1 March, when the booking line is replaced by a recorded message pointing to the website.",
              fail: false,
              why: "This says what is replaced and when the old way stops, which answers the second question.",
            },
            {
              id: "trusted",
              text: "The supplier is trusted by over a hundred cultural organisations.",
              fail: true,
              why: "This is a claim about the supplier's reputation. It does not say what happens if the supplier fails, so the fifth question is still open.",
            },
          ],
          why: "That is right. The first sentence gives a date on which the old way stops, and the second offers reassurance without anything you could check.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These four sentences come from a proposal for a new learning platform at Sefton Logistics. Mark each sentence with the label it deserves.",
        passLabel: ANSWERS,
        failLabel: OPEN,
        sentences: [
          {
            id: "intranet",
            text: "The current intranet training pages will be switched off on 31 January, and all records moved across before then.",
            fail: false,
            why: "This names the old way and the date it stops, which answers the second question.",
          },
          {
            id: "partners",
            text: "Our partners are highly experienced in digital transformation.",
            fail: true,
            why: "Experience is a claim about the supplier. Check each question: this sentence does not say what changes, who runs it, what it costs or what happens if it fails.",
          },
          {
            id: "coordinator",
            text: "The L&D coordinator will administer the platform, estimated at one day a week in the first quarter and half a day after that.",
            fail: false,
            why: "A named role and an estimate of time is exactly what the third question asks for.",
          },
          {
            id: "secure",
            text: "The platform is secure and resilient.",
            fail: true,
            why: "'Secure and resilient' is a description. The fifth question asks what happens when something does go wrong and how you would get your data back.",
          },
        ],
        why: "That is the right reading. The switch-off date and the coordinator's time answer the second and third questions. The partners' experience and the claim of security sound relevant, but neither gives you anything to check.",
      },
      bridge:
        "The fifth question leads straight to the next lesson, which asks who owns each kind of failure once the proposal is approved.",
    },
    {
      id: "who-owns-the-failure",
      title: "Who owns the failure",
      emphasis: "failure",
      place:
        "You can now find the outcome and see which questions a proposal leaves open. This lesson makes sure that every way the decision could go wrong has one person attached to it before you approve it.",
      sections: [
        {
          heading: "Four ways a decision can fail",
          paragraphs: [
            "A technology decision can fail in four different ways, and each needs its own owner. The first is that it is not used: the product goes live, but the work stays where it was, in the old spreadsheet or on the phone. The second is that it is not working: outages, errors, slow performance or a failure to do what the contract promised.",
            "The third is that data is exposed, through a breach, a misconfiguration or a member of staff sending the wrong export to the wrong person. The fourth is supplier failure: the supplier goes out of business, is bought by a competitor, withdraws the product or raises the price sharply at renewal. The National Cyber Security Centre's Supply Chain Security Guidance treats dependence on suppliers as a risk to be understood and managed, not assumed away.",
            "These four are different enough that one person rarely owns all of them well. The person best placed to notice that nobody is using the system is usually a service manager. The person best placed to hold a supplier to its service levels is usually in IT. Treating them as one risk tends to leave three of them unwatched.",
          ],
        },
        {
          heading: "What an owner is",
          paragraphs: [
            "An owner is one named person, or one named role, who will notice the failure, decide what to do about it, and tell you. A person or role that meets this test is a Named owner. A team, a board, a directorate or a supplier is Not an owner, because none of them can notice, decide and report as one person.",
            "Ownership is not blame. Naming the Head of Repairs as the owner of the risk that the platform is not used does not mean they will have caused it. It means that when adoption is low, nobody has to ask whose job it is to find out why. The NCSC Cyber Security Board Toolkit makes a similar point about responsibility for cyber risk: it has to sit with people, not with a diagram.",
          ],
        },
        {
          heading: "Why a board or a supplier cannot own it",
          paragraphs: [
            "A programme board meets monthly or quarterly. It can receive a report, but it cannot notice a failure on a Wednesday afternoon, and when everyone on it owns a risk, nobody does. Giving ownership to a board feels thorough, and it usually means the first sign of trouble comes from a complaint.",
            "A supplier cannot own your failure either. The supplier owns its obligations under the contract, and a good supplier will meet them. But whether your staff use the product, whether your data is handled properly and what you do if the supplier itself fails are your organisation's problems. The supplier is the thing one of your owners manages.",
          ],
          beforeAfter: {
            before: "The project will be owned by the Digital Programme Board, with support from the supplier.",
            after:
              "Not used: the Head of Repairs, reporting monthly. Not working: the IT Service Manager, against the contract's service levels. Data exposed: the Data Protection Officer. Supplier failure: the Head of Procurement.",
            reading:
              "The first version gives everything to a board and a supplier. The second gives each kind of failure to one role who already has a reason to care about it.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The common mistake is to name the project sponsor as the owner of everything. The sponsor matters, but they are usually senior and busy, and after launch they move on to the next priority. A single owner for four different risks is almost as weak as no owner.",
            "The repair is to write the four kinds of failure as four lines and to put one name against each. Where you cannot yet name someone, write 'Not yet named'. That gap is a condition of the decision, not a detail to sort out later.",
          ],
        },
      ],
      workedExample: {
        title: "Naming owners for Platform X",
        inputLabel: "The ownership section of the business case",
        outputLabel: "The director's version",
        prompt: "The project will be owned by the Digital Programme Board, with support from the supplier.",
        output:
          "Not used: the Head of Repairs, who owns the target of most routine repairs reported online and will report monthly. Not working: the IT Service Manager, who holds the supplier to the service levels in the contract. Data exposed: the Data Protection Officer, with the IT Service Manager, following the existing incident process. Supplier failure: the Head of Procurement, who will make sure the contract includes data export on exit and will review the supplier's position before renewal.",
        reading: [
          "The original gave the whole project to a board that meets quarterly and to the supplier, who cannot own Westmere's failures. It did not separate the four kinds of failure at all.",
          "The revised version names four people. Each one already has a reason to care: the Head of Repairs wants the repairs team off the phones, and the Head of Procurement already manages contract renewals.",
          "Each line also says what the owner will do, such as reporting monthly or reviewing the supplier before renewal. That is what lets the board check later that the ownership was real.",
        ],
      },
      practice: {
        intro:
          "Here are three lines from an ownership section for a new customer contact system. Use the definitions of a Named owner and Not an owner from the section above to mark each one.",
        check: {
          kind: "mark",
          prompt: "Mark each line as Named owner or as Not an owner.",
          passLabel: "Named owner",
          failLabel: "Not an owner",
          sentences: [
            {
              id: "unused",
              text: "Not used: the Head of Customer Services, who will report the share of contacts handled in the system each month.",
              fail: false,
              why: "This names one role and says what they will do, so it is a named owner.",
            },
            {
              id: "supplier",
              text: "Supplier failure: the supplier's account team.",
              fail: true,
              why: "The supplier cannot own the risk of its own failure. One of your own people has to watch the supplier.",
            },
            {
              id: "data",
              text: "Data exposed: IT.",
              fail: true,
              why: "IT is a department, not one person. Name the role who will notice a data incident and decide what to do.",
            },
          ],
          why: "That is right. Only the Head of Customer Services is one role who can notice, decide and report. A supplier and a department are not owners.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two ownership sections were written for the same staff scheduling system at Linden Care Homes. Choose the one you could approve.",
        leftLabel: "Section A",
        left: "Ownership sits with the Operations Directorate and the supplier's customer success team, who will work in partnership to ensure success.",
        rightLabel: "Section B",
        right:
          "Not used: the Operations Manager, who will check each month that rotas are published in the system. Not working: the IT Manager, against the supplier's service levels. Data exposed: the Data Protection Officer. Supplier failure: the Finance Director, who will confirm the exit and export terms before signing.",
        correct: "right",
        why: "Section B names one person for each of the four kinds of failure and says what each will do. When something goes wrong at Linden, nobody will have to ask whose job it is.",
        wrong:
          "Look again at Section A. It gives ownership to a directorate and a supplier. Neither is one named person, and it does not separate the four kinds of failure. Section B does both.",
      },
      bridge:
        "Owners make failures visible. The next lesson gives you the test that tells you, ninety days after launch, whether the decision is working.",
    },
    {
      id: "the-ninety-day-test",
      title: "The ninety-day test",
      emphasis: "test",
      place:
        "You now know what is being bought, which questions are open and who owns each failure. This lesson turns the outcome from the first lesson into something you can check ninety days after launch.",
      sections: [
        {
          heading: "Five parts of a test",
          paragraphs: [
            "A ninety-day test has five parts. The measure is the thing you will count or observe that shows the outcome in the work, such as the share of repairs reported online. The starting point is the value of that measure before launch, taken from real records rather than from memory. The threshold is the value that counts as working.",
            "The date is when the measure will be checked, usually ninety days after go-live. The decision is what you will do at that date for each possible result: continue, change something specific, or stop. The decision is written before launch, so that nobody has to argue about what the result means once it arrives.",
            "The GOV.UK Service Standard asks teams to decide what success looks like before they build or buy, and to measure it. The ninety-day test is a small, practical version of the same discipline for a leader who approves rather than builds.",
          ],
        },
        {
          heading: "What the test is not",
          paragraphs: [
            "The test is not a punishment for the team. A result below the threshold is information, and the decision you agreed in advance may be to change something rather than to stop. Teams usually welcome a test written this way, because it tells them exactly what the board will look at.",
            "It is not a promise that everything will be perfect at ninety days either. Some benefits take a year to appear. The ninety-day test picks one early sign that the work is changing, and it is set early because that is the point at which changing course is still cheap.",
          ],
        },
        {
          heading: "Can be held to, or cannot be held to",
          paragraphs: [
            "A success statement Can be held to when someone other than the proposer could collect the measure at the date and reach the same answer, and when the statement says what will be done with that answer. In practice this means all five parts are present.",
            "A success statement Cannot be held to when it is vague, when it has no starting point, or when it has no decision attached. 'Significant improvements in satisfaction' cannot be held to, and neither can 'satisfaction will rise by 10%', because the number has nothing to be measured from and no date or decision.",
          ],
          beforeAfter: {
            before: "The new system will make purchasing more efficient.",
            after:
              "At least 80% of purchase orders will be raised in the system by 30 June, against 0% today, checked by the finance manager. Below 50%, we pause the rollout to other departments.",
            reading:
              "The first statement could never be shown to be false. The second has a measure, a starting point, a threshold, a date and a decision, and anyone with access to the purchase records could check it.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The common mistake is to set the measure and forget the starting point. Three months after launch, someone reports that 400 repairs were reported online, and nobody knows whether that is good, because nobody counted how repairs were reported before. Take the starting point before go-live, while the old way is still running.",
            "The second mistake is to leave the decision out. A test without a decision produces a report that is noted and filed. Write down, before launch, what you will do if the threshold is met, if it is missed narrowly, and if it is missed badly.",
          ],
        },
      ],
      workedExample: {
        title: "A test for Platform X",
        inputLabel: "The success statement in the business case",
        outputLabel: "The director's ninety-day test",
        prompt: "We expect significant improvements in tenant satisfaction.",
        output:
          "Measure: the share of routine repairs reported online rather than by phone. Starting point: 0%, as online reporting does not exist today; phone calls chasing routine repairs, averaged over the three months before launch, are recorded as the baseline. Threshold: at least a third of routine repairs reported online, and chasing calls lower than the baseline. Date: ninety days after go-live. Decision: continue if both are met; if online reporting is met but chasing calls are not, change the notification texts before the next review; if online reporting is below a sixth, stop and review the contract's break clause.",
        reading: [
          "The original statement could never be shown to be false, because tenant satisfaction was not measured in a way that anyone had agreed. It gave the board nothing to look at in December.",
          "Ruth Abiola chose a measure that follows directly from the outcome in the first lesson, and added the chasing calls because that was the assumption she wanted tested.",
          "The decision has three branches. The board has agreed in advance what it will do with each result, so the ninety-day review will be a short meeting rather than a debate.",
        ],
      },
      practice: {
        intro:
          "Here are two success statements written for the same expenses system at Garrick Engineering. The five parts of a test are listed in the first section above.",
        check: {
          kind: "choose",
          prompt: "Choose the statement that can be held to.",
          leftLabel: "Statement A",
          left: "By 31 May, at least 90% of expense claims will be submitted in the app, against 0% today, checked by the payroll lead; below 60%, we will stop paper claims being accepted before extending the licence.",
          rightLabel: "Statement B",
          right: "Staff will find expenses quicker and easier, and finance will spend much less time on claims.",
          correct: "left",
          why: "Statement A has a measure, a starting point, a threshold, a date and a decision, so the payroll lead could check it and the board would know what to do. Statement B has none of the five parts.",
          wrong:
            "Look again at Statement B. 'Quicker and easier' has no measure, no starting point and no date, and it says nothing about what happens if it is not true. Statement A has all five parts.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These four success statements come from different proposals across one council. Mark each statement with the label it deserves.",
        passLabel: HELD,
        failLabel: NOT_HELD,
        sentences: [
          {
            id: "collaborate",
            text: "Staff will find it easier to collaborate.",
            fail: true,
            why: "It has no measure, no starting point, no threshold and no decision. Nobody could check this at ninety days and reach the same answer.",
          },
          {
            id: "orders",
            text: "At ninety days, at least 80% of purchase orders will be raised in the system, against 0% today, checked by finance on 30 June; below 50% we pause the rollout to other departments.",
            fail: false,
            why: "It has a measure, a starting point, a threshold, a date and a decision, so it can be held to.",
          },
          {
            id: "satisfaction",
            text: "Customer satisfaction will improve by 10%.",
            fail: true,
            why: "A number is not enough. It does not say from what, by when, or what happens if it is missed.",
          },
          {
            id: "hiring",
            text: "By 30 September, the average time from job advert to offer will fall from the current 41 days to under 30; if not, HR will report why and propose a change.",
            fail: false,
            why: "It names the measure, the starting point, the threshold, the date and what happens if it is missed, so someone else could check it.",
          },
        ],
        why: "That is the right reading. The purchase order and hiring statements each have all five parts. The other two have no starting point and no decision, so nobody could hold the proposer to them.",
      },
      bridge:
        "You now have all the parts of a decision. The next lesson shows you how they fit on one page, by repairing a weak note.",
    },
    {
      id: "repair-a-decision-note",
      title: "Repair a decision note",
      emphasis: "Repair",
      place:
        "This lesson prepares you for the final one. You practise the shape of the decision note on someone else's work before you write your own.",
      sections: [
        {
          heading: "Five sections on one page",
          paragraphs: [
            "A decision note is one page with five sections. The first is what we are buying, stated as outcomes in the work. The second is the five questions, each marked as answered with the answer, or marked with the words 'Leaves it open'. The third is the owners of the four kinds of failure. The fourth is the ninety-day test. The fifth is the decision and the reason for it.",
            "Each section is the work of one earlier lesson, written down. That is deliberate. By the time you write the note, you have already done the thinking, and the note records it in a form that another person can pick up.",
          ],
        },
        {
          heading: "Who the note is for",
          paragraphs: [
            "The note is written for two readers. The first is whoever is asked, a year later, why the decision was made: an auditor, a new chief executive, or a trustee who joined after the vote. The second is the person who will chair the ninety-day review and needs to know exactly what was agreed.",
            "It is not the business case, and it should be much shorter. The business case argues for the proposal. The note records what the decision-makers concluded, including what they were not yet satisfied about. The National Audit Office's 2021 report on the challenges in implementing digital change stresses the role of senior leaders in understanding what they are approving, and a short note is the evidence that they did.",
          ],
        },
        {
          heading: "Approve, approve with conditions, or not yet",
          paragraphs: [
            "The decision is one of three. Approve means the proposal answers the five questions well enough to go ahead as it stands. Approve with conditions means it can go ahead once named open questions are answered, and the note must say which questions, who will answer each, and by when. Not yet means the proposal is not ready, and the note says which questions must be answered before it returns.",
            "A reason is not an impression. 'The board was impressed' and 'the sponsor is keen' describe the room, not the proposal. A reason says which of the five questions the proposal answers and which it leaves open, because that is what the next reader will want to know.",
          ],
          beforeAfter: {
            before: "Approved. The board was impressed by the demonstration and the supplier's track record.",
            after:
              "Decision: approve with conditions, because the proposal answers the first, third and fourth questions. Before signature, the Head of Repairs will confirm the date routine phone reporting stops, and the Head of Procurement will confirm the contract allows full data export on exit.",
            reading:
              "The first version records an impression. The second records what was approved, what was still open, and who will close each open question before the contract is signed.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The common mistake is to write the note after the meeting from memory, and to record the mood rather than the reasoning. The note then says 'approved' and very little else, and the ninety-day review has nothing to review against.",
            "The repair is to write the note while the proposal is in front of you, section by section, and to leave nothing blank. A section you cannot fill is a finding in its own right, and it usually becomes a condition.",
          ],
        },
      ],
      workedExample: {
        title: "Repairing the Platform X decision",
        inputLabel: "The decision as first minuted",
        outputLabel: "The repaired decision section",
        prompt: "Approved. The board was impressed by the demonstration and the supplier's track record.",
        output:
          "Decision: approve with conditions. The proposal answers the first, third and fourth questions. Before contract signature, the Head of Repairs will confirm the date on which routine phone reporting stops, and the Head of Procurement will confirm that the contract allows full export of tenant and repair data on exit. The ninety-day review is on 15 December, chaired by the Director of Operations.",
        reading: [
          "The minute as first written recorded two impressions. Neither the demonstration nor the track record answers any of the five questions.",
          "The repaired section says which questions were answered and turns the two open questions, the second and the fifth, into conditions. Each condition has an owner and a point by which it must be met, which is contract signature.",
          "It also fixes the date and chair of the ninety-day review, so the test from the last lesson will actually be run.",
        ],
      },
      practice: {
        intro:
          "Here are two decision sections written for the same proposal, a new rota system at Pennine Leisure Centres. The notes on the three decisions and on reasons are in the section above.",
        check: {
          kind: "choose",
          prompt: "Choose the decision section another leader could hold the proposer to.",
          leftLabel: "Decision A",
          left: "Approved, as the price is reasonable and the duty managers are enthusiastic about the new rota app.",
          rightLabel: "Decision B",
          right:
            "Not yet, because the proposal leaves the second and fifth questions open. It returns to the March meeting once the General Manager has set the date paper rotas stop and the Finance Manager has confirmed how rota data would be exported if the contract ended.",
          correct: "right",
          why: "Decision B names the decision, gives a reason in terms of the five questions, and says who must do what before it returns. Decision A records the price and the mood, which answer none of the questions.",
          wrong:
            "Look again at Decision A. 'Reasonable' and 'enthusiastic' are impressions, and nothing in it says which questions are answered or open. Decision B gives the reason and the conditions.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "Edit this decision note so another leader could hold the proposer to it. Add every part that is missing: an outcome in the work, the five questions marked as answered or open, an owner for each of the four kinds of failure, a ninety-day test, and a decision with its reason.",
        label: "The decision note you are repairing",
        start:
          "Proposal: new CRM for the sales team. Decision: approved, as the sales director is keen and the price is within budget. Success: better customer relationships.",
        unchanged:
          "You have not changed the note yet. Start by saying what will be different in the work for the sales team, then add each of the other sections.",
        keep: [
          {
            id: "proposal",
            any: ["crm"],
            missing: "Keep the proposal line, so the reader knows the note is about the new CRM for the sales team.",
          },
        ],
        limitWording: false,
        limits: [
          {
            id: "outcome",
            any: ["instead of", "no longer", "without asking", "fewer", "rather than", "will stop"],
            missing:
              "The note still does not say what will be different in the work. Add a sentence such as 'Account managers will log calls in the CRM instead of their own spreadsheets.'",
          },
          {
            id: "questions",
            any: ["leaves it open", "leave it open", "answered"],
            missing:
              "Mark each of the five questions as answered or with the words 'Leaves it open', so the reader can see what is still unknown.",
          },
          {
            id: "not-used",
            any: ["not used"],
            missing: "Name one person for each of the four kinds of failure. The note has no owner for the risk that the CRM is not used.",
          },
          {
            id: "not-working",
            any: ["not working"],
            missing: "Name one person for each of the four kinds of failure. The note has no owner for the risk that the CRM is not working.",
          },
          {
            id: "data",
            any: ["data exposed"],
            missing: "Name one person for each of the four kinds of failure. The note has no owner for the risk that data is exposed.",
          },
          {
            id: "supplier",
            any: ["supplier failure"],
            missing: "Name one person for each of the four kinds of failure. The note has no owner for supplier failure.",
          },
          {
            id: "starting-point",
            any: ["starting point", "baseline"],
            missing:
              "'Better customer relationships' cannot be held to. Give a measure, a starting point, a threshold, a date and a decision, and name the starting point in so many words.",
          },
          {
            id: "threshold",
            any: ["threshold", "at least"],
            missing:
              "The ninety-day test has no threshold. Say what value of the measure counts as working, for example 'at least 75% of calls logged'.",
          },
          {
            id: "decision",
            any: ["approve with conditions", "not yet", "approve because", "approve,", "decision: approve."],
            missing:
              "Give the decision as approve, approve with conditions, or not yet, in those words, so the reader knows which was chosen.",
          },
          {
            id: "reason",
            any: ["because"],
            missing:
              "'Keen' and 'within budget' are not reasons that answer the five questions. Give the reason with the word 'because', and say which questions the proposal answers and what remains open.",
          },
        ],
        why: "The note now says what is being bought as work, which questions are answered, who owns each failure, how you will test it at ninety days, and why you decided as you did.",
        result: {
          label: "How a repaired note reads",
          text: "Proposal: new CRM for the sales team. What we are buying: account managers will log every customer call in the CRM instead of their own spreadsheets. Five questions: the first, third and fourth are answered; the second and fifth leave it open. Not used: the Sales Operations Manager. Not working: the IT Manager. Data exposed: the Data Protection Officer. Supplier failure: the Finance Director. Test: calls logged in the CRM, starting point 0% today, threshold at least 75%, checked on 30 June; below 50% we pause. Decision: approve with conditions, because the proposal answers three questions; the Sales Director will set the date spreadsheets stop before signature.",
        },
      },
      bridge:
        "You can now repair a weak note. The next lesson brings every part of the method together on situations you have not seen before, and assesses your judgement across them.",
    },
    {
      id: "apply-the-method",
      title: "Apply the method to new proposals",
      emphasis: "method",
      place:
        "This is the course assessment. It recaps the method in full, works one mixed example, and then asks you to apply what you have learned to six situations you have not yet seen.",
      sections: [
        {
          heading: "The method in one page",
          paragraphs: [
            "The method has four moves and a record. First, you restate the proposal as outcomes in the work, so that everyone is approving the same change. Second, you put the five questions to it and write down which are answered and which are left open. Third, you name one owner for each of the four kinds of failure: not used, not working, data exposed and supplier failure.",
            "Fourth, you set a ninety-day test with a measure, a starting point, a threshold, a date and a decision. The record is the decision note, which puts all four moves on one page with a decision of approve, approve with conditions or not yet, and a reason given in terms of the five questions.",
          ],
        },
        {
          heading: "How the moves depend on each other",
          paragraphs: [
            "The moves are not independent. The ninety-day test measures the outcome from the first move, so a proposal with no outcome cannot have a meaningful test. The owner of the risk that the product is not used is usually the person who will collect the measure. The fifth question and the supplier failure owner are two views of the same concern.",
            "This is why a gap in one move tends to show up in another. If you cannot write the test, go back and check the outcome. If nobody will own supplier failure, the fifth question is probably still open. Reading the note as a whole is the final check that the decision hangs together.",
          ],
        },
        {
          heading: "What the assessment asks",
          paragraphs: [
            "Each question describes a real situation in a few sentences and offers three or four responses a reasonable leader might choose. Exactly one of them follows the method. The others are things experienced people do under time pressure, and the feedback on each explains what that choice would lead to.",
            "You need five of the six to pass. After you submit, each question shows whether your choice was right and why, so read the feedback on any you missed before you move on to your own note.",
          ],
        },
      ],
      workedExample: {
        title: "A mixed reading at Ashby Community Trust",
        inputLabel: "The paper to trustees",
        outputLabel: "The chair's reading",
        prompt:
          "We propose moving to DonorCloud, an intuitive, all-in-one supporter management solution. It is used by many leading charities, costs £9,600 a year, and will be managed by the fundraising team. It will transform our supporter experience.",
        output:
          "What we are buying: not stated; every phrase is a feature or a claim. Five questions: the fourth is answered in part by the annual cost; the others leave it open. Who owns the failure: 'the fundraising team' is not an owner, and no one is named for data exposed or supplier failure. Test: 'transform our supporter experience' cannot be held to. Decision: not yet, because four of the five questions are open. The Head of Fundraising, Tom Lacey, will bring back an outcome, named owners and a ninety-day test to the June meeting.",
        reading: [
          "Every move of the method found a gap, and the gaps are connected. With no outcome, there was nothing for a test to measure, and with no named owners, nobody had been asked to think about supporter data.",
          "The chair did not reject the proposal. She said not yet, gave the reason in terms of the five questions, and named the person who would bring it back and when.",
          "This is the kind of reading the assessment asks for: each situation is a small piece of a proposal like this one, and the right response is the one that applies the method.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, try one short question. The recap of the method is in the sections above.",
        check: {
          kind: "choose",
          prompt:
            "A proposer tells the board of Kestrel Print that the new estimating tool 'will pay for itself within a year'. Choose the better reply.",
          leftLabel: "Reply A",
          left: "Please show us the whole-life cost, including staff time and leaving at the end of the contract, and the measure we would check at ninety days to see it is on track.",
          rightLabel: "Reply B",
          right: "That is encouraging. Please send the supplier's case studies so we can see how other printers got on.",
          correct: "left",
          why: "Reply A turns a claim into the fourth question and a ninety-day test, both of which the board can hold the proposer to. Reply B asks for more reassurance about the supplier, which answers none of the five questions.",
          wrong:
            "Look again at Reply B. Case studies from other printers tell you about the supplier, not about what this tool will cost Kestrel over its life or how you would check it. Reply A asks for both.",
        },
      },
      check: {
        kind: "scenario",
        prompt: "Answer all six questions. Each describes a situation you have not seen in the course so far.",
        passMark: 5,
        questions: [
          {
            id: "law-firm",
            situation:
              "At Mercer & Hale, a regional law firm, the practice director presents a proposal for document automation software with 'AI clause libraries, smart templates and integrations with the case management system'. The partners enjoyed the demonstration. You are the managing partner, and you are asked to approve it at the end of the meeting.",
            question: "What do you do first?",
            options: [
              {
                id: "a",
                text: "Ask for a second demonstration using one of the firm's own contracts.",
                feedback:
                  "A second demonstration shows the features again on better data, but it still does not tell you what the firm will do differently. Ask first what will be different in the work and for whom.",
              },
              {
                id: "b",
                text: "Ask the practice director to say what will be different in the work, for whom, and by how much, such as the time a trainee takes to produce a first draft lease.",
                correct: true,
                feedback:
                  "That holds. Every phrase in the pitch is a feature of the product. Asking for the outcome in the work gives the partners the same thing to approve and something to test later.",
              },
              {
                id: "c",
                text: "Approve a small pilot, because the cost is low and the partners liked it.",
                feedback:
                  "A pilot without a stated outcome has nothing to be measured against, so it tends to become permanent by default. State the outcome first, and a pilot can then test it.",
              },
              {
                id: "d",
                text: "Ask the IT manager whether the technology is sound.",
                feedback:
                  "The IT manager's view is useful later, but it answers how the product works. Your first question as the person approving is what will change in the work.",
              },
            ],
          },
          {
            id: "charity-crm",
            situation:
              "The business case for a new fundraising database at Brightwater Trust gives a clear three-year cost and names a well-established supplier. It says the database will 'sit alongside' the current supporter spreadsheet during the transition. It does not say when the transition ends.",
            question: "Which question do you send back to the proposer?",
            options: [
              {
                id: "a",
                text: "On what date does the supporter spreadsheet stop being used, and who will make sure it does?",
                correct: true,
                feedback:
                  "That holds. The case leaves the second question open. Without a date on which the old way stops, staff will keep both, and the trust will pay for the new system while still working in the old one.",
              },
              {
                id: "b",
                text: "Can the supplier provide three references from similar charities?",
                feedback:
                  "References tell you more about the supplier's reputation, which the case already covers. The open question is when the old spreadsheet stops, and references will not answer it.",
              },
              {
                id: "c",
                text: "Can the supplier offer a discount on the three-year term?",
                feedback:
                  "A discount improves the fourth question, which is already answered. It leaves the gap untouched: nobody has said when the spreadsheet stops.",
              },
            ],
          },
          {
            id: "school-trust",
            situation:
              "Oakfield Schools Trust is approving a new pupil information system across six schools. The ownership section reads: 'The Trust's managed IT partner, Corvane Ltd, will own all risks associated with the system.' The trust's chief operating officer asks whether that is good enough.",
            question: "What do you tell her?",
            options: [
              {
                id: "a",
                text: "Yes, because Corvane is contracted to manage the system and has the expertise.",
                feedback:
                  "Corvane can meet its contract, but it cannot own the risk that staff do not use the system, and it cannot own its own failure. That leaves at least two kinds of failure with nobody at the trust watching them.",
              },
              {
                id: "b",
                text: "Yes, as long as the trust board reviews the risks each term.",
                feedback:
                  "A board that meets each term cannot notice a failure on a Wednesday afternoon. Adding a board to a supplier still leaves no one named person for each kind of failure.",
              },
              {
                id: "c",
                text: "No. Name one person inside the trust for each of not used, not working, data exposed and supplier failure, with Corvane managed by whoever owns not working.",
                correct: true,
                feedback:
                  "That holds. Each kind of failure now has one person who will notice it, decide what to do and report. Corvane is still responsible for its contract, and someone at the trust holds it to that.",
              },
              {
                id: "d",
                text: "No. Make the chief executive the owner of all the risks instead.",
                feedback:
                  "One senior person for all four kinds of failure is almost as weak as a supplier. The chief executive will not notice low adoption in a single school. Split the four risks and name an owner for each.",
              },
            ],
          },
          {
            id: "hotel-checkin",
            situation:
              "Harbour Street Hotels wants to introduce self-service check-in kiosks in its four hotels. The success section of the proposal says: 'Guests will love the faster, modern check-in experience.' The group finance director asks you, as operations director, to tighten it before the board meets on Thursday.",
            question: "How do you rewrite the success section?",
            options: [
              {
                id: "a",
                text: "Replace it with 'Guest satisfaction scores will improve by 15%.'",
                feedback:
                  "A number is not enough. It has no starting point, no date and no decision, so it still cannot be held to.",
              },
              {
                id: "b",
                text: "Add a line saying the kiosk supplier has high satisfaction ratings at other hotels.",
                feedback:
                  "That tells you about the supplier's other customers. It gives no measure for these four hotels and no decision for the board to take at ninety days.",
              },
              {
                id: "c",
                text: "Leave it as it is, because the board will see the results once the kiosks are in.",
                feedback:
                  "Without a starting point taken before launch, nobody will be able to say whether the results are good. The time to set the test is now, while the old desk is still running.",
              },
              {
                id: "d",
                text: "Set a measure such as average queue time at check-in, record the current figure before launch, set a threshold, a date ninety days after go-live, and what the board will do if it is missed.",
                correct: true,
                feedback:
                  "That holds. The test has all five parts, so the finance director or anyone else could check it and reach the same answer, and the board knows in advance what it will do.",
              },
            ],
          },
          {
            id: "discount-deadline",
            situation:
              "The board of Tallis Manufacturing likes a proposal for a new stock control system. The outcome, owners and ninety-day test are all clear, but nobody has seen the contract's exit and data export terms. The supplier has offered a 12% discount if the contract is signed by Friday.",
            question: "What decision do you record?",
            options: [
              {
                id: "a",
                text: "Approve, so the discount is not lost, and check the exit terms after signature.",
                feedback:
                  "After signature is the one point at which the exit terms can no longer be negotiated. The discount answers the fourth question a little better and leaves the fifth question open for the life of the contract.",
              },
              {
                id: "b",
                text: "Approve with conditions: the Finance Director confirms before signature that the contract allows full export of stock data on exit, and if that cannot be done by Friday, the discount is let go.",
                correct: true,
                feedback:
                  "That holds. The decision names the open question, who closes it and by when, and it states in advance what happens if the deadline cannot be met.",
              },
              {
                id: "c",
                text: "Not yet, and return the proposal to next quarter's meeting.",
                feedback:
                  "Not yet can be right, but here it gives no reason and names no one to close the open question. Everything else is answered, so a single named condition before signature fits better.",
              },
              {
                id: "d",
                text: "Reject the proposal, because the supplier is applying pressure.",
                feedback:
                  "The pressure is worth noticing, but the proposal answers four questions well. Rejecting it throws that away. Record the open question as a condition instead.",
              },
            ],
          },
          {
            id: "ninety-day-result",
            situation:
              "Ninety days after Westfield Council launched online reporting for missed bin collections, 41% of reports come in online against a threshold of 35%. Calls chasing missed collections are still at the level recorded before launch. The decision agreed in advance was: if online reporting is met but chasing calls are not, change the confirmation messages before the next review.",
            question: "What do you do at the review?",
            options: [
              {
                id: "a",
                text: "Declare the project a success, because the main threshold was beaten.",
                feedback:
                  "The test had two parts, and one was missed. Declaring success ignores the result the council agreed to act on, and the chasing calls will continue.",
              },
              {
                id: "b",
                text: "Stop the project and review the contract, because calls have not fallen.",
                feedback:
                  "Stopping was not the agreed response to this result. Online reporting is working, and the test said to change the confirmation messages first.",
              },
              {
                id: "c",
                text: "Do what was agreed: ask the owner to change the confirmation messages and set the next review date.",
                correct: true,
                feedback:
                  "That holds. The decision was written in advance for exactly this result, so the review is short and the change is specific. That is the point of a test with a decision attached.",
              },
              {
                id: "d",
                text: "Extend the test for another ninety days without changing anything, to see whether calls fall on their own.",
                feedback:
                  "Waiting without a change goes against the decision the council agreed, and it spends another three months paying for calls the test said to address now.",
              },
            ],
          },
        ],
        why: "You applied the method across new proposals: finding the outcome, sending back the open question, naming owners, setting a test that can be held to, recording a decision with conditions, and acting on a result as agreed.",
      },
      bridge:
        "You have shown you can apply the method to other people's proposals. In the last lesson you write the decision note for a real proposal of your own, and that note becomes your record.",
    },
    {
      id: "your-decision-note",
      title: "Your decision note",
      emphasis: "note",
      place:
        "This is the final lesson. You will write the decision note for a real proposal you are deciding on now or decided recently, and the note you write is what appears on your signed record.",
      sections: [
        {
          heading: "Choose a real proposal",
          paragraphs: [
            "Choose a proposal you have in front of you, or one you decided on in the last year. A real proposal is better than an invented one, because you know what was said in the room, you know which questions were answered, and you will know in ninety days whether the test was fair.",
            "Your record can be opened by anyone with its reference, so leave out commercially confidential figures and personal details. You can describe costs in general terms, such as 'within the department's approved budget', and use roles rather than names where that is more appropriate.",
          ],
        },
        {
          heading: "Write each section so a colleague could use it",
          paragraphs: [
            "The test for the note is whether a colleague who was not in the meeting could read it, run the ninety-day review and know what to do with the result. A line is Ready for the record when that colleague could act on it as it stands. A line where A colleague would have to ask what you meant needs more work.",
            "Write the five questions as five short lines, each with the answer or the words 'Leaves it open'. Write the owners as four lines, starting with not used, not working, data exposed and supplier failure. A note that concludes 'not yet' is as valid as one that approves, as long as it says which questions must be answered first.",
          ],
        },
        {
          heading: "How the note is checked",
          paragraphs: [
            "When you continue, each section is checked in turn. What we are buying must state at least one outcome in the work, using words such as will, instead of, or no longer. The five questions must show which are answered and which leave it open. Who owns the failure must name the four kinds of failure and at least one role.",
            "The ninety-day test must give a starting point and include a number or a date. The decision must say approve, approve with conditions or not yet. If a section falls short, the note names it and says what to add. When every section passes, you sign your name, and the record shows the note exactly as you wrote it.",
          ],
        },
      ],
      workedExample: {
        title: "The Platform X decision note",
        inputLabel: "What the director brought to the board",
        outputLabel: "The note as signed",
        prompt:
          "Ruth Abiola's working notes from the earlier lessons: the restated outcomes, the reading against the five questions, the four named owners, and the ninety-day test for online repair reporting.",
        output:
          "What we are buying: tenants will report repairs online and get texts when a repair is booked and when the operative is on the way; the repairs team will stop taking most routine reports by phone; chasing calls to the contact centre should fall.\nFive questions: 1 answered by the outcomes above. 2 leaves it open, as no date is set for phone reporting to stop. 3 answered: the Repairs Coordinator, one day a week. 4 answered in part: licence cost known, staff time and exit cost not yet costed. 5 leaves it open, as data export on exit is not confirmed.\nWho owns the failure: Not used: Head of Repairs. Not working: IT Service Manager. Data exposed: Data Protection Officer. Supplier failure: Head of Procurement.\nThe ninety-day test: share of routine repairs reported online, starting point 0%, threshold one third, and chasing calls below the pre-launch baseline, checked on 15 December; continue, change the texts, or stop and review the break clause.\nDecision and reason: approve with conditions, because questions 1, 3 and 4 are answered; before signature the Head of Repairs sets the phone cut-off date and the Head of Procurement confirms data export on exit.",
        reading: [
          "The note is one page, and each section is the work of one earlier lesson. It would survive the departure of anyone named in it, because it names roles as well as people.",
          "It is honest about what is open. The second and fifth questions are marked 'Leaves it open', and both become conditions with an owner and a deadline.",
          "The person chairing the December review knows exactly what they are checking and what the board agreed to do with each result.",
        ],
      },
      practice: {
        intro:
          "Before you write your own note, read these lines from a colleague's draft and mark each one. The test for Ready for the record is in the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each line as Ready for the record or as A colleague would have to ask.",
          passLabel: "Ready for the record",
          failLabel: "A colleague would have to ask",
          sentences: [
            {
              id: "buying",
              text: "What we are buying: a best-in-class HR platform.",
              fail: true,
              why: "This is a feature of the product. A colleague would have to ask what will be different in the work.",
            },
            {
              id: "owner",
              text: "Supplier failure: the Head of Finance, who will confirm the export terms before renewal in April.",
              fail: false,
              why: "This names one role, what they will do and when, so a colleague could act on it.",
            },
            {
              id: "test",
              text: "The ninety-day test: we will review how it is going.",
              fail: true,
              why: "There is no measure, starting point, threshold, date or decision, so a colleague would not know what to check.",
            },
          ],
          why: "That is right. The supplier failure line is ready for the record. The other two describe the product and a vague review, and a colleague would have to ask what was meant.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the decision note for a real proposal. Include all five sections, and leave out anything commercially confidential.",
        fields: [
          {
            id: "buying",
            label: "What we are buying",
            hint: "At least one outcome in the work: what will be different, for whom, and what stops.",
            min: 40,
            any: ["will ", "instead of", "no longer", "rather than", "fewer"],
            missing:
              "What we are buying does not yet state an outcome in the work. Say what will be different and for whom, for example 'Engineers will receive their jobs the evening before instead of at the depot.'",
          },
          {
            id: "questions",
            label: "Five questions",
            hint: "One line for each question, with the answer, or the words 'Leaves it open'.",
            min: 80,
            any: ["leaves it open", "leave it open", "answered", "answers"],
            missing:
              "The five questions are not yet marked. Write one line for each, and say whether it is answered or write 'Leaves it open'.",
          },
          {
            id: "owners",
            label: "Who owns the failure",
            hint: "Four lines: not used, not working, data exposed and supplier failure, each with one named person or role.",
            min: 60,
            rule: "role",
            any: ["not used", "not working", "data exposed", "supplier failure"],
            missing:
              "Who owns the failure does not yet name the kinds of failure. Write four lines starting with not used, not working, data exposed and supplier failure, each with one person or role.",
          },
          {
            id: "test",
            label: "The ninety-day test",
            hint: "The measure, the starting point, the threshold, the date and the decision.",
            min: 60,
            rule: "fact",
            any: ["starting point", "baseline", "today", "currently", "current"],
            missing:
              "The ninety-day test has no starting point, or no number or date. Say what the measure is today, the threshold that counts as working, and the date it will be checked.",
          },
          {
            id: "decision",
            label: "Decision and reason",
            hint: "Approve, approve with conditions, or not yet, with the reason in terms of the five questions and who meets any conditions by when.",
            min: 40,
            any: ["approve", "not yet"],
            missing:
              "Decision and reason does not yet give a decision. Write approve, approve with conditions or not yet, and say why in terms of the five questions.",
          },
        ],
        why: "Your note states the outcomes, answers or marks each question, names an owner for each kind of failure, sets a test someone can hold you to, and gives a decision with its reason.",
      },
      bridge:
        "Your decision note is ready to sign. Once it is on your record, put the ninety-day review in the diary of the person who will chair it.",
    },
  ],
};
