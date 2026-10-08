/*
Course:   From Spreadsheets to Simple Systems
Slug:     from-spreadsheets-to-simple-systems
For:      People whose team depends on a spreadsheet that has grown over years, such as a tracker, a pricing
          workbook, a rota or a monthly report, and who are worried about what would happen if it broke or its
          author left. They can open a workbook, move between sheets and read a formula. They do not write macros.
Outcome:  They can say what each sheet in a workbook does, trace one important number back to what was typed in,
          point to the parts that could quietly give a wrong answer, sketch a simpler shape for the data, and
          decide with a reason what stays, what moves to a system and what is retired.
Artefact: The workbook map, a one-page map of a real workbook in six labelled parts.
Record sentence: Mapped a workbook the team depends on, traced a number to its inputs, named the dangerous parts,
          and decided with reasons what stays, what moves and what is retired.
Lessons (id, title, move, interaction, pass rule):
  1. what-the-file-is-doing, What the file is doing, name the job of each sheet. Practice: choose. Check: scenario
     of four sheets with the three job labels as options; every sheet labelled correctly.
  2. trace-one-number, Trace one number, follow a result back to typed-in values. Practice: edit a partial trace;
     it must reach column D, say the value is typed in, and name who types it. Check: choose; the trace that
     reaches typed-in values and the hard-coded rate.
  3. the-dangerous-parts, The dangerous parts, tell a dangerous part from a safe one. Practice and check: mark
     with "Dangerous part" and "Safe as it is"; every feature marked correctly.
  4. a-simpler-shape, A simpler shape, reshape a record sheet to one table per thing and one row per record.
     Practice: edit a holiday tracker layout; it must keep the staff name, add a month or date column and state
     one row per record. Check: choose; the layout with one table per kind of thing.
  5. what-you-move, What you move, decide stays, moves or retires with a reason. Practice: choose; the decision
     list made part by part. Check: scenario of four parts with the three decisions as options; all correct.
  6. course-assessment, Course assessment, apply every move to new workbooks. Practice: mark with "Holds up" and
     "Needs another look". Check: scenario of seven situations, pass mark six.
  7. your-workbook-map, Your workbook map, write the map. Practice: mark with "Ready for a colleague" and "A
     colleague would have to ask". Check: build of six parts; owner needs a named role, sheets need a job label,
     the trace needs a typed-in value and a cell or number, dangerous parts need a kind from lesson 3, the shape
     needs one row per record, and the decisions need one of the three decisions.
Sources:  HM Treasury, The Aqua Book. HM Treasury, Review of quality assurance of government analytical models
          (2013). European Spreadsheet Risks Interest Group conference papers. Microsoft Support documentation on
          Excel Tables, data validation and Trace Precedents. Information Commissioner's Office guidance on
          security under UK GDPR.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/

import type { CourseContent } from "./types.ts";

const RECORDS = "Holds the records";
const SUMS = "Does the sums";
const RESULT = "Shows the result";
const DANGER = "Dangerous part";
const SAFE = "Safe as it is";
const MOVES = "Moves to a system";
const STAYS = "Stays in the workbook";
const RETIRE = "Retire it";

export const COURSE: CourseContent = {
  slug: "from-spreadsheets-to-simple-systems",
  hours: 2.5,
  artefact: {
    lessonId: "your-workbook-map",
    title: "The workbook map",
    recordLine:
      "Mapped a workbook the team depends on, traced a number to its inputs, named the dangerous parts, and decided with reasons what stays, what moves and what is retired.",
  },
  lessons: [
    {
      id: "what-the-file-is-doing",
      title: "What the file is doing",
      emphasis: "file",
      place:
        "This is the first of seven lessons, and it covers the first module of the course. It gives you three plain names for the jobs a workbook does, and every later lesson uses them.",
      sections: [
        {
          heading: "Three jobs inside one workbook",
          paragraphs: [
            "Most workbooks that have lasted a few years are doing three different jobs, often on the same sheet and sometimes in the same column. Before you can judge whether a workbook is safe, or decide what should leave it, you need to be able to say which job each sheet is doing. This course uses three names for those jobs, and you will see them on the buttons from this lesson onwards.",
            "A sheet Holds the records when it is the place where facts are typed in and kept, such as one row for each order, each grant or each member of staff. A sheet Does the sums when it takes those records and works something out from them, such as a price, a total, a date or an amount remaining. A sheet Shows the result when it lays out an answer for someone to read, such as the summary for the monthly board meeting or the quote a salesperson pastes into an email.",
            "The test for each label is what a person does on that sheet. If people type facts into it and expect them to be kept, it holds the records. If nobody types into it and it calculates from other cells, it does the sums. If people open it to read or send an answer, it shows the result.",
          ],
        },
        {
          heading: "What the labels are not",
          paragraphs: [
            "The labels are not about what a sheet looks like. A plain grey sheet full of formulas can be the most important sheet in the file, and a colourful summary can be a thin layer over someone else's calculation. Judge the sheet by what happens on it, not by its formatting or its name.",
            "The labels are also not a verdict. A sheet that does two jobs at once is common and is not a failure on the part of whoever built it. Workbooks grow one urgent request at a time, and a total added under the records in a hurry three years ago is still there because it worked. Naming the jobs is simply the first honest description of the file.",
          ],
        },
        {
          heading: "Why the jobs matter",
          paragraphs: [
            "A workbook is not dangerous because it is a spreadsheet. It becomes dangerous when the three jobs are tangled together. When records and sums share a sheet, a person typing in a new row can overwrite a formula without seeing it. When a result sits on the same sheet as its sums, the person reading it cannot tell which cells it came from or whether they are current.",
            "The mistake people usually make is to label a sheet by its name. A tab called Calc may do the sums, or it may be an abandoned copy that nothing refers to, while the real calculation sits on a tab called Sheet7. Open each sheet, click into a few cells, and look at whether they contain typed values or formulas before you give it a label.",
          ],
          beforeAfter: {
            before: "Grants 2025: our main sheet for grants.",
            after:
              "Grants 2025 holds the records, one row per grant, typed in by the fundraising officer. It also does the sums in columns H to J, where the amount remaining is worked out.",
            reading:
              "The first line describes the sheet by its importance. The second names both jobs it does and who types into it, which shows straight away that a new row could land on top of a formula.",
          },
        },
      ],
      workedExample: {
        title: "Labelling the sheets in a grants workbook",
        inputLabel: "The sheets in the Harrow Vale Community Trust grants workbook",
        outputLabel: "The manager's labelled list",
        prompt:
          "Grants 2024\nGrants 2025\nCalc\nBoard summary\nLookup\nSheet7",
        output:
          "Grants 2024 and Grants 2025 hold the records, one row per grant.\nCalc does the sums, working out the amount remaining on each grant.\nLookup holds the records, a short list of funders and their reporting dates.\nBoard summary shows the result.\nSheet7 does the sums as well. It holds a second calculation of the amounts remaining, and it is the one the Board summary actually uses.",
        reading: [
          "Tom Ellis, the operations manager, opened each sheet and clicked into its cells before he wrote a label. That is why he could give Lookup the label Holds the records even though its name suggests a calculation.",
          "The surprise is Sheet7. Its name suggests a spare tab, but its cells contain formulas, so it does the sums. When Tom clicked into the Board summary, its cells referred to Sheet7 rather than to Calc.",
          "Two sheets that do the same sum are a warning sign. If they ever disagree, the board will see one answer and the finance officer will check the other. Lesson 3 comes back to this kind of duplication as one of the dangerous parts.",
        ],
      },
      practice: {
        intro:
          "Two colleagues at Kestrel Fixings labelled the same three sheets in their team's delivery tracker. The definitions of the three jobs are in the first section above if you want to check them.",
        check: {
          kind: "choose",
          prompt: "Choose the list whose labels describe what each sheet actually does.",
          material: {
            label: "What happens on each sheet",
            text: "Deliveries: the transport clerk types in one row per delivery, with the date, the customer and the weight. Charges: formulas work out the charge for each delivery from its weight. Weekly report: the transport manager opens it on Friday to read the total charged and the number of late deliveries.",
          },
          leftLabel: "List A",
          left: "Deliveries holds the records. Charges does the sums. Weekly report shows the result.",
          rightLabel: "List B",
          right: "Deliveries shows the result, because it is the busiest sheet. Charges holds the records. Weekly report does the sums.",
          correct: "left",
          why: "List A labels each sheet by what happens on it. The clerk types facts into Deliveries, the Charges sheet works something out from them, and the manager opens the Weekly report to read an answer.",
          wrong:
            "Look again at List B. It calls Deliveries the result because it is busy, but people type facts into it and expect them to be kept, which means it holds the records. Judge each sheet by what a person does on it.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "These four sheets come from the sales team's pricing workbook at Kestrel Fixings. For each sheet, choose the job it does.",
        questions: [
          {
            id: "products",
            situation:
              "Products has one row per product, with its code, its description and its list price. The product manager, Hannah Webb, types in each new product and changes a price when the supplier does.",
            question: "Which job does the Products sheet do?",
            options: [
              {
                id: "records",
                text: RECORDS,
                correct: true,
                feedback: "Facts are typed in by Hannah and kept here, so this sheet holds the records.",
              },
              {
                id: "sums",
                text: SUMS,
                feedback: "Nothing is worked out on this sheet. The prices are typed in, which means it holds the records.",
              },
              {
                id: "result",
                text: RESULT,
                feedback: "This sheet is where the facts are entered and kept, not where an answer is laid out for someone to read.",
              },
            ],
          },
          {
            id: "quote",
            situation:
              "On the Quote sheet a salesperson picks products from a list, and the sheet shows the total with discount and VAT, ready to paste into an email. Each new quote replaces the last one.",
            question: "Which job does the Quote sheet do?",
            options: [
              {
                id: "records",
                text: RECORDS,
                feedback: "Quotes are not kept here, because each new quote replaces the last. The sheet lays out an answer, so it shows the result.",
              },
              {
                id: "sums",
                text: SUMS,
                feedback: "There are sums behind it, but the job of this sheet is to present the quote for someone to send. Look for where the discount rules actually live.",
              },
              {
                id: "result",
                text: RESULT,
                correct: true,
                feedback: "This sheet lays out an answer for someone to read and send, so it shows the result.",
              },
            ],
          },
          {
            id: "discounts",
            situation:
              "The Discounts sheet contains formulas that look up each customer's band on another sheet and work out the discount rate that applies. Nobody types on it, and nobody opens it except to fix it.",
            question: "Which job does the Discounts sheet do?",
            options: [
              {
                id: "records",
                text: RECORDS,
                feedback: "The rates here are calculated from other cells, not typed in, so this sheet does the sums.",
              },
              {
                id: "sums",
                text: SUMS,
                correct: true,
                feedback: "This sheet works something out from other records, so it does the sums.",
              },
              {
                id: "result",
                text: RESULT,
                feedback: "Nobody reads this sheet for an answer. It works out the rate that the Quote sheet uses, so it does the sums.",
              },
            ],
          },
          {
            id: "customers",
            situation:
              "Customers has one row per customer, with the account name and a discount band of A, B or C. The sales administrator types in each new account and its band when the account is opened.",
            question: "Which job does the Customers sheet do?",
            options: [
              {
                id: "records",
                text: RECORDS,
                correct: true,
                feedback: "Each customer and their band is typed in once and kept here, so this sheet holds the records.",
              },
              {
                id: "sums",
                text: SUMS,
                feedback: "The band is typed in rather than worked out, so this sheet holds the records.",
              },
              {
                id: "result",
                text: RESULT,
                feedback: "This sheet is a list of facts that other sheets use, not an answer for someone to read.",
              },
            ],
          },
        ],
        why: "You named the job of every sheet by what happens on it. Products and Customers hold the records, Discounts does the sums, and Quote shows the result, which means you can now see where a price comes from before it reaches a customer.",
      },
      bridge:
        "Knowing the job of each sheet lets you follow a single number through them, and the next lesson shows you how to trace one result back to the values someone typed in.",
    },
    {
      id: "trace-one-number",
      title: "Trace one number",
      emphasis: "number",
      place:
        "In the first lesson you named the job of each sheet. This lesson stays within the first module and shows how a single result depends on the rest of the workbook.",
      sections: [
        {
          heading: "What a trace is",
          paragraphs: [
            "To trace a number, you start at a result that someone relies on, such as the total on the board summary or the overtime figure payroll uses. You click into that cell, read its formula, and write down each cell or range it refers to. Then you do the same for each of those cells, and you keep going until every path ends in a value that someone typed in.",
            "A trace ends with a short list. It names the typed-in values the result depends on, where each one lives, and who types it. That last part matters as much as the cell references, because a value is only as reliable as the person and the routine that put it there.",
          ],
        },
        {
          heading: "What a trace is not",
          paragraphs: [
            "A trace is not a check that the formula is correct. You are not yet asking whether the sum is right, only what it depends on. Keeping those two questions apart stops you from getting lost in one clever formula while missing the input that nobody has updated since last spring.",
            "A trace is also not a feeling that the number looks right. A total that roughly matches last month tells you that nothing dramatic has changed. It does not tell you that fourteen rows have been quietly left out, or that one rate is three years old.",
          ],
          beforeAfter: {
            before: "The total comes from the Hours sheet and matched last month.",
            after:
              "The total on Summary adds column H on Hours. Column H multiplies column G by Rates!B2. Column G is typed in by each shift lead, and Rates!B2 is typed in by HR.",
            reading:
              "The first line names a sheet and a feeling. The second follows each reference until it reaches something a person typed, and says who that person is.",
          },
        },
        {
          heading: "Tools that help, and what they miss",
          paragraphs: [
            "Excel has a Trace Precedents tool on the Formulas tab, which draws arrows from a cell to the cells its formula uses. Google Sheets highlights the ranges a formula refers to when you click into it. Both save time, and both are described in the product help pages from Microsoft and Google.",
            "Neither tool writes the trace for you. The arrows do not say who types a value or when it was last changed, and they are easy to miss when a formula refers to another file or to a number typed straight into the formula. Write the trace down in sentences, one step per sentence, so a colleague could follow it without opening the file.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to stop one step too early. People follow the total to the column it adds and write that the figure comes from the Hours sheet, which is true but not finished. Column H on Hours is itself a formula, so the trace has not yet reached anything a person typed.",
            "A good trace also looks inside each formula for numbers. A formula such as =G5*15.5 contains a value that someone typed, but it was typed into the formula rather than into a labelled cell. Write it down as an input like any other, because it is one, and it is often the value nobody remembers.",
          ],
        },
      ],
      workedExample: {
        title: "Tracing the amount remaining for the board",
        inputLabel: "The cell the board relies on",
        outputLabel: "The trace the finance officer wrote",
        prompt: "Board summary, cell C4: £48,200 remaining across all grants.",
        output:
          "C4 adds column F on Sheet7.\nEach row of column F subtracts the amount spent, from Grants 2025 column E, from the award, from Grants 2025 column C.\nColumn E is typed in by Priya Nair, the finance officer, each month from the accounting system.\nColumn C is typed in by the fundraising officer when a grant is awarded.\nRow 12 of Sheet7 also subtracts a fixed £3,000 typed directly into the formula, with no note.",
        reading: [
          "Priya started at the number the board reads and did not stop at Sheet7. She followed column F until each path reached a column that a named person types into.",
          "Each line of the trace is one step, so a colleague could check it without her. The two typed-in columns are the inputs the board's figure depends on, and each has an owner.",
          "The last line is the finding. A £3,000 deduction typed inside one formula cannot be seen from the sheet and has no explanation. It may be correct, but nobody can say so, and that is the kind of dangerous part the next lesson names.",
        ],
      },
      practice: {
        intro:
          "Here is a trace that stops too early, with the formulas beside it. Edit the trace so that it reaches a value someone typed in and says who types it. The section on the usual mistake is above if you need it.",
        check: {
          kind: "edit",
          prompt:
            "Finish this trace of the monthly sales figure at Linden Print. Follow column F back to the values that are typed in, and name who types each one.",
          material: {
            label: "What the formulas show",
            text: "Orders!F2 is =D2*E2. Column D is the quantity, typed in by the sales administrator from each purchase order. Column E is the unit price, looked up from the Price list sheet, where the product manager types in each price.",
          },
          label: "The trace you are finishing",
          start: "The figure of £12,480 on the Summary sheet adds column F on the Orders sheet.",
          unchanged:
            "The trace has not moved past column F yet. Add a sentence saying what column F multiplies, and follow each part back to the person who types it.",
          keep: [
            {
              id: "start",
              any: ["column f"],
              missing: "Keep the first step. The trace should still say that the figure adds column F on the Orders sheet.",
            },
          ],
          limits: [
            {
              id: "inputs",
              any: ["column d", "quantity"],
              missing: "The trace does not yet reach column D. Say that column F multiplies the quantity in column D by the unit price in column E.",
            },
            {
              id: "typed",
              any: ["typed", "entered", "keyed", "types", "enters"],
              missing: "The trace does not yet say that a value is typed in. A trace ends at a value someone typed, so say which values are typed in.",
            },
            {
              id: "who",
              any: ["administrator", "product manager"],
              missing: "The trace does not yet say who types the values. Name the sales administrator and the product manager.",
            },
          ],
          limitWording: false,
          why: "That trace is finished. It follows column F to the quantity and the unit price, and it ends at values typed in by the sales administrator and the product manager, so anyone can see what the sales figure depends on.",
          result: {
            label: "The finished trace",
            text: "The figure of £12,480 on the Summary sheet adds column F on the Orders sheet. Column F multiplies the quantity in column D by the unit price in column E. Column D is typed in by the sales administrator from each purchase order. Column E is looked up from the Price list sheet, where the product manager types in each price.",
          },
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two colleagues at Brightwater Homecare traced the monthly overtime total in the same rota workbook. Choose the trace you could rely on.",
        leftLabel: "Trace A",
        left: "The total comes from the Hours sheet. It looks right, and it roughly matched last month.",
        rightLabel: "Trace B",
        right:
          "The total on Summary adds column H on Hours. Column H multiplies overtime hours in column G by the rate in cell Rates!B2. Column G is typed in by each shift lead. Rates!B2 is typed in by HR and was last changed in April. Two rows in column H multiply by 15.5 typed into the formula instead of using Rates!B2.",
        correct: "right",
        why: "Trace B follows every reference back to a typed-in value, names who types each one, and finds the two rows that ignore the rate cell. That is a trace a colleague could check, and it has already found a problem.",
        wrong:
          "Look again at Trace A. It names a sheet and a feeling, and it stops before reaching anything a person typed. It cannot tell you what might make the total wrong, whereas Trace B finds two rows with a rate typed into the formula.",
      },
      bridge:
        "Your trace will usually turn up at least one surprise, and the next lesson names the kinds of surprise that make a workbook dangerous.",
    },
    {
      id: "the-dangerous-parts",
      title: "The dangerous parts",
      emphasis: "dangerous",
      place:
        "This lesson is the second module of the course. It gives you a short list of what to look for, so that you can judge the risk in a workbook quickly and say why.",
      sections: [
        {
          heading: "Two labels for every part",
          paragraphs: [
            "This lesson uses two labels. A part of a workbook is a Dangerous part when it could produce a wrong answer without anyone noticing, or when the work would stop if one person were away. A part is Safe as it is when it does one job clearly and a mistake in it would be visible to the people who use it.",
            "Dangerous does not mean wrong today. Many dangerous parts give the right answer for years. The label means that when the part does go wrong, nothing in the workbook will tell you, and the first sign will be a complaint, a missed payment or a question from an auditor.",
          ],
        },
        {
          heading: "The kinds to look for",
          paragraphs: [
            "Six kinds cover most of what you will find. The first is a number typed directly into a formula, such as a rate or a margin, so that a change has to be made in every formula that uses it. The second is a figure pasted in by hand from another file or system each week or month. The third is a range in a formula that stops short, such as a total that adds rows 2 to 200 when the list now has 214 rows.",
            "The fourth is two calculations of the same thing, which can drift apart without anyone seeing it. The fifth is a macro or a complicated formula that only one person understands, so that nobody can check it or rebuild it when they are away. The sixth is personal data, such as home addresses or health notes, kept where more people can see it than need to.",
          ],
        },
        {
          heading: "What safe looks like",
          paragraphs: [
            "A part is safe as it is when it does one job and its mistakes show. A single, clearly labelled cell for each rate, changed only by the person responsible, is safe, because every formula refers to it and a wrong rate would appear on every row at once. A drop-down list that stops people typing a supplier name in three different ways is safe, because it protects the records.",
            "The common mistake is to treat an error message as the only warning sign. Most dangerous parts never produce an error. A short range adds up perfectly well. A pasted figure is still a number. The question to ask of each part is whether a mistake in it would be noticed, and by whom.",
          ],
          beforeAfter: {
            before: "=B4*1.15",
            after: "=B4*Settings!B2, where Settings!B2 is labelled 'Safety margin' and changed only by the stock controller.",
            reading:
              "The first formula hides the margin inside itself, so a change will not reach it. The second refers to one labelled cell, which makes the margin visible and changes it everywhere at once.",
          },
        },
        {
          heading: "Why this is worth doing",
          paragraphs: [
            "HM Treasury's review of the quality assurance of government analytical models, published in 2013 and often called the Macpherson review, found that models many decisions depend on need a clear owner and proper checking, and it counted spreadsheets among those models. The European Spreadsheet Risks Interest Group publishes conference papers and a case archive on how spreadsheet errors arise in practice, and the causes it records are the ordinary ones in this list.",
            "You do not need to fix every dangerous part at once. The point of the label is to know where the risk sits, so that the next two lessons can decide which parts to reshape and which to move.",
          ],
        },
      ],
      workedExample: {
        title: "Finding the dangerous parts in a rota",
        inputLabel: "The Brightwater Homecare rota workbook",
        outputLabel: "The list the HR adviser made",
        prompt:
          "Summary: the overtime total adds H2:H200 on Hours.\nHours: one row per shift, 214 rows. Column H multiplies overtime hours by Rates!B2, except two rows that multiply by 15.5. Column K holds staff home addresses and is hidden.\nRates: one labelled cell per rate, changed by HR.\nThe file is shared with all twelve shift leads.",
        output:
          "Dangerous part: two rows multiply by 15.5 typed into the formula, so a rate change will not reach them.\nDangerous part: the total adds H2 to H200, and the rota now has 214 rows.\nDangerous part: the Hours sheet holds home addresses in a hidden column, and the file is shared with all shift leads.\nSafe as it is: the Rates sheet has one clearly labelled cell per rate, changed only by HR.",
        reading: [
          "Sophie Kaur, the HR adviser, worked from the trace in the last lesson and gave every part a label and a reason. Each dangerous part names its kind, so a colleague knows what to fix.",
          "None of the three dangerous parts shows an error message. The total has been leaving out fourteen rows of overtime since the rota grew, and nobody would have found it without looking.",
          "The hidden column is a different kind of danger. Hiding a column does not stop anyone who opens the file from seeing it. The Information Commissioner's Office guidance on security under UK GDPR expects personal data to be kept where access can be controlled, and a shared workbook does not do that.",
        ],
      },
      practice: {
        intro:
          "Here are three features of a small workbook used by a café group's office manager. Mark each one with the two labels you have just learned. The list of kinds is still above.",
        check: {
          kind: "mark",
          prompt: "Mark each feature as a Dangerous part or as Safe as it is.",
          passLabel: SAFE,
          failLabel: DANGER,
          sentences: [
            {
              id: "wages",
              text: "Each Friday the office manager pastes the till totals from the till system into column B by hand.",
              fail: true,
              why: "A weekly paste by hand can be missed or pasted one row out of line, and nothing would warn anyone, so it is a dangerous part.",
            },
            {
              id: "sites",
              text: "The site name in each row is chosen from a drop-down list linked to the Sites sheet.",
              fail: false,
              why: "The drop-down protects the records and a mistake would be visible, so it is safe as it is.",
            },
            {
              id: "service",
              text: "The service charge is worked out with =C4*0.125 in every row.",
              fail: true,
              why: "The rate of 12.5 per cent is typed inside each formula, so a change will not reach them all. That makes it a dangerous part.",
            },
          ],
          why: "That is right. The paste by hand and the rate inside the formula could both go wrong quietly, while the drop-down list protects the records.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "An operations lead at Marlow Catering Supplies listed four features of the stock workbook. Mark each one with the label it deserves.",
        passLabel: SAFE,
        failLabel: DANGER,
        sentences: [
          {
            id: "margin",
            text: "The reorder quantity formula is =B4*1.15, where 1.15 is the safety margin agreed two years ago.",
            fail: true,
            why: "The margin is typed inside the formula, so if it changes, nobody will know which cells to update.",
          },
          {
            id: "paste",
            text: "Every Monday, Lee copies the stock levels from the warehouse system export and pastes them into column C.",
            fail: true,
            why: "A weekly paste by one person can be missed, pasted into the wrong rows, or stop when Lee is away, and nothing would warn you.",
          },
          {
            id: "dropdown",
            text: "Supplier names are chosen from a drop-down list linked to the Suppliers sheet.",
            fail: false,
            why: "A drop-down protects the data rather than risking it, and a mistake would be visible. This part does one job clearly.",
          },
          {
            id: "macro",
            text: "There is a macro that rebuilds the summary, and only Dana knows what it does.",
            fail: true,
            why: "Work that depends on one person is a dangerous part. If Dana is away or leaves, the summary cannot be rebuilt or checked.",
          },
        ],
        why: "That is the right reading. The margin inside the formula, the Monday paste and the macro only Dana understands could each fail without warning, while the drop-down list keeps supplier names clean.",
      },
      bridge:
        "Many dangerous parts come from the shape of the data itself, so the next lesson shows you a simpler shape that is safer to keep and easier to move.",
    },
    {
      id: "a-simpler-shape",
      title: "A simpler shape",
      emphasis: "shape",
      place:
        "This lesson is the third module of the course. It gives you a shape for data that is safer inside a spreadsheet and much easier to move out of one.",
      sections: [
        {
          heading: "One table for each kind of thing",
          paragraphs: [
            "A simpler shape has one table for each kind of thing the workbook records, such as customers, orders, grants or shifts. Each table has one row for each record and one column for each fact about it. A grant is one row, and its funder, award date and award amount are columns on that row.",
            "The records stay apart from the sums and the results. The tables that hold the records contain only typed-in facts and a single header row, and the calculations and summaries sit on their own sheets. Typing a new row into a table should never be able to touch a formula.",
          ],
        },
        {
          heading: "What to take out",
          paragraphs: [
            "Four habits break the shape, and each one is common. Merged cells across the top of a list make it hard to sort, filter or import. Blank rows used for spacing split one list into several. Totals and subtotals mixed in among the records get counted as records by the next formula. A new sheet or a new column for each month means the workbook has to be rebuilt every year.",
            "The cure for the last habit is the one people find least natural. Instead of a column for January and a column for February, you add a single Month column and give each month its own row. The table grows downwards, which every tool handles well, rather than sideways, which almost none do.",
          ],
          beforeAfter: {
            before: "Volunteer | Jan | Feb | Mar | Apr | Total",
            after: "Volunteer ID | Month | Hours, with one row for each volunteer in each month",
            reading:
              "The first layout needs a new column every month and mixes a total into the records. The second needs no new columns, and the total is worked out elsewhere from the rows.",
          },
        },
        {
          heading: "How to do it in the tools you have",
          paragraphs: [
            "In Excel, the usual step is to format each list as a Table from the Insert tab. A Table keeps a single header row, and formulas and totals that refer to it grow when new rows are added, which removes the short range from the last lesson. Microsoft's support pages on Excel Tables and on data validation describe both features.",
            "In Google Sheets, keep each list on its own sheet with a single header row, no blank rows and no totals underneath, and refer to whole columns in your formulas. In either tool, a column that should only take certain values, such as Yes or No, can use a drop-down so the records stay clean.",
          ],
        },
        {
          heading: "What the shape is for",
          paragraphs: [
            "The simpler shape is not about appearance, and a well-shaped table often looks plain. Its value is that the records can be checked, filtered and summed without special handling, and that a shared list tool, a database or almost any business system can import it without anyone rebuilding it first.",
            "The mistake people usually make is to tidy the formatting and keep the shape. New colours, clearer headings and frozen panes make a sheet easier to read, but a sheet with a column for each month and subtotals between funders is as fragile after the tidy as before it.",
          ],
        },
      ],
      workedExample: {
        title: "Reshaping the grants records",
        inputLabel: "The two record sheets before",
        outputLabel: "The two tables after",
        prompt:
          "Grants 2024 and Grants 2025: each has a coloured header, a blank row between funders, subtotals under each funder, and a new column for every month's spending.",
        output:
          "Grants table: Grant reference | Funder | Award date | Award amount | End date. One row per grant.\nSpending table: Grant reference | Month | Amount spent. One row for each grant in each month.\nThe Board summary works out the amount remaining from these two tables.",
        reading: [
          "Tom and Priya replaced two sheets split by year with one table per kind of thing. Grants are one kind of thing and monthly spending is another, so each has its own table, joined by the grant reference.",
          "The monthly columns became a Month column in the Spending table. Next year needs no new sheet and no new columns, only new rows.",
          "Because the Board summary now works from the two tables, the second calculation on Sheet7 is no longer needed. The Grants table could be imported into a list tool such as Microsoft Lists or into a finance system as it stands.",
        ],
      },
      practice: {
        intro:
          "Here is a holiday tracker in the shape the lesson warned against. Rewrite it as the columns of one table in the simpler shape. The section on what to take out is above if you need it.",
        check: {
          kind: "edit",
          prompt:
            "Rewrite this layout as the column names of one table, with a single month or date column and one row per record. Keep the staff name or ID.",
          label: "The layout you are reshaping",
          start:
            "Holiday tracker. One sheet per team, with the team name in a merged cell at the top. Columns: Name, Jan, Feb, Mar, Apr, May, Jun, Total. A blank row between each manager's staff.",
          unchanged:
            "The layout has not changed yet. Replace the monthly columns with a single Month or Date column, and say that there is one row per record.",
          keep: [
            {
              id: "staff",
              any: ["name", "staff"],
              missing: "Keep a column for the member of staff, such as Name or Staff ID, so each row says whose holiday it is.",
            },
          ],
          limits: [
            {
              id: "month",
              any: ["month", "date"],
              missing: "The months are still columns. Replace them with a single Month or Date column.",
            },
            {
              id: "row",
              any: ["one row", "row per", "row for each", "each row"],
              missing: "Say what one row holds, for example one row for each person in each month.",
            },
          ],
          limitWording: false,
          why: "That is the simpler shape. The months have become a single column, each row is one record, and the team can be a column rather than a separate sheet, so the tracker grows downwards and never needs rebuilding.",
          result: {
            label: "The table as reshaped",
            text: "Holiday table: Staff ID | Name | Team | Month | Days taken. One row for each person in each month. Totals are worked out on a separate Summary sheet.",
          },
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two colleagues redesigned the same training attendance sheet at Fenby Housing. Choose the layout with the simpler shape.",
        leftLabel: "Layout A",
        left: "One sheet per course. Each sheet has the course name in a merged cell at the top, then one column per session date with a tick for each person who attended, and a total row at the bottom.",
        rightLabel: "Layout B",
        right:
          "One Courses table with Course code, Title and Provider. One Attendance table with Course code, Session date, Staff ID and Attended (Yes or No), one row per person per session. Totals are worked out on a separate Summary sheet.",
        correct: "right",
        why: "Layout B has one table per kind of thing, one row per record, and keeps the totals away from the records. It could be filtered, summed or imported into a system as it stands.",
        wrong:
          "Look again at Layout A. It adds a sheet for every course and a column for every date, merges cells, and mixes a total into the records. Each of those makes it harder to keep right and to move.",
      },
      bridge:
        "Once the data has a simple shape, you can decide which parts should leave the workbook altogether, and that decision is the next lesson.",
    },
    {
      id: "what-you-move",
      title: "What you move",
      emphasis: "move",
      place:
        "This lesson is the fourth module of the course. It gives you three decisions for each part of a workbook, and the reasons that justify each one.",
      sections: [
        {
          heading: "Three decisions",
          paragraphs: [
            "Each part of the workbook gets one of three decisions. A part Moves to a system when it should live somewhere other than the spreadsheet. A part Stays in the workbook when the spreadsheet is the right place for it. A part should Retire it when nobody uses its result any more and it can be removed.",
            "The decision is made part by part, not for the whole file. A single workbook often ends with one table moving, two sheets staying and a tab being retired. Deciding the whole file at once is how teams end up either keeping everything out of habit or moving everything into a new tool that nobody asked for.",
          ],
        },
        {
          heading: "The reasons for each decision",
          paragraphs: [
            "A part moves to a system when several people need to add records at the same time, when others depend on it as the official record, when you need a history of who changed what, or when it holds personal data whose access should be restricted. The system can be modest, such as a shared list in a tool the organisation already pays for, and it does not have to be a new purchase.",
            "A part stays in the workbook when one person or a small group uses it for their own analysis or planning, where the flexibility of a spreadsheet is the point. A part is retired when nothing refers to it and nobody reads its result, which is more common than people expect in a workbook that has grown for years.",
          ],
          beforeAfter: {
            before: "Move the absence log to the HR system.",
            after:
              "The absence log moves to a system, because six managers update it and payroll uses it as the record each month.",
            reading:
              "The first line is a decision without a reason. The second gives the reason from this lesson, which is what lets a manager approve it or disagree with it.",
          },
        },
        {
          heading: "What moving is not",
          paragraphs: [
            "Moving is not the goal in itself. A badly shaped sheet moved into a new tool is still badly shaped, with the same monthly columns and the same mixed-in totals, and now it is harder to fix. Reshape first, as in the last lesson, and then decide what moves.",
            "The mistake people usually make is to treat retiring as a loss. An old tab that nothing refers to is one more place for someone to look up the wrong figure. Before you retire a part, check that no formula refers to it and ask the people who use the file, then keep a dated copy of the workbook so the tab can be found if anyone asks.",
          ],
        },
      ],
      workedExample: {
        title: "Deciding the grants workbook part by part",
        inputLabel: "The reshaped grants workbook",
        outputLabel: "The decision list",
        prompt:
          "Grants table\nSpending table\nBoard summary\nSheet7\nLookup of funder reporting dates",
        output:
          "The Grants table moves to a system, a Microsoft List, because the fundraising team and finance both add to it and it is the official record of what was awarded.\nThe Spending table stays in the workbook for now, because only the finance officer updates it, from the accounting system.\nThe Board summary stays in the workbook, because it is one person's report.\nSheet7 is retired, because its calculation now comes from the two tables.\nThe Lookup of funder reporting dates moves to a system, into the same List, as columns on each grant.",
        reading: [
          "Every part has one of the three decisions, and every decision has a reason taken from this lesson. A trustee reading the list could follow each one.",
          "Only two things move, and both go into a tool the trust already pays for. The rest stays because the spreadsheet suits one person's work.",
          "Sheet7 is retired because nothing needs it now that the shape is simpler. That is the second calculation from the first lesson, finally removed.",
        ],
      },
      practice: {
        intro:
          "Two colleagues at Harrow Vale Community Trust wrote decisions for the same volunteer workbook. The reasons for each decision are in the second section above.",
        check: {
          kind: "choose",
          prompt: "Choose the decision list you would take to the operations manager for approval.",
          leftLabel: "List A",
          left: "Move the whole workbook into a new volunteer management system, because spreadsheets are risky and a system would be more professional.",
          rightLabel: "List B",
          right:
            "The volunteer contact list moves to a system, because four coordinators add to it and it holds home phone numbers. The shift planner stays in the workbook, because only the coordinator uses it to plan the week. The 2021 events tab is retired, because nothing refers to it.",
          correct: "right",
          why: "List B decides part by part and gives each decision a reason from the lesson. It moves only the part that several people edit and that holds personal data, and it retires what nobody uses.",
          wrong:
            "Look again at List A. It decides the whole file at once, with a reason about spreadsheets in general rather than about any part of this one. List B gives each part its own decision and reason.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Gareth Owen, the HR team lead at Fenby Housing, is deciding what to do with the parts of the people workbook. For each part, choose the decision it deserves.",
        questions: [
          {
            id: "absence",
            situation:
              "The absence log is updated by six managers across three offices. Payroll takes the figures from it each month to work out sick pay.",
            question: "What should happen to the absence log?",
            options: [
              {
                id: "moves",
                text: MOVES,
                correct: true,
                feedback: "Several people add to it and payroll depends on it as the record, so it should move to a system.",
              },
              {
                id: "stays",
                text: STAYS,
                feedback: "Six managers editing a shared file that payroll relies on is exactly the case the lesson said should move.",
              },
              {
                id: "retire",
                text: RETIRE,
                feedback: "Payroll uses this every month, so it is very much in use and cannot be retired.",
              },
            ],
          },
          {
            id: "headcount",
            situation:
              "Gareth keeps his own sheet for modelling next year's headcount under three different budgets. Nobody else edits it, and he changes the assumptions most weeks.",
            question: "What should happen to the headcount model?",
            options: [
              {
                id: "moves",
                text: MOVES,
                feedback: "Nobody else adds to this sheet and it is not an official record. It is one person's modelling, so it stays in the workbook.",
              },
              {
                id: "stays",
                text: STAYS,
                correct: true,
                feedback: "This is one person's analysis, where the flexibility of a spreadsheet is the point, so it stays in the workbook.",
              },
              {
                id: "retire",
                text: RETIRE,
                feedback: "Gareth uses this sheet for planning every week, so there is no reason to retire it.",
              },
            ],
          },
          {
            id: "training",
            situation:
              "A tab called Training costs 2019 has not been opened since that year. No formula anywhere in the workbook refers to it.",
            question: "What should happen to the 2019 training costs tab?",
            options: [
              {
                id: "moves",
                text: MOVES,
                feedback: "Moving an unused tab only moves clutter into the new system. Nobody uses its result, so it should be retired.",
              },
              {
                id: "stays",
                text: STAYS,
                feedback: "Keeping an unused tab leaves one more place for confusion. Nobody uses its result, so it should be retired.",
              },
              {
                id: "retire",
                text: RETIRE,
                correct: true,
                feedback: "Nothing refers to it and nobody reads it, so it can be retired once a dated copy of the workbook is kept.",
              },
            ],
          },
          {
            id: "contacts",
            situation:
              "The staff list includes home addresses and emergency contacts. It is visible to everyone who opens the workbook, which is shared with all twenty managers.",
            question: "What should happen to the staff list with home addresses?",
            options: [
              {
                id: "moves",
                text: MOVES,
                correct: true,
                feedback: "Personal data whose access should be restricted belongs somewhere access can be controlled, so it moves to a system.",
              },
              {
                id: "stays",
                text: STAYS,
                feedback: "Everyone who opens this file can see home addresses. The lesson said restricted personal data should move.",
              },
              {
                id: "retire",
                text: RETIRE,
                feedback: "The team needs emergency contacts. The problem is who can see them, which is a reason to move them rather than remove them.",
              },
            ],
          },
        ],
        why: "You decided each part on its own reason. The absence log and the staff list move because others depend on them or they hold personal data, the headcount model stays because it is one person's analysis, and the 2019 tab is retired because nobody uses it.",
      },
      bridge:
        "You have now practised every move in the course. The next lesson brings them together in an assessment set in workbooks you have not seen yet.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It recaps the method, works one mixed example, and then assesses each move on workbooks you have not met before the final lesson asks you to map your own.",
      sections: [
        {
          heading: "The method in one place",
          paragraphs: [
            "The course has taught five moves, and they are used in order. First, you name the job of each sheet: it holds the records, it does the sums, or it shows the result, judged by what people do on it rather than by its name. Second, you trace one number that someone relies on, following each reference until every path ends in a value someone typed, and naming who types it.",
            "Third, you mark each part you found as a dangerous part or safe as it is. The dangerous kinds are a number typed into a formula, a figure pasted by hand, a range that stops short, two calculations of the same thing, work only one person understands, and personal data kept where too many people can see it.",
            "Fourth, you give the records a simpler shape: one table per kind of thing, one row per record, no merged cells, blank rows, mixed-in totals or monthly columns. Fifth, you decide each part on its own reason: it moves to a system, it stays in the workbook, or you retire it.",
          ],
        },
        {
          heading: "Reading a colleague's review",
          paragraphs: [
            "Much of the time you will be reading someone else's view of a workbook rather than writing your own. The practice below uses two labels for the sentences in such a review. A sentence Holds up when it follows one of the five moves properly, for example a trace that ends in a typed-in value, or a decision with a reason from the fourth module.",
            "A sentence Needs another look when it skips a step, such as a label given from the sheet's name, a trace that stops at a column that is itself a formula, or a decision with no reason. The label is not a judgement of the colleague. It tells you which sentence to ask about before the review goes to a manager.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "The assessment has seven situations, each taken from a workbook you have not met in the earlier lessons. Each situation has three options, and every option is something a reasonable colleague might suggest. Exactly one follows the method the course taught, and the others each skip or misapply one of the five moves.",
            "You need six of the seven to pass. When you submit, each question shows whether your choice was right and why, so you can see which move to revisit. If you do not reach the pass mark, read the feedback on the questions you missed, go back to the lesson that taught that move, and try again.",
          ],
        },
      ],
      workedExample: {
        title: "One workbook, all five moves",
        inputLabel: "The Ashby Leisure membership workbook",
        outputLabel: "The review the centre manager wrote",
        prompt:
          "Members: one row per member, typed in at reception, including date of birth and a medical notes column.\nFees: formulas working out each member's monthly fee, with the concession rate typed as *0.6 in each formula.\nMonthly income: a summary for the leisure trust board, adding Fees!D2:D900. There are now 1,040 members.",
        output:
          "Members holds the records. Fees does the sums. Monthly income shows the result.\nThe income figure adds Fees!D2:D900. Column D multiplies the standard fee by 0.6 for concessions. The standard fee and the concession flag are typed in at reception.\nDangerous parts: the range stops at row 900 of 1,040, the concession rate is typed into every formula, and medical notes are visible to all reception staff.\nSimpler shape: Members table with Member ID, Join date, Membership type and Concession (Yes or No), one row per member. Medical notes kept out of the workbook.\nDecisions: the Members table moves to a system, the booking system the centre already uses, because reception staff add members at the same time and it holds medical notes. Fees and Monthly income stay in the workbook, because only the finance officer uses them.",
        reading: [
          "Each line of the review is one move from the course, in the order the course taught them. A board member could read it without opening the file.",
          "The trace found the short range, which means about 140 members' fees have been missing from the board's income figure. The label of dangerous part made that visible before anyone had to explain a gap in the accounts.",
          "The decisions move only one part, into a tool the centre already has, and give a reason for each. That is the shape your own map will take in the final lesson.",
        ],
      },
      practice: {
        intro:
          "Here are four sentences from a colleague's review of a stock workbook. Mark each one with the two labels from the section above before you begin the assessment.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence of the review as Holds up or as Needs another look.",
          passLabel: "Holds up",
          failLabel: "Needs another look",
          sentences: [
            {
              id: "label",
              text: "The Calc sheet does the sums, because it is called Calc.",
              fail: true,
              why: "The label is given from the sheet's name. The course judges a sheet by what people do on it, so this needs another look.",
            },
            {
              id: "trace",
              text: "The reorder total adds column E, which multiplies the stock level in column C by the margin in Settings!B2, and column C is typed in by Lee every Monday.",
              fail: false,
              why: "The trace follows each reference to a typed-in value and names who types it, so it holds up.",
            },
            {
              id: "shape",
              text: "The new Deliveries table has Delivery ID, Date, Supplier and Quantity, with one row per delivery.",
              fail: false,
              why: "One table for one kind of thing, with one row per record, is the simpler shape, so it holds up.",
            },
            {
              id: "decision",
              text: "The supplier list should move to a system.",
              fail: true,
              why: "This is a decision with no reason. Say why it moves, for example because several people add to it.",
            },
          ],
          why: "That is right. The trace and the shape follow the method, while the label from the sheet's name and the decision without a reason need another look before the review goes further.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Each situation below comes from a workbook you have not seen before. Choose the move the course would make. You need six of seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "budget",
            situation:
              "At Oakridge Dental Group, practice managers type their monthly costs into the Budget sheet. The same sheet has a totals row after every tenth practice and a chart at the top that the finance director reads each month.",
            question: "What is the most useful first thing to say about the Budget sheet?",
            options: [
              {
                id: "a",
                text: "It is badly formatted, so the colours and headings should be tidied first.",
                feedback: "Tidying the formatting keeps the same tangle underneath. The sheet holds the records, does the sums and shows the result at once, and that is the first thing to name.",
              },
              {
                id: "b",
                text: "It holds the records, does the sums and shows the result on one sheet, so a practice manager typing a row could overwrite a total.",
                correct: true,
                feedback: "Naming the three jobs shows exactly why the sheet is fragile, and it tells you what to separate before anything else.",
              },
              {
                id: "c",
                text: "It shows the result, because the finance director reads it.",
                feedback: "The director reads the chart, but people also type records into this sheet and it contains totals. Giving it one label hides the tangle.",
              },
            ],
          },
          {
            id: "revenue",
            situation:
              "The sales director at Calder Logistics asks whether the £1.4 million northern region revenue on the quarterly pack can be trusted. The analyst who built it says it matches last quarter within a few per cent.",
            question: "What should you do before answering the director?",
            options: [
              {
                id: "a",
                text: "Tell the director it is reliable, since it matches last quarter.",
                feedback: "A figure that roughly matches last quarter can still be missing rows or using an old rate. Trace it back to what was typed in before you answer.",
              },
              {
                id: "b",
                text: "Rewrite the formula from scratch so that you know it is correct.",
                feedback: "Rewriting discards the evidence of what the figure currently depends on. Trace the existing formula first.",
              },
              {
                id: "c",
                text: "Trace the figure back through each formula to the values typed in, and note who types each one.",
                correct: true,
                feedback: "A trace tells you what the figure depends on and who is responsible for each input, which is what you need to answer the director honestly.",
              },
            ],
          },
          {
            id: "vat",
            situation:
              "The quote workbook at Pennine Joinery adds VAT with =D4*1.2 in forty separate formulas across four sheets. The rate is correct today, and the workbook has never given a wrong quote that anyone knows of.",
            question: "How should the VAT formulas be described?",
            options: [
              {
                id: "a",
                text: "Safe as it is, because the rate is correct and nothing has gone wrong.",
                feedback: "Dangerous does not mean wrong today. If the rate changed, forty formulas would need finding by hand and nothing would warn you about the one that was missed.",
              },
              {
                id: "b",
                text: "A dangerous part, because the rate is typed into each formula and a change would not reach them all.",
                correct: true,
                feedback: "A number typed into formulas is one of the dangerous kinds. Moving it to one labelled cell makes a change visible and complete.",
              },
              {
                id: "c",
                text: "A dangerous part, because VAT should never be worked out in a spreadsheet.",
                feedback: "Working out VAT in a spreadsheet is fine. The danger is that the rate is hidden inside forty formulas rather than kept in one cell.",
              },
            ],
          },
          {
            id: "range",
            situation:
              "The attendance summary at Riverside Food Bank adds C2:C150 on the Sessions sheet. Kofi, the volunteer coordinator, has been adding a row after every session, and the sheet now has 163 rows.",
            question: "What is the best response?",
            options: [
              {
                id: "a",
                text: "Change the range to C2:C200 so there is room for more sessions.",
                feedback: "A bigger fixed range only delays the same problem. Format the list as a Table or use a whole-column reference so the total grows with the data.",
              },
              {
                id: "b",
                text: "Ask Kofi to stop adding rows until the summary is fixed.",
                feedback: "The records are fine. The problem is the range in the formula, and stopping the records does not fix it.",
              },
              {
                id: "c",
                text: "Mark it as a dangerous part and make the list a Table, so the total includes every new row.",
                correct: true,
                feedback: "A range that stops short is a dangerous kind, and a Table grows with the data, so the total can no longer leave rows out.",
              },
            ],
          },
          {
            id: "volunteers",
            situation:
              "Riverside Food Bank also records volunteer hours on one sheet with a row per volunteer and a column for each month. Kofi adds a new column every month and a Total column on the right.",
            question: "Which shape should the volunteer hours take?",
            options: [
              {
                id: "a",
                text: "A Volunteer hours table with Volunteer ID, Month and Hours, one row for each volunteer in each month, and totals worked out on a separate sheet.",
                correct: true,
                feedback: "One row per record and a single Month column means the table grows downwards and never needs a new column, and the totals stay away from the records.",
              },
              {
                id: "b",
                text: "The same layout, with each month in a different colour so it is easier to read.",
                feedback: "Colour helps the reader but keeps a column for each month and a total mixed into the records, so the shape is unchanged.",
              },
              {
                id: "c",
                text: "One sheet per month, each with the volunteer names and their hours.",
                feedback: "A sheet per month is the same problem as a column per month. Use one table with a Month column instead.",
              },
            ],
          },
          {
            id: "bookings",
            situation:
              "At Westgate Clinic, three receptionists keep the room bookings in a shared workbook. Twice last month two of them booked the same room for the same hour, and the clinic already pays for a calendar tool that can manage rooms.",
            question: "What should happen to the room bookings?",
            options: [
              {
                id: "a",
                text: "Retire it, since the double bookings show the sheet does not work.",
                feedback: "The clinic still needs its bookings. Retiring is for parts nobody uses, and this one is used every day.",
              },
              {
                id: "b",
                text: "Stay in the workbook, with a note asking receptionists to check before booking.",
                feedback: "A note does not stop two people editing at once. Several people adding records at the same time is a reason the lesson gave for moving to a system.",
              },
              {
                id: "c",
                text: "Move to a system, the calendar tool the clinic already pays for, because several people book at the same time.",
                correct: true,
                feedback: "Several people adding records at once is a reason to move, and the system is one the clinic already has, so no new purchase is needed.",
              },
            ],
          },
          {
            id: "crm",
            situation:
              "The director of Northgate Estates wants the whole lettings workbook moved into a new property management system by the end of the quarter. The workbook still has a column for each month's rent and subtotals between landlords.",
            question: "What should you recommend?",
            options: [
              {
                id: "a",
                text: "Move the whole workbook as it is, so the deadline is met.",
                feedback: "Moving a badly shaped sheet moves the problem. The monthly columns and subtotals would arrive in the new system and be harder to fix there.",
              },
              {
                id: "b",
                text: "Reshape the rent records first, then decide part by part what moves, what stays and what is retired, with a reason for each.",
                correct: true,
                feedback: "Reshaping first and deciding part by part is the method. The director gets a move that works and a reason for every part.",
              },
              {
                id: "c",
                text: "Keep everything in the workbook, since it has worked for years.",
                feedback: "Having worked for years is not a reason the lesson gave for staying. Each part needs its own decision and reason.",
              },
            ],
          },
        ],
        why: "You applied each move of the course to a workbook you had not seen: naming the jobs, tracing a number, spotting the dangerous parts, choosing the simpler shape, and deciding part by part what moves.",
      },
      bridge:
        "You have passed the assessment. In the final lesson you bring the same five moves to one workbook your own team depends on and write the map that goes on your record.",
    },
    {
      id: "your-workbook-map",
      title: "Your workbook map",
      emphasis: "map",
      place:
        "This is the final lesson of the course. The map you write here is the work your signed record shows.",
      sections: [
        {
          heading: "What the map is",
          paragraphs: [
            "The workbook map is one page about a real workbook your team depends on. It names the workbook and its owner, lists each sheet with the job it does, gives the trace of one important number, lists the dangerous parts you found, gives the simpler shape for at least one table, and records a decision for each part with its reason.",
            "The map is not a request to replace the spreadsheet. A map that concludes most of the workbook should stay is a valid map, provided each decision has its reason. The test is whether a colleague could pick up the workbook tomorrow, using only your map, and know where the risks are and what is planned.",
          ],
        },
        {
          heading: "Write each part so a colleague can use it",
          paragraphs: [
            "The practice below uses two labels for the lines of a map. A line is Ready for a colleague when someone who has never opened the workbook could act on it, for example 'Rates!B2 is typed in by HR and was last changed in April'. A line is marked A colleague would have to ask when it leaves them guessing, for example 'the numbers come from the usual place'.",
            "Name the owner by role, such as the finance officer or the rota coordinator. Give the trace down to a cell or column and the person who types it. Name each dangerous part by its kind from the third lesson. Write the shape as column names with one row per record. Give every decision one of the three decisions and a reason from the fifth lesson.",
          ],
        },
        {
          heading: "Keep personal data out",
          paragraphs: [
            "The map will appear on a record that a second person can open. Do not paste any personal data into it, such as names with home addresses, dates of birth or health notes. Describe the column instead, for example 'column K holds staff home addresses', which tells a reader what the risk is without repeating it.",
            "Do not paste figures you would not be comfortable showing to someone outside the team. Where a real amount matters to the trace, you can replace it with a realistic example that keeps the same shape.",
          ],
        },
        {
          heading: "How the map is checked",
          paragraphs: [
            "When you continue, each part of the map is checked in turn. The workbook and owner must name the workbook and a role. The sheets must carry the job labels from the first lesson. The trace must reach a value that is typed in and name a cell, a column or a number. The dangerous parts must name at least one kind from the third lesson, or say which kinds were looked for. The shape must give one row per record. The decisions must use the three decisions from the fifth lesson.",
            "If a part is missing, the note names it and says what to add. When every part is present, you sign your name against the map, and the record shows it exactly as you wrote it.",
          ],
        },
      ],
      workedExample: {
        title: "A complete map for the rota workbook",
        inputLabel: "The HR adviser's notes on the Brightwater Homecare rota",
        outputLabel: "The workbook map she signed",
        prompt:
          "Rota workbook, owned by HR. Summary, Hours, Rates. Overtime total, short range, two rates at 15.5, hidden addresses. Want to move shifts to a shared list.",
        output:
          "Workbook and owner: the Brightwater Homecare rota workbook, owned by the HR adviser.\nSheets and their jobs: Hours holds the records, one row per shift. Rates holds the records, one cell per rate. Summary does the sums and shows the result for payroll.\nOne number traced: the overtime total on Summary adds Hours!H2:H200. Column H multiplies overtime hours in column G by Rates!B2. Column G is typed in by each shift lead, and Rates!B2 is typed in by HR.\nDangerous parts: two rows use 15.5 typed into the formula, the range stops at row 200 of 214, and column K holds home addresses in a file shared with twelve shift leads.\nA simpler shape: a Shifts table with Staff ID, Date, Hours and Overtime hours, one row per shift.\nWhat stays, moves or retires: the addresses move to a system, the HR system, because they are personal data. The Shifts table moves to a system, a shared list, because twelve shift leads add to it. The Summary stays in the workbook, because only HR uses it.",
        reading: [
          "Sophie turned a line of notes into six parts that each do one job. Every line could be acted on by someone who was not there when it was written.",
          "The trace ends at column G and Rates!B2 and names who types each, so the payroll team knows who to ask when the total looks wrong.",
          "The map is honest about what it will not change. The Summary stays, with its reason, which makes the map something a manager can approve in one reading.",
        ],
      },
      practice: {
        intro:
          "Before you write your own map, mark each line of this one for a stock workbook. Use the two labels from the second section above.",
        check: {
          kind: "mark",
          prompt: "Mark each line of the map as Ready for a colleague or as A colleague would have to ask.",
          passLabel: "Ready for a colleague",
          failLabel: "A colleague would have to ask",
          sentences: [
            {
              id: "owner",
              text: "Workbook and owner: the Marlow stock workbook, owned by the stock controller.",
              fail: false,
              why: "It names the workbook and the role that owns it, so a colleague knows whose file it is.",
            },
            {
              id: "trace",
              text: "One number traced: the reorder total comes from the usual place.",
              fail: true,
              why: "The usual place is not a cell, a column or a person. A colleague would have to ask where the total comes from.",
            },
            {
              id: "danger",
              text: "Dangerous parts: Lee pastes the stock levels into column C by hand every Monday.",
              fail: false,
              why: "It names the kind of dangerous part, the column and the person, so a colleague can act on it.",
            },
            {
              id: "decision",
              text: "What stays, moves or retires: some of it should probably move.",
              fail: true,
              why: "It does not say which part, which decision, or why. A colleague would have to ask what is planned.",
            },
          ],
          why: "That is right. The owner and the dangerous part are ready for a colleague, while the trace and the decision leave them asking where the number comes from and what is planned.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the map for one workbook your team depends on. Fill in every part so that a colleague could pick up the workbook tomorrow using only your map. Do not include any personal data.",
        fields: [
          {
            id: "owner",
            label: "Workbook and owner",
            hint: "The name of the workbook and the role of the person who owns it.",
            min: 12,
            rule: "role",
            missing:
              "Workbook and owner is still too thin. Name the workbook and the role of the person who owns it, for example the rota workbook, owned by the HR adviser.",
          },
          {
            id: "sheets",
            label: "Sheets and their jobs",
            hint: "Each sheet with its job: holds the records, does the sums, or shows the result.",
            min: 30,
            any: ["holds the records", "does the sums", "shows the result", "hold the records", "do the sums", "show the result"],
            missing:
              "Sheets and their jobs does not yet use the job labels. Say for each sheet whether it holds the records, does the sums, or shows the result.",
          },
          {
            id: "trace",
            label: "One number traced",
            hint: "Start at a result, follow each cell or column back to what is typed in, and say who types it.",
            min: 40,
            rule: "fact",
            any: ["typed", "entered", "keyed", "pasted", "types", "enters"],
            missing:
              "One number traced does not yet reach a typed-in value. Follow the result to a cell or column that someone types in, and say who types it.",
          },
          {
            id: "dangerous",
            label: "Dangerous parts",
            hint: "Each dangerous part with its kind and why it is dangerous, or the kinds you looked for if you found none.",
            min: 30,
            any: [
              "typed into",
              "typed inside",
              "hard-coded",
              "hard coded",
              "pasted",
              "range",
              "two calculations",
              "second calculation",
              "macro",
              "one person",
              "only understands",
              "personal data",
              "addresses",
              "looked for",
            ],
            missing:
              "Dangerous parts does not yet name a kind from the third lesson. Name at least one, such as a number typed into a formula, a figure pasted by hand, or a range that stops short, or say which kinds you looked for.",
          },
          {
            id: "shape",
            label: "A simpler shape",
            hint: "The column names of at least one table, with one row per record.",
            min: 25,
            rule: "shape",
            any: ["one row", "row per", "row for each", "each row"],
            missing:
              "A simpler shape does not yet say what one row holds. List the column names of one table and say that there is one row per record.",
          },
          {
            id: "decisions",
            label: "What stays, moves or retires",
            hint: "Each part with its decision and the reason for it.",
            min: 40,
            any: ["moves to a system", "move to a system", "stays in the workbook", "stay in the workbook", "retire"],
            missing:
              "What stays, moves or retires does not yet use the three decisions. For each part, say whether it moves to a system, stays in the workbook, or is retired, and give the reason.",
          },
        ],
        why: "Your map names the job of each sheet, traces a number to what was typed in, lists the dangerous parts, gives a simpler shape, and decides each part with a reason, so a colleague could pick up the workbook tomorrow using only your map.",
      },
      bridge:
        "Your map is ready to sign, and once you sign it the record will show it to anyone who opens the reference, so save a copy beside the workbook for the next person who opens it.",
    },
  ],
};
