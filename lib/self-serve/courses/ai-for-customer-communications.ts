/*
Course: AI for Customer Communications
Slug: ai-for-customer-communications
For: Anyone who writes to customers or clients with the help of an AI tool, such as customer service
  advisers, account managers, sales support, practice managers, and small business owners. They already
  draft with an AI tool at least occasionally, and they know their main customer policies (refunds,
  delivery, complaints) or where to find them. No complaint handling or sales experience is assumed.
Outcome: The learner drafts customer replies, proposals, and complaint responses with an AI tool using a
  stated pattern for each, marks which sentences in any draft commit the organisation, runs a four-question
  check before every send, and decides whether the draft is sent or held for someone with authority.
Artefact: The send-or-hold note, a written rule for the learner's own AI-assisted customer messages that a
  colleague or a new starter could follow.
Record sentence: Wrote and signed a send-or-hold note that sets out which AI-drafted customer messages can
  go out and which must be held for someone with authority.
Lessons (id, title, move, interaction, pass rule):
  1. what-can-be-sent, What can be sent, tell a sentence that is safe to send from one that commits the
     company, mark ("Safe to send" / "Commits the company"), every sentence marked correctly.
  2. the-reply-pattern, The reply pattern, acknowledge, answer from checked facts, give the next step,
     choose between two replies, the reply that follows the pattern and commits nothing new.
  3. the-proposal-pattern, The proposal pattern, trace every figure to an approved source, mark ("From an
     approved source" / "Not from an approved source"), every figure marked correctly.
  4. the-complaint-pattern, The complaint pattern, repair a complaint response to the four parts, edit,
     the lamp named, the replacement and its dispatch tomorrow stated, and a route onward given.
  5. the-check-before-send, The check before send, apply four questions and decide send or hold, choose
     between two drafts, the draft that passes all four questions.
  6. course-assessment, Course assessment, the whole method on new cases, scenario of seven questions,
     six of seven correct.
  7. the-send-or-hold-note, The send-or-hold note, write the note, build with six fields, each field
     meets its rule or names a course-specific term.
Sources: UK Information Commissioner's Office, Guidance on AI and data protection, and its guidance on
  data minimisation. Financial Conduct Authority, the Consumer Duty (PS22/9 and guidance), for regulated
  financial services. Committee of Advertising Practice, The CAP Code, on misleading claims. UK Government,
  Consumer Rights Act 2015 explanatory notes on legislation.gov.uk.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const SAFE = "Safe to send";
const COMMITS = "Commits the company";
const APPROVED = "From an approved source";
const NOT_APPROVED = "Not from an approved source";
const SEND = "Send";
const HOLD = "Hold";
const FOLLOW = "A new starter could follow it";
const VAGUE = "Too vague to follow";

export const COURSE: CourseContent = {
  slug: "ai-for-customer-communications",
  hours: 2.5,
  artefact: {
    lessonId: "the-send-or-hold-note",
    title: "The send-or-hold note",
    recordLine:
      "Wrote and signed a send-or-hold note that sets out which AI-drafted customer messages can go out and which must be held for someone with authority.",
  },
  lessons: [
    {
      id: "what-can-be-sent",
      title: "What can be sent",
      emphasis: "sent",
      place:
        "This is the first of seven lessons. It gives you the one distinction that every later lesson uses: the difference between a sentence you can send once it is accurate and a sentence that commits your organisation to something.",
      sections: [
        {
          heading: "Two kinds of sentence",
          paragraphs: [
            "Every sentence in a customer message does one of two jobs. Some sentences acknowledge, explain, or ask. They thank the customer, confirm what the customer said, explain a policy that already exists, or ask for the information you need to help. Other sentences commit the organisation. They promise a price, a date, a refund, a replacement, a credit, an exception to a policy, or they admit that something was the organisation's fault.",
            "This course gives each kind a label. A sentence is Safe to send when it only acknowledges, explains an existing policy accurately, or asks for information, and you have checked that what it says is true. A sentence Commits the company when it promises something, waives a condition, or admits fault. A sentence that commits the company can only go out if the commitment has already been made by someone with the authority to make it.",
          ],
        },
        {
          heading: "What the distinction is not",
          paragraphs: [
            "The distinction is not about whether a commitment is generous or mean. A £5 voucher offered without authority is still a commitment, and the customer is entitled to hold the organisation to it. A small promise made casually in a reply can cost more in the end than a large one agreed properly, because nobody has recorded it and nobody has budgeted for it.",
            "It is also not about tone. A warm sentence can be safe to send, and a short, businesslike sentence can commit the company. 'I am so sorry this has happened' is safe to send, because it apologises for the customer's experience without promising a remedy. 'We will cover the cost' is brief and plain, and it commits the company to paying.",
          ],
        },
        {
          heading: "Why the model adds commitments",
          paragraphs: [
            "A language model writing a helpful reply will often add commitments that nobody asked for. It has learned from a great many customer service messages, and helpful replies in that writing usually offer something: a refund, a voucher, a date, a promise that it will not happen again. When your prompt asks for a helpful reply and gives no limit, offering something is what the model tends to write.",
            "The result reads as finished and friendly, which is exactly why it is risky. The adviser skims it, sees nothing rude or wrong in tone, and sends it. The customer then quotes the voucher or the delivery date back to the organisation, and a colleague has to either honour a promise nobody authorised or withdraw it and deal with a second complaint.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to read a draft for accuracy and tone as a whole, rather than one sentence at a time. A reply can be accurate in four sentences and commit the company in the fifth, and a quick read of the whole message will miss it because the overall impression is good.",
            "The move this lesson teaches is to read each sentence on its own and give it one of the two labels. If a sentence commits the company, you ask whether that commitment has already been made by someone with authority. If it has not, the sentence comes out or the message is held, and later lessons show you how to decide which.",
          ],
        },
      ],
      workedExample: {
        title: "A helpful reply about a late parcel",
        inputLabel: "The adviser's prompt",
        outputLabel: "The reply the model drafted",
        prompt:
          "Write a helpful reply to this customer. 'My parcel was due on Friday and it still has not arrived. Order 88213. Can you tell me what is going on? Gemma Lowry.'",
        output:
          "Thank you for letting us know, Gemma, and I am sorry your parcel has not arrived. I can see it left our warehouse on Monday. We will refund your delivery charge and send a £10 voucher for the inconvenience. It will be with you by Thursday.",
        reading: [
          "The first sentence thanks Gemma and apologises for the wait. It promises nothing and admits nothing, so once the adviser has checked it, it is safe to send.",
          "The second sentence states a fact from the tracking system. The adviser checks it against the order record, finds it is correct, and marks it safe to send.",
          "The third sentence makes two commitments, a refund of the delivery charge and a £10 voucher. The organisation's delivery policy gives the adviser no authority to offer either, and neither was in the prompt. The fourth sentence commits to a Thursday delivery that the tracking system does not give. Half of the reply commits the company, and the adviser removes both sentences before anything is sent.",
        ],
      },
      practice: {
        intro:
          "Here is a reply a model drafted for a hotel reservations team. Use the two labels from this lesson to mark each sentence. The definitions and the worked example are still above if you want to read them again.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence of the reply as Safe to send or as Commits the company.",
          material: {
            label: "The customer's message and the facts",
            text: "Ravi Menon asked whether he can check in early on Saturday. The hotel's published policy is check-in from 3pm, with early check-in subject to availability on the day.",
          },
          passLabel: SAFE,
          failLabel: COMMITS,
          sentences: [
            {
              id: "thanks",
              text: "Thank you for your message, Ravi, and we look forward to welcoming you on Saturday.",
              fail: false,
              why: "This sentence thanks Ravi and promises nothing, so it is safe to send.",
            },
            {
              id: "policy",
              text: "Check-in is from 3pm, and early check-in depends on availability on the day.",
              fail: false,
              why: "This sentence repeats the published policy accurately, so it is safe to send.",
            },
            {
              id: "room",
              text: "I have reserved your room from 10am so that it will be ready when you arrive.",
              fail: true,
              why: "The policy says early check-in depends on availability on the day. Reserving the room from 10am commits the company to something the policy does not offer.",
            },
          ],
          why: "That is right. The thanks and the policy are safe to send, and the reserved room from 10am commits the company to an early check-in the policy does not guarantee.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A model drafted this reply to a customer whose kettle has stopped working. Read the returns policy, then mark each sentence as Safe to send or as Commits the company.",
        material: {
          label: "The returns policy",
          text: "Faulty items can be replaced or refunded within 30 days of purchase with proof of purchase.",
        },
        passLabel: SAFE,
        failLabel: COMMITS,
        sentences: [
          {
            id: "sorry",
            text: "Thank you for getting in touch, and I am sorry the kettle has stopped working.",
            fail: false,
            why: "An apology for the inconvenience does not promise a remedy or admit fault, so it is safe to send.",
          },
          {
            id: "policy",
            text: "Our policy allows a replacement or refund within 30 days of purchase with proof of purchase.",
            fail: false,
            why: "This sentence repeats the existing policy accurately and adds nothing the organisation has not already offered, so it is safe to send.",
          },
          {
            id: "waive",
            text: "We will send you a new kettle today, and you do not need to send any proof of purchase.",
            fail: true,
            why: "This sentence promises a replacement today and drops the proof of purchase requirement, so it commits the company beyond its policy.",
          },
          {
            id: "ask",
            text: "Could you reply with your order number or a photo of the receipt?",
            fail: false,
            why: "Asking for the proof of purchase the policy requires makes no promise, so it is safe to send.",
          },
        ],
        why: "You separated the sentences that acknowledge, explain, and ask from the one that commits the company. The new kettle today and the waived proof of purchase are the sentence that would have cost the organisation money and set a precedent for the next customer.",
      },
      bridge:
        "The next three lessons give you a pattern for each common kind of customer message, so that the model has less room to add commitments in the first place, starting with the routine reply.",
    },
    {
      id: "the-reply-pattern",
      title: "The reply pattern",
      emphasis: "reply",
      place:
        "This is the second of seven lessons and the first of three patterns. Routine replies are the most frequent customer message, and they are the message most often sent without a second look.",
      sections: [
        {
          heading: "Three parts in order",
          paragraphs: [
            "A routine reply answers a question or updates a customer on something ordinary, such as an order status, an appointment time, or how to do something on an account. The reply pattern has three parts, in this order. First, acknowledge what the customer asked, in one sentence. Second, answer from facts you can see, such as the order system or the published policy. Third, give the next step, meaning what happens now and who does it.",
            "Each part has a job. The acknowledgement shows the customer you read their message. The answer gives them the information they asked for, and only information you have checked. The next step tells them what to expect, which stops them writing again to ask and gives them something concrete in place of a promise.",
          ],
        },
        {
          heading: "Putting the pattern in the prompt",
          paragraphs: [
            "The pattern works best when it is in the prompt rather than only in your head. A reply prompt gives the model three things: the customer's message, the facts you have checked, and a limit on what the reply must not offer. It then asks for the three parts of the pattern by name.",
            "The limit matters as much as the facts. A sentence such as 'Do not offer refunds, credits, or dates that are not in the facts' tells the model what to leave out, and it removes the space that a helpful model would otherwise fill with a commitment. Without it, the model may still add a goodwill gesture after the next step, because that is how many replies it has seen end.",
          ],
          beforeAfter: {
            before: "Write a helpful reply to this customer about their sofa delivery.",
            after:
              "Reply to this customer about their sofa delivery. Facts from the order system: order 55120, sofa in stock, delivery slot not yet booked, the delivery team will phone within two working days to book. Do not give a delivery date or offer any compensation. Three sentences: acknowledge, answer, next step.",
            reading:
              "The first version asks for helpfulness and gives no facts, so the model will supply a date and perhaps a gesture. The second gives the checked facts, a limit, and the three parts of the pattern, so the model has a true next step to offer in place of an invented date.",
          },
        },
        {
          heading: "What the pattern is not",
          paragraphs: [
            "The pattern is not a script to paste unchanged into every reply. The words should still fit the customer and the question, and a reply to a long-standing client can sound different from a reply to a first-time buyer. What stays the same is the shape: acknowledge, answer, next step.",
            "It is also not a way to avoid answering. A reply that acknowledges warmly and then gives no answer and no next step leaves the customer where they started, and they will write again. If you do not have the answer yet, the next step is where you say who will find it out and when, as long as that timing is one you can stand behind.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to give the model the customer's message and ask for a friendly reply, without the facts or the limit. The model then answers from general knowledge of how such replies go, which means it guesses the order status and often adds a small offer to make up for any inconvenience.",
            "The second mistake is to let the reply run long. A routine reply that grows to six or seven sentences has usually picked up a commitment somewhere in the extra length. Asking for three sentences keeps it to the pattern and makes it quicker to read one sentence at a time before sending.",
          ],
        },
      ],
      workedExample: {
        title: "A routine question about a sofa",
        inputLabel: "The adviser's prompt",
        outputLabel: "The reply that went out",
        prompt:
          "Reply to this customer. 'Hi, when will my sofa be delivered? Order 55120. Thanks, Helen Brook.' Facts from the order system: order 55120, sofa in stock, delivery slot not yet booked, the delivery team will phone within two working days to book. Do not give a delivery date or offer any compensation. Three sentences: acknowledge, answer, next step.",
        output:
          "Thank you for checking on your sofa order, Helen. It is in stock and ready to go, but the delivery slot has not been booked yet. Our delivery team will phone you within two working days to agree a date with you.",
        reading: [
          "The first sentence acknowledges the question and names the item, so Helen can see her message was read.",
          "The second sentence answers from the order system. It says the sofa is in stock and that no slot is booked, which is true, and it gives no date because the facts contain none.",
          "The third sentence gives the next step and who does it. The model did not invent a date because the prompt told it not to and gave it the true next step instead. Every sentence is safe to send.",
        ],
      },
      practice: {
        intro:
          "Choose the prompt that would produce a reply in the pattern without adding a commitment. The section on putting the pattern in the prompt is still above.",
        check: {
          kind: "choose",
          prompt:
            "A dental practice receptionist wants to reply to a patient, Owen Clarke, who asked whether his check-up on Tuesday 14 October can move to later in the day. The diary shows a free slot at 4.30pm that day. Choose the prompt that follows the reply pattern.",
          leftLabel: "Prompt A",
          left: "Write a friendly, reassuring reply to Owen Clarke about moving his appointment. Make sure he feels looked after.",
          rightLabel: "Prompt B",
          right:
            "Reply to Owen Clarke. Facts from the diary: his check-up is on Tuesday 14 October, and a 4.30pm slot is free that day. Do not waive any fee or offer any other time. Three sentences: acknowledge his request, say the 4.30pm slot is free, and ask him to confirm so we can move it.",
          correct: "right",
          why: "Prompt B gives the facts from the diary, sets a limit on fees and other times, and asks for acknowledge, answer, and next step. Prompt A asks for reassurance with no facts or limit, which is the kind of prompt that produces an invented time or a waived fee.",
          wrong:
            "Look again at Prompt A. It gives the model no facts about the diary and no limit, so the model would guess a time and might add a gesture to make Owen feel looked after. Prompt B gives the facts, the limit, and the three parts of the pattern.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "A customer asks whether their gym membership can be frozen while they are abroad for two months. The published terms allow a freeze of up to three months for a £5 monthly fee. Choose the reply that follows the reply pattern and commits nothing new.",
        leftLabel: "Reply A",
        left: "Thanks for asking about freezing your membership. You can freeze it for up to three months for £5 a month. If you reply with your start and end dates, I will set it up for you.",
        rightLabel: "Reply B",
        right:
          "What a wonderful trip to have planned. Of course we will freeze your membership free of charge while you are away, and we will add an extra month at the end as a thank-you for being such a loyal member.",
        correct: "left",
        why: "Reply A acknowledges the question, answers from the published terms, and gives a next step that the customer can act on. It commits nothing the terms do not already offer, so every sentence is safe to send.",
        wrong:
          "Look again at Reply B. It waives the £5 fee and adds a free month, and neither is in the published terms, so it commits the company. Reply A acknowledges, answers from the terms, and gives the next step.",
      },
      bridge:
        "The next pattern is for proposals and quotes, where the commitment is usually a number and a single invented figure can become part of a contract.",
    },
    {
      id: "the-proposal-pattern",
      title: "The proposal pattern",
      emphasis: "proposal",
      place:
        "This is the third of seven lessons and the second pattern. A routine reply can commit the company in a sentence, but a proposal can commit it in a figure that the customer signs against.",
      sections: [
        {
          heading: "Four parts of a proposal",
          paragraphs: [
            "A proposal or quote tells a customer what you will provide and on what terms. The proposal pattern has four parts. Scope says what is included and what is not. Figures are the prices, quantities, and dates. Assumptions are the conditions the figures depend on, such as the number of users or the size of the site. Validity says how long the offer stands.",
            "Scope and assumptions protect you as much as the figures do. A price for weekly cleaning means something different if the scope includes window cleaning, and a price per user means something different if the assumption is ten users rather than forty. A proposal that leaves these out invites the customer to fill them in with the most generous reading.",
          ],
        },
        {
          heading: "Where each figure comes from",
          paragraphs: [
            "Every figure in a proposal must come from an approved source, which means a document your organisation has agreed, such as the current price list, a signed rate card, or a quote approved by someone with authority. A figure is From an approved source when you can name the document it came from and the figure matches it. A figure is Not from an approved source when it came from the model, from memory, or from a proposal written for a different customer.",
            "Models are fluent at proposals. They will write a monthly price, a discount for new clients, a response time, or a start date that looks entirely reasonable, because reasonable-looking figures are common in the writing they learned from. The model has no access to your rate card unless you paste it in, and even then it may add terms that sound normal for the industry but are not yours.",
          ],
          beforeAfter: {
            before: "Draft a proposal for a year's cleaning at the client's two sites using our standard rates.",
            after:
              "Draft a proposal for a year's cleaning at the client's two sites. Use only these figures from the current rate card: weekly office cleaning £0.42 per square metre per month, sites of 1,200 and 800 square metres, 12-month term. Do not add any discount, extra service, or start date. Include scope, figures, assumptions, and validity of 30 days.",
            reading:
              "The first version refers to standard rates the model has never seen, so it will invent them. The second gives the figures from a named document, forbids additions, and asks for all four parts, so every number in the draft can be traced.",
          },
        },
        {
          heading: "What this lesson is not about",
          paragraphs: [
            "This lesson is not about writing persuasively. A model can make a proposal read well, and that is useful, but polished wording around an invented price is still an invented price. The move here is to make sure that every figure a customer might hold you to is one your organisation has agreed.",
            "It is also not about refusing to use the model for proposals. Drafting the scope and the covering paragraphs with a model can save a great deal of time. The discipline is that you read the finished draft figure by figure, write the source next to each one, and replace or remove anything with no source before it goes out.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to check that the main price is right and assume the rest is fine. Invented figures often sit in the smaller print: a free first month, a response time, a quarterly extra, a start date. These are the details a customer remembers when something goes wrong.",
            "The second mistake is to reuse a proposal written for another customer and ask the model to adapt it. The model will carry across figures and terms that were agreed for that customer, perhaps a discount that a manager approved once, and present them as standard.",
          ],
        },
      ],
      workedExample: {
        title: "A cleaning proposal with no rate card",
        inputLabel: "The account manager's prompt",
        outputLabel: "The draft the model produced",
        prompt:
          "Draft a proposal for a year's cleaning at Ferris Logistics' two sites, Unit 4 at 1,200 square metres and Unit 9 at 800 square metres. Use our standard rates.",
        output:
          "We propose weekly cleaning at both sites for £1,150 per month, including window cleaning quarterly. As a new client you will receive a 10% discount for the first three months. We can begin on 1 November.",
        reading: [
          "The model does not have the standard rates, so £1,150 per month is not from an approved source. The account manager, Nadia Shah, replaces it with the figure calculated from the current rate card.",
          "Quarterly window cleaning is not in the standard scope, so it is a commitment the model added. Nadia removes it and lists it under what is not included.",
          "The 10% discount and the start date of 1 November appear in no document. Nadia removes the discount until her manager has approved it and checks the start date with operations before putting any date in the proposal.",
        ],
      },
      practice: {
        intro:
          "Choose the better way to handle a figure in a model-drafted proposal. The section on where each figure comes from is still above.",
        check: {
          kind: "choose",
          prompt:
            "A model drafted a catering quote for Brennan Events that includes 'a 5% discount for bookings over 100 covers'. The account manager, Liam, cannot find this discount on the current price list. Choose what Liam should do.",
          leftLabel: "Liam keeps it",
          left: "Liam keeps the discount, because discounts of that size are common for large bookings and the client will be pleased.",
          rightLabel: "Liam removes it",
          right:
            "Liam removes the discount, because it is not on the current price list, and asks his manager whether a discount can be offered before he adds anything back.",
          correct: "right",
          why: "The discount is not from an approved source, because it appears on no document Liam can name. Removing it and asking the person with authority keeps every figure in the quote traceable.",
          wrong:
            "Look again at the first option. A discount being common in the industry does not make it approved by Liam's organisation. The price list is the approved source, and the discount is not on it, so it comes out until someone with authority agrees it.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "An account manager asked a model to draft a quote for a client with 14 users. Read the current rate card, then mark each part of the quote as From an approved source or as Not from an approved source.",
        material: {
          label: "The current rate card",
          text: "Standard IT support: £45 per user per month. Minimum 10 users. 12-month term.",
        },
        passLabel: APPROVED,
        failLabel: NOT_APPROVED,
        sentences: [
          {
            id: "rate",
            text: "Support for 14 users at £45 per user per month.",
            fail: false,
            why: "The rate card gives £45 per user per month, and 14 users is above the minimum, so this figure is from an approved source.",
          },
          {
            id: "term",
            text: "A 12-month term.",
            fail: false,
            why: "The rate card states a 12-month term, so this is from an approved source.",
          },
          {
            id: "free",
            text: "With your first month free.",
            fail: true,
            why: "The rate card offers no free month. The model added it, so it is not from an approved source.",
          },
          {
            id: "response",
            text: "Response to urgent issues within one hour.",
            fail: true,
            why: "The rate card does not mention response times, so this is a commitment the model invented and it is not from an approved source.",
          },
        ],
        why: "You traced each figure to the rate card and caught the free month and the one-hour response time that the model added. Either of those could have become a term the client holds the company to for twelve months.",
      },
      bridge:
        "The third pattern is for complaints, where the commitment is often an admission of fault or an offer of compensation rather than a figure on a price list.",
    },
    {
      id: "the-complaint-pattern",
      title: "The complaint pattern",
      emphasis: "complaint",
      place:
        "This is the fourth of seven lessons and the third pattern. Complaints are where the pressure to offer something is greatest, and where a model's habit of pleasing the reader is most likely to go too far.",
      sections: [
        {
          heading: "Four parts of a complaint response",
          paragraphs: [
            "A complaint response has to show the customer they have been heard, without making promises or admissions that have not been authorised. The complaint pattern has four parts. First, acknowledge the specific issue in the customer's own terms, such as the two missed appointments or the broken lamp, and not 'your concerns'. Second, say what you have done or checked so far, only from facts. Third, say what happens next and when, only where the timing is known, for example from your complaints procedure. Fourth, give the route to escalate, such as the complaints procedure or, where it applies, an ombudsman.",
            "Naming the specific issue matters more than it seems. A customer who reads 'we are sorry for your concerns' knows the adviser has not engaged with what happened. A customer who reads 'I am sorry the lamp arrived broken' knows that someone read the complaint, which often takes the heat out of the exchange before any remedy is discussed.",
          ],
        },
        {
          heading: "An apology is not an admission",
          paragraphs: [
            "A response following this pattern does not admit fault or liability unless someone with authority has decided to. An apology for how the customer feels, or for the inconvenience, is appropriate and often right. An admission that the organisation was at fault is different, because it may have legal or financial consequences, and the decision to make it belongs to the complaints team or a manager, not to the adviser drafting the reply.",
            "The same applies to compensation. A response does not offer a refund, a voucher, or a goodwill payment outside what policy allows the adviser to give. If compensation may be appropriate, the response says that the complaints team will consider the case and when they will respond, which is a true next step rather than a promise.",
          ],
          beforeAfter: {
            before: "We completely accept this was our failure and will compensate you £50 for each missed visit.",
            after:
              "I am sorry the engineer did not arrive for your appointments on 3 and 6 October. I have logged your complaint, and a member of our complaints team will send you a full response within ten working days.",
            reading:
              "The first version admits liability and commits £100 that nobody authorised. The second apologises for the specific missed visits, states what has been done, and gives a next step with a known time, which leaves the decision on compensation with the people who can make it.",
          },
        },
        {
          heading: "What the pattern is not",
          paragraphs: [
            "The pattern is not cold, and it is not evasive. A response can be warm, can use the customer's name, and can say plainly that the experience was not good enough, as long as it does not promise a remedy or accept liability that has not been agreed. Customers generally respond better to a specific, honest account of what happens next than to a large apology with nothing behind it.",
            "It is also not a way of avoiding a remedy the adviser is allowed to give. If policy lets you send a replacement or rebook an appointment, the pattern expects you to do it and say so in the second part. The limit is on commitments beyond your authority, not on help within it.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to ask the model to 'apologise and make it right'. The model reads 'make it right' as an instruction to offer something, and it will write a refund, a voucher, or an admission that the organisation failed, because that is how many complaint replies it has seen resolve.",
            "The second mistake is to leave out the escalation route. A customer who is not satisfied needs to know what to do next, and a response that ends without it can prolong the complaint and, in regulated sectors, can fall short of what the organisation's own procedure requires.",
          ],
        },
      ],
      workedExample: {
        title: "Two missed engineer visits",
        inputLabel: "The adviser's facts and the model's first draft",
        outputLabel: "The response that went out",
        prompt:
          "Facts: both appointments on 3 and 6 October are marked 'missed, engineer unavailable' in the system. The complaint has been logged. The complaints procedure promises a full response within ten working days. A new appointment can be booked for Wednesday morning. The model's first draft said: 'We completely accept this was our failure and will compensate you £50 for each missed visit.'",
        output:
          "I am sorry that the engineer did not arrive for your appointments on 3 and 6 October. I can see both were missed, and I have logged your complaint. I have booked a new appointment for Wednesday morning, and a member of our complaints team will send you a full response within ten working days. If you are not satisfied with that response, the letter will explain how to take it further.",
        reading: [
          "The first sentence acknowledges the specific issue, the two missed visits on named dates, rather than 'your concerns'.",
          "The second and third sentences say what has been checked and done, from the system, and what happens next with a timescale taken from the complaints procedure.",
          "The last sentence gives the route to escalate. The adviser removed the admission of liability and the £100 of compensation from the first draft, because those decisions belong to the complaints team.",
        ],
      },
      practice: {
        intro:
          "Repair the prompt below so that the model cannot admit fault or offer compensation. Keep who is speaking and the facts. The section on apology and admission is still above.",
        check: {
          kind: "edit",
          label: "The prompt you are repairing",
          prompt:
            "Add the limits this complaint prompt is missing. The model must not offer compensation of any kind, and it must not admit fault or liability. Keep the adviser's role and the facts.",
          start:
            "You are a customer adviser at Hartwell Home. The facts are these: Mrs Adeyemi's washing machine was installed on 2 October and has leaked twice. An engineer visit is booked for Friday 17 October between 8am and 1pm. Her complaint is logged as C-40218, and the complaints procedure gives a full response within ten working days. Write a reply to her complaint in five sentences.",
          unchanged:
            "You have not changed the prompt yet. Add a sentence that starts with 'Do not' and says the reply must not offer compensation or admit fault.",
          keep: [
            {
              id: "role",
              any: ["customer adviser"],
              missing: "Keep who is speaking. The prompt should still say the reply comes from a customer adviser at Hartwell Home.",
            },
            {
              id: "facts",
              any: ["17 october", "c-40218"],
              missing: "Keep the facts. The prompt should still give the engineer visit on Friday 17 October and the complaint reference C-40218.",
            },
          ],
          limits: [
            {
              id: "money",
              any: ["compensation", "refund", "voucher", "credit", "goodwill", "£", "payment"],
              missing:
                "Your limit does not yet cover compensation. Add a sentence such as 'Do not offer a refund, voucher, credit, or goodwill payment.'",
            },
            {
              id: "fault",
              any: ["fault", "liability", "liable", "admit", "blame", "responsib"],
              missing:
                "Your limit does not yet cover admissions. Add a sentence such as 'Do not admit fault or liability; you may apologise for the inconvenience.'",
            },
          ],
          why: "That repair works. The prompt still says who is speaking and what is true, and it now tells the model it must not offer compensation and must not admit fault, so the pressure to 'make it right' has nowhere to go.",
          result: {
            label: "The reply your repaired prompt produces",
            text: "I am sorry your new washing machine has leaked twice since it was installed on 2 October. I have logged your complaint as C-40218. An engineer will visit on Friday 17 October between 8am and 1pm. Our complaints team will send you a full response within ten working days. If you are not satisfied with that response, it will explain how to take your complaint further.",
          },
        },
      },
      check: {
        kind: "edit",
        label: "The response you are repairing",
        prompt:
          "Edit this complaint response so that it follows the complaint pattern. The facts are these: the customer's order arrived with a broken lamp, the adviser has arranged a replacement lamp for dispatch tomorrow, which policy allows, and the adviser has no authority to offer compensation. Name the broken lamp, say what has been done, remove the refund, the voucher, and the admission of fault, and give a route onward.",
        start:
          "Dear customer, we are sorry for your concerns. This is completely unacceptable and entirely our fault. We will refund your whole order and give you a £25 voucher. We hope you will shop with us again.",
        unchanged:
          "You have not changed the response yet. Start by replacing 'your concerns' with the specific issue, the broken lamp.",
        keep: [
          {
            id: "lamp",
            any: ["lamp"],
            missing: "The response still does not name the specific issue. Replace 'your concerns' with the broken lamp.",
          },
          {
            id: "replacement",
            any: ["replacement", "replace", "new lamp"],
            missing: "Say what has been done: a replacement lamp has been arranged.",
          },
          {
            id: "tomorrow",
            any: ["tomorrow"],
            missing: "Say when the replacement will be dispatched, which the facts give as tomorrow.",
          },
        ],
        limits: [
          {
            id: "escalate",
            any: ["get in touch", "contact", "take it further", "complaint", "call us", "reply to this", "let me know", "let us know", "escalat"],
            missing:
              "Give the customer a route onward. Tell them how to get in touch or take it further if the replacement does not resolve it.",
          },
        ],
        limitWording: false,
        why: "Your response names the broken lamp, states the replacement and its dispatch tomorrow, and gives a route onward. Read it once more before you continue: the whole-order refund, the £25 voucher, and 'entirely our fault' should all be gone, because none of them was authorised.",
        result: {
          label: "A response that follows the pattern",
          text: "I am sorry that your lamp arrived broken. I have arranged a replacement lamp, which will be dispatched tomorrow. If it does not arrive or there is anything else wrong with your order, please reply to this email and I will look into it, or you can raise a complaint through the link below.",
        },
      },
      bridge:
        "You now have three patterns. The next lesson gives you the single check you run on any draft, whichever pattern produced it, before you press send.",
    },
    {
      id: "the-check-before-send",
      title: "The check before send",
      emphasis: "check",
      place:
        "This is the fifth of seven lessons. The patterns reduce the room for a model to add commitments, and this lesson adds the check that applies to every message before it goes out.",
      sections: [
        {
          heading: "Four questions",
          paragraphs: [
            "The check before send is four questions asked of the final draft. First, is every fact from a source I can name, such as the order system, the policy, or the rate card? Second, does any sentence commit the company beyond what I am authorised to commit? Third, is any personal data in the message correct, and is it only what this customer needs? Fourth, would I be content if this message were forwarded to my manager or read out in a complaint review?",
            "The questions work in that order for a reason. The first catches invented facts, the second catches commitments, the third catches data problems, and the fourth catches anything the first three missed, including tone that would read badly out of context. Asking all four takes less than a minute on a routine reply, and it becomes quicker with practice.",
          ],
        },
        {
          heading: "Send or hold",
          paragraphs: [
            "The check ends in one of two decisions. If the answer to all four questions is yes, you Send. If any answer is no, you Hold the message, which means you correct it yourself or pass it to the person who can authorise the commitment before it goes out.",
            "Holding is not a failure. A held message that goes out an hour later with the right approval is better than a fast one that promises something nobody agreed. Most organisations would rather an adviser held ten messages that turned out to be fine than sent one that committed the company to a refund outside policy.",
          ],
        },
        {
          heading: "Personal data in the message",
          paragraphs: [
            "The third question deserves its own attention, because models sometimes repeat everything they were given. If you paste an account record into the prompt, the draft may include the customer's date of birth, full address, or account number, none of which the customer needs to see in a reply about a delivery date.",
            "The test is whether each piece of personal data is correct and needed for this message. The UK Information Commissioner's Office describes this as data minimisation in its guidance on AI and data protection. In practice it means you remove anything the customer did not ask about and do not need, and you check that what remains is accurate.",
          ],
        },
        {
          heading: "What the check is not",
          paragraphs: [
            "The check is not a proofread for spelling and grammar. You may also do that, and a clean message reflects well on the organisation, but spelling does not protect the customer or the company. A perfectly spelled message can still promise a refund nobody authorised.",
            "The usual mistake is to run the check only on messages that feel risky, such as complaints, and to send routine replies without it. Routine replies are where commitments slip through most often, precisely because nobody expects them there. The check applies to every message a model helped to draft.",
          ],
        },
      ],
      workedExample: {
        title: "A refund outside the cooling-off period",
        inputLabel: "The adviser's draft",
        outputLabel: "The check and the decision",
        prompt:
          "Customer: Sean Doyle cancelled his broadband service on 20 September, 26 days after it started. The cooling-off period is 14 days. Draft reply: 'I have processed a full refund of £240 to your card ending 4417, which you will see in three to five days.'",
        output:
          "Question one: the £240 matches the account, so yes. Question two: policy allows a full refund only within the 14-day cooling-off period, and Sean is outside it, so the sentence commits the company beyond the adviser's authority. The answer is no. Question three: the card ending is correct and needed to identify the payment, so yes. Question four: the adviser would not be content for her manager to see it, because it breaks policy, so no. Decision: Hold. She passes the request to her team leader with a note.",
        reading: [
          "The draft looked finished and helpful, and the figure in it was accurate. A quick read would have sent it.",
          "The second question found the one sentence that exceeded the adviser's authority. The fourth question confirmed it from a different direction.",
          "The adviser did not refuse the customer. She held the message and passed it to the person who can decide, which is what the check is for.",
        ],
      },
      practice: {
        intro:
          "Each line below is a short draft for a different customer of a furniture retailer. Use the four questions to decide whether each one can be sent or must be held. The questions are still above.",
        check: {
          kind: "mark",
          prompt: "Mark each draft as Send or as Hold.",
          material: {
            label: "What the adviser knows",
            text: "The delivery policy allows the adviser to rebook a delivery at no charge. Any refund, credit, or price reduction must be approved by a team leader.",
          },
          passLabel: SEND,
          failLabel: HOLD,
          sentences: [
            {
              id: "rebook",
              text: "I am sorry we missed you on Tuesday. I have rebooked your delivery for Friday 24 October, at no charge.",
              fail: false,
              why: "Rebooking at no charge is within the adviser's authority, and the draft passes all four questions, so it can be sent.",
            },
            {
              id: "credit",
              text: "I am sorry the table arrived scratched. I have added a £60 credit to your account for the trouble.",
              fail: true,
              why: "A £60 credit needs team leader approval, so the draft commits the company beyond the adviser's authority and must be held.",
            },
            {
              id: "data",
              text: "Your order is on its way. For your records, your date of birth is 12 May 1978 and your account number is 00418823.",
              fail: true,
              why: "The date of birth and account number are not needed in a delivery update, so the draft fails the question on personal data and must be held.",
            },
          ],
          why: "That is right. The rebooked delivery is within the adviser's authority, the credit needs a team leader, and the personal data in the third draft is not needed for a delivery update.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "An adviser has two drafts ready for the same customer, who asked when their replacement bank card will arrive. The system shows the card was posted on Monday by standard post, which usually takes three to five working days. Choose the draft that passes all four questions and can be sent.",
        leftLabel: "Draft A",
        left: "Your new card was posted on Monday by standard post, which usually takes three to five working days. If it has not arrived by next Tuesday, please call us and we will look into it.",
        rightLabel: "Draft B",
        right:
          "Your new card will definitely arrive tomorrow. I have also noted your new address, 14 Park Road, and your date of birth, 3 March 1981, on the account for security.",
        correct: "left",
        why: "Draft A takes its facts from the system, commits only to what the bank already does, contains no unnecessary personal data, and would read well in a review. It passes all four questions and can be sent.",
        wrong:
          "Look again at Draft B. It promises delivery tomorrow, which the system does not support, and it repeats an address and a date of birth the customer does not need to see in a message. It fails the first three questions and must be held.",
      },
      bridge:
        "The next lesson brings the three patterns and the check together and assesses them on situations you have not yet seen.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It sets out the whole method again, works one mixed example, and then assesses it on seven new situations before the final lesson asks you to write your own send-or-hold note.",
      sections: [
        {
          heading: "Safe to send, or commits the company",
          paragraphs: [
            "Every sentence in a customer message either acknowledges, explains, and asks, or it commits the organisation. A sentence is safe to send when it thanks the customer, explains an existing policy accurately, or asks for information, and you have checked it is true. A sentence commits the company when it promises a price, a date, a refund, a replacement, a credit, or an exception to policy, or when it admits fault.",
            "A model asked for a helpful message will often add commitments, because helpful messages in its training usually offer something. The move is to read each draft one sentence at a time and ask of every commitment whether someone with authority has already made it.",
          ],
        },
        {
          heading: "Three patterns",
          paragraphs: [
            "The reply pattern is acknowledge, answer from checked facts, and give the next step, with a limit in the prompt on what the reply must not offer. The proposal pattern is scope, figures, assumptions, and validity, with every figure traced to an approved source you can name, such as the current rate card or price list.",
            "The complaint pattern is to acknowledge the specific issue, say what you have done or checked, say what happens next and when, and give the route to escalate. An apology for the inconvenience is appropriate, but an admission of fault or an offer of compensation outside policy is a decision for someone with authority.",
          ],
        },
        {
          heading: "The check before send",
          paragraphs: [
            "Before any message goes out, ask four questions. Is every fact from a source I can name? Does any sentence commit the company beyond my authority? Is any personal data correct, and only what this customer needs? Would I be content for this to be forwarded to my manager or read out in a complaint review?",
            "If all four answers are yes, send. If any answer is no, hold the message, correct it or pass it to the person who can authorise it. The assessment below has seven situations, each drawing on one or more of these moves. You need six of the seven to pass, and after you submit, each question shows the feedback for the option you chose.",
          ],
        },
      ],
      workedExample: {
        title: "A proposal follow-up with a complaint in it",
        inputLabel: "The customer's email and the model's draft",
        outputLabel: "What the account manager did",
        prompt:
          "Customer: 'Your team was two days late setting up our office network last week, which cost us a morning of trading. Before we sign the support contract, can you confirm the monthly price for 20 users?' Rate card: £38 per user per month, minimum 10 users. Draft: 'I am very sorry about the delay, which was entirely our fault. The monthly price for 20 users is £760, and to make up for the delay we will waive the first month.'",
        output:
          "The account manager, Tom Fielding, marks the apology as safe to send and 'entirely our fault' as an admission he is not authorised to make. He checks £760 against the rate card, 20 users at £38, and finds it is from an approved source. He removes the waived first month, which is on no document. He runs the check before send, gets a no on the second question for the original draft, and holds it until the revised version passes all four. He passes the question of any goodwill gesture to his manager.",
        reading: [
          "One message used three moves. The complaint pattern separated the apology from the admission. The proposal pattern traced the price to the rate card.",
          "The waived month was the commitment most likely to be quoted back when the contract was signed, and it had no source.",
          "The check before send confirmed the decision, and holding the draft cost a short delay rather than a month of revenue nobody had agreed to give away.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose the better version of Tom's reply. The worked example is still above.",
        check: {
          kind: "choose",
          prompt: "Choose the reply Tom can send to the customer.",
          leftLabel: "Version A",
          left: "I am sorry that the network set-up was two days late and cost you a morning of trading. The monthly price for 20 users is £760, based on our current rate card. I have passed your comments about the delay to my manager, Claire Hughes, who will contact you by Friday.",
          rightLabel: "Version B",
          right:
            "I am sorry for the delay, which was our fault. The monthly price for 20 users is £760, and as a gesture of goodwill we will waive the first month.",
          correct: "left",
          why: "Version A names the specific issue, gives a price traced to the rate card, and passes the question of goodwill to the person who can decide. Version B admits fault and waives a month, and neither was authorised.",
          wrong:
            "Look again at Version B. 'Which was our fault' is an admission, and the waived first month is not on the rate card. Version A apologises for the specific delay and leaves the decision on goodwill with Claire Hughes.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each question has one right answer, and you need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "mark",
            situation:
              "Aisha Karim is a customer adviser at Pennant Opticians. A customer asked whether his new glasses are ready. The model's draft reads: 'Thank you for checking. Your glasses arrived at our Leeds branch this morning. As they took longer than expected, we have added a free eye test to your account.' The branch system confirms the glasses arrived this morning, and there is nothing about a free eye test.",
            question: "Which sentence should Aisha remove or hold before sending?",
            options: [
              {
                id: "a",
                text: "The first sentence, because thanking the customer adds nothing useful.",
                feedback:
                  "Thanking the customer promises nothing, so it is safe to send. The sentence to deal with is the free eye test, which commits the company to something nobody authorised.",
              },
              {
                id: "b",
                text: "The third sentence, because the free eye test commits the company and is not in any record.",
                correct: true,
                feedback:
                  "Yes. The free eye test is a commitment the model added, and the branch system says nothing about it. The first two sentences acknowledge and state a checked fact, so they are safe to send.",
              },
              {
                id: "c",
                text: "The second sentence, because naming the branch could be seen as a promise.",
                feedback:
                  "The branch and the arrival are confirmed by the branch system, so the second sentence states a checked fact and is safe to send. The free eye test is the commitment.",
              },
            ],
          },
          {
            id: "reply",
            situation:
              "Dan Whitfield handles enquiries for Marlow Storage. A customer asks whether she can access her storage unit on a bank holiday. The published terms say units are accessible 7am to 7pm every day except Christmas Day. Dan wants the model to draft a short reply.",
            question: "Which prompt should Dan use?",
            options: [
              {
                id: "a",
                text: "'Write a warm reply to this customer that makes her feel valued.'",
                feedback:
                  "A request for warmth with no facts and no limit leaves the model to guess the access hours and perhaps add a gesture. The prompt needs the facts from the terms, a limit, and the three parts of the pattern.",
              },
              {
                id: "b",
                text: "'Answer this customer's question about bank holiday access as helpfully as possible.'",
                feedback:
                  "Asking for helpfulness is what leads a model to offer extra hours or a discount. The prompt needs the published hours as a fact and a limit on what the reply must not offer.",
              },
              {
                id: "c",
                text: "'Reply to this customer and apologise for any inconvenience, then explain our access policy.'",
                feedback:
                  "There is nothing to apologise for, and the model does not know the access policy unless you give it. The prompt should give the hours, set a limit, and ask for acknowledge, answer, and next step.",
              },
              {
                id: "d",
                text: "'Reply to this customer. Facts: units are open 7am to 7pm every day except Christmas Day. Do not offer any other hours or charges. Three sentences: acknowledge, answer, next step.'",
                correct: true,
                feedback:
                  "Yes. This prompt gives the checked facts, a limit on what the reply must not offer, and the three parts of the reply pattern, so the model has nothing to invent.",
              },
            ],
          },
          {
            id: "proposal",
            situation:
              "Grace Adebayo is preparing a quote for window cleaning at a client's three shops. The current price list gives £28 per shop per visit, monthly. The model's draft says '£28 per shop per visit, monthly, with a 24-hour call-out for emergencies.' The price list says nothing about call-outs.",
            question: "What should Grace do with the call-out line?",
            options: [
              {
                id: "a",
                text: "Remove it, because it is not from an approved source, and ask operations whether a call-out can be offered before adding anything.",
                correct: true,
                feedback:
                  "Yes. The call-out is not on the price list, so it has no approved source. Removing it and asking the people who would have to deliver it keeps every commitment in the quote traceable.",
              },
              {
                id: "b",
                text: "Keep it, because a 24-hour call-out makes the quote more attractive and most competitors offer one.",
                feedback:
                  "What competitors offer does not make it approved for Grace's organisation. If the client relies on a 24-hour call-out that operations cannot provide, the company is committed to it. Remove it until someone with authority agrees it.",
              },
              {
                id: "c",
                text: "Change it to a 48-hour call-out, which is less demanding and more likely to be achievable.",
                feedback:
                  "A 48-hour call-out is still a commitment with no approved source. Changing the figure does not make it agreed. Remove the line and check with operations.",
              },
            ],
          },
          {
            id: "complaint",
            situation:
              "Kieran Moss works in customer relations at Linwood Water. A customer complains that her bill doubled after a meter reading. Kieran has confirmed the reading was estimated, has requested an actual reading for Thursday, and knows the complaints procedure gives a full response within eight weeks. The model's draft includes the sentence 'We accept that our estimate was wrong and will credit your account £85.'",
            question: "How should Kieran change that sentence?",
            options: [
              {
                id: "a",
                text: "Keep the credit but remove 'we accept that our estimate was wrong', because the credit is what the customer wants.",
                feedback:
                  "The £85 credit is still a commitment Kieran has not been authorised to make, and the actual reading has not been taken. Replace the sentence with what has been done and what happens next.",
              },
              {
                id: "b",
                text: "Keep the sentence, because the estimate was clearly too high and admitting it will calm the customer.",
                feedback:
                  "Nobody yet knows whether the estimate was wrong, because the actual reading is on Thursday. Admitting fault and offering £85 are decisions for someone with authority, after the facts are known.",
              },
              {
                id: "c",
                text: "Replace it with a sentence saying the reading was estimated, an actual reading is booked for Thursday, and the bill will be reviewed once it is taken.",
                correct: true,
                feedback:
                  "Yes. This says what has been checked and what happens next, from facts, without admitting fault or offering a credit nobody has authorised. It follows the complaint pattern.",
              },
            ],
          },
          {
            id: "data",
            situation:
              "Hannah Price at Orchard Insurance has a model draft replying to a customer who asked when his policy documents will arrive. The draft says: 'Your documents were posted on 8 October. For security, your policy number is OR-771204, your date of birth is 19 June 1985, and your previous claim for water damage was settled in March.'",
            question: "Which question in the check before send does this draft fail most clearly?",
            options: [
              {
                id: "a",
                text: "Whether every fact is from a source she can name.",
                feedback:
                  "The facts may all be accurate and come from the policy system. The clearer problem is that most of the personal data is not needed in a reply about when documents will arrive.",
              },
              {
                id: "b",
                text: "Whether any personal data is correct and only what this customer needs.",
                correct: true,
                feedback:
                  "Yes. The date of birth and the previous claim are not needed in a reply about posting documents. Hannah holds the draft and removes them before it goes.",
              },
              {
                id: "c",
                text: "Whether any sentence commits the company beyond her authority.",
                feedback:
                  "No sentence here promises anything new. The problem is the personal data, which is more than this customer needs for a question about documents.",
              },
              {
                id: "d",
                text: "None, because the customer already knows his own details.",
                feedback:
                  "The customer knowing his own details does not make it right to repeat them in a message that could be forwarded or misdirected. The draft fails the question on personal data and should be held.",
              },
            ],
          },
          {
            id: "hold",
            situation:
              "Chloe Barnes is an adviser at Stanton Travel. A customer whose flight was cancelled asks for a refund of £420 on a package that the terms say is non-refundable after 30 days. The model's draft confirms the refund. Chloe's team leader, Mark Ellis, approves exceptions to the terms.",
            question: "What should Chloe do?",
            options: [
              {
                id: "a",
                text: "Hold the draft and pass the refund request to Mark Ellis with a note of the booking and the cancellation.",
                correct: true,
                feedback:
                  "Yes. A refund outside the terms is an exception that Chloe cannot authorise. Holding the draft and passing it to Mark, who can decide, is exactly what the check before send is for.",
              },
              {
                id: "b",
                text: "Send the draft, because the flight was cancelled and the customer will probably be refunded anyway.",
                feedback:
                  "Chloe does not know that Mark will agree, and sending the draft commits the company to £420 outside the terms. Hold it and pass it to the person who approves exceptions.",
              },
              {
                id: "c",
                text: "Change the draft to refuse the refund and send it, because the terms say the package is non-refundable.",
                feedback:
                  "A cancelled flight may be a reason for an exception, and that decision belongs to Mark. Refusing without asking him closes off a remedy he might approve. Hold the draft and pass it on.",
              },
            ],
          },
          {
            id: "paste",
            situation:
              "Ben Okoro manages a small physiotherapy practice and uses a general AI tool to draft replies to patients. A patient has emailed asking to rearrange an appointment and mentions, in the same email, details of her back condition and her card number for the cancellation fee.",
            question: "What should Ben paste into the AI tool to draft the reply?",
            options: [
              {
                id: "a",
                text: "The whole email, so the model has every detail it might need to write a personal reply.",
                feedback:
                  "The card number and the health details are not needed to rearrange an appointment, and pasting them into a general tool puts sensitive data somewhere it should not be. Paste only what the reply needs.",
              },
              {
                id: "b",
                text: "The whole email with the card number removed, because health details help the model write a sympathetic reply.",
                feedback:
                  "Removing the card number is right, but health information is sensitive and not needed to move an appointment. Paste only the request and the available times.",
              },
              {
                id: "c",
                text: "Nothing at all, because AI tools should never be used for patient messages.",
                feedback:
                  "The course does not ask you to stop using the tool. It asks you to decide what goes into it. The request to rearrange and the available times are enough to draft a good reply.",
              },
              {
                id: "d",
                text: "Only the request to rearrange and the available appointment times, leaving out the card number and the health details.",
                correct: true,
                feedback:
                  "Yes. The reply needs only the request and the times. Card numbers and health information should never go into the tool, and the reply is just as good without them.",
              },
            ],
          },
        ],
        why: "You applied the whole method: you separated safe sentences from commitments, used the reply, proposal, and complaint patterns, traced figures to approved sources, ran the check before send, and decided when to hold and what never to paste.",
      },
      bridge:
        "The final lesson asks you to turn the patterns and the check into a written rule for your own work, which becomes the note on your record.",
    },
    {
      id: "the-send-or-hold-note",
      title: "The send-or-hold note",
      emphasis: "note",
      place:
        "This is the last of seven lessons. You write the send-or-hold note for your own customer messages, and that note is the work your signed record shows.",
      sections: [
        {
          heading: "What the note is",
          paragraphs: [
            "The send-or-hold note is a short written rule for the customer messages you write with an AI tool. It says which kinds of message you handle, the approved sources you take facts and figures from, the commitments you are authorised to make on your own, the commitments that must be held and who authorises them, the four questions you ask before send, and what you never paste into the tool.",
            "It is written for your own work, but it should be clear enough for a colleague or a new starter to follow on their first day. A line is useful when A new starter could follow it: it names a real system, a real document, a real role, or a real kind of message. A line is Too vague to follow when it says something like 'the usual places' or 'anything big', because a new starter would have to ask what you meant.",
          ],
        },
        {
          heading: "What the note is not",
          paragraphs: [
            "The note is not the organisation's complaints policy or its terms and conditions, and it does not replace them. It points to them as sources. It is your working rule for how AI-assisted messages get from draft to customer safely, in your role, with your authority.",
            "It is also not a record of what you would like to be allowed to do. If you are not sure whether you may offer a credit or rebook a service at no charge, find out before you write it in the note. A note that claims authority you do not hold is worse than no note, because a new starter will follow it.",
          ],
        },
        {
          heading: "The two lines most people have never written",
          paragraphs: [
            "The lines that matter most are 'I may commit to' and 'I hold and pass'. Most advisers have a sense of what they can offer, but few have written it down, and the edges are usually unclear. Writing them makes you check, and it gives a new starter something firmer than 'use your judgement'.",
            "The 'I hold and pass' line should name who authorises each kind of commitment: a team leader, a manager, the complaints team, or the business owner. It should cover money, meaning refunds, credits, and goodwill payments; admissions of fault; and exceptions to policy. If one person authorises all of these in your organisation, say so and name the role.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to write the note in general terms that would fit any organisation. 'I check the facts and hold anything risky' is true of everyone and useful to no one. The note becomes useful when it names your order system, your price list, your team leader, and the kinds of message you actually send.",
            "The second mistake is to leave out what never goes into the tool. Card numbers, bank details, health information, and passwords are the obvious examples, and your organisation may have others. Writing them down makes the rule visible to anyone who picks up your work.",
          ],
        },
      ],
      workedExample: {
        title: "A note for a home energy adviser",
        inputLabel: "The adviser and her role",
        outputLabel: "The note she wrote",
        prompt:
          "Joanna Reid is a customer adviser at Brightwater Energy. She answers account queries, changes appointments, and handles first-stage complaints. Her team leader is Sam Patel.",
        output:
          "Messages I handle: account queries, appointment changes, and first-stage complaints. Approved sources: the account system, the published tariff sheet, and the complaints procedure. I may commit to: rebooking an appointment, sending a copy bill, and the timescales in the complaints procedure. I hold and pass to my team leader, Sam Patel: any credit, refund, or goodwill payment; any admission that we were at fault; any exception to a tariff. Before send I ask: is every fact from a source I can name; does any sentence commit us beyond what I may commit; is personal data correct and only what is needed; would I be content for this to be forwarded to my manager? I never paste: full card or bank details, medical information about vulnerable customers, or passwords.",
        reading: [
          "Every line names something real. The sources are systems and documents Joanna can open, and the approver is a named team leader.",
          "The 'I may commit to' line is short and specific, which makes the 'I hold and pass' line clear by contrast. A new starter could tell at once that a £20 goodwill credit needs Sam.",
          "The four questions are in her own words, and the 'I never paste' line names the data that matters in an energy company, including information about vulnerable customers.",
        ],
      },
      practice: {
        intro:
          "Here are four lines from a note an adviser has started. Use the two labels from this lesson to mark whether a new starter could follow each line. The definitions are in the first section above.",
        check: {
          kind: "mark",
          prompt: "Mark each line as A new starter could follow it or as Too vague to follow.",
          passLabel: FOLLOW,
          failLabel: VAGUE,
          sentences: [
            {
              id: "sources",
              text: "Approved sources: the usual places.",
              fail: true,
              why: "'The usual places' names no system or document, so a new starter would have to ask where the facts come from.",
            },
            {
              id: "commit",
              text: "I may commit to: rebooking a delivery at no charge and the timescales in the returns policy.",
              fail: false,
              why: "This line names two specific commitments and the document they come from, so a new starter could follow it.",
            },
            {
              id: "hold",
              text: "I hold and pass: anything big, to whoever is around.",
              fail: true,
              why: "'Anything big' does not say which commitments, and 'whoever is around' names no approver, so this line is too vague to follow.",
            },
            {
              id: "never",
              text: "I never paste: full card numbers, bank details, or health information.",
              fail: false,
              why: "This line names specific kinds of data, so a new starter could follow it.",
            },
          ],
          why: "That is right. The lines on commitments and on what never to paste name real things, and the lines on sources and holding would leave a new starter asking what you meant.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write your send-or-hold note for the customer messages you write with an AI tool. Fill in every part so that a new starter in your role could follow it.",
        fields: [
          {
            id: "handle",
            label: "Messages I handle",
            hint: "The kinds of customer message you write, such as order queries, quotes, or first-stage complaints.",
            min: 20,
            any: ["repl", "complaint", "quote", "proposal", "enquir", "quer", "update", "message", "email", "letter", "booking", "appointment", "order"],
            missing:
              "Messages I handle does not yet name the kinds of message you write. Name them, for example order queries, quotes, or first-stage complaints.",
          },
          {
            id: "sources",
            label: "Approved sources",
            hint: "Where your facts and figures come from, by name: the systems and documents you can open.",
            min: 20,
            any: ["system", "list", "policy", "procedure", "rate card", "terms", "tariff", "sheet", "record", "crm", "diary", "database", "schedule", "handbook", "contract"],
            missing:
              "Approved sources does not yet name a document or system. Name the sources, such as the order system or the current price list.",
          },
          {
            id: "commit",
            label: "I may commit to",
            hint: "The commitments you are authorised to make on your own, even if it is only a timescale from a published procedure.",
            min: 16,
            any: ["rebook", "timescale", "copy", "confirm", "appointment", "replace", "within", "procedure", "policy", "resend", "book", "deliver", "exchange", "return", "no charge", "up to"],
            missing:
              "I may commit to does not yet name something you may commit to. Name at least one thing you may commit to on your own, even if it is only a timescale from a published procedure.",
          },
          {
            id: "hold",
            label: "I hold and pass",
            hint: "The commitments you must not make alone, such as refunds, credits, admissions of fault, and exceptions, and who authorises them.",
            min: 30,
            any: ["team leader", "manager", "supervisor", "director", "head of", "complaints team", "owner", "partner", "lead"],
            missing:
              "I hold and pass does not yet say who authorises the commitments you hold. Name the role, such as your team leader or the complaints team, and say which refunds, credits, admissions of fault, or exceptions go to them.",
          },
          {
            id: "before",
            label: "Before send",
            hint: "The four questions, in your own words, including whether any sentence commits the company beyond your authority.",
            min: 60,
            any: ["commit", "promise", "authoris"],
            missing:
              "Before send does not yet include the question about commitments. Include all four questions, including whether any sentence commits the company beyond your authority.",
          },
          {
            id: "never",
            label: "I never paste",
            hint: "Start with 'Never' or 'Do not', and name the information that never goes into the tool.",
            min: 16,
            rule: "limit",
            any: ["card", "bank", "health", "medical", "password", "date of birth", "account number", "national insurance", "passport", "address", "personal", "sort code"],
            missing:
              "I never paste does not yet set a clear limit. Start with 'Never' or 'Do not' and name the information you never paste, such as full card details or health information.",
          },
        ],
        why: "Your note sets out the messages you handle, your sources, what you may commit to, what you hold and who authorises it, the check before send, and what you never paste. This is the note that will appear on your record.",
      },
      bridge:
        "Your note is ready. Sign your name below, and the record will show this note, the course, and the date to anyone who opens the reference.",
    },
  ],
};
