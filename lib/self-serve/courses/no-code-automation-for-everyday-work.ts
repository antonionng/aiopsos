/*
Course: No-Code Automation for Everyday Work
Slug: no-code-automation-for-everyday-work
For: Administrators, coordinators and team leads who spend part of every week on a task that follows the same
  steps each time, and who can use at least one automation tool their organisation already licenses, such as
  Microsoft Power Automate, Zapier, Make, or the rules in their email client. No code is needed.
Outcome: The learner picks a repeating task that is safe to automate, describes its trigger, steps and conditions
  so a colleague could build from it, builds one small automation under an account they can justify, tests it on
  normal, incomplete, duplicate and unusual cases, and writes a failure note a colleague can use while they are away.
Artefact: The automation note, in four parts: Description, Access, Test log, Failure note.
Record sentence: Described, built, tested and signed one small automation on a real repeating task, with a note a
  colleague can use when it stops working.
Lessons (id, title, move, interaction, pass rule):
  1. rule-or-judgement, Rule or judgement, separate rule steps from judgement steps, mark,
     every step marked with the label the lesson defined.
  2. trigger-steps-and-conditions, Trigger, steps and conditions, describe a task so it can be built, choose,
     the description that names the trigger, the places and a condition.
  3. a-no-code-path, A no-code path, choose a sanctioned tool and grant only the access the steps use, mark,
     every permission marked as needed or not needed.
  4. run-it-on-real-cases, Run it on real cases, test on four kinds of case and judge each result, mark,
     every result marked handled correctly or handled wrongly.
  5. when-it-breaks, When it breaks, write a failure note with five parts, edit,
     the edited note keeps the rota and adds how we know, a deputy, the manual step and how to switch it off.
  6. the-whole-method, The whole method, on new cases, apply every earlier move to unseen situations, scenario,
     six of eight questions right.
  7. your-automation-note, Your automation note, write the note for a real automation, build,
     Description names the trigger and a place, Access names the account and a limit, Test log includes the
     duplicate case, Failure note says how someone will notice it has stopped.
Sources: Microsoft Learn, Power Automate documentation on cloud flows, connections and run failures. Zapier Help
  Center on triggers, actions, filters and failed runs. Make Help Center on scenarios, filters and error handling.
  National Cyber Security Centre, 10 Steps to Cyber Security, the step on identity and access management.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const RULE = "Rule a tool can follow";
const JUDGEMENT = "Judgement a person makes";
const READY = "Ready to build";
const DETAIL = "Needs more detail";
const NEEDS = "Access it needs";
const NOT_NEEDED = "Access it does not need";
const CORRECT = "Handled correctly";
const WRONGLY = "Handled wrongly";
const USABLE = "A colleague could use this";
const ASK = "A colleague would have to ask";

export const COURSE: CourseContent = {
  slug: "no-code-automation-for-everyday-work",
  hours: 2.5,
  artefact: {
    lessonId: "your-automation-note",
    title: "The automation note",
    recordLine:
      "Described, built, tested and signed one small automation on a real repeating task, with a note a colleague can use when it stops working.",
  },
  lessons: [
    {
      id: "rule-or-judgement",
      title: "Rule or judgement",
      emphasis: "judgement",
      place:
        "This is the first of seven lessons and the first module of the course, The task. Before you build anything, you need a test for whether a task, or one step of it, can be handed to a tool at all.",
      sections: [
        {
          heading: "What an automation actually does",
          paragraphs: [
            "An automation is a set of instructions that a tool carries out on your behalf whenever a particular event happens. In the tools this course has in mind, such as Microsoft Power Automate, Zapier, Make, or the rules in Outlook, you do not write code. You choose an event, such as a new form response, and then you choose what should happen next, such as adding a row to a spreadsheet or sending an email.",
            "Every automation follows rules. Its whole vocabulary is: when this happens, do that, unless this other thing is true. It does exactly what it has been told, every time, at any hour, and it never gets bored or skips a step because the office is busy. It also never notices that something about today's case is odd, because noticing is not one of the things it can be told to do.",
            "That is the reason this course starts with the task rather than the tool. The quality of an automation is decided before anyone opens Power Automate. It is decided by whether the person who designed it separated the steps that follow a rule from the steps that need someone to think.",
          ],
        },
        {
          heading: "Two labels for every step",
          paragraphs: [
            "In this course you will judge each step of a task with one of two labels. A step is a Rule a tool can follow when you could write it down so precisely that a new colleague on their first day would do it the same way every time. Copying a name from a form into a tracker is a rule. Sending the standard welcome email three days before a start date is a rule. The inputs are known, the action is fixed, and two careful people would produce the same result.",
            "A step is Judgement a person makes when doing it well depends on reading the situation. Deciding whether a customer's tone means they are about to leave is judgement. Deciding whether a training course suits someone's role is judgement. Two sensible people could reach different answers, and the right answer depends on things that are not written in any field of any form.",
            "A useful way to find the judgement in a task is to look for words that need a person to weigh something up. Words such as suitable, enough, appropriate, urgent, and reasonable almost always mark a judgement step. If the step contains one of those words and nobody has written down exactly what it means, a tool cannot do it.",
          ],
          beforeAfter: {
            before: "Check the request and send it on to the right team.",
            after:
              "Rule: if the Request type field says Facilities, forward the email to facilities@. Judgement: decide whether the request is urgent enough to phone the site manager.",
            reading:
              "The first version hides a judgement inside a rule. The second splits them, so the forwarding can be automated and the decision about urgency stays with a person.",
          },
        },
        {
          heading: "What automation is not",
          paragraphs: [
            "Automation is not a way to make judgement faster. If you hand a judgement step to a tool, the tool does not start using judgement. It applies a rule anyway, and because nobody chose that rule deliberately, it is usually a bad one. An automation that sends every training confirmation straight away is applying the rule that every request is suitable, whether or not anyone agreed to it.",
            "Automation is also not a promise that the whole task disappears. Most real tasks mix rules and judgement. A task with five steps might have four rules and one judgement, and the honest result of automating it is that four steps are done for you and one is still yours.",
          ],
        },
        {
          heading: "Automate around the judgement",
          paragraphs: [
            "The mistake people usually make is to look at a task, see that most of it is repetitive, and automate all of it. The one judgement step gets absorbed into the flow, and the first sign of trouble is a confirmation, an approval, or a rejection that nobody actually decided.",
            "The better move is to automate the rule steps around the judgement. The tool gathers the information, puts it in front of the right person, and waits. The person makes the decision in a click or a short reply, and the tool carries out whatever follows. This keeps the time savings and keeps the decision where it belongs. In the next lesson you will see that this waiting point is written into the description as a condition.",
          ],
        },
      ],
      workedExample: {
        title: "Training requests at Oakridge Housing",
        inputLabel: "The coordinator's description of the task",
        outputLabel: "Each step, marked",
        prompt:
          "A manager fills in the request form. I copy the details into the training tracker. I check whether the course is suitable for the person's role. I email the manager to confirm, and I add the date to the shared calendar.",
        output:
          "A manager fills in the request form: this is the event that starts the task.\nCopy the details into the training tracker: Rule a tool can follow.\nCheck whether the course is suitable for the person's role: Judgement a person makes.\nEmail the manager to confirm: Rule a tool can follow, once the decision has been made.\nAdd the date to the shared calendar: Rule a tool can follow.",
        reading: [
          "Priya Nair, the training coordinator, wrote five steps. The first is the event that starts everything, and three of the others are rules: copying fields into a tracker, sending a standard email, and adding a date to a calendar are done the same way every time.",
          "The suitability check is different. It depends on the person's role, what they have already done, and what the team needs this year. The word suitable is the signal.",
          "The reading is that most of the task can be automated, but only if the automation stops and waits for Priya's decision before it sends the confirmation. If the automation sent the confirmation straight away, it would be applying a rule, that every request is suitable, which nobody chose.",
        ],
      },
      practice: {
        intro:
          "Here are two steps from a facilities team's process for meeting room bookings. Mark each one with the label it deserves. The definitions are in the section above. Afterwards, write down the steps of one task you repeat every week, one step per line, and mark those too, because you will build on that list in the next lesson.",
        check: {
          kind: "mark",
          prompt: "Mark each step of the room booking process with the label it deserves.",
          passLabel: RULE,
          failLabel: JUDGEMENT,
          sentences: [
            {
              id: "confirm",
              text: "When a booking is made in the Rooms calendar, send the booker the standard confirmation with the room's access code.",
              fail: false,
              why: "The event, the message and the code are all fixed, so this is a rule a tool can follow.",
            },
            {
              id: "clash",
              text: "When two teams both want the boardroom, decide which meeting matters more.",
              fail: true,
              why: "Deciding which meeting matters more depends on reading the situation, so it is judgement a person makes.",
            },
          ],
          why: "That is right. The confirmation is the same every time, so a tool can send it. Choosing between two teams needs a person, and the tool should pass that case to someone rather than decide it.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "An office manager listed these four steps for handling new starters. Mark each step with the label it deserves.",
        passLabel: RULE,
        failLabel: JUDGEMENT,
        sentences: [
          {
            id: "folder",
            text: "When HR adds a new starter to the list, create a folder named with their full name in the Starters library.",
            fail: false,
            why: "There is no decision in this step. The trigger and the action are both exact, so it is a rule a tool can follow.",
          },
          {
            id: "desk",
            text: "Decide which desk they should sit at, given who they will work with most.",
            fail: true,
            why: "Two sensible people could choose different desks here. That means it is judgement a person makes.",
          },
          {
            id: "welcome",
            text: "Send the standard welcome email three days before the start date.",
            fail: false,
            why: "Nothing here needs a decision. The email is standard and the timing is exact, so it is a rule a tool can follow.",
          },
          {
            id: "plan",
            text: "Check whether their manager has planned enough for their first week.",
            fail: true,
            why: "Look at the word 'enough'. Deciding what is enough is judgement a person makes.",
          },
        ],
        why: "That is the right reading. The folder and the welcome email are exact and repeatable, so a tool can do them. Choosing a desk and judging whether a first week is planned well enough both need a person to read the situation, so the automation should prepare those cases and leave the decision to someone.",
      },
      bridge:
        "Once you know which steps are rules, the next lesson shows you how to describe them so precisely that they can be built.",
    },
    {
      id: "trigger-steps-and-conditions",
      title: "Trigger, steps and conditions",
      emphasis: "conditions",
      place:
        "This lesson completes the first module, The task. It turns the rule steps you found in the last lesson into a description that you, or a colleague, could build from without asking what you meant.",
      sections: [
        {
          heading: "Three parts of every automation",
          paragraphs: [
            "Every automation, in every no-code tool, has three parts. The trigger is the single event that starts it. The steps are what happens next, in order. The conditions are the rules that change what happens, depending on what the case contains. Power Automate, Zapier and Make use slightly different words on screen, but each of them asks you for these three things.",
            "Writing the three parts down before you open the tool is the most useful half hour in the whole build. It forces the decisions into the open while they are still cheap to change. It also gives you a document a colleague can read, which matters later when you test the automation and when you write down what to do if it breaks.",
          ],
        },
        {
          heading: "The trigger is one event",
          paragraphs: [
            "A trigger is one event that the tool can detect, such as a new response to a named form, a new file in a named folder, or an email arriving in a named mailbox from a particular address. It is not a situation, such as when a request comes in, because the tool cannot see a situation. It can only see an event in a system it is connected to.",
            "If you find yourself writing two triggers, you usually have two automations. A request that can arrive by email or by form is two flows, or one form that everyone is asked to use. Choosing one entry point is often the biggest simplification you can make.",
          ],
          beforeAfter: {
            before: "When someone needs a room.",
            after: "Trigger: a new response to the Room Request form in Microsoft Forms.",
            reading:
              "The first version describes a need. The second names an event the tool can detect and the exact form it comes from.",
          },
        },
        {
          heading: "Each step names a place",
          paragraphs: [
            "A step says what happens and names the exact place information comes from and goes to. Add a row to the Requests table in the Training Tracker workbook, copying the requester's name, email and course, is a step. Put it in the tracker is not, because a colleague would have to ask which tracker, which table, and which fields.",
            "Steps are written in the order they happen. If one step depends on something another step produced, such as a link to a file that was saved earlier, the order matters and the description should make it obvious.",
          ],
          beforeAfter: {
            before: "Save the invoice and tell finance.",
            after:
              "Step one: save the attachment to the Incoming folder in the Finance SharePoint library, named with the date and the sender. Step two: post a message in the Finance Teams channel with a link to the file.",
            reading:
              "The second version names the folder, the naming rule, the channel and what the message contains, so it can be built without a single question.",
          },
        },
        {
          heading: "Conditions change what happens",
          paragraphs: [
            "A condition is a rule that changes the path. Only if the amount is over £500. Stop if the email field is empty. If the coordinator approves, send the confirmation; if they reject, send the standard reply. Conditions are where the judgement step from the last lesson lives: the automation waits for the person, and a condition decides what happens after their answer.",
            "Conditions are also where the awkward cases are handled. A form response with no email address, a message with no attachment, or a request that has already been logged all need a condition, otherwise the tool will carry on as if the case were normal. You will test these cases directly in Lesson 4.",
          ],
        },
        {
          heading: "Ready to build, or needs more detail",
          paragraphs: [
            "A description is not a wish, such as handle new requests automatically. It is also not a list of apps, such as Forms, Excel and Outlook, because naming the apps says nothing about what happens between them. Both are common starting points, and both leave every real decision unmade.",
            "In this course, a description, or a single line of one, is Ready to build when every part names a place, a field or an event. It Needs more detail when someone would have to ask you what you meant. The usual mistake is to write a description that is clear to you because you do the task every week, and to forget that the person building it, or the tool, has none of that knowledge.",
          ],
        },
      ],
      workedExample: {
        title: "Rewriting the training request description",
        inputLabel: "The coordinator's first description",
        outputLabel: "The description rewritten to be built",
        prompt: "When someone requests training, put it in the tracker and let them know.",
        output:
          "Trigger: a new response to the Training Request form in Microsoft Forms.\nStep one: add a row to the Requests table in the Training Tracker workbook, copying the requester's name, email, the course and the preferred month.\nStep two: send the coordinator an approval request in Teams with the course and the person's role.\nCondition: if the coordinator approves, send the manager the confirmation email from the shared mailbox; if the coordinator rejects, send the manager the standard 'not this time' email with the coordinator's comment.\nCondition: if the email field is empty, stop and email the coordinator.",
        reading: [
          "The first description is one sentence that Priya understood perfectly, because she does the task every week. It hid four decisions: which form, which tracker, who says yes, and what happens with an incomplete response.",
          "The rewrite makes each of them visible. The trigger names the form. Each step names the place information goes. The approval step is the judgement from Lesson 1, and the first condition says what happens after Priya decides.",
          "The last condition handles a case the first description never considered. Without it, a response with no email address would create a row and then fail quietly when the tool tried to send the confirmation.",
        ],
      },
      practice: {
        intro:
          "Here are three lines from a description of a holiday request automation. Mark each line as Ready to build or as Needs more detail. The section above defines both. Then rewrite the rule steps from your own list in Lesson 1 as a trigger, steps and at least one condition.",
        check: {
          kind: "mark",
          prompt: "Mark each line of the holiday request description with the label it deserves.",
          passLabel: READY,
          failLabel: DETAIL,
          sentences: [
            {
              id: "trigger",
              text: "Trigger: a new item is added to the Leave Requests list in the HR SharePoint site.",
              fail: false,
              why: "It names the event and the exact list, so it is ready to build.",
            },
            {
              id: "sort",
              text: "Step one: sort it out with the manager.",
              fail: true,
              why: "A colleague would have to ask what sorting it out means, how the manager is contacted, and what they are asked to do, so it needs more detail.",
            },
            {
              id: "condition",
              text: "Condition: if the Days field is more than 10, also send the request to the HR inbox.",
              fail: false,
              why: "It names a field, a number and a place, so it is ready to build.",
            },
          ],
          why: "That is right. The trigger and the condition each name a place, a field or an event. 'Sort it out with the manager' would leave the person building it asking what you meant.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two colleagues described the same invoice task. Choose the description that is ready to build.",
        leftLabel: "Description A",
        left: "Automatically save supplier invoices and tell finance.",
        rightLabel: "Description B",
        right:
          "Trigger: a new email with a PDF attachment arrives in the invoices@ shared mailbox. Step one: save the attachment to the Incoming folder in the Finance SharePoint library, named with the date and the sender. Step two: post a message in the Finance Teams channel with a link to the file. Condition: if the email has no attachment, move it to the 'Check' folder in the mailbox and do not post.",
        correct: "right",
        why: "Description B names the trigger, the exact places for each step, and what happens when there is no attachment, so it is ready to build.",
        wrong:
          "Description A does not say which mailbox, which folder, how finance will be told, or what happens when there is no invoice. It needs more detail. Description B names each of those.",
      },
      bridge:
        "With a description ready to build, the next lesson helps you choose where to build it and whose account it will run under.",
    },
    {
      id: "a-no-code-path",
      title: "A no-code path",
      emphasis: "path",
      place:
        "This lesson is the second module of the course. It covers the choice of tool and the question of access, which is the part people most often skip.",
      sections: [
        {
          heading: "Start with what your organisation already allows",
          paragraphs: [
            "Start with the automation tools your organisation already licenses and allows. A tool your IT team has not approved may break policy, may send company data to a service nobody has assessed, and will be switched off when someone notices, usually at the moment the team has come to depend on it.",
            "The quickest way to find out what is allowed is to ask whoever manages your systems, with your description from the last lesson in hand. A short message that says what the automation will read, what it will write, and where, gets a far better answer than a general question about whether you can use Zapier. It also means the person who approves the tool knows what it is being used for.",
          ],
        },
        {
          heading: "The simplest path that works",
          paragraphs: [
            "The simplest path is often built into a tool you already use. A rule in Outlook can move emails from a supplier into a folder and forward them to a colleague. A flow in Microsoft Power Automate can connect a form, a spreadsheet and a Teams channel inside the same Microsoft 365 account. Separate connector services such as Zapier and Make are useful when the systems you need belong to different companies, but they add another account, another set of permissions, and another place where things can go wrong.",
            "Choose the path with the fewest moving parts that still does every step in your description. If an email rule can do it, an email rule is better than a flow, because more people understand it and fewer things can break. If your description needs an approval step and a condition, you will need something like Power Automate, and that is a reasonable choice.",
          ],
        },
        {
          heading: "Every automation runs as someone",
          paragraphs: [
            "Every automation runs as some account, and it can see and change everything that account can. When you build a flow while signed in as yourself, the tool usually connects to your mailbox, your files and your Teams under your own login. That means the automation can read your whole mailbox, even though it only needs one folder.",
            "It also means the automation is tied to you. When you change your password, some connections stop working until you sign in again. When you leave the organisation and your account is closed, the automation stops, often without telling anyone. For anything a team depends on, the better arrangement is a shared or service account that exists for the work rather than for a person, with its own owner recorded.",
          ],
        },
        {
          heading: "Access it needs and access it does not need",
          paragraphs: [
            "When you connect a tool, it will show you the permissions it wants. Read these as carefully as you would read a contract. In this course, a permission is Access it needs when a step in your description uses it, and Access it does not need when no step does. The aim is to grant the first and refuse the second.",
            "This is the same principle the National Cyber Security Centre sets out in the identity and access management step of its 10 Steps to Cyber Security: people and systems should have only the access their work requires. You do not need to be a security specialist to apply it. You need your description, because every permission can be matched against a step, and any permission with no matching step has no reason to be there.",
            "The mistake people usually make is to accept the defaults because the build is going well and the permissions screen is in the way. Unpicking access later is slow and awkward. Asking the question before you build takes one message.",
          ],
          beforeAfter: {
            before: "Read and write all files you can access.",
            after: "Write files to the Incoming folder in the Finance SharePoint library only.",
            reading:
              "The first permission lets the automation change every file you can open. The second matches the one step that saves a file, and nothing more.",
          },
        },
      ],
      workedExample: {
        title: "The invoice flow asks for too much",
        inputLabel: "What the connector asked for",
        outputLabel: "The note the office manager sent to IT",
        prompt:
          "Helen Carr, office manager at Brennan & Hale Surveyors, starts building the invoice flow from Lesson 2 in Power Automate. The connections screen asks for: Read and write all mail in your mailbox. Read and write all files you can access. Post messages in Teams as you.",
        output:
          "Hi Tom, I am building a flow that saves invoices from the invoices@ shared mailbox into Finance Incoming and posts a link in the Finance channel. It only needs to read the invoices@ shared mailbox, write to the Finance Incoming folder, and post in that one Teams channel. Can we run it under a service account with only those permissions, rather than under my login? My description of the flow is attached.",
        reading: [
          "The default would have given the flow access to everything Helen can see: her own mailbox, every file she can open, and the ability to post in Teams as her. None of that matches a step in her description except the three things she lists.",
          "Running it under her login would also have tied the flow to one person. If Helen changed her password or left the firm, the invoices would stop arriving in Incoming and nobody would be told.",
          "Her note to Tom Achebe, the IT administrator, matches each permission to a step and asks for a service account. Asking the question before building is cheaper than unpicking the permissions later.",
        ],
      },
      practice: {
        intro:
          "Two colleagues wrote to IT before building the same automation. Choose the message that will get the right access. Then list every place your own description reads from or writes to, and write next to each one the account you intend the automation to run under.",
        check: {
          kind: "choose",
          prompt: "Choose the message to IT that asks for only the access the automation needs.",
          leftLabel: "Message A",
          left: "Hi, can I have Zapier connected to my Microsoft account so I can automate some admin? It needs full access to work properly.",
          rightLabel: "Message B",
          right:
            "Hi, I want to add new responses from the Visitor form to the Visitors list on the Reception site. It only needs to read that form and write to that list. Is Power Automate the approved tool, and which account should it run under?",
          correct: "right",
          why: "Message B names the two places the automation touches, asks only for that access, and asks which tool and account are approved. Message A asks for full access to everything with no description, so nobody can judge what is needed.",
          wrong:
            "Look again at Message A. It asks for full access and does not say what the automation reads or writes, so IT cannot tell what it needs. Message B matches the access to the steps.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "An automation copies new rows from the bookings form into the events calendar. Mark each permission it asked for with the label it deserves.",
        passLabel: NEEDS,
        failLabel: NOT_NEEDED,
        sentences: [
          {
            id: "form",
            text: "Read responses to the Bookings form.",
            fail: false,
            why: "The automation starts from the form. Without this access it cannot run, so it is access it needs.",
          },
          {
            id: "calendar",
            text: "Create events in the Events calendar.",
            fail: false,
            why: "The only step writes to the Events calendar, so it needs to be able to create events there.",
          },
          {
            id: "email",
            text: "Read and send email as you.",
            fail: true,
            why: "Look at the description again. No step reads or sends email, so this is access it does not need.",
          },
          {
            id: "files",
            text: "Read all files in your OneDrive.",
            fail: true,
            why: "The automation moves a form response into a calendar. Your files play no part in it, so this is access it does not need.",
          },
        ],
        why: "That is right. The trigger reads the form and the step writes to the calendar, so those two permissions are needed. No step sends email or opens your files, so those two should be refused before anything is switched on.",
      },
      bridge: "Once it is built, the next lesson shows you how to run it on real cases before anyone relies on it.",
    },
    {
      id: "run-it-on-real-cases",
      title: "Run it on real cases",
      emphasis: "cases",
      place:
        "This lesson is the third module of the course, Run it. It is the difference between an automation that works in a demonstration and one that works on a Monday morning.",
      sections: [
        {
          heading: "A demonstration is not a test",
          paragraphs: [
            "When you finish building a flow, the natural thing to do is to send it one tidy example and watch it work. That is a demonstration. It shows that the pieces are connected. It does not show what happens to the cases that make up a real week, which are rarely tidy.",
            "Before you switch an automation on for real, you run it on a small set of cases taken from actual recent work, and you check what happened at every step. Taking the cases from real work matters, because the awkward cases you would never think to invent are the ones already sitting in last month's inbox.",
          ],
        },
        {
          heading: "Four kinds of case",
          paragraphs: [
            "The test set must include four kinds of case. A normal case is the one the automation was designed for. A missing or empty field is a case where something the description relies on is not there, such as a form response with no email address or an email with no attachment. A duplicate is something that has already been handled arriving again, such as a form submitted twice or an invoice sent a second time.",
            "An unusual case is anything real that does not fit the pattern: a very long name, an attachment in the wrong format, two items in one message, or a date typed in words. You do not need dozens of cases. One of each kind, chosen from real work, will find most of the problems a small automation has.",
          ],
          beforeAfter: {
            before: "Tested with a sample request. Worked.",
            after:
              "Tested with four requests from last month: a normal one, one with no email, the same request submitted twice, and one asking for two courses at once.",
            reading:
              "The first test proves the flow is connected. The second tests the four kinds of case that a real month will contain.",
          },
        },
        {
          heading: "Quiet failures",
          paragraphs: [
            "A test is not the automation running without an error message. Many automations fail quietly by doing the wrong thing successfully. A flow that saves the same invoice twice under the same name, so that the second copy overwrites the first, reports success. A flow that posts a delivery note as if it were an invoice reports success. The run history shows green ticks, and the work is wrong.",
            "That is why you check what happened at every step, in the places the steps wrote to. Open the tracker and count the rows. Open the folder and look at the files. Read the message that was posted. The run history tells you the tool did not crash, and only the places themselves tell you whether it did the job.",
          ],
        },
        {
          heading: "Recording what happened",
          paragraphs: [
            "For each case, you record one of two results. A case is Handled correctly when every step did what the description said. A case is Handled wrongly when any step did not, even if nothing reported an error. A case where the flow stopped and emailed you, because your description said it should stop, is handled correctly, because stopping was the right thing to do.",
            "When a case is handled wrongly, the fix is usually a new condition, such as check for an existing row before adding one, or only post when the file name contains the word invoice. After you add it, you run the same case again and record the new result. The mistake people usually make is to fix the flow and move on without the rerun, which leaves them with a change nobody has tested.",
          ],
        },
      ],
      workedExample: {
        title: "Four emails to the invoices mailbox",
        inputLabel: "The four test cases",
        outputLabel: "The test log",
        prompt:
          "Helen sent four emails to the invoices@ mailbox, all taken from last month's real post: a normal invoice with one PDF, an email with no attachment, the same invoice sent twice, and an email with two PDFs, an invoice and a delivery note.",
        output:
          "Normal: saved and posted, handled correctly.\nNo attachment: moved to Check, handled correctly.\nDuplicate: saved twice with the same name, the second overwrote the first, and two messages were posted, handled wrongly.\nTwo PDFs: both saved, and the delivery note was posted as if it were an invoice, handled wrongly.",
        reading: [
          "The run history reported success on all four emails. Two of them were wrong, and neither would have been noticed from the run history alone.",
          "The duplicate case could lose an invoice silently. If the supplier had corrected the amount in the second email, the overwrite would have hidden which version finance had paid.",
          "The two PDF case would send Sian Pritchard, the finance assistant, a delivery note to pay. Both cases need a condition added, and both need to be rerun and recorded before the flow goes live.",
        ],
      },
      practice: {
        intro:
          "Two colleagues planned tests for a flow that adds visitor form responses to a list. Choose the test set that covers the four kinds of case described above. Then write down four real cases for your own automation, one of each kind, and predict what should happen at each step.",
        check: {
          kind: "choose",
          prompt: "Choose the test set that will show whether the visitor flow is ready to switch on.",
          leftLabel: "Test set A",
          left: "One visitor from last week with every field filled in, one with no company name, a visitor who submitted the form twice, and a group booking for six people in one response.",
          rightLabel: "Test set B",
          right: "Five visitors from last week, each with every field filled in, run one after another to check the flow is quick enough.",
          correct: "left",
          why: "Test set A has a normal case, a missing field, a duplicate and an unusual case, so it tests what a real week will contain. Test set B runs the normal case five times and will only ever show green ticks.",
          wrong:
            "Look again at Test set B. Five complete responses are five normal cases, so the flow never meets a missing field, a duplicate or an unusual case. Test set A has one of each.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "An automation should add each new form response to the tracker and email the manager. Here is what happened in four tests. Mark each result with the label it deserves.",
        passLabel: CORRECT,
        failLabel: WRONGLY,
        sentences: [
          {
            id: "normal",
            text: "A normal response was added as one row and the manager received one email.",
            fail: false,
            why: "Check each step. One row was added and one email was sent, which is what the description asked for, so it was handled correctly.",
          },
          {
            id: "missing",
            text: "A response with no manager email was added to the tracker, and the flow reported success.",
            fail: true,
            why: "Success in the log is not the test. The manager was never emailed, so a step did not do what it should and it was handled wrongly.",
          },
          {
            id: "duplicate",
            text: "A response submitted twice by accident created two rows.",
            fail: true,
            why: "Two rows for one request will be counted twice. That is handled wrongly even though nothing broke.",
          },
          {
            id: "long",
            text: "A response with a very long course name was added in full and the email showed the whole name.",
            fail: false,
            why: "Look at the result. The long name survived both steps, so the case was handled correctly.",
          },
        ],
        why: "That is the right reading. The normal and unusual cases passed through every step intact. The missing email was a quiet failure that reported success, and the duplicate created a second row, so both need a condition and a rerun before the flow is switched on.",
      },
      bridge:
        "Every automation eventually breaks, and the next lesson shows you how to write down what happens when yours does.",
    },
    {
      id: "when-it-breaks",
      title: "When it breaks",
      emphasis: "breaks",
      place:
        "This lesson is the fourth module of the course. It prepares the failure note, which is the part that protects the work when you are not there.",
      sections: [
        {
          heading: "Automations break for ordinary reasons",
          paragraphs: [
            "An automation that passed every test will still stop working one day, and it will usually be for an ordinary reason. A password changes. A form gains a new question and the field the flow relied on moves. A folder is renamed during a tidy-up. A licence lapses at the end of the financial year. The person who built it leaves, and their account is closed.",
            "None of these is a fault in the automation, and none of them can be prevented by building more carefully. What you can control is what happens next: how quickly someone notices, who fixes it, and whether the work carries on in the meantime. That is the job of the failure note.",
          ],
        },
        {
          heading: "The five parts of a failure note",
          paragraphs: [
            "A failure note has five parts. What it does, in one sentence. How we know it stopped, meaning the way someone will notice. Who owns it, and who covers when that person is away. What people do by hand until it is fixed. How to switch it off.",
            "A failure note is not a technical manual. It does not explain how each step was configured, and it does not need screenshots of the flow. It is written for the colleague who covers for you on holiday, who may never have opened the automation tool, and who needs to keep the work moving on a morning when you cannot be reached.",
          ],
        },
        {
          heading: "How we know it stopped",
          paragraphs: [
            "The part most often missing is how we know it stopped. Most tools can email the owner when a run fails, and that is worth switching on, but it only catches failures the tool can see. It does not catch the flow that stopped being triggered because the form moved, and it does not catch quiet failures of the kind you tested for in the last lesson.",
            "A quiet failure can run for weeks before anyone notices that the tracker has stopped growing. The dependable answer is a check a person can do without opening the automation tool, on a fixed day, against something they already look at. Counting the week's invoices in the mailbox against the files in the folder takes two minutes on a Friday, and it catches every kind of failure.",
          ],
          beforeAfter: {
            before: "If it breaks, let me know.",
            after:
              "How we know it stopped: Power Automate emails the owner when a run fails, and every Friday the finance assistant checks that the week's invoices in the mailbox match the files in Incoming.",
            reading:
              "The first version relies on someone noticing by chance. The second names the tool's own alert and a weekly check by a person that does not depend on the tool at all.",
          },
        },
        {
          heading: "Owner, cover, by hand, and off",
          paragraphs: [
            "The owner is the person responsible for fixing the automation, and the note should also name who covers when they are away. A single name is a single point of failure. The by hand part says exactly what someone does to keep the work going, such as saving attachments from the mailbox into Incoming each morning, so that a broken automation delays nothing that matters.",
            "The last part says how to switch the automation off. This matters more than it seems. A broken automation that is still running can do harm, such as sending the wrong rota to every member of staff each week, and the person covering needs to be able to stop it in under a minute. Say where to go, what to press, and whether anything else depends on it.",
          ],
          beforeAfter: {
            before: "Speak to Helen if there is a problem.",
            after:
              "Owner: Helen Carr, and Mark Ellis, the finance lead, when she is away. By hand in the meantime: save attachments from invoices@ into Incoming each morning. Switch it off: open the flow in Power Automate and choose Turn off; nothing else depends on it.",
            reading:
              "The second version names a deputy, gives the manual step, and says how to stop the flow, so it still works when Helen is on leave.",
          },
        },
      ],
      workedExample: {
        title: "Repairing the invoice flow's failure note",
        inputLabel: "The office manager's first note",
        outputLabel: "The repaired failure note",
        prompt: "If it breaks, let me know.",
        output:
          "What it does: saves invoices from invoices@ into Finance Incoming and posts a link in the Finance channel.\nHow we know it stopped: Power Automate emails the owner when a run fails, and the finance assistant checks on Friday that the week's invoices in the mailbox match the files in Incoming.\nOwner: Helen Carr, office manager, and Mark Ellis, the finance lead, when she is away.\nBy hand in the meantime: the finance assistant saves attachments from the mailbox into Incoming each morning.\nSwitch it off: open the flow in Power Automate and choose Turn off; nothing else depends on it.",
        reading: [
          "The first note relied on the automation's author noticing, which does not work when the author is on leave, and it relied on someone else knowing it had broken, which is exactly what a quiet failure prevents.",
          "The repaired note gives a second person, Sian, a weekly check that does not depend on the tool, and it names Mark as cover so that a fix does not wait for Helen's return.",
          "The by hand step and the switch-off step mean that on the worst morning, the invoices still reach finance and the broken flow can be stopped by someone who has never built one.",
        ],
      },
      practice: {
        intro:
          "Two team leads wrote the 'How we know it stopped' part for a flow that adds new starters to the IT setup list. Choose the one that will catch a quiet failure. Then write the same part for your own automation, naming a check a person can do without opening the automation tool.",
        check: {
          kind: "choose",
          prompt: "Choose the line that will tell someone the new starter flow has stopped, even if the tool reports nothing.",
          leftLabel: "Line A",
          left: "How we know it stopped: the flow will show an error in the run history.",
          rightLabel: "Line B",
          right:
            "How we know it stopped: on the first working day of each month, the HR assistant checks that every name on the starters list also appears on the IT setup list.",
          correct: "right",
          why: "Line B names a person, a day and a comparison that does not rely on the tool, so it catches quiet failures and flows that stopped being triggered. Line A only works if someone opens the run history and the tool noticed the problem.",
          wrong:
            "Look again at Line A. The run history only shows failures the tool can see, and nobody is named to look at it. Line B gives a person a regular check against the lists themselves.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "Edit this failure note so that a colleague could use it while you are on holiday. Add every part that is missing: how someone will know it has stopped, who covers for the owner, what people do by hand in the meantime, and how to switch it off.",
        label: "The failure note you are repairing",
        start:
          "This flow sends the weekly rota email to all staff. It usually works. Speak to Dan if there is a problem.",
        unchanged:
          "You have not changed the note yet. Start by adding how someone will notice that the rota email did not go out.",
        limitWording: false,
        keep: [
          {
            id: "what",
            any: ["rota"],
            missing: "Keep what the flow does. The note should still say that it sends the weekly rota email.",
          },
        ],
        limits: [
          {
            id: "know",
            any: ["how we know", "notice", "check", "we will know", "we know"],
            missing: "The note still does not say how anyone will notice that the rota email did not go out.",
          },
          {
            id: "deputy",
            any: ["away", "deputy", "covers", "cover for", "on leave", "holiday", "absence", "absent"],
            missing: "Dan is named, but nobody covers for him. Add who to speak to when Dan is away.",
          },
          {
            id: "manual",
            any: ["by hand", "manually", "manual"],
            missing: "Say what someone does to send the rota by hand until it is fixed.",
          },
          {
            id: "off",
            any: ["switch it off", "switch off", "switch the flow off", "turn off", "turn it off", "disable", "pause"],
            missing: "Add how to switch the flow off, so a broken version cannot keep sending.",
          },
        ],
        why: "The note now says what the flow does, how someone will notice when it stops, who owns it and who covers, what to do by hand, and how to switch it off.",
        result: {
          label: "A note that would pass",
          text: "What it does: sends the weekly rota email to all staff at 4pm on Thursday. How we know it stopped: the flow emails Dan when a run fails, and the duty manager checks on Friday morning that the rota email is in their inbox. Owner: Dan Mercer, and Aisha Khan covers when he is away. By hand in the meantime: the duty manager sends the rota from the shared mailbox using the saved template. Switch it off: open the flow in Power Automate and choose Turn off.",
        },
      },
      bridge:
        "You have now practised every move in the course. The next lesson brings them together and asks you to apply them to situations you have not seen.",
    },
    {
      id: "the-whole-method",
      title: "The whole method, on new cases",
      emphasis: "method",
      place:
        "This is the course assessment. It sets out the whole method in one place, works one mixed example, and then asks you to apply the method to eight situations you have not seen before.",
      sections: [
        {
          heading: "The method in one place",
          paragraphs: [
            "The course has taught five moves, and each depends on the one before it. First, you separate the steps of a task into rules a tool can follow and judgement a person makes, and you plan to automate around the judgement. Second, you describe the rule steps as a trigger, steps and conditions, until every line names a place, a field or an event and is ready to build.",
            "Third, you choose the simplest approved tool that can do every step, and you grant only the access the steps use, preferably under an account that exists for the work rather than for one person. Fourth, you run the automation on four real cases, a normal one, a missing field, a duplicate and an unusual one, and you check each place the steps wrote to. Fifth, you write a failure note with five parts, so that a colleague can keep the work going when it stops.",
          ],
        },
        {
          heading: "Where people usually go wrong",
          paragraphs: [
            "Each move has a typical mistake. People automate a judgement step because it sits among repetitive ones. They describe a wish or a list of apps instead of a trigger and places. They accept default permissions and build under their own login. They test with one tidy example and trust the green ticks. They write a failure note that says only to let them know.",
            "What these mistakes have in common is that each one feels efficient at the time and costs more later. The questions in this assessment are built around those moments, where the quicker option is attractive and the better option takes a few more minutes.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "The assessment has eight situations. Each describes a real piece of work, with names, numbers and a document or decision, and asks what you would do. Every option is something a reasonable colleague might suggest, and one of them follows the method this course taught.",
            "You need six of the eight to pass. After you submit, each question shows whether your choice was right and why, so you can read the reasoning behind any question you missed. If you do not reach six, your answers stay on screen and you can change them.",
          ],
        },
      ],
      workedExample: {
        title: "A volunteer sign-up flow at Marlow Community Trust",
        inputLabel: "The plan a colleague shared",
        outputLabel: "The review, move by move",
        prompt:
          "Jess Obi, volunteer coordinator at Marlow Community Trust, shared this plan: 'When someone signs up to volunteer, the flow will add them to the rota, send the welcome pack, and approve them for lone working. I have built it under my account in Zapier on my personal plan and tried it with my own details, which worked. If it stops, people will tell me.'",
        output:
          "Rule or judgement: approving someone for lone working is judgement, so the flow should send the application to the safeguarding lead and wait.\nDescription: 'when someone signs up' needs a named form, and 'the rota' needs a named sheet and fields.\nTool and access: a personal Zapier plan is not approved and is tied to Jess, so ask the trust which tool and account to use.\nTesting: one test with her own details is a demonstration; she needs a missing field, a duplicate and an unusual case from real sign-ups.\nFailure note: 'people will tell me' needs a check someone does without the tool, a deputy, a manual step, and how to switch it off.",
        reading: [
          "Every move in the course found something in Jess's plan, which is common in a first draft and says nothing bad about Jess. The plan is enthusiastic and the automation may well be worth building.",
          "The most serious problem is the lone working approval, because it turns a safeguarding decision into a rule that approves everyone. That is the first thing to fix, before any of the others.",
          "The review is written as one line per move, so Jess can work through it in order. That is also the order in which the scenarios below draw on the course.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, try one question in the same form. The method in the first section above is still on the page.",
        check: {
          kind: "choose",
          prompt:
            "Owen, a team lead at Kestrel Facilities, wants to build a flow that emails the cleaning contractor whenever a site manager reports a spill in the Incidents form. He has asked what to do first. Choose the better first step.",
          leftLabel: "Step A",
          left: "Write the trigger, steps and conditions, naming the Incidents form, the contractor's address and what happens when the site field is empty.",
          rightLabel: "Step B",
          right: "Open Power Automate and start with a template for form responses, then adjust it as the details become clear.",
          correct: "left",
          why: "Step A makes the decisions visible before anything is built, so the tool, the access and the tests all have something to be checked against. Starting from a template means the decisions get made by the template.",
          wrong:
            "Look again at Step B. A template makes the decisions for you, and Owen will not know which ones until something goes wrong. Step A writes the description first, which is where the method starts.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. You need six of the eight to pass, and each answer shows its reasoning after you submit.",
        passMark: 6,
        questions: [
          {
            id: "leave",
            situation:
              "Leah Morgan, HR administrator at Kestrel Facilities, handles about 40 holiday requests a month. Each request is logged in the Leave list, checked against the team calendar for clashes, and approved or refused by the line manager, who sometimes allows a clash for a family event.",
            question: "What should Leah automate?",
            options: [
              {
                id: "all",
                text: "The whole process, approving any request with no clash and refusing any request with a clash.",
                feedback:
                  "That turns the manager's decision into a rule nobody chose. Requests for family events would be refused automatically, and staff would learn that the process no longer listens. Automate the logging and the clash check, and send the decision to the manager.",
              },
              {
                id: "around",
                text: "The logging and the clash check, then send the manager an approval request showing any clash, and carry out whatever they decide.",
                correct: true,
                feedback:
                  "That is right. The rule steps are automated and the judgement about clashes stays with the manager, who now gets each request with the clash already found.",
              },
              {
                id: "none",
                text: "Nothing, because the process contains a judgement step and so cannot be automated.",
                feedback:
                  "A judgement step does not rule out the whole task. Most tasks mix the two, and the useful move is to automate the rule steps around the decision, which would still save Leah most of the time.",
              },
            ],
          },
          {
            id: "complaints",
            situation:
              "Ravi Desai, customer services team lead at Linton Dental Group, has written this description for a colleague to build: 'Whenever a complaint comes in, log it and tell the right person.' Complaints arrive through the website form and the reception inbox.",
            question: "What should Ravi do before the colleague starts building?",
            options: [
              {
                id: "build",
                text: "Let the colleague build it now and correct the details once they see the first version.",
                feedback:
                  "The colleague will have to guess which source, which log and who the right person is, and every guess becomes a decision nobody made. Rewriting the description first costs far less than rebuilding.",
              },
              {
                id: "apps",
                text: "Add the names of the apps involved, such as Forms, Excel and Outlook, so the colleague knows what to connect.",
                feedback:
                  "A list of apps says nothing about what happens between them. The colleague would still need to ask which log, which fields, and how the right person is chosen.",
              },
              {
                id: "rewrite",
                text: "Choose one trigger, name the log and its fields, and write a condition saying who is told for each type of complaint.",
                correct: true,
                feedback:
                  "That is right. Choosing one entry point, naming each place, and writing the routing as a condition turns a wish into a description that is ready to build.",
              },
            ],
          },
          {
            id: "tool",
            situation:
              "Grace Liu, office coordinator at Brennan & Hale Surveyors, wants supplier emails with 'Statement' in the subject moved into a Statements folder and forwarded to the finance assistant. A colleague suggests signing up for a free Zapier account with her work email to do it tonight.",
            question: "Which path should Grace take?",
            options: [
              {
                id: "rule",
                text: "Use a rule in Outlook, which the firm already provides, to move and forward those emails.",
                correct: true,
                feedback:
                  "That is right. An email rule is already approved, has the fewest moving parts, and does every step in the description. A separate connector service would add an account and permissions for no gain.",
              },
              {
                id: "zapier",
                text: "Sign up for the free Zapier account, because it will be quicker to set up tonight.",
                feedback:
                  "An unapproved service would receive the firm's supplier emails, and it is likely to be switched off when IT notices. The firm's own email client can already do this with a rule.",
              },
              {
                id: "make",
                text: "Ask IT for a Make licence, because it can handle more complicated flows later.",
                feedback:
                  "Nothing in the description needs a separate connector service. Choose the simplest approved path that does every step, which here is an Outlook rule.",
              },
            ],
          },
          {
            id: "access",
            situation:
              "Sam Price, operations administrator at Northgate Lettings, is building a flow that saves signed tenancy agreements from the lettings@ mailbox into the Tenancies folder on SharePoint. When he connects SharePoint, the tool asks to read and write all files he can access, and he has access to the HR and payroll folders.",
            question: "What should Sam do?",
            options: [
              {
                id: "accept",
                text: "Accept the permission, because the flow will only ever use the Tenancies folder.",
                feedback:
                  "The flow would still hold access to HR and payroll files, and any mistake in a step, or anyone who edits the flow later, could reach them. Access should match the steps, not the intention.",
              },
              {
                id: "later",
                text: "Accept it for now and ask IT to narrow the permissions once the flow is working.",
                feedback:
                  "Narrowing access after a flow is live is slower and often forgotten. Asking before building takes one message.",
              },
              {
                id: "copy",
                text: "Copy the Tenancies folder into his own OneDrive so the flow only touches his files.",
                feedback:
                  "That moves tenancy agreements out of the place the team relies on and ties the flow to Sam's account. The better move is to ask IT for access that matches the one step.",
              },
              {
                id: "ask",
                text: "Stop and ask IT to run the flow under a service account that can only read lettings@ and write to the Tenancies folder.",
                correct: true,
                feedback:
                  "That is right. Each permission is matched to a step, the rest is refused, and the flow is not tied to Sam's own login.",
              },
            ],
          },
          {
            id: "leaving",
            situation:
              "Fiona Walsh built the purchase order flow at Oakridge Housing two years ago under her own login, and the finance team relies on it every day. She is leaving at the end of next month.",
            question: "What should happen before Fiona leaves?",
            options: [
              {
                id: "password",
                text: "Fiona should give her password to her manager so the flow can keep running under her account.",
                feedback:
                  "Sharing a password breaks almost every organisation's security policy, and her account will be closed anyway. The flow needs to move to an account that exists for the work.",
              },
              {
                id: "move",
                text: "Move the flow to a service account with only the access it needs, name a new owner and a deputy, and update the failure note.",
                correct: true,
                feedback:
                  "That is right. The flow stops depending on one person, the new owner knows it is theirs, and the failure note tells the team what to do if the move breaks anything.",
              },
              {
                id: "wait",
                text: "Leave it as it is and rebuild it if it stops working after she has gone.",
                feedback:
                  "When her account is closed the flow will stop, probably without telling anyone, and finance will find out when purchase orders go missing. Moving it now is planned work rather than a rescue.",
              },
            ],
          },
          {
            id: "tests",
            situation:
              "Chris Bell, events coordinator at Marlow Community Trust, has built a flow that adds workshop bookings to the attendance sheet and emails a joining link. He tested it with three complete bookings he typed in himself, and all three showed success in the run history. He wants to switch it on tomorrow.",
            question: "What should Chris do before switching it on?",
            options: [
              {
                id: "real",
                text: "Run it on real bookings from last month: a normal one, one with a missing email, one submitted twice, and an unusual one, and check the sheet and the emails for each.",
                correct: true,
                feedback:
                  "That is right. Three typed-in complete bookings are three normal cases. Real cases of each kind, checked in the places the steps write to, will show the quiet failures that the run history cannot.",
              },
              {
                id: "more",
                text: "Run ten more complete bookings to be sure the flow is reliable.",
                feedback:
                  "Ten more normal cases will produce ten more green ticks. The problems are in the missing, duplicate and unusual cases, so those are the ones to run.",
              },
              {
                id: "live",
                text: "Switch it on, because the run history shows no errors, and watch the run history for the first week.",
                feedback:
                  "The run history only shows failures the tool can see. A duplicate booking or a missing email can be handled wrongly while every run shows success.",
              },
            ],
          },
          {
            id: "quiet",
            situation:
              "The training tracker at Oakridge Housing stopped growing three weeks ago after someone added a question to the request form, and nobody noticed until a manager chased a booking. The flow's failure note says: 'Owner: Priya. The tool emails Priya if a run fails.'",
            question: "What is the most useful thing to add to the failure note?",
            options: [
              {
                id: "screens",
                text: "Screenshots of each step of the flow, so the next person can see how it was built.",
                feedback:
                  "A screenshot helps someone repair the flow once they know it is broken. It would not have told anyone that the tracker had stopped growing.",
              },
              {
                id: "alerts",
                text: "A second email address for the tool's failure alerts, so both Priya and her manager receive them.",
                feedback:
                  "The flow did not fail a run. It stopped being triggered correctly, so there was no alert to send. More recipients of the same alert would still have heard nothing.",
              },
              {
                id: "weekly",
                text: "A weekly check by the team administrator that the number of form responses matches the number of new rows in the tracker.",
                correct: true,
                feedback:
                  "That is right. A check a person does without the tool catches failures the tool cannot see, and a weekly count would have found this problem in days rather than weeks.",
              },
            ],
          },
          {
            id: "golive",
            situation:
              "Helen Carr's test log shows that the invoice flow saved a delivery note as if it were an invoice when an email had two PDFs. Her manager wants the flow switched on this Monday and suggests fixing that case later, because it is rare.",
            question: "What should Helen do?",
            options: [
              {
                id: "later",
                text: "Switch it on Monday and note the two PDF case as a known issue to fix next month.",
                feedback:
                  "A known case that sends finance a delivery note to pay will happen in live work, and a note in a log does not stop it. Fix it first, or keep that case out of the flow.",
              },
              {
                id: "fix",
                text: "Add a condition that only posts files with 'invoice' in the name, rerun the two PDF case, and record the passing result before Monday.",
                correct: true,
                feedback:
                  "That is right. The fix is a condition, and the rerun proves it works. The test log now shows the failure and what was done about it, which gives finance a reason to trust the flow.",
              },
              {
                id: "remove",
                text: "Remove the two PDF case from the test log, because it is unlikely to happen often.",
                feedback:
                  "Removing a failed case hides the problem without fixing it, and the log becomes a record nobody can trust. An honest log with the fix and the rerun is worth more.",
              },
            ],
          },
        ],
        why: "You applied the method across the whole course: keeping judgement with people, describing tasks so they can be built, choosing approved tools with only the access they need, testing on real cases of every kind, and writing failure notes that work when you are away.",
      },
      bridge:
        "You have shown that you can apply the method to new cases. In the last lesson you write the automation note for your own automation, and that note goes on your record.",
    },
    {
      id: "your-automation-note",
      title: "Your automation note",
      emphasis: "note",
      place:
        "This is the final lesson of the course. The note you write here describes a real automation you have built and tested, and it is what appears on your signed record.",
      sections: [
        {
          heading: "What the automation note is",
          paragraphs: [
            "The automation note is one page that describes a real automation you have built and tested, written so that a colleague could understand it, check it, and look after it without you. It brings together the work of every lesson in the course: the description from Lesson 2, the access from Lesson 3, the test log from Lesson 4, and the failure note from Lesson 5.",
            "It is not a screenshot of the flow. A screenshot shows how the automation was configured, but it does not tell a colleague why it was built that way, what it was tested against, or what to do when it fails. The note is the document someone would want in their hand if they inherited your automation next month.",
          ],
        },
        {
          heading: "The four sections",
          paragraphs: [
            "The note has four sections. The Description gives the trigger, the steps with the places they read from and write to, and at least one condition. The Access names the account the automation runs under and what it can reach, and says what it was not given, or that it asked for nothing more than it needed. The Test log records four real cases, one of each kind, and whether each was handled correctly or handled wrongly.",
            "The Failure note has all five parts from Lesson 5: what it does, how we know it stopped, who owns it and who covers, what people do by hand, and how to switch it off. The how we know part must include a check a person can do without relying on the automation's own error messages.",
          ],
        },
        {
          heading: "An honest test log",
          paragraphs: [
            "If your testing found a case that was handled wrongly, the note must say what you changed and show the case passing afterwards. This is not an admission of failure. A log that records two problems and the fix for each gives a colleague far more confidence than a log of four passes, because it shows the awkward cases were actually tried.",
            "Use real cases, but do not put anything confidential into the note. It will appear on a record that another person can open, so describe the cases by their kind and outcome, such as a response with no email address, rather than copying a customer's name or details.",
          ],
        },
        {
          heading: "How the note is checked",
          paragraphs: [
            "The test for every line of the note is the same test you have used all course. A line is one where A colleague could use this when they could act on it as it stands. A line is one where A colleague would have to ask when it leaves them needing to find you. 'Runs under the finance-flows service account' is something a colleague could use; 'runs under the usual account' is something they would have to ask about.",
            "When you continue, each section is checked for its substance. The Description must name a trigger and a real place. The Access must name the account and set a limit on what it can reach, using words such as only, never, or do not. The Test log must include the duplicate case. The Failure note must say how someone will notice that the automation has stopped. If a section falls short, the note names it and says what to add, and when every section passes you sign your name against it.",
          ],
        },
      ],
      workedExample: {
        title: "The training request automation note",
        inputLabel: "The automation Priya built",
        outputLabel: "Her automation note",
        prompt:
          "Priya Nair's training request flow at Oakridge Housing, built in Power Automate from the description in Lesson 2 and tested on four requests from last month.",
        output:
          "Description: Trigger: a new response to the Training Request form in Microsoft Forms. Step one: add a row to the Requests table in the Training Tracker workbook. Step two: send Priya an approval request in Teams. Condition: if approved, email the manager the confirmation from the training@ mailbox; if rejected, send the standard reply with her comment. Condition: if the email field is empty, stop and email Priya.\nAccess: runs under the training-flows service account, not Priya's login. It can only read the Training Request form, write to the Training Tracker workbook, send from training@ and post approvals in Teams. It was not given access to Priya's mailbox or OneDrive.\nTest log: Normal: handled correctly. Missing email: stopped and emailed the coordinator, handled correctly. Duplicate: first run created two rows; I added a condition that checks for an existing row with the same email and course in the same month, and the rerun created one row, handled correctly. Unusual, a request for two courses in one response: handled wrongly, only the first course was recorded; the form now allows one course per response and says so, and the rerun was handled correctly.\nFailure note: What it does: logs training requests and sends confirmations after Priya approves. How we know it stopped: the tool emails Priya when a run fails, and every Monday the team administrator checks that last week's form responses match the new rows in the tracker. Owner: Priya Nair, and Joe Hart covers when she is away. By hand: copy new responses into the tracker each morning and send confirmations from training@. Switch it off: open the flow in Power Automate and choose Turn off; nothing else depends on it.",
        reading: [
          "Every section could be used by a colleague who has never opened the flow. The Description names each place, and the Access says exactly what the service account can reach and what it was refused.",
          "The Test log records two failures honestly, the duplicate and the two course request, and says what was done about each, followed by a passing rerun. That gives a colleague far more confidence than a log of four passes would.",
          "The Failure note gives a named person a weekly check that does not depend on the tool, so a quiet failure would be found within a week.",
        ],
      },
      practice: {
        intro:
          "Before you write your own note, read four lines from a colleague's draft and mark each one. The section above on how the note is checked defines both labels, and your repaired failure note from Lesson 5 is a good model for the last part.",
        check: {
          kind: "mark",
          prompt: "Mark each line of this draft automation note with the label it deserves.",
          passLabel: USABLE,
          failLabel: ASK,
          sentences: [
            {
              id: "description",
              text: "Description: Trigger: a new file arrives in the Signed Contracts folder in the Legal SharePoint library. Step one: post a link in the Contracts Teams channel.",
              fail: false,
              why: "It names the trigger, the folder and the channel, so a colleague could use this as it stands.",
            },
            {
              id: "access",
              text: "Access: the usual account.",
              fail: true,
              why: "A colleague would have to ask which account that is and what it can reach.",
            },
            {
              id: "tests",
              text: "Test log: tested and working.",
              fail: true,
              why: "It records no cases and no results, so a colleague would have to ask what was tried and what happened.",
            },
            {
              id: "off",
              text: "Switch it off: open the flow in Power Automate and choose Turn off; nothing else depends on it.",
              fail: false,
              why: "It says where to go and what to press, so a colleague could use this without finding you.",
            },
          ],
          why: "That is right. The description and the switch-off line can be acted on as they stand. 'The usual account' and 'tested and working' would leave a colleague needing to find the author.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the automation note for the automation you built. Include all four sections, so that a colleague could look after it without asking you what you meant.",
        fields: [
          {
            id: "description",
            label: "Description",
            hint: "The trigger, each step with the place it reads from or writes to, and at least one condition.",
            min: 80,
            rule: "fact",
            any: ["trigger"],
            missing:
              "The Description does not yet name its trigger and a real place. Start with 'Trigger:' and the event, then give each step with the named form, folder, list or mailbox it uses, and at least one condition.",
          },
          {
            id: "access",
            label: "Access",
            hint: "The account it runs under, what it can reach, and what it was not given.",
            min: 40,
            rule: "limit",
            any: ["account"],
            missing:
              "The Access section needs to name the account the automation runs under and set a limit on what it can reach, for example 'It can only read the invoices@ mailbox and does not have access to my own files.'",
          },
          {
            id: "tests",
            label: "Test log",
            hint: "Four real cases: normal, missing field, duplicate and unusual, each handled correctly or handled wrongly, with any fix and rerun.",
            min: 120,
            any: ["duplicate", "submitted twice", "sent twice"],
            missing:
              "The test log has no duplicate case. Record four real cases, a normal one, a missing field, a duplicate and an unusual one, and say whether each was handled correctly or handled wrongly.",
          },
          {
            id: "failure",
            label: "Failure note",
            hint: "What it does, how we know it stopped, the owner and who covers, what to do by hand, and how to switch it off.",
            min: 150,
            any: ["how we know", "we will know", "notice", "check"],
            missing:
              "The failure note does not say how anyone will know it has stopped. Add a check a person can do without the automation tool, and make sure the owner, the cover, the manual step and how to switch it off are all there.",
          },
        ],
        why: "Your note describes the trigger, steps and conditions, names the account and its access, records four real cases, and gives a colleague what they need when it breaks.",
      },
      bridge:
        "Your signed note is on your record. Save a copy beside the automation itself, so the next person to open it finds the note first.",
    },
  ],
};
