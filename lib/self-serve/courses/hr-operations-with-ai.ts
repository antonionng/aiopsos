/*
Course: HR Operations with AI
Slug: hr-operations-with-ai
For: HR administrators, people operations staff, HR shared service teams, and HR advisers who carry out
  repeating operational work such as offer letters, contract changes, onboarding, policy queries, and
  leaver processes. They know the steps of at least one operation and which AI tool their organisation
  has approved. They need no automation or technical skills.
Outcome: The learner chooses one repeating HR operation, marks which single step a model may take and
  which steps a person keeps, decides which fields may go into the approved tool, writes the check that
  follows the model's step, and writes a failure note that says how an error is caught and who is told.
  A colleague could follow the resulting workflow without asking them anything.
Artefact: The workflow, a written procedure for one HR operation with one checked AI step.
Record sentence: Wrote and signed a workflow for one HR operation with a single checked AI step, a named
  check against a source of truth, and a failure note a colleague could follow.
Lessons (id, title, move, interaction, pass rule):
  1. one-operation, One operation, choose an operation with a defined input, output, and source of truth,
     choose, the pass is Operation B, the one with all three features.
  2. the-step-a-model-may-take, The step a model may take, mark each step with the two labels, mark,
     every step marked correctly (drafting and summarising to the model, pay, access, and decisions kept).
  3. what-goes-into-the-tool, What goes into the tool, limit the fields that go into the approved tool,
     edit, the edit keeps the step and the tool, adds a placeholder, and has limit sentences naming the
     fields allowed and the fields that stay out.
  4. the-step-a-person-keeps, The step a person keeps, write the check after the model's step, edit,
     the edit names a checker by role, salary, start date, job title, hours, the source, and the action
     on a mismatch, and keeps the model and sending steps.
  5. when-it-goes-wrong, When it goes wrong, tell a sentence that catches an error from one that hopes,
     mark, every sentence of the failure note marked correctly.
  6. course-assessment, Course assessment, apply every move to new situations, scenario, six of seven.
  7. the-workflow, The workflow, write the workflow, build, every field meets its rule or its word list.
Sources: GOV.UK, An employer's guide to right to work checks (Home Office). Acas advice on changing an
  employment contract. The ICO, Personal data breaches: a guide. The ICO, Guidance on AI and data
  protection. The ICO, Employment practices and data protection guidance on keeping employment records.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const GOOD_OPERATION = "A good first operation";
const NOT_OPERATION = "Not a good first operation";
const MODEL = "A model may take it";
const PERSON = "A person keeps it";
const GOES_IN = "May go into the tool";
const STAYS_OUT = "Stays out of the tool";
const CAUGHT = "Says how the error is caught";
const HOPES = "Hopes the error will not happen";
const READY = "Ready to follow";
const ASK = "A colleague would have to ask";

export const COURSE: CourseContent = {
  slug: "hr-operations-with-ai",
  hours: 2,
  artefact: {
    lessonId: "the-workflow",
    title: "The workflow",
    recordLine:
      "Wrote and signed a workflow for one HR operation with a single checked AI step, a named check against a source of truth, and a failure note a colleague could follow.",
  },
  lessons: [
    {
      id: "one-operation",
      title: "One operation",
      emphasis: "operation",
      place:
        "This is the first of seven lessons. It chooses the one HR operation that the whole course will work on, so that every later lesson has a real piece of your work to act on.",
      sections: [
        {
          heading: "What an HR operation is",
          paragraphs: [
            "An HR operation is a piece of work that repeats, follows the same steps each time, and produces a defined output. The contract variation letter that follows a change of hours is an operation. So is the reply to a common policy query, the onboarding pack for a new starter, and the leaver checklist. You could describe last week's instance and next week's instance in the same words, and only the details would change.",
            "This course works on one operation at a time. A change to one operation can be written down, tried on a real case, checked, and reviewed after a set number of runs. When a team is asked to use AI to speed up the admin, the pull is to start everywhere at once. A general intention cannot be followed by a colleague on a busy Monday, whereas a written workflow for one operation can.",
          ],
        },
        {
          heading: "Three features of a good first operation",
          paragraphs: [
            "The first feature is a defined input. You know exactly what information arrives each time and in what form, such as the manager's approved change form, the new starter record in the HR system, or the employee's emailed question. If the input changes shape from one case to the next, nobody can say in advance what the model will be given.",
            "The second feature is a defined output. You know what a correct result looks like, usually because there is a template, a standard letter, or a checklist that every case ends in. If nobody can say what a correct output is, nobody can say when the model's output is wrong.",
            "The third feature is a source of truth. This is the place where the correct facts can be checked, such as the HR system, the policy, the signed form, or the contract. It is the most important of the three, because every later step in this course compares the model's work with it.",
            "In this lesson, an operation that has all three features is labelled A good first operation. An operation that is missing any one of them is labelled Not a good first operation. The second label is not a judgement that the work is unimportant. It means only that this is not the place to put your first AI step.",
          ],
        },
        {
          heading: "What an operation is not",
          paragraphs: [
            "An operation is not a whole area of HR, such as recruitment, employee relations, or absence management. An area contains many operations, each with its own input and output, and it has no single place where the right answer can be checked. Inside recruitment you might find the interview invitation, the offer letter, and the rejection email, and each of those could be an operation.",
            "An operation is also not a one-off project, such as moving to a new HR system or rewriting the handbook. A project happens once, so there is no second run on which to find out whether the change worked.",
            "Finally, an operation is not a case. A grievance, a disciplinary investigation, or a decision on a flexible working request each turns on judgement about particular people and particular circumstances. Some of these arrive in high volume, but volume does not change what they are. They do not make a good first AI step, whatever the pressure on the team.",
          ],
        },
        {
          heading: "Why the choice matters, and the usual mistake",
          paragraphs: [
            "The operation you choose decides how an error will be found. When a contract variation letter is wrong, the error can be found by laying the letter beside the approved form and reading across. When a reply about employee relations is wrong, there is nothing to lay it beside, and the error is found by the employee.",
            "The usual mistake is to choose the most painful area rather than the most checkable operation. Absence management often feels like the right place to start because it takes the most time, but it has no single output and its hardest parts are judgements about people. The better start is a smaller operation that happens every week, where a wrong result is easy to see.",
          ],
          beforeAfter: {
            before: "Our first AI step will be in absence management.",
            after:
              "Our first AI step will be in the return-to-work meeting invitation. The input is the absence record in the HR system, the output is the standard invitation email, and the source of truth is the absence record and the absence policy.",
            reading:
              "The first sentence names an area. The second names one operation inside it and gives its input, its output, and its source of truth, so anyone could check the result.",
          },
        },
      ],
      workedExample: {
        title: "Three candidates for a first AI step",
        inputLabel: "The candidates Leanne wrote down",
        outputLabel: "Her reading against the three features",
        prompt:
          "Leanne Ashworth is an HR administrator at Fernleigh Care Group. Her manager has asked her to choose one piece of work for a first AI step.\n\nCandidate 1: Handle employee relations queries.\nCandidate 2: Produce the contract variation letter when a manager's approved change form arrives.\nCandidate 3: Decide whether flexible working requests should be approved.",
        output:
          "Candidate 1: no defined input, no defined output, and no single source of truth. Not a good first operation.\nCandidate 2: the input is the approved change form, the output is the variation letter from the template, and the source of truth is the form and the HR system. A good first operation.\nCandidate 3: each request turns on judgement about one person's circumstances. Not a good first operation.",
        reading: [
          "Candidate 1 is an area of work. Queries arrive by email, by phone, and in person, they cover dozens of subjects, and there is no template that every answer ends in. Leanne could not say in advance what a correct result looks like, so she could not say when a model's result was wrong.",
          "Candidate 2 has all three features. The change form arrives in the same format each time, the letter follows the template, and every fact in the letter can be checked against the form and the HR system. It happens most weeks at Fernleigh, so the workflow will be tested quickly on real cases.",
          "Candidate 3 has a defined input, the request form, but the step that matters is a decision about a person. That is a case, and a case is not the place for a first AI step. Leanne chooses Candidate 2.",
        ],
      },
      practice: {
        intro:
          "Mark each candidate below with one of the two labels from this lesson. The three features, a defined input, a defined output, and a source of truth, are in the section above if you want to read them again.",
        check: {
          kind: "mark",
          prompt: "Mark each candidate as A good first operation or as Not a good first operation.",
          passLabel: GOOD_OPERATION,
          failLabel: NOT_OPERATION,
          sentences: [
            {
              id: "reference",
              text: "Producing the factual reference letter from the HR system when another employer asks for a former employee's dates of employment and job title.",
              fail: false,
              why: "The input is the reference request, the output is the standard factual letter, and the dates and job title can be checked against the HR system. It is a good first operation.",
            },
            {
              id: "wellbeing",
              text: "Improving wellbeing across the organisation.",
              fail: true,
              why: "This is a whole area of work with no defined input, no defined output, and no source of truth to check against, so it is not a good first operation.",
            },
            {
              id: "disciplinary",
              text: "Deciding the outcome of a disciplinary hearing.",
              fail: true,
              why: "This is a case that turns on judgement about one person, so it is not a good first operation, however often hearings happen.",
            },
          ],
          why: "That is right. The reference letter has a defined input, a defined output, and a source of truth. Wellbeing is an area, and a disciplinary outcome is a judgement about a person.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two HR advisers describe the operation they want to use for a first AI step. Choose the one that follows this lesson.",
        leftLabel: "Operation A",
        left: "Improving how we manage absence across the business.",
        rightLabel: "Operation B",
        right:
          "Sending the right-to-work document request to each new starter. The input is the new starter record in the HR system. The output is the standard request email with the list of acceptable documents. The source of truth is the Home Office employer guide and our starter record.",
        correct: "right",
        why: "Operation B is right. It has a defined input in the starter record, a defined output in the standard request email, and a source of truth in the Home Office guide and the record, so any error in the email can be found by reading across to them.",
        wrong:
          "Look again at Operation A. Improving absence management is a whole area of work with no defined input, output, or source of truth. Operation B names all three, so it is the one to choose.",
      },
      bridge:
        "With the operation chosen, the next lesson lists its steps one by one and decides which single step a model may take.",
    },
    {
      id: "the-step-a-model-may-take",
      title: "The step a model may take",
      emphasis: "model",
      place:
        "This is the second of seven lessons. You now have one operation. This lesson looks at its steps one at a time and decides where a model may help and where a person must stay in charge.",
      sections: [
        {
          heading: "Two labels for every step",
          paragraphs: [
            "In this course, a step is marked A model may take it when three conditions hold. The input to the step is information your organisation allows in the approved tool. The output is text that a person will read before it goes anywhere. An error in that output could be caught by comparing it with the source of truth you named in the first lesson.",
            "A step is marked A person keeps it when any one of those conditions fails. It is also marked A person keeps it when the step is a decision, a change to a record, or an action with a legal deadline or a legal effect, even if the three conditions appear to hold. Those steps stay with a person because their result reaches an employee, a system, or a payslip without anyone reading it first.",
          ],
        },
        {
          heading: "What a model usually takes",
          paragraphs: [
            "In most HR operations the step a model may take is drafting. That means turning approved facts into the words of a letter, summarising a long policy into a short reply, or filling a template from a form. Each produces text, each is read before it is used, and each can be checked line by line against the form or the policy.",
            "This course gives the model one step in each workflow for the first version. One step is enough to save real time, and it keeps the check that follows it simple to write and simple to carry out. A second step can be added after a review, once the first has been run on real cases.",
            "The line drawn here is not a statement that a model is unreliable at everything else. It is drawn so that every error a model could make lands in front of a person before it lands on an employee.",
          ],
        },
        {
          heading: "What a person keeps",
          paragraphs: [
            "The steps a person keeps usually include approving a change, updating the HR or payroll system, confirming right to work, and sending anything that changes a person's terms. Approving is a decision. Updating a system changes a record that drives pay, holiday, or access. Sending a letter that varies a contract changes what the employee has been told.",
            "Right to work is a clear example. The Home Office guidance on GOV.UK, An employer's guide to right to work checks, sets out how an employer carries out the check, and it is a check a person does with the documents in front of them. A model may draft the email asking a new starter to bring their documents. It does not confirm that the documents are acceptable.",
          ],
          beforeAfter: {
            before: "Step 4: the model updates the new hours in the HR system.",
            after:
              "Step 4: the HR administrator updates the new hours in the HR system from the approved change form.",
            reading:
              "The first version gives the model a change to a record that drives pay. The second gives it back to a person and names the source they work from.",
          },
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The usual mistake is to mark a step by how tedious it is. Keying new hours into payroll is repetitive, so it feels like the obvious step to hand over, but it changes what someone is paid and nobody reads the result before it takes effect. Tedium is a reason to look at a step, and it is never the reason to give it to a model.",
            "The second mistake is to leave two actions inside one step. 'The model drafts and sends the letter' mixes a step a model may take with a step a person keeps. Split it into two steps, mark each one, and the problem becomes visible.",
          ],
        },
      ],
      workedExample: {
        title: "The contract variation operation, step by step",
        inputLabel: "The six steps Leanne wrote down",
        outputLabel: "The steps, marked",
        prompt:
          "1. The manager's change form arrives.\n2. The HR administrator checks the form has been approved by the budget holder.\n3. The HR administrator drafts the variation letter.\n4. The HR administrator updates the hours and pay in the HR system.\n5. The letter is sent to the employee for signature.\n6. The signed letter is filed.",
        output:
          "1. The form arrives. Not a task for either; it is the input.\n2. Checking approval: A person keeps it.\n3. Drafting the letter: A model may take it, using only the fields the approved tool allows.\n4. Updating the HR system: A person keeps it.\n5. Sending the letter: A person keeps it.\n6. Filing the signed letter: A person keeps it.",
        reading: [
          "Drafting the letter is the step a model may take. Its output is a draft that someone will read, and any error in it can be caught by comparing the letter with the approved form. It holds only if the form's details are allowed in the approved tool, which is the subject of the next lesson.",
          "Checking approval is a decision about whether the change may go ahead, and updating the HR system changes a record that drives pay. Both stay with a person, however routine they feel.",
          "Sending and filing also stay with a person. Sending the letter changes what the employee has been told about their terms, and filing is the moment the signed letter becomes the record.",
        ],
      },
      practice: {
        intro:
          "These are three steps from an onboarding operation. Mark each one with the two labels. The three conditions and the list of steps a person keeps are in the sections above.",
        check: {
          kind: "mark",
          prompt: "Mark each onboarding step as A model may take it or as A person keeps it.",
          passLabel: MODEL,
          failLabel: PERSON,
          sentences: [
            {
              id: "welcome",
              text: "Draft the welcome email from the template, using the start date and team name in the new starter record.",
              fail: false,
              why: "This is drafting from a template, the email will be read before it is sent, and the start date and team can be checked against the record. A model may take it.",
            },
            {
              id: "payroll",
              text: "Create the new starter's record in the payroll system.",
              fail: true,
              why: "This changes a record that drives pay, so a person keeps it.",
            },
            {
              id: "rtw",
              text: "Check the new starter's original right-to-work documents.",
              fail: true,
              why: "Confirming right to work is a check with a legal effect that a person carries out with the documents, so a person keeps it.",
            },
          ],
          why: "That is right. The welcome email is a draft that can be read and checked, while the payroll record and the right-to-work check both stay with a person.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These are the steps of a leaver process at Castleford Logistics. Mark each as a step a model may take or a step a person keeps.",
        passLabel: MODEL,
        failLabel: PERSON,
        sentences: [
          {
            id: "acknowledge",
            text: "Draft the acknowledgement of resignation letter from the template, using the leaving date on the manager's form.",
            fail: false,
            why: "This is drafting from a template, and the date can be checked against the form. A model may take it.",
          },
          {
            id: "holiday-pay",
            text: "Calculate the final holiday pay owed.",
            fail: true,
            why: "A holiday pay calculation changes what the person is paid. A person keeps it, using the payroll system and the policy.",
          },
          {
            id: "access",
            text: "End the employee's system access on their last day.",
            fail: true,
            why: "Ending access is an action on a system, not a piece of text to read. A person keeps it.",
          },
          {
            id: "return-list",
            text: "Summarise the leaver policy into a short list of what the leaver needs to return.",
            fail: false,
            why: "This is a summary of policy text that a person will check against the policy before it is sent. A model may take it.",
          },
          {
            id: "pilon",
            text: "Decide whether to pay the leaver in lieu of notice.",
            fail: true,
            why: "Paying in lieu of notice is a decision about the person's contract. A person keeps it.",
          },
        ],
        why: "You gave the model the drafting and the summary, and kept the pay, the access, and the decision with a person. Each step you gave the model produces text that someone reads and can check against the form or the policy.",
      },
      bridge:
        "Drafting the letter is safe only if the right information goes into the tool, and the next lesson decides which fields of the input may go in.",
    },
    {
      id: "what-goes-into-the-tool",
      title: "What goes into the tool",
      emphasis: "tool",
      place:
        "This is the third of seven lessons. You know which step a model may take. This lesson decides exactly which pieces of the input go into the approved tool for that step, and which stay out.",
      sections: [
        {
          heading: "The input decides what can go wrong",
          paragraphs: [
            "Whatever you paste into the tool, the model can use. If the whole change form goes in, every field on it is available to appear in the letter, including fields the letter should never mention. If only the fields the letter needs go in, the model has nothing else to draw on.",
            "Each field on the input therefore has to pass two questions before it goes in. The first is whether your organisation's rules for the approved tool allow that kind of information in it. The second is whether the draft actually needs it. A field goes in only when the answer to both is yes.",
          ],
        },
        {
          heading: "Two labels for each field",
          paragraphs: [
            "In this lesson, a field is marked May go into the tool when your organisation allows it in the approved tool and the draft needs it. For a contract variation letter, that is usually the job title, the new hours, the new pay, and the effective date.",
            "A field is marked Stays out of the tool when either answer is no. Health information, bank details, National Insurance numbers, and identity document numbers stay out. So does the reason for a change when that reason is personal, such as a phased return after an illness, because the letter needs the new terms and not the story behind them.",
            "The employee's name usually stays out as well. The draft does not need it, so a placeholder such as [Employee name] goes in instead, and the person who checks the letter fills in the name from the form. This costs a few seconds and means the tool never holds the name alongside the new pay.",
          ],
        },
        {
          heading: "What this is not",
          paragraphs: [
            "This is not a legal assessment, and it does not replace your organisation's rules on the approved tool. Those rules decide what is allowed. This lesson adds the second question, whether the draft needs the field, which is the same idea the ICO describes as data minimisation in its Guidance on AI and data protection: use the personal data that is necessary for the purpose, and no more.",
            "It is also not a requirement to make the whole case anonymous. You are not rewriting the form. You are choosing which lines of it to copy, and writing that choice into the workflow so that a colleague makes the same choice on a day you are away.",
          ],
          beforeAfter: {
            before: "Paste the change form into the assistant and ask for the variation letter.",
            after:
              "Paste only the job title, new hours, new pay, and effective date into the assistant, with [Employee name] as a placeholder. Do not paste the reason for the change, the National Insurance number, or bank details.",
            reading:
              "The first version lets every field on the form reach the model. The second names the fields that go in and the fields that stay out, in sentences that begin with only and do not.",
          },
        },
        {
          heading: "Why it matters, and the usual mistake",
          paragraphs: [
            "The usual mistake is to paste the whole form because it is quicker and the model seems to write a better letter with more to go on. It does write a fuller letter, and that is exactly the problem. A model that is given the reason for a change will often mention it, because letters of that kind sometimes do.",
            "A letter that mentions an employee's surgery, sent to their home address and filed on their record, has put health information where it does not belong. The fix is not in the letter. It is in the step that decides what the model was given.",
          ],
        },
      ],
      workedExample: {
        title: "The whole form went in",
        inputLabel: "What Owen pasted into the assistant",
        outputLabel: "What the model wrote",
        prompt:
          "Owen Price is an HR administrator at Kestrel Water Services. He pasted the whole change form into the approved assistant.\n\nEmployee: Joanne Hale\nPayroll number: 40217\nJob title: Customer Services Adviser\nNew contracted hours: 22.5 a week\nNew pay: pro rata to the new hours\nEffective date: 3 November\nReason for change: phased return after surgery, agreed with occupational health\nBank details: on file\n\nDraft the contract variation letter.",
        output:
          "Dear Joanne, following your recent surgery and the advice of occupational health, I am writing to confirm that your contracted hours as Customer Services Adviser will reduce to 22.5 a week from 3 November, with your pay adjusted pro rata.",
        reading: [
          "The job title, the hours, the pay basis, and the date are all correct, and they are all fields the letter needs.",
          "The opening clause comes from the reason for the change. Owen never asked for it to be mentioned, but it was in the input, and letters about reduced hours sometimes explain why. The letter now carries health information that did not need to be there.",
          "The fix is in the input. Owen's revised step pastes only the job title, new hours, new pay, and effective date, uses [Employee name] as a placeholder, and says that the reason for the change, the payroll number, and bank details do not go in.",
        ],
      },
      practice: {
        intro:
          "These are four lines from a change form at Kestrel Water Services. Mark each one with the two labels from this lesson. Remember that a field goes in only when it is allowed and the letter needs it.",
        check: {
          kind: "mark",
          prompt: "Mark each field as May go into the tool or as Stays out of the tool.",
          passLabel: GOES_IN,
          failLabel: STAYS_OUT,
          sentences: [
            {
              id: "hours",
              text: "New contracted hours: 30 a week.",
              fail: false,
              why: "The letter needs the new hours, and they are the kind of contract detail the approved tool allows, so they may go into the tool.",
            },
            {
              id: "reason",
              text: "Reason for change: phased return after an operation.",
              fail: true,
              why: "This is health information, and the letter does not need the reason to state the new terms, so it stays out of the tool.",
            },
            {
              id: "date",
              text: "Effective date: 3 November.",
              fail: false,
              why: "The letter needs the date the change takes effect, so it may go into the tool.",
            },
            {
              id: "ni",
              text: "National Insurance number: on the form.",
              fail: true,
              why: "A National Insurance number is never needed to draft the letter, so it stays out of the tool.",
            },
          ],
          why: "That is right. The hours and the date are what the letter needs. The reason for the change and the National Insurance number stay out, because the letter does not need them.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "Step 3 of this workflow at Linton Engineering sends the whole change form into the assistant. Edit the steps so that step 3 says which fields may go in, uses a placeholder for the name, and says which fields stay out. Keep the assistant, the variation letter, and the check in step 4.",
        label: "The workflow you are editing",
        material: {
          label: "The change form",
          text: "Employee name, payroll number, job title, new hours, new pay, effective date, reason for the change (a phased return after illness), National Insurance number, and bank details.",
        },
        start:
          "Step 3: the HR administrator copies the whole change form into the approved assistant and asks it to draft the variation letter.\nStep 4: the HR administrator compares the letter with the change form before it is sent.",
        unchanged:
          "You have not changed the steps yet. Rewrite step 3 so that it says which fields go into the assistant, with a sentence that starts with only, and which fields stay out, with a sentence that starts with do not.",
        keep: [
          {
            id: "tool",
            any: ["assistant", "tool"],
            missing: "Keep the approved assistant in step 3, so a colleague knows which tool the step uses.",
          },
          {
            id: "letter",
            any: ["variation letter", "letter"],
            missing: "Keep the variation letter in step 3, so the step still says what the model drafts.",
          },
          {
            id: "check",
            any: ["compares", "compare", "check"],
            missing: "Keep the check in step 4. The letter still has to be compared with the change form before it is sent.",
          },
          {
            id: "placeholder",
            any: ["placeholder", "[employee name]", "[name]"],
            missing:
              "Say that the name goes in as a placeholder, such as [Employee name], and is filled in by the person who checks the letter.",
          },
        ],
        limits: [
          {
            id: "allowed",
            any: ["job title", "hours", "effective date", "new pay", "rate of pay", "pay rate"],
            missing:
              "Name the fields that may go in, in a sentence that starts with only, such as 'Only the job title, new hours, new pay, and effective date go into the assistant.'",
          },
          {
            id: "excluded",
            any: ["reason", "health", "illness", "medical", "national insurance", "bank", "payroll number"],
            missing:
              "Name the fields that stay out, in a sentence that starts with do not or never, such as 'Do not paste the reason for the change, the National Insurance number, or bank details.'",
          },
        ],
        why: "That edit works. Step 3 now names the fields the letter needs, uses a placeholder for the name, and says that the reason for the change and the identifying numbers stay out, so the model has nothing to draw on that the letter should not contain.",
        result: {
          label: "Step 3 as a colleague would now read it",
          text: "Step 3: the HR administrator pastes only the job title, new hours, new pay, and effective date into the approved assistant, with [Employee name] as a placeholder, and asks it to draft the variation letter. Do not paste the reason for the change, the payroll number, the National Insurance number, or bank details.",
        },
      },
      bridge:
        "The right fields now go in, but the model can still get them wrong, and the next lesson writes the check that comes straight after its step.",
    },
    {
      id: "the-step-a-person-keeps",
      title: "The step a person keeps",
      emphasis: "person",
      place:
        "This is the fourth of seven lessons. You know which step a model may take and what goes into the tool. This lesson adds the check that a person carries out straight after the model's step.",
      sections: [
        {
          heading: "Every model step is followed by a check",
          paragraphs: [
            "In this course, every step a model takes is followed by a check step that a person keeps. The check has three parts. The checker is named by role, such as the HR administrator who prepared the form. What is checked is named precisely, such as every date, number of hours, rate of pay, and job title in the letter. The source is named, such as the approved change form and the HR system record.",
            "Naming the checker by role rather than by name means the workflow still works when that person is on leave. Naming what is checked means the checker knows where to look. Naming the source means the check is a comparison with something written down, and not a reading of whether the letter seems right.",
          ],
        },
        {
          heading: "What a check is not",
          paragraphs: [
            "A check is not 'review the letter', because that does not say what to look at or against what. It is also not 'check for errors'. The errors a model makes in HR documents are usually plausible, which is what makes them hard to see. A notice period taken from a different kind of contract, a start date one day off, or a clause the template never contained all read naturally.",
            "The check exists to catch exactly those errors, so it has to name the facts where they occur. A reader looking for errors in general will pass a letter that reads well. A reader comparing each date with the form will stop at the one that does not match.",
          ],
          beforeAfter: {
            before: "Step 4: someone reviews the letter.",
            after:
              "Step 4: the HR administrator compares every date, number of hours, rate of pay, job title, and notice period in the letter with the approved change form and the HR system record.",
            reading:
              "The first version names nobody and no source. The second names the role, the facts to compare, and the two documents to compare them with.",
          },
        },
        {
          heading: "When the check finds a mismatch",
          paragraphs: [
            "A good check also says what happens when a detail does not match. The letter is corrected from the source, not from memory, and the correction is noted on the case. Correcting from memory replaces one unchecked fact with another, and the note means that a pattern of the same error can be seen at review.",
            "If the same kind of mismatch appears more than once, the checker tells the owner of the workflow. That is the signal that the input or the instruction to the model needs to change, which is a better fix than catching the same error every week.",
          ],
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The usual mistake is to check the letter for tone and layout rather than for facts. A checker who reads the letter from top to bottom will notice a clumsy sentence long before they notice that the notice period says three months. Reading across, with the form open beside the letter and each fact compared in turn, is slower for the first few letters and much faster to trust.",
            "It is fine for the person who ran the model to carry out the check, provided the check names what they compare and against which source. What matters is that the comparison is written into the workflow, so that it happens in the same way whoever is on shift.",
          ],
        },
      ],
      workedExample: {
        title: "A workflow with no check",
        inputLabel: "The workflow as first written",
        outputLabel: "The letter from the test run",
        prompt:
          "Step 3: the model drafts the variation letter from the change form.\nStep 4: the letter is sent.",
        output:
          "Dear [Employee name], I am writing to confirm that from 3 November your contracted hours as Warehouse Team Leader will be 30 a week. Your notice period remains three months.",
        reading: [
          "Leanne ran the workflow on a test case at Fernleigh. The hours, the date, and the job title match the form. The notice period of three months is not in the template and not in the form, and the employee's contract says one month.",
          "The workflow had no check step, so the invented notice period would have gone straight to the employee, who could reasonably rely on it.",
          "The revised workflow adds a step between drafting and sending: 'Step 4: the HR administrator compares every date, number of hours, rate of pay, job title, and notice period in the letter with the approved form and the HR system record. Any mismatch is corrected from the form or the system, and noted on the case. Step 5: the letter is sent.'",
        ],
      },
      practice: {
        intro:
          "Two teams have written a check for the same variation letter. Choose the one that follows this lesson. The three parts of a check are in the first section above.",
        check: {
          kind: "choose",
          prompt: "Choose the check step that names the checker, what is checked, and the source.",
          leftLabel: "Check A",
          left: "The HR administrator reviews the letter carefully and checks it for errors before it goes out.",
          rightLabel: "Check B",
          right:
            "The HR administrator compares every date, number of hours, rate of pay, and job title in the letter with the approved change form and the HR system record, and corrects any mismatch from the form.",
          correct: "right",
          why: "Check B names the role, the facts compared, the form and the HR system as the source, and what happens on a mismatch. Check A names a role but not what to compare or against what.",
          wrong:
            "Look again at Check A. Reviewing carefully and checking for errors does not say which facts to compare or which document to compare them with, so a plausible wrong date would pass. Check B names all three parts.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "This workflow for new starter offer letters has a model step but no proper check. Edit it so that step 3 names the checker, what is checked, the source, and what happens when something does not match. Keep the model step and the sending step.",
        label: "The workflow you are editing",
        start:
          "Step 1: the hiring manager's approved offer form arrives.\nStep 2: the model drafts the offer letter from the form and the template.\nStep 3: someone has a look at it.\nStep 4: the letter is sent to the candidate.",
        unchanged:
          "You have not changed the workflow yet. Replace 'someone has a look at it' with a check that names who compares what against which source.",
        limitWording: false,
        keep: [
          {
            id: "model-step",
            any: ["drafts"],
            missing: "Keep step 2, in which the model drafts the offer letter from the form and the template.",
          },
          {
            id: "send",
            any: ["candidate"],
            missing: "Keep the final step, in which the letter is sent to the candidate after the check.",
          },
        ],
        limits: [
          {
            id: "checker",
            any: ["administrator", "hr adviser", "hr advisor", "hr officer", "coordinator", "recruiter"],
            missing: "Name the role that checks the letter, such as the HR administrator or the recruitment coordinator.",
          },
          {
            id: "salary",
            any: ["salary"],
            missing: "Name the salary among the facts the check compares.",
          },
          {
            id: "start-date",
            any: ["start date"],
            missing: "Name the start date among the facts the check compares.",
          },
          {
            id: "job-title",
            any: ["job title"],
            missing: "Name the job title among the facts the check compares.",
          },
          {
            id: "hours",
            any: ["hours"],
            missing: "Name the hours among the facts the check compares.",
          },
          {
            id: "source",
            any: ["against the", "with the approved", "with the offer form", "with the form", "to the approved", "to the offer form"],
            missing:
              "Say what the letter is checked against, such as 'with the approved offer form', so the check is a comparison with a document.",
          },
          {
            id: "mismatch",
            any: ["mismatch", "does not match", "doesn't match", "differs", "corrected", "corrects", "correct it"],
            missing:
              "Say what the checker does if a detail does not match, such as correcting it from the form and noting it on the case.",
          },
        ],
        why: "Your check names who checks, the salary, start date, job title, and hours they compare, the approved offer form they compare them with, and what happens if something does not match. 'Someone has a look at it' has become a step a colleague could carry out.",
        result: {
          label: "Step 3 as a colleague would now read it",
          text: "Step 3: the HR administrator compares the salary, start date, job title, and hours in the letter with the approved offer form. Any mismatch is corrected from the form and noted on the case.",
        },
      },
      bridge:
        "A check can still miss something, and the next lesson writes down what happens on the day an error gets through.",
    },
    {
      id: "when-it-goes-wrong",
      title: "When it goes wrong",
      emphasis: "wrong",
      place:
        "This is the fifth of seven lessons. Your workflow now has a checked AI step. This lesson prepares for the day an error gets past the check, and for the day someone puts the wrong information into the tool.",
      sections: [
        {
          heading: "What a failure note is",
          paragraphs: [
            "A failure note is a short part of the workflow that says what an error from the model's step would look like, how it would be caught if the check missed it, who would be told, and what would be done. It is written in advance, so that the colleague who finds a wrong letter on a Friday afternoon knows what to do without having to decide it on the spot.",
            "A failure note is not a risk register and not a statement of confidence in the tool. It is a set of plain sentences about one operation. Most notes are four or five sentences long.",
          ],
        },
        {
          heading: "Two labels for each sentence",
          paragraphs: [
            "In this lesson, a sentence Says how the error is caught when it names a specific error, a way of noticing it, or an action and the person responsible for it. 'The model may give a start date that differs from the offer form' names an error. 'The administrator compares the start date with the form' names a way of noticing it. 'The recruiter tells the HR manager the same day' names a person and an action.",
            "A sentence Hopes the error will not happen when it expresses confidence, such as 'the tool is very accurate' or 'errors are unlikely', or when it relies on care without saying what care means. Such sentences may be sincere, and they may even be true, but they give the colleague on the Friday afternoon nothing to do.",
          ],
          beforeAfter: {
            before: "The team is experienced and errors in variation letters are unlikely.",
            after:
              "If a signed letter does not match the HR system at filing, the administrator who files it tells the HR manager the same day, and the HR manager writes to the employee with a corrected letter.",
            reading:
              "The first version is a hope. The second names how the error is noticed, who is told, when, and what is done.",
          },
        },
        {
          heading: "When personal data goes into the tool by mistake",
          paragraphs: [
            "A good failure note also says what happens if someone pastes more than the approved fields into the tool, such as a whole sickness record. That may be a personal data breach, and it is for your organisation's data protection lead to assess, not for the person who made the mistake to judge on their own.",
            "The ICO's guide, Personal data breaches: a guide, explains that a breach which must be reported has to be reported to the ICO within 72 hours of the organisation becoming aware of it. That is why the failure note says the data protection lead is told the same day. A note that says only 'delete the conversation' can use up that time without anyone who can make the decision knowing.",
          ],
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The usual mistake is to write the failure note for the manager who approves the workflow rather than for the colleague who will use it. Reassurance reads well in a proposal, so the note fills up with sentences about how accurate the tool is and how careful the team will be.",
            "Read each sentence and ask what a colleague would do differently because of it. If the answer is nothing, it hopes the error will not happen, and it should be replaced with a sentence that names an error, a way of catching it, or a person and an action.",
          ],
        },
      ],
      workedExample: {
        title: "A failure note on the day it was needed",
        inputLabel: "The failure note",
        outputLabel: "The Friday it was used",
        prompt:
          "The model may put a notice period, a pay rate, or a date in the letter that does not match the form. The check in step 4 compares each of these with the form and the HR system. If a wrong letter is sent, the employee's signed copy will not match the HR system at filing, and the administrator who files it raises this with the HR manager on the same day. The HR manager writes to the employee to correct it. If anyone pastes more than the approved fields into the tool, they tell the data protection lead the same day.",
        output:
          "On a Friday, a signed letter came back showing an effective date of 10 November. The HR system said 3 November. The administrator filing it raised it with the HR manager that afternoon, and a corrected letter went to the employee before the change took effect. The case note showed the date had been changed by hand after the check, so the workflow was updated to say that corrections are made only from the form.",
        reading: [
          "Every sentence of the note names an error, a way of catching it, or a person and an action. None of them says the tool is accurate or that the team is careful.",
          "On the day, the note did its job. The error had passed the check because of a hand edit, and the filing comparison caught it. The administrator did not have to decide whom to tell, because the note said.",
          "The last sentence of the note, about the data protection lead, was not needed that Friday. It is there for the day it is, when the time to act is short.",
        ],
      },
      practice: {
        intro:
          "Two failure notes have been written for a workflow that drafts replies to holiday queries. Choose the one that says how the error is caught. The two labels are defined in the section above.",
        check: {
          kind: "choose",
          prompt: "Choose the failure note a colleague could act on.",
          leftLabel: "Note A",
          left: "If an employee says a reply gave the wrong number of days, the HR adviser checks it against the holiday policy and the HR system the same day, sends a correction, and tells the HR operations manager.",
          rightLabel: "Note B",
          right: "The assistant has been tested on our policy and is very accurate, and the team knows to take care with holiday replies.",
          correct: "left",
          why: "Note A names the error, the way it is caught, the person who acts, and who is told. Note B expresses confidence and relies on care, so it hopes the error will not happen.",
          wrong:
            "Look again at Note B. Being tested, being accurate, and taking care give a colleague nothing to do when a wrong reply has gone out. Note A says who checks what, against which source, and who is told.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Mark each sentence of this failure note for an offer letter workflow as one that says how the error is caught or one that hopes the error will not happen.",
        passLabel: CAUGHT,
        failLabel: HOPES,
        sentences: [
          {
            id: "specific",
            text: "The model may put a salary in the letter that differs from the approved offer form.",
            fail: false,
            why: "It names the specific error to look for, which is the first part of catching it.",
          },
          {
            id: "accurate",
            text: "Our tool is very accurate, so this should be rare.",
            fail: true,
            why: "It expresses confidence and gives no way to catch a wrong salary, so it hopes the error will not happen.",
          },
          {
            id: "compare",
            text: "The HR administrator compares the salary in the letter with the form before it is sent.",
            fail: false,
            why: "It names who checks, what, and against what, so it says how the error is caught.",
          },
          {
            id: "careful",
            text: "Everyone knows to be careful with offer letters.",
            fail: true,
            why: "Being careful does not say what to look at or who does it, so it hopes the error will not happen.",
          },
          {
            id: "reported",
            text: "If a candidate reports a wrong salary, the recruiter tells the HR manager the same day, and a corrected letter is sent from the form.",
            fail: false,
            why: "It names a person, a time, and an action, so it says how the error is caught and fixed.",
          },
        ],
        why: "You kept the sentences that name an error, a check, or a person and an action, and set aside the two that only hope. A colleague could act on every sentence you marked as saying how the error is caught.",
      },
      bridge:
        "You now have every part of the workflow. The next lesson brings them together and tests them on situations you have not seen, before the final lesson asks you to write your own.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It sets out the whole method in one place, works one mixed example, and then assesses it on situations you have not seen, before the final lesson asks you to write the workflow for your own operation.",
      sections: [
        {
          heading: "Choosing the operation and marking its steps",
          paragraphs: [
            "An HR operation is a piece of work that repeats, follows steps, and produces a defined output. A good first operation has a defined input, a defined output, and a source of truth where the correct facts can be checked. A whole area such as employee relations is not an operation, and a case such as a grievance or a flexible working decision is not a good place for a first AI step, because each turns on judgement about particular people.",
            "Once the operation is chosen, each step is marked. A step is marked A model may take it when its input is allowed in the approved tool, its output is text a person will read, and an error could be caught against the source of truth. A step is marked A person keeps it when any of those fails, or when the step is a decision, a change to a record, or an action with a legal deadline or effect. Approving, updating the HR or payroll system, confirming right to work, and sending anything that changes terms all stay with a person.",
          ],
        },
        {
          heading: "What goes into the tool, and the check that follows",
          paragraphs: [
            "A field of the input goes into the tool only when your organisation allows it there and the draft needs it. Health information, bank details, National Insurance numbers, identity document numbers, and personal reasons for a change stay out, and the name goes in as a placeholder that the checker fills in.",
            "Straight after the model's step comes a check that a person keeps. It names the checker by role, the facts compared, and the source they are compared with, and it says that any mismatch is corrected from the source and noted. 'Review the letter' and 'check for errors' are not checks, because the errors a model makes in HR documents are plausible and are found only by comparing each fact.",
          ],
        },
        {
          heading: "When it goes wrong",
          paragraphs: [
            "The failure note says what an error would look like, how it would be caught if the check missed it, who would be told, and what would be done. Each sentence should say how the error is caught. A sentence that expresses confidence in the tool or relies on care in general hopes the error will not happen, and gives the colleague who finds the error nothing to do.",
            "The note also says that if personal data goes into the tool by mistake, the data protection lead is told the same day. It is for the organisation to assess whether a breach must be reported, and the ICO's guide explains that a reportable breach must be reported within 72 hours of the organisation becoming aware of it.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "The assessment sets seven situations from HR teams in housing, logistics, retail, healthcare, food, engineering, and education. Each question has one right answer, and each draws on one or more of the moves above.",
            "You need six of the seven to pass. After you submit, each question shows the feedback for the option you chose, so that you can see why it holds or what it would have caused at work.",
          ],
        },
      ],
      workedExample: {
        title: "One draft workflow, read against every lesson",
        inputLabel: "The draft workflow",
        outputLabel: "The reviewer's notes",
        prompt:
          "Operation: replies to holiday entitlement queries at Aldwyn Retail.\nStep 1: the employee's query arrives in the HR inbox.\nStep 2: the HR adviser pastes the query and the employee's full absence history into the assistant.\nStep 3: the model drafts the reply using the holiday policy.\nStep 4: the HR adviser reviews the reply.\nStep 5: the reply is sent.\nFailure note: the assistant is accurate on policy questions, so errors should be rare.",
        output:
          "The operation is good: the input is the query, the output is the standard reply, and the source of truth is the holiday policy and the HR system.\nStep 2 sends the full absence history, which may include sickness reasons. Only the employee's contracted hours, start date, and the days taken this year should go in.\nStep 4 does not say what is compared or against what.\nThe failure note hopes the error will not happen.",
        reading: [
          "The choice of operation holds. Holiday queries arrive in the same form, the reply follows a standard shape, and every number in it can be checked against the policy and the HR system.",
          "Step 2 fails the question of what goes into the tool. The reply needs the entitlement and the days taken, not the reasons for past absences, so the step should name the fields that go in and say that absence reasons do not.",
          "Step 4 is 'review the reply', which names a role but not the facts or the source. The revised step reads: 'The HR adviser compares the number of days and any dates in the reply with the holiday policy and the HR system, and corrects any mismatch from them.'",
          "The failure note is a single hope. It needs a sentence that names the likely error, such as a wrong number of days, how it would be caught, who is told, and a sentence saying that the data protection lead is told the same day if absence details are pasted in by mistake.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose the step 2 that would put the right information into the tool for Aldwyn Retail's holiday replies. The worked example and the section on what goes into the tool are above.",
        check: {
          kind: "choose",
          prompt: "Choose the version of step 2 a colleague should follow.",
          leftLabel: "Step A",
          left: "Step 2: the HR adviser pastes only the employee's contracted hours, start date, and days taken this year into the assistant, with [Employee name] as a placeholder. Do not paste absence reasons or any other part of the record.",
          rightLabel: "Step B",
          right: "Step 2: the HR adviser pastes the query and the employee's full absence history into the assistant, and takes care not to include anything sensitive.",
          correct: "left",
          why: "Step A names the fields the reply needs, uses a placeholder for the name, and says what stays out. Step B still sends the full absence history, and taking care is not a rule a colleague can follow.",
          wrong:
            "Look again at Step B. The full absence history can contain sickness reasons, which the reply does not need, and 'take care' does not say which fields stay out. Step A names them.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each question has one right answer, and you need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "operation",
            situation:
              "Nadia Chowdhury leads a small HR team at Brookmere Housing. Her director has asked the team to use AI to speed up the admin and wants a first change in place this quarter. The candidates on the team's list are employee relations, grievance outcome letters, and replies to reference requests from other employers, which arrive about fifteen times a month.",
            question: "Which should Nadia choose for the first AI step?",
            options: [
              {
                id: "a",
                text: "Employee relations, because it takes the team the most time each month.",
                feedback:
                  "Employee relations is an area, not an operation. It has no defined input, no defined output, and no single source of truth, so nobody could say when the model's work was wrong. Choose one repeating piece of work with all three features.",
              },
              {
                id: "b",
                text: "Replies to reference requests, because each arrives as an email, the reply follows the standard factual template, and the dates can be checked against the HR system.",
                correct: true,
                feedback:
                  "This is the operation the course would choose. It has a defined input, a defined output, and a source of truth, and at fifteen a month the workflow will be tested on real cases quickly.",
              },
              {
                id: "c",
                text: "Grievance outcome letters, because they are long and take the most drafting effort.",
                feedback:
                  "A grievance outcome turns on judgement about particular people, which makes it a case. The length of the letter does not change that. A first AI step belongs in an operation where an error can be found by comparing with a source.",
              },
              {
                id: "d",
                text: "All three at once, so that the director sees the benefit quickly.",
                feedback:
                  "Starting in three places means three workflows, none of them written down or reviewed, and two of them without a source of truth. One checkable operation is a change the team can follow and review.",
              },
            ],
          },
          {
            id: "steps",
            situation:
              "Marcus Webb is an HR officer at Castleford Logistics, mapping the onboarding operation. The steps are: confirm the start date with the hiring manager, check the new starter's right-to-work documents, create the payroll record, and send a welcome email with the first-day arrangements taken from the starter record.",
            question: "Which step may a model take?",
            options: [
              {
                id: "a",
                text: "Drafting the welcome email from the starter record, which Marcus reads and checks before it is sent.",
                correct: true,
                feedback:
                  "Right. The output is text that a person reads before it goes anywhere, and the start date and arrangements can be checked against the starter record. That is the step a model may take.",
              },
              {
                id: "b",
                text: "Checking the right-to-work documents, because the model can read a scanned passport quickly.",
                feedback:
                  "Confirming right to work is a check with a legal effect that a person carries out with the documents, following the Home Office employer guide. A model may draft the request for documents, but a person keeps the check.",
              },
              {
                id: "c",
                text: "Creating the payroll record, because the entries are repetitive.",
                feedback:
                  "Tedium is not the test. Creating the payroll record changes a record that drives pay, and nobody reads the result before it takes effect, so a person keeps it.",
              },
              {
                id: "d",
                text: "Choosing the start date when the hiring manager has not replied, because the model can suggest the next available Monday.",
                feedback:
                  "Choosing a start date is a decision about a person's employment, and the employee would rely on it. A person keeps it, and the right move is to chase the hiring manager.",
              },
            ],
          },
          {
            id: "fields",
            situation:
              "Sian Lloyd, an HR administrator at Aldwyn Retail, is drafting a contract variation letter for an employee who is reducing her hours after a period of sickness absence. Aldwyn's approved assistant may be used for drafting letters from job and contract details. The change form holds the employee's name, payroll number, job title, new hours, new pay, effective date, the reason for the change, and her bank details, which were added for a separate query.",
            question: "What should Sian put into the approved assistant?",
            options: [
              {
                id: "a",
                text: "The whole form, so the letter is complete and she has nothing to fill in afterwards.",
                feedback:
                  "Pasting the whole form puts health information and bank details into the tool, and the model may mention the reason for the change in the letter. Only the fields the letter needs should go in.",
              },
              {
                id: "b",
                text: "Everything except the bank details, because the reason for the change will make the letter sound more personal.",
                feedback:
                  "The reason for the change is health information, and the letter needs the new terms, not the story behind them. A letter that mentions her sickness puts that information on her record and in her post. Leave the reason out.",
              },
              {
                id: "c",
                text: "Nothing, and she writes every letter herself, because employee data should never go into any tool.",
                feedback:
                  "Aldwyn has approved the assistant for drafting letters from job and contract details, so refusing it leaves the admin as it was. The move the course teaches is to decide field by field what goes in.",
              },
              {
                id: "d",
                text: "Only the job title, new hours, new pay, and effective date, with a placeholder for the name that she fills in at the check.",
                correct: true,
                feedback:
                  "Right. These are the fields the letter needs and the tool allows. The reason, the payroll number, and the bank details stay out, and the name goes in at the check from the form.",
              },
            ],
          },
          {
            id: "check",
            situation:
              "Tom Keane's team at Harwell Clinics has a workflow in which the model drafts offer letters from the approved offer form. Step 4 currently reads: 'The recruiter reviews the letter before it goes out.' Last month one letter gave a start date a day later than the form, and nobody noticed until the candidate asked.",
            question: "How should step 4 be rewritten?",
            options: [
              {
                id: "a",
                text: "The recruiter reviews the letter very carefully before it goes out.",
                feedback:
                  "Adding 'very carefully' still does not say what to compare or against what. A start date one day off reads naturally, so a careful reading passes it. Name the facts and the source.",
              },
              {
                id: "b",
                text: "The recruiter checks the letter for errors and makes sure it reads well.",
                feedback:
                  "Checking for errors in general and for how it reads is exactly how the wrong start date got through. The check needs to compare each fact with the approved offer form.",
              },
              {
                id: "c",
                text: "The recruitment coordinator compares the salary, start date, job title, and hours in the letter with the approved offer form, corrects any mismatch from the form, and notes it on the case.",
                correct: true,
                feedback:
                  "Right. This check names the role, the facts compared, the source, and what happens on a mismatch. The wrong start date would have stopped at the comparison with the form.",
              },
              {
                id: "d",
                text: "The hiring manager signs the letter, because they know the role best.",
                feedback:
                  "A signature is not a comparison. The hiring manager may know the role, but nothing in this step says they compare the start date with the form, so the same error could pass again.",
              },
            ],
          },
          {
            id: "failure",
            situation:
              "Grace Adeyemi is writing the failure note for a workflow that drafts replies to holiday entitlement queries at Penrose Foods. Her draft note says: 'The tool is well tested and errors are unlikely.' Her manager asks her for one sentence that would actually help a colleague.",
            question: "Which sentence should Grace add?",
            options: [
              {
                id: "a",
                text: "If an employee says a reply gave the wrong number of days, the HR adviser checks it against the holiday policy and the HR system the same day, sends a correction, and tells the HR operations manager.",
                correct: true,
                feedback:
                  "Right. This sentence names the error, how it is caught, who acts, and who is told. A colleague could follow it on a day Grace is away.",
              },
              {
                id: "b",
                text: "Everyone in the team knows to take care with holiday replies.",
                feedback:
                  "Taking care does not say what to look at or who does it. It hopes the error will not happen, like the sentence Grace already has.",
              },
              {
                id: "c",
                text: "The tool has been used by other companies without problems.",
                feedback:
                  "Other companies' experience is confidence, not a plan. It gives the colleague who finds a wrong reply nothing to do.",
              },
              {
                id: "d",
                text: "Errors will be rare because the holiday policy is short and simple.",
                feedback:
                  "A simple policy may make errors rarer, but the sentence still hopes rather than says how an error is caught. Name the error, the check, and who is told.",
              },
            ],
          },
          {
            id: "breach",
            situation:
              "On a Thursday afternoon, Ben Morris, an HR administrator at Linton Engineering, realises he pasted a whole sickness absence record, including the medical reason, into the assistant while drafting a return-to-work letter. The workflow allows only the job title, the return date, and the hours to go in. The letter itself came out correct.",
            question: "What should Ben do?",
            options: [
              {
                id: "a",
                text: "Delete the conversation in the tool and say nothing, because the letter was correct.",
                feedback:
                  "Deleting the conversation does not decide whether a breach has occurred, and saying nothing uses up the time the organisation has to assess it. The failure note says the data protection lead is told the same day.",
              },
              {
                id: "b",
                text: "Wait until Monday to see whether the employee raises a concern.",
                feedback:
                  "Waiting leaves the decision with nobody who can make it, and the ICO's guide explains that a reportable breach must be reported within 72 hours of the organisation becoming aware. Tell the data protection lead the same day.",
              },
              {
                id: "c",
                text: "Tell the data protection lead the same day, following the failure note, so the organisation can assess whether it is a reportable breach.",
                correct: true,
                feedback:
                  "Right. It is for the data protection lead to assess, and telling them the same day gives the organisation the time to decide what to do.",
              },
              {
                id: "d",
                text: "Write to the employee straight away to apologise that their medical details were shared.",
                feedback:
                  "The apology may come, but whether and how the employee is told is for the organisation to decide once the data protection lead has assessed what happened. Tell the data protection lead first, the same day.",
              },
            ],
          },
          {
            id: "send",
            situation:
              "Helen Marsh, the HR operations manager at Oakfield Schools Trust, owns a workflow for leaver acknowledgement letters that has been running for two months. A colleague proposes that the assistant should also send each letter straight to the leaver once it is drafted, because the first thirty letters needed no corrections.",
            question: "What should Helen decide?",
            options: [
              {
                id: "a",
                text: "Agree, because thirty letters without a correction show that the check is no longer needed.",
                feedback:
                  "Thirty clean letters show the workflow is working, and part of the reason is the check. Removing it means the first wrong leaving date goes straight to the leaver. Keep the check and the sending with a person.",
              },
              {
                id: "b",
                text: "Keep the check and the sending with a person, because sending changes what the leaver is told and the check is what catches the error the thirty letters did not contain.",
                correct: true,
                feedback:
                  "Right. Sending is a step a person keeps, and the check exists for the error that has not happened yet. Thirty clean letters are a good result to note at review, not a reason to remove the check.",
              },
              {
                id: "c",
                text: "Agree, but ask the colleague to spot-check one letter in ten after it has been sent.",
                feedback:
                  "A check after sending finds the error once the leaver already has it, and nine letters in ten are not checked at all. The check belongs between drafting and sending.",
              },
              {
                id: "d",
                text: "Pause the workflow until the tool can be shown never to make a mistake.",
                feedback:
                  "No tool can be shown never to make a mistake, and the workflow does not assume it. The check and the failure note are there to catch errors, so the workflow can run as it is.",
              },
            ],
          },
        ],
        why: "You applied the whole method: one checkable operation, one step for the model, only the fields the draft needs, a check against a named source, and a failure note that says who is told. You are ready to write the workflow for your own operation.",
      },
      bridge:
        "In the final lesson you write the workflow for your own operation, and that workflow is what appears on your signed record.",
    },
    {
      id: "the-workflow",
      title: "The workflow",
      emphasis: "workflow",
      place:
        "This is the last of seven lessons. You write the workflow for your own operation, part by part, and the workflow you write is what appears on your signed record.",
      sections: [
        {
          heading: "What the workflow is",
          paragraphs: [
            "The written workflow is a page a colleague could follow on a day you are away. It names the operation, its input, its output, and its source of truth. It lists the steps in order, each marked A model may take it or A person keeps it, with exactly one model step in this first version.",
            "It says which approved tool is used and which fields of the input may go into it. The step after the model's step is a check that names the checker, what is checked, and the source, and says what happens when something does not match. It ends with the failure note, which says who is told if personal data goes into the tool by mistake, and it names who owns the workflow and when it will be reviewed.",
          ],
        },
        {
          heading: "What it is not",
          paragraphs: [
            "The workflow is not a system specification and not an automation. Nothing in it connects the tool to the HR system or sends anything without a person. It is a written procedure with one checked AI step, which is the right size for a first change.",
            "It is also not a record of a real case. Do not write any employee's name, email address, or telephone number into it. Where a name is needed, write the role, such as the HR administrator, or a placeholder, such as [Employee name].",
          ],
        },
        {
          heading: "How your workflow will be checked",
          paragraphs: [
            "When you continue, each part is checked for its substance. The operation, input, output, and source of truth each need to name the real thing, such as a form, a letter, or the HR system. The steps need to be marked with the words from lesson two, and the fields for the tool need a sentence that begins with only, do not, or never.",
            "The check needs to say what the letter is compared with, and what happens on a mismatch. The failure note needs to say who is told, and the part on personal data needs to name the data protection lead or the equivalent role in your organisation. The owner and review part needs a review point. If a part is missing, the note names it and says what to add.",
            "Your record will show the workflow exactly as you write it, under these headings, so write each part for a stranger who has never seen your team. The record states only that you completed this course and signed this work. It does not say that you, your team, or your organisation is compliant with any regulation.",
          ],
        },
      ],
      workedExample: {
        title: "A complete workflow",
        inputLabel: "The workflow, as Leanne wrote it",
        outputLabel: "The first letter it produced",
        prompt:
          "The operation: the contract variation letter after an approved change of hours.\nInput: the manager's change form, approved by the budget holder.\nOutput: the variation letter from the standard template.\nSource of truth: the approved change form and the HR system record.\nSteps: 1. The form arrives and the HR administrator confirms budget holder approval (A person keeps it). 2. The HR administrator updates hours and pay in the HR system from the form (A person keeps it). 3. The assistant drafts the letter (A model may take it). 4. The HR administrator checks the letter (A person keeps it). 5. The HR administrator sends the letter for signature (A person keeps it). 6. The signed letter is filed (A person keeps it).\nThe approved tool and the fields that go into it: the approved assistant. Only the job title, new hours, new pay, and effective date go in, with [Employee name] as a placeholder. Do not paste the reason for the change, the payroll number, the National Insurance number, or bank details.\nThe check after the model's step: the HR administrator compares every date, number of hours, rate of pay, job title, and notice period in the letter with the approved form and the HR system record.\nIf the check finds a mismatch: the detail is corrected from the form or the system, never from memory, and noted on the case.\nFailure note: the model may give a date or notice period that does not match the form. If a signed letter does not match the HR system at filing, the administrator tells the HR manager the same day, and the HR manager sends a corrected letter.\nIf personal data goes into the tool by mistake: the person who pasted it tells the data protection lead the same day.\nOwner and review: the HR operations manager owns the workflow and reviews it after the first twenty letters.",
        output:
          "Dear [Employee name], I am writing to confirm that from 3 November your contracted hours as Care Coordinator will be 30 a week, and your pay will be adjusted pro rata from that date. Please sign and return a copy of this letter.",
        reading: [
          "Every part of the workflow can be followed by someone who has never met Leanne. Each names a document, a role, or a rule, and none relies on knowing how the team usually works.",
          "The letter contains only what went into the tool. There is no reason for the change, no notice period that nobody gave it, and a placeholder where the name will go.",
          "At step 4 the administrator compared the date, hours, pay basis, and job title with the form, filled in the name from the form, and found nothing to correct. That result is noted, and after twenty letters the owner will read the notes and decide whether anything changes.",
        ],
      },
      practice: {
        intro:
          "Before you write your own, read these four lines from a colleague's draft workflow and mark each one. A line is Ready to follow when a colleague could act on it without asking anything. A colleague would have to ask when it leaves out who, what, or against what.",
        check: {
          kind: "mark",
          prompt: "Mark each line as Ready to follow or as A colleague would have to ask.",
          passLabel: READY,
          failLabel: ASK,
          sentences: [
            {
              id: "source",
              text: "Source of truth: the approved offer form and the candidate's record in the HR system.",
              fail: false,
              why: "It names the two documents every fact is checked against, so it is ready to follow.",
            },
            {
              id: "check",
              text: "The check after the model's step: someone looks it over.",
              fail: true,
              why: "It names no role, no facts, and no source, so a colleague would have to ask who checks what.",
            },
            {
              id: "fields",
              text: "The approved tool and the fields that go into it: the approved assistant, with only the job title, salary, hours, and start date.",
              fail: false,
              why: "It names the tool and limits the fields with only, so it is ready to follow.",
            },
            {
              id: "owner",
              text: "Owner and review: the team.",
              fail: true,
              why: "The team is not an owner, and there is no review point, so a colleague would have to ask who decides when it changes.",
            },
          ],
          why: "That is right. The source and the fields name real things a colleague can act on. 'Someone looks it over' and 'the team' leave them asking who checks and who owns the workflow.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the workflow for your operation. A colleague should be able to follow it without asking you anything. Do not include any employee's name, email address, or telephone number.",
        fields: [
          {
            id: "operation",
            label: "The operation",
            hint: "One repeating piece of work and the output it produces, such as the contract variation letter after an approved change of hours.",
            min: 20,
            any: ["letter", "reply", "email", "pack", "checklist", "request", "notice", "confirmation", "statement", "invitation"],
            missing:
              "The operation does not yet name one repeating piece of work with a defined output. Name what is produced each time, such as a letter, a reply, a checklist, or a pack.",
          },
          {
            id: "input",
            label: "Input",
            hint: "What arrives each time and in what form, such as the approved change form or the new starter record.",
            min: 20,
            any: ["form", "record", "request", "email", "query", "notification", "system", "letter"],
            missing:
              "The input does not yet say what arrives each time. Name the document or record, such as the approved change form or the starter record in the HR system.",
          },
          {
            id: "output",
            label: "Output",
            hint: "What a correct result looks like, such as the variation letter from the standard template.",
            min: 20,
            any: ["letter", "email", "reply", "template", "pack", "checklist", "summary", "statement", "invitation"],
            missing:
              "The output does not yet say what a correct result looks like. Name it, such as the variation letter from the standard template.",
          },
          {
            id: "source",
            label: "Source of truth",
            hint: "Where the correct facts can be checked, such as the approved form, the HR system, or the policy.",
            min: 20,
            any: ["form", "system", "policy", "record", "contract", "handbook", "guidance", "guide"],
            missing:
              "The source of truth does not yet name where the facts can be checked. Name the form, the HR system record, or the policy that every fact is compared with.",
          },
          {
            id: "steps",
            label: "Steps, in order, each marked",
            hint: "Number each step, and mark each one 'A model may take it' or 'A person keeps it'. Give the model exactly one step.",
            min: 120,
            any: ["a model may take it"],
            missing:
              "The steps do not yet show which one the model takes. List every step in order, mark each one 'A model may take it' or 'A person keeps it', and give the model exactly one drafting step.",
          },
          {
            id: "tool",
            label: "The approved tool and the fields that go into it",
            hint: "Name the approved tool, list the only fields that go in, and say which fields must not go in.",
            min: 30,
            rule: "limit",
            missing:
              "The fields for the tool do not yet set a limit. Write a sentence that starts with only to name the fields that go in, and one that starts with do not to name the fields that stay out.",
          },
          {
            id: "check",
            label: "The check after the model's step",
            hint: "The checker by role, the facts compared, and the source they are compared with.",
            min: 40,
            any: ["compare", "compares", "compared", "against", "checks"],
            missing:
              "The check does not yet say what is compared with what. Name the checker's role, the facts they compare, and the form or record they compare them with.",
          },
          {
            id: "mismatch",
            label: "If the check finds a mismatch",
            hint: "What the checker does when a detail does not match, and where the correction comes from.",
            min: 20,
            any: ["correct", "mismatch", "match", "differs", "wrong", "fix"],
            missing:
              "This part does not yet say what happens when a detail does not match. Say that it is corrected from the source, not from memory, and noted on the case.",
          },
          {
            id: "failure",
            label: "Failure note",
            hint: "The most likely error, how it would be caught if the check missed it, who is told, and what is done.",
            min: 60,
            any: ["tell", "tells", "told", "raise", "raises", "report", "reports", "inform", "informs", "escalate"],
            missing:
              "The failure note does not yet say who is told. Say what the error would look like, who would catch it, and who they tell, rather than how accurate the tool is.",
          },
          {
            id: "data",
            label: "If personal data goes into the tool by mistake",
            hint: "Who is told, and when, if more than the approved fields go into the tool.",
            min: 20,
            any: ["data protection", "dpo", "information governance", "privacy"],
            missing:
              "This part does not yet name who assesses a mistake with personal data. Say that the data protection lead, or your organisation's equivalent, is told the same day.",
          },
          {
            id: "owner",
            label: "Owner and review",
            hint: "The role that owns the workflow, and when it will be reviewed, such as after the first twenty runs.",
            min: 20,
            any: ["review", "reviewed", "reviews"],
            missing:
              "Owner and review does not yet give a review point. Name the role that owns the workflow and say when it will be reviewed, such as after the first twenty letters.",
          },
        ],
        why: "Your workflow has every part a colleague needs. It names one operation with its input, output, and source of truth, gives the model one marked step, limits what goes into the tool, checks the model's work against a named source, and says who is told when something goes wrong.",
      },
      bridge:
        "Your workflow is ready. Sign your name below, and the record will show this workflow, the course, and the date to anyone who opens the reference.",
    },
  ],
};
