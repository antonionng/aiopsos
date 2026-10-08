import type { SelfServeLesson } from "./types.ts";

const SAFE = "Safe to send";
const PROMISE = "Adds a promise that was not in the prompt";

export const PROMPT_ENGINEERING_LESSONS: SelfServeLesson[] = [
  {
    id: "what-a-prompt-is",
    title: "What a prompt is",
    emphasis: "prompt",
    place:
      "This is the first of seven lessons. Before you can write a good prompt, you need a clear picture of what a prompt is and of what the model does with it.",
    sections: [
      {
        heading: "The prompt is everything the model knows",
        paragraphs: [
          "A prompt is the instruction and the evidence you give a language model before it writes. The instruction tells it what to produce, such as a reply, a summary, or a plan. The evidence is the material it should work from, such as the client's email, the price you agreed, or the date the work is due.",
          "For this task, the prompt is the only information the model has. It has not read your inbox, it was not on your call last Tuesday, and it cannot see the contract on your desk. It knows a great deal about how emails, reports, and letters are usually written, but it knows nothing about this client, this price, or this deadline unless you put them in the prompt.",
        ],
      },
      {
        heading: "What a prompt is not",
        paragraphs: [
          "A prompt is not a search. A search engine looks for pages that already exist, whereas a model writes new text that fits the pattern of your words. When you ask it about your own client, there is nothing for it to look up, so it writes what a reply of that kind usually says.",
          "A prompt is also not a quick word to a colleague who shares your context. If you ask a colleague to sort out the reply to Sam, they already know who Sam is, what went wrong, and what the company can offer. The model does not. Anything your colleague would have known without being told, the model has to be told.",
        ],
      },
      {
        heading: "Why this matters at work",
        paragraphs: [
          "Because the model writes fluently, text that it has guessed looks exactly like text that it was given. A reply can be polite, well organised, and wrong about the one fact that matters. The way to control what the model says about your work is to control what the prompt contains.",
          "Throughout this course, you will read a reply by asking one question of each sentence: did this come from the prompt? If it did not, the model supplied it, and someone has to check it before it goes out.",
        ],
      },
    ],
    workedExample: {
      title: "A prompt that leaves the facts out",
      prompt: "Reply to Sam at Northwind about the invoice.",
      output:
        "Dear Sam, thank you for getting in touch about invoice 4471. I can confirm that it was paid in full on 3 March. Please let me know if there is anything else I can help with.",
      reading: [
        "The prompt gave the model a name, a company, and a topic. It did not give an invoice number, a payment date, or whether the invoice had been paid at all.",
        "The model still wrote a complete reply. The invoice number and the payment date do not come from the prompt, because the prompt contained neither. The model produced them because replies about invoices usually contain them.",
        "The first and last sentences are courtesy, and they could stand. The middle sentence states a fact about money that nobody gave the model, and if it is wrong, Sam will act on it.",
      ],
    },
    practice: {
      intro:
        "Here is a short prompt and the reply it produced. For each sentence, decide whether its information came from the prompt. The worked example above is still there if you want to compare.",
      check: {
        kind: "mark",
        prompt: "Mark each sentence of the reply to show whether its information came from the prompt.",
        material: {
          label: "The prompt",
          text: "Write to Jo Patel to say that the team meeting has moved to Thursday.",
        },
        passLabel: "Came from the prompt",
        failLabel: "The prompt did not say this",
        sentences: [
          {
            id: "moved",
            text: "Hello Jo, the team meeting has moved to Thursday.",
            fail: false,
            why: "The name and the new day are both in the prompt, so this sentence came from it.",
          },
          {
            id: "room",
            text: "It will start at 2pm in the Oak Room.",
            fail: true,
            why: "The prompt gave no time and no room, so the model supplied 2pm and the Oak Room.",
          },
        ],
        why: "That is right. The first sentence repeats what the prompt said, and the second adds a time and a room that the prompt never gave.",
      },
    },
    check: {
      kind: "mark",
      prompt:
        "The prompt below produced a four-sentence reply. Mark each sentence to show whether its information came from the prompt.",
      material: {
        label: "The prompt",
        text: "Write to Tom Reid to confirm his interview for the analyst role on Thursday 9 October at 10:00.",
      },
      passLabel: "Came from the prompt",
      failLabel: "The prompt did not say this",
      sentences: [
        {
          id: "interest",
          text: "Dear Tom, thank you for your interest in the analyst role.",
          fail: false,
          why: "The name and the role both come from the prompt, and thanking him adds no new information.",
        },
        {
          id: "confirm",
          text: "I am pleased to confirm your interview on Thursday 9 October at 10:00.",
          fail: false,
          why: "The day, the date, and the time are all in the prompt, so this sentence repeats what you gave the model.",
        },
        {
          id: "panel",
          text: "The interview will take place at our Leeds office with Priya Shah and one other panel member.",
          fail: true,
          why: "The prompt did not mention a place or who would interview him. The model supplied Leeds, Priya Shah, and the panel.",
        },
        {
          id: "passport",
          text: "Please bring your passport so that we can confirm your right to work.",
          fail: true,
          why: "The prompt said nothing about documents. The model added a request because interview letters often contain one.",
        },
      ],
      why: "That is the right reading. The first two sentences repeat what the prompt said, and the last two add a place, a panel, and a request that the prompt never mentioned, so someone would have to check them before the email went out.",
    },
    bridge:
      "In the next lesson you will see what the model does when the prompt is silent on the one thing that matters, and you will learn the two labels this course uses to judge each sentence.",
  },
  {
    id: "when-the-prompt-is-silent",
    title: "When the prompt is silent",
    emphasis: "silent",
    place:
      "In the first lesson you saw that the prompt is the only information the model has. This lesson looks closely at what the model does when that information is missing, and it gives you the two labels you will use for the rest of the course.",
    sections: [
      {
        heading: "The model still writes",
        paragraphs: [
          "When a prompt is silent on a point, the model does not stop and ask. It is built to continue the text, so it fills the gap with whatever usually comes next in writing of that kind. If replies to clients often mention a next step, a date, or a gesture of goodwill, the model will tend to write one.",
          "The result sounds finished. It has the rhythm of a real reply, the right level of politeness, and the confidence of someone who knows the account. That confidence is a feature of the writing, and it is not evidence that the content is true.",
        ],
      },
      {
        heading: "The polite reply",
        paragraphs: [
          "Consider a client who has emailed to ask how the pilot is going, where you type only that the model should write a polite reply. You have given it an instruction and a tone, but you have given it no facts about the pilot, the price, or anything that has been agreed.",
          "The model will still produce a full reply. Some of it will be harmless, because a thank-you or a friendly closing line commits nobody to anything. Some of it may not be harmless, because a sentence about an extension or a discount reads as an offer from your company, and the client is entitled to hold you to it.",
        ],
      },
      {
        heading: "Two labels for every sentence",
        paragraphs: [
          "From now on, you will judge each sentence of a reply with one of two labels. The first label is Safe to send. A sentence is safe to send when it only thanks them, only greets or closes politely, or only repeats a fact that the prompt gave the model. Nothing in it needs checking, because it either says nothing new or says only what you supplied.",
          "The second label is Adds a promise that was not in the prompt. A sentence carries this label when it commits you or your company to something the prompt never mentioned, such as a date, a price, a discount, a refund, or an action. It also carries this label when it claims that something was agreed or discussed and the prompt said no such thing. That sentence must not go out until someone with the authority to make the promise has checked it.",
          "The difference is not about tone. A warm sentence can be safe to send, and a dry, businesslike sentence can add a promise. The test is always whether the sentence commits you to something that did not come from the prompt.",
        ],
      },
    ],
    workedExample: {
      title: "Write a polite reply",
      prompt:
        "Write a polite reply to this email. 'Hi, could you give me an update on the pilot? Thanks, Dana.'",
      output:
        "Thank you for your note, Dana. We can extend the pilot by two weeks at no extra cost. As discussed, we will also apply a 15% discount to the outstanding invoice.",
      reading: [
        "The first sentence only thanks her. It adds no fact and no commitment, so it is safe to send.",
        "The second sentence adds a promise that was not in the prompt. Nobody told the model that an extension was possible, how long it would be, or that it would be free. The model wrote it because replies about pilots often offer more time.",
        "The third sentence also adds a promise that was not in the prompt, and it is the more dangerous of the two. The words 'as discussed' claim an earlier agreement that the prompt never mentioned, and the discount is a price commitment that the client can now quote back to you. A thank-you can stand, but a discount cannot.",
      ],
    },
    practice: {
      intro:
        "Here is another prompt that was silent on the facts. Use the two labels you have just learned to mark each sentence. The definitions are in the section above if you want to read them again.",
      check: {
        kind: "mark",
        prompt: "Mark each sentence as Safe to send or as Adds a promise that was not in the prompt.",
        material: {
          label: "The prompt",
          text: "Write a polite reply to Leo, who asked whether his laptop repair is finished.",
        },
        passLabel: SAFE,
        failLabel: PROMISE,
        sentences: [
          {
            id: "checking",
            text: "Thank you for checking in, Leo.",
            fail: false,
            why: "This sentence only thanks him, so it is safe to send.",
          },
          {
            id: "battery",
            text: "Your laptop is ready and we have replaced the battery free of charge.",
            fail: true,
            why: "The prompt did not say that the repair was finished or that anything was free, so this sentence adds a promise that was not in the prompt.",
          },
        ],
        why: "That is right. The thank-you is safe to send, and the second sentence commits the shop to a finished repair and a free battery that nobody mentioned.",
      },
    },
    check: {
      kind: "choose",
      prompt:
        "The prompt said only: 'Write a polite reply to Ana, who asked whether her order will arrive before the weekend.' Choose the reply you could send without checking with anyone first.",
      leftLabel: "Reply A",
      left: "Thank you for your message, Ana. Your order will arrive on Friday, and we have upgraded you to free next-day delivery.",
      rightLabel: "Reply B",
      right:
        "Thank you for your message, Ana. I am sorry that you have had to chase this, and I appreciate your patience.",
      correct: "right",
      why: "Reply B is safe to send, because it only thanks her and apologises for the wait. Reply A adds two promises that were not in the prompt, a Friday delivery and a free upgrade, and Ana could hold the company to both.",
      wrong:
        "Look again at Reply A. The prompt gave no delivery date and said nothing about an upgrade, so Friday and free next-day delivery are promises that were not in the prompt. Reply B only thanks her and apologises, which is safe to send.",
    },
    bridge:
      "Reply B is safe, but it does not answer Ana's question, because the prompt did not contain the answer. The next lesson shows you the four parts a prompt needs so that a reply can be both safe and useful.",
  },
  {
    id: "parts-of-a-prompt",
    title: "The parts of a prompt",
    emphasis: "parts",
    place:
      "You now know that the model fills every silence in the prompt. This lesson names the four things a prompt should never be silent on, and it shows each one before and after it is added.",
    sections: [
      {
        heading: "Four parts, each with a job",
        paragraphs: [
          "A prompt that a colleague could run without asking you what you meant usually has four parts. The first is who is speaking. The second is the facts that are true. The third is what the reply must not add or promise. The fourth is the shape of the answer. Each part closes one kind of gap that the model would otherwise fill for itself.",
          "These parts are not a formula to recite, and they do not need headings in the prompt itself. They are a way of reading your own prompt before you run it. If you can point to the sentence that does each job, the prompt is ready. If you cannot, the model will do that job for you, and it will do it by guessing.",
        ],
      },
      {
        heading: "Who is speaking",
        paragraphs: [
          "The first part tells the model whose voice the reply is in and what that person is responsible for. An account manager, a finance officer, and a recruiter would each answer the same email differently, because each can promise different things. When the prompt does not say who is speaking, the model writes in a general voice that may claim authority you do not have.",
        ],
        beforeAfter: {
          before: "Reply to the client about the pilot.",
          after:
            "You are the account manager for Corvid Ltd. You can give updates on the pilot, but you cannot agree changes to its price or length. Reply to the client about the pilot.",
          reading:
            "The second version tells the model who it is writing as, and it also says what that person may not agree, which removes the reason to offer an extension.",
        },
      },
      {
        heading: "The facts that are true",
        paragraphs: [
          "The second part is the evidence. It contains the facts the reply needs, stated plainly: names, dates, amounts, what has happened, and, just as importantly, what has not happened. A fact such as 'no discount has been discussed' is as useful as a fact such as 'the pilot ends on Friday', because it closes a gap the model would otherwise fill.",
        ],
        beforeAfter: {
          before: "Give Dana an update on the pilot.",
          after:
            "Give Dana an update on the pilot. The facts are these: the pilot ends on Friday 17 October, 42 of the 50 licences are in use, and no extension or discount has been discussed.",
          reading:
            "The second version gives the model a date, a number, and two things that have not happened. The model can now write a real update rather than an invented one.",
        },
      },
      {
        heading: "What it must not add or promise",
        paragraphs: [
          "The third part sets a limit. It tells the model what it must not add, promise, or claim, even when a reply of this kind would usually contain it. Write it as a plain instruction that begins with words such as do not, must not, never, or only, and name the things that matter in your work, such as prices, discounts, refunds, dates, deadlines, and earlier agreements.",
        ],
        beforeAfter: {
          before: "Reply warmly and reassure her that we value the relationship.",
          after:
            "Reply warmly. Do not offer a discount, an extension, or a new date, and do not say that anything was agreed unless it is in the facts above.",
          reading:
            "The first version asks for reassurance, which is exactly the pressure that produces a goodwill discount. The second version keeps the warmth and removes the room to invent a promise.",
        },
      },
      {
        heading: "The shape of the answer",
        paragraphs: [
          "The fourth part describes what should come back: how long it is, what form it takes, and what it must contain. Without it, the model chooses a shape for you, and you may receive a formal letter when you needed three lines for a chat message, or a list of bullet points when you needed a paragraph for an email.",
        ],
        beforeAfter: {
          before: "Write a reply.",
          after:
            "Write a reply of four short sentences with no subject line. Thank her, give the status, say what we need from her, and give the next step.",
          reading:
            "The second version tells the model the length, the form, and the order of the content, so the reply arrives ready to use.",
        },
      },
    ],
    workedExample: {
      title: "One prompt with all four parts",
      prompt:
        "You are the account manager for Corvid Ltd. You can give updates on the pilot, but you cannot agree changes to its price or length. The facts are these: the pilot ends on Friday 17 October, 42 of the 50 licences are in use, and no extension or discount has been discussed. Do not offer a discount, an extension, or a new date, and do not say that anything was agreed. Write four short sentences to Dana: thank her, give the status, ask whether she would like a review call, and say that you will send the usage report on Friday.",
      output:
        "Thank you for asking, Dana. The pilot runs until Friday 17 October, and 42 of your 50 licences are now in use. Would you like a short review call before it ends? I will send you the usage report on Friday.",
      reading: [
        "Every fact in the reply came from the prompt: the end date, the number of licences, the offer of a review call, and the report on Friday.",
        "There is no extension and no discount, because the prompt said who was speaking, what that person could not agree, and what the reply must not offer.",
        "The reply is four sentences in the order the prompt asked for, so it can be sent as it stands after one careful read.",
      ],
    },
    practice: {
      intro:
        "Read the prompt below and decide, for each of the four parts, whether the prompt gives it. The sections above describe each part if you need them.",
      check: {
        kind: "mark",
        prompt: "For each of the four parts, mark whether this prompt gives it or leaves it out.",
        material: {
          label: "The prompt",
          text: "You are the office manager at Hale and Partners. The kitchen will be closed on Monday 20 October for repairs. Write a note to all staff in three sentences.",
        },
        passLabel: "The prompt gives this",
        failLabel: "The prompt leaves this out",
        sentences: [
          {
            id: "who",
            text: "Who is speaking",
            fail: false,
            why: "The prompt says that the office manager at Hale and Partners is writing, so it gives who is speaking.",
          },
          {
            id: "facts",
            text: "The facts that are true",
            fail: false,
            why: "The closure on Monday 20 October for repairs is a true fact that the prompt gives.",
          },
          {
            id: "limit",
            text: "What it must not add or promise",
            fail: true,
            why: "Nothing tells the model what it must not add, so it could invent a reopening date or a free lunch.",
          },
          {
            id: "shape",
            text: "The shape of the answer",
            fail: false,
            why: "A note to all staff in three sentences gives the model a form and a length, so the shape is there.",
          },
        ],
        why: "That is right. The prompt names who is speaking, gives a true fact, and sets the shape, but it never says what the note must not add or promise, so the model could invent a reopening date.",
      },
    },
    check: {
      kind: "choose",
      prompt:
        "Both prompts below are for the same task, which is telling café customers that a delivery will be late. Choose the prompt a colleague could run without the model having to guess.",
      leftLabel: "Prompt A",
      left: "You are the operations lead at Harper Foods. Our supplier has let us down and the flour delivery will now arrive on Wednesday 15 October instead of Sunday 12 October. Please write to our café customers about this in a warm, reassuring, and professional way, and make sure they feel properly looked after and valued.",
      rightLabel: "Prompt B",
      right:
        "You are the operations lead at Harper Foods. The facts are these: the flour delivery will arrive on Wednesday 15 October instead of Sunday 12 October, and customers can email orders@harperfoods.co.uk with questions. Do not offer a refund, a discount, or any date that is not in these facts. Write three short sentences: what has changed, the new date, and where to send questions.",
      correct: "right",
      why: "Prompt B has all four parts. It says who is speaking, gives the true dates and the contact address, sets a limit on refunds, discounts, and dates, and asks for three sentences. Prompt A is longer, but it has no limit and no shape, and asking the model to make customers feel looked after invites it to offer a discount.",
      wrong:
        "Look again at Prompt A. It says who is speaking and gives the dates, but it never says what the reply must not add or promise, and it does not describe the shape of the answer. Asking the model to make customers feel looked after is the kind of silence it fills with a refund or a discount.",
    },
    bridge:
      "You can now say what a prompt should contain. In the next lesson you will read a full reply sentence by sentence and use the two labels from the second lesson to find the sentences that went too far.",
  },
  {
    id: "read-a-reply",
    title: "Read a reply",
    emphasis: "reply",
    place:
      "The first three lessons were about what goes into a prompt. This lesson is about what comes out, and it asks you to read a reply the way a careful manager would before it is sent.",
    sections: [
      {
        heading: "Read one sentence at a time",
        paragraphs: [
          "A reply that reads well as a whole can still contain one sentence that should never be sent. The habit this lesson builds is to stop reading for the overall impression and to read one sentence at a time, with the prompt beside you. For each sentence, you ask whether it is safe to send or whether it adds a promise that was not in the prompt.",
          "Remember what the two labels mean. A sentence is safe to send when it only thanks them, only greets or closes politely, or only repeats a fact the prompt gave. A sentence adds a promise that was not in the prompt when it commits you to a date, a price, a discount, a refund, or an action that the prompt never mentioned, or when it claims that something was agreed.",
        ],
      },
      {
        heading: "Where promises hide",
        paragraphs: [
          "Promises tend to hide in a few places. Numbers and dates are the most obvious, so look closely at any amount, percentage, day, or deadline and find it in the prompt. If you cannot find it there, the model supplied it.",
          "Some phrases are signals in their own right. Phrases such as 'as discussed', 'as agreed', and 'as you know' claim a history that the model cannot know. Words such as 'we will', 'we can', 'free', 'guaranteed', and 'no extra cost' usually introduce a commitment. None of these words is wrong in itself, but each one tells you to check the sentence against the prompt.",
          "A sentence can also be safe when it contains a date or a number, provided that the prompt gave it. Repeating a true fact is the reason you wrote the prompt in the first place. The question is never whether a sentence contains detail, but whether that detail came from you.",
        ],
      },
    ],
    workedExample: {
      title: "Reading a reply against its prompt",
      prompt:
        "You are the customer service lead at Fenwick Bikes. The facts are these: Mr Adeyemi's bike was serviced on Tuesday, and it is ready to collect from our Bristol shop. Write three sentences telling him it is ready.",
      output:
        "Thank you for choosing Fenwick Bikes, Mr Adeyemi. Your bike was serviced on Tuesday and is ready to collect from our Bristol shop. As a thank-you for waiting, the service is free this time.",
      reading: [
        "The first sentence only thanks him, so it is safe to send.",
        "The second sentence repeats two facts that the prompt gave, the service on Tuesday and the Bristol shop. It contains detail, but all of that detail came from the prompt, so it is safe to send.",
        "The third sentence adds a promise that was not in the prompt. Nobody said the service would be free, and the prompt set no limit that would have stopped the model from offering it. That is the sentence you would remove before sending, and the gap you will learn to close in the next lesson.",
      ],
    },
    practice: {
      intro:
        "Read this short reply with its prompt beside it and mark each sentence. The list of places where promises hide is above if you want to use it.",
      check: {
        kind: "mark",
        prompt: "Mark each sentence as Safe to send or as Adds a promise that was not in the prompt.",
        material: {
          label: "The prompt",
          text: "You are the HR adviser. Tell Mia that her request for flexible working has been received and will be reviewed by her line manager.",
        },
        passLabel: SAFE,
        failLabel: PROMISE,
        sentences: [
          {
            id: "thanks",
            text: "Thank you for sending your request, Mia.",
            fail: false,
            why: "This sentence only thanks her, so it is safe to send.",
          },
          {
            id: "received",
            text: "Your request has been received and will be reviewed by your line manager.",
            fail: false,
            why: "Both facts are in the prompt, so this sentence is safe to send.",
          },
          {
            id: "decision",
            text: "You will have a decision by the end of next week.",
            fail: true,
            why: "The prompt gave no date for a decision, so the end of next week is a promise that was not in the prompt.",
          },
        ],
        why: "That is right. The first two sentences thank her and repeat what the prompt said, and the third commits HR to a deadline that nobody gave.",
      },
    },
    check: {
      kind: "mark",
      prompt:
        "Read the reply below against its prompt, and mark every sentence as Safe to send or as Adds a promise that was not in the prompt.",
      material: {
        label: "The prompt",
        text: "You are the account manager at Brightline. The facts are these: Mr Okafor's contract renews on 1 December, and his current price is £1,200 a year. Write a short reply to his question about whether the renewal price will change.",
      },
      passLabel: SAFE,
      failLabel: PROMISE,
      sentences: [
        {
          id: "thanks",
          text: "Thank you for getting in touch, Mr Okafor.",
          fail: false,
          why: "This sentence only thanks him, so it is safe to send.",
        },
        {
          id: "renews",
          text: "Your contract renews on 1 December, and your current price is £1,200 a year.",
          fail: false,
          why: "The renewal date and the price both come from the prompt, so this sentence is safe to send even though it contains numbers.",
        },
        {
          id: "same",
          text: "I can confirm that the price will stay the same for next year.",
          fail: true,
          why: "The prompt did not say whether the price would change, so confirming that it will stay the same is a promise that was not in the prompt.",
        },
        {
          id: "month",
          text: "As agreed on our last call, we will also add a free month if you renew by 30 November.",
          fail: true,
          why: "Nothing in the prompt mentions a call, a free month, or a deadline of 30 November, and the words 'as agreed' claim a history the model could not know.",
        },
        {
          id: "close",
          text: "Please let me know if you have any other questions.",
          fail: false,
          why: "This sentence only closes the reply politely, so it is safe to send.",
        },
      ],
      why: "That is a careful reading. The thanks, the repeated facts, and the closing line are safe to send, and the two middle sentences add a price promise, a free month, and a deadline that were not in the prompt.",
    },
    bridge:
      "You have found the two sentences that went too far. In the next lesson you will go back to Mr Okafor's prompt and add the limit that stops them from being written.",
  },
  {
    id: "repair-the-prompt",
    title: "Repair the prompt",
    emphasis: "Repair",
    place:
      "In the last lesson you found the sentences in Mr Okafor's reply that added promises. This lesson teaches you to repair the prompt that produced them, rather than repairing the reply by hand or starting again.",
    sections: [
      {
        heading: "Repair the prompt, not only the reply",
        paragraphs: [
          "When a reply adds a promise, it is tempting to delete the sentence and send the rest. That fixes this one reply, but the prompt is unchanged, so the next reply it produces may make the same promise again, and a colleague who reuses your prompt will meet the same problem without knowing it is there.",
          "It is also tempting to throw the prompt away and write a new one from nothing. That discards the parts that were already working, such as who is speaking and the facts that were true, and it gives you no reason to believe that the new prompt is any safer. The better move is to repair the same prompt.",
        ],
      },
      {
        heading: "Four steps in a repair",
        paragraphs: [
          "A repair has four steps. First, read the sentence that went too far and say exactly what it added, such as a price, a discount, or a date. Second, name the limit that was missing, which is usually a sentence that begins with do not and names the thing that was added.",
          "Third, add that limit to the same prompt, close to the facts it protects, and leave the rest of the prompt as it was. Fourth, run the prompt again and read the new reply sentence by sentence, exactly as you did in the last lesson, to confirm that the promise has gone and that nothing new has taken its place.",
          "A good limit is specific. Asking the model to be careful about money does not tell it what to leave out, whereas 'Do not offer a discount, a refund, or a free month' names the things it must not write. Where the risk is a date, say so directly, for example by writing 'Do not give any date or deadline that is not in the facts above.'",
        ],
      },
    ],
    workedExample: {
      title: "Repairing the Fenwick Bikes prompt",
      prompt:
        "You are the customer service lead at Fenwick Bikes. The facts are these: Mr Adeyemi's bike was serviced on Tuesday, and it is ready to collect from our Bristol shop. Do not say that the service is free, and do not offer any discount or refund. Write three sentences telling him it is ready.",
      output:
        "Thank you for choosing Fenwick Bikes, Mr Adeyemi. Your bike was serviced on Tuesday and is ready to collect from our Bristol shop. We look forward to seeing you.",
      reading: [
        "The sentence that went too far in the last lesson said the service was free. The missing limit was a rule about money, so the repair adds one sentence telling the model not to say the service is free and not to offer any discount or refund.",
        "Everything else in the prompt stayed as it was. Who is speaking, the facts, and the shape of three sentences were already doing their jobs.",
        "Every sentence in the new reply is safe to send. The third sentence now only closes politely, because the model no longer has room to offer a gesture of goodwill.",
      ],
    },
    practice: {
      intro:
        "Before you repair a prompt yourself, choose between two limits for Mia's reply from the last lesson, which promised a decision by the end of next week. The paragraph above on what makes a good limit will help.",
      check: {
        kind: "choose",
        prompt: "Choose the line you would add to Mia's prompt to stop the reply promising a decision by the end of next week.",
        leftLabel: "Line A",
        left: "Please be accurate and professional about timings.",
        rightLabel: "Line B",
        right: "Do not give a date or a deadline for the decision, because none has been set.",
        correct: "right",
        why: "Line B names the thing the model must not add, which is a date or a deadline, and it gives the reason. Line A asks for accuracy but does not say what to leave out, so the model could still invent a deadline.",
        wrong:
          "Look again at Line A. Asking for accuracy does not tell the model that it must not give a date, so it could still promise a decision by the end of next week. Line B names the limit directly.",
      },
    },
    check: {
      kind: "edit",
      prompt:
        "Mr Okafor's reply confirmed that his price would stay the same and offered a free month if he renewed by 30 November. Edit his prompt below so that the model cannot make those promises again. Keep who is speaking and the facts, and add the limit that was missing.",
      material: {
        label: "The sentences that went too far",
        text: "I can confirm that the price will stay the same for next year. As agreed on our last call, we will also add a free month if you renew by 30 November.",
      },
      start:
        "You are the account manager at Brightline. The facts are these: Mr Okafor's contract renews on 1 December, and his current price is £1,200 a year. Write a short reply to his question about whether the renewal price will change.",
      keep: [
        {
          id: "role",
          any: ["account manager"],
          missing:
            "Keep who is speaking. The prompt should still say that the reply comes from the account manager at Brightline.",
        },
        {
          id: "facts",
          any: ["1 december", "1,200", "1200"],
          missing:
            "Keep the facts that are true. The prompt should still give the renewal date of 1 December and the current price of £1,200 a year.",
        },
      ],
      limits: [
        {
          id: "money",
          any: ["price", "discount", "free", "refund", "cost", "fee", "offer", "£", "saving", "money", "charge"],
          missing:
            "Your limit does not yet cover money. Add a sentence such as 'Do not promise a price for next year, a discount, or a free month', because the reply confirmed a price and offered a free month that nobody had agreed.",
        },
        {
          id: "date",
          any: ["date", "deadline", "day", "week", "november", "december", "renew by", "timescale", "time limit"],
          missing:
            "Your limit does not yet cover dates. Add a sentence such as 'Do not give any date or deadline that is not in the facts above', because the reply invented a deadline of 30 November.",
        },
      ],
      why: "That repair works. Your prompt still says who is speaking and what is true, and it now tells the model that it must not promise a price or a free month and must not give a date or deadline of its own, so the two sentences you marked in the last lesson have nothing to stand on.",
      result: {
        label: "The reply your repaired prompt produces",
        text: "Thank you for getting in touch, Mr Okafor. Your contract renews on 1 December, and your current price is £1,200 a year. I am not able to confirm the price for next year in this message. Please let me know if you have any other questions.",
      },
    },
    bridge:
      "You can now read a reply and repair the prompt behind it. In the next lesson you will use every move in the course on situations you have not seen, and in the final lesson you will write a prompt of your own for a real task, which becomes the card on your record.",
  },
  {
    id: "course-assessment",
    title: "Course assessment",
    emphasis: "assessment",
    place:
      "This is the sixth of seven lessons. It brings together the method from the first five lessons, works one mixed example, and then assesses the whole method on situations you have not seen, before the final lesson asks you to write your own prompt card.",
    sections: [
      {
        heading: "What a prompt is, and what the model does with silence",
        paragraphs: [
          "A prompt is the instruction and the evidence you give a language model before it writes. For the task in front of it, the prompt is the only information the model has. It has not read your inbox, it did not hear the call, and it cannot see the contract. It knows how replies, notes, and summaries are usually written, but it knows nothing about your client, your price, or your deadline unless the prompt says so.",
          "When the prompt is silent on a point, the model does not stop and ask. It fills the gap with whatever usually comes next in writing of that kind, and the result reads as confidently as the facts you did give it. A date, a discount, or a claim that something was agreed can appear in a reply without anyone asking for it, and the person who receives that reply is entitled to act on it.",
        ],
      },
      {
        heading: "The four parts of a prompt",
        paragraphs: [
          "A prompt that a colleague could run without asking you what you meant has four parts. Who is speaking tells the model whose voice the reply is in and what that person can and cannot agree. The facts that are true give it the names, dates, and amounts, and also the things that have not happened. What it must not add or promise sets a limit in a plain sentence that begins with do not, must not, never, or only. The shape of the answer says how long the reply is and what form it takes.",
          "Each part closes one kind of gap. The facts close the gap that the model would otherwise fill with a guess, and the limit closes the gap that it would otherwise fill with a gesture of goodwill. A long prompt can still be missing a part, so the test is whether you can point to the sentence that does each job, and not whether the prompt feels thorough. A request for a warm or reassuring tone is not a limit, and it often creates the pressure that produces a promise.",
        ],
      },
      {
        heading: "Reading a reply and repairing the prompt",
        paragraphs: [
          "Read a reply one sentence at a time with the prompt beside you, and give each sentence one of the two labels. A sentence is Safe to send when it only thanks, greets, closes politely, or repeats a fact that the prompt gave. A sentence Adds a promise that was not in the prompt when it commits you to a date, a price, a discount, a refund, or an action that the prompt never mentioned, or when it claims an earlier agreement with words such as 'as agreed'.",
          "When you find a sentence that went too far, repair the prompt rather than only the reply. Say exactly what the sentence added, name the limit that was missing, add that limit to the same prompt close to the facts it protects, and run it again. Read the new reply as carefully as the first, because a repair is finished only when the promise has gone and nothing new has taken its place.",
          "The assessment at the end of this lesson sets seven situations you have not seen, in HR, finance, customer service, operations, sales, procurement, and internal communications. Each question has one right answer, and each draws on one or more of the moves above. You need six of the seven to pass, and after you submit, each question shows the feedback for the option you chose.",
        ],
      },
    ],
    workedExample: {
      title: "One prompt, read and repaired",
      prompt:
        "You are the payroll officer at Ashby Clinics. The facts are these: Kerry Lowe worked 11 hours of overtime in September, and it will be paid in the October payroll on 28 October. Write three short sentences to Kerry confirming this.",
      output:
        "Thank you for your message, Kerry. Your 11 hours of September overtime will be paid in the October payroll on 28 October. We have also applied the bank holiday rate, so you will receive time and a half.",
      reading: [
        "The prompt says who is speaking, gives the facts, and sets the shape, but it has no limit. Nothing tells the model what it must not add about pay, so the gap is still open.",
        "The first sentence only thanks Kerry, and the second repeats the hours and the date that the prompt gave, so both are safe to send.",
        "The third sentence adds a promise that was not in the prompt. Nobody gave the model a rate of pay, and Kerry could quote time and a half back to the payroll team.",
        "The repair keeps the rest of the prompt and adds one sentence after the facts: 'Do not mention a rate of pay, a bonus, or any date that is not in these facts.' The payroll officer then runs the prompt again and reads the new reply one sentence at a time.",
      ],
    },
    practice: {
      intro:
        "Before the assessment, choose the prompt that would stop Kerry's reply from promising time and a half. The worked example and the paragraph on repairing the prompt are above if you want to read them again.",
      check: {
        kind: "choose",
        prompt: "Choose the version of Kerry's prompt that a colleague could run without the reply adding a rate of pay.",
        leftLabel: "Prompt A",
        left: "You are the payroll officer at Ashby Clinics. The facts are these: Kerry Lowe worked 11 hours of overtime in September, and it will be paid in the October payroll on 28 October. Be accurate and careful about pay. Write three short sentences to Kerry confirming this.",
        rightLabel: "Prompt B",
        right:
          "You are the payroll officer at Ashby Clinics. The facts are these: Kerry Lowe worked 11 hours of overtime in September, and it will be paid in the October payroll on 28 October. Do not mention a rate of pay, a bonus, or any date that is not in these facts. Write three short sentences to Kerry confirming this.",
        correct: "right",
        why: "Prompt B names what the reply must not add, which is a rate of pay, a bonus, or another date, and it keeps who is speaking, the facts, and the shape. Prompt A asks for care but does not say what to leave out, so the model could still write time and a half.",
        wrong:
          "Look again at Prompt A. Asking the model to be accurate and careful about pay does not tell it that it must not mention a rate, so it could still promise time and a half. Prompt B names the limit directly.",
      },
    },
    check: {
      kind: "scenario",
      prompt:
        "Read each situation and choose what you would do. Each question has one right answer, and you need six of the seven to pass.",
      passMark: 6,
      questions: [
        {
          id: "hr",
          situation:
            "Ruth Kemp is an HR adviser at Tolland Housing. A team leader, Marcus Obi, has asked whether his request for compressed hours has been approved. The request is still with his head of service, and no decision date has been set. Ruth asks the model for a polite reply, and the reply ends with 'You can expect an answer by Friday.'",
          question: "What should Ruth do next?",
          options: [
            {
              id: "a",
              text: "Delete the last sentence and send the rest, because the reply is otherwise accurate.",
              feedback:
                "That fixes this one reply, but the prompt still has no limit, so the next reply it writes for Marcus, or for a colleague who reuses it, may promise a date again. Add the limit to the prompt as well.",
            },
            {
              id: "b",
              text: "Add 'Do not give a date for the decision, because none has been set' to the prompt, run it again, and read the new reply.",
              correct: true,
              feedback:
                "This is the repair the course teaches. You named what the sentence added, which was a date, added the missing limit to the same prompt, and kept the rest. Reading the new reply confirms that nothing else has taken its place.",
            },
            {
              id: "c",
              text: "Add 'Please be careful about timings' to the prompt and send the next reply it writes.",
              feedback:
                "Asking for care does not tell the model what to leave out, so it can still write a date. Sending without reading the new reply also skips the step that confirms the promise has gone. A limit that names the date does the job.",
            },
            {
              id: "d",
              text: "Start again with a new prompt that asks for a warm, reassuring reply to Marcus.",
              feedback:
                "Starting again throws away who is speaking and the facts that were working, and asking for reassurance is the kind of pressure that produces a promised date. Repair the prompt you have by adding a limit on dates.",
            },
          ],
        },
        {
          id: "finance",
          situation:
            "Priya Nair works in accounts payable at Calder Engineering. A supplier, Westgate Fixings, has emailed to ask when invoice 20931 for £4,380 will be paid. Her prompt reads: 'You are the accounts payable officer at Calder Engineering. Invoice 20931 was approved on 2 October and will be paid in the payment run on 16 October. Reply to Westgate Fixings in three sentences.'",
          question: "Which part does the prompt still need before Priya runs it?",
          options: [
            {
              id: "a",
              text: "Who is speaking, because the model will not know that the reply comes from finance.",
              feedback:
                "The prompt already names the accounts payable officer, so the model knows whose voice to use. The gap is elsewhere, because nothing says what the reply must not add, such as an earlier payment date or a late payment charge.",
            },
            {
              id: "b",
              text: "A longer shape, because three sentences is too short for a supplier.",
              feedback:
                "Three sentences is a clear shape and enough for a payment update. The missing part is the limit. Without it, the model may offer an earlier date or interest on the payment to sound helpful.",
            },
            {
              id: "c",
              text: "More facts, such as the history of every invoice from Westgate Fixings this year.",
              feedback:
                "The prompt already gives the facts this reply needs, which are the approval date and the payment run. Extra history gives the model more to misquote. What is missing is a sentence that says what the reply must not add or promise.",
            },
            {
              id: "d",
              text: "A limit, such as 'Do not promise payment before 16 October, and do not offer interest or a late payment charge.'",
              correct: true,
              feedback:
                "That is the missing part. The prompt says who is speaking, gives the true dates, and sets the shape, but nothing stops the model from offering an earlier payment or compensation. A limit that names both closes the gap.",
            },
          ],
        },
        {
          id: "customer-service",
          situation:
            "Owen Hart is a customer service adviser at Lumen Broadband. His prompt gave two facts: Mrs Sato's outage on 4 November lasted six hours, and the engineer has fixed the fault. The reply reads: 'Thank you for your patience, Mrs Sato. The outage on 4 November lasted six hours, and the fault has now been fixed. We have credited £20 to your account for the disruption.'",
          question: "Which sentence would you stop before the reply goes out?",
          options: [
            {
              id: "a",
              text: "The sentence about the £20 credit.",
              correct: true,
              feedback:
                "The prompt said nothing about a credit, so £20 is a promise that was not in the prompt. Mrs Sato could quote it to the billing team, and nobody with the authority to agree it has done so.",
            },
            {
              id: "b",
              text: "The sentence about the outage and the fix, because it contains a date and a number.",
              feedback:
                "That sentence repeats the date, the six hours, and the fix, all of which the prompt gave. Detail is safe when it came from you. The sentence to stop is the one about the £20 credit, which nobody supplied.",
            },
            {
              id: "c",
              text: "The thank-you, because thanking her for her patience admits that the company was at fault.",
              feedback:
                "A thank-you commits nobody to anything, so it is safe to send. The sentence that commits the company is the £20 credit, which the prompt never mentioned.",
            },
          ],
        },
        {
          id: "operations",
          situation:
            "Hannah Doyle is the warehouse operations manager at Brook Lane Logistics. She needs a note for the night shift saying that the bay 3 roller door is out of use from Monday 10 November until a contractor repairs it, and that pallets for bay 3 should go to bay 5. No repair date has been given. She has two minutes before the handover.",
          question: "Which prompt should Hannah run?",
          options: [
            {
              id: "a",
              text: "Write a note to the night shift about the bay 3 door. Keep it short and friendly.",
              feedback:
                "This prompt has no facts, so the model will guess a date, a reason, and perhaps a repair day. It also does not say who is speaking. The prompt that gives the facts, the limit, and the shape is the one to run.",
            },
            {
              id: "b",
              text: "You are the warehouse operations manager. Write a clear, reassuring, and professional note to the night shift about the problem with the bay 3 door, and make sure everyone feels informed.",
              feedback:
                "This says who is speaking, but it gives no dates and no instruction about bay 5, and asking for reassurance invites the model to promise a repair date. The prompt with the facts and a limit is the safer choice.",
            },
            {
              id: "c",
              text: "You are the warehouse operations manager at Brook Lane Logistics. The facts are these: the bay 3 roller door is out of use from Monday 10 November, and pallets for bay 3 go to bay 5. Do not give a repair date, because none has been set. Write three short sentences for the handover board.",
              correct: true,
              feedback:
                "This prompt has all four parts. It says who is speaking, gives the date and the change of bay, stops the model from inventing a repair date, and asks for three sentences, so the night shift reads only what is true.",
            },
          ],
        },
        {
          id: "sales",
          situation:
            "Callum Reeves is a sales executive at Orchard Payroll Software. A prospect, Leanne Fox at Denby Dental, has asked whether the price of £85 a month includes onboarding. Callum does not know, because the answer sits with the pricing team, and his prompt gave only the price. The reply reads: 'Yes, onboarding is included in the £85 a month, as agreed on our call.'",
          question: "What is wrong with this reply?",
          options: [
            {
              id: "a",
              text: "Nothing, because the price of £85 a month came from Callum's prompt.",
              feedback:
                "The price came from the prompt, but the rest did not. Callum never said that onboarding was included, and 'as agreed on our call' claims an agreement nobody made. The sentence adds a promise that was not in the prompt.",
            },
            {
              id: "b",
              text: "It confirms that onboarding is included and claims an earlier agreement, and the prompt said neither.",
              correct: true,
              feedback:
                "The model filled Callum's silence with the answer Leanne wanted and added 'as agreed' to make it sound settled. Denby Dental could hold the company to both, so the prompt needs the fact that onboarding is still to be confirmed and a limit on what the reply may say about it.",
            },
            {
              id: "c",
              text: "It is too short, and a sales reply should say more about the product.",
              feedback:
                "Length is not the problem, and a longer reply would give the model more room to add promises. The problem is that the sentence confirms onboarding and an agreement that the prompt never gave.",
            },
          ],
        },
        {
          id: "procurement",
          situation:
            "Adaeze Okoro is a procurement officer at Hollins County Council. She is writing to the three suppliers who bid for a cleaning contract to say that the evaluation has been delayed. The panel now meets on 18 November, and no supplier has been selected. Her prompt gives those facts and asks for four sentences, and it ends: 'Reassure them that their bids are in a strong position.'",
          question: "What should Adaeze change before she runs the prompt?",
          options: [
            {
              id: "a",
              text: "Remove the request to reassure them, and add 'Do not suggest that any bid is ahead, and do not give a decision date.'",
              correct: true,
              feedback:
                "Asking the model to say the bids are strong invites it to write something that every supplier will read as a signal, which is a real problem in a public tender. Removing that line and naming what must not be said keeps the letter to the facts.",
            },
            {
              id: "b",
              text: "Add the names of all three suppliers so that each letter feels more personal.",
              feedback:
                "Names are harmless, but they do not remove the risk. The prompt still asks the model to say that the bids are strong, which it will do for all three suppliers. The fix is to remove that request and add a limit.",
            },
            {
              id: "c",
              text: "Nothing, because the prompt already gives the facts and the shape.",
              feedback:
                "Facts and a shape are two of the four parts. The prompt still has no limit, and its last line asks the model to reassure. That is the line that would produce a sentence suggesting one bid is ahead.",
            },
            {
              id: "d",
              text: "Ask for a longer letter that explains the reasons for the delay in detail.",
              feedback:
                "Adaeze has no detail to give beyond the new date, so a longer letter would be filled with reasons the model supplies. A limit on what it must not suggest or promise is the change that matters.",
            },
          ],
        },
        {
          id: "internal-comms",
          situation:
            "Tom Barrow runs internal communications at Selby Water. He needs an intranet post saying that the staff car park at the Riverside site closes for resurfacing on Saturday 22 November and Sunday 23 November. His prompt reads: 'You are the internal communications lead at Selby Water. Write an intranet post about the Riverside car park closure.'",
          question: "Which line, added to the prompt, would make the biggest difference to what comes back?",
          options: [
            {
              id: "a",
              text: "Make it upbeat, so that staff do not mind the disruption.",
              feedback:
                "Asking for an upbeat post invites the model to soften the news with something staff would welcome, such as free parking elsewhere or a later start. That adds promises. The prompt needs the facts first.",
            },
            {
              id: "b",
              text: "Write it in the house style.",
              feedback:
                "The model has not seen the house style, so this line tells it very little. The bigger gap is that the prompt gives no dates, so the model will choose its own.",
            },
            {
              id: "c",
              text: "The facts are these: the car park closes on Saturday 22 November and Sunday 23 November for resurfacing. Do not offer other parking, and do not give any other dates. Write four short sentences.",
              correct: true,
              feedback:
                "The prompt said who was speaking but was silent on the dates, the limit, and the shape. This line gives the true dates, stops the model from offering parking that nobody has arranged, and sets the length, so the post can go up after one careful read.",
            },
          ],
        },
      ],
      why: "You applied the whole method to situations you had not seen before. You checked what each prompt said and what it left silent, named the part that was missing, read each reply one sentence at a time, and repaired the prompt rather than only the reply.",
    },
    bridge:
      "You have now used every move in the course on new situations. In the last lesson you will write a prompt card for a real task of your own, with all four parts, and that card is the work your record will show.",
  },
  {
    id: "prompt-card",
    title: "Write a prompt for a real task",
    emphasis: "task",
    place:
      "This is the last lesson. You will bring the four parts together in a prompt for a task you actually have, and that prompt is the work your record will show.",
    sections: [
      {
        heading: "Choose a real task",
        paragraphs: [
          "Choose a piece of writing you expect to do in the next week or so, such as a reply to a client, a note to your team, a summary for your manager, or a message to a supplier. A real task is better than an invented one, because you know the facts, you know what must not be promised, and you will find out on Monday whether the prompt works.",
          "Do not put anything confidential into the card. The card will appear on a record that a second person can open, so use names and figures you would be comfortable showing, or replace them with realistic examples that keep the same shape.",
        ],
      },
      {
        heading: "Write each part so a colleague could run it",
        paragraphs: [
          "The test for the card is whether a colleague could paste it into the tool and get a usable reply without asking you what you meant. A line is ready to run when a colleague could use it as it stands. If they would have to ask you what you meant, the line needs more work. 'Account manager for Corvid Ltd' is ready to run, whereas 'me' is not, and 'the pilot ends on Friday 17 October' is ready to run, whereas 'the pilot is nearly over' is not.",
          "Write the limit as a plain instruction that starts with do not, must not, never, or only, and name the things that matter in this task. Write the shape as a length and a form, such as four short sentences, a list of five points, or one paragraph with no subject line.",
        ],
      },
      {
        heading: "How the card is checked",
        paragraphs: [
          "When you continue, the card is checked for each part in turn. Who is speaking has to name a person or a role. The facts that are true have to include at least one concrete fact, such as a name, a date, a number, or something that has not been agreed. What it must not add or promise has to set a limit. The shape of the answer has to say what form the reply takes.",
          "If a part is missing, the note will name it and say what to add. When every part is present, you can sign your name against the card. The record shows the card exactly as you wrote it, so a verifier sees the work you can now do.",
        ],
      },
    ],
    workedExample: {
      title: "A complete card",
      prompt:
        "Who is speaking: the account manager for Corvid Ltd, who can give updates but cannot change the price or length of the pilot.\nThe facts that are true: the pilot ends on Friday 17 October, 42 of the 50 licences are in use, and no extension or discount has been discussed.\nWhat it must not add or promise: do not offer a discount, an extension, or any date that is not in these facts, and do not say that anything was agreed.\nThe shape of the answer: four short sentences to Dana with no subject line, covering thanks, the status, a question about a review call, and a polite close.",
      output:
        "Thank you for asking, Dana. The pilot runs until Friday 17 October, and 42 of your 50 licences are in use. Would you like a short review call before it ends? I look forward to hearing from you.",
      reading: [
        "Each part of the card does one job, and each one could be checked by someone who was not there when it was written.",
        "Every sentence of the reply is safe to send, because every fact came from the card and the limit left no room for an extension or a discount.",
        "A colleague could run this card next week for the same client and get the same kind of reply, which is the test your own card has to meet.",
      ],
    },
    practice: {
      intro:
        "Before you write your own card, read this one for a note about an office move and mark each line. You will use the same test on your own card in a moment.",
      check: {
        kind: "mark",
        prompt: "Mark each line of this card as Ready to run or as A colleague would have to ask.",
        passLabel: "Ready to run",
        failLabel: "A colleague would have to ask",
        sentences: [
          {
            id: "role",
            text: "Who is speaking: me.",
            fail: true,
            why: "The word 'me' does not tell the model whose voice this is or what that person can promise, so a colleague would have to ask.",
          },
          {
            id: "context",
            text: "The facts that are true: the office move is on Saturday 8 November, and staff can leave boxes in the lobby from Thursday.",
            fail: false,
            why: "This line gives a date, a day, and a place, so a colleague could run it as it stands.",
          },
          {
            id: "constraints",
            text: "What it must not add or promise: be nice.",
            fail: true,
            why: "Being nice is a tone, not a limit. The line does not say what the note must not add or promise, such as extra days off or help with packing.",
          },
          {
            id: "output",
            text: "The shape of the answer: an email of no more than five sentences with a clear subject line.",
            fail: false,
            why: "This line gives a form and a length, so it is ready to run.",
          },
        ],
        why: "That is right. The facts and the shape are ready to run, but 'me' and 'be nice' would leave a colleague asking who is speaking and what the note must not promise.",
      },
    },
    check: {
      kind: "build",
      prompt:
        "Write a prompt card for one real task you have this week. Fill in all four parts so that a colleague could run it without asking you what you meant.",
      fields: [
        {
          id: "role",
          label: "Who is speaking",
          hint: "The person or role the reply comes from, and what they can or cannot agree.",
          min: 8,
          rule: "role",
          missing:
            "Who is speaking is still too thin. Name the person or role the reply comes from, for example the account manager for the client.",
        },
        {
          id: "context",
          label: "The facts that are true",
          hint: "Names, dates, numbers, and what has or has not been agreed.",
          min: 24,
          rule: "fact",
          missing:
            "The facts that are true do not yet contain a concrete fact. Add at least one thing the model could not guess, such as a name, a date, a number, or something that has not been agreed.",
        },
        {
          id: "constraints",
          label: "What it must not add or promise",
          hint: "Start with do not, must not, never, or only, and name what the reply must not add.",
          min: 16,
          rule: "limit",
          missing:
            "What it must not add or promise does not yet set a limit. Write at least one instruction that starts with do not, must not, never, or only, and name what the reply must not add, such as a price, a date, or an agreement.",
        },
        {
          id: "output",
          label: "The shape of the answer",
          hint: "How long it is and what form it takes.",
          min: 12,
          rule: "shape",
          missing:
            "The shape of the answer does not yet say what should come back. Say how long it is and what form it takes, for example three sentences or a list of five points.",
        },
      ],
      why: "The card has all four parts. It says who is speaking, gives a true fact, sets a limit on what must not be added or promised, and describes the shape of the answer, so a colleague could run it without asking you what you meant.",
    },
    bridge:
      "Your card is ready. Sign your name below, and the record will show this card, the course, and the date to anyone who opens the reference.",
  },
];
