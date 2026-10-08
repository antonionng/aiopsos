/*
Course: Data Skills for People Who Are Not Analysts
Slug: data-skills-for-people-who-are-not-analysts
For: Managers, coordinators and specialists who are sent tables, dashboards and summary figures and are
  expected to act on them, but who do not build the numbers themselves. They can open a spreadsheet, sort
  and filter a column, and read a simple chart. No statistics are needed.
Outcome: Given a figure or a table from their own work, the learner states the full claim, records its
  source, definition, date and owner, checks the rows behind it, judges whether the comparison is fair,
  and sends the data owner one question that can be answered with a fact before acting.
Artefact: The data checklist. Five questions in the learner's own words, applied to one real table,
  ending in a decision of Safe to use, Safe to use with a caveat, or Ask first.
Record sentence: Wrote a five-question data checklist and used it on a real table from their own work
  to decide whether the figures were safe to act on.
Lessons (id, title, move, interaction, pass rule):
  1. a-number-is-a-claim, A number is a claim, restate a figure as a full claim, practice choose / check mark,
     every sentence marked correctly as States the claim fully or Leaves the claim open.
  2. where-the-number-came-from, Where the number came from, record source, definition, date and owner,
     practice mark / check choose, the note with all four facts is chosen.
  3. filters-and-missing-rows, Filters and missing rows, tell a complete figure from one with rows missing,
     practice choose / check mark, every description marked correctly as Counts every row or Rows are missing.
  4. a-fair-comparison, A fair comparison, apply the four tests of a fair comparison, practice choose / check
     mark, every comparison marked correctly as Fair comparison or Unfair comparison.
  5. the-question-before-you-act, The question before you act, write one answerable message to a data owner,
     practice choose / check edit, the edit keeps the topic and adds the decision, its date, the restated
     claim and a factual question about definition, rows or comparison.
  6. using-every-check-together, Using every check together, apply the whole method to new situations,
     practice mark / check scenario of eight questions, six of eight correct to pass.
  7. your-checklist, Your checklist, write and apply the checklist, build, every field carries a rule or an
     any list: five checklist questions covering the five areas, an applied claim with a concrete fact, an
     applied source, a row count, a fairness judgement, a question, and a decision.
Sources: UK Statistics Authority, Code of Practice for Statistics. Government Analysis Function guidance on
  presenting data and on quality in analysis. Tim Harford, How to Make the World Add Up (2020). Tom Chivers
  and David Chivers, How to Read Numbers (2021). Microsoft Support documentation for the Excel SUBTOTAL and
  AGGREGATE functions.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const FULL = "States the claim fully";
const OPEN = "Leaves the claim open";
const USABLE = "Good enough to use";
const UNKNOWN = "Not yet known";
const EVERY_ROW = "Counts every row";
const MISSING = "Rows are missing";
const FAIR = "Fair comparison";
const UNFAIR = "Unfair comparison";

export const COURSE: CourseContent = {
  slug: "data-skills-for-people-who-are-not-analysts",
  hours: 2.5,
  artefact: {
    lessonId: "your-checklist",
    title: "The data checklist",
    recordLine:
      "Wrote a five-question data checklist and used it on a real table from their own work to decide whether the figures were safe to act on.",
  },
  lessons: [
    {
      id: "a-number-is-a-claim",
      title: "A number is a claim",
      emphasis: "claim",
      place:
        "This is the first of seven lessons. It changes how you read every figure in the rest of the course, because each later lesson tests one part of the claim you learn to write here.",
      sections: [
        {
          heading: "A figure on its own says very little",
          paragraphs: [
            "Most of the numbers you are sent at work arrive as short lines: complaints are up 30%, turnover is 18%, late deliveries are down to 4%. Each of those lines sounds like a fact, and each one is quoted in meetings as if it were. On its own, though, a figure only tells you that somebody counted something and got a result. It does not tell you what was counted, which people or things were included, over what stretch of time, or what the result is being compared with.",
            "A number becomes useful when you can state the full claim it makes. In this course a claim is the sentence a number stands for once every part has been written out. 'Complaints are up 30%' is a figure. 'The number of complaints logged in the customer system in March was 30% higher than in February' is a claim. The second sentence can be checked, argued with, and acted on. The first can only be repeated.",
          ],
        },
        {
          heading: "The four parts of a claim",
          paragraphs: [
            "A full claim answers four questions. What was counted: complaints, orders, days of absence, pounds of revenue. Of whom or of what: which customers, which sites, which staff, which products. Over what period: a week, a month, a quarter, and which one. Compared with what: the previous period, the same period last year, a target, another team.",
            "You do not need all four answers to be impressive. You need them to be written down, so that the reader is not left to supply them. When you do not know one of the parts, write 'Not stated' against it. That short phrase is honest, and it tells the next reader exactly where the gap is.",
          ],
          beforeAfter: {
            before: "Complaints are up 30%.",
            after:
              "The number of complaints logged in the customer system in March was 30% higher than in February. Complaints made by phone and not logged are not stated.",
            reading:
              "The first line leaves every part open. The second names what was counted, where it was recorded, the period and the comparison, and it says plainly which complaints may be missing.",
          },
        },
        {
          heading: "What an incomplete claim is not",
          paragraphs: [
            "An incomplete claim is not a wrong claim. The line 'late deliveries are down to 4%' may be perfectly true. The trouble is that it lets each reader fill the gaps with an assumption of their own. The finance director reads it as all orders, the Bristol site manager reads it as her site, and the customer services lead reads it as late against the date the customer asked for. Three people then act on the same figure for three different reasons.",
            "Nor is restating a claim a way of catching colleagues out. Most short figures are short because the person who wrote them knew the context and assumed you did too. Writing out the claim is a courtesy to the next reader and a protection for you, because it shows what you understood the number to mean at the moment you acted on it.",
          ],
        },
        {
          heading: "Two labels for every sentence",
          paragraphs: [
            "For the rest of this lesson you will judge sentences that contain figures with one of two labels. A sentence States the claim fully when it says what was counted, of whom or of what, over what period, and compared with what. It may be long, and it may admit that one part is not stated, but a reader could not reasonably take it to mean something else.",
            "A sentence Leaves the claim open when one or more of the four parts is missing and not flagged, so that the reader has to guess. Words such as 'much higher', 'the north', 'recently' or 'the usual figure' are warning signs, because each one hides a part of the claim behind a word that sounds precise.",
            "The usual mistake is to judge a sentence by how confident it sounds. A sentence with a decimal point and a percentage sign can still leave the claim open, and a plain sentence with no percentage at all can state a claim fully. Look for the four parts, not for the polish.",
          ],
        },
      ],
      workedExample: {
        title: "Late deliveries at Calder Freight",
        inputLabel: "The line in the weekly operations email",
        prompt:
          "From: Operations reporting\nTo: Regional managers\nSubject: Weekly figures\n\nLate deliveries are down to 4%. Good week, well done all.",
        outputLabel: "The claim Priya Nair wrote down after asking",
        output:
          "Of orders dispatched from the Leeds warehouse in the week ending 14 June, 4% arrived after the date promised to the customer, compared with 7% in the previous week. Orders from the Bristol warehouse are not included, because its data has not been loaded since May.",
        reading: [
          "Priya Nair is the regional operations manager for Calder Freight. She was about to decide whether to move two drivers between sites, so she asked the reporting team what the 4% covered before she replied to the email.",
          "The short line was true. What it counted was orders arriving after the promised date, the period was the week ending 14 June, and the comparison was the previous week. None of that was in the email, but all of it was easy to find once she asked.",
          "The part that changed her decision was 'of whom or of what'. The figure covered Leeds only. Bristol, the site with most of the customer complaints, was not in it at all, so the good news said nothing about the problem she was trying to solve.",
        ],
      },
      practice: {
        intro:
          "Two colleagues at Fenwick Home each restated the same line from a sales pack: 'Repeat orders are up 9%.' Use the four parts from the lesson to decide which one states the claim fully. The worked example above is still there if you want to compare.",
        check: {
          kind: "choose",
          prompt: "Choose the restatement that states the claim fully.",
          leftLabel: "Restatement A",
          left: "Repeat orders are up 9% this quarter, which is very encouraging for the online shop and shows the loyalty scheme is working.",
          rightLabel: "Restatement B",
          right:
            "Of customers who bought from the online shop between April and June, 9% more placed a second order within 60 days than customers who bought between January and March. Whether phone orders are included is not stated.",
          correct: "right",
          why: "Restatement B names what was counted, which customers, the period and the comparison, and it flags the one part that is not stated. Restatement A adds an opinion about the loyalty scheme but still leaves the claim open.",
          wrong:
            "Look again at Restatement A. 'This quarter' and 'up 9%' do not say which customers were counted or what the rise is compared with, and the comment about loyalty is an opinion, not a part of the claim. Restatement B states each part and marks the gap.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These four sentences come from the monthly people report at Ashdown Housing Association. Mark each sentence with the label it deserves.",
        passLabel: FULL,
        failLabel: OPEN,
        sentences: [
          {
            id: "turnover",
            text: "Staff turnover is 18%.",
            fail: true,
            why: "It gives a figure but does not say who is counted, over what period, or compared with what, so it leaves the claim open.",
          },
          {
            id: "turnover-full",
            text: "Of permanent staff in post on 1 April last year, 18% had left by 31 March this year, compared with 14% the year before.",
            fail: false,
            why: "Who was counted, what was counted, the period and the comparison are all in this sentence, so it states the claim fully.",
          },
          {
            id: "sickness",
            text: "Sickness absence is much higher in the north.",
            fail: true,
            why: "'Much higher' and 'the north' leave the reader to supply the figure, the period and the definition of the north, so the claim is left open.",
          },
          {
            id: "sickness-full",
            text: "In the three northern offices, staff took an average of 6.2 days of sickness absence each between January and June, compared with 4.1 days across the other offices.",
            fail: false,
            why: "It names the offices, the measure, the period and what it is compared with, so it states the claim fully.",
          },
        ],
        why: "That is the right reading. The two short sentences give a figure or a feeling and leave the reader to guess the rest, while the two longer sentences state who was counted, what, when and against what, so anyone reading the report would take them the same way.",
      },
      bridge:
        "Once you can state the claim, the next question is where the number came from, and the next lesson gives you four facts to find out about any figure before you rely on it.",
    },
    {
      id: "where-the-number-came-from",
      title: "Where the number came from",
      emphasis: "came",
      place:
        "In the first lesson you learned to write out the claim a figure makes. This lesson looks behind the claim, at the four facts that tell you whether the figure can carry the weight you are about to put on it.",
      sections: [
        {
          heading: "Four facts behind every figure",
          paragraphs: [
            "Every number you are sent has a source, a definition, a date and an owner. The source is the system, survey or spreadsheet it was taken from, such as the billing system, the HR system or the staff survey. The definition is exactly what counts and what does not. The date is when the data was taken, which may be weeks before the report reached you. The owner is the person or team who can answer questions about it.",
            "These four facts are not paperwork for its own sake. They are what you need if the figure is ever questioned, and they are what the next person will need if they want to update it next month. A figure with all four facts written beside it can be reused. A figure without them has to be rediscovered every time someone doubts it.",
          ],
        },
        {
          heading: "The definition does most of the damage",
          paragraphs: [
            "Of the four facts, the definition is the one that most often changes a decision. A 'customer' may mean an account or a company. A 'late' delivery may mean late against the date promised or the date the customer asked for. A 'leaver' may or may not include people at the end of a fixed-term contract. Two teams can report different figures for the same thing, and both can be right, because they are counting different things under the same word.",
            "The date comes a close second. A dashboard refreshed on the first of the month shows figures that are up to four weeks old by the end of it. A report assembled on Friday from an extract taken on Monday does not include anything that happened in between. Neither is wrong, but either can mislead if you assume the figure is from today.",
          ],
          beforeAfter: {
            before: "Waiting time: 18 days (from the system).",
            after:
              "Waiting time: 18 days. Source: the booking system. Definition: days from referral to first appointment, for referrals that have had a first appointment. Date: extract taken on 3 June. Owner: the performance team.",
            reading:
              "The first line names no system, no definition and no date. The second gives all four facts, and its definition shows that people still waiting are left out of the average, which is worth knowing before anyone calls 18 days good news.",
          },
        },
        {
          heading: "This is not an audit of your colleagues",
          paragraphs: [
            "Asking where a number came from is not the same as distrusting the person who sent it. Most errors in workplace reports are honest ones: an old extract reused, a definition that changed when a system was upgraded, a filter left on from last month. The person who built the report is usually the first to want to know.",
            "It also does not mean you need to see the raw data or rebuild the figure yourself. You are asking for four short facts that the owner already knows. A good owner can answer in two minutes, and if nobody can answer at all, that is itself the most important thing you will learn about the figure.",
          ],
        },
        {
          heading: "Good enough to use, or not yet known",
          paragraphs: [
            "In this lesson you will judge a note about a figure with one of two labels. A note is Good enough to use when it gives all four facts: the source, the definition, the date and the owner. It does not have to be long, and the facts do not have to be reassuring. A note that says the extract is five weeks old is still good enough to use, because you now know how old it is.",
            "A note is Not yet known when any of the four facts is missing. The most common version of this is the note that sounds official without saying anything: 'it's the official figure', 'it's from the system', 'it was in last week's pack'. Each of those tells you the figure has been repeated, not where it came from.",
            "The usual mistake is to accept the figure because of who sent it. A number from the finance director still has a source, a definition, a date and an owner, and the finance director would expect you to know them before you base a plan on it.",
          ],
        },
      ],
      workedExample: {
        title: "Active customers at Thornbury Software",
        inputLabel: "The dashboard tile",
        prompt: "Active customers: 12,480\nUp 3% on last month",
        outputLabel: "The note Marcus Webb wrote after asking",
        output:
          "Source: the billing system.\nDefinition: an account with at least one paid invoice in the last ninety days. One company with three accounts counts three times.\nDate: extracted on the first of the month, so it is up to four weeks old.\nOwner: the business intelligence team, through the data requests channel.",
        reading: [
          "Marcus Webb leads the account management team at Thornbury Software. He was planning how many accounts each of his five managers should hold next quarter, and he started from the dashboard tile.",
          "The source and the owner took one message to find. The date explained why the figure had not moved after a large client left mid-month. The definition was the surprise: the tile counts billing accounts, so a group with a separate account for each subsidiary appears several times.",
          "The figure is fine for tracking a trend from month to month. It is the wrong figure for dividing work among account managers, who look after companies rather than billing accounts. Marcus asked the business intelligence team for a count of companies instead, and the plan used that.",
        ],
      },
      practice: {
        intro:
          "Here are four notes that colleagues at Ridgeway Council wrote about figures in a service report. Mark each note using the two labels from the lesson. The definitions are in the section above if you want to read them again.",
        check: {
          kind: "mark",
          prompt: "Mark each note as Good enough to use or as Not yet known.",
          passLabel: USABLE,
          failLabel: UNKNOWN,
          sentences: [
            {
              id: "missed-bins",
              text: "Missed bin collections: from the crew app, counting reports logged by residents, extract taken on 2 September, owned by the waste services analyst.",
              fail: false,
              why: "It gives the source, what counts, the date and the owner, so it is good enough to use.",
            },
            {
              id: "footfall",
              text: "Library footfall: the official figure, as reported to committee.",
              fail: true,
              why: "'The official figure' gives no source, no definition, no date and no owner, so all four facts are not yet known.",
            },
            {
              id: "calls",
              text: "Calls answered: from the telephony system, calls answered within the opening hours, extract taken last month.",
              fail: true,
              why: "It gives a source and a definition, but 'last month' is not a date and there is no owner, so the note is not yet known.",
            },
            {
              id: "permits",
              text: "Parking permits issued: from the permits database, counting permits paid for and not cancelled, extract taken on 30 August, owned by the parking team.",
              fail: false,
              why: "All four facts are there, including a definition that says cancelled permits are left out, so it is good enough to use.",
            },
          ],
          why: "That is right. The notes on bins and permits give all four facts, while the notes on footfall and calls each leave at least one fact out, so they are not yet known.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two colleagues at Millbrook Health Partnership each noted where the same waiting-time figure came from. Choose the note that is good enough to use.",
        leftLabel: "Note A",
        left: "From the system, it's the official figure, and it was in last week's pack.",
        rightLabel: "Note B",
        right:
          "Source: the booking system. Definition: days from referral to first appointment, for referrals that have had a first appointment; referrals still waiting are not included. Date: extract taken on 3 June. Owner: the performance team.",
        correct: "right",
        why: "Note B gives the source, the definition, the date and the owner, and its definition reveals that people still waiting are left out. That is exactly the kind of detail the four facts are there to bring out.",
        wrong:
          "Note A does not say which system, what counts, when it was taken or who owns it. 'The official figure' and 'last week's pack' only tell you it has been repeated. Note B gives all four facts, so it is the one good enough to use.",
      },
      bridge:
        "The definition in Note B hinted that some rows were left out of the figure, and the next lesson looks at the ordinary ways rows go missing without anyone noticing.",
    },
    {
      id: "filters-and-missing-rows",
      title: "Filters and missing rows",
      emphasis: "rows",
      place:
        "You can now state a claim and say where it came from. This lesson covers the most common way a correct-looking total turns out to be wrong, which is that some of the rows behind it are not there.",
      sections: [
        {
          heading: "A total is only as complete as its rows",
          paragraphs: [
            "Almost every figure you are sent is built from rows: one row per order, per invoice, per ticket, per member of staff. A total adds them up, an average divides by how many there are, and a percentage compares one group of rows with another. If some rows are missing, the result is still a clean, confident number. Nothing in the cell tells you that it was calculated from part of the list.",
            "This is why the count of rows matters as much as the figure itself. If you know there should be 1,247 orders and the sheet has 1,000, you know something is wrong before you look at a single value. If you do not know how many there should be, you cannot tell a complete total from a partial one.",
          ],
        },
        {
          heading: "Five ordinary ways rows go missing",
          paragraphs: [
            "Rows go missing in ordinary ways, and none of them produces an error message. A filter is left on in a spreadsheet, so only some regions or statuses are shown. An export stops at a fixed number of rows, often a round number such as 1,000 or 5,000. A date range cuts off the last few days of a period because the extract was taken before they were loaded.",
            "Two more are quieter still. An average skips blank cells, so if cancelled orders have no value, the average order value is worked out from the orders that were not cancelled. And some systems quietly drop records that fail a rule, such as a missing postcode or a customer with no account number, so those records never reach the report at all.",
          ],
        },
        {
          heading: "Hidden rows and two different totals",
          paragraphs: [
            "Spreadsheets add a twist of their own. According to Microsoft's support documentation for Excel, a plain SUM adds every row in its range, including rows you cannot see. The SUBTOTAL function leaves out rows hidden by a filter, and with the function codes from 101 upward it also leaves out rows hidden by hand. AGGREGATE can be set to ignore hidden rows as well. So two cells in the same workbook can show different totals for what looks like the same list, and both are doing exactly what they were told.",
            "You do not need to learn these functions to use this course. You only need to know that a filtered or hidden sheet can give two answers, and to ask which one you are looking at. A quick test is to clear every filter and see whether the row count at the bottom of the window changes.",
          ],
          beforeAfter: {
            before: "Total overdue: £46,300 (from the sheet Tom sent).",
            after:
              "Total overdue: £46,300 across 212 invoices. The finance system shows 212 overdue invoices on the same date, and no filter is on in the sheet.",
            reading:
              "The first line gives a total and nothing to check it against. The second gives the row count and says it matches the source, so you know the total includes every invoice it should.",
          },
        },
        {
          heading: "Counts every row, or rows are missing",
          paragraphs: [
            "In this lesson you will judge a figure with one of two labels. A figure Counts every row when all the rows its definition says it should include are included, and there is some sign that this was checked, such as a row count that matches the source system. A figure is marked Rows are missing when any rows that should be there are not, whether because of a filter, an export limit, a date range, blanks or a rule.",
            "This is not a reason to distrust every table. A figure that has been filtered on purpose, in line with its definition, still counts every row it should. Headcount taken from the HR system with part-time staff included, as the definition says, is complete. The question is always whether the rows that are missing are rows the claim says should be there.",
            "The usual mistake is to take a round number of rows as a sign of tidiness. A sheet with exactly 1,000 or exactly 5,000 rows is the most common sign of an export that stopped at its limit, and it should make you look harder, not less.",
          ],
        },
      ],
      workedExample: {
        title: "The quarterly sales table at Linden & Marsh",
        inputLabel: "The sales table as sent",
        prompt:
          "Q2 orders, all regions\nRows: 1,000\nTotal order value: £182,000\nAverage order value: £188\nFilter on Region: (All) except 'Unknown'",
        outputLabel: "What Hannah Cole found in five minutes",
        output:
          "The table has exactly 1,000 rows. The export tool has a limit of 1,000 rows, and the sales system shows 1,247 orders for the quarter. The Region column has a filter set to exclude 'Unknown', which hides 64 orders. The average order value skips 38 rows where the value is blank because the order was cancelled.",
        reading: [
          "Hannah Cole manages the inside sales team at Linden & Marsh, a building supplies wholesaler. She was about to set next quarter's targets from this table, so she spent five minutes checking the rows before she used the total.",
          "The round number of rows was the first clue. She compared it with the order count in the sales system and found 247 orders had never reached the sheet. Clearing the filters showed a second gap, the orders with no region. Reading the average showed a third, the cancelled orders with blank values.",
          "None of these produced an error, and none of them was anybody's fault. Together they meant the total was too low and the targets built on it would have been too easy. She asked for a full export, and the targets were set from that.",
        ],
      },
      practice: {
        intro:
          "Two colleagues at Oakfield Lettings each sent a total of new tenant enquiries for August. Choose the one whose note shows the figure counts every row. The five ways rows go missing are in the section above.",
        check: {
          kind: "choose",
          prompt: "Choose the note that shows the figure counts every row.",
          leftLabel: "Note from Sam",
          left: "The export has 842 rows, and the lettings system report for the same dates shows 842 enquiries. No filter is on in the sheet.",
          rightLabel: "Note from Jess",
          right: "I took the total from the sheet you sent last week. It looked complete and there were no error messages.",
          correct: "left",
          why: "Sam compared the row count with the source system and checked the filters, which is what the lesson asked for. Jess relied on the sheet looking complete, and missing rows never produce an error message.",
          wrong:
            "Look again at Jess's note. 'It looked complete' is not a check, because a filter, an export limit or a short date range all leave a clean-looking sheet. Sam's note matches the row count to the source, so it shows every row is counted.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A colleague at Pennine Water Services describes how four figures in a monthly report were produced. Mark each description with the label it deserves.",
        passLabel: EVERY_ROW,
        failLabel: MISSING,
        sentences: [
          {
            id: "ledger",
            text: "The total of overdue invoices was taken from the full ledger export, and the row count matches the number shown in the finance system.",
            fail: false,
            why: "The row count was checked against the source, so the figure counts every row it should.",
          },
          {
            id: "closed",
            text: "The average response time was worked out after filtering the sheet to show only tickets marked 'Closed'.",
            fail: true,
            why: "The filter removes every ticket that is still open, and those may be the slowest, so rows are missing.",
          },
          {
            id: "cap",
            text: "The export was capped at 5,000 rows, and the export returned exactly 5,000.",
            fail: true,
            why: "An export that stops exactly at its cap has almost certainly left rows behind, which is the warning sign from the worked example.",
          },
          {
            id: "headcount",
            text: "Headcount was taken from the HR system on the last day of the month, including part-time and fixed-term staff, as the report's definition says.",
            fail: false,
            why: "The figure follows its definition and includes the groups it names, so nothing the claim needs is left out.",
          },
        ],
        why: "That is the right reading. The ledger total and the headcount include every row their definitions call for, while the closed-tickets filter and the capped export both leave rows out without any error to warn you.",
      },
      bridge:
        "Even a complete figure can mislead when it is set beside the wrong comparison, and the next lesson gives you four tests for telling a fair comparison from an unfair one.",
    },
    {
      id: "a-fair-comparison",
      title: "A fair comparison",
      emphasis: "fair",
      place:
        "The fourth part of every claim is what it is compared with. This lesson deals with that part, because it is where most confident conclusions at work go wrong.",
      sections: [
        {
          heading: "Every decision rests on a comparison",
          paragraphs: [
            "Very few decisions are made on a single number. You compare this month with last month, this team with that one, the weeks before a change with the weeks after it, or the result with a target. The comparison is what turns a figure into a conclusion: sales are falling, the new rota is working, the Harbour Street branch has a problem.",
            "Because the conclusion comes from the comparison, an unfair comparison produces a confident conclusion that is not supported. The arithmetic can be perfect and the conclusion still wrong, because the two sides were never measuring the same thing in the same way.",
          ],
        },
        {
          heading: "Four tests of a fair comparison",
          paragraphs: [
            "A comparison is fair when it passes four tests. First, both sides are counted the same way, with the same definition, from the same kind of source. Second, the periods are of the same length and are alike in the ways that matter, so a short month is not set against a long one and a week with a bank holiday is not set against a normal week.",
            "Third, both groups are big enough that a small change is not just chance. If a team of six has one error one month and two the next, the error rate has doubled, but a single case has done it. Fourth, a percentage is shown with the numbers behind it. A 50% rise from two to three reads very differently from a 50% rise from 2,000 to 3,000, and the percentage alone hides which one you are looking at.",
            "A useful extra check, where you can get it, is a group that did not change. If complaints rose at the branch that changed its booking system, look at the branches that did not. If they rose by the same proportion, the change probably was not the cause.",
          ],
        },
        {
          heading: "Unfair is not dishonest",
          paragraphs: [
            "Calling a comparison unfair is not an accusation. Most unfair comparisons happen because someone put two numbers side by side under time pressure without asking whether they were alike. The survey question was reworded, the team was split in two, a new site opened halfway through the year. The person who built the slide often knows these things and simply did not think to say them.",
            "What makes the judgement useful is saying what would make the comparison fair. 'Unfair, because the months are different lengths' becomes 'compare average complaints per trading day instead'. 'Unfair, because the team is small' becomes 'show the numbers and look at six months either side'. A judgement with a fix attached is something the owner can act on.",
          ],
          beforeAfter: {
            before: "Our smallest team's error rate rose by 50%.",
            after:
              "The Returns team, which has five staff, logged three errors in May and two in April. That is a rise of one error, and over the last six months the team has logged between one and four errors each month.",
            reading:
              "The first line gives a percentage that sounds alarming and hides the numbers behind it. The second shows the counts and a longer run of months, and it becomes clear that the change is within the team's normal range.",
          },
        },
        {
          heading: "Fair comparison, unfair comparison, and what would fix it",
          paragraphs: [
            "In this lesson you will judge a comparison with one of two labels. A Fair comparison passes all four tests: the same counting, periods that are alike, groups big enough to trust, and the numbers shown behind any percentage. An Unfair comparison fails at least one of them. When you mark a comparison unfair, you should be able to say in a sentence what would make it fair.",
            "The usual mistake is to check the arithmetic and stop. People confirm that three to six really is a doubling, or that 62 to 71 really is nine points, and then accept the conclusion. The arithmetic is almost never where the problem lies. The problem is whether the two numbers deserved to be set side by side at all.",
          ],
        },
      ],
      workedExample: {
        title: "Complaints at the Harbour Street branch",
        inputLabel: "The headline in the service report",
        prompt:
          "Harbour Street: complaints doubled after the new booking system went live. Recommend pausing the rollout to other branches.",
        outputLabel: "What Daniel Osei found before the meeting",
        output:
          "Harbour Street had three complaints in the month before the system went live and six in the month after. The month before was February and the month after was March, which has more trading days. Across all eleven branches, none of which had changed system, complaints rose by a similar proportion in March.",
        reading: [
          "Daniel Osei is the area manager for Westmere Opticians. The report recommended pausing a rollout he was responsible for, so he read the comparison before the Thursday meeting.",
          "The headline was arithmetically correct. Three to six is a doubling. It still failed three of the four tests. The numbers were small enough that a few customers on a bad day could explain the change. February and March are different lengths. And the percentage had been shown without the counts behind it.",
          "The branches that had not changed system were the decisive check. Their complaints rose by a similar proportion in the same month, so the new system was unlikely to be the cause. A fair version would compare several months either side of the change, per trading day, with the other branches alongside. Daniel asked for that, and the rollout went ahead.",
        ],
      },
      practice: {
        intro:
          "Two versions of the same comparison appeared in drafts of a report at Greystone Leisure Centres. Choose the fair one, using the four tests from the lesson.",
        check: {
          kind: "choose",
          prompt: "Choose the comparison that passes all four tests.",
          leftLabel: "Version A",
          left: "Swimming lesson bookings rose 40% after the new online booking page launched in January.",
          rightLabel: "Version B",
          right:
            "Swimming lesson bookings were 1,120 in January to March, compared with 1,050 in the same three months last year, counted from the same booking system. The new online booking page launched in January.",
          correct: "right",
          why: "Version B compares periods of the same length from the same source, and it shows the numbers behind the change. Version A gives a percentage with no counts and no stated comparison period, so it could be comparing January with a quiet December.",
          wrong:
            "Look again at Version A. A 40% rise with no counts and no stated period fails two tests, and January against December would be unfair because of the holiday. Version B uses the same months a year apart, from the same system, with the numbers shown.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "These four comparisons come from a regional manager's slides at Kestrel Retail. Mark each comparison with the label it deserves.",
        passLabel: FAIR,
        failLabel: UNFAIR,
        sentences: [
          {
            id: "price",
            text: "Sales in the four weeks after the price change were 12% lower than in the four weeks before, and the same four weeks last year show no such fall.",
            fail: false,
            why: "The periods are the same length and there is a check against the same weeks last year, so both sides are counted the same way.",
          },
          {
            id: "survey",
            text: "Staff satisfaction rose from 62% to 71%, although the survey question was reworded this year.",
            fail: true,
            why: "A reworded question means the two figures measure different things, so the comparison is unfair.",
          },
          {
            id: "small-team",
            text: "Our smallest team's error rate rose by 50%.",
            fail: true,
            why: "A 50% rise in a small team may be one or two cases, and the numbers behind the percentage are not shown, so the comparison is unfair.",
          },
          {
            id: "call-centres",
            text: "The two call centres handled 4,100 and 4,300 calls in June, using the same definition of a resolved call, and resolved 81% and 79% respectively.",
            fail: false,
            why: "Similar volumes, the same month and the same definition mean the period, the counting and the size of each group all match.",
          },
        ],
        why: "That is the right reading. The price comparison and the call-centre comparison pass all four tests, while the reworded survey fails on counting the same way and the small team's percentage fails on size and on hiding its numbers.",
      },
      bridge:
        "Knowing that a figure may be incomplete or unfair is only useful if you ask the right question before you act, and the next lesson shows you how to put that question to the data owner in one short message.",
    },
    {
      id: "the-question-before-you-act",
      title: "The question before you act",
      emphasis: "question",
      place:
        "The first four lessons gave you ways to find doubts about a figure. This lesson turns those doubts into a single message that the data owner can answer quickly, so that your decision goes ahead on time.",
      sections: [
        {
          heading: "Would a different number change the decision",
          paragraphs: [
            "Before you send any question, ask yourself two things. What am I about to decide, and would a different number change that decision? If the late-delivery rate were 6% instead of 4%, would you still move the drivers? If the answer is yes either way, the doubt does not matter for this decision, and you can act and note the caveat.",
            "If a different number would change the decision, you need an answer before you act. That is the moment to write to the person who owns the data. This first step saves a great deal of effort, because most doubts about most figures do not change the decision in front of you, and chasing all of them is how simple decisions get delayed for weeks.",
          ],
        },
        {
          heading: "One message, four parts",
          paragraphs: [
            "A message to a data owner works when it has four parts. It says what you are deciding and when. It restates the claim as you understand it, with what was counted and over what period. It names the one thing you are unsure of. And it asks a question the owner can answer with a fact, such as yes or no, a date, or a number.",
            "Each part does a job for the owner. The decision and the date tell them how much it matters and how fast to reply. The restated claim shows them exactly which figure you mean and lets them correct your understanding. The single doubt and the factual question mean they can answer from what they already know, without reopening the analysis.",
          ],
          beforeAfter: {
            before: "Hi, are these late-delivery numbers right? They seem off.",
            after:
              "I'm deciding on Thursday whether to move two drivers from Leeds to Bristol. The report says 4% of orders were late in the week ending 14 June. Does that figure include Bristol, and if not, when will Bristol's data be loaded?",
            reading:
              "The first message asks the owner to check everything and gives no reason to hurry. The second gives the decision, the date, the claim and a question with a factual answer, which the owner can reply to in a minute.",
          },
        },
        {
          heading: "What the message is not",
          paragraphs: [
            "The message is not a request to redo the analysis. 'Can you double-check these?' asks the owner to go back over every step, which is slow, and it tells them nothing about which step worried you. They will usually check the arithmetic, find it correct, and reply that the figures are fine, which answers a question you did not have.",
            "The message is also not a list of every possible concern. A list of nine doubts is easy to put off until there is time to address them all, and that time rarely comes. One sharp question gets answered today. If the answer raises a second question, you can send that tomorrow.",
          ],
        },
        {
          heading: "Choosing the one question",
          paragraphs: [
            "The best question is almost always about one of three things you have already learned to look for. The definition: does 'late' mean late against the promised date or the requested one? The missing rows: does the figure include Bristol, or orders with no region, or tickets still open? The comparison: was last year's survey question worded the same way?",
            "The usual mistake is to ask about accuracy in general, with words such as 'right', 'correct', 'check' or 'wrong'. These invite a general reassurance. A question about the definition, the rows or the comparison invites a fact, and a fact is what lets your decision go ahead.",
          ],
        },
      ],
      workedExample: {
        title: "Priya's message about the late deliveries",
        inputLabel: "The first draft",
        prompt: "Hi, are these late-delivery numbers right? They seem off.",
        outputLabel: "The message that went to the reporting team",
        output:
          "I'm deciding on Thursday whether to move two drivers from Leeds to Bristol. The report says 4% of orders were late in the week ending 14 June. Does that figure include Bristol, and if not, when will Bristol's data be loaded?",
        reading: [
          "Priya's first draft was honest about her doubt but gave the reporting team nothing to work with. 'Right' and 'off' do not say which figure, which part of it, or why it matters.",
          "The edited message opens with the decision and the day, so the reporting analyst knows it matters this week. It restates the claim, so there is no confusion about which of the report's figures she means.",
          "The question is about the rows, and it can be answered with a fact: yes or no, and a date. The analyst replied within the hour that Bristol was not included and would be loaded on Wednesday, and Priya made the decision on Thursday with both sites in front of her.",
        ],
      },
      practice: {
        intro:
          "Two drafts of a message to the finance business partner at Hollins Engineering are below. Choose the one the owner could answer quickly. The four parts are in the section above.",
        check: {
          kind: "choose",
          prompt: "Choose the message the data owner could answer quickly with a fact.",
          leftLabel: "Draft A",
          left: "I'm deciding on Friday whether to approve overtime for the Derby plant in October. The cost report says overtime was £38,000 in September. Does that include agency staff, or only employees?",
          rightLabel: "Draft B",
          right:
            "Could you have another look at the overtime figures when you get a moment? A few things don't add up for me, including the Derby numbers, the agency costs and possibly the dates, and I want to be sure before I present them.",
          correct: "left",
          why: "Draft A gives the decision and its date, restates the claim, and asks one question about the definition that can be answered with a fact. Draft B asks for a general re-check and lists several doubts, so it is easy to put off.",
          wrong:
            "Look again at Draft B. 'Have another look' asks the owner to redo the work, and the list of doubts gives no single question to answer. Draft A says what is being decided and when, and asks one question about the definition.",
        },
      },
      check: {
        kind: "edit",
        label: "The message you are editing",
        prompt:
          "Edit this message to Laura Finch, the learning and development analyst at Brookside Insurance, so that she can answer it quickly and your decision can go ahead. Add every part that is missing: the decision and when, the claim restated, and one question she can answer with a fact.",
        material: {
          label: "The figure in the training report",
          text: "Data protection module: 72% of staff in the Manchester contact centre completed the module by 31 August. You are deciding on Friday 19 September whether to book extra classroom sessions for the Manchester team.",
        },
        start:
          "Can you double-check the training completion figures? Something looks wrong and I need to present them.",
        unchanged:
          "You have not changed the message yet. Add the decision you are making and when, restate the 72% figure, and replace 'double-check' with one question about the definition, the rows or the comparison.",
        keep: [
          {
            id: "topic",
            any: ["training", "module", "completion", "completed"],
            missing:
              "Keep the topic. The message should still say it is about the training module and its completion figure.",
          },
        ],
        limits: [
          {
            id: "decision",
            any: ["deciding", "decide", "decision", "whether to book", "choosing"],
            missing:
              "The message does not say what you are going to decide, so Laura cannot tell how much it matters. Add a sentence such as 'I'm deciding whether to book extra classroom sessions for Manchester.'",
          },
          {
            id: "when",
            any: ["friday", "19 september", "thursday", "monday", "tuesday", "wednesday", "this week", "tomorrow", "by the 19th"],
            missing:
              "The message does not say when you need to decide. Add the day, for example Friday 19 September, so she knows how soon to reply.",
          },
          {
            id: "claim",
            any: ["72", "per cent", "percent"],
            missing:
              "Restate the figure you were given, with what was counted and over what period, for example '72% of Manchester contact centre staff completed the module by 31 August.'",
          },
          {
            id: "question",
            any: ["include", "exclude", "counted", "count as", "counts", "definition", "left out", "leavers", "new starters", "part-time", "agency", "same way", "compared with"],
            missing:
              "'Double-check' asks Laura to redo the work. Ask about one thing she can answer with a fact: the definition, the missing rows or the comparison, for example 'Does the 72% include staff who joined in August?'",
          },
        ],
        limitWording: false,
        why: "That edit works. The message now says what you are deciding and when, restates the 72% claim, and asks one question about the definition or the rows that Laura can answer with a fact, so she can reply today and your decision can go ahead on Friday.",
        result: {
          label: "Laura's reply",
          text: "Thanks for the context. The 72% counts everyone on the Manchester payroll on 31 August, including 14 people who started in August and have until the end of September to complete it. Without them the figure is 81%. Happy to send the list by name if that helps with booking.",
        },
      },
      bridge:
        "You now have every move in the method. The next lesson puts them together on new situations and ends with the course assessment.",
    },
    {
      id: "using-every-check-together",
      title: "Using every check together",
      emphasis: "together",
      place:
        "This is the sixth of seven lessons. It brings the five moves of the course into one method, works a mixed example, and then assesses you on eight situations you have not seen before.",
      sections: [
        {
          heading: "The method in one place",
          paragraphs: [
            "Each lesson so far has taught one move. First, restate the figure as a full claim: what was counted, of whom or of what, over what period, and compared with what. Second, find the four facts behind it: the source, the definition, the date and the owner. Third, check the rows: how many there are, how many there should be, and whether any filter, limit, date range, blank or rule has removed some.",
            "Fourth, test the comparison: the same counting, periods that are alike, groups big enough to trust, and the numbers behind any percentage. Fifth, before you act, ask whether a different number would change the decision, and if it would, send the owner one message with the decision and its date, the claim, the one doubt and a question with a factual answer.",
            "The moves are listed in this order because each one builds on the last, but in practice you will not always need all five. A figure that feeds a small, reversible decision may need only the claim and a glance at the rows. A figure behind a budget or a restructure deserves every step.",
          ],
        },
        {
          heading: "Three decisions at the end",
          paragraphs: [
            "The method ends in one of three decisions. A figure is Safe to use when the claim is clear, the four facts are known, the rows are complete and any comparison is fair, or when a remaining doubt would not change what you are about to do. You act on it.",
            "A figure is Safe to use with a caveat when you can act on it, but a limitation should travel with it, for example 'Leeds only' or 'extract four weeks old'. You act on it and write the caveat wherever the figure goes next, so the next reader does not lose it.",
            "The third decision is Ask first. A figure calls for this when a doubt about the definition, the rows or the comparison would change your decision. You do not act yet. You send the owner the one question, and you act when the answer comes back. Ask first is not a failure of the figure or of you. It is the method working.",
          ],
        },
        {
          heading: "Matching the effort to the stakes",
          paragraphs: [
            "The point of the method is to spend a few minutes where they matter, not to slow every decision down. Most figures you are sent this week will be safe to use once you have written out the claim. A few will need a caveat. Only a small number will change a decision enough to justify a question before you act.",
            "The common mistake at this stage is to treat every doubt as a reason to wait. If you find that the extract is three weeks old but the decision is about next year's budget, the age of the extract probably does not matter. Ask whether a different number would change what you are about to do, and let that answer decide how far to go.",
          ],
        },
      ],
      workedExample: {
        title: "Absence figures before a staffing review at Northgate Care",
        inputLabel: "The figure on the slide",
        prompt:
          "Sickness absence at Elm Court is double the group average. Proposal: recruit two additional bank carers for Elm Court from October.",
        outputLabel: "Ruth Adeyemi's reading before the review",
        output:
          "Claim: in July, care staff at Elm Court took 5.8% of scheduled hours as sickness absence, against 2.9% across the group's six homes.\nSource: the rostering system, extract taken on 4 August, owned by the workforce planning officer.\nRows: Elm Court has 41 care staff on the rota; the extract has 41. No filter.\nComparison: one month only, and two long-term absences began in July. The previous five months at Elm Court were close to the group average.\nDecision: Ask first. Sent to workforce planning: 'I'm deciding at the review on 12 September whether to recruit two bank carers for Elm Court. July absence there was 5.8% of scheduled hours. What is the figure for July if the two long-term absences are left out?'",
        reading: [
          "Ruth Adeyemi is the operations director for Northgate Care. The slide proposed a recruitment decision that would add cost every month, so she used every step.",
          "The claim and the four facts were straightforward to find, and the rows were complete. The comparison was the problem. One month was being set against a group average, and two long-term absences starting in the same month could explain most of the difference on their own.",
          "Her decision was Ask first, because the answer would change whether two new posts were needed or whether cover for two people was enough. The question was about the comparison, it stated the decision and the date, and it could be answered with a number.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, try the end of the method on four short situations. For each, decide whether the figure is Safe to use or whether you should Ask first. The three decisions are described in the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each situation as Safe to use or as Ask first.",
          passLabel: "Safe to use",
          failLabel: "Ask first",
          sentences: [
            {
              id: "stationery",
              text: "The stationery spend report is two weeks old, and you are only using it to choose which of two suppliers to try for a month.",
              fail: false,
              why: "The report's age would not change a small, reversible trial, so it is safe to use.",
            },
            {
              id: "redundancy",
              text: "A productivity figure used to select a team for restructuring was taken after filtering out all staff on flexible contracts.",
              fail: true,
              why: "Rows are missing in a way that could change a serious decision, so you should ask first.",
            },
            {
              id: "definition",
              text: "Two reports give different numbers of active clients for the same month, and your bonus pool is set by that number.",
              fail: true,
              why: "The two figures probably use different definitions, and the definition changes the decision, so you should ask first.",
            },
            {
              id: "room-bookings",
              text: "Meeting-room bookings from the booking system, with a matching row count, show the small room is used twice a week; you are deciding whether to keep it as a quiet room.",
              fail: false,
              why: "The claim is clear, the rows match and the decision is easy to reverse, so it is safe to use.",
            },
          ],
          why: "That is right. The stationery trial and the room decision are small and reversible and the figures are sound enough for them, while the restructuring and the bonus pool depend on rows and definitions that would change the outcome, so both call for a question first.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Eight situations follow, each from a different workplace. For each one, choose what you would do. You need six of eight correct to pass.",
        passMark: 6,
        questions: [
          {
            id: "energy",
            situation:
              "Owen Hale is the facilities manager at Brantwood College. The energy supplier's dashboard shows 'Energy use down 12%', and Owen is writing a paper recommending that the college renew the contract for three years. The paper goes to the finance committee on 3 October.",
            question: "What should Owen do with the figure first?",
            options: [
              {
                id: "a",
                text: "Quote it in the paper as it stands, because it comes from the supplier's own dashboard.",
                feedback:
                  "The supplier's dashboard is a source, but the line still leaves the claim open. The committee may read it as the whole college over a year when it could be one building over a month. Restate the claim first.",
              },
              {
                id: "b",
                text: "Restate it as a full claim, with what was measured, for which buildings, over what period and against what, and write 'Not stated' against anything he cannot find.",
                correct: true,
                feedback:
                  "That is the first move. A three-year contract rests on this figure, and until the four parts are written down, each committee member will fill the gaps with their own assumption.",
              },
              {
                id: "c",
                text: "Ask the supplier to send three years of raw meter readings so he can recalculate the figure himself.",
                feedback:
                  "Rebuilding the figure is slow and usually unnecessary. Start by stating the claim and finding the four facts, then ask one specific question if a doubt would change the recommendation.",
              },
              {
                id: "d",
                text: "Leave the figure out of the paper, since he cannot be sure it is right.",
                feedback:
                  "Dropping the figure loses useful evidence and leaves the committee with less to go on. Restate the claim, note what is not stated, and let the paper say what the figure does and does not show.",
              },
            ],
          },
          {
            id: "vacancies",
            situation:
              "At Halewood Logistics, the HR dashboard shows 46 open vacancies, but the recruitment team's weekly sheet shows 31. Grace Mensah, the head of people, has to tell the board on Monday how many roles are unfilled.",
            question: "What is the most useful thing Grace can do?",
            options: [
              {
                id: "a",
                text: "Report the higher figure, because it is safer to overstate the problem to the board.",
                feedback:
                  "Choosing the figure by how it sounds leaves the board with a number nobody can explain. The two figures are probably counting different things, so find out what each one counts first.",
              },
              {
                id: "b",
                text: "Average the two and report 38 or 39.",
                feedback:
                  "An average of two different definitions is a number that matches neither. It would be the one figure in the room that nobody could trace to a source.",
              },
              {
                id: "c",
                text: "Ask the recruitment team to rebuild their sheet from the HR system so the numbers match.",
                feedback:
                  "Forcing the numbers to match hides the reason they differ. The difference is likely to be a definition, such as whether approved but unadvertised roles count, and the board needs to know which definition it is hearing.",
              },
              {
                id: "d",
                text: "Find the source, definition, date and owner of each figure, and report the one whose definition fits the board's question, with that definition stated.",
                correct: true,
                feedback:
                  "That holds. Two figures for the same thing usually means two definitions or two dates. Once the four facts are known for each, Grace can say exactly what the board is being told.",
              },
            ],
          },
          {
            id: "export",
            situation:
              "Callum Price, a customer services team leader at Stanmore Telecom, is sent a sheet of complaints for August to prepare a briefing on the main causes. The sheet has exactly 10,000 rows, and he remembers the reporting tool has an export limit.",
            question: "What should Callum do before he writes the briefing?",
            options: [
              {
                id: "a",
                text: "Check the number of complaints the source system shows for August, and ask for the full data if it is more than 10,000.",
                correct: true,
                feedback:
                  "That is right. A row count exactly equal to an export limit is the clearest sign that rows are missing, and the missing complaints may have different causes from the ones in the sheet.",
              },
              {
                id: "b",
                text: "Use the sheet, because 10,000 complaints is a large enough sample to show the main causes.",
                feedback:
                  "The size is not the issue. An export that stops at its limit usually cuts off the rows at the end, which may be the last days of the month or one region, so the missing rows are not a random sample.",
              },
              {
                id: "c",
                text: "Remove any duplicate rows first, since a round number suggests the data has been padded.",
                feedback:
                  "A round number at the export limit points to rows left out, not rows added. Compare the count with the source system before changing anything in the sheet.",
              },
            ],
          },
          {
            id: "average",
            situation:
              "The patient feedback report at Meadowbank Dental gives an average satisfaction score of 4.6 out of 5 for September. Aisha Rahman, the practice manager, notices that 58 of the 240 feedback forms have the score box left blank.",
            question: "What should Aisha conclude about the 4.6?",
            options: [
              {
                id: "a",
                text: "It is fine, because blank scores are treated as zero and so they already pull the average down.",
                feedback:
                  "Most spreadsheet averages skip blank cells rather than counting them as zero. The 4.6 is probably the average of the 182 forms with a score, so the blanks are left out, not counted.",
              },
              {
                id: "b",
                text: "It should be replaced with the average of all 240 forms, counting the blanks as the lowest score.",
                feedback:
                  "Treating a blank as the lowest score invents answers people did not give. The better move is to state that the average covers 182 forms and to ask whether the blanks share something in common.",
              },
              {
                id: "c",
                text: "It is an average of the 182 forms with a score, so it should be reported with that count, and she should ask whether the blank forms came from one clinic or one day.",
                correct: true,
                feedback:
                  "That holds. The blank rows are missing from the average, and if they cluster in one place they may be the unhappy patients. Stating the count keeps the claim honest.",
              },
              {
                id: "d",
                text: "It cannot be used at all while any forms are incomplete.",
                feedback:
                  "Nearly every survey has blanks. The figure is usable once the claim says how many forms it covers, and a question about where the blanks came from settles whether they matter.",
              },
            ],
          },
          {
            id: "incidents",
            situation:
              "Ben Carter runs health and safety for Oldfield Construction. The quarterly slide says reportable incidents at the new Riverside site rose by 150%, from two to five. The site has 30 workers and the board meets next week.",
            question: "How should Ben present this comparison?",
            options: [
              {
                id: "a",
                text: "Present the 150% rise as the headline, because any increase in incidents must be taken seriously.",
                feedback:
                  "Every incident matters, but a percentage on counts this small tells the board very little and may send attention to the wrong place. Show the counts and a longer period.",
              },
              {
                id: "b",
                text: "Show the counts of two and five, and set them against a longer run of quarters and the rate at other sites of similar size.",
                correct: true,
                feedback:
                  "That is the fair version. With 30 workers, three extra incidents can happen by chance, so the counts and a longer comparison let the board see whether this is a pattern or a bad quarter.",
              },
              {
                id: "c",
                text: "Leave the Riverside figure out until the site has a full year of data.",
                feedback:
                  "Leaving it out removes something the board should see. The fix is to show it fairly, with the numbers behind it and a comparison that can bear the weight.",
              },
            ],
          },
          {
            id: "engagement",
            situation:
              "The engagement survey at Wexford Building Society shows the score for 'I feel valued at work' rising from 58% to 70%. Tom Hughes, an HR business partner, knows the question was changed this year to 'I feel my contribution is recognised'. The chief executive wants to use the rise in the annual report.",
            question: "What should Tom advise?",
            options: [
              {
                id: "a",
                text: "Advise that the two figures cannot be compared as a rise, because the question changed, and suggest reporting this year's figure on its own or comparing questions that stayed the same.",
                correct: true,
                feedback:
                  "That holds. A reworded question means the two years measure different things. Tom can still offer a fair comparison using questions whose wording did not change.",
              },
              {
                id: "b",
                text: "Advise using the rise, since the two questions are about the same general feeling.",
                feedback:
                  "The questions sound similar, but people answer 'valued' and 'recognised' differently. Publishing the rise would present a change in wording as a change in how staff feel.",
              },
              {
                id: "c",
                text: "Advise adjusting this year's figure down by a few points to allow for the change of wording.",
                feedback:
                  "There is no sound way to guess how much the wording moved the score. Any adjustment would be an invented number. Report the figures separately or compare unchanged questions instead.",
              },
              {
                id: "d",
                text: "Advise asking the survey provider to confirm the 70% is arithmetically correct.",
                feedback:
                  "The arithmetic is almost certainly correct. The problem is that the two figures should not be set side by side, and a check of the sums would not reveal that.",
              },
            ],
          },
          {
            id: "message",
            situation:
              "Nadia Iqbal manages procurement at Fairhaven Foods. She must decide by Wednesday whether to switch packaging suppliers, based on a report that says the current supplier delivered 91% of orders on time in the last quarter. She has drafted a message to the report owner listing nine concerns about the data.",
            question: "What should Nadia send?",
            options: [
              {
                id: "a",
                text: "The list of nine concerns, so the owner can address everything at once.",
                feedback:
                  "A long list is easy to put off, and Wednesday is close. Pick the one doubt that would change the decision and ask about that.",
              },
              {
                id: "b",
                text: "A short note asking the owner to double-check the whole report before Wednesday.",
                feedback:
                  "'Double-check' asks the owner to redo the work and does not say which part worries her. The likely reply is that the sums are right, which may not answer her doubt.",
              },
              {
                id: "c",
                text: "Nothing, and switch suppliers anyway, since 91% sounds low.",
                feedback:
                  "Acting on a feeling about the figure skips the method. If 'on time' is measured against a different date from the one Nadia assumes, 91% could mean something quite different.",
              },
              {
                id: "d",
                text: "One message saying she is deciding by Wednesday whether to switch suppliers, restating the 91% claim, and asking one factual question, such as whether 'on time' means the date promised or the date requested.",
                correct: true,
                feedback:
                  "That is the message the course teaches. It tells the owner why it matters and when, confirms which figure she means, and asks something that can be answered with a fact today.",
              },
            ],
          },
          {
            id: "caveat",
            situation:
              "Joe Whitfield, an office manager at Castleton Law, is choosing between two water-cooler suppliers for a three-month trial. The usage figures he has are from a spreadsheet that is six weeks old and covers only the second floor.",
            question: "What is the right decision about the figures?",
            options: [
              {
                id: "a",
                text: "Ask first: send the facilities team a question about the missing floors before choosing a supplier.",
                feedback:
                  "A different number would not change a short, cheap trial, so waiting for an answer costs more than it saves. Act, and carry the caveat.",
              },
              {
                id: "b",
                text: "Treat them as safe to use with no caveat, since the choice is so small.",
                feedback:
                  "The figures are good enough for the decision, but the limitation should still travel with them, so nobody later uses second-floor figures as if they covered the whole office.",
              },
              {
                id: "c",
                text: "Safe to use with a caveat: choose the supplier for the trial, and note that the usage figures are six weeks old and cover the second floor only.",
                correct: true,
                feedback:
                  "That holds. The doubts would not change a small, reversible choice, so Joe can act. Writing the caveat down stops the limited figures from being reused as if they were complete.",
              },
            ],
          },
        ],
        why: "You applied the method across eight new situations: stating the claim, finding the four facts, checking the rows, testing the comparison, and matching the question to the decision.",
      },
      bridge:
        "You have now used the whole method on situations you had not seen before. In the final lesson you write the method as your own checklist and apply it to a real table from your work.",
    },
    {
      id: "your-checklist",
      title: "Your checklist",
      emphasis: "checklist",
      place:
        "This is the last lesson. You will write the method as a checklist in your own words and use it on one real table from your work. The checklist and your answers are what your signed record shows.",
      sections: [
        {
          heading: "A checklist in your own words",
          paragraphs: [
            "Your checklist is five questions you will ask of any table or figure before you act on it. It must cover the claim, where the number came from, the rows behind it, the comparison, and the question you would send. Each item should be a question you would actually ask, in the words you would use, such as 'What exactly was counted, and over what period?'",
            "It is not a copy of this course. The version that works is the one short enough to keep beside your desk or at the top of a notebook, so each question should fit on one line. If you find yourself writing a paragraph for one item, split out the part that matters most and leave the rest to the lessons.",
          ],
        },
        {
          heading: "Applying it to a real table",
          paragraphs: [
            "Choose a table, dashboard or report you have been sent in the last few weeks and expect to act on. A real one is better than an invented one, because you will discover which questions are easy to answer and which ones you have never thought to ask. Answer each of your five questions for that table in a sentence or two.",
            "For the claim, say what was counted, over what period and compared with what, or write 'Not stated' against any part. For where it came from, give the source, the definition, the date and the owner, or write 'Not yet known'. For the rows, say how many there are and how many you expected, or how you checked. For the comparison, say whether it is fair and why. Then write the question you would send, or the one you did send.",
            "Do not paste personal data from the table into your answers. Your record can be opened by anyone with its reference, so describe the table and its figures without names of customers, patients or staff.",
          ],
        },
        {
          heading: "Ready to use, or too vague to use",
          paragraphs: [
            "Before you write your own, you will judge some checklist questions with two labels. A question is Ready to use when a colleague could ask it of any table and get a specific answer, because it names what to look for, such as the source, the row count or whether the periods are the same length.",
            "A question is Too vague to use when it could be answered with a shrug. 'Is the data good?' or 'Does it look right?' will always get 'yes'. The usual mistake is to write questions that sound careful but name nothing. Each of your five should name the thing you are checking.",
          ],
        },
        {
          heading: "How your checklist is checked",
          paragraphs: [
            "When you continue, each part is checked for substance. Each checklist question must name something from its area: what was counted or the period for the claim, the source or definition for where it came from, the rows or filters for the rows, and so on. In the applied answers, the claim must contain a concrete fact such as a date or a number, the source answer must mention the source, definition, owner or 'Not yet known', the rows answer must give a number of rows, the comparison must say fair or unfair, and the question must be a question.",
            "Finish with one of the three decisions from the last lesson: Safe to use, Safe to use with a caveat, or Ask first. If you choose Safe to use with a caveat, write the caveat. If you choose Ask first, make sure the question field holds the question you will send. When every part passes, you sign your name against the checklist.",
          ],
        },
      ],
      workedExample: {
        title: "Priya's checklist applied to the late-delivery table",
        inputLabel: "The checklist",
        prompt:
          "The claim: What exactly was counted, of whom, over what period, and against what?\nWhere it came from: Which system, what definition, what date, and who owns it?\nThe rows: How many rows should there be, and does the table have them all?\nThe comparison: Are both sides counted the same way over periods that are alike?\nThe question: What am I deciding, and what one fact would change it?",
        outputLabel: "The checklist applied to the late-delivery table",
        output:
          "The claim: 4% of Leeds orders arrived after the promised date in the week ending 14 June, against 7% the week before.\nWhere it came from: the dispatch system, extract taken on 15 June, owned by the logistics analyst. Late means after the date promised to the customer.\nThe rows: 2,311 orders, matching the dispatch system for Leeds. Bristol has not been loaded since May.\nThe comparison: fair for Leeds, with the same definition and a week of the same length.\nThe question: Does the figure include Bristol, and if not, when will Bristol's data be loaded?\nDecision: Ask first, because the driver decision depends on Bristol. The question has been sent.",
        reading: [
          "Each checklist question fits on one line and names what it is looking for, so a colleague could use the same card on a different table tomorrow.",
          "Each applied answer gives a fact that could be checked: a date, a count, a named system, a named owner. Where something was missing, the answer says so plainly rather than leaving a gap.",
          "The checklist took a few minutes and changed the decision from acting on the headline to waiting a day for the missing half of the picture. That is the test your own checklist has to meet.",
        ],
      },
      practice: {
        intro:
          "Before you write your own, mark these four draft checklist questions from a colleague at Brackley Estates. Use the two labels from the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each checklist question as Ready to use or as Too vague to use.",
          passLabel: "Ready to use",
          failLabel: "Too vague to use",
          sentences: [
            {
              id: "good-data",
              text: "Is the data good?",
              fail: true,
              why: "It names nothing to check, so it will always get a yes. It is too vague to use.",
            },
            {
              id: "rows",
              text: "How many rows does the source system show, and does the table have the same number?",
              fail: false,
              why: "It names the row count and what to compare it with, so any colleague could get a specific answer. It is ready to use.",
            },
            {
              id: "looks-right",
              text: "Does the comparison look right?",
              fail: true,
              why: "'Look right' does not say which test to apply, so it is too vague to use. Name the definition, the periods or the size of the groups.",
            },
            {
              id: "source",
              text: "Which system is it from, what counts, when was it taken, and who can answer questions about it?",
              fail: false,
              why: "It asks for the source, the definition, the date and the owner, so it is ready to use.",
            },
          ],
          why: "That is right. The questions about the rows and the source each name what to look for, while 'Is the data good?' and 'Does the comparison look right?' name nothing and would always be answered with a yes.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write your checklist as five questions, then apply it to one real table from your work and finish with a decision. Do not include personal data from the table.",
        fields: [
          {
            id: "q-claim",
            label: "Checklist: the claim",
            hint: "One question that asks what was counted, of whom, over what period, and compared with what.",
            min: 20,
            any: ["counted", "count", "period", "compared", "comparison", "against", "who", "what"],
            missing:
              "Your checklist question on the claim does not yet ask about its parts. Ask what was counted, of whom, over what period, or compared with what.",
          },
          {
            id: "q-source",
            label: "Checklist: where it came from",
            hint: "One question that asks for the source, the definition, the date and the owner.",
            min: 20,
            any: ["source", "came from", "definition", "defin", "owner", "owns", "system", "date", "taken"],
            missing:
              "Your checklist question on where it came from does not yet name the four facts. Ask for the source, the definition, the date or the owner.",
          },
          {
            id: "q-rows",
            label: "Checklist: the rows",
            hint: "One question about how many rows there should be and whether any filter, limit or blank has removed some.",
            min: 20,
            any: ["row", "filter", "missing", "blank", "records", "export", "limit"],
            missing:
              "Your checklist question on the rows does not yet ask about them. Ask how many rows there should be, or whether a filter, limit or blank has removed some.",
          },
          {
            id: "q-comparison",
            label: "Checklist: the comparison",
            hint: "One question that tests whether the two sides are counted the same way, over similar periods, from groups big enough to trust.",
            min: 20,
            any: ["compar", "fair", "same way", "same length", "alike", "against", "versus", "numbers behind"],
            missing:
              "Your checklist question on the comparison does not yet test it. Ask whether both sides are counted the same way, over similar periods, or whether it is fair.",
          },
          {
            id: "q-question",
            label: "Checklist: the question",
            hint: "One question that asks what you are deciding and what you would ask the data owner.",
            min: 20,
            any: ["decid", "decision", "ask", "owner", "send", "change"],
            missing:
              "Your checklist question on the question before you act does not yet mention the decision or the owner. Ask what you are deciding, or what one question you would send the owner.",
          },
          {
            id: "a-claim",
            label: "Applied: the claim",
            hint: "What was counted, of whom, over what period and compared with what, with 'Not stated' against any part you do not know.",
            min: 30,
            rule: "fact",
            any: ["counted", "count", "period", "compared", "against", "not stated", "week", "month", "quarter", "year", "%", "per cent"],
            missing:
              "Your applied claim does not yet state the parts of the claim with a concrete fact. Say what was counted and over what period, including a date or a number, and write 'Not stated' for any part you do not know.",
          },
          {
            id: "a-source",
            label: "Applied: where it came from",
            hint: "The source, the definition, the date it was taken and the owner, or 'Not yet known' for any you cannot find.",
            min: 30,
            any: ["source", "definition", "owner", "owned", "system", "not yet known"],
            missing:
              "Your applied answer on where it came from does not yet give the four facts. Name the source, the definition, the date and the owner, or write 'Not yet known' for any you cannot find.",
          },
          {
            id: "a-rows",
            label: "Applied: the rows",
            hint: "How many rows the table has, how many you expected, and how you checked.",
            min: 20,
            rule: "fact",
            any: ["row", "records", "entries", "lines"],
            missing:
              "Your answer on the rows does not say how many there are or how many there should be. Give the row count and what you checked it against.",
          },
          {
            id: "a-comparison",
            label: "Applied: the comparison",
            hint: "Whether the comparison is fair or unfair, and why, using the tests from the course.",
            min: 20,
            any: ["fair", "unfair", "no comparison", "not compared"],
            missing:
              "Your answer on the comparison does not yet say whether it is fair. State fair or unfair, and give the reason, such as the same definition or periods of different lengths.",
          },
          {
            id: "a-question",
            label: "Applied: the question",
            hint: "The one question you would send, or did send, to the data owner, ending with a question mark.",
            min: 20,
            any: ["?"],
            missing:
              "Your applied question is not yet written as a question. Write the one question you would send the data owner, one they can answer with a fact.",
          },
          {
            id: "decision",
            label: "Decision",
            hint: "Safe to use, Safe to use with a caveat (and the caveat), or Ask first.",
            min: 10,
            any: ["safe to use", "ask first"],
            missing:
              "Your decision does not yet use one of the three decisions. Write Safe to use, Safe to use with a caveat and the caveat, or Ask first.",
          },
        ],
        why: "Your checklist covers the claim, the source, the rows, the comparison and the question, and you have used it on a real table to reach a decision.",
      },
      bridge:
        "Your checklist is complete. Sign your name below, and your record will show the checklist, your answers and your decision to anyone who opens the reference.",
    },
  ],
};
