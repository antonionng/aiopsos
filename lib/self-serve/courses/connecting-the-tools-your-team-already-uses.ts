/*
Course: Connecting the Tools Your Team Already Uses
Slug: connecting-the-tools-your-team-already-uses
For: Operations leads, coordinators and team managers whose work passes between two or more tools
  because someone retypes, copies or forwards it. They know both tools well enough to say which fields
  matter, and they have access to the integration settings of at least one tool, or to someone who does.
  They do not write code.
Outcome: The learner finds a handoff where work is retyped between two tools, names the source of truth
  and an identifier, maps the fields, connects the tools with a built-in integration or an approved
  connector with only the access the map uses, tests it on this week's real inputs, and writes a map
  that says what a person must still check, who checks it, when, and what they do if it is wrong.
Artefact: The handoff map, in five labelled parts, for one real connection.
Record sentence: Connected one real handoff between two tools, tested it on this week's inputs, and
  signed a map of what a person must still check.
Lessons (id, title, move, interaction, pass rule):
  1. find-the-handoff, Find the handoff, tell a handoff from work within one tool, mark,
     every step marked correctly.
  2. what-moves-and-what-must-match, What moves, and what must match, write a field map with a source of
     truth, identifier and direction, choose (practice: edit), the map that names all of them is chosen.
  3. connect-it, Connect it, grant only the access the field map uses, mark (practice: choose),
     every permission marked correctly.
  4. run-this-weeks-inputs, Run this week's inputs, judge each test result, mark,
     every result marked correctly.
  5. what-a-person-still-checks, What a person still checks, write checks with owner, timing, action and a
     count, edit (practice: choose), the edit names a role, a time, an action and a count.
  6. judge-a-connection, Judge a connection from start to finish, apply the whole method, scenario of eight
     questions, six or more correct.
  7. your-handoff-map, Your handoff map, write the artefact, build, every field meets its rule and word list.
Sources: Xero Central and Xero Developer documentation on connected apps, permissions and contacts;
  Microsoft Learn documentation for Power Automate on connectors, connections and failures in cloud flows;
  Zapier Help Center on triggers, actions, filters, deduplication and troubleshooting; National Cyber
  Security Centre, 10 Steps to Cyber Security, the step on identity and access management; Information
  Commissioner's Office guidance on data minimisation under UK GDPR.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const HANDOFF = "Handoff";
const WITHIN = "Work within one tool";
const NEEDS = "Access the connection needs";
const NOT_NEEDED = "Access it does not need";
const ARRIVED = "Arrived as it should";
const PERSON = "Needs a person";
const READY = "Ready to hand over";
const ASK = "A colleague would have to ask";

export const COURSE: CourseContent = {
  slug: "connecting-the-tools-your-team-already-uses",
  hours: 2.5,
  artefact: {
    lessonId: "your-handoff-map",
    title: "The handoff map",
    recordLine:
      "Connected one real handoff between two tools, tested it on this week's inputs, and signed a map of what a person must still check.",
  },
  lessons: [
    {
      id: "find-the-handoff",
      title: "Find the handoff",
      emphasis: "handoff",
      place:
        "This is the first of seven lessons and the first module of the course. Before you connect anything, you need to find the one place where connecting two tools would save the most retyping and prevent the most mistakes.",
      sections: [
        {
          heading: "What a handoff is",
          paragraphs: [
            "In this course, a Handoff is any point where information leaves one tool and enters another because a person moves it. The person might retype it, copy and paste it, export a file from one tool and import it into the other, or forward an email so that someone else can key it in. What makes it a handoff is that the information crosses from one tool to another and a person does the carrying.",
            "The second label you will use is Work within one tool. This is a step that happens entirely inside a single tool, however many clicks it takes. Assigning a ticket to a queue, adding a note to a customer record, or running a report inside the finance system are all work within one tool, because nothing leaves that tool and nothing has to be typed again somewhere else.",
            "The distinction matters because the two kinds of step go wrong in different ways. Work within one tool can be slow, but the information stays where it was created. A handoff is where a figure can be mistyped, where a record can be missed on a busy afternoon, and where the whole process stops when the one person who does it is on holiday.",
          ],
          beforeAfter: {
            before:
              "A customer books on the website. I get an email and put them in the CRM, then I sort the invoice and add them to the list.",
            after:
              "Step 1, Handoff: the booking form emails me and I copy the details into the CRM. Step 2, Work within one tool: I find the customer in the CRM when they pay. Step 3, Handoff: I retype their name, company and amount into Xero to raise the invoice. Step 4, Handoff: I add their name to the attendee spreadsheet.",
            reading:
              "The first version hides the handoffs inside words such as 'put' and 'sort'. The second version names each tool, says how the information moves, and labels each step, so the three places where a person carries information are plain to see.",
          },
        },
        {
          heading: "What a handoff is not",
          paragraphs: [
            "A handoff is not the same as a slow step. Some steps take many clicks inside one tool, and they can be frustrating, but they are a matter for training or for the settings of that tool. Connecting two tools does nothing for them, so do not count them when you look for a handoff.",
            "A handoff is also not automatically worth connecting. Some handoffs happen once a quarter, move a different set of information every time, or cause no harm if they are a day late. Connecting those would take more effort to set up and look after than the retyping it saves.",
          ],
        },
        {
          heading: "Which handoff to connect first",
          paragraphs: [
            "A handoff is worth connecting when three things are true. It happens often, such as every booking, every new starter, or every agreed refund. The same fields move every time, such as a name, a company, an address and an amount. A mistake at that point causes real trouble later, such as an invoice sent to the wrong address, a refund paid twice, or a new starter who has no login on their first day.",
            "When a process has several handoffs, start with the one where a mistake reaches a customer, money, or someone's personal data. That is usually the handoff where your team already double checks, apologises, or corrects things after the event. It is the one where a reliable connection, with the right checks left in place, will make the biggest difference.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to try to connect everything at once. A team lists every tool it uses, draws arrows between all of them, and buys or builds something to join them up. Months later, nobody can say which tool holds the correct address, and the connections have been switched off one by one because nobody trusted them.",
            "The second mistake is to believe that connecting two tools removes the need for judgement. It removes the retyping. It does not remove the decision about whether a customer should be invoiced without VAT, or whether two records belong to the same person. Later lessons in this course are about keeping the checks that matter, and that work starts with choosing one handoff you understand well.",
          ],
        },
      ],
      workedExample: {
        title: "The booking process at Halden Events",
        inputLabel: "The coordinator's description of a booking",
        prompt:
          "A customer books on the website form. The form emails me. I copy their details into the CRM. When they pay, I look them up in the CRM and create an invoice in Xero by retyping their name, company and the amount. I then add them to the attendee list in a spreadsheet.",
        outputLabel: "The handoffs she marked",
        output:
          "Handoff: form email to CRM, by copying and pasting.\nWork within one tool: looking up the customer in the CRM when they pay.\nHandoff: CRM to Xero, by retyping name, company and amount.\nHandoff: CRM to the attendee spreadsheet, by retyping the name.\nConnect first: CRM to Xero.",
        reading: [
          "Sophie Marsh, the events coordinator at Halden Events, wrote her process in her own words first. She then read it step by step and asked of each step whether information left one tool and entered another because she moved it.",
          "She marked three handoffs and one step of work within one tool. Looking up the customer takes a few clicks, but it all happens inside the CRM, so connecting tools would not change it.",
          "The reading that follows is what makes the choice. She moves the same name and company by hand three times for every booking. The CRM to Xero handoff is the one to connect first, because a mistake there puts a wrong invoice in front of a paying customer, while a typo on the attendee list is caught at the registration desk.",
        ],
      },
      practice: {
        intro:
          "Here is a short description of how a new starter is set up at a small firm. Mark each step with one of the two labels you have just learned. The definitions and the worked example are still above if you want to compare.",
        check: {
          kind: "mark",
          prompt: "Mark each step as a Handoff or as Work within one tool.",
          passLabel: WITHIN,
          failLabel: HANDOFF,
          sentences: [
            {
              id: "offer",
              text: "When an offer is accepted, the recruiter emails the new starter's details to HR, and the HR assistant types them into the HR system.",
              fail: true,
              why: "The details leave the recruiter's email and enter the HR system because the HR assistant retypes them, so this is a handoff.",
            },
            {
              id: "contract",
              text: "The HR assistant generates the contract from a template inside the HR system.",
              fail: false,
              why: "The contract is produced from information already in the HR system, and nothing moves to another tool, so this is work within one tool.",
            },
            {
              id: "it",
              text: "The HR assistant then raises a ticket in the IT helpdesk, copying the starter's name, role and start date into it.",
              fail: true,
              why: "The name, role and start date are copied from the HR system into the helpdesk by a person, so this is a handoff.",
            },
          ],
          why: "That is right. The contract is produced inside the HR system, and the other two steps carry the same details from one tool to another by hand, which is where a start date is most likely to be mistyped.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A support team lead described how a complaint is handled. Mark each step with the label it deserves.",
        passLabel: WITHIN,
        failLabel: HANDOFF,
        sentences: [
          {
            id: "inbox",
            text: "The complaint arrives in the shared inbox, and the adviser copies the customer's details into a new ticket in the helpdesk.",
            fail: true,
            why: "Two tools are involved here, and a person moves the information between them, so this step is a handoff.",
          },
          {
            id: "queue",
            text: "The adviser assigns the ticket to the complaints queue in the helpdesk.",
            fail: false,
            why: "Nothing leaves the helpdesk in this step, so it is work within one tool.",
          },
          {
            id: "refund",
            text: "When a refund is agreed, the adviser emails finance the order number and amount, and finance enters the refund in the payments system.",
            fail: true,
            why: "Look at how the amount reaches the payments system. A person retypes it from an email, so this step is a handoff.",
          },
          {
            id: "note",
            text: "The adviser adds an internal note to the ticket recording the outcome.",
            fail: false,
            why: "The note is written and kept in the helpdesk, so no information moves between tools and this is work within one tool.",
          },
        ],
        why: "That is a careful reading. Copying details from the inbox and retyping the refund are both handoffs, and the refund is the one to look at first, because a mistyped amount is money paid to a customer. Assigning the ticket and adding a note happen inside the helpdesk.",
      },
      bridge:
        "Once you have found the handoff, the next lesson decides exactly what moves across it and how the two tools will recognise the same record.",
    },
    {
      id: "what-moves-and-what-must-match",
      title: "What moves, and what must match",
      emphasis: "match",
      place:
        "In the first lesson you chose one handoff to connect. This lesson, still in the first module, turns that choice into a plan: which tool is in charge of each piece of information, which fields move, and how the two tools will know they are looking at the same record.",
      sections: [
        {
          heading: "The source of truth",
          paragraphs: [
            "For each piece of information in the handoff, decide which tool is the source of truth. The source of truth is the one place where that information is created and corrected. A customer's billing address might have its source of truth in the CRM, while the invoice number and the payment date have theirs in the finance system.",
            "Information should flow from the source of truth to the other tool, and not back and forth. When two tools copy the same field to each other, each one overwrites the other's corrections. Finance fixes an address in Xero, the CRM sends its old address across on the next booking, and the fix disappears without anyone noticing. Naming a source of truth, and one direction, is what prevents that.",
          ],
        },
        {
          heading: "The field map",
          paragraphs: [
            "A field map lists, for each field in the destination tool, the field in the source tool it comes from. It is written in pairs, such as 'CRM billing email to Xero email'. Writing it out forces you to notice where the two tools disagree, for example where one tool holds a full name in one field and the other expects a first name and a surname.",
            "A field map is not a list of everything in both tools. It lists only what needs to move for the destination to do its job. Leaving fields out is a decision in its own right: notes, marketing preferences and anything personal that the destination does not use should stay where they are. The Information Commissioner's Office guidance on data minimisation makes the same point for personal data, which is that you should move only what the purpose needs.",
          ],
        },
        {
          heading: "The identifier",
          paragraphs: [
            "An identifier is a value that is unique to each record and the same in both tools, such as a customer number, an order number, or an email address. The connection uses it to decide whether a record is new or already exists. Without it, the connection has to guess, and it usually guesses by creating another record.",
            "A company name is a poor identifier, because 'Brook & Sons Ltd' in one tool and 'Brook and Sons' in the other look like two customers to a connection. A first name is worse. Choose a value that is created once, never retyped, and stored in both tools, even if that means adding a custom field to one of them.",
          ],
          beforeAfter: {
            before: "Match customers by company name.",
            after:
              "Identifier: the CRM customer ID, stored in a custom field on the Xero contact. If a Xero contact already holds that ID, update it rather than creating a new one.",
            reading:
              "The first version will create a duplicate every time a company's name is spelled differently. The second names a unique value, says where it lives in both tools, and says what happens when a match is found.",
          },
        },
        {
          heading: "Ready to connect, or needs more detail",
          paragraphs: [
            "In this course, a field map is Ready to connect when it names the source of truth, names the identifier, gives the direction, and has a source for every field it moves. It is Needs more detail when any of those is missing. A map that says 'keep them in sync' or 'send everything across' needs more detail, however confident it sounds.",
            "The usual mistake at this stage is to skip the map and go straight to the connector's settings screen, choosing fields from drop-down lists as they appear. The connection may even work on the first record. The trouble comes later, when a correction is overwritten or a returning customer appears twice, and there is no written plan that says which tool was meant to win.",
          ],
        },
      ],
      workedExample: {
        title: "The CRM to Xero field map at Halden Events",
        inputLabel: "The handoff she chose",
        prompt:
          "When a customer pays, I look them up in the CRM and create an invoice in Xero by retyping their name, company and the amount.",
        outputLabel: "The field map she wrote",
        output:
          "Source of truth: the CRM for customer details, Xero for invoices and payments.\nIdentifier: the CRM customer ID, stored in a custom field on the Xero contact.\nFields: CRM company name to Xero contact name; CRM billing email to Xero email; CRM billing address to Xero postal address; CRM booking amount to Xero invoice line amount; CRM event name to Xero invoice line description.\nDirection: CRM to Xero only.\nNot moved: CRM notes, CRM marketing preferences.",
        reading: [
          "Sophie started with the source of truth, because it settles arguments before they happen. When finance corrects an address in Xero, the correction must now be made in the CRM, or it will be overwritten on the next booking. She agreed that rule with the finance lead before building anything.",
          "Choosing the CRM customer ID as the identifier means a returning company is matched to its existing Xero contact, even if someone typed its name slightly differently. It costs one custom field in Xero.",
          "The five field pairs are only what an invoice needs. Notes and marketing preferences stay in the CRM, because Xero has no use for them. The map is ready to connect: it has a source of truth, an identifier, a direction and a source for every field.",
        ],
      },
      practice: {
        intro:
          "Here is a field map a colleague started for a different handoff, from a website enquiry form into a practice management tool at an accountancy firm. It needs more detail. Add an identifier and a direction, and keep the field pairs that are already there.",
        check: {
          kind: "edit",
          prompt:
            "Edit this field map so that it is ready to connect. Name the identifier the two tools share and say which direction the information flows.",
          label: "The field map you are completing",
          start:
            "Source of truth: the practice management tool for client details.\nFields: form 'Full name' to client name; form 'Company' to client company; form 'Phone' to client phone.\nKeep both in sync.",
          unchanged:
            "The map has not changed yet. Add a line naming the identifier, such as the email address, and a line giving the direction, such as form to practice management tool only.",
          limitWording: false,
          keep: [
            {
              id: "fields",
              any: ["full name", "company"],
              missing:
                "Keep the field pairs that were already there. The map should still say where the client name and company come from.",
            },
          ],
          limits: [
            {
              id: "identifier",
              any: ["identifier", "email address", "email", "client number", "reference", "unique"],
              missing:
                "The map still has no identifier. Name a value that is unique to each client and held in both tools, such as the email address.",
            },
            {
              id: "direction",
              any: ["direction", "one way", "one-way", "only from", "only to", "form to practice", "form to the practice"],
              missing:
                "The map still does not give a direction. Replace 'keep both in sync' with a line such as 'Direction: form to practice management tool only'.",
            },
          ],
          why: "That map is now ready to connect. It names a source of truth, an identifier both tools hold, and one direction, so the connection can tell a new client from a returning one and nothing is copied back to the form.",
          result: {
            label: "The map as it now reads",
            text: "Source of truth: the practice management tool for client details.\nIdentifier: email address.\nFields: form 'Full name' to client name; form 'Company' to client company; form 'Phone' to client phone.\nDirection: form to practice management tool only. If the email already exists, update that client rather than creating a new one.",
          },
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two colleagues wrote a field map for the web form to CRM handoff. Choose the map that is ready to connect.",
        leftLabel: "Map A",
        left: "Send everything from the form into the CRM and keep them in sync both ways.",
        rightLabel: "Map B",
        right:
          "Source of truth: the CRM for contacts. Identifier: email address. Fields: form 'Your name' to CRM full name; form 'Email' to CRM email; form 'Organisation' to CRM company; form 'Event' to CRM booking event. If the email already exists in the CRM, add the booking to that contact rather than creating a new one. Direction: form to CRM only.",
        correct: "right",
        why: "Map B is ready to connect. It names the source of truth, the identifier, each field and its source, the direction, and what happens with an existing contact.",
        wrong:
          "Map A has no identifier, no field pairs, and syncs both ways, so the tools could overwrite each other and create duplicates. It needs more detail. Map B names all of those things.",
      },
      bridge:
        "With the map ready to connect, the next lesson builds the connection itself, with only the access the map needs.",
    },
    {
      id: "connect-it",
      title: "Connect it",
      emphasis: "Connect",
      place:
        "This lesson is the second module of the course. You have a field map that is ready to connect, and now you choose how to connect the two tools and decide exactly what access the connection is given.",
      sections: [
        {
          heading: "Look for a built-in integration first",
          paragraphs: [
            "Start by looking for a built-in integration between the two tools. Most business tools list these in an app marketplace or on an integrations page in their settings. A built-in integration is usually maintained by one of the two vendors, which means it is updated when either tool changes, and there is someone to contact when it breaks.",
            "Read what the integration actually moves before you switch it on. Compare its description with your field map. If it moves the fields you need in the direction you chose, and lets you match records on your identifier, it is almost always the right choice. If it only moves part of what you need, it may still be the best starting point.",
          ],
        },
        {
          heading: "Use a connector your organisation already allows",
          paragraphs: [
            "If there is no built-in integration, use a connector service that your organisation already licenses and allows, such as Microsoft Power Automate, Zapier or Make. Ask whoever manages your systems which one that is before you start. Signing up for a new service with a personal email address puts your organisation's data in an account nobody else can see, pay for, or switch off.",
            "A connector works from a trigger and an action. The trigger is the event in the source tool that starts the connection, such as a new form submission. The action is what happens in the destination, such as creating a contact. Your field map tells you which fields to put into the action, and your identifier tells you how to look up an existing record first.",
          ],
        },
        {
          heading: "Grant only the access the map uses",
          paragraphs: [
            "When you connect, the tool will show a permissions screen and ask you to approve the access the connection wants. The default is often much wider than your field map needs, because vendors write one screen for every customer. The National Cyber Security Centre's guidance on identity and access management makes the general point: give each account only the access its job requires.",
            "In this course, a permission is Access the connection needs when a line of your field map uses it, and Access it does not need when no line does. Read on the source fields and write on the destination fields are usually needed. Permission to delete records, to read unrelated data such as payroll or bank transactions, or to change the tool's settings is usually not. Where the screen offers a restricted scope, choose it. Where it does not, say so to whoever manages your systems before you approve.",
          ],
          beforeAfter: {
            before: "Accept the permissions the integration asks for, so that it works.",
            after:
              "Approve read access to CRM contacts and bookings, and write access to Xero contacts and draft invoices. Refuse bank transactions, payroll and organisation settings, because no line of the field map uses them.",
            reading:
              "The first version gives the connection whatever the vendor asked for. The second checks each permission against the field map, keeps what the map uses, and refuses the rest by name.",
          },
        },
        {
          heading: "Whose account it runs under",
          paragraphs: [
            "A connection runs under an account, and it can do whatever that account can do. If you build it under your own login, it inherits all of your access, and it stops working when your password changes or when you leave. Where your IT team allows it, run the connection under an account that belongs to the team or under a service account set up for the purpose.",
            "The mistake people usually make here is to treat the permissions screen as a formality and click through it to get to the interesting part. A connection with wide access and a personal login is a quiet risk: it works well until the day someone asks why a sales tool could read the payroll, or why invoices stopped when the coordinator went on leave.",
          ],
        },
      ],
      workedExample: {
        title: "Connecting the CRM to Xero",
        inputLabel: "The permissions screen",
        prompt:
          "This integration will be able to: Read and write contacts. Read and write invoices. Read bank transactions. Read and write payroll. Access organisation settings.",
        outputLabel: "The coordinator's note to the finance lead",
        output:
          "The field map only needs to create and update contacts and create draft invoices. It does not need bank transactions, payroll or organisation settings. The integration offers a restricted scope for contacts and invoices, and I have chosen that. Invoices will be created as drafts, so finance still approves each one before it is sent. The connection runs under the events team's shared account, not my own login.",
        reading: [
          "Sophie found a built-in Xero integration in the CRM's marketplace, so she did not need a connector service. The permissions screen asked for five kinds of access, and she read each one against her field map.",
          "Contacts and invoices are used by lines of the field map, so they are access the connection needs. Bank transactions, payroll and organisation settings are used by no line, so they are access it does not need. The default would have let a sales tool read the bank and the payroll.",
          "Choosing draft invoices keeps a person in the loop for the step that reaches customers. Running under the team's account means the connection survives her holiday. Her note to the finance lead says all of this in five sentences, which is what let the finance lead agree to it.",
        ],
      },
      practice: {
        intro:
          "A coordinator at a training company wants to copy new course bookings from a form into a shared spreadsheet using the organisation's Power Automate licence. Choose the request you would send to IT. The section on granting only the access the map uses is still above.",
        check: {
          kind: "choose",
          prompt: "Choose the request that asks for only the access the connection needs.",
          leftLabel: "Request A",
          left: "I would like to connect the booking form to the bookings spreadsheet in Power Automate, using the training team's shared account. It needs to read responses from that one form and add rows to that one spreadsheet. It does not need access to any other form, file or mailbox.",
          rightLabel: "Request B",
          right:
            "I would like to connect the booking form to the bookings spreadsheet in Power Automate, using my own login. Please approve the default permissions so that it can reach whatever it needs across OneDrive and Outlook.",
          correct: "left",
          why: "Request A runs under the team's account and asks only to read one form and write to one spreadsheet, which is exactly what the field map uses. Request B would give the connection all of the coordinator's access and stop working when she leaves.",
          wrong:
            "Look again at Request B. It asks for the default permissions across OneDrive and Outlook and runs under a personal login, so the connection would reach far more than one form and one spreadsheet. Request A asks only for the access the connection needs.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A connection will copy new helpdesk tickets tagged 'bug' into the development team's project board. Mark each permission it asks for with the label it deserves.",
        passLabel: NEEDS,
        failLabel: NOT_NEEDED,
        sentences: [
          {
            id: "read",
            text: "Read tickets and their tags in the helpdesk.",
            fail: false,
            why: "Without reading tickets and tags, the connection cannot find what to copy, so this is access the connection needs.",
          },
          {
            id: "create",
            text: "Create cards on the development board.",
            fail: false,
            why: "The field map writes a card for each bug, so this is access the connection needs.",
          },
          {
            id: "delete",
            text: "Delete tickets in the helpdesk.",
            fail: true,
            why: "Nothing in the field map removes a ticket from the helpdesk, and this access could destroy customer records, so the connection does not need it.",
          },
          {
            id: "billing",
            text: "Read customer billing details in the helpdesk.",
            fail: true,
            why: "Billing details play no part in copying a bug to the board, so this access should be refused.",
          },
        ],
        why: "That is right. The connection must read tickets and tags and create cards, and nothing else. Deleting tickets could destroy customer records, and developers need the bug description, not billing details.",
      },
      bridge:
        "The connection is built, and the next lesson tests it on the inputs your team actually had this week.",
    },
    {
      id: "run-this-weeks-inputs",
      title: "Run this week's inputs",
      emphasis: "inputs",
      place:
        "This lesson is the third module of the course. The connection exists, and before anyone relies on it, you test it against the real work your team handled this week.",
      sections: [
        {
          heading: "Test on real work, somewhere safe",
          paragraphs: [
            "Take the real inputs from this week that would have crossed the handoff, such as the six bookings that were paid or the eleven tickets that were raised. Put them through the connection in a way that cannot reach a customer: a test mode, a sandbox copy of the destination, or with the destination set to create drafts. Then compare each result with what a person would have entered by hand.",
            "Real inputs are better than invented ones, because they contain the variety your team actually meets. Nobody writing test data thinks to include the customer with an apostrophe in their surname or the booking paid in two instalments. This week's work already includes them.",
          ],
        },
        {
          heading: "Include the awkward cases on purpose",
          paragraphs: [
            "Choose the awkward inputs deliberately rather than hoping they turn up. Include a record that already exists in the destination, one with a missing field, one with an unusual character or format, and one that a person would have treated differently from the rest. If this week had none of one kind, take one from last week.",
            "These are the cases where connections fail. A returning customer tests your identifier. A missing field tests what the connection does with a blank. An accented name or a long address tests whether text survives the crossing. A charity or an overseas customer tests whether the connection is being asked to make a judgement it cannot make.",
          ],
        },
        {
          heading: "Two labels for each result",
          paragraphs: [
            "In this course, an input Arrived as it should when every mapped field is correct in the destination and no duplicate was created. An empty field can be correct, if the source was empty too. An input Needs a person when anything is wrong, missing or duplicated, or when the right result needed a judgement that the connection cannot make.",
            "Write the result for each input in a short test log: what went in, what came out, and which label it earned. For each input that needs a person, add what caused it. That note decides what happens next, and the next section explains the two possible outcomes.",
          ],
        },
        {
          heading: "A test is not the connection reporting success",
          paragraphs: [
            "Connectors show a green tick or a message such as 'Run succeeded'. That tells you the connection ran without an error. It does not tell you that the result was right. The most common failures are quiet: a duplicate contact, a surname that lost its accents, an address cut short at fifty characters, or a record that was skipped entirely and so produced no error at all.",
            "Each result that needs a person leads to one of two things. Either you can fix the cause, for example by adding the identifier to existing records, and then run that input again until it arrives as it should. Or the cause is a judgement, such as the right rate of VAT, and it becomes a check a named person makes. The usual mistake is to note the failure and move on, which leaves it waiting for the first busy week.",
          ],
        },
      ],
      workedExample: {
        title: "Six bookings through the CRM to Xero connection",
        inputLabel: "This week's paid bookings",
        prompt:
          "Six bookings were paid in the CRM this week. Two are from returning customers, one is for a registered charity, and one has an address with a flat number and a long street name.",
        outputLabel: "The test log",
        output:
          "Four bookings arrived as they should, as draft invoices with the correct contact, amount and event.\nOne booking from a returning customer created a second Xero contact, because the old contact had no CRM ID stored. Needs a person. Fix: add the CRM ID to existing Xero contacts once, then retest.\nOne booking was for a charity that is invoiced without VAT, and the draft used the standard rate. Needs a person, because the VAT treatment is a finance judgement.",
        reading: [
          "Sophie ran all six bookings with Xero set to create drafts, so nothing could reach a customer. She compared each draft with what she would have typed herself, field by field.",
          "The connection handled the routine cases, including one returning customer and the long address. It failed on two cases, and each was a real risk: a duplicate contact, and an invoice at the wrong tax rate. The connection reported success on all six.",
          "One failure can be fixed in the data. She added the CRM ID to the existing Xero contacts and ran that booking again, and it matched correctly. The other failure is a judgement that must stay with a person, which is the subject of the next lesson.",
        ],
      },
      practice: {
        intro:
          "A connection copies supplier invoices from a shared inbox into the accounts tool as draft bills. Here are three results from this week's test. Mark each one using the two labels above.",
        check: {
          kind: "mark",
          prompt: "Mark each result as Arrived as it should or as Needs a person.",
          passLabel: ARRIVED,
          failLabel: PERSON,
          sentences: [
            {
              id: "routine",
              text: "An invoice from Kestrel Stationery appeared as a draft bill with the correct supplier, amount, due date and invoice number.",
              fail: false,
              why: "Every mapped field is correct and there is no duplicate, so it arrived as it should.",
            },
            {
              id: "resent",
              text: "A supplier emailed the same invoice twice, and two identical draft bills now sit in the accounts tool.",
              fail: true,
              why: "A duplicate bill could be paid twice. The connection needs a rule that uses the invoice number as the identifier, and until then it needs a person.",
            },
            {
              id: "blank",
              text: "An invoice with no purchase order number appeared with every other field correct and the purchase order field empty.",
              fail: false,
              why: "The source had no purchase order number, so an empty field is the correct result.",
            },
          ],
          why: "That is right. Two results match what a person would have entered, including the empty field, and the duplicate bill needs a person before anyone pays it.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A connection copies new job applicants from the careers form into the recruitment tracker. Here is what happened to four of this week's applicants. Mark each result with the label it deserves.",
        passLabel: ARRIVED,
        failLabel: PERSON,
        sentences: [
          {
            id: "new",
            text: "A new applicant's name, email, role and CV link all appeared correctly in the tracker.",
            fail: false,
            why: "Every mapped field is correct and there is no duplicate, so it arrived as it should.",
          },
          {
            id: "twice",
            text: "An applicant who had applied for a different role last month now appears twice in the tracker.",
            fail: true,
            why: "Two records for one person is a quiet failure. The identifier or the rule for existing records needs looking at, so it needs a person.",
          },
          {
            id: "accents",
            text: "An applicant's surname, Ó Súilleabháin, appeared as O Suilleabhain.",
            fail: true,
            why: "The accents were lost on the way across, which could cause offence and mismatches later, so the record is not correct and needs a person.",
          },
          {
            id: "phone",
            text: "An applicant who left the optional phone field blank appeared with every other field correct and the phone field empty.",
            fail: false,
            why: "The applicant did not give a phone number, so an empty field is the right result and it arrived as it should.",
          },
        ],
        why: "That is a careful reading. The new applicant and the blank phone field are both correct. The duplicate and the changed surname are quiet failures that a success message would never show you.",
      },
      bridge:
        "The test shows where the connection cannot be trusted alone, and the next lesson turns those cases into checks that a named person owns.",
    },
    {
      id: "what-a-person-still-checks",
      title: "What a person still checks",
      emphasis: "checks",
      place:
        "This lesson prepares the fourth module. Your test found the cases the connection cannot handle alone, and here you turn each one into a check that someone owns and can run while you are away.",
      sections: [
        {
          heading: "Where a person stays in the loop",
          paragraphs: [
            "A connected handoff still needs a person at three kinds of point. The first is where a judgement is required, such as the VAT treatment of an invoice or whether two applicants are the same person. The second is where a mistake would reach a customer, money, or someone's personal data. The third is where the test showed that the connection can go quietly wrong.",
            "Everything else can be left to the connection. The aim is not to have a person watch every record, which would put the retyping back in a different form. The aim is to put a person exactly where the connection is weakest, and nowhere else.",
          ],
        },
        {
          heading: "The four parts of a check",
          paragraphs: [
            "A check has four parts. What is checked, stated precisely enough that the person knows which records to look at. Who checks it, as a named person or a role, not 'someone' or 'the team'. When it happens, such as each morning when drafts are approved or on the first Monday of the month. What they do if it is wrong, such as correcting the record, merging a duplicate, or telling the person who owns the connection.",
            "A check with all four parts can be run by a colleague who has never seen the connection before. A check missing any one of them tends to lapse. Without an owner, everyone assumes someone else is doing it. Without a time, it happens when somebody remembers. Without an action, the person who spots a problem does not know whether to fix it or report it.",
          ],
          beforeAfter: {
            before: "Finance should keep an eye on VAT for unusual customers.",
            after:
              "Every draft invoice for a charity or overseas customer is reviewed for VAT by the finance assistant, each morning when she approves drafts. If the rate is wrong, she corrects it before approving and tells the events coordinator.",
            reading:
              "The first version names a department and a vague worry. The second says which invoices, who, when, and what happens when the rate is wrong, so it would still run in a week when the usual person is off.",
          },
        },
        {
          heading: "A count that catches what never arrived",
          paragraphs: [
            "Most checks look at records that crossed the handoff. The hardest failure to notice is the record that never crossed at all, because it leaves nothing behind to look at. A form submission that failed silently or a booking skipped by a filter does not appear anywhere in the destination.",
            "The answer is a count. At a set time, a named person compares the number of records in the source with the number that arrived in the destination over the same period. If the numbers differ, they find the missing record and deal with it by hand. Every connection should have at least one check of this kind.",
          ],
        },
        {
          heading: "What a check is not",
          paragraphs: [
            "A check is not a general instruction to keep an eye on things. That instruction has no owner and no time, and it lapses in the first busy week. If you find you have written 'monitor', 'keep an eye on' or 'make sure', rewrite it with the four parts.",
            "A check is also not a reason to abandon the connection. People sometimes find two failures in testing and conclude that the old way was safer. It rarely is. A person retyping every record makes mistakes too, but nobody writes them down. A good connection with two named checks is far safer than retyping everything by hand.",
          ],
        },
      ],
      workedExample: {
        title: "The checks for the CRM to Xero connection",
        inputLabel: "The test log from the last lesson",
        prompt:
          "Four bookings arrived as they should. One returning customer created a duplicate contact, fixed by adding the CRM ID to existing contacts and retested. One charity invoice used the standard VAT rate.",
        outputLabel: "The checks section she wrote",
        output:
          "Check one: every draft invoice for a charity or overseas customer is reviewed for VAT before it is approved, by the finance assistant, when approving drafts each morning. If wrong, she corrects the VAT and tells the coordinator.\nCheck two: on the first Monday of each month, the coordinator runs Xero's duplicate contacts report and merges any duplicates, noting which CRM record was missing its ID.\nCheck three: on Friday, the coordinator compares the number of paid bookings in the CRM with the number of draft invoices created that week. If they differ, she finds the missing booking and raises the invoice by hand.",
        reading: [
          "Each case that needed a person in testing now has a named owner and a time. The VAT judgement stays with finance, where it belongs, and it happens at a moment the finance assistant is already looking at each draft.",
          "The duplicate was fixed in the data, but Sophie kept a monthly check because a new contact could still be created by hand in Xero without the CRM ID. The check says exactly which report to run and what to note.",
          "The third check is the count. It catches the quiet failure where a booking never crosses at all, which nobody would otherwise notice until a customer asked why they had not been invoiced.",
        ],
      },
      practice: {
        intro:
          "Here are two checks written for the supplier invoice connection from the last lesson's practice. Choose the one a colleague could run while its author is on holiday. The four parts are listed in the section above.",
        check: {
          kind: "choose",
          prompt: "Choose the check that has all four parts.",
          leftLabel: "Check A",
          left: "The accounts team should monitor the bills and make sure there are no duplicates.",
          rightLabel: "Check B",
          right:
            "Every Tuesday, the accounts assistant runs the duplicate bills report in the accounts tool. If two bills share a supplier and invoice number, she deletes the second draft and tells the purchasing manager.",
          correct: "right",
          why: "Check B says what is checked, who checks it, when, and what they do if it is wrong. Check A has no named person, no time and no action, so it would lapse the first busy week.",
          wrong:
            "Look again at Check A. 'The accounts team' is not one person, 'monitor' has no time, and it does not say what to do when a duplicate is found. Check B has all four parts.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "Edit this map so that someone else could run the checks while you are away. Give each check what is checked, who checks it, when, and what they do if it is wrong, and add a check that compares the number of form submissions with the number of new CRM records.",
        label: "The checks you are repairing",
        start:
          "The web form now feeds the CRM automatically. Someone should keep an eye on duplicates, and sales should check the leads look right.",
        unchanged:
          "The checks have not changed yet. Rewrite each one so that it names who runs it, when, and what they do if it is wrong, and add a count.",
        limitWording: false,
        keep: [
          {
            id: "tools",
            any: ["crm"],
            missing: "Keep the CRM in the map, so that a colleague knows which tool the checks are about.",
          },
        ],
        limits: [
          {
            id: "owner",
            any: [
              "coordinator",
              "manager",
              "assistant",
              "administrator",
              "officer",
              "executive",
              "adviser",
              "advisor",
              "team leader",
              "analyst",
            ],
            missing:
              "'Someone' and 'sales' are not one named person or role. Say who runs each check, such as the sales coordinator.",
          },
          {
            id: "timing",
            any: [
              "each morning",
              "every morning",
              "daily",
              "each day",
              "every day",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "weekly",
              "each week",
              "every week",
              "monthly",
              "each month",
              "every month",
              "end of the day",
            ],
            missing: "Say when each check happens, such as each morning or the first Monday of the month.",
          },
          {
            id: "action",
            any: [
              "if wrong",
              "if it is wrong",
              "if they differ",
              "if the numbers differ",
              "if a duplicate",
              "if there is",
              "merge",
              "correct",
              "fix",
              "by hand",
              "tell",
              "report",
            ],
            missing: "Say what the person does when a check finds a problem, such as merging the duplicate or adding the lead by hand.",
          },
          {
            id: "count",
            any: ["count", "number of", "compare", "total"],
            missing:
              "Nothing here would notice a form submission that never reached the CRM. Add a check that compares the number of form submissions with the number of new CRM records.",
          },
        ],
        why: "Each check now names what is checked, who, when, and what to do if it is wrong, and there is a count that would catch a lead that never arrived.",
        result: {
          label: "The checks as they now read",
          text: "The web form now feeds the CRM automatically. Each morning, the sales coordinator reviews new CRM contacts created overnight and merges any duplicate that shares an email address. Every Friday, the sales coordinator compares the number of form submissions that week with the number of new CRM records. If they differ, she finds the missing lead and adds it by hand.",
        },
      },
      bridge:
        "You now have every part of a connected handoff. The next lesson brings them together and asks you to judge a set of new situations before you write your own map.",
    },
    {
      id: "judge-a-connection",
      title: "Judge a connection from start to finish",
      emphasis: "Judge",
      place:
        "This is the course assessment, the second-to-last lesson. It recaps the whole method in one place, works one new example from start to finish, and then asks you to apply the method to eight situations you have not seen before.",
      sections: [
        {
          heading: "The method in one place",
          paragraphs: [
            "The method has five moves, and each one depends on the one before it. You find a handoff, meaning a point where a person carries information from one tool to another, and you choose the one that happens often, moves the same fields, and causes trouble when it goes wrong. You then decide what moves and what must match: the source of truth for each piece of information, an identifier both tools hold, one direction, and a field map that lists only what the destination needs.",
            "You connect the two tools with a built-in integration if there is one, or with a connector your organisation already allows, and you grant only the access a line of the field map uses, under an account that belongs to the team. You test the connection on this week's real inputs, including the awkward ones, and mark each result as arrived as it should or needs a person. Finally, you turn every case that needed a person into either a fix that passed a retest or a check with all four parts, and you add a count.",
          ],
        },
        {
          heading: "Where people go wrong",
          paragraphs: [
            "Most problems in real connections come from skipping one move. A team that skips the source of truth ends up with corrections being overwritten. A team that skips the identifier ends up with duplicates. A team that clicks through the permissions screen ends up with a connection that can read far more than it should, running under the login of someone who has since left.",
            "The other common failures come from trusting the wrong signal. A green tick means the connection ran, not that the result was right. A vague instruction to keep an eye on things feels like a check, but it has no owner and no time. In each situation in this assessment, ask which move is missing and what the course said to do about it.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "The assessment has eight situations. Each has three or four options, and every option is something a reasonable professional might do. Exactly one option is right for a reason this course taught. You need six of the eight to pass.",
            "When you submit, each question shows whether your choice was right and the feedback for the option you chose. If you do not reach six, the feedback tells you which situations to look at again, and you can change your answers and submit again.",
          ],
        },
      ],
      workedExample: {
        title: "Maintenance requests at Brennan Lettings",
        inputLabel: "The lettings manager's notes",
        prompt:
          "Tenants report repairs on our web form. Aisha in the office reads each one, and types the address, the problem and the tenant's phone number into the contractor scheduling tool. We had about thirty last week. Twice this month a contractor went to the wrong flat, because the flat number was missed.",
        outputLabel: "How the method applied",
        output:
          "Handoff: web form to scheduling tool, by retyping, about thirty times a week, and mistakes send a contractor to the wrong door.\nSource of truth: the lettings system for addresses, the form for the problem description. Identifier: the property reference. Direction: form to scheduling tool only.\nConnection: the scheduling tool's built-in form integration, under the office account, with read on form responses and create on jobs only. Refused: access to tenant bank details.\nTest: last week's 30 requests in the tool's test area. 27 arrived as they should. 2 had no property reference because the tenant typed a free address, and 1 was an emergency that a person would have phoned through.\nChecks: Aisha reviews every request without a property reference each morning and adds it by hand. Emergencies stay on the phone line. Every Friday, Aisha compares the number of form submissions with the number of jobs created.",
        reading: [
          "The handoff passes all three tests for connecting first: it is frequent, it moves the same fields every time, and a mistake has already sent a contractor to the wrong flat.",
          "Using the property reference as the identifier, and taking the address from the lettings system rather than from what the tenant typed, removes the cause of the missing flat numbers. The connection refuses access to bank details, because no line of the field map uses them.",
          "The test found two quiet failures and one judgement. The missing references become a named morning check, emergencies stay with a person on the phone, and the Friday count catches any request that never arrived.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, try one short judgement. The recap above has everything you need.",
        check: {
          kind: "choose",
          prompt:
            "Brennan Lettings has connected its form to the scheduling tool. Choose the next step that follows the method.",
          leftLabel: "Next step A",
          left: "Switch the connection on for all new requests today, because the vendor built the integration and the first request went through.",
          rightLabel: "Next step B",
          right:
            "Run last week's thirty real requests through the tool's test area, including one with no property reference and one emergency, and compare each job with what Aisha would have entered.",
          correct: "right",
          why: "Next step B tests on real inputs somewhere safe, includes the awkward cases on purpose, and compares each result with what a person would have done. One request going through tells you the connection runs, not that it is right.",
          wrong:
            "Look again at Next step A. A single request that went through is the connection reporting success, not a test. Next step B runs this week's real inputs, including the awkward ones.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. You need six of the eight to pass.",
        passMark: 6,
        questions: [
          {
            id: "which-first",
            situation:
              "Gareth Price runs operations at Pennine Joinery. Each week his team retypes about forty accepted quotes from the estimating spreadsheet into Sage to raise invoices, and last month two customers were invoiced for the wrong amount. Once a quarter, he also exports a sales report from Sage into a slide for the board.",
            question: "Which handoff should Gareth connect first?",
            options: [
              {
                id: "a",
                text: "The accepted quotes from the estimating spreadsheet into Sage.",
                correct: true,
                feedback:
                  "That is right. It happens forty times a week, moves the same fields each time, and a mistake has already put a wrong invoice in front of customers.",
              },
              {
                id: "b",
                text: "The quarterly sales report from Sage into the board slide.",
                feedback:
                  "That handoff happens four times a year and a person reviews the slide anyway. The quotes into Sage happen forty times a week and have already caused wrong invoices, so connect those first.",
              },
              {
                id: "c",
                text: "Both at once, so that the whole process is connected in one project.",
                feedback:
                  "Connecting everything at once is the mistake the first lesson warned about. Start with the one handoff where mistakes reach customers and money, which is the quotes into Sage.",
              },
            ],
          },
          {
            id: "overwritten",
            situation:
              "Halden Events connected its CRM to Xero, with the CRM as the source of truth for customer details. Finance corrected a customer's address in Xero on Monday. On Wednesday the customer booked again, and the old address reappeared on the Xero contact.",
            question: "What should happen next?",
            options: [
              {
                id: "a",
                text: "Change the connection to sync addresses both ways, so that corrections in Xero flow back to the CRM.",
                feedback:
                  "Two-way copying is what leads each tool to overwrite the other's corrections. Keep one direction, and make the correction in the source of truth.",
              },
              {
                id: "b",
                text: "Ask finance to correct the address in Xero again each time it reverts.",
                feedback:
                  "That puts the retyping back and it will keep happening on every booking. Corrections belong in the source of truth, which here is the CRM.",
              },
              {
                id: "c",
                text: "Correct the address in the CRM, and agree with finance that customer details are corrected there, not in Xero.",
                correct: true,
                feedback:
                  "That is right. The CRM is the source of truth for customer details, so corrections made there flow across and are not overwritten.",
              },
            ],
          },
          {
            id: "identifier",
            situation:
              "Tallow & Finch is connecting its enquiry form to its practice management tool. Every client in the tool has a client number, and every enquiry includes an email address. Many clients are small companies whose names are written in different ways.",
            question: "Which identifier should the field map use to match an enquiry to an existing client?",
            options: [
              {
                id: "a",
                text: "The company name, because it is the field staff recognise most easily.",
                feedback:
                  "Company names are written in different ways, so 'Brook & Sons' and 'Brook and Sons' would become two clients. Choose a value that is unique and the same in both tools.",
              },
              {
                id: "b",
                text: "The email address, because it is unique to each contact and held in both the form and the tool.",
                correct: true,
                feedback:
                  "That is right. The email address is unique, it is in the enquiry, and it is stored against the client, so the connection can tell a returning client from a new one.",
              },
              {
                id: "c",
                text: "The contact's first name and surname together.",
                feedback:
                  "Two people can share a name, and names are spelled inconsistently. The email address is unique and present in both tools.",
              },
            ],
          },
          {
            id: "which-connector",
            situation:
              "Marlow Dental wants to copy new patient enquiries from its website form into a shared spreadsheet. There is no built-in integration between the two. The practice already licenses Microsoft Power Automate through its Microsoft 365 subscription, and the IT support company manages it.",
            question: "What should the practice manager do?",
            options: [
              {
                id: "a",
                text: "Sign up for a free Zapier account with her own email address, because it is quick to set up.",
                feedback:
                  "A new service on a personal account puts patient enquiries somewhere nobody else can see or switch off. Use the connector the practice already licenses, with the IT company's agreement.",
              },
              {
                id: "b",
                text: "Ask the receptionist to keep copying enquiries by hand until the form vendor builds an integration.",
                feedback:
                  "There is an allowed route available now. Waiting leaves the retyping, and its mistakes, in place indefinitely.",
              },
              {
                id: "c",
                text: "Ask the form vendor to email every enquiry to the whole practice, so that nobody misses one.",
                feedback:
                  "That spreads patient data to more people and still relies on someone retyping it. Use the connector the practice already allows.",
              },
              {
                id: "d",
                text: "Build the connection in Power Automate, after agreeing it with the IT support company.",
                correct: true,
                feedback:
                  "That is right. With no built-in integration, the next choice is a connector the organisation already licenses and allows, agreed with whoever manages its systems.",
              },
            ],
          },
          {
            id: "permissions",
            situation:
              "A flow will save the PDF attachment from each supplier invoice email into one SharePoint folder called Invoices In. The permissions screen asks for 'Read and write all files the user can access' and offers an option to limit access to a single site.",
            question: "What should the person building the flow do?",
            options: [
              {
                id: "a",
                text: "Limit access to the site that holds the Invoices In folder, and refuse wider file access.",
                correct: true,
                feedback:
                  "That is right. The field map writes to one folder, so access to that site is what the connection needs, and access to every file is not.",
              },
              {
                id: "b",
                text: "Accept the default, because the vendor knows what the flow needs.",
                feedback:
                  "Vendors write one permissions screen for every customer, and the default here would let the flow reach every file you can open. Choose the restricted option.",
              },
              {
                id: "c",
                text: "Accept the default for now, and restrict it later once the flow is working.",
                feedback:
                  "Later rarely comes, and the flow would run with access to every file in the meantime. Restrict it now, since the option is on the screen.",
              },
            ],
          },
          {
            id: "account",
            situation:
              "Owen Clarke built the connection between his team's helpdesk and the project board under his own login. It has worked well for six months. Owen is moving to another department at the end of the month.",
            question: "What should happen before he moves?",
            options: [
              {
                id: "a",
                text: "Nothing, because the connection is working and changing it could break it.",
                feedback:
                  "The connection runs with Owen's access and will stop, or keep access it should not have, when his account changes. Move it before he goes.",
              },
              {
                id: "b",
                text: "Owen shares his password with his replacement so that the connection keeps running.",
                feedback:
                  "Sharing a password breaks your organisation's access controls and leaves the connection tied to one person's account. Move it to a team or service account.",
              },
              {
                id: "c",
                text: "With IT's agreement, rebuild the connection under the team's service account, with only the access its field map uses.",
                correct: true,
                feedback:
                  "That is right. A team or service account keeps the connection running when people move, and rebuilding is a chance to confirm it has only the access it needs.",
              },
            ],
          },
          {
            id: "green-tick",
            situation:
              "Chloe Ward tested a new connection that copies orders from the online shop into the warehouse system. The connector's history shows 'Run succeeded' for all twelve of this week's orders. Two of the orders were from returning customers and one had a delivery note in Welsh.",
            question: "What should Chloe do before she switches it on?",
            options: [
              {
                id: "a",
                text: "Switch it on, because all twelve runs succeeded.",
                feedback:
                  "'Run succeeded' means the connection ran without an error, not that each order is right. Duplicates and changed text are quiet failures that only a comparison will show.",
              },
              {
                id: "b",
                text: "Compare each of the twelve orders in the warehouse system with what a person would have entered, paying close attention to the returning customers and the Welsh note.",
                correct: true,
                feedback:
                  "That is right. Comparing each result, especially the awkward cases, is the test. It is where duplicates and lost characters are found.",
              },
              {
                id: "c",
                text: "Run another twelve invented orders to be sure the connection is stable.",
                feedback:
                  "More runs with invented data will not show whether this week's real orders arrived correctly. Compare the real results, including the awkward ones.",
              },
            ],
          },
          {
            id: "vat",
            situation:
              "In testing, a booking for a registered charity produced a draft invoice at the standard VAT rate. The finance assistant, Helen, approves every draft invoice each morning. The coordinator is writing the checks section of the handoff map.",
            question: "Which line should go in the checks section?",
            options: [
              {
                id: "a",
                text: "Finance should keep an eye on VAT for charities.",
                feedback:
                  "'Finance' is not one person, and 'keep an eye on' has no time or action. That kind of instruction lapses in the first busy week.",
              },
              {
                id: "b",
                text: "Switch the connection off and go back to raising invoices by hand, because it cannot handle charities.",
                feedback:
                  "One judgement the connection cannot make is a reason for a check, not for going back to retyping every invoice. A good connection with named checks is safer.",
              },
              {
                id: "c",
                text: "Helen reviews the VAT on every draft invoice for a charity each morning before approving it. If the rate is wrong, she corrects it and tells the coordinator.",
                correct: true,
                feedback:
                  "That is right. It says what is checked, who, when, and what to do if it is wrong, at a moment Helen is already looking at each draft.",
              },
            ],
          },
        ],
        why: "You applied the whole method: choosing the handoff, keeping one source of truth, choosing a unique identifier, using an allowed connector with only the access it needs, testing on real inputs, and writing checks with all four parts.",
      },
      bridge:
        "You can now judge a connection at every stage. In the last lesson you write the handoff map for the connection you built, and that map goes on your record.",
    },
    {
      id: "your-handoff-map",
      title: "Your handoff map",
      emphasis: "map",
      place:
        "This is the fourth module and the final lesson. You bring together the handoff, the field map, the connection, the test and the checks for one real connection, and the map you write here is what appears on your signed record.",
      sections: [
        {
          heading: "What the map contains",
          paragraphs: [
            "Your handoff map describes one real connection that you have built and tested. It has five parts. The handoff says which two tools are involved, how a person used to move the information, and why you chose this handoff. What moves and what must match gives the source of truth, the identifier, the direction and at least three field pairs.",
            "The connection and its access says whether you used a built-in integration or a connector, which account it runs under, and which access you granted and refused. This week's inputs says how many real inputs you tested, which awkward cases you included, and which arrived as they should or needed a person. What a person still checks lists each check with what is checked, who, when and what they do if it is wrong, and includes at least one count.",
          ],
        },
        {
          heading: "What the map is not",
          paragraphs: [
            "The map is not a diagram of every system in your organisation, and it does not claim that the connection is free of errors. A map that reports two failures in testing, and says how each was dealt with, is stronger than one that reports none, because it shows the test was real.",
            "Do not paste real personal data into the map. It will appear on a record that another person can open. Describe the inputs by kind and count, such as 'six paid bookings, two from returning customers', rather than by name.",
          ],
        },
        {
          heading: "Ready to hand over",
          paragraphs: [
            "The test for the map is whether a colleague could take over the connection tomorrow and know what it does, what it cannot be trusted with, and what they must check. In this course, a line of the map is Ready to hand over when a colleague could act on it as it stands. It is A colleague would have to ask when it leaves out a name, a time, a number, or a decision that only you know.",
            "'The coordinator compares the number of paid bookings with draft invoices every Friday' is ready to hand over. 'Check it now and then' is not. 'Identifier: the CRM customer ID' is ready to hand over. 'We match customers' is not. Read each line of your map with a colleague in mind before you continue.",
          ],
        },
        {
          heading: "How the map is checked",
          paragraphs: [
            "When you continue, each part is checked in turn. The handoff must say how a person moved the information, for example by retyping, copying or forwarding, and name the tools. What moves and what must match must name an identifier and include a concrete detail. The connection and its access must say what access was granted and set a limit on what the connection cannot do.",
            "This week's inputs must include a number and say which inputs arrived as they should or needed a person. What a person still checks must include a count that compares the two tools, and a concrete time or name. If a part is missing, the note names it and says what to add. When every part passes, you sign your name, and the record shows your map exactly as you wrote it.",
          ],
        },
      ],
      workedExample: {
        title: "The handoff map for the CRM to Xero connection",
        inputLabel: "The coordinator's notes from the course",
        prompt:
          "Three handoffs found; CRM to Xero chosen. Field map with CRM ID. Built-in integration, restricted scope, drafts. Six bookings tested, two needed a person. Three checks.",
        outputLabel: "The map she signed",
        output:
          "The handoff: I retyped each paid booking's name, company and amount from the CRM into Xero to raise an invoice, about fifteen times a week. I chose it because a mistake puts a wrong invoice in front of a customer.\nWhat moves and what must match: the CRM is the source of truth for customer details and Xero for invoices. Identifier: the CRM customer ID, in a custom field on the Xero contact. Direction: CRM to Xero only. Fields: company name to contact name, billing email to email, billing address to postal address, booking amount to line amount, event name to line description.\nThe connection and its access: the CRM's built-in Xero integration, under the events team's shared account. Granted: contacts and draft invoices only. Refused: bank transactions, payroll and organisation settings. It must not approve or send invoices.\nThis week's inputs: 6 paid bookings. 4 arrived as they should. A returning customer created a duplicate contact, which needed a person; fixed by adding CRM IDs to existing contacts, and it passed on retest. A charity invoice used the standard VAT rate, which needed a person and is now a check.\nWhat a person still checks: the finance assistant reviews VAT on every charity or overseas draft each morning and corrects it if wrong. The coordinator runs the duplicate contacts report on the first Monday of each month and merges any duplicates. Every Friday, the coordinator compares the number of paid bookings with the number of draft invoices and raises any missing invoice by hand.",
        reading: [
          "Each part does one job, and each one could be acted on by someone who was not there when the connection was built. A colleague reading it knows which tool wins, what the connection may touch, and what they must look at each week.",
          "The map is candid about the two failures in testing, and says how each was dealt with. That candour is what let the finance lead approve the connection.",
          "No customer is named anywhere in the map. The inputs are described by kind and count, which is enough for a verifier to see that the test was real.",
        ],
      },
      practice: {
        intro:
          "Before you write your own map, read these four lines from a colleague's draft and mark each one. You will use the same test on your own map in a moment.",
        check: {
          kind: "mark",
          prompt: "Mark each line as Ready to hand over or as A colleague would have to ask.",
          passLabel: READY,
          failLabel: ASK,
          sentences: [
            {
              id: "handoff",
              text: "The handoff: we had a manual process between some systems.",
              fail: true,
              why: "It does not name the two tools or say how the information moved, so a colleague would have to ask.",
            },
            {
              id: "match",
              text: "What moves and what must match: the helpdesk is the source of truth for tickets. Identifier: the ticket number, stored on each card. Direction: helpdesk to board only.",
              fail: false,
              why: "It names the source of truth, the identifier and the direction, so a colleague could act on it as it stands.",
            },
            {
              id: "access",
              text: "The connection and its access: it has the permissions it needs.",
              fail: true,
              why: "It does not say which access was granted or refused, or which account the connection runs under, so a colleague would have to ask.",
            },
            {
              id: "count",
              text: "What a person still checks: every Friday, the support team leader compares the number of bug tickets with the number of new cards and adds any missing card by hand.",
              fail: false,
              why: "It says what is checked, who, when and what to do, and it is a count, so it is ready to hand over.",
            },
          ],
          why: "That is right. The field map line and the Friday count are ready to hand over. The first line names no tools and the access line names no permissions, so a colleague would have to ask about both.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the map for the connection you built. Include all five parts, and do not paste real personal data.",
        fields: [
          {
            id: "handoff",
            label: "The handoff",
            hint: "The two tools, how a person moved the information between them, how often, and why you chose this handoff.",
            min: 60,
            rule: "fact",
            any: ["retype", "retyping", "copy", "copied", "copying", "paste", "forward", "export", "import", "by hand", "re-enter", "rekey", "typed"],
            missing:
              "The handoff does not yet say how a person moved the information. Name the two tools and say whether it was retyped, copied, forwarded or exported, and how often.",
          },
          {
            id: "match",
            label: "What moves and what must match",
            hint: "The source of truth, the identifier held in both tools, the direction, and at least three field pairs.",
            min: 80,
            rule: "fact",
            any: ["identifier", "unique", "customer id", "client id", "crm id", "reference", "email address", "number"],
            missing:
              "No identifier is named. Say which value is unique to each record and held in both tools, and give the source of truth, the direction and the field pairs.",
          },
          {
            id: "connection",
            label: "The connection and its access",
            hint: "Built-in integration or connector, the account it runs under, the access granted, and what it must not or cannot do.",
            min: 60,
            rule: "limit",
            any: ["access", "permission", "scope", "read", "write"],
            missing:
              "The connection does not yet set a limit on its access. Say what access was granted, and write what it must not or cannot do, for example that it has only read access to contacts and must not delete records.",
          },
          {
            id: "inputs",
            label: "This week's inputs",
            hint: "How many real inputs you tested, the awkward cases, which arrived as they should, which needed a person, and what happened next.",
            min: 60,
            rule: "fact",
            any: ["arrived as", "needed a person", "needs a person", "need a person", "duplicate", "retest"],
            missing:
              "This week's inputs does not yet report the results. Give the number of inputs tested and say which arrived as they should and which needed a person.",
          },
          {
            id: "checks",
            label: "What a person still checks",
            hint: "Each check with what is checked, who, when and what they do if it is wrong, including one count that compares the two tools.",
            min: 80,
            rule: "fact",
            any: ["count", "number of", "compare", "total"],
            missing:
              "The checks do not yet include a count. Add a check in which a named person compares the number of records in the two tools at a set time, and say what they do if the numbers differ.",
          },
        ],
        why: "Your map names the handoff, the source of truth and identifier, the access granted and refused, the results on real inputs, and the checks a person still owns.",
      },
      bridge:
        "Your map is ready. Sign your name below, and your record will show this map, the course and the date to anyone who opens the reference. Save a copy where the people who run the checks can find it.",
    },
  ],
};
