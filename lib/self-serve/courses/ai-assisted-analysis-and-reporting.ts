/*
Course: AI-Assisted Analysis and Reporting
Slug: ai-assisted-analysis-and-reporting
For: Analysts, finance and operations staff, researchers, performance and insight teams, and managers who write
  monthly reports. They are comfortable with a spreadsheet, filters, and simple formulas, and they have an AI tool
  that can read a file or run calculations. No statistical training is assumed.
Outcome: The learner can use a model on real figures without reporting a number they cannot rebuild. A colleague
  could watch them trace each number to its rows and calculation, write a rebuild note, ask the tool for its
  working, and rewrite a finding so that it says only what the data shows.
Artefact: The working file for one real report: the report, the source data, every number with its method,
  the findings with their limits, and how the AI tool was used.
Record sentence: Wrote and signed a working file that lets a colleague rebuild every number in one real report
  and shows what the AI tool did and what was checked by hand.
Lessons (id, title, move, interaction, pass rule):
  1. where-a-number-is-invented, Where a number is invented. Tell a number that can be traced to its rows and
     calculation from one that cannot. Mark ("Rebuildable from the data" / "Not rebuildable"). Every sentence
     marked correctly.
  2. the-rebuild-test, The rebuild test. Write down the source, the selection, the calculation, and the result,
     and redo the calculation. Practice mark ("Written down" / "Missing"); check choose. The note a colleague
     could reproduce.
  3. ask-for-the-working, Ask for the working. Write a request that makes the tool show its method, rows, and
     treatment of blanks. Practice choose; check edit. The edit asks for the method and the rows, and sets
     limits on blank values and on comparisons.
  4. the-sentence-that-overclaims, The sentence that overclaims. Tell a finding the data supports from one that
     adds cause, trend, scope, or precision. Mark ("Says what the data shows" / "Claims more than the data
     shows"). Every sentence marked correctly.
  5. write-the-finding, Write the finding. Rewrite a finding with its numbers, scope, and the limit a reader
     needs. Practice choose; check edit. The edit gives both figures and the branch, says the data does not
     show cause, and names the limit.
  6. course-assessment, Course assessment. Apply every move to new situations. Practice choose; check scenario
     of seven questions, pass mark six.
  7. a-working-file, A working file. Write the working file for one real report. Practice mark ("A colleague
     could trace this" / "A colleague would have to ask"); check build. Report has a date or number; source
     data names an extract date or version; numbers name a calculation; findings carry a limit; AI use says
     what was checked.
Sources: HM Treasury, The Aqua Book: guidance on producing quality analysis for government. UK Government Analysis
  Function, Quality assurance of code for analysis and research (the Duck Book). Office for Statistics Regulation,
  Code of Practice for Statistics. NIST, Artificial Intelligence Risk Management Framework: Generative Artificial
  Intelligence Profile (NIST AI 600-1). Vendor documentation for the analysis features of the learner's own tool.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/

import type { CourseContent } from "./types.ts";

const REBUILDABLE = "Rebuildable from the data";
const NOT_REBUILDABLE = "Not rebuildable";
const SHOWS = "Says what the data shows";
const OVERCLAIMS = "Claims more than the data shows";

export const COURSE: CourseContent = {
  slug: "ai-assisted-analysis-and-reporting",
  hours: 2.5,
  artefact: {
    lessonId: "a-working-file",
    title: "The working file",
    recordLine:
      "Wrote and signed a working file that lets a colleague rebuild every number in one real report and shows what the AI tool did and what was checked by hand.",
  },
  lessons: [
    {
      id: "where-a-number-is-invented",
      title: "Where a number is invented",
      emphasis: "invented",
      place:
        "This is the first of seven lessons. It explains how a wrong number gets into a report that an AI tool helped to write, so that the test you learn in the next lesson has a clear purpose.",
      sections: [
        {
          heading: "A model can write a number it never calculated",
          paragraphs: [
            "A language model answering in plain text produces numbers in the same way that it produces words. It predicts what is likely to come next, given your question and everything it has seen of writing like the answer you want. A total, a percentage, or an average in its answer can therefore appear because an answer of that kind usually contains one, and not because any arithmetic took place.",
            "Some tools can also run code or spreadsheet formulas on a file you give them. When they do, the arithmetic itself is reliable, because a computer added the column. That is a real improvement, but it moves the risk rather than removing it. The tool still decides which column to add, which rows to include, and what to do with a cell it cannot read, and it can make each of those decisions without telling you.",
            "The result, in both cases, is a number that reads exactly like a correct one. It sits in a fluent sentence, it has a sensible number of digits, and it is usually close to what you expected. Nothing about the way it looks tells you whether it came from your data.",
          ],
        },
        {
          heading: "Four places a number goes wrong",
          paragraphs: [
            "There are four common places where a number in an AI-assisted report is invented or distorted. The first is that the model writes a number it did not calculate. This is most likely when the tool is answering in prose, and when you ask for something that sounds routine, such as a growth rate or an average.",
            "The second is that the tool calculates on the wrong data. It may read the wrong column, use the wrong date range, apply a filter you did not ask for, or quietly drop rows it could not parse. The third is that it fills a gap. When a figure it needs is not in the file, such as last year's total or a previous month for comparison, it may supply one that fits the story rather than saying the figure is missing.",
            "The fourth is that it rounds or restates a figure in a way that changes its meaning. A share of 29% becomes 'about a third', an average for resolved cases becomes an average for all cases, and a count of complaints becomes a complaint rate. Each restatement may be close, but none of them is the number the data produced.",
          ],
        },
        {
          heading: "Rebuildable from the data, or not rebuildable",
          paragraphs: [
            "This course uses two labels for every number in an answer. A number is Rebuildable from the data when you can point to the rows, the filter, and the calculation that produce it, and those rows are in the data you have. 'Total sales were £1,284,500, the sum of the Sales column across all 312 rows' is rebuildable from the data, because anyone with the file could add the column and get the same answer.",
            "A number is Not rebuildable when you cannot point to those things. It may compare with a period that is not in the file, give a share without saying what it was a share of, or state a figure without any method at all. A number that is not rebuildable may still turn out to be correct, but until it has been traced, nobody should report it or act on it.",
            "The labels are about traceability, not about whether a number looks right. A figure that matches your instinct can be not rebuildable, and a surprising figure can be rebuildable from the data and entirely correct.",
          ],
        },
        {
          heading: "What this lesson is not saying",
          paragraphs: [
            "This lesson does not say that AI tools are useless for analysis. They can read a large file quickly, write the formula you would have spent twenty minutes on, and draft a summary that saves an afternoon. The rest of this course assumes you will keep using them.",
            "What it does say is that a number has to be traced back to the data before anyone else relies on it. The usual mistake is to check the numbers that look odd and pass the ones that look plausible. A model is very good at producing plausible numbers, so plausibility is the one test that tells you least.",
          ],
        },
      ],
      workedExample: {
        title: "An average and a comparison from one month's file",
        inputLabel: "The request and the file",
        prompt:
          "An operations analyst at Pennant Home Services uploads 'Sept_tickets.xlsx', an export of the 1,200 support tickets opened in September, and asks: 'What was our average resolution time, and how did it compare with August?'",
        outputLabel: "What the tool answered",
        output:
          "The average resolution time in September was 6.4 hours, an improvement of 12% on August's 7.3 hours.",
        reading: [
          "The file contained September only. There was no August data in it, so the August figure of 7.3 hours and the 12% improvement could not have been calculated from it. The tool filled a gap, and the comparison is not rebuildable from the data.",
          "The analyst then asked how 6.4 had been worked out. The tool showed that it had excluded 140 tickets whose resolution time cell was blank. Those were the tickets still open when the file was exported. Nobody had asked for them to be left out, and the answer did not say they had been.",
          "Both numbers were distorted, in different ways. The comparison was a gap filled with a figure that fitted, and the average was calculated on a subset that nobody chose. Neither problem was visible in the sentence the tool wrote, which read as a clean, finished result.",
        ],
      },
      practice: {
        intro:
          "Here is a small file and a two-sentence summary a tool wrote from it. Decide, for each sentence, whether you could rebuild the figure from the file. The section defining the two labels is above if you want to read it again.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence of the summary as Rebuildable from the data or as Not rebuildable.",
          material: {
            label: "The file",
            text: "Timesheets for the Leeds warehouse, week commencing 6 October. 48 rows, one per person. Columns: Name, Shift, Hours. No other weeks are included.",
          },
          passLabel: REBUILDABLE,
          failLabel: NOT_REBUILDABLE,
          sentences: [
            {
              id: "total",
              text: "Total hours logged were 1,912, the sum of the Hours column across all 48 rows.",
              fail: false,
              why: "It names the column, the rows, and the calculation, so you could add the column yourself and check it.",
            },
            {
              id: "week-before",
              text: "This is about 5% higher than the week before.",
              fail: true,
              why: "The file holds one week only, so a comparison with the week before cannot have been calculated from it.",
            },
          ],
          why: "That is right. The total names its column, rows, and calculation, and the comparison refers to a week that is not in the file.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "An analyst at Harlow Supplies gave a model a file of this quarter's sales by region and asked for a summary. The file has no data from previous quarters. Mark each figure in the summary.",
        material: {
          label: "The file",
          text: "Q3 sales by region, Harlow Supplies. 312 rows, one per order. Columns: Order date, Region, Sales. July to September only.",
        },
        passLabel: REBUILDABLE,
        failLabel: NOT_REBUILDABLE,
        sentences: [
          {
            id: "total",
            text: "Total sales this quarter were £1,284,500, calculated as the sum of the Sales column across all 312 rows.",
            fail: false,
            why: "The summary says which column and how many rows were summed, so you could rebuild this figure from the file.",
          },
          {
            id: "last-quarter",
            text: "This is up 8% on last quarter.",
            fail: true,
            why: "There is no data for last quarter in the file, so this comparison could not have been calculated from it. It fills a gap.",
          },
          {
            id: "north",
            text: "The North region accounted for about a third of sales.",
            fail: true,
            why: "'About a third' gives no figure and no calculation. As written you cannot rebuild it, so you would need the North total and the method first.",
          },
        ],
        why: "You kept the figure that names its rows and its calculation, and you marked the comparison with a quarter that is not in the file and the vague share as not rebuildable. Those are the two sentences a board member would have quoted back to you.",
      },
      bridge:
        "The next lesson turns these two labels into a test you apply to every number before it goes into a report.",
    },
    {
      id: "the-rebuild-test",
      title: "The rebuild test",
      emphasis: "rebuild",
      place:
        "This is the second of seven lessons. It gives you the central test of the course, which every later lesson assumes you are applying.",
      sections: [
        {
          heading: "The question the test asks",
          paragraphs: [
            "The rebuild test asks one question of each number you intend to report. Could I, or a colleague who was not involved, reproduce this number from the named data using a stated method? If the answer is yes, and you have done it, the number can go in the report. If the answer is no, the number stays out until it can be rebuilt.",
            "You apply the test yourself, before the report leaves your hands. In practice that means either redoing the calculation in a spreadsheet, with your own filter and your own formula, or reading and running the code the tool produced and confirming that it does what you intended. Either way, you end with a result you produced and can compare with the figure in the draft.",
          ],
        },
        {
          heading: "Four things written down",
          paragraphs: [
            "To pass the test, four things have to be written down. The source is the file or system the number came from, with its version or extract date, because the same report run on a later extract will give a different answer. The selection is every filter, date range, or exclusion that decided which rows were counted. The calculation is the formula or code that turned those rows into the number. The result is the number itself, which must match what appears in the report.",
            "When you read a rebuild note, check each of the four parts in turn and say whether it is written down or missing. A note with three of the four is not nearly finished. It is a note that a colleague cannot use, because the missing part is exactly the one they would have to guess.",
          ],
          beforeAfter: {
            before: "Average resolution time: 6.4 hours (from the ticket data).",
            after:
              "Source: 'Sept_tickets.xlsx', ticket system export, 1 October 09:00. Selection: status 'Resolved' only, 1,060 of 1,200 rows, 140 open tickets excluded. Calculation: AVERAGE of column F. Result: 6.4 hours. Rebuilt in the spreadsheet: 6.4, matches.",
            reading:
              "The first version names a vague source and nothing else. The second names the extract, the rows kept and dropped, and the formula, and it says the figure was rebuilt and matched, so a colleague could reproduce it in a few minutes.",
          },
        },
        {
          heading: "What does not count as a rebuild",
          paragraphs: [
            "Asking the model whether it is sure is not a rebuild. A model will often confirm a number that it did not calculate, because a confident confirmation is a likely reply to that question. Its answer tells you about the conversation, not about the data.",
            "A figure looking about right is not a rebuild either. The numbers a model produces without calculating are, almost by definition, the numbers that look about right. A result is rebuilt when you have produced it again from the source using the written selection and calculation, and compared the two.",
          ],
        },
        {
          heading: "Why the test matters at work",
          paragraphs: [
            "A reported number leaves your control as soon as the report is sent. It is quoted in a board paper, used to set a budget, or compared with next month's figure by someone who assumes the method did not change. If it cannot be rebuilt, nobody can find out later why it moved, and the organisation is left defending a figure that nobody can explain.",
            "UK government guidance on analytical quality makes the same point in its own terms. HM Treasury's Aqua Book treats reproducibility and quality assurance as central to analysis that others rely on, and the Analysis Function's guidance on code for analysis, often called the Duck Book, expects that someone other than the author can run the work again. The usual mistake is to write the note after the report has gone, from memory. Write it while the file is open, and rebuild the figure before you paste it anywhere.",
          ],
        },
      ],
      workedExample: {
        title: "A rebuild note for one figure",
        inputLabel: "The figure to be reported",
        prompt:
          "The Pennant Home Services analyst from the first lesson wants to report September's average resolution time. The tool gave 6.4 hours and, when asked, said it had excluded 140 tickets with a blank resolution time.",
        outputLabel: "The rebuild note",
        output:
          "Source: ticket export 'Sept_tickets.xlsx', extracted 1 October 09:00, 1,200 rows. Selection: tickets with status 'Resolved' only, 1,060 of 1,200; 140 open tickets excluded because they have no resolution time. Calculation: AVERAGE of column F, 'Resolution hours', for those rows. Result: 6.4 hours. Rebuilt in the spreadsheet with a filter on status: 6.4 hours, matches.",
        reading: [
          "The number itself did not change, but it is now honest. The report can say 'average resolution time for resolved tickets', and a reader knows that the 140 open tickets are not included. A manager asked where 6.4 came from can answer in one sentence.",
          "The August comparison was removed from the draft, because it could not be rebuilt from September's file. It went back in later, taken from the August export with its own rebuild note using the same selection and calculation, so the two months were compared on the same method.",
          "The note took about five minutes to write and rebuild. That is the cost of the test, and it is small beside the cost of withdrawing a figure after the board has used it.",
        ],
      },
      practice: {
        intro:
          "Here is a rebuild note for a spending figure. Check each of the four parts in turn and say whether it is written down or missing. The section on the four parts is above if you want it.",
        check: {
          kind: "mark",
          prompt: "Read the note and mark each part as Written down or as Missing.",
          material: {
            label: "The rebuild note",
            text: "Figure: £48,210 spent on agency staff in September. Source: finance ledger export 'agency_spend.xlsx', extracted 2 October. Selection: cost centre 410, transactions dated 1 to 30 September. Result: £48,210.",
          },
          passLabel: "Written down",
          failLabel: "Missing",
          sentences: [
            {
              id: "source",
              text: "The source, with its version or extract date",
              fail: false,
              why: "The note names the ledger export and the date it was extracted, so the source is written down.",
            },
            {
              id: "selection",
              text: "The selection",
              fail: false,
              why: "The cost centre and the date range are both stated, so the selection is written down.",
            },
            {
              id: "calculation",
              text: "The calculation",
              fail: true,
              why: "The note never says whether the figure is a sum of the Amount column, net of credits, or something else, so the calculation is missing.",
            },
            {
              id: "rebuilt",
              text: "A rebuild that matched",
              fail: true,
              why: "The note gives a result but does not say that anyone redid the calculation and got the same figure, so the rebuild is missing.",
            },
          ],
          why: "That is right. The source and the selection are written down, but a colleague would still have to guess the calculation, and nothing shows that the figure was rebuilt.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two analysts at Linwood Software have written notes for the same reported figure, '73% of customers renewed'. Choose the note that passes the rebuild test.",
        leftLabel: "Note A",
        left: "The AI tool calculated this from the renewals data and confirmed it was accurate when I asked it to check.",
        rightLabel: "Note B",
        right:
          "Source: CRM export 'renewals_Q3.csv', extracted 2 October. Selection: customers whose contract ended in Q3, 418 rows; 12 rows with no end date excluded. Calculation: count of 'Renewed = Yes' divided by 418. Result: 305 of 418, 73.0%. Rebuilt in a spreadsheet, matches.",
        correct: "right",
        why: "Note B names the source and its extract date, the selection including the 12 rows excluded, the calculation, and the result, and it says the figure was rebuilt and matched. A colleague could reproduce it from that note alone.",
        wrong:
          "Look again at Note A. It relies on the tool confirming its own figure, which is not evidence, and it gives no source, selection, or calculation. Nobody could rebuild 73% from it. Note B has all four parts and a rebuild.",
      },
      bridge:
        "The rebuild test is much quicker when the tool shows its working in the first answer, and the next lesson shows you how to ask for that.",
    },
    {
      id: "ask-for-the-working",
      title: "Ask for the working",
      emphasis: "working",
      place:
        "This is the third of seven lessons. It makes the rebuild test practical by changing what you ask the tool for, so that the parts of a rebuild note arrive with the answer.",
      sections: [
        {
          heading: "What asking for the working means",
          paragraphs: [
            "Asking for the working means writing your request so that the tool returns, alongside each number, the data it used, the rows it included and excluded, and the formula or code it ran. You are asking for the four parts of the rebuild note, in the tool's first answer, rather than digging them out afterwards with follow-up questions.",
            "A request that asks for the working is not a longer version of the same question. It changes what the tool does. A tool that has been asked to state its exclusions is less likely to apply one silently, and when it does exclude rows you can see how many and why. A tool that has been told what to do with a blank cell has no reason to guess.",
          ],
        },
        {
          heading: "Ask it to calculate, and to show the calculation",
          paragraphs: [
            "Where your tool can run code or spreadsheet formulas, ask it to do so rather than to answer in prose, and ask it to show you the code or the formula. The vendor documentation for your tool will say whether it can run calculations and how it displays them. A number produced by code you can read is one you can check. A number written in a sentence gives you nothing to check.",
            "Name the columns you mean, using the headings in the file. 'The average of column F, Resolution hours' leaves the tool much less room than 'the average resolution time', especially in a file with a column for first response time as well. Where the calculation involves a choice, such as whether to use the mean or the median, make the choice yourself and say it.",
          ],
        },
        {
          heading: "Say what to do when data is missing",
          paragraphs: [
            "The two gaps that cause most trouble are blank cells and missing periods. For blank cells, tell the tool to report how many there are and not to treat them as zero, because an average that counts blanks as zero is lower than the true figure, and one that drops them silently may describe a different group from the one you think. For missing periods, tell it not to compare with any period that is not in the file.",
            "Write these instructions as plain limits that begin with do not, must not, never, or only. A request to be careful or accurate does not tell the tool what to leave out, so it has no effect on the gap it would otherwise fill.",
          ],
          beforeAfter: {
            before: "Work out the average resolution time and how it compares with last month. Please be accurate.",
            after:
              "Calculate the average of column F, Resolution hours. If a value is blank, report how many are blank and do not treat them as zero. Do not compare with any month that is not in this file.",
            reading:
              "The first version asks for accuracy and a comparison the file cannot support. The second names the column, says exactly what to do with blanks, and rules out the comparison, so the tool cannot fill either gap.",
          },
        },
        {
          heading: "What this does not replace",
          paragraphs: [
            "Asking for the working does not replace the rebuild test. The tool can still misread your instruction, and its description of what it did can be wrong. What the request gives you is the material for a rebuild in minutes rather than hours: the rows, the filter, and the formula are in front of you, and you only have to run them yourself and compare.",
            "The usual mistake is to add 'show your working' to the end of a request and stop there. The tool may then explain its method in a paragraph of prose, which is a description, not the working. Ask for the code or formula, the count of rows used and excluded with the reason, and the treatment of blanks, each as a separate instruction.",
          ],
        },
      ],
      workedExample: {
        title: "The ticket request, rewritten",
        inputLabel: "The revised request",
        prompt:
          "Using the attached file, calculate the average of column F, 'Resolution hours'. Run the calculation as code and show me the code. Tell me how many rows you used, how many you excluded, and why. If a value needed for the calculation is blank, report it and do not treat it as zero. Do not compare with any period that is not in this file.",
        outputLabel: "What the tool returned",
        output:
          "The tool returned five lines of code. It stated that 140 rows were excluded because column F was blank and the status was 'Open', gave an average of 6.4 hours for the remaining 1,060 rows, and said that no comparison with another month was possible with the data supplied.",
        reading: [
          "Everything the analyst had to discover by questioning in the first lesson was in the first answer. The exclusion of 140 open tickets was stated rather than hidden, and the comparison with August was declined rather than invented.",
          "She checked the answer against her rebuild note in about two minutes. The code filtered on the same status, averaged the same column, and gave the same result she got in the spreadsheet.",
          "The request is longer than the original question by four sentences. Each sentence closes one of the gaps you met in the first lesson, which is why it is worth the extra lines.",
        ],
      },
      practice: {
        intro:
          "Here are two requests for the same figure from a housing repairs file. Choose the one that will return what you need for a rebuild. The sections above describe each part of a good request.",
        check: {
          kind: "choose",
          prompt:
            "Fenwick Housing wants the median number of days to complete an urgent repair in October. Choose the request that asks for the working.",
          leftLabel: "Request A",
          left: "Using 'repairs_Oct.xlsx', calculate the median of the column 'Days to complete' for rows where Priority is 'Urgent'. Run it as code and show the code. Tell me how many urgent rows you used and how many you excluded, and why. Report any blank values and do not treat them as zero.",
          rightLabel: "Request B",
          right:
            "Look at the repairs file and tell me how quickly we fix urgent repairs. Please be thorough, double-check your numbers, and show your working.",
          correct: "left",
          why: "Request A names the file, the column, the selection, and the calculation, asks for the code, the rows used and excluded, and says what to do with blanks. Request B asks for care and working in general terms, so the tool chooses the measure, the rows, and the treatment of blanks for itself.",
          wrong:
            "Look again at Request B. 'Show your working' and 'double-check' do not say which column, which rows, or what to do with blank values, so the answer may be a paragraph of prose you cannot rebuild. Request A asks for each of those things.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "Edit this request so that the tool shows its working. It should ask for the calculation method, the rows used and excluded, say what to do with blank values, and set a limit on comparisons.",
        material: {
          label: "The file",
          text: "'overtime_Sept.xlsx': one row per person per week for September, 212 rows. Columns: Name, Team, Week, Overtime hours. Some Overtime hours cells are blank. No other month is included.",
        },
        label: "The request you are rewriting",
        start:
          "Look at this spreadsheet of staff overtime and tell me the average overtime per person last month and whether it has gone up.",
        unchanged:
          "You have not changed the request yet. Add sentences that ask for the formula or code, the rows used and excluded, what to do with blanks, and a limit on comparisons.",
        keep: [
          {
            id: "task",
            any: ["overtime"],
            missing: "Keep the task. The request should still ask for average overtime.",
          },
          {
            id: "method",
            any: ["code", "formula", "calculation", "calculate", "method"],
            missing: "Ask the tool to show the formula or code it used, so you can rebuild the figure.",
          },
          {
            id: "rows",
            any: ["rows", "records", "excluded", "exclude"],
            missing: "Ask how many rows were used and how many were excluded, and why.",
          },
        ],
        limits: [
          {
            id: "blanks",
            any: ["blank", "empty", "missing", "zero"],
            missing:
              "Say what to do with blank values in a limit, for example 'Report any blank values and do not treat them as zero.'",
          },
          {
            id: "comparison",
            any: ["compar", "period", "previous", "earlier", "other month", "another month", "gone up", "increase", "last year", "august"],
            missing:
              "The request still asks whether overtime has gone up. Add a limit such as 'Do not compare with any period that is not in this file.'",
          },
        ],
        why: "Your request asks for the method, the rows used and excluded, the treatment of blanks, and limits comparisons to the data supplied. The answer will arrive with what you need to rebuild it, and it cannot claim a rise the file does not show.",
        result: {
          label: "What the tool returns to your request",
          text: "Code: the mean of 'Overtime hours' grouped by Name, then the mean across people. Rows used: 198 of 212. Rows excluded: 14, because Overtime hours was blank; these are listed below. Average overtime per person in September: 9.6 hours. No comparison has been made, because the file contains September only.",
        },
      },
      bridge:
        "With the numbers rebuilt, the next lesson turns to the sentences around them, where a correct number can still be used to say something the data does not show.",
    },
    {
      id: "the-sentence-that-overclaims",
      title: "The sentence that overclaims",
      emphasis: "overclaims",
      place:
        "This is the fourth of seven lessons. It moves from numbers to findings, which are the sentences readers of a report most often act on.",
      sections: [
        {
          heading: "A correct number in a sentence that says too much",
          paragraphs: [
            "An overclaim is a sentence that says more than the data can support, even when every number in it is correct. The figures pass the rebuild test, but the sentence around them adds a cause, a trend, a scope, or a degree of certainty that the data does not contain.",
            "Models write findings in the confident register of published reports and press releases, because that is what most finished analysis they have seen sounds like. Ask for a summary of two months of figures and you will often receive a sentence that explains why the figures moved and what they mean for the whole organisation. The explanation is fluent and plausible, and it did not come from the data.",
          ],
        },
        {
          heading: "Five common overclaims",
          paragraphs: [
            "The first is cause from a pattern: saying that a campaign increased sales because sales rose after it, when something else could have caused both. The second is a trend from too few points: calling two months a trend, or one good quarter a turnaround. The third is the whole from a part: generalising from one team, one site, or a voluntary survey to everyone.",
            "The fourth is false precision: reporting a percentage to one or two decimal places from a sample of twelve, which implies a certainty the data cannot give. The fifth is statistical words used loosely: 'significant', 'correlated', or 'representative' where no test or sampling design stands behind the word. A reader with training will take 'significant' to mean that a test was done.",
          ],
        },
        {
          heading: "Two labels for a finding",
          paragraphs: [
            "This lesson uses two labels for each sentence in a finding. A sentence Says what the data shows when a careful reader who had the data in front of them would agree with it. 'Sickness absence at head office was 4.1% in February and 3.2% in April' says what the data shows, because it gives the figures, the place, and the months, and it claims nothing more.",
            "A sentence Claims more than the data shows when it adds cause, trend, scope, or precision that the data does not have. 'The wellbeing app cut absence across the organisation' claims more than the data shows if only one site used the app and nothing rules out other explanations. The numbers can be identical in both sentences. What differs is what the sentence asks the reader to believe.",
          ],
        },
        {
          heading: "What this is not, and the usual mistake",
          paragraphs: [
            "Spotting an overclaim is not the same as distrusting every finding. A finding that the data supports should be reported plainly, without a cloud of qualifications. If complaints fell from 40 to 12 over a year of monthly data at every branch, you can say so directly.",
            "The usual mistake is to check the numbers carefully and then read the sentence around them for tone. A finding can be well written, measured in its language, and still claim a cause. Read each finding by asking which of the five overclaims it could contain, and whether the data in front of you rules each one out.",
          ],
        },
      ],
      workedExample: {
        title: "A finding about sickness absence",
        inputLabel: "The model's draft finding",
        prompt:
          "Following the launch of the wellbeing app in March, sickness absence fell significantly, from 4.1% to 3.2%, proving the app's impact across the organisation.",
        outputLabel: "What the data showed",
        output:
          "The two figures are correct for February and April. Only the head office used the app. No statistical test was done. April includes the Easter bank holidays, and absence at head office was at a similar level in April the previous year.",
        reading: [
          "The sentence claims cause with 'proving the app's impact', a trend from two points, the whole organisation from one site, and significance with no test behind it. Four of the five overclaims sit in one sentence, around two correct numbers.",
          "A version that says what the data shows reads: 'Sickness absence at head office was 4.1% in February and 3.2% in April. The wellbeing app launched at head office in March. Absence was at a similar level in April last year, so this report does not attribute the change to the app.'",
          "The rewrite keeps both numbers and the launch date, which is useful to the reader. It removes what the data cannot support, and it names the one fact, last year's April, that most changes how the fall should be read.",
        ],
      },
      practice: {
        intro:
          "Here are two sentences written from a small set of returns figures. Mark each one with the labels you have just learned. The definitions are in the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence as Says what the data shows or as Claims more than the data shows.",
          material: {
            label: "The data",
            text: "Customer returns at the Nottingham store: 212 in September, 188 in October. No other months or stores are included.",
          },
          passLabel: SHOWS,
          failLabel: OVERCLAIMS,
          sentences: [
            {
              id: "fell",
              text: "Returns at the Nottingham store fell from 212 in September to 188 in October.",
              fail: false,
              why: "It gives both figures, the store, and the two months, and claims nothing beyond them.",
            },
            {
              id: "trend",
              text: "Returns are on a clear downward trend.",
              fail: true,
              why: "Two months are two points. The data cannot show a trend, and the sentence also drops the store, so it reads as if it applies everywhere.",
            },
          ],
          why: "That is right. The first sentence stays with the store and the two figures, and the second turns two points into a trend.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A model wrote these sentences from a staff survey at Castleford Distribution. Mark each sentence.",
        material: {
          label: "The data",
          text: "Staff survey on the new rota. 86 of 400 staff responded, voluntarily. 61 of the 86 said they were satisfied with the new rota. There was no survey before the rota changed.",
        },
        passLabel: SHOWS,
        failLabel: OVERCLAIMS,
        sentences: [
          {
            id: "respondents",
            text: "61 of the 86 staff who responded said they were satisfied with the new rota.",
            fail: false,
            why: "This sentence gives the count and limits it to the people who responded, so it says what the data shows.",
          },
          {
            id: "most",
            text: "Most staff are satisfied with the new rota.",
            fail: true,
            why: "Only 86 of 400 staff responded, voluntarily, so the data cannot tell you what most staff think. It generalises from a part to the whole.",
          },
          {
            id: "precision",
            text: "Satisfaction was 70.93%.",
            fail: true,
            why: "The arithmetic is right, but two decimal places from 86 voluntary responses is false precision. 'About 71% of those who responded' is as precise as the data allows.",
          },
          {
            id: "morale",
            text: "The new rota has improved morale.",
            fail: true,
            why: "The survey asked about satisfaction with the rota, not morale, and there is no earlier measure, so the sentence claims a cause and a change that are not in the data.",
          },
        ],
        why: "You kept the finding that sticks to the respondents, and you caught the generalisation to all staff, the false precision, and the claim of cause. Those three sentences are the ones a director would have repeated in a meeting.",
      },
      bridge:
        "The next lesson practises the repair: rewriting a finding so that it says exactly what the data shows, with the one limit the reader needs.",
    },
    {
      id: "write-the-finding",
      title: "Write the finding",
      emphasis: "finding",
      place:
        "This is the fifth of seven lessons. It turns recognition into writing, so that before you build the working file you can produce findings that survive both tests.",
      sections: [
        {
          heading: "What a finding contains",
          paragraphs: [
            "Writing a finding means stating what the data shows, for whom, over what period, at the precision the data supports, with any limit the reader needs to know. A good finding usually has three parts. The observation gives the numbers. The scope says who and when: which site, which team, which months, which respondents. The limit says what the data cannot tell the reader, where that matters to the decision they are about to make.",
            "A finding with all three parts is often only one or two sentences long. 'Of the 86 staff who answered the voluntary survey, 61 said they were satisfied with the new rota' already contains an observation and a scope. Whether it needs a limit depends on what the reader will do next.",
          ],
        },
        {
          heading: "The limit that changes the decision",
          paragraphs: [
            "The limit you include is the one that would change the reader's decision if they did not know it. If a manager is deciding whether to roll a rota out to every site, the fact that the night shift barely responded matters, because it may be the shift the rota suits least. If the same manager only wants to know whether to keep the rota at one site, a low response rate overall may matter less.",
            "Choosing the limit therefore means thinking about the reader, not only about the data. Ask what they will do with this sentence, and what fact about the data would make them do something different. That fact is the limit, and it goes in the finding in plain words.",
          ],
          beforeAfter: {
            before: "Bookings rose after the price change, although results should be treated with caution.",
            after:
              "Bookings at Kendal pool rose from 340 in September to 410 in October, the first month at the lower price. October included half-term, so this report does not attribute the rise to the price change.",
            reading:
              "The first version adds a general warning that tells the reader nothing specific. The second gives the numbers and the pool, and names the one fact, half-term, that a reader deciding on prices across the trust needs to know.",
          },
        },
        {
          heading: "Precision the data supports",
          paragraphs: [
            "Report numbers at the precision the data can bear. A count is exact and can be given as it is. A percentage from a small or voluntary sample should be rounded to a whole number, and it is often clearer to give the count alongside it, as in '61 of 86, about 71%'. A difference between two small numbers is usually better stated as the two numbers than as a percentage change.",
            "Avoid statistical words unless the analysis behind them was done. If nobody ran a test, do not write 'significant'. If the respondents were not sampled to represent the whole, do not write 'representative'. Plain words such as 'rose', 'fell', and 'of those who responded' say what happened without implying a method that was not used.",
          ],
        },
        {
          heading: "What this is not, and the usual mistake",
          paragraphs: [
            "A finding is not weakened by stating its limits. It becomes more useful, because a reader can act on it without being caught out later when someone else points out the half-term or the missing night shift. A finding that has already named its limit is also much harder to misquote.",
            "The usual mistake runs the other way from overclaiming. Having learned to distrust confident sentences, people add a standard caveat to every finding, such as 'results should be treated with caution' or 'may not be representative'. Readers learn to skip those phrases, so they carry no information. Name the specific limit, once, where it matters.",
          ],
        },
      ],
      workedExample: {
        title: "The rota finding, rewritten",
        inputLabel: "The sentence that overclaimed",
        prompt: "Most staff are satisfied with the new rota.",
        outputLabel: "The finding that went in the report",
        output:
          "Of the 86 staff who answered the voluntary survey, 61 said they were satisfied with the new rota. With just over a fifth of staff responding, this may not reflect everyone's view, and only four responses came from the night shift, so the rota team may want to speak to that shift directly before extending the rota.",
        reading: [
          "The finding keeps the good news and gives the numbers it rests on. It says who answered, so nobody reads 61 as a count of all staff.",
          "It adds one limit, and it is the limit that matters to the decision in front of the rota team. Four responses from the night shift is too few to say anything about that shift, and the night shift is where a rota change is most likely to cause problems.",
          "A manager reading this finding can now decide what to do next. That is the test of a finding: it tells the reader what the data shows and what it does not, in time for the decision.",
        ],
      },
      practice: {
        intro:
          "Here are two findings written from the same delivery data. Choose the one that could go in the report as it stands. The three parts of a finding are described in the sections above.",
        check: {
          kind: "choose",
          prompt:
            "Brookfield Logistics delivered 1,940 of 2,050 parcels on time from its Swindon depot in October. The depot changed its loading schedule on 1 October, and October had no bank holidays, unlike September. Choose the finding that says what the data shows.",
          leftLabel: "Finding A",
          left: "The new loading schedule has pushed on-time delivery to 94.63%, a significant improvement across the network.",
          rightLabel: "Finding B",
          right:
            "The Swindon depot delivered 1,940 of 2,050 parcels on time in October, about 95%, in the first month of the new loading schedule. September included a bank holiday and October did not, so this report does not attribute the October figure to the schedule.",
          correct: "right",
          why: "Finding B gives the counts, rounds the percentage sensibly, keeps to Swindon and October, and names the bank holiday as the limit a reader needs. Finding A claims cause, significance with no test, the whole network from one depot, and two decimal places.",
          wrong:
            "Look again at Finding A. It says the schedule caused the result, calls it significant with no test, extends one depot to the network, and gives two decimal places. Finding B keeps the numbers and names the limit.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "Edit this finding for the Hollins Bank customer report so that it says what the data shows. Give the numbers, keep to the branch and the months, say that the data does not show cause, and name the limit a reader needs.",
        material: {
          label: "The data",
          text: "Complaints at the Bristol branch were 14 in July and 9 in August. A new queueing system was introduced at Bristol on 1 August. No other branch changed its system. August had two fewer trading days than July.",
        },
        label: "The finding you are rewriting",
        start: "The new queueing system has cut complaints by over a third across our branches.",
        unchanged:
          "You have not changed the finding yet. Give the figures for Bristol, say the data does not show cause, and name the limit a reader needs.",
        keep: [
          {
            id: "july",
            any: ["14"],
            missing: "Give the numbers the finding rests on, starting with the 14 complaints in July.",
          },
          {
            id: "august",
            any: [" 9 ", " 9,", " 9.", "nine"],
            missing: "Give the August figure as well: 9 complaints.",
          },
          {
            id: "scope",
            any: ["bristol"],
            missing: "Only Bristol changed its system. Limit the finding to the Bristol branch.",
          },
        ],
        limitWording: false,
        limits: [
          {
            id: "cause",
            any: [
              "does not show",
              "doesn't show",
              "cannot show",
              "can't show",
              "not attribute",
              "cannot tell",
              "cannot say",
              "does not tell",
              "does not prove",
              "not enough to show",
              "cannot confirm",
            ],
            missing:
              "The data shows complaints fell after the system was introduced, not that the system caused the fall. Say plainly that the data does not show cause, for example 'this report does not attribute the fall to the new system'.",
          },
          {
            id: "limit",
            any: ["trading day", "fewer days", "two fewer", "one month", "single month", "short period", "only two months"],
            missing:
              "Add the limit that would change a reader's view, such as the two fewer trading days in August or the single month compared.",
          },
        ],
        why: "Your finding gives the numbers, keeps to Bristol and the two months, says the data does not show that the system caused the fall, and names the limit a reader needs. A regional manager could act on it without being caught out by the trading days.",
        result: {
          label: "How the finding reads in the report",
          text: "Complaints at the Bristol branch were 14 in July and 9 in August. A new queueing system was introduced at Bristol on 1 August. August had two fewer trading days than July, and one month is a short period, so this report does not attribute the fall to the new system.",
        },
      },
      bridge:
        "The next lesson brings every move in the course together on situations you have not seen, before the final lesson asks you to write the working file behind a real report.",
    },
    {
      id: "course-assessment",
      title: "Course assessment",
      emphasis: "assessment",
      place:
        "This is the sixth of seven lessons. It recaps the method from the first five lessons, works one mixed example, and then assesses the whole method on new situations, before the final lesson asks you to write your working file.",
      sections: [
        {
          heading: "Where numbers go wrong, and the rebuild test",
          paragraphs: [
            "A model answering in prose can write a number it never calculated, because it produces numbers the same way it produces words. A tool that runs code gets the arithmetic right but can still calculate on the wrong data, fill a gap such as a missing comparison period, or restate a figure in a way that changes its meaning. None of these problems is visible in the sentence the tool writes.",
            "The rebuild test asks whether you, or a colleague who was not involved, could reproduce a number from the named data using a stated method. Passing it needs four things written down: the source with its extract date or version, the selection, the calculation, and a result that matches what you rebuilt. Asking the model whether it is sure is not a rebuild, and neither is a number looking about right. A figure that fails its rebuild does not go in the report until the difference is explained and corrected.",
          ],
        },
        {
          heading: "Asking for the working",
          paragraphs: [
            "Asking for the working means writing the request so that the four parts of the rebuild note arrive with the answer. Ask the tool to calculate with code or formulas and to show them, name the columns you mean, ask how many rows were used and excluded and why, tell it to report blank values and not treat them as zero, and tell it not to compare with any period that is not in the file.",
            "A general instruction to be careful, to double-check, or to show your working in prose does none of this. The request makes the rebuild quick. It does not replace it.",
          ],
        },
        {
          heading: "Overclaims and findings",
          paragraphs: [
            "An overclaim is a sentence that says more than the data shows even when its numbers are right. The five common forms are cause from a pattern, a trend from too few points, the whole from a part, false precision, and statistical words used loosely. A sentence says what the data shows when a careful reader with the data in front of them would agree with it.",
            "A good finding gives the observation with its numbers, the scope, and the one limit that would change the reader's decision. It is not weakened by that limit, and it is not improved by a general caveat that readers skip.",
            "The assessment at the end of this lesson sets seven situations you have not seen, in finance, local government, logistics, HR, leisure, health, and print. Each question has one right answer, and each draws on one or more of the moves above. You need six of the seven to pass, and after you submit, each question shows the feedback for the option you chose.",
          ],
        },
      ],
      workedExample: {
        title: "A board paragraph, checked from end to end",
        inputLabel: "The draft paragraph and its data",
        prompt:
          "A finance business partner at Ashgrove Schools Trust asked a tool to summarise 'catering_Q2.xlsx', a ledger export of 1,480 catering transactions for April to June across four schools. The draft read: 'Catering costs in Q2 were £212,400, 6% below Q1, showing the new supplier contract is delivering savings across the trust.'",
        outputLabel: "The paragraph after checking",
        output:
          "Catering costs across the four schools were £208,950 in April to June, the sum of the Amount column for all 1,480 transactions in the Q2 ledger export of 3 July. The new supplier contract began at two of the four schools in May. This report does not compare with January to March, because that period uses a different cost code and has not yet been rebuilt on the same method.",
        reading: [
          "The total was not rebuildable as written. When she asked for the working, the tool showed it had dropped 22 credit notes it could not parse. She rebuilt the sum in the spreadsheet with every row included and got £208,950, so the figure changed.",
          "The 6% comparison filled a gap, because the file held no Q1 data. She removed it rather than fetch Q1, because Q1 was coded differently and could not be compared on the same method before the board met.",
          "The finding claimed cause from a pattern and the whole trust from two schools. The rewrite gives the rebuilt number with its source, states which schools had the new contract, and names the limit on comparison. Every move in the course appears in one paragraph.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose which version of the Ashgrove paragraph the finance business partner could send to the board. The worked example is above if you want to compare.",
        check: {
          kind: "choose",
          prompt: "Choose the version of the catering paragraph that could go to the board as it stands.",
          leftLabel: "Version A",
          left: "Catering costs across the four schools were £208,950 in April to June, rebuilt from the Q2 ledger export of 3 July. The new supplier contract began at two schools in May. This report does not compare with Q1, which uses a different cost code.",
          rightLabel: "Version B",
          right:
            "Catering costs were about £212,000 in Q2, which the tool confirmed when asked, a healthy fall on Q1 that suggests the new supplier contract is working well.",
          correct: "left",
          why: "Version A gives the rebuilt figure with its source, keeps the contract to the two schools that had it, and states why there is no comparison. Version B relies on the tool's confirmation, keeps a comparison the file cannot support, and suggests a cause.",
          wrong:
            "Look again at Version B. The tool confirming its own figure is not a rebuild, the fall on Q1 cannot be calculated from the file, and 'suggests the contract is working' claims cause from a pattern. Version A avoids all three.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each question has one right answer, and you need six of the seven to pass.",
        passMark: 6,
        questions: [
          {
            id: "comparison",
            situation:
              "Grace Mensah is a finance analyst at Oakridge Care Homes. She gave a tool the Q2 agency staffing ledger, 2,310 rows for April to June, and asked for agency spend per home. The answer included the line 'Total agency spend was £391,200, 9% lower than in Q1.' The file contains no Q1 data.",
            question: "What should Grace do with the 9% comparison?",
            options: [
              {
                id: "a",
                text: "Keep it, because the managers have said agency use fell in Q2 and 9% sounds about right.",
                feedback:
                  "A figure sounding about right is the one test that tells you least. The file has no Q1 data, so the comparison was not calculated from it. Remove it unless it can be rebuilt from the Q1 ledger on the same method.",
              },
              {
                id: "b",
                text: "Remove it, and only put a comparison back if she rebuilds it from the Q1 ledger using the same selection and calculation.",
                correct: true,
                feedback:
                  "This is the move the course teaches. The comparison filled a gap, because no Q1 data was supplied. It can return only once it has its own source and has been rebuilt on the same method as Q2.",
              },
              {
                id: "c",
                text: "Ask the tool whether it is sure about the 9%, and keep it if the tool confirms.",
                feedback:
                  "A model will often confirm a number it did not calculate, so its confirmation is not evidence. The file holds no Q1 data, so no confirmation can make the comparison rebuildable.",
              },
              {
                id: "d",
                text: "Round it to 'about 10% lower' so that it does not claim too much precision.",
                feedback:
                  "Rounding changes the precision but not the source. The comparison still came from no data at all, so a rounded version is just as unrebuildable. Remove it until Q1 has been rebuilt.",
              },
            ],
          },
          {
            id: "mismatch",
            situation:
              "Tom Birch is a performance officer at Wexford Borough Council. His draft quarterly return says the average time to process a housing benefit claim was 18.2 days, a figure the tool produced by running code. When he rebuilt it in the spreadsheet from the same export, he got 19.6 days. The return is due to the director tomorrow morning.",
            question: "What should Tom do?",
            options: [
              {
                id: "a",
                text: "Report 18.2, because the tool ran code and code does not make arithmetic mistakes.",
                feedback:
                  "The code may have added correctly and still used different rows, such as leaving out claims with a blank decision date. A figure that fails its rebuild does not go in the report until the difference is explained.",
              },
              {
                id: "b",
                text: "Report the midpoint of the two figures, 18.9 days, since the truth is probably between them.",
                feedback:
                  "A midpoint is not calculated from any selection of the data, so it is not rebuildable at all. Find out why the two figures differ and report the one that matches its written method.",
              },
              {
                id: "c",
                text: "Report 19.6 straight away, because his own spreadsheet must be right.",
                feedback:
                  "His spreadsheet may be right, but he does not yet know why the figures differ, and his own filter may be the one that is wrong. Compare the two selections first, then report the figure that matches its rebuild.",
              },
              {
                id: "d",
                text: "Compare the tool's code with his spreadsheet to find the difference in rows or method, correct whichever is wrong, and report only a figure that matches its rebuild.",
                correct: true,
                feedback:
                  "That is right. A mismatch means the selection or the calculation differs, and the rebuild note is where you find out which. The number that goes to the director is the one you can reproduce and explain.",
              },
            ],
          },
          {
            id: "request",
            situation:
              "Aisha Rahman is a planning analyst at Northgate Freight. Last month she asked a tool 'What was our on-time delivery rate in October?' and got the answer '94%'. It took her an hour of follow-up questions to discover that the tool had excluded all deliveries with no scan time. She is about to run November's figures.",
            question: "Which request should Aisha use for November?",
            options: [
              {
                id: "a",
                text: "Calculate the on-time rate as code from 'deliveries_Nov.csv' and show the code. State how many rows you used and excluded, and why. Report any deliveries with no scan time and do not treat them as on time or late. Do not compare with any month not in this file.",
                correct: true,
                feedback:
                  "That request asks for the calculation as code, the rows used and excluded, the treatment of the blank scan times that caused last month's problem, and a limit on comparisons. The answer will arrive ready to rebuild.",
              },
              {
                id: "b",
                text: "What was our on-time delivery rate in November? Please double-check your answer carefully before replying.",
                feedback:
                  "Asking the tool to double-check does not say which rows to use or what to do with missing scan times, so it can make last month's exclusion again without telling her. Ask for the code, the rows, and the treatment of blanks.",
              },
              {
                id: "c",
                text: "What was our on-time delivery rate in November? Give the answer to two decimal places so it is precise.",
                feedback:
                  "Two decimal places add precision to a figure whose selection is still hidden. The problem last month was the rows, not the rounding. Ask for the code and the rows used and excluded.",
              },
              {
                id: "d",
                text: "Explain in plain English, step by step, how you would work out our on-time rate for November, then give the figure.",
                feedback:
                  "A prose explanation is a description of the method, not the working. It may not match what the tool actually did. Ask for the code, the count of rows used and excluded, and a rule for blank scan times.",
              },
            ],
          },
          {
            id: "overclaim",
            situation:
              "Ben Clarke is an HR analyst at Stanmore Retail. Six stores volunteered to trial a new induction programme, and staff turnover fell in four of the six over the following three months. No other stores were measured over the same period. The model's draft reads: 'Stores that completed the new induction saw turnover fall, showing that the induction reduces turnover.'",
            question: "What is the main problem with the draft sentence?",
            options: [
              {
                id: "a",
                text: "There is no problem, because turnover did fall in most of the stores that took part.",
                feedback:
                  "The fall in four stores is a fair observation, but the sentence goes further and says the induction caused it. With volunteer stores and nothing to compare against, the data cannot show that.",
              },
              {
                id: "b",
                text: "It shows false precision, because the figures are given to too many decimal places.",
                feedback:
                  "The sentence contains no figures at all, so precision is not the issue. The problem is 'showing that the induction reduces turnover', which claims a cause the data cannot support.",
              },
              {
                id: "c",
                text: "It claims cause from a pattern. The stores volunteered and there were no comparison stores, so the data cannot show that the induction caused the fall.",
                correct: true,
                feedback:
                  "That is right. Stores that volunteer may differ from the rest, and turnover may have fallen elsewhere too. The finding should report the fall in four of six volunteer stores and say that the data does not show the induction caused it.",
              },
              {
                id: "d",
                text: "It uses a statistical word loosely, because 'reduces' implies a test was done.",
                feedback:
                  "'Reduces' is an ordinary word, not a statistical term like 'significant'. The real problem is that the sentence claims the induction caused the fall, when the stores volunteered and nothing was compared.",
              },
            ],
          },
          {
            id: "finding",
            situation:
              "Hannah Price is insight lead at Moorland Leisure Trust. Swimming lesson bookings at Kendal pool were 340 in September and 410 in October. Kendal cut its lesson price on 1 October, the other pools did not, and October included half-term. The trustees will use her report to decide whether to cut prices at every pool.",
            question: "Which finding should go in Hannah's report?",
            options: [
              {
                id: "a",
                text: "The price cut drove a 20.6% rise in bookings, a significant result that supports cutting prices at every pool.",
                feedback:
                  "This claims cause, uses 'significant' with no test, gives false precision, and extends one pool to all of them. The trustees would be deciding on a claim the data cannot support.",
              },
              {
                id: "b",
                text: "Bookings at Kendal pool rose from 340 in September to 410 in October, the first month at the lower price. October included half-term, so this report does not attribute the rise to the price change.",
                correct: true,
                feedback:
                  "That finding gives the numbers, keeps to Kendal and the two months, and names half-term, the one limit that would change the trustees' decision about every pool.",
              },
              {
                id: "c",
                text: "Bookings rose across the trust after the price cut at Kendal.",
                feedback:
                  "Only Kendal is in the data, so 'across the trust' generalises from a part to the whole. Keep the finding to Kendal and give the numbers.",
              },
              {
                id: "d",
                text: "Bookings at Kendal rose, although these results should be treated with caution, may not be representative, and could be affected by many factors.",
                feedback:
                  "This piles up general caveats that the trustees will skip, and it drops the numbers. Name the specific limit that matters, which is half-term, and give the figures.",
              },
            ],
          },
          {
            id: "handover",
            situation:
              "Mei Lin has taken over the monthly community nursing report at Riverside Health from a colleague who has moved to another team. His working file gives the source and a rebuild note for numbers one to three. Number four, 'staff cost per visit: £38', has no selection, no calculation, and no note of a rebuild.",
            question: "What should Mei do about number four in this month's report?",
            options: [
              {
                id: "a",
                text: "Work out a method from the source data, write its selection and calculation into the working file, rebuild the figure, and report it only once it matches.",
                correct: true,
                feedback:
                  "That is right. A number without a selection and a calculation cannot be reproduced, so Mei makes it reproducible before reporting it. She should also say in the report if the method may differ from last month's.",
              },
              {
                id: "b",
                text: "Ask the tool to produce a staff cost per visit from this month's data and use its figure.",
                feedback:
                  "The tool's figure would have no written method either, and it may use a different definition from last month's £38. Write the selection and calculation down, rebuild it, and then report it.",
              },
              {
                id: "c",
                text: "Report £38 again, since nothing suggests the cost has changed.",
                feedback:
                  "Repeating last month's number reports a figure nobody has calculated for this month. Work out the method, write it down, and rebuild it from this month's data.",
              },
            ],
          },
          {
            id: "ai-use",
            situation:
              "Laura Fielding is operations manager at Kestrel Print. She is finishing the working file behind her quarterly waste report. The tool ran three averages as code and drafted two findings, and she rebuilt the averages in a spreadsheet and rewrote one finding. She now has to write the AI use line.",
            question: "Which AI use line should Laura write?",
            options: [
              {
                id: "a",
                text: "Used AI.",
                feedback:
                  "This tells a reader nothing about what the tool did or what Laura checked. Say what the tool produced and what she rebuilt or rewrote herself.",
              },
              {
                id: "b",
                text: "AI helped with the analysis, and all figures are accurate.",
                feedback:
                  "'All figures are accurate' is a claim, not a record. The line should say what the tool did and what Laura checked, so a reader can see where responsibility sits.",
              },
              {
                id: "c",
                text: "The tool wrote the report, and I read it through before sending.",
                feedback:
                  "Reading a report through is not a rebuild, and the line does not say what the tool calculated. Say that it ran the averages and drafted findings, and that she rebuilt the averages and rewrote a finding.",
              },
              {
                id: "d",
                text: "The tool ran the three averages as code and drafted two findings. I rebuilt all three averages in the spreadsheet, and they matched, and I rewrote the second finding to remove 'significant'.",
                correct: true,
                feedback:
                  "That is right. The line says exactly what the tool did and what Laura checked or changed herself, so a reader knows which parts of the report she has taken responsibility for.",
              },
            ],
          },
        ],
        why: "You applied the whole method to situations you had not seen: removing a comparison with no data behind it, resolving a failed rebuild, asking for the working, spotting a claim of cause, choosing the finding with the right limit, making a handed-over number reproducible, and recording how the tool was used.",
      },
      bridge:
        "In the final lesson you will write the working file behind one real report of your own, and that file becomes the work on your record.",
    },
    {
      id: "a-working-file",
      title: "A working file",
      emphasis: "file",
      place:
        "This is the last of seven lessons. You produce the working file for one real report, and that file is the artefact that appears on your record.",
      sections: [
        {
          heading: "What a working file is",
          paragraphs: [
            "A working file is the record that sits behind a report and lets someone else reproduce it. It names the source data and its extract date, lists every number that appears in the report with its selection, calculation, and rebuild, lists the findings with any limit you added, and records what the AI tool was used for and what you checked yourself.",
            "A working file is not the report itself, and it is not a technical document written only for data specialists. It can be a single page, or a tab in the spreadsheet the report was built from, as long as every reported number can be traced from it. Most of it is made of the rebuild notes you have been writing since the second lesson, gathered in one place.",
          ],
        },
        {
          heading: "Three readers",
          paragraphs: [
            "Write the working file for three readers. The first is a colleague who has to produce next month's version while you are on leave. They need the source, the selection, and the calculation for every number, in enough detail to run them without asking you what you meant.",
            "The second is a manager who has been asked, in a meeting, where a figure came from. They need to find the number quickly and read its method in one line. The third is you, in six months, when the figure is questioned and you no longer remember which rows you excluded or why.",
          ],
        },
        {
          heading: "The five parts, and two labels for reading them",
          paragraphs: [
            "The file has five parts. The report line gives the report's title, its audience, and its date. The source data line names each file or system, its version or extract date, and its size. The numbers part lists every number in the report, numbered, each with its selection, its calculation, and whether you rebuilt it and it matched. The findings part gives each written finding with any limit the reader needs. The AI use line says what the tool did and what you checked or changed yourself.",
            "When you read a line of a working file, including your own, ask whether a colleague could follow it without you. A line where A colleague could trace this names the file, the rows, the formula, or the specific check, so the reader can repeat it. A line where A colleague would have to ask leaves out the one thing they would need, such as an extract date, a filter, or what was actually checked.",
          ],
        },
        {
          heading: "Confidential figures, and how the file is checked",
          paragraphs: [
            "Some reports contain figures you cannot show outside your organisation. You can still write the working file in full for your own use, and on your record you may replace a value with the words 'withheld by the learner'. The method, the selection, the calculation, and the findings are what a verifier needs to see, and they are rarely confidential in themselves.",
            "When you continue, each part is checked for substance. The report line needs a date or another concrete detail. The source data needs an extract date or version. The numbers need at least one calculation, such as a sum, a count, an average, or a formula. The findings need a limit, or a plain statement of what the data does not show or who is excluded. The AI use line needs to say what you rebuilt or checked yourself. Write at least two numbered figures, because a report with one number does not exercise the method.",
          ],
        },
      ],
      workedExample: {
        title: "The working file behind a support report",
        inputLabel: "The report",
        prompt:
          "The Pennant Home Services analyst's monthly support performance report for the operations board. It reports the number of tickets received, the number resolved, the average resolution time, and a comparison with August.",
        outputLabel: "The working file",
        output:
          "Report: September support performance, for the operations board, 8 October.\nSource data: 'Sept_tickets.xlsx', ticket system export, 1 October 09:00, 1,200 rows. 'Aug_tickets.xlsx', export of 1 September 09:00, 1,115 rows.\nNumbers: (1) 1,200 tickets received, count of all rows. (2) 1,060 resolved, count where status is Resolved. (3) Average resolution 6.4 hours, AVERAGE of column F for resolved rows, 140 open excluded. (4) August comparison 7.1 hours, same selection and calculation on the August file. All four rebuilt in the spreadsheet and matched.\nFindings: Average resolution time for resolved tickets was 6.4 hours in September, against 7.1 in August, on the same method. 140 September tickets were still open at extraction and are not included.\nAI use: the tool ran the averages as code and drafted the findings. I rebuilt every number in the spreadsheet and rewrote the finding to remove 'significant improvement'.",
        reading: [
          "Every number in the report can be traced to a file, a selection, and a calculation, and each one has been rebuilt. A colleague could produce October's report from this file without a conversation.",
          "The finding says what the data shows and names the limit that matters, which is the open tickets left out of the average. The August comparison is there because it was rebuilt from August's own export on the same method.",
          "The AI use line is specific. It tells a reader which parts the tool produced and which parts the analyst checked and changed, so it is clear what she has taken responsibility for.",
        ],
      },
      practice: {
        intro:
          "Here are four lines from a draft working file for a housing repairs report. Mark each one with the labels from the section above. You will use the same test on your own file in a moment.",
        check: {
          kind: "mark",
          prompt: "Mark each line as A colleague could trace this or as A colleague would have to ask.",
          passLabel: "A colleague could trace this",
          failLabel: "A colleague would have to ask",
          sentences: [
            {
              id: "source",
              text: "Source data: the repairs spreadsheet.",
              fail: true,
              why: "There is no file name, extract date, or size, so a colleague would not know which version of the spreadsheet to use.",
            },
            {
              id: "number",
              text: "Number 2: 412 urgent repairs completed, count of rows where Priority is Urgent and Status is Complete in 'repairs_Oct.xlsx', rebuilt in the spreadsheet and matched.",
              fail: false,
              why: "It gives the selection, the calculation, the file, and a rebuild that matched, so a colleague could reproduce it.",
            },
            {
              id: "finding",
              text: "Finding: urgent repairs in October took a median of 3 days to complete, for the 412 completed jobs. The 37 jobs still open at extraction are not included.",
              fail: false,
              why: "It gives the figure, the scope, and the limit a reader needs, so it can be traced and trusted.",
            },
            {
              id: "ai",
              text: "AI use: AI was used to help.",
              fail: true,
              why: "It does not say what the tool did or what was checked by hand, so a colleague would have to ask which numbers were rebuilt.",
            },
          ],
          why: "That is right. The numbered figure and the finding can be traced, but the source line names no file or date, and the AI use line says nothing about what was checked.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the working file for one real report you produce. Fill in all five parts so that a colleague could reproduce every number from what you write.",
        fields: [
          {
            id: "report",
            label: "Report",
            hint: "The report's title, its audience, and its date.",
            min: 20,
            rule: "fact",
            missing:
              "The report line does not yet give a concrete detail. Add the report's title, who it is for, and the date it is issued.",
          },
          {
            id: "source",
            label: "Source data",
            hint: "Each file or system, its version or extract date, and its size.",
            min: 24,
            rule: "fact",
            any: ["extract", "export", "version", "as at", "downloaded", "snapshot", "dated", "pulled"],
            missing:
              "Add the extract date or version of each source, and say what it is, so a colleague uses the same data you did.",
          },
          {
            id: "numbers",
            label: "Numbers",
            hint: "Every number in the report, numbered, with its selection, calculation, and whether you rebuilt it and it matched.",
            min: 60,
            rule: "fact",
            any: ["sum", "count", "average", "mean", "median", "total", "formula", "divided", "code", "percentage"],
            missing:
              "The numbers do not yet show how each was calculated. For each numbered figure, give the rows selected and the calculation, such as a count, a sum, an average, or the formula.",
          },
          {
            id: "findings",
            label: "Findings",
            hint: "Each written finding, with any limit the reader needs.",
            min: 40,
            any: ["not ", "only", "exclud", "limit", "cannot"],
            missing:
              "The findings do not yet state a limit. Add the one thing the data does not show, or who or what is not included, where it matters to the reader's decision.",
          },
          {
            id: "ai-use",
            label: "AI use",
            hint: "What the tool did, and what you checked or changed yourself.",
            min: 30,
            any: ["rebuilt", "rebuild", "checked", "recalculated", "rewrote", "rewritten", "verified", "matched"],
            missing:
              "Say what the tool did and what you checked or changed yourself, for example which numbers you rebuilt and which findings you rewrote.",
          },
        ],
        why: "Your working file names the data and its extract, gives every number a calculation, states findings with the limit a reader needs, and records what the tool did and what you checked yourself. This is the file that will appear on your record.",
      },
      bridge:
        "Your working file is ready. Sign your name below, and the record will show this file, the course, and the date to anyone who opens the reference.",
    },
  ],
};
