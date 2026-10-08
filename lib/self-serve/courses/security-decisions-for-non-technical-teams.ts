/*
Course: Security Decisions for Non-Technical Teams
Slug: security-decisions-for-non-technical-teams
For: Team leaders and office managers in small and medium-sized organisations, or in teams inside larger ones, who decide every day how people share accounts, files and devices, usually without a security specialist to ask. They know which systems their team logs in to and how access is handed to new starters, temporary staff and suppliers. They need no technical security knowledge.
Outcome: The learner can list how their team really shares access, judge which items would cause serious harm if misused, recognise phishing, payment diversion, reused passwords and unrevoked access in workplace examples, and choose three changes the team can make this week, each with one named owner and a date.
Artefact: The exposure list. Each serious harm is described by what is shared, who can get in, the worst realistic outcome, the change, and the owner with a date, followed by a note of nuisances and projects for later.
Record sentence: Wrote and signed an exposure list for their own team, naming each serious harm and at least three changes for this week, each with one owner and a date.
Lessons (id, title, move, interaction, pass rule):
  1. what-you-actually-share, What you actually share, tell named access from shared access, mark ("Named access" / "Shared access"), every item marked correctly.
  2. what-would-hurt, What would hurt, sort shared access by the worst realistic outcome, mark ("Nuisance" / "Serious harm"), every item marked correctly.
  3. how-it-usually-goes-wrong, How it usually goes wrong, check a request by another route, choose (Response A / Response B), the response that checks by another route.
  4. three-changes-this-week, Three changes this week, tell a change for this week from a project for later, mark ("A change for this week" / "A project for later"), every item marked correctly.
  5. repair-an-exposure-list, Repair an exposure list, repair a weak row so someone else can check it, edit, the row keeps the bank portal and adds who can get in, the outcome, a specific change, an owner and a date.
  6. security-judgement-assessment, Test your judgement on new cases, apply the whole method, scenario of eight questions, six of eight correct.
  7. your-exposure-list, Your exposure list, write the artefact, build, every field carries a rule or an any list: what is shared, who can get in, worst realistic outcome, the change, owner and date, nuisances and projects for later.
Sources: National Cyber Security Centre, Small Business Guide; National Cyber Security Centre, Cyber Aware guidance; National Cyber Security Centre, Suspicious Email Reporting Service (report@phishing.gov.uk) and the 7726 text reporting service; National Cyber Security Centre, Cyber Essentials scheme overview (reference only, this course does not prepare for or certify against it); Information Commissioner's Office, guidance on security under UK GDPR for small organisations.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const NAMED = "Named access";
const SHARED = "Shared access";
const SERIOUS = "Serious harm";
const NUISANCE = "Nuisance";
const ANOTHER_ROUTE = "Checks by another route";
const TRUSTS = "Trusts the message";
const THIS_WEEK = "A change for this week";
const LATER = "A project for later";
const READY = "Ready to act on";
const ASK = "Someone would have to ask";

export const COURSE: CourseContent = {
  slug: "security-decisions-for-non-technical-teams",
  hours: 2,
  artefact: {
    lessonId: "your-exposure-list",
    title: "The exposure list",
    recordLine:
      "Wrote and signed an exposure list for their own team, naming each serious harm and at least three changes for this week, each with one owner and a date.",
  },
  lessons: [
    {
      id: "what-you-actually-share",
      title: "What you actually share",
      emphasis: "share",
      place:
        "This is the first of seven lessons. Before you can decide what to change, you need an honest description of how access really works in your team, and this lesson gives you the two labels you will use to write it.",
      sections: [
        {
          heading: "Access is how people get in",
          paragraphs: [
            "In this course, access means any way a person can get into something your team uses for work. That includes a login to a system such as the accounting software or the booking website, a password to a shared mailbox or a social media account, a file or folder on a shared drive, and a device such as the office laptop or the tablet on the reception desk. If someone can open it, change it or send from it, they have access to it.",
            "Most teams describe their access by describing the policy. The policy says that everyone has their own account, that leavers are removed on their last day, and that files are shared only with the people who need them. The policy is usually true for the systems the IT provider set up. It is often silent about the supplier portal that only offers one login, the password in the team chat, and the folder someone shared with a link in a hurry two years ago.",
          ],
        },
        {
          heading: "Named access and shared access",
          paragraphs: [
            "You will describe every item with one of two labels. The first label is Named access. Access is named when each person has their own login, their own permissions, and access that is removed when they leave. With named access you can tell who did what, and you can remove one person without affecting anyone else.",
            "The second label is Shared access. Access is shared when more than one person uses the same login, when a password is written on a sticky note, a card or a shared document, when a file is shared as anyone with the link, or when a former member of staff, a temp or a supplier can still get in after their work has ended. That last case belongs here because the access is no longer tied to a person who is meant to have it.",
            "The test is not whether the item feels safe. A shared login used by two trusted people is still shared access, because neither of them can prove which of them made a change, and neither can be removed without changing the password for the other.",
          ],
          beforeAfter: {
            before: "Everyone has their own login for the case system.",
            after:
              "Everyone has their own login for the case system, which is named access. The team inbox has one password used by all five caseworkers, which is shared access.",
            reading:
              "The first version is true and describes only the part that was already fine. The second version adds the item the policy did not mention, and labels each one.",
          },
        },
        {
          heading: "What shared access is not",
          paragraphs: [
            "Shared access is not a sign of carelessness. It is common for good reasons. Many small suppliers offer one login per customer, a company Instagram account has one password by design, and a busy office shares a folder by link because the person who needed it could not open it any other way. You are not listing faults. You are listing facts.",
            "Shared access is also not the same as a security incident. Nothing has gone wrong because a login is shared. The problem is what happens if something does go wrong: nobody can tell who did what, and nobody can shut out one person without changing access for everyone. The list you write in this course is how you decide which of those problems are worth fixing first.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to answer from memory at your desk. People remember the systems they log in to every day and forget the ones they touch once a month, such as the domain name account, the bank portal, or the courier website. They also forget people who have left, because once someone has gone they are no longer in anyone's mind.",
            "The better method is to walk the work. Go round the office or through a normal week and ask how each task is done: who books the courier, who pays the suppliers, who posts on social media, who opens the client folders. Then look at the user list in each system you can reach and read every name on it. The items you find this way are the ones your list most needs.",
          ],
        },
      ],
      workedExample: {
        title: "The office manager's walk round",
        inputLabel: "Her first answer",
        outputLabel: "The list she wrote after walking round",
        prompt:
          "Maria Costa, office manager at Linden Street Surveyors, was asked how the team shares access. Her first answer was: \"Everyone has their own Microsoft 365 login.\"",
        output:
          "Everyone has their own Microsoft 365 login, which is named access. The bank's online portal has one login used by the finance officer and me, which is shared access. The company Instagram password is in a pinned message in the team chat, which is shared access. The shared drive's Clients folder is shared with anyone with the link, which is shared access. A former temp, who left in June, still appears in the accounting software user list, which is shared access because someone outside the team can still get in.",
        reading: [
          "Maria's first answer was true. Every member of staff does have their own Microsoft 365 login, and that item is named access. It was also the only item she already knew was fine.",
          "The walk round found four items the policy did not show. Two of them, the bank portal and the Instagram account, are logins used by more than one person. One is a folder opened to anyone who has the link. One is a former temp whose account nobody removed.",
          "None of these items meant Maria had been careless. Each had a sensible reason at the time. The list simply shows, for the first time, where the firm cannot tell who did what.",
        ],
      },
      practice: {
        intro:
          "Here are three items from a small charity's list. Mark each one with the label it deserves. The definitions of named access and shared access are in the section above if you want to read them again.",
        check: {
          kind: "mark",
          prompt: "Mark each item as Named access or Shared access.",
          passLabel: NAMED,
          failLabel: SHARED,
          sentences: [
            {
              id: "donor",
              text: "Each fundraiser logs in to the donor database with their own account.",
              fail: false,
              why: "Each person has their own login, so this is named access.",
            },
            {
              id: "mailbox",
              text: "The volunteers' mailbox has one password, which is written in the front of the rota folder.",
              fail: true,
              why: "Several people use one password, and it is written down, so this is shared access.",
            },
            {
              id: "trustee",
              text: "A trustee who stood down last year can still open the finance folder.",
              fail: true,
              why: "Someone whose role has ended can still get in, which this lesson counts as shared access.",
            },
          ],
          why: "That is right. The donor database gives each person their own login, while the volunteers' mailbox and the former trustee are both ways in that are not tied to someone who is meant to have them.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A team lead at Brookfield Housing listed four ways their team gets into systems. Mark each one with the label it deserves.",
        passLabel: NAMED,
        failLabel: SHARED,
        sentences: [
          {
            id: "case-system",
            text: "Each caseworker logs in to the case system with their own account, and HR removes it on their last day.",
            fail: false,
            why: "Every caseworker has their own account and it is removed on leaving, which is named access.",
          },
          {
            id: "courier",
            text: "The courier booking website has one login, and the password is on a card by the printer.",
            fail: true,
            why: "Several people use one login here, so nobody can tell who booked what. That is shared access.",
          },
          {
            id: "price-list",
            text: "The price list is shared as anyone with the link can view.",
            fail: true,
            why: "Anyone with the link means access is not tied to a named person, so this is shared access.",
          },
          {
            id: "contractor",
            text: "A contractor who left in March can still log in to the project board.",
            fail: true,
            why: "The contractor has gone, but their access has not. The lesson counts this as shared access.",
          },
        ],
        why: "That is the right reading. Only the case system gives each person their own login that is removed when they leave. The courier login, the link to the price list and the contractor's account all let someone in without tying the access to a person who should have it.",
      },
      bridge:
        "Not every item of shared access matters equally. The next lesson shows you how to decide which ones would hurt.",
    },
    {
      id: "what-would-hurt",
      title: "What would hurt",
      emphasis: "hurt",
      place:
        "You now have a list of the ways your team really gets in. This lesson helps you sort that list, so that the changes you make later go where they matter most.",
      sections: [
        {
          heading: "Ask what the worst realistic outcome would be",
          paragraphs: [
            "For each item of shared access, ask one question: if the wrong person had this access, what is the worst thing that could realistically happen? The wrong person might be an outsider who found the password, a former member of staff with a grievance, or a colleague who made an honest mistake and cannot be identified.",
            "The word realistic matters. The question is not what a film villain could do with your office radio account. It is what would plausibly happen in your organisation, with the people and systems you actually have. A realistic answer usually names a specific loss: a payment, a set of records, or a system you need on Monday morning.",
          ],
        },
        {
          heading: "Serious harm and nuisance",
          paragraphs: [
            "You will sort each item with one of two labels. The first label is Serious harm. An outcome is serious harm when money could be moved or paid to the wrong place, when personal data about customers, clients, patients or staff could be seen or taken, when you could be locked out of a system you cannot work without, or when you could lose records you cannot rebuild.",
            "The second label is Nuisance. An outcome is a nuisance when it would be embarrassing or cost some time, but could be put right quickly and cheaply. A silly post on the company social media account, a changed radio station or a reset password on a newsletter tool are nuisances. They are worth noting, but they are not where this week's effort should go.",
          ],
          beforeAfter: {
            before: "The payroll login is shared, which is not ideal.",
            after:
              "The payroll login is shared between two administrators. The worst realistic outcome is a salary paid to the wrong bank account, with no way to tell who changed it, and staff bank details seen by someone who should not see them. This is serious harm.",
            reading:
              "The first version admits a concern without saying what it is. The second names the money and the personal data involved, which is what puts the item in the serious harm group.",
          },
        },
        {
          heading: "What this sort is not",
          paragraphs: [
            "This is not a formal risk assessment. You are not asked to calculate how likely each outcome is, give it a score, or fill in a matrix. Organisations that need a formal assessment will have one, and it will be owned by someone else. This sort is a quick, honest judgement that tells a busy team leader which few items deserve attention this week.",
            "It is also not a judgement about the people who use the access. Saying that a shared payroll login could cause serious harm does not suggest that either administrator would misuse it. It says that if a mistake or an outsider did cause a problem, the team could not tell what happened or put it right quickly.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to rank items by how visible they are rather than by what they could cost. People worry about the company social media account because a bad post would be public and embarrassing. They pay less attention to the bank portal or a spreadsheet of client addresses, because nothing about those items is on show until something has already gone wrong.",
            "The other common mistake is forgetting lock-out as a harm. If only one person knows the password to the domain name account and they leave or fall ill, the firm may lose its website and email for days. Nobody has done anything wrong, and the harm is still serious, because the team cannot work without the system.",
          ],
        },
      ],
      workedExample: {
        title: "Sorting the Linden Street list",
        inputLabel: "The shared items from Lesson 1",
        outputLabel: "The sort Maria wrote",
        prompt:
          "The bank portal login used by the finance officer and Maria. The Instagram password pinned in the team chat. The Clients folder shared with anyone with the link. The former temp who still appears in the accounting software.",
        output:
          "The shared bank portal login is serious harm, because a payment could be made and we could not tell who made it. The Clients folder shared by link is serious harm, because it contains client contact details and contracts. The former temp in the accounting software is serious harm, because they could see and change invoices. The Instagram password in the team chat is a nuisance, because the worst case is an embarrassing post that we could delete, and we could recover the account through the platform.",
        reading: [
          "Each line names the worst realistic outcome in one clause, and each outcome falls into one of the kinds this lesson defined. The bank portal is about money, the folder is about personal data, and the accounting software is about both.",
          "Three of the four items are serious harm. The Instagram account, which the team had worried about most, turned out to matter least, because an embarrassing post can be removed and the account recovered.",
          "The sort took Maria a few minutes. She did not score anything or consult a framework. She asked the same question of each item and wrote down the answer.",
        ],
      },
      practice: {
        intro:
          "Here are three shared items from a dental practice. Mark each one as Serious harm or Nuisance. The four kinds of serious harm are listed in the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each item as Serious harm or Nuisance.",
          passLabel: NUISANCE,
          failLabel: SERIOUS,
          sentences: [
            {
              id: "music",
              text: "The waiting room music account has one login, and the password is on the reception screen.",
              fail: false,
              why: "The worst case is a changed playlist, which is quick and cheap to put right, so this is a nuisance.",
            },
            {
              id: "card-reader",
              text: "The card reader's admin login is shared by all four receptionists.",
              fail: true,
              why: "The admin login can issue refunds, so money could be paid to the wrong place. That is serious harm.",
            },
            {
              id: "rota",
              text: "The staff rota spreadsheet, which includes home phone numbers, is shared with anyone with the link.",
              fail: true,
              why: "The spreadsheet holds personal data about staff, which this lesson counts as serious harm.",
            },
          ],
          why: "That is right. The music account is a nuisance, while the card reader can move money and the rota holds staff personal data, so both are serious harm.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A practice manager at Riverside Physiotherapy is sorting items on the team's list. Mark each item with the label it deserves.",
        passLabel: NUISANCE,
        failLabel: SERIOUS,
        sentences: [
          {
            id: "payroll",
            text: "The login for the payroll system is shared between two administrators.",
            fail: true,
            why: "Think about the worst realistic outcome. Payroll can pay money to the wrong account and holds staff personal data, so this is serious harm.",
          },
          {
            id: "radio",
            text: "The password for the office radio streaming account is on the fridge.",
            fail: false,
            why: "No money, personal data or essential system is involved. The worst case is a changed station, which is a nuisance.",
          },
          {
            id: "appointments",
            text: "Patient appointment lists are exported to a spreadsheet shared with anyone with the link.",
            fail: true,
            why: "The file holds personal data about patients, which the lesson counts as serious harm.",
          },
          {
            id: "domain",
            text: "Only one person knows the password to the domain name account, and they are retiring next month.",
            fail: true,
            why: "Being locked out of the domain could take down email and the website, which the practice cannot work without. That is serious harm.",
          },
        ],
        why: "That is the right sort. Payroll involves money and staff data, the appointment spreadsheet involves patient data, and the domain account could lock the practice out of its email. Only the radio account is a nuisance.",
      },
      bridge:
        "You now know which items would hurt. The next lesson shows you how small teams are usually attacked, so you know where that harm tends to come from.",
    },
    {
      id: "how-it-usually-goes-wrong",
      title: "How it usually goes wrong",
      emphasis: "wrong",
      place:
        "You have a list of shared access and you know which items would cause serious harm. This lesson connects that list to the ordinary ways small organisations are attacked, as described in the National Cyber Security Centre's Small Business Guide.",
      sections: [
        {
          heading: "Four ordinary routes",
          paragraphs: [
            "Most harm to small teams does not come from sophisticated hacking. It comes from four ordinary routes. The first is phishing, where an email, text or message tricks someone into entering a password on a fake page or opening a harmful file. The second is payment diversion, where a message that appears to come from a supplier, a client or a senior colleague asks for money to be sent to a new bank account.",
            "The third route is a reused or guessed password. When a website you once used is breached, the email addresses and passwords taken from it are tried on other services, including your work email. If the password is the same, the attacker is in. The fourth route is access that was never removed, such as a leaver's account, a supplier's login, or a link that was never switched off.",
            "None of these routes needs you to understand technology. Each one works because of an ordinary habit, and each one is made much less likely by a different ordinary habit that a team leader can set.",
          ],
        },
        {
          heading: "Checks by another route and trusts the message",
          paragraphs: [
            "The single most useful habit against phishing and payment diversion is to check a request by a route you already had before the message arrived. You will judge responses with two labels. A response Checks by another route when it confirms the request using a contact you already held, such as the phone number in your supplier file, the colleague's number in the staff directory, or a conversation in person.",
            "A response Trusts the message when it relies on anything in the message itself. Replying to the email, calling the number in its signature, clicking its link, or asking the sender whether they are genuine all trust the message. If the message came from an attacker, every one of those steps goes straight back to the attacker, who will happily confirm that everything is in order.",
          ],
          beforeAfter: {
            before:
              "The finance officer replied to the supplier's email asking them to confirm the new bank details, and paid when they did.",
            after:
              "The finance officer rang the supplier's usual contact on the number in the supplier file, heard that the bank details had not changed, and did not pay.",
            reading:
              "The first response trusts the message, because the confirmation came from the same email thread that asked for the change. The second checks by another route, using a number the firm held before the email arrived.",
          },
        },
        {
          heading: "Why spotting fakes is not the defence",
          paragraphs: [
            "Many people believe the defence against phishing is to spot the fake. Some fakes are easy to spot, with odd spelling and an unfamiliar address. Many are not. A payment diversion email can come from a supplier's real account that has been taken over, quoting a real invoice number in the supplier's usual tone. Nobody should be expected to spot that by reading it.",
            "The habit works because it does not depend on spotting anything. A bank change is confirmed by a known route whether the email looks genuine or not. An urgent request from the managing director to buy gift cards is checked by calling them on the number you already have, however convincing the message looks. The rule protects the person who is tired, busy or new.",
          ],
        },
        {
          heading: "Reporting what you find",
          paragraphs: [
            "When a message turns out to be suspicious, report it. The National Cyber Security Centre runs a Suspicious Email Reporting Service, and you can forward a suspicious email to report@phishing.gov.uk. Suspicious texts can be forwarded to 7726. Tell your IT provider and your team as well, because the same message has often been sent to several people.",
            "If someone has already entered a password or made a payment, speed matters more than blame. Change the password straight away, tell your IT provider, and if money has gone, call your bank at once on the number on its website or the back of your card. A team that reports quickly without fear of being blamed stops more harm than one where people keep quiet about a mistake.",
          ],
        },
      ],
      workedExample: {
        title: "The supplier's new bank details",
        inputLabel: "The email the finance officer received",
        outputLabel: "What the finance officer did",
        prompt:
          "From: accounts@harlowstationery.co.uk\nSubject: Updated bank details\nPlease note our bank details have changed. Kindly update your records and pay the attached invoice 22817 for £3,480 to the new account today. Regards, Accounts Team, Harlow Stationery.",
        output:
          "I did not reply to the email or call the number in its signature. I rang our usual contact at Harlow Stationery, Kerry, on the number in our supplier file. She said they had not changed their bank. I forwarded the email to report@phishing.gov.uk and told Maria, who told the rest of the team.",
        reading: [
          "The email looked genuine. It came from an address that matched the supplier, quoted a real-looking invoice number and asked for a plausible amount. Nothing in it would have alerted a busy person.",
          "The finance officer checked by another route. She used a contact the firm already held and ignored every contact detail in the message. That single step is what prevented the loss.",
          "She also reported it, both to the national service and to her own team. The next person who received a similar email already knew what to do.",
        ],
      },
      practice: {
        intro:
          "Here are three responses to suspicious requests. Mark each one as Checks by another route or Trusts the message. The definitions are in the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each response as Checks by another route or Trusts the message.",
          passLabel: ANOTHER_ROUTE,
          failLabel: TRUSTS,
          sentences: [
            {
              id: "signature",
              text: "Ben called the phone number in the email's signature to confirm the client's new bank account.",
              fail: true,
              why: "The number came from the message itself, so if the email was fake, Ben called the attacker. This trusts the message.",
            },
            {
              id: "directory",
              text: "Priya rang the finance director on the number in the staff directory before approving the urgent transfer.",
              fail: false,
              why: "Priya used a contact the organisation already held, so this checks by another route.",
            },
            {
              id: "link",
              text: "Sam clicked the link in the text about a missed delivery and entered the office card details to rebook it.",
              fail: true,
              why: "Sam acted on the link inside the message, so this trusts the message.",
            },
          ],
          why: "That is right. Only Priya used a contact she already held. Ben and Sam both relied on details inside the message, which would lead straight back to an attacker.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Jas, the office manager at Kestrel Print, receives a text that appears to come from the managing director, Helen, asking her to buy £400 of gift cards for a client today and send the codes by text. Choose the response you would want in your team.",
        leftLabel: "Response A",
        left: "Jas replies to the text to ask whether it is really Helen, receives a reply saying yes and asking her to hurry, and buys the cards.",
        rightLabel: "Response B",
        right:
          "Jas does not reply to the text. She calls Helen on the number saved in the staff directory, learns the text was not from her, forwards it to 7726, and tells the team.",
        correct: "right",
        why: "Response B checks by another route. Jas used a number the firm already held, so it did not matter how convincing the text was, and she reported it so the rest of the team were warned.",
        wrong:
          "Look again at Response A. Replying to the text only asks the person who may be the attacker whether they are genuine, so it trusts the message. Response B calls Helen on a number the firm already held, which is checking by another route.",
      },
      bridge:
        "With the harms and the routes in view, the next lesson helps you choose the three changes to make this week.",
    },
    {
      id: "three-changes-this-week",
      title: "Three changes this week",
      emphasis: "changes",
      place:
        "You know what your team shares, which items would hurt, and how the harm usually arrives. This lesson turns that knowledge into a small number of changes you can finish in days rather than months.",
      sections: [
        {
          heading: "Three tests for a good change",
          paragraphs: [
            "A good change passes three tests. First, it reduces a serious harm on your list. Second, it can be done this week by someone in your team or by your IT provider, without new money or a decision above your level. Third, it has one named owner and a date. If a change fails any of the three, it is not yet a change you can count on.",
            "The owner must be one person. Writing IT, everyone or the team as the owner means nobody is responsible, and the change will still be waiting next month. The date should be a real day this week or next, such as Thursday or 14 October, and not a phrase such as soon or when things calm down.",
          ],
        },
        {
          heading: "A change for this week and a project for later",
          paragraphs: [
            "You will sort proposals with two labels. A proposal is A change for this week when it passes all three tests: it reduces a serious harm, it can be done now, and it has one owner and a date. A proposal is A project for later when it needs a budget, a supplier, or a decision above your level, or when it is too broad to finish in a week.",
            "A project for later is not a bad idea. Moving the whole team to a password manager or setting up single sign-on may be exactly right. It belongs on your list with a note of who needs to decide, so that it is not lost. It simply does not count towards the three changes you will make this week.",
            "A proposal with no owner, no date and no specific action, such as everyone should be more careful, is also a project for later. It is an intention, and an intention cannot be checked.",
          ],
          beforeAfter: {
            before: "Sort out the leavers.",
            after: "Remove the three leavers who still have access to the CRM. Owner: Tom Hughes, by Monday.",
            reading:
              "The first version names a problem. The second names the specific action, how many accounts are involved, one owner and a day, so it is a change for this week.",
          },
        },
        {
          heading: "The changes that usually pass",
          paragraphs: [
            "The National Cyber Security Centre's Small Business Guide and its Cyber Aware advice recommend a short set of habits for small organisations, and several of them pass all three tests in most teams. Turning on two-step verification, which asks for a code from your phone as well as a password, for email and for any system that moves money is usually free and quick. Removing leavers from every system, and switching anyone with the link files to named people, closes access that was never removed.",
            "Other changes that often pass include giving each person their own login where a system allows it, changing a shared password that a leaver knew, agreeing in writing that bank changes are always confirmed by phone on a known number, and checking that important data is backed up somewhere separate from the office. Replacing shared passwords with a password manager is excellent, but it usually needs a decision on which product to buy, which makes it a project for later in many teams.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to choose the change that feels most thorough rather than the one that removes the most harm this week. A team leader who spends the week comparing firewall products has made no change at all, while the former temp can still open the invoices. Small, specific changes to serious harms come first.",
            "The other common mistake is to choose changes that do not match the list. Buying new laptops does nothing about a shared bank login. Each change should point back to a serious harm you have already written down, so that anyone reading your list can see why you chose it.",
          ],
        },
      ],
      workedExample: {
        title: "Maria's three changes",
        inputLabel: "Her serious harms",
        outputLabel: "The changes she wrote",
        prompt:
          "The shared bank portal login used by the finance officer and Maria. The Clients folder shared with anyone with the link. The former temp who still appears in the accounting software.",
        output:
          "Remove the former temp from the accounting software. Owner: Nadia Brooks, finance officer, by Tuesday. Change the Clients folder from anyone with the link to the four account managers by name. Owner: Maria Costa, by Wednesday. Give Nadia and Maria their own logins to the bank portal and turn on two-step verification for both, after checking with the bank that it offers separate users. Owner: Nadia Brooks, by Friday. Project for later: a team password manager, awaiting a decision from the managing director on which product to buy.",
        reading: [
          "Each change removes one serious harm from Maria's list. The temp loses access to the invoices, the client folder is limited to named people, and the bank portal can now show who made each payment.",
          "Each change has one named owner and a day in the same week. Nadia and Maria can both be asked on Friday whether their changes are done, and the answer will be yes or no.",
          "None of the three changes needs new money. The password manager, which does, is kept on the list as a project for later with the person who needs to decide, so it is not forgotten.",
        ],
      },
      practice: {
        intro:
          "Before you sort a whole set of proposals, choose between two ways of writing the same change. The three tests are in the section above.",
        check: {
          kind: "choose",
          prompt:
            "A shared login to the supplier ordering portal at Fernhill Nursery is on the serious harm list. Choose the change that passes all three tests.",
          leftLabel: "Change A",
          left: "Change the portal password and give it only to Callum and Rhys. Owner: Callum Ward, by Thursday.",
          rightLabel: "Change B",
          right: "IT to review how we manage supplier portals.",
          correct: "left",
          why: "Change A reduces the serious harm by limiting who knows the password, can be done this week, and has one owner and a day. Change B has no specific action, no date, and an owner that is not a person.",
          wrong:
            "Look again at Change B. It has no specific action, no date, and IT is not one named person, so it is a project for later. Change A names the action, one owner and Thursday.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A team lead at Oakfield Lettings proposed four changes. Mark each change with the label it deserves.",
        passLabel: THIS_WEEK,
        failLabel: LATER,
        sentences: [
          {
            id: "two-step",
            text: "Turn on two-step verification for all staff email accounts. Owner: Aisha Khan, by Thursday.",
            fail: false,
            why: "It reduces a serious harm, has one owner and a date this week, and needs no budget, so it is a change for this week.",
          },
          {
            id: "single-sign-on",
            text: "Move all our systems to a single sign-on platform.",
            fail: true,
            why: "This needs a supplier, a budget and a decision above team level, so it is a project for later.",
          },
          {
            id: "leavers",
            text: "Remove the three leavers who still have access to the CRM. Owner: Tom Hughes, by Monday.",
            fail: false,
            why: "It is quick, closes access that was never removed, and has an owner and a date, so it is a change for this week.",
          },
          {
            id: "careful",
            text: "Everyone should be more careful with emails.",
            fail: true,
            why: "It has no owner, no date and no specific action. Without them, this is an intention, and it belongs with projects for later.",
          },
        ],
        why: "That is right. Two-step verification and removing the leavers each reduce a serious harm, can be done now, and have one owner and a date. Single sign-on needs a budget and a decision, and being more careful has no owner, date or action.",
      },
      bridge:
        "You now have every part of an exposure list. The next lesson shows you how the parts fit together by repairing a weak one.",
    },
    {
      id: "repair-an-exposure-list",
      title: "Repair an exposure list",
      emphasis: "Repair",
      place:
        "This lesson prepares you for the final one. You practise the shape of an exposure list on someone else's work before you write your own.",
      sections: [
        {
          heading: "The five parts of a row",
          paragraphs: [
            "An exposure list has one row for each item of shared access that would cause serious harm. Each row has five parts. What is shared names the specific item, such as the bank portal login or the Clients folder. Who can get in names the people who can use that access today, including anyone who has left. Worst realistic outcome says what could happen, in the terms you learned in the second lesson.",
            "The change says what will be done, as a specific action that passes the tests from the fourth lesson. Owner and date names one person and a day. Below the rows, a short note records nuisances and projects for later, so that nothing you found is lost even if it is not being changed this week.",
          ],
        },
        {
          heading: "What an exposure list is not",
          paragraphs: [
            "An exposure list is not a policy document. It does not set rules for the whole organisation, and it does not need approval from a board before you can use it. It is a working list for your team, short enough to read in two minutes.",
            "It also does not certify anything. It is not evidence that your team is secure, and it is not a submission for Cyber Essentials or any other scheme. It is a record of what you found and what you are changing, written so that your manager or your IT provider could act on it without calling you.",
          ],
        },
        {
          heading: "The parts most often missing",
          paragraphs: [
            "The part most often missing is who can get in. People write that a login is shared without saying who shares it, because they assume the reader knows. The reader usually does not, and the answer often turns out to include someone who has left or a supplier nobody remembered.",
            "The other part most often missing is a real owner. Rows end with IT to look at, the team to fix, or TBC. None of these is a person who can be asked on Friday whether the work is done. The third common gap is a vague outcome, such as risky or not ideal, which gives the reader no idea why the row matters.",
          ],
          beforeAfter: {
            before: "Shared drive: some folders open. Should fix.",
            after:
              "What is shared: the Clients folder on the shared drive, set to anyone with the link. Who can get in: anyone who has been sent the link, including two former account managers and at least one client. Worst realistic outcome: client contact details and contracts seen by people outside the firm. The change: share the folder with the four current account managers by name and switch off link sharing. Owner and date: Maria Costa, by Wednesday.",
            reading:
              "The weak row admits a problem. The repaired row lets someone else check, on Thursday, that it has been fixed.",
          },
        },
        {
          heading: "How to repair a row",
          paragraphs: [
            "Repair a row by keeping what it already says and adding each missing part in turn. Do not throw it away and start again, because the person who wrote it usually knew something true, such as which system was involved. Read the row and ask of each part whether someone else could check it without asking you.",
            "Where you do not know a part, find it out before you guess. Look at the user list in the system to see who can get in. Ask the person who uses it most what they would lose if it went wrong. Then write the change and the owner in the same words you would use in a message to that person.",
          ],
        },
      ],
      workedExample: {
        title: "Repairing the accounting software row",
        inputLabel: "The weak row",
        outputLabel: "The repaired row",
        prompt: "Accounts software: old user. Needs sorting.",
        output:
          "What is shared: the accounting software, where a former temp's account is still active. Who can get in: Leanne Shaw, a temp who left in June, as well as the finance officer and the office manager. Worst realistic outcome: invoices viewed or changed, and supplier bank details altered so that a payment goes to the wrong account. The change: remove Leanne Shaw's account and check the user list for any other former staff. Owner and date: Nadia Brooks, finance officer, by Tuesday.",
        reading: [
          "The weak row knew the system and knew there was an old user. The repair kept both facts and made them specific: which system, and which user.",
          "It added who can get in, including the named former temp, and a worst realistic outcome that involves money, which is why the row belongs on the list.",
          "The change is a specific action with a small extra step, checking for other former staff, and the owner is one person with a day. Anyone reading the row on Wednesday can ask Nadia whether it is done.",
        ],
      },
      practice: {
        intro:
          "Here is a row with every part filled in except who can get in. Choose the line that completes it. The section on the parts most often missing will help.",
        check: {
          kind: "choose",
          prompt:
            "The row reads: \"What is shared: the courier booking login at Fenwick Dental Lab. Worst realistic outcome: bookings charged to the lab's card by someone who should not have access. The change: give each technician their own login. Owner and date: Dan Price, by Thursday.\" Choose the line for Who can get in.",
          leftLabel: "Line A",
          left: "Who can get in: a few people in the lab.",
          rightLabel: "Line B",
          right:
            "Who can get in: the five technicians, the receptionist, and a former technician who left in April and still knows the password.",
          correct: "right",
          why: "Line B names who can use the login today, including the former technician, so someone else could check it and see why the change matters.",
          wrong:
            "Look again at Line A. A few people does not say who they are or whether anyone has left, so a reader would have to ask. Line B names them, including the former technician.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "Edit this exposure list row from Linden Street Surveyors so that someone else could check it has been fixed. Keep the bank portal, and add who can get in, the worst realistic outcome, a specific change, and one named owner with a day or date.",
        material: {
          label: "What you know",
          text: "The bank portal login is used by Nadia Brooks, the finance officer, and Maria Costa, the office manager. The bank offers separate users and two-step verification at no charge.",
        },
        label: "The row you are repairing",
        start: "Bank portal: shared. Risky. IT to look at.",
        unchanged:
          "You have not changed the row yet. Add who can get in, the worst realistic outcome, a specific change, and one named owner with a date.",
        keep: [
          {
            id: "portal",
            any: ["bank portal", "bank's portal", "online banking", "bank login"],
            missing:
              "Keep what is shared. The row should still say that the item is the bank portal login.",
          },
        ],
        limitWording: false,
        limits: [
          {
            id: "who",
            any: ["who can get in", "nadia", "maria", "finance officer", "office manager", "used by", "can log in"],
            missing: "Say which people can use the bank portal login today, for example Nadia Brooks and Maria Costa.",
          },
          {
            id: "outcome",
            any: ["payment", "money", "paid", "pay ", "transfer", "funds", "locked out", "worst realistic outcome"],
            missing: "Risky does not say what would happen. Name the worst realistic outcome, such as a payment made with no way to tell who made it.",
          },
          {
            id: "change",
            any: ["own login", "separate", "two-step", "2-step", "two step", "individual login", "remove", "turn on"],
            missing: "Look at is not a change. Say what will be done, such as giving each person their own login and turning on two-step verification.",
          },
          {
            id: "owner",
            any: ["owner"],
            missing: "IT is not one named owner. Add an owner line that names the person responsible, such as Owner: Nadia Brooks.",
          },
          {
            id: "date",
            any: [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "january",
              "february",
              "march",
              "april",
              "may",
              "june",
              "july",
              "august",
              "september",
              "october",
              "november",
              "december",
            ],
            missing: "Add a date. Say which day this week the change will be done, for example by Friday.",
          },
        ],
        why: "That repair works. The row still names the bank portal, and it now says who can get in, what could realistically go wrong with the money, what will be done, and who will do it by when, so someone else can check it has been fixed.",
        result: {
          label: "What someone else can now check",
          text: "What is shared: the bank portal login. Who can get in: Nadia Brooks, finance officer, and Maria Costa, office manager, using one login. Worst realistic outcome: a payment made to the wrong account with no way to tell who made it. The change: give Nadia and Maria their own logins and turn on two-step verification for both. Owner and date: Nadia Brooks, by Friday.",
        },
      },
      bridge:
        "You can now tell a row that someone else could act on from one they could not. The next lesson tests your judgement across the whole course on cases you have not seen.",
    },
    {
      id: "security-judgement-assessment",
      title: "Test your judgement on new cases",
      emphasis: "judgement",
      place:
        "This is the course assessment. It brings together every move from the first five lessons and asks you to apply them to situations you have not yet seen, before you write your own exposure list.",
      sections: [
        {
          heading: "The method in full",
          paragraphs: [
            "The method has five moves. First, describe how your team actually gets in, by walking the work and reading user lists, and label each item as named access or shared access. Second, ask what the worst realistic outcome would be for each shared item, and sort it as serious harm or a nuisance. Serious harm means money, personal data, lock-out from a system you need, or records you cannot rebuild.",
            "Third, recognise the four ordinary routes by which harm arrives: phishing, payment diversion, reused or guessed passwords, and access that was never removed. The habit that defeats most of them is to check any request for money, passwords or changed details by another route, using a contact you already held. Fourth, choose changes that pass three tests: each reduces a serious harm, can be done this week, and has one owner and a date.",
            "Fifth, write each serious harm as a row that someone else could check: what is shared, who can get in, the worst realistic outcome, the change, and the owner with a date. Nuisances and projects for later go in a short note so nothing is lost.",
          ],
        },
        {
          heading: "Where people slip in the assessment",
          paragraphs: [
            "The questions that follow each offer three or four responses that a reasonable professional might choose. The wrong ones are not foolish. They are usually a response that feels helpful but trusts the message, a change that sounds thorough but cannot be done this week, or a row that admits a problem without letting anyone check it.",
            "Read each situation for the detail that decides it: who holds the access, what could be lost, and where a request came from. Then choose the response this course taught, and read the feedback on every question, including the ones you get right.",
          ],
        },
        {
          heading: "How the assessment is marked",
          paragraphs: [
            "There are eight questions, and you need six correct to pass. After you submit, each question shows whether your choice was right and the feedback for the option you chose. If you do not reach six, your answers stay on screen, and you can read the feedback, return to the lesson it points to, and try again.",
            "The pass mark is set so that one or two slips do not hold you back, but a pattern of trusting the message or choosing vague changes does. Those are the habits the final lesson depends on.",
          ],
        },
      ],
      workedExample: {
        title: "One situation, the whole method",
        inputLabel: "The situation",
        outputLabel: "What the team lead did",
        prompt:
          "Gareth leads a team of six at Moorside Accountancy. A bookkeeper, Chloe, left on Friday. On Monday a client emails from their usual address to say their bank has changed and asks for their tax refund to be paid to the new account. Chloe knew the password to the shared client portal.",
        output:
          "Gareth did not act on the email. He rang the client on the number in the client file, who confirmed they had not changed bank and had not sent the email. He reported it to report@phishing.gov.uk. He then added two rows to the team's exposure list. The client portal login, known to all six staff and to Chloe, could let someone change client bank details, so the change was to reset the password and give it only to current staff. Owner: Gareth Lewis, by Tuesday. Chloe's own account on the practice software had also not been removed, so the change was to remove it. Owner: Sunita Rao, by Monday afternoon.",
        reading: [
          "The email came from a real client address, so spotting it as a fake was never the defence. Gareth checked by another route, using the number in the client file, which is the habit from the third lesson.",
          "He then saw the wider issue. Chloe had left, and her knowledge of the shared portal password was access that was never removed. He labelled it, judged it serious harm because client bank details were involved, and wrote a change for this week with one owner and a date.",
          "His rows name what is shared, who can get in, the outcome, the change and the owner with a date, so anyone on the team could check on Tuesday that the work had been done.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, try one short case. Use the whole method above to decide.",
        check: {
          kind: "choose",
          prompt:
            "Alys, a team leader at Pennant Care, finds that the rota app has one login used by all twelve carers, and it shows clients' home addresses and key safe codes. Choose the entry she should put on her exposure list.",
          leftLabel: "Entry A",
          left: "Rota app: shared login, not ideal. Team to be reminded not to share the password.",
          rightLabel: "Entry B",
          right:
            "What is shared: the rota app login. Who can get in: all twelve carers and anyone they have told. Worst realistic outcome: client home addresses and key safe codes seen by someone who should not have them. The change: set up individual logins, which the app offers. Owner and date: Alys Morgan, by Friday.",
          correct: "right",
          why: "Entry B is a row someone else could check. It names who can get in, an outcome involving personal data and access to clients' homes, a specific change, and one owner with a day.",
          wrong:
            "Look again at Entry A. Not ideal does not say what could happen, and a reminder to the team has no owner or date. Entry B names the outcome, the change and the owner with Friday.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Answer all eight questions. Each describes a situation you have not yet seen. Choose the response this course would want in your team.",
        passMark: 6,
        questions: [
          {
            id: "new-starter",
            situation:
              "Owen starts on Monday as a receptionist at Hillcrest Veterinary Surgery. The practice management system can take a day to add a new user, so the practice manager, Rachel, suggests Owen uses her login for his first week and she will change the password afterwards.",
            question: "What should Rachel do?",
            options: [
              {
                id: "a",
                text: "Let Owen use her login for the week, then change the password on Friday.",
                feedback:
                  "This creates shared access. For a week nobody can tell whether Rachel or Owen made each change, and Owen can see everything Rachel can. The better move is to request Owen's own account now, and list the gap if there is one.",
              },
              {
                id: "b",
                text: "Request Owen's own account today, have him work alongside a colleague until it arrives, and note any shared login used in the meantime on the exposure list.",
                correct: true,
                feedback:
                  "That holds. Owen gets named access as soon as possible, nobody shares Rachel's permissions, and any temporary shared login is written down so it can be closed.",
              },
              {
                id: "c",
                text: "Let Owen use her login but ask him to keep the password private.",
                feedback:
                  "Asking Owen to keep it private does not change what it is. Two people using one login is shared access, and neither can be told apart in the records. Request Owen's own account instead.",
              },
            ],
          },
          {
            id: "first-priority",
            situation:
              "Idris, an office manager at Trent Valley Architects, has found three shared items: the Canva login used by the whole team, a spreadsheet of client home addresses shared with anyone with the link, and the guest wifi password printed on the meeting room wall. He has time to deal with one this week.",
            question: "Which item should Idris deal with first?",
            options: [
              {
                id: "a",
                text: "The Canva login, because the whole team uses it and a bad design could go out to a client.",
                feedback:
                  "A shared Canva login is at worst embarrassing and quick to put right, so it is a nuisance. The spreadsheet holds client personal data, which is serious harm and should come first.",
              },
              {
                id: "b",
                text: "The guest wifi password, because visitors can see it on the wall.",
                feedback:
                  "A guest wifi password is meant to be shared with visitors. It is not where the serious harm is. The spreadsheet of client home addresses is personal data open to anyone with the link.",
              },
              {
                id: "c",
                text: "The spreadsheet of client home addresses, because anyone with the link can see personal data about clients.",
                correct: true,
                feedback:
                  "That holds. Personal data about clients is one of the kinds of serious harm, and anyone with the link means Idris cannot say who has seen it. The other two are nuisances.",
              },
            ],
          },
          {
            id: "salary-change",
            situation:
              "Beth, the HR officer at Carrow Engineering, receives an email from a personal address signed by an engineer, Luke Farrant. It says he has changed bank and asks for this month's salary to go to a new account. Payroll closes tomorrow.",
            question: "What should Beth do?",
            options: [
              {
                id: "a",
                text: "Reply to the email asking Luke to confirm the new details, and update payroll if he does.",
                feedback:
                  "Replying goes back to the sender, who may be an attacker using Luke's name, and they will simply confirm. This trusts the message. Call Luke on the number in his HR record or speak to him in person.",
              },
              {
                id: "b",
                text: "Call Luke on the number in his HR record, or speak to him in person, before changing anything.",
                correct: true,
                feedback:
                  "That holds. Beth checks by another route, using a contact the company already held, which is the habit that stops payment diversion however genuine the email looks.",
              },
              {
                id: "c",
                text: "Update payroll because the email uses Luke's full name and staff number.",
                feedback:
                  "A name and a staff number are easy for an attacker to find. The defence is not whether the email looks right. Check by another route, using the number in Luke's HR record.",
              },
              {
                id: "d",
                text: "Call the phone number in the email's signature to check.",
                feedback:
                  "The number in the signature came from the message itself, so it may reach the attacker. This trusts the message. Use the number in Luke's HR record instead.",
              },
            ],
          },
          {
            id: "reused-password",
            situation:
              "Fiona, a project coordinator at Castlegate Events, gets an alert that someone signed in to her work email from another country overnight. She tells you she uses the same password for her work email and a shopping site that announced a breach last month.",
            question: "What is the best next step?",
            options: [
              {
                id: "a",
                text: "Change her work email password to a new one she uses nowhere else, turn on two-step verification, tell the IT provider, and change the password anywhere else she reused it.",
                correct: true,
                feedback:
                  "That holds. The likely route is a reused password, so a new unique password closes it, two-step verification protects against the next leak, and the IT provider can check what the intruder did.",
              },
              {
                id: "b",
                text: "Wait to see whether anything else unusual happens before acting.",
                feedback:
                  "Waiting leaves the intruder in her mailbox, where they can read client messages and send payment requests in her name. Change the password now, turn on two-step verification, and tell the IT provider.",
              },
              {
                id: "c",
                text: "Change the password on the shopping site only, because that is where the leak happened.",
                feedback:
                  "The leak has already happened. The same password now opens her work email, which is where the harm is. Change the work password to a new unique one and turn on two-step verification.",
              },
            ],
          },
          {
            id: "which-change",
            situation:
              "Dev Mistry, a team lead at Lowther Insurance Brokers, has the shared bank portal login on his serious harm list. He is choosing one change to make this week.",
            question: "Which proposal is a change for this week?",
            options: [
              {
                id: "a",
                text: "Buy a new firewall for the office network.",
                feedback:
                  "A firewall needs a budget and a supplier, and it does nothing about two people sharing one bank login. It is a project for later at best.",
              },
              {
                id: "b",
                text: "Remind everyone at the team meeting to be vigilant with the bank portal.",
                feedback:
                  "A reminder has no specific action, no owner and no date, and the login is still shared afterwards. It is an intention, not a change.",
              },
              {
                id: "c",
                text: "Review all financial systems in the new year.",
                feedback:
                  "A review in the new year is not this week, has no owner, and does not reduce the harm now. It belongs with projects for later.",
              },
              {
                id: "d",
                text: "Set up separate bank portal users for the two people who use it and turn on two-step verification for both. Owner: Dev Mistry, by Thursday.",
                correct: true,
                feedback:
                  "That holds. It reduces the serious harm directly, can be done this week without new money, and has one owner and a day.",
              },
            ],
          },
          {
            id: "best-row",
            situation:
              "Three colleagues at Northgate Library Trust have each written a row about the same problem: the shared login to the membership system. The trust's IT provider, who was not in the office, will act on whichever row is used.",
            question: "Which row could the IT provider act on without calling anyone?",
            options: [
              {
                id: "a",
                text: "Membership system: login shared, quite risky. IT to fix ASAP.",
                feedback:
                  "The IT provider would have to ask who shares the login, what the risk is, what fix is wanted and who to report back to. Quite risky and IT to fix are not an outcome or an owner.",
              },
              {
                id: "b",
                text: "What is shared: the membership system admin login. Who can get in: four library assistants and a volunteer who left in May. Worst realistic outcome: members' names, addresses and dates of birth seen or exported. The change: give each assistant their own login and remove the volunteer's access. Owner and date: Kofi Mensah, by Wednesday.",
                correct: true,
                feedback:
                  "That holds. The row names what is shared, who can get in, an outcome involving personal data, a specific change, and one owner with a day, so the IT provider can act on it and check it is done.",
              },
              {
                id: "c",
                text: "Membership system login: everyone should use their own account from now on. Team to sort.",
                feedback:
                  "This says what should happen but not who can get in today, what could go wrong, or who owns the change. The team is not a named owner.",
              },
            ],
          },
          {
            id: "contractor-leaves",
            situation:
              "A freelance designer, Tamsin, finished her contract with Harbour Street Marketing on Friday. She still has an account on the shared drive, and she was given the company's Instagram password in March.",
            question: "What should the account director do this week?",
            options: [
              {
                id: "a",
                text: "Leave both, because Tamsin was trustworthy and may come back for another project.",
                feedback:
                  "Trust is not the test. Access that was never removed is one of the four ordinary routes, and if Tamsin's own accounts are compromised the firm's data goes with them. Remove her drive account and change the Instagram password.",
              },
              {
                id: "b",
                text: "Remove Tamsin's shared drive account, change the Instagram password, and record both on the exposure list with an owner and a date.",
                correct: true,
                feedback:
                  "That holds. Both items are access that was never removed. Closing them this week, with an owner and a date, is exactly the kind of change the course teaches.",
              },
              {
                id: "c",
                text: "Email Tamsin to ask her not to use the accounts any more.",
                feedback:
                  "Asking does not remove the access. If her email or devices were compromised, the accounts would still be open. Remove the drive account and change the password.",
              },
            ],
          },
          {
            id: "passwords-in-list",
            situation:
              "Nia, an office manager at Elmbridge Solicitors, is writing her exposure list to send to the firm's IT provider. A colleague suggests she includes the actual shared passwords and the client account number for the bank portal, so the IT provider has everything in one place.",
            question: "What should Nia do?",
            options: [
              {
                id: "a",
                text: "Include them, because the IT provider is trusted and needs them to make the changes.",
                feedback:
                  "The list would become a new item of shared access, sitting in an email that could be forwarded or read by anyone who gets into the mailbox. The list describes access. It should never contain passwords or account numbers.",
              },
              {
                id: "b",
                text: "Include the passwords but leave out the account number.",
                feedback:
                  "Passwords in the list are still passwords in an email. The list should describe what is shared and who can get in, and never contain the passwords themselves.",
              },
              {
                id: "c",
                text: "Describe each item without passwords, account numbers or personal data, and give the IT provider access through the system itself when the change is made.",
                correct: true,
                feedback:
                  "That holds. The list describes access and does not contain it, so it can be shared with a manager or IT provider without creating a new exposure.",
              },
            ],
          },
        ],
        why: "You applied the method across new cases. You told named access from shared access, judged serious harm by the worst realistic outcome, checked requests by another route, chose changes with one owner and a date, and kept the list free of the access it describes.",
      },
      bridge:
        "You have passed the assessment. In the final lesson you write the exposure list for your own team, and that list is what your signed record shows.",
    },
    {
      id: "your-exposure-list",
      title: "Your exposure list",
      emphasis: "exposure",
      place:
        "This is the final lesson. You bring every move together in an exposure list for your own team, and the list you write here is the work that appears on your signed record.",
      sections: [
        {
          heading: "What your list covers",
          paragraphs: [
            "Your exposure list covers your own team's real access, found by walking the work and reading user lists as you did in the first lesson. It has a row for every item you judged serious harm. At least three of those rows carry a change for this week, each with one owner and a date. Below the rows, a short note records nuisances and projects for later.",
            "The list is written for your manager or your IT provider. They should be able to act on it without calling you, and they should be able to check on the due dates whether each change has been done. If a line would leave them asking what you meant, it is not finished.",
          ],
        },
        {
          heading: "How to write the fields",
          paragraphs: [
            "The form below has one field for each of the five parts, and a sixth for the note. Write one numbered line for each serious harm in every field, so that line 1 in What is shared matches line 1 in Who can get in, The change, and Owner and date. Three rows is the minimum. If you found more, include them.",
            "In What is shared, name the specific login, file, folder or device. In Who can get in, name the people or roles, including anyone who has left or any supplier. In Worst realistic outcome, name the money, personal data, lock-out or lost records. In The change, write a specific action. In Owner and date, write one person's name and a day or date for each row. In the note, list nuisances and any projects for later with who needs to decide.",
          ],
        },
        {
          heading: "Ready to act on and someone would have to ask",
          paragraphs: [
            "Before you submit, read each line and give it one of two labels. A line is Ready to act on when a manager or IT provider could take it as it stands and know exactly what is meant. Owner and date: Nadia Brooks, by Tuesday is ready to act on. The change: remove Leanne Shaw's account from the accounting software is ready to act on.",
            "A line is Someone would have to ask when the reader would need to come back to you. Owner: IT, Change: sort out, and Outcome: risky all leave the reader asking who, what or why. Rewrite any line with that label before you continue.",
          ],
        },
        {
          heading: "What the list must not contain or claim",
          paragraphs: [
            "Keep the list free of actual passwords, account numbers, card numbers and personal data about individuals. The list describes access and does not contain it. If you write the password to the bank portal into the list, the list itself becomes a new item of shared access.",
            "The list does not say that your team is secure, and it is not evidence of Cyber Essentials or any other scheme. It is a record of what you found and what you are changing, and your signed record says exactly that. It does not replace the advice of your IT provider or security team, and a sensible next step is to send it to them.",
          ],
        },
      ],
      workedExample: {
        title: "Maria's exposure list",
        inputLabel: "Her notes from the course",
        outputLabel: "The list she sent to the managing director",
        prompt:
          "Named access: Microsoft 365. Shared: bank portal (Nadia and me), Clients folder by link, former temp in accounting software, Instagram in team chat, courier login on a card. Serious harm: bank portal, Clients folder, former temp, courier login charges the company card. Nuisance: Instagram. Project for later: password manager.",
        output:
          "What is shared: 1. The bank portal login. 2. The Clients folder, set to anyone with the link. 3. The accounting software, where a former temp's account is still active. 4. The courier booking login.\nWho can get in: 1. Nadia Brooks and Maria Costa on one login. 2. Anyone sent the link, including two former account managers. 3. Leanne Shaw, a temp who left in June. 4. All nine staff, from a card by the printer.\nWorst realistic outcome: 1. A payment made to the wrong account with no way to tell who made it. 2. Client contact details and contracts seen outside the firm. 3. Invoices or supplier bank details changed. 4. Bookings charged to the company card by someone outside the team.\nThe change: 1. Separate logins and two-step verification for Nadia and Maria. 2. Share with the four account managers by name and switch off link sharing. 3. Remove Leanne Shaw's account and check for other former staff. 4. Change the password and give it only to the two people who book couriers.\nOwner and date: 1. Nadia Brooks, by Friday. 2. Maria Costa, by Wednesday. 3. Nadia Brooks, by Tuesday. 4. Maria Costa, by Thursday.\nNuisances and projects for later: The Instagram password in the team chat is a nuisance, to move into a password manager later. A team password manager is a project for later, awaiting a decision from the managing director.",
        reading: [
          "Each numbered line matches across the fields, so the managing director can read row 3 from left to right and know what is shared, who can get in, what could happen, what will be done, and who will do it by Tuesday.",
          "Every row is serious harm, and all four carry a change for this week. The list is honest about the Instagram account and the password manager, which are recorded rather than lost.",
          "There are no passwords, account numbers or client details in the list. It describes access and does not contain it, so it can be forwarded to the IT provider without creating a new exposure.",
        ],
      },
      practice: {
        intro:
          "Before you write your own list, mark each line of this draft from a colleague at Castlegate Events. The two labels are defined in the section above, and the repaired row from the last lesson is a good model.",
        check: {
          kind: "mark",
          prompt: "Mark each line as Ready to act on or Someone would have to ask.",
          passLabel: READY,
          failLabel: ASK,
          sentences: [
            {
              id: "owner-it",
              text: "Owner and date: IT, when they can.",
              fail: true,
              why: "IT is not one named person, and when they can is not a date, so the reader would have to ask.",
            },
            {
              id: "who-named",
              text: "Who can get in: the three event coordinators and a freelance photographer whose work ended in August.",
              fail: false,
              why: "This line names who can get in, including someone whose work has ended, so it is ready to act on.",
            },
            {
              id: "outcome-vague",
              text: "Worst realistic outcome: bad.",
              fail: true,
              why: "Bad does not say whether money, personal data, lock-out or lost records are at stake, so the reader would have to ask.",
            },
            {
              id: "change-specific",
              text: "The change: remove the photographer's access to the booking system and turn on two-step verification for the three coordinators.",
              fail: false,
              why: "This line names specific actions and who they apply to, so it is ready to act on.",
            },
          ],
          why: "That is right. The lines naming who can get in and the specific change are ready to act on, while IT when they can and bad would leave the reader asking who, when and why.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the exposure list for your team. Use one numbered line per serious harm in each field, with at least three rows, and at least three changes for this week. Do not include any passwords, account numbers or personal data.",
        fields: [
          {
            id: "shared",
            label: "What is shared",
            hint: "One numbered line per serious harm, naming the specific login, file, folder or device.",
            min: 40,
            any: ["login", "password", "link", "account", "folder", "portal", "drive", "access", "mailbox", "inbox", "device", "laptop", "file", "spreadsheet", "user"],
            missing:
              "What is shared does not yet name a specific item. Write one numbered line per serious harm, naming the login, password, account, folder, file or device, for example the bank portal login.",
          },
          {
            id: "who",
            label: "Who can get in",
            hint: "The people or roles who can use each item today, including leavers and suppliers.",
            min: 30,
            any: ["anyone", "former", "left", "leaver", "contractor", "supplier", "temp", "staff", "manager", "officer", "administrator", "assistant", "coordinator", "volunteer", "colleague", "people", "team", "all ", "both"],
            missing:
              "Who can get in does not yet say who holds the access. Name the people or roles for each row, and include anyone who has left or any supplier, for example the two administrators and a temp who left in June.",
          },
          {
            id: "outcome",
            label: "Worst realistic outcome",
            hint: "For each row, the money, personal data, lock-out or lost records at stake.",
            min: 30,
            any: ["payment", "money", "paid", "pay ", "invoice", "bank", "card", "refund", "personal data", "details", "addresses", "records", "locked out", "lock-out", "lose", "lost", "contracts", "salary", "seen", "exported"],
            missing:
              "Worst realistic outcome does not yet name a serious harm. For each row, say whether money, personal data, lock-out from a system you need, or records you cannot rebuild are at stake.",
          },
          {
            id: "change",
            label: "The change",
            hint: "For each row, a specific action someone could do this week.",
            min: 40,
            any: ["remove", "turn on", "two-step", "2-step", "two step", "own login", "separate", "change the password", "reset", "switch off", "share with", "by name", "back up", "backup", "confirm", "give each", "individual"],
            missing:
              "The change does not yet say what will be done. Write a specific action for each row, such as remove the leaver's account, turn on two-step verification, or share the folder with named people.",
          },
          {
            id: "owner",
            label: "Owner and date",
            hint: "For each row, one person's name and a day or date. Not IT, everyone or the team.",
            min: 20,
            rule: "fact",
            any: [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
              "january",
              "february",
              "march",
              "april",
              "may",
              "june",
              "july",
              "august",
              "september",
              "october",
              "november",
              "december",
            ],
            missing:
              "Owner and date does not yet give a day or date. For each row, write one person's name and when the change will be done, for example Nadia Brooks, by Tuesday.",
          },
          {
            id: "later",
            label: "Nuisances and projects for later",
            hint: "Items that are only a nuisance, and changes that need a budget or a decision, with who needs to decide.",
            min: 20,
            any: ["nuisance", "later", "project", "decision", "budget", "decide", "none"],
            missing:
              "Nuisances and projects for later is still empty of substance. List any nuisance items and any project for later with who needs to decide, or write none found if there are none.",
          },
        ],
        why: "Your list names each serious harm, who can get in, the worst realistic outcome, and a change with one owner and a date, and it keeps a note of nuisances and projects for later. A manager or IT provider could act on it without calling you.",
      },
      bridge:
        "Your exposure list is ready. Sign your name below, and your record will show the list as you wrote it; check on each change on its due date.",
    },
  ],
};
