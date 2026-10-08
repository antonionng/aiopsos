/*
Course: Robotics Investment Decisions
Slug: robotics-investment-decisions
For: Finance directors and business partners, operations directors, members of investment
  committees, and owners of small and medium-sized manufacturers who approve or challenge capital
  requests for robots and automation. They understand payback and discounting and know their own
  approval process. They do not need engineering knowledge.
Outcome: The learner can read a capital request for robotics, judge whether it starts from the
  measured process, whether its payback counts the cost of owning the system and a realistic
  ramp-up, whether its claims about people rest on a plan, and whether it sets a ninety-day review,
  and can write a review that records the answers or says which are not yet answered.
Artefact: The five-question review of one capital request.
Record sentence: Wrote and signed a five-question review of one capital request for automation,
  which records the challenge put to the request and is not financial advice or an approval of any
  investment.
Lessons (id, title, move, interaction, pass rule):
  1. start-with-the-process, Start with the process, tell a measured process fact from a brand or
     a hope, practice mark and check choose, pass when every sentence is marked correctly and when
     the request with a measured baseline is chosen.
  2. payback-honestly, Payback, honestly, find the optimistic inputs in a payback case, practice
     mark and check choose, pass when every line is marked correctly and when the case with the
     full cost of ownership and a ramp-up is chosen.
  3. people-in-the-case, People in the case, separate claims about people that rest on a plan from
     claims that do not, practice mark and check mark, pass when every sentence is marked correctly.
  4. five-questions, Five questions, turn questions about the brand into questions about the
     process, practice edit and check choose, pass when the edit asks about the baseline, the
     exceptions, the cost to own, the people, and the ninety-day measures, and when the question
     aimed at the process is chosen.
  5. ninety-days-on, Ninety days on, write a post-investment review that can be carried out,
     practice choose and check edit, pass when the stronger plan is chosen and when the edited plan
     names a date, an owner, a baseline, a source, and a look at the people or the exceptions.
  6. judging-a-whole-request, Judging a whole request, course assessment across every earlier
     lesson, practice scenario of two questions and check scenario of eight questions, pass at six
     of eight.
  7. the-five-question-review, The five-question review, write the artefact, practice mark and
     check build, pass when each field carries its course-specific substance.
Sources: HM Treasury, The Green Book; Brealey, Myers, and Allen, Principles of Corporate Finance;
  ACAS guidance on consultation; the Made Smarter programme's public guidance; CIMA, Official
  Terminology. No figures are taken from these sources. Every figure in the course belongs to an
  invented example.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const MEASURED = "Measured process fact";
const HOPE = "Brand, hope, or adjective";
const HONEST = "Honest input";
const OPTIMISTIC = "Optimistic input";
const SUPPORTED = "Supported by a plan";
const CLAIMED = "Claimed without a plan";
const READY = "Ready for the committee";
const ANOTHER_PASS = "Needs another pass";

export const COURSE: CourseContent = {
  slug: "robotics-investment-decisions",
  hours: 2,
  artefact: {
    lessonId: "the-five-question-review",
    title: "The five-question review",
    recordLine:
      "Wrote and signed a five-question review of one capital request for automation, which records the challenge put to the request and is not financial advice or an approval of any investment.",
  },
  lessons: [
    {
      id: "start-with-the-process",
      title: "Start with the process",
      emphasis: "process",
      place:
        "This is the first of seven lessons and the whole of the first module. It sets the test that every later lesson builds on: before you judge the money, you need to see the process the money will change.",
      sections: [
        {
          heading: "The process comes before the equipment",
          paragraphs: [
            "A capital request for robotics should begin with the process it will change, not with the equipment it proposes to buy. The process is the work as it runs today on a named line, cell, or area: what is made or moved, how many people do it on which shifts, how much comes out, how much is lost to rework or scrap, and how often it stops. A request that starts there lets you see the problem before you are asked to pay for the answer.",
            "A request that starts with the equipment asks you to approve a solution first and to take the problem on trust. It will usually name a manufacturer, a model, or a feature, and it will often quote the supplier's own description of what the machine can do. None of that tells you whether your line needs it, or how you would know afterwards that it worked.",
            "This matters at work because the committee's job is to compare what it is being asked to spend with what the business will get back. That comparison needs a starting point on your own shop floor. The supplier's brochure describes a machine in general, whereas the request has to describe your process in particular.",
          ],
        },
        {
          heading: "What a baseline is",
          paragraphs: [
            "The baseline is the measured performance of the process today, and it is what the investment will be judged against later. Each figure in a baseline has three parts: the measure, such as frames per shift or cases per minute; the period it covers, such as the last six months or the last quarter; and the source it came from, such as the production system, the quality records, payroll, or the line reports.",
            "A figure without a period cannot be compared with anything, because you do not know whether it was a good month or a bad one. A figure without a source cannot be checked, and it may be a supervisor's impression rather than a record. When the request gives all three parts, you and anyone reviewing the investment later can go back to the same place and measure again.",
          ],
          beforeAfter: {
            before: "The line is slow and labour-intensive, and we struggle to meet demand.",
            after:
              "Over the last six months, from the production system, line 2 produced an average of 38 frames per shift with three welders on each of two shifts, and overtime was booked in most weeks to meet orders.",
            reading:
              "The first sentence uses adjectives that nobody can measure again in ninety days. The second gives a measure, a period, and a source, so it can be checked now and compared later.",
          },
        },
        {
          heading: "What starting with the process is not",
          paragraphs: [
            "Starting with the process is not a formality to be completed before the real case begins. It is the part of the case that makes every later figure mean something. The saving in the payback, the claim about people, and the review at ninety days all depend on knowing what happens today.",
            "It is also not a demand for a consultant's study. A baseline for a capital request can be three or four figures taken from records the site already keeps. What matters is that each figure is measured rather than estimated, that its source and period are stated, and that it describes the part of the process the investment is aimed at.",
          ],
        },
        {
          heading: "Two labels for each sentence",
          paragraphs: [
            "In this lesson you will read the opening of a request one sentence at a time and give each sentence one of two labels. A sentence is a Measured process fact when it states something about the process today that was measured, and says or clearly implies where the figure came from and over what period. The number of packers per shift, the output from the line reports last quarter, and the rework rate from quality records are all measured process facts.",
            "A sentence is Brand, hope, or adjective when it describes the supplier or the equipment, predicts what the equipment will do, or describes the process only in words such as slow, inefficient, outdated, or labour-intensive. These sentences may be true, and some of them belong in a request, but they are not evidence about your process and they cannot form a baseline.",
            "The mistake people usually make is to accept a request that contains a great many numbers as if it were a measured request. Look at what the numbers describe. A robot's cycle time, reach, and payload are numbers about the machine, and they belong under Brand, hope, or adjective until the request shows how they compare with the measured process.",
          ],
        },
      ],
      workedExample: {
        title: "Two openings for the same welding request",
        inputLabel: "The opening as first submitted",
        outputLabel: "The opening after the finance business partner sent it back",
        prompt:
          "We request approval to purchase a robot welding cell from a leading manufacturer, which is the market leader in robotic welding and will bring our factory up to date.",
        output:
          "Frame welding on line 2 is done manually by three welders per shift on two shifts. Over the last six months, measured from the production system, the line has produced an average of 38 frames per shift, with rework on about one frame in ten, recorded by quality. Overtime on line 2 has been needed in most weeks to meet demand. This request is to automate the welding of the two highest-volume frame types.",
        reading: [
          "The figures belong to this example and are illustrative. The first opening tells you about a brand and a hope, and every phrase in it would fit any factory in the country. It gives the committee nothing to measure against.",
          "The second opening describes the process today. It gives the number of welders and shifts, an output figure with its source and period, a rework rate with its source, and the overtime pattern. Each of those is a measured process fact that can be checked now and measured again after go-live.",
          "The last sentence of the second opening matters as much as the figures. It says which part of the process the money is aimed at, the two highest-volume frame types, so the committee knows that the rest of the frames will still be welded by hand.",
        ],
      },
      practice: {
        intro:
          "Here are four sentences from the opening of a request at Calder Precision to automate loading on two CNC lathes. Mark each one with the two labels you have just read. The section above defines both labels if you want to check.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence as a Measured process fact or as Brand, hope, or adjective.",
          passLabel: MEASURED,
          failLabel: HOPE,
          sentences: [
            {
              id: "operators",
              text: "Lathes 6 and 7 are each loaded by one operator on each of three shifts.",
              fail: false,
              why: "It states how the process is staffed today, which is a measured process fact the site can check against the rota.",
            },
            {
              id: "idle",
              text: "Over the last quarter, from the machine monitoring system, the two lathes were idle waiting for loading for an average of 11 per cent of scheduled time.",
              fail: false,
              why: "It gives a measure, a period, and a source, so it is a measured process fact.",
            },
            {
              id: "flexible",
              text: "The proposed robot is the most flexible machine-tending unit on the market.",
              fail: true,
              why: "It describes the equipment and repeats the supplier's claim, so it is brand, hope, or adjective.",
            },
            {
              id: "outdated",
              text: "Manual loading is outdated and holds the cell back.",
              fail: true,
              why: "Outdated is an adjective and the sentence gives no measure, so it is brand, hope, or adjective.",
            },
          ],
          why: "That is right. The staffing and the idle time are measured process facts, and the claims about the robot and the word outdated tell you nothing you could measure again after go-live.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two capital requests have been submitted for automating packing at Pennine Foods, a food manufacturer. Choose the request that starts with the process.",
        leftLabel: "Request A",
        left: "We propose to invest in a state-of-the-art robotic packing system from a well-known supplier, which will transform our packing hall and make us more competitive.",
        rightLabel: "Request B",
        right:
          "Packing of 500 gram bags into cases on lines 4 and 5 uses four packers per line per shift. Over the last quarter, from the line reports, output averaged 22 cases per minute per line, with packing the constraint on both lines during the pre-Christmas peak. This request is to automate case packing on lines 4 and 5.",
        correct: "right",
        why: "Yes. Request B describes the process today, with the staffing, a measured output, its source, and its period, and it says which part of the process the investment is aimed at. That is the baseline the committee will judge the investment against.",
        wrong:
          "Request A describes the supplier and the hopes for the equipment. State-of-the-art, well-known, and transform are brand, hope, or adjective, and there is no measured baseline for the packing lines. Choose the request that starts with the process.",
      },
      bridge:
        "With the process and its baseline in view, the next lesson tests the payback case that the request builds on top of it.",
    },
    {
      id: "payback-honestly",
      title: "Payback, honestly",
      emphasis: "Payback",
      place:
        "This is the first half of the second module. You have seen how a request should describe the process, and this lesson tests the numbers the request builds on that description.",
      sections: [
        {
          heading: "What payback measures",
          paragraphs: [
            "Simple payback is the cost of the investment divided by the net benefit it produces each year. It tells you how many years it takes for the investment to earn its cost back. It is quick to calculate and easy to explain, which is why most capital requests quote it, and CIMA's Official Terminology gives the standard definition if your organisation needs one.",
            "Many organisations also use discounted measures such as net present value, which allow for the fact that money received in later years is worth less than money spent today. Textbooks such as Brealey, Myers, and Allen's Principles of Corporate Finance explain these measures and their limits, and HM Treasury's Green Book is a public example of a thorough appraisal method.",
            "Whatever method your organisation uses, the case is only as honest as its inputs. This lesson does not teach a new method. It teaches you to read the inputs to whatever method is in front of you, because that is where most robotics cases go wrong.",
          ],
        },
        {
          heading: "The cost of owning a cell",
          paragraphs: [
            "The cost of a robot cell is much more than the robot. A cell usually needs integration and programming, fixtures and grippers made for your parts, guarding and safety systems, changes to the floor or the flow of material around it, the risk assessment and the conformity work, and training for the people who will run and maintain it. It then needs spares, software licences, maintenance, and support for as long as it runs.",
            "There is also the output you lose while the cell is installed and commissioned. The line may be down for days or weeks, or it may run slowly while the cell is proved. That lost output is a real cost, and a case that leaves it out makes the first year look better than it will be. The cost to own is the whole of this list, and the list price of the robot is only one line on it.",
          ],
          beforeAfter: {
            before: "Cost: robot £120,000.",
            after:
              "Cost: robot and positioner £120,000; integration, programming, and fixtures £90,000; guarding and safety systems £30,000; training £8,000; lost output during commissioning £15,000; spares £10,000. Running cost: maintenance and support £12,000 a year.",
            reading:
              "The figures are illustrative. The first line is the price of the machine. The second is the cost of owning the cell, and it is more than twice as large before a single running cost is counted.",
          },
        },
        {
          heading: "The benefit, measured and ramped",
          paragraphs: [
            "The benefit must be measured against the baseline from the first lesson. If the request says overtime will fall, the baseline should say how much overtime there is today and where that figure came from. A benefit that has no baseline behind it cannot be checked now, and it cannot be measured later.",
            "The benefit also rarely arrives in full on the first day. The ramp-up is the period after go-live during which the cell runs below its planned output while people learn it, programs are refined, and early faults are fixed. A realistic case says how long the ramp-up is expected to take and what share of the benefit it assumes during that time.",
          ],
          beforeAfter: {
            before: "Benefit: full labour saving from go-live.",
            after:
              "Benefit: measured against the six-month overtime and rework baseline; half the planned benefit in the first six months while the cell ramps up; full benefit from month seven.",
            reading:
              "The first version assumes the cell works perfectly from the first shift. The second ties the benefit to a baseline and allows for a ramp-up, which lengthens the payback and makes it believable.",
          },
        },
        {
          heading: "Right arithmetic on the wrong numbers",
          paragraphs: [
            "A payback case that uses the list price of the robot and the full benefit from the first day is not wrong arithmetic. The division is usually correct. It is the right arithmetic on the wrong numbers, and it produces a payback period that the cell will not achieve.",
            "In this lesson you will mark each line of a payback case with one of two labels. A line is an Honest input when it counts a cost of owning the system, or when it states a benefit measured against a baseline with a realistic ramp-up. A line is an Optimistic input when it counts only the purchase price, assumes the full benefit from the first day, counts a saving with no baseline, or leaves out a cost the cell will certainly incur.",
            "The mistake people usually make is to challenge the payback period itself, asking whether fourteen months is too short, rather than reading the lines that produced it. A committee member who asks what the cost includes and when the benefit starts will learn more in two minutes than one who argues about the answer.",
          ],
        },
      ],
      workedExample: {
        title: "Two payback cases for the same welding cell",
        inputLabel: "The case as first submitted",
        outputLabel: "The case after it was rebuilt",
        prompt: "Robot cost £120,000. Saves two welders per shift on two shifts. Payback under two years.",
        output:
          "Cost: robot and positioner £120,000; integration, programming, and fixtures £90,000; guarding and safety systems £30,000; training £8,000; lost output during commissioning £15,000; spares £10,000. Running cost: maintenance and support £12,000 a year. Benefit: measured against the six-month baseline; reduced overtime and rework in the first six months while the cell ramps up; redeployment of two welders per shift to lines 3 and 4, where vacancies are open, from month six. Payback: about three and a half years on these assumptions.",
        reading: [
          "Every figure here belongs to the example. The first case counted the robot and a benefit that assumes four people leave on the first day. Both are optimistic inputs, and together they halve the payback period.",
          "The rebuilt case counts the costs of owning the cell, including the output lost during commissioning and the running cost each year. Each of those lines is an honest input.",
          "The rebuilt case also ties the benefit to the baseline, allows six months of ramp-up, and says what happens to the welders. It may still be a good investment. The difference is that the committee can now defend it, and can check it at ninety days.",
        ],
      },
      practice: {
        intro:
          "Here are four lines from a payback case at Ashby Distribution for three mobile robots to carry totes between picking and packing. Mark each line with the two labels from the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each line of the payback case as an Honest input or as an Optimistic input.",
          passLabel: HONEST,
          failLabel: OPTIMISTIC,
          sentences: [
            {
              id: "fleet",
              text: "Cost: three mobile robots at the supplier's list price of £38,000 each, and nothing else.",
              fail: true,
              why: "It counts only the purchase price and leaves out integration with the warehouse system, chargers, floor changes, training, and support, so it is an optimistic input.",
            },
            {
              id: "wms",
              text: "Integration with the warehouse management system and the charging stations: £46,000, from the integrator's quotation dated 3 March.",
              fail: false,
              why: "It counts a cost of owning the fleet and gives its source, so it is an honest input.",
            },
            {
              id: "dayone",
              text: "Benefit: all trolley runs removed from the first week of operation.",
              fail: true,
              why: "It assumes the full benefit from the first week with no ramp-up, so it is an optimistic input.",
            },
            {
              id: "support",
              text: "Running cost: software licence and support contract, £9,500 a year, from the same quotation.",
              fail: false,
              why: "It counts a running cost the fleet will incur every year, with its source, so it is an honest input.",
            },
          ],
          why: "That is right. The integration and the support contract are honest inputs, and the list-price-only cost and the benefit from the first week are optimistic inputs that would shorten the payback on paper.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two payback cases have been prepared for a robotic palletiser at Tern Valley Drinks. Choose the case you could defend to the board.",
        leftLabel: "Case A",
        left: "Palletiser £85,000. Replaces two packers per shift. Payback 14 months.",
        rightLabel: "Case B",
        right:
          "Palletiser £85,000; conveyor changes and guarding £40,000; integration £25,000; training and commissioning downtime £12,000; annual service contract £6,000. Benefit from the measured labour and overtime baseline, at half rate for the first three months. The two packers per shift move to the new line opening in spring. Payback about two and a half years.",
        correct: "right",
        why: "Yes. Case B counts the cost of owning the palletiser, allows for a ramp-up, measures the benefit against a baseline, and says what happens to the packers. Its payback is longer, and it is the one the board can rely on.",
        wrong:
          "Case A counts only the machine and assumes the full benefit from the first day. It leaves out the conveyor changes, guarding, integration, training, downtime, and the service contract, which are all optimistic inputs by omission. Choose the case that counts the cost of owning it.",
      },
      bridge:
        "Case B also said what happens to the packers, and the next lesson looks closely at claims about people, which are the part of a case most often assumed.",
    },
    {
      id: "people-in-the-case",
      title: "People in the case",
      emphasis: "People",
      place:
        "This is the second half of the second module. You have tested the costs and the benefit, and this lesson tests the part of the benefit that usually rests on a claim about people.",
      sections: [
        {
          heading: "Most cases rest on a claim about people",
          paragraphs: [
            "Many robotics cases rest on a claim about people. The claim may be that roles will be saved, that people will be redeployed to other work, that overtime will fall, or that agency labour will no longer be needed. Often that claim carries most of the benefit in the payback, so if it does not happen, the case does not pay back.",
            "Claims about people are easy to write and hard to deliver. A single line such as 'saves four heads' can turn a marginal case into an attractive one, and it can pass through a committee because nobody wants to ask what will happen to four named colleagues. Asking that question is part of reading the case properly.",
          ],
        },
        {
          heading: "Supported by a plan, or claimed without a plan",
          paragraphs: [
            "In this lesson you will mark each claim about people with one of two labels. A claim is Supported by a plan when the case says who is affected, what will happen to them, when it will happen, and who is responsible, and when any change to jobs or terms has been discussed with HR. A claim about agency hours or overtime is supported by a plan when it is measured against a baseline and the case says why the hours will fall.",
            "A claim is Claimed without a plan when it counts a saving without saying how it will happen. 'Saves four heads' with no mention of what those four people will do is claimed without a plan. So is 'people will be redeployed' when the case does not say to what or when, and so is 'overtime will be eliminated' when no overtime baseline is given.",
            "The test is not whether the claim sounds reasonable. Most claims about people sound reasonable. The test is whether the case contains enough detail for someone else to check, at ninety days, whether the claim came true.",
          ],
          beforeAfter: {
            before: "Pickers will be redeployed.",
            after:
              "The four pickers on the night shift will move to the returns area in October, where two posts are vacant and two will be created by the new returns contract. The warehouse manager is responsible, and HR has met the four pickers.",
            reading:
              "The first sentence is claimed without a plan, because it names nobody, no destination, and no date. The second says who, where, when, who is responsible, and that HR is involved.",
          },
        },
        {
          heading: "The new work automation creates",
          paragraphs: [
            "Automation removes some work and creates other work. A cell has to be loaded, recovered after a stop, cleaned, maintained, and reprogrammed when a product changes. A case that counts the work removed and ignores the work created is overstating its benefit, even when every other figure is honest.",
            "Look for the technician who will maintain the cell, the operator who will recover it after a fault, and the hours of the engineer who will change its programs. Each of these is a claim about people too. It is supported by a plan when the case names who will do the work, how they will be trained, and how many hours it will take.",
          ],
        },
        {
          heading: "Consultation and HR",
          paragraphs: [
            "Where a change could affect jobs, there may be legal duties to inform and consult the people affected or their representatives, and ACAS publishes guidance on consultation that HR teams commonly use. This course does not give legal advice, and your organisation's HR team and advisers decide what is required in each case.",
            "What the committee can check is whether HR has been involved before the case is approved. A case that counts a reduction in roles and has not been seen by HR is asking the committee to approve something that may not be possible on the timetable assumed, and the payback may depend on it.",
          ],
        },
        {
          heading: "What this lesson is not about",
          paragraphs: [
            "This lesson is not about whether automation should reduce jobs. Some cases will reduce roles, some will move people to other work, and some will let a site grow without recruiting. Each of those can be a sound decision.",
            "The lesson is about whether the case is honest about what it assumes. The mistake people usually make is to treat a claim about people as settled because it appears in a spreadsheet cell. A saving that has no plan behind it should be removed from the payback until the plan exists, or the case should say plainly that the benefit depends on a decision that has not yet been made.",
          ],
        },
      ],
      workedExample: {
        title: "Claims about people in a warehouse case",
        inputLabel: "The sentences from the case",
        outputLabel: "The sentences, marked",
        prompt:
          "The robots will save eight picker roles. Pickers will be redeployed. Agency usage will fall by the equivalent of four full-time staff from month three, based on current agency hours in the labour report, as the robots take over trolley runs. Engineering will need one additional technician, recruited before go-live.",
        output:
          "'The robots will save eight picker roles' is claimed without a plan. 'Pickers will be redeployed' is claimed without a plan, because it does not say to what or when. 'Agency usage will fall by the equivalent of four full-time staff from month three, based on current agency hours in the labour report' is supported by a plan. 'Engineering will need one additional technician, recruited before go-live' is supported by a plan.",
        reading: [
          "The saving in agency hours is specific and measurable. It has a baseline in the labour report, a start date, and a reason, so someone can check it at ninety days.",
          "The eight roles and the redeployment are assertions. The case would be stronger and more honest if it said where those eight people will go and when, or removed the saving from the payback until that is known.",
          "The technician is new work the robots create, and the case counts it. That line makes the benefit smaller, and it is one of the most reassuring lines in the case, because it shows the author thought about what the robots will need.",
        ],
      },
      practice: {
        intro:
          "Here are three sentences from a case at Whitmore Bakery for a robotic tray loader. Mark each one with the two labels from the section above, which is still on the page.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence as Supported by a plan or as Claimed without a plan.",
          passLabel: SUPPORTED,
          failLabel: CLAIMED,
          sentences: [
            {
              id: "heads",
              text: "The loader removes the need for two heads per shift.",
              fail: true,
              why: "It counts two roles per shift but says nothing about who they are, what will happen to them, or when, so it is claimed without a plan.",
            },
            {
              id: "agency",
              text: "Agency hours on the tray line, 310 hours a month on average over the last six months from the agency invoices, will stop from the end of the second month after go-live.",
              fail: false,
              why: "It gives a baseline, its source, and a date, so it can be checked later and is supported by a plan.",
            },
            {
              id: "hygiene",
              text: "The hygiene team will clean the loader at each changeover, adding about 20 minutes per changeover, and their supervisor has agreed the change to the cleaning schedule.",
              fail: false,
              why: "It counts the new work the loader creates, says who will do it and how long it takes, and names who agreed it, so it is supported by a plan.",
            },
          ],
          why: "That is right. The agency hours and the cleaning work are supported by a plan, and the two heads per shift are a saving counted without saying what will happen to anyone.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Here are sentences from a capital request at Harrow Engineering for a robotic machine-tending cell. Mark each as Supported by a plan or Claimed without a plan.",
        passLabel: SUPPORTED,
        failLabel: CLAIMED,
        sentences: [
          {
            id: "three",
            text: "The cell saves three operator roles.",
            fail: true,
            why: "It counts three roles but does not say who they are, what will happen to them, or when. That is claimed without a plan.",
          },
          {
            id: "nightshift",
            text: "The two night-shift machine operators will move to the new grinding cell in September, which has two vacancies, and HR has discussed the move with them.",
            fail: false,
            why: "It names who, where they go, when, and that HR has discussed it. That is supported by a plan.",
          },
          {
            id: "overtime",
            text: "Overtime will be eliminated.",
            fail: true,
            why: "No baseline for overtime is given and no reason is described for why it would end. That is claimed without a plan.",
          },
          {
            id: "setter",
            text: "One setter will be trained to maintain the cell, with the supplier's course booked for May, adding four hours of work to their week.",
            fail: false,
            why: "It names the new work, who will do it, the training, and when. That is supported by a plan.",
          },
        ],
        why: "You separated the claims about people that have a plan behind them from the ones that only count a saving. The move of the night-shift operators and the setter's new work can be checked at ninety days, and the three roles and the end of overtime cannot.",
      },
      bridge:
        "The first three lessons each tested one part of a case. The next lesson turns them into five questions you can take into any investment meeting.",
    },
    {
      id: "five-questions",
      title: "Five questions",
      emphasis: "questions",
      place:
        "This is the third module. You have learned to test the process, the payback, and the people separately, and this lesson gives you the five questions that bring those tests into the meeting.",
      sections: [
        {
          heading: "Five questions aimed at the process",
          paragraphs: [
            "The five questions are aimed at the process rather than the brand. The first asks what the process is today, measured, and where the figures came from. The second asks which tasks the robot will take and which, including the exceptions, will stay with people. The third asks what the system costs to own as well as to buy, and how long the ramp-up will be.",
            "The fourth asks what happens to the people whose work changes, and who is responsible for that. The fifth asks how the business will know, ninety days after go-live, whether the investment worked. The first, third, and fourth come from the lessons you have finished. The second and fifth are new, and the next lesson is given over to the fifth.",
            "The second question deserves a word here. An exception is any item, order, or situation the robot will not handle, such as a mixed pallet, an odd-sized carton, a damaged part, or a product made twice a year. Exceptions stay with people, and a case that does not say how many there are, or who handles them, may be counting a labour saving that will not arrive.",
          ],
        },
        {
          heading: "Aimed at the brand, or aimed at the process",
          paragraphs: [
            "A question is aimed at the brand when its subject is the supplier, the manufacturer, or the machine in general. 'Is this the best supplier?', 'Is this robot reliable?', and 'Have other companies had success with it?' are all aimed at the brand. They invite a sales answer, usually a reference site or a brochure, and the answer tells you nothing about your line.",
            "A question is aimed at the process when its subject is this line, this cell, or this flow of work, and it asks for a fact that can be checked. 'Which cartons on line 4 will the robot not handle, and who will pack them?' is aimed at the process. It has a specific answer, and if the request does not contain it, the gap is visible to everyone in the room.",
          ],
          beforeAfter: {
            before: "Is this camera reliable?",
            after:
              "How many stops a week does the current manual inspection station have on line 3, from the shift log, and how many stops does the case assume for the camera during its first three months?",
            reading:
              "The first question invites the supplier's view of its own product. The second asks for a measured fact about this line and an assumption in this case, and both answers can be checked.",
          },
        },
        {
          heading: "Ask for a fact the request has not given",
          paragraphs: [
            "Good questions are specific to the request in front of you. They name the line, the product, the people, or the figure, and they ask for something the request has not yet said. A question that could be asked of any request, such as 'Have you considered the risks?', invites a general reassurance, and the meeting moves on without learning anything.",
            "When you prepare, read the request with the five questions beside it and note which ones it already answers. You do not need to ask a question the request has answered well. You need to ask the ones it has not, in words that make the missing fact plain, so that the author knows exactly what to bring back.",
          ],
        },
        {
          heading: "What the five questions are not",
          paragraphs: [
            "The five questions are not the whole of an appraisal, and your organisation's approval process, its hurdle rates, and its authority limits still apply. They do not replace the risk assessment for the installation or the engineering review of the design, which other people are responsible for.",
            "They are the questions that most often reveal whether a case has been thought through. The mistake people usually make is to ask about the supplier because it feels like diligence. A supplier with a strong reputation can still be installing a cell on a process that was never measured, and only a question about the process will show it.",
          ],
        },
      ],
      workedExample: {
        title: "Preparing for the palletiser meeting",
        inputLabel: "The first draft of the questions",
        outputLabel: "The questions after they were rewritten",
        prompt: "Why this supplier? Is the palletiser reliable? Have other companies had success with it?",
        output:
          "What is the measured output and labour on the end of line today, and from which report? Which cases or pallets will the robot not handle, and who handles them? Does the cost include guarding, conveyor changes, and the service contract, and how long before full output? What will the two packers per shift do, and has HR been involved? What will we measure at ninety days, and against which baseline?",
        reading: [
          "A committee member at Tern Valley Drinks wrote the first draft for the palletiser from the last lesson but one. All three questions are aimed at the brand, and each would be answered with a brochure or a reference site.",
          "The rewritten questions follow the five in order. Each names something on this line, such as the end-of-line output, the pallets the robot will not build, the conveyor changes, or the two packers per shift.",
          "Each rewritten question has an answer that can be checked, and where the request is silent, the question shows exactly what is missing. That is what makes the meeting useful to the author as well as to the committee.",
        ],
      },
      practice: {
        intro:
          "A committee member at Harrow Engineering has drafted three questions for the machine-tending cell from the last lesson. Rewrite them as the five questions aimed at the process, specific to that cell. The section above on the five questions is still on the page.",
        check: {
          kind: "edit",
          label: "The questions you are rewriting",
          prompt:
            "Rewrite these questions so that they ask about the measured process today, the exceptions the cell will not handle, the cost to own and the ramp-up, the people whose work changes, and what will be measured at ninety days.",
          start: "Why did we choose this robot maker? Is their cell reliable? Can they send us a reference site?",
          unchanged:
            "You have not changed the questions yet. Replace the questions about the robot maker with questions about the process on this cell.",
          keep: [],
          limitWording: false,
          limits: [
            {
              id: "baseline",
              any: ["measured", "baseline", "today", "report", "record", "per shift", "per hour", "monitoring"],
              missing:
                "Your questions do not yet ask about the process today. Add a question about the measured output or labour on the cell and where the figures came from.",
            },
            {
              id: "exceptions",
              any: ["exception", "not handle", "will not", "won't", "stay with", "by hand", "manual", "odd"],
              missing:
                "Your questions do not yet ask about exceptions. Add a question about the parts or jobs the cell will not handle and who will do them.",
            },
            {
              id: "cost",
              any: ["cost to own", "integration", "guarding", "service", "maintenance", "ramp", "training", "support"],
              missing:
                "Your questions do not yet ask about the cost to own. Add a question about integration, guarding, service, or the ramp-up period.",
            },
            {
              id: "people",
              any: ["operator", "setter", "people", "staff", "hr ", "hr,", "hr?", "hr.", "human resources", "redeploy", "role"],
              missing:
                "Your questions do not yet ask about people. Add a question about what happens to the operators whose work changes and whether HR has been involved.",
            },
            {
              id: "ninety",
              any: ["ninety", "90", "go-live", "after installation", "review"],
              missing:
                "Your questions do not yet ask how success will be known. Add a question about what will be measured ninety days after go-live.",
            },
          ],
          why: "Those questions are aimed at the process. They ask for the measured baseline, the exceptions, the cost to own, the plan for the operators, and the ninety-day measures, and none of them can be answered with a brochure.",
          result: {
            label: "A set of questions that would pass",
            text: "What are the measured spindle hours and operator hours on lathes 6 and 7 today, and from which report? Which parts will the cell not handle, and who will load them by hand? Does the cost include guarding, integration, and the service contract, and how long is the ramp-up? What will the three operators do, and has HR been involved? What will we measure ninety days after go-live, and against which baseline?",
          },
        },
      },
      check: {
        kind: "choose",
        prompt:
          "A request has been submitted for a vision inspection system on a bottling line at Brook Lane Water. Choose the question that is aimed at the process rather than the brand.",
        leftLabel: "Question A",
        left: "What are the current measured rates of defective bottles reaching customers and of good bottles rejected at the manual inspection station, and from which records?",
        rightLabel: "Question B",
        right: "Is this supplier's camera the most advanced on the market?",
        correct: "left",
        why: "Yes. Question A asks for the measured baseline of this process and its source, which is the first of the five questions. Its answer can be checked now and compared at ninety days.",
        wrong:
          "Question B is about the supplier and invites a sales answer. It tells you nothing about this bottling line or how it performs today. Choose the question that asks for a fact about the process.",
      },
      bridge:
        "The fifth question, how you will know at ninety days whether it worked, needs its own lesson, because the answer has to be agreed before the money is spent.",
    },
    {
      id: "ninety-days-on",
      title: "Ninety days on",
      emphasis: "Ninety",
      place:
        "This is the fourth module. You can now challenge a request before it is approved, and this lesson sets the review that checks, after go-live, whether the request was right.",
      sections: [
        {
          heading: "What a post-investment review does",
          paragraphs: [
            "A post-investment review compares what happened with what the case said would happen. It uses the same measures and the same baseline as the request, taken from the same sources, so that the comparison is fair. The Green Book calls this kind of work evaluation, and it treats it as part of the appraisal rather than an afterthought.",
            "A review that uses different measures, or compares the new performance with a different period, can make almost any investment look successful or unsuccessful. If the request measured frames per shift over six months from the production system, the review measures frames per shift from the production system and compares them with those six months.",
          ],
        },
        {
          heading: "Why ninety days",
          paragraphs: [
            "Ninety days after go-live is a useful first point for a review. By then the ramp-up should be well under way, the early faults should be visible, and the people plan should have started. It is soon enough to correct a problem before it becomes the way the cell always runs.",
            "Ninety days is not the only review. Many organisations review again at a year, when the full benefit should have arrived and seasonal effects can be seen. The ninety-day review is the one that tells you whether the investment is on the path the case described, and whether anything needs to change.",
          ],
        },
        {
          heading: "Agree it when the investment is approved",
          paragraphs: [
            "The review should be agreed at the time the investment is approved, and written into the approval. If it is left to be arranged later, it is usually not arranged, or it is designed afterwards around the figures that look best. A review that was agreed in advance is much harder to bend.",
            "A review plan that can be carried out names five things. It names the measures, the baseline for each measure, the source each figure will come from, the person who owns the review, and the date it will be held. It also says what the possible outcomes are, such as continue as planned, adjust, or escalate to the committee.",
          ],
          beforeAfter: {
            before: "Performance to be reviewed after installation.",
            after:
              "Ninety-day review on 15 September, owned by the operations director. Frames per shift from the production system and rework rate from quality records, each against the six-month baseline in the request.",
            reading:
              "The first line could be ignored without anyone noticing. The second has a date, an owner, measures, a baseline, and sources, so someone is responsible and everyone knows what will be compared.",
          },
        },
        {
          heading: "Look at the exceptions and the people",
          paragraphs: [
            "The review should also look at the parts of the case that are easy to forget once the cell is running. It should check whether the pile of work the robot does not touch is the size the case expected. If the request said one pallet in ten would be built by hand and the figure is one in four, the labour saving will be smaller than planned.",
            "It should check whether the plan for the people whose work changed has happened. If the case said two welders per shift would move to lines 3 and 4 from month six, the review at ninety days should say whether the move is on track and whether HR is still involved. These two checks are where cases most often drift from what was approved.",
          ],
        },
        {
          heading: "What a review is not",
          paragraphs: [
            "A post-investment review is not a blame exercise. If the people who wrote the case expect to be blamed for a shortfall, they will write cautious cases, or they will present the review figures in the kindest light. Neither helps the business.",
            "Its purpose is to learn whether the case was right, to decide what to do next with this system, and to write the next case better. The mistake people usually make is to review only the output figure, because it is the easiest to find. Output can rise while overtime, exceptions, and the people plan all go the wrong way.",
          ],
        },
      ],
      workedExample: {
        title: "A review plan for the welding cell",
        inputLabel: "The review line in the draft approval",
        outputLabel: "The review plan written into the approval",
        prompt: "Performance to be reviewed after installation.",
        output:
          "Ninety-day review on 15 September, owned by the operations director. Measures, each against the six-month baseline in the request: frames per shift from the production system; rework rate from quality records; overtime hours on line 2 from payroll; cell stops needing an engineer, from the cell log. Also reviewed: the number of frame types still welded by hand; whether the two welders per shift have moved to lines 3 and 4. Outcome: continue as planned, adjust, or escalate to the committee.",
        reading: [
          "The date belongs to the example. The draft line had no date, no owner, and no measures, so nobody was responsible for holding the review and nobody would notice if it never happened.",
          "The rewritten plan names four measures, and each one has a source and is compared with the same six-month baseline the request used. That makes the comparison fair.",
          "The plan also checks the frame types still welded by hand, which is the exception pile, and the welders' move, which is the people plan. The outcome line tells the owner what they are deciding.",
        ],
      },
      practice: {
        intro:
          "Here are two review plans for the mobile robots at Ashby Distribution. Choose the plan that could actually be carried out, using the five things the section above says a plan must name.",
        check: {
          kind: "choose",
          prompt: "Choose the review plan that could be carried out ninety days after go-live.",
          leftLabel: "Plan A",
          left: "Ninety-day review on 2 June, owned by the warehouse manager. Measures against the three-month baseline in the request: trolley runs per shift from the warehouse system; agency hours from the agency invoices. Also reviewed: totes still moved by hand, and whether the four pickers have moved to returns.",
          rightLabel: "Plan B",
          right: "We will keep a close eye on the robots after go-live and report back to the committee if there are any concerns about performance or reliability.",
          correct: "left",
          why: "Plan A names a date, an owner, measures, the baseline, and the sources, and it checks the exceptions and the people plan. Plan B has none of these, so nobody would know when to hold the review or what to compare.",
          wrong:
            "Look again at Plan B. It has no date, no owner, no measures, and no baseline, so it would be reported only if someone chose to. Plan A names all five things and checks the exceptions and the pickers.",
        },
      },
      check: {
        kind: "edit",
        label: "The review plan you are repairing",
        prompt:
          "This review plan for the robotic palletiser at Tern Valley Drinks is missing parts the lesson named. Edit it so that it can actually be carried out.",
        material: {
          label: "What the request said",
          text: "Baseline: 28 pallets per shift with two packers per shift, from the line report for the last two quarters. Mixed-product pallets for two customers will be built by hand. The two packers per shift will move to the new line in spring.",
        },
        start: "Ninety-day review. Measures: output and labour.",
        unchanged:
          "You have not changed the plan yet. Add a date, an owner, the baseline and source for each measure, and a check on the people or the exceptions.",
        limitWording: false,
        keep: [
          {
            id: "output",
            any: ["output", "pallets"],
            missing: "Keep the output measure. The plan should still measure pallets or output per shift.",
          },
          {
            id: "labour",
            any: ["labour", "packer", "hours"],
            missing: "Keep the labour measure. The plan should still measure labour or packer hours.",
          },
        ],
        limits: [
          {
            id: "date",
            any: [
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
              "/",
              "days after go-live",
            ],
            missing: "Your plan has no date. Add the date the review will be held, so it cannot drift.",
          },
          {
            id: "owner",
            any: ["owned by", "owner", "director", "manager", "responsible", "lead"],
            missing: "Your plan has no owner. Name the person or role responsible for holding the review.",
          },
          {
            id: "baseline",
            any: ["baseline", "compared with", "against the", "28 pallets"],
            missing:
              "Your measures have no baseline. Add what each will be compared with, such as the two-quarter baseline in the request.",
          },
          {
            id: "source",
            any: ["report", "record", "payroll", "system", "timesheet", "log"],
            missing: "Your measures have no source. Add where each figure will come from, such as the line report.",
          },
          {
            id: "people",
            any: ["packers have moved", "move", "moved", "new line", "people", "hr", "by hand", "hand-built", "mixed", "exception"],
            missing:
              "Your plan measures output and labour only. Add a check on what happened to the packers whose work changed, or on the pallets the robot does not build.",
          },
        ],
        why: "Yes. Your review now has a date, an owner, measures with baselines and sources, and a look at the people and the exceptions, so someone is responsible for holding it and everyone knows what will be compared.",
        result: {
          label: "A plan that would pass",
          text: "Ninety-day review on 30 June, owned by the operations manager. Measures, against the two-quarter baseline in the request: pallets per shift from the line report; packer hours from payroll. Also reviewed: the number of mixed-product pallets built by hand, and whether the two packers per shift have moved to the new line. Outcome: continue, adjust, or escalate.",
        },
      },
      bridge:
        "You now have every part of the method. The next lesson recaps it and asks you to apply it to eight situations you have not yet seen.",
    },
    {
      id: "judging-a-whole-request",
      title: "Judging a whole request",
      emphasis: "whole",
      place:
        "This is the course assessment, and it comes before the final lesson. It recaps the method, works one mixed example, and then tests your judgement across eight new situations drawn from every earlier lesson.",
      sections: [
        {
          heading: "The method in one place",
          paragraphs: [
            "You read a capital request for robotics in the same order each time. First, you look for the process: a description of the work today on a named line, with a baseline of measured figures, each with its period and source. A request that starts with a brand, a hope, or an adjective has not yet shown you the problem.",
            "Second, you read the payback inputs. You look for the cost of owning the system, which includes integration, guarding, training, lost output during commissioning, spares, and running costs, and for a benefit measured against the baseline with a realistic ramp-up. Third, you read every claim about people and ask whether it is supported by a plan or claimed without one, including the new work the system creates.",
            "Fourth, you turn what is missing into questions aimed at the process, each asking for a fact the request has not given. Fifth, you make sure the approval includes a ninety-day review with a date, an owner, measures, a baseline, sources, and a look at the exceptions and the people.",
          ],
        },
        {
          heading: "How the parts depend on each other",
          paragraphs: [
            "The parts are not independent checks. A payback case cannot be honest if there is no baseline, because the benefit has nothing to be measured against. A ninety-day review cannot be fair if the request did not set a baseline, because there is nothing to compare the new figures with.",
            "The same is true of people and exceptions. If the case does not say how many items the robot will not handle, it cannot say how much labour will remain, and the claim about people rests on a figure nobody has measured. When you find one gap, look for the gaps it causes elsewhere in the case.",
          ],
        },
        {
          heading: "Common patterns in weak requests",
          paragraphs: [
            "Weak requests tend to fail in recognisable ways. The most common is the brochure opening, in which the first page describes the supplier and the last page shows a payback. Next is the list-price payback, which counts the machine and the full saving from the first week. Then comes the headcount line, which counts roles saved with no plan for the people in them.",
            "Strong requests also have a recognisable shape. They open with the process and its baseline, they count the cost to own, they allow for a ramp-up, they say what happens to each person whose work changes, and they close with the review. You will not often see all of these in a first draft, and your job is to ask for the ones that are missing.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "The assessment has eight situations. Each one describes a request, a meeting, or a review at an invented company, and asks what you would do. Every option is something a reasonable professional might do, and exactly one is the move this course teaches.",
            "You need six of the eight to pass. After you submit, each question shows whether your choice was right and why, so you can read the reasoning for any you missed before you try again. Before the assessment, a short practice of two situations lets you see the format with this section still on the page.",
          ],
        },
      ],
      workedExample: {
        title: "One request, read with the whole method",
        inputLabel: "The request summary from Lowther Joinery",
        outputLabel: "The committee member's reading",
        prompt:
          "Lowther Joinery requests £160,000 for a robotic sanding cell from a well-regarded German supplier. Sanding is slow and dusty. The cell will save three sanders and pay back in 20 months. The supplier will provide training. Performance will be monitored.",
        output:
          "The process is described only in adjectives, so I will ask for measured doors sanded per shift, rework, and sander hours over the last six months, from the production and quality records. The £160,000 appears to be the supplier's quotation, so I will ask whether it includes extraction, guarding, fixtures, commissioning downtime, and the service contract, and how long the ramp-up is. The three sanders are claimed without a plan, so I will ask what they will do, when, and whether HR is involved. I will ask which door types the cell will not sand. I will ask for a ninety-day review with a date, an owner, and measures against the baseline.",
        reading: [
          "Every figure and name in this example is invented. The request fails on all five questions, and the committee member finds each gap by reading in the order the method sets out.",
          "Notice that the reading does not reject the request or argue with the payback period. It names what is missing and asks for it, in questions aimed at this sanding process, so the author knows exactly what to bring back.",
          "Notice also that the reading links the gaps. Without a baseline, the saving of three sanders cannot be checked, and without the door types the cell will not sand, nobody knows how much sanding by hand will remain.",
        ],
      },
      practice: {
        intro:
          "Here are two short situations in the same format as the assessment. The recap above is still on the page. Choose the move the course teaches in each.",
        check: {
          kind: "scenario",
          prompt: "Choose the best move in each situation.",
          questions: [
            {
              id: "practice-review",
              situation:
                "Ellis Plastics has approved a robotic trimming cell. The approval minute says 'performance to be reviewed in due course'. Go-live is in eight weeks, and the production manager, Aisha Karim, has asked whether anything else is needed from finance.",
              question: "What do you ask Aisha to add to the approval?",
              options: [
                {
                  id: "a",
                  text: "Nothing more, because the review can be designed once the cell is running and real figures are available.",
                  feedback:
                    "A review designed after go-live tends to be built around whichever figures look best, and it is often never held. Agree the review now, with a date, an owner, and measures against the baseline.",
                },
                {
                  id: "b",
                  text: "A ninety-day review with a date, a named owner, measures from the request compared with its baseline and taken from the same sources, and a check on the exceptions and the people.",
                  correct: true,
                  feedback:
                    "Yes. That turns 'in due course' into a review someone owns, on a date, comparing like with like, which is what the lesson on ninety days set out.",
                },
                {
                  id: "c",
                  text: "A monthly report of output from the supplier's remote monitoring portal.",
                  feedback:
                    "The supplier's portal measures the machine, not the process, and it may not match the baseline in the request. Ask for the same measures from the same sources the request used.",
                },
              ],
            },
            {
              id: "practice-brand",
              situation:
                "Before a committee meeting at Fenner Castings, a colleague shares the one question she plans to ask about a request for a robotic fettling cell: 'Is this supplier the market leader?'. The request gives a baseline for fettling output but says nothing about castings the robot cannot fettle.",
              question: "What do you suggest she asks instead?",
              options: [
                {
                  id: "a",
                  text: "Which casting types will the cell not fettle, how many is that a week against the baseline, and who will fettle them by hand?",
                  correct: true,
                  feedback:
                    "Yes. That is the second of the five questions, aimed at this process, and it asks for the fact the request has left out.",
                },
                {
                  id: "b",
                  text: "Has the supplier installed this cell at another foundry, and can we visit?",
                  feedback:
                    "A reference visit shows you another foundry's castings, not yours. The request is silent on the exceptions, so ask which castings the cell will not handle and who will.",
                },
                {
                  id: "c",
                  text: "Keep the question, because the committee should know the supplier's standing.",
                  feedback:
                    "The supplier's standing is a question aimed at the brand and invites a sales answer. The gap in this request is the exceptions, and that is what the question should ask about.",
                },
              ],
            },
          ],
          why: "You chose the move the course teaches in both situations. The assessment uses the same format with eight new cases.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Here are eight situations from capital requests, meetings, and reviews. Choose the best move in each. You need six of the eight to pass.",
        passMark: 6,
        questions: [
          {
            id: "q-baseline",
            situation:
              "Hartwell Components has submitted a request for a robotic deburring cell. The first page says deburring is the bottleneck in the machine shop and that manual deburring is slow and inconsistent. The rest of the request describes the robot's cycle time and the supplier's installations in the automotive sector.",
            question: "What do you ask for first?",
            options: [
              {
                id: "a",
                text: "A demonstration of the robot deburring sample parts at the supplier's site.",
                feedback:
                  "A demonstration shows what the machine can do on chosen parts. It does not tell you what the machine shop does today, so there is still nothing to judge the investment against. Ask for the measured baseline first.",
              },
              {
                id: "b",
                text: "The measured output, deburring hours, and rework for the machine shop over a stated recent period, with the source of each figure.",
                correct: true,
                feedback:
                  "Yes. Bottleneck, slow, and inconsistent are adjectives. A baseline with periods and sources shows whether deburring really is the constraint, and it is what the investment will be measured against.",
              },
              {
                id: "c",
                text: "Case studies from the supplier's automotive customers showing their improvements.",
                feedback:
                  "Another company's results describe their process, not yours, and they come from the supplier. Ask for Hartwell's own measured figures instead.",
              },
              {
                id: "d",
                text: "A recommendation to reject the request because it is poorly written.",
                feedback:
                  "The request may still be a good investment. Rejecting it teaches the author nothing. Ask for the measured baseline so the case can be judged properly.",
              },
            ],
          },
          {
            id: "q-cost",
            situation:
              "A request at Selby Packaging for a robotic case erector shows a cost of £72,000 and integration of £18,000, with payback in 18 months. There is no line for guarding, training, the service contract, or the output lost while the machine is installed. The operations director, Mark Tully, says those costs are small and can come out of the maintenance budget.",
            question: "What do you do?",
            options: [
              {
                id: "a",
                text: "Accept the case, because the maintenance budget can absorb the smaller costs.",
                feedback:
                  "Moving costs to another budget does not make them disappear. The payback is still calculated on incomplete costs, so the board sees a period the machine will not achieve.",
              },
              {
                id: "b",
                text: "Add ten per cent to the cost as a contingency and recalculate the payback yourself.",
                feedback:
                  "A contingency is a guess about costs nobody has priced. Ask for the actual guarding, training, service, and commissioning costs so that the case counts the cost to own.",
              },
              {
                id: "c",
                text: "Ask for guarding, training, the service contract, and the lost output during installation to be priced and included, and for the payback to be restated.",
                correct: true,
                feedback:
                  "Yes. The cost to own includes those lines whichever budget pays for them. Restating the payback gives the board a figure it can rely on.",
              },
            ],
          },
          {
            id: "q-ramp",
            situation:
              "Moss & Carrick, a food manufacturer, has a request for a robotic tray sealer. The benefit line counts the full reduction in overtime from the first week after go-live. The request says nothing about how long commissioning or learning will take.",
            question: "What do you ask for?",
            options: [
              {
                id: "a",
                text: "A stated ramp-up period, the share of the benefit assumed during it, and a restated payback.",
                correct: true,
                feedback:
                  "Yes. Benefits rarely arrive in full in the first week. A realistic ramp-up lengthens the payback and makes it believable, and it tells the ninety-day review what to expect.",
              },
              {
                id: "b",
                text: "Confirmation from the supplier that the sealer will run at full speed from installation.",
                feedback:
                  "The supplier can speak for the machine, but the ramp-up depends on your people, products, and programs as well. Ask the author to state a ramp-up and restate the payback.",
              },
              {
                id: "c",
                text: "Nothing, because a short ramp-up will make little difference to a payback of this length.",
                feedback:
                  "Even a few months at reduced benefit can move payback materially, and the ninety-day review needs to know what was expected. Ask for the ramp-up to be stated.",
              },
            ],
          },
          {
            id: "q-people",
            situation:
              "A request at Dunmore Logistics for goods-to-person robots says the scheme saves six agency pickers and two permanent pickers. The agency figure is based on the last six months of agency invoices. Nothing else is said about the two permanent pickers, and HR has not seen the request.",
            question: "What do you ask the author to do?",
            options: [
              {
                id: "a",
                text: "Remove the whole people saving from the payback until HR has approved it.",
                feedback:
                  "The agency saving has a baseline and a source, so it is supported by a plan. Removing it would understate the case. The gap is the two permanent pickers.",
              },
              {
                id: "b",
                text: "Nothing, because a saving of two roles is too small to matter.",
                feedback:
                  "Two named colleagues are not a rounding error, and there may be duties to consult before their roles change. The claim needs a plan and HR's involvement.",
              },
              {
                id: "c",
                text: "Increase the agency saving instead, because agency staff are easier to release.",
                feedback:
                  "That changes the case without evidence. The agency saving should stay tied to the invoices, and the permanent pickers still need a plan.",
              },
              {
                id: "d",
                text: "Keep the agency saving, and for the two permanent pickers say what will happen to them, when, and who is responsible, with HR involved, or take that saving out until a plan exists.",
                correct: true,
                feedback:
                  "Yes. The agency saving is supported by a plan and the two permanent roles are claimed without one. Asking for a plan, or for the saving to be removed until there is one, keeps the case honest.",
              },
            ],
          },
          {
            id: "q-new-work",
            situation:
              "A request at Garside Metals for a robotic press-tending cell counts the removal of one operator per shift on three shifts. It says nothing about who will recover the cell after a stop, who will maintain it, or who will change its programs when a new part is introduced.",
            question: "What is missing from the case?",
            options: [
              {
                id: "a",
                text: "A second quotation from another supplier, to check the price.",
                feedback:
                  "A second quotation may be useful, but it does not address the gap. The case counts work removed and ignores the work the cell creates.",
              },
              {
                id: "b",
                text: "The new work the cell creates, with who will do it, how they will be trained, and how many hours it will take, counted against the benefit.",
                correct: true,
                feedback:
                  "Yes. Recovery, maintenance, and program changes are real work. A case that counts only the work removed overstates the benefit.",
              },
              {
                id: "c",
                text: "The supplier's figure for mean time between failures, to show the cell will rarely stop.",
                feedback:
                  "That number describes the machine in general. Even a reliable cell needs recovery, maintenance, and program changes on your parts, and the case must say who will do them.",
              },
            ],
          },
          {
            id: "q-question",
            situation:
              "You are preparing for a meeting on a request at Orwell Print for a robotic bindery line. The request has a baseline, a full cost to own, and a people plan, but it does not say how many jobs a week are short runs that the robot will not handle. A colleague suggests asking whether the robot maker has a good service reputation.",
            question: "Which question do you take into the meeting?",
            options: [
              {
                id: "a",
                text: "How many short-run jobs a week, from the job records for the last quarter, will the robot not handle, and who will bind them?",
                correct: true,
                feedback:
                  "Yes. It is aimed at this process, it asks for a fact the request has not given, and it has an answer that can be checked. The request already answers the other questions well.",
              },
              {
                id: "b",
                text: "Does the robot maker have a good service reputation among other printers?",
                feedback:
                  "That question is aimed at the brand and invites a sales answer. The gap in this request is the short runs the robot will not handle.",
              },
              {
                id: "c",
                text: "Have you considered all the risks of the project?",
                feedback:
                  "A general question invites a general reassurance. Ask for the specific fact the request has left out, which is the number of short runs and who will handle them.",
              },
            ],
          },
          {
            id: "q-exceptions",
            situation:
              "A request at Riverside Home Goods for a robotic carton packer says the robot will handle all standard cartons and claims a saving of four packers per shift. The order records show that about 15 per cent of orders last quarter went in non-standard cartons. The request does not mention them.",
            question: "What do you ask?",
            options: [
              {
                id: "a",
                text: "Whether the supplier can add a gripper for non-standard cartons later.",
                feedback:
                  "A future gripper is a hope about the equipment. The request as written leaves those cartons with people, and it needs to say who packs them and whether the saving allows for it.",
              },
              {
                id: "b",
                text: "Nothing, because 15 per cent is a small share of orders.",
                feedback:
                  "A small share of orders can be a large share of the packing work, and the case counts four packers per shift as saved. Ask who will pack the non-standard cartons.",
              },
              {
                id: "c",
                text: "Who will pack the non-standard cartons, how many hours that needs, and whether the saving of four packers per shift allows for it.",
                correct: true,
                feedback:
                  "Yes. Exceptions stay with people, and a saving that ignores them may not arrive. The order records give you the baseline to ask against.",
              },
              {
                id: "d",
                text: "Reject the request, because a robot that cannot handle every carton is the wrong choice.",
                feedback:
                  "Few robots handle every item, and a case with a clear exception plan can still be sound. Ask how the exceptions will be handled and costed rather than rejecting it.",
              },
            ],
          },
          {
            id: "q-review-baseline",
            situation:
              "At the ninety-day review of a robotic palletiser at Kestrel Drinks, the operations manager, Tom Reilly, reports that output is 20 per cent higher than in January. The request's baseline was the average of the last two quarters before approval, taken from the line report. January is usually the quietest month of the year.",
            question: "What do you ask for?",
            options: [
              {
                id: "a",
                text: "Accept the figure, because output has clearly improved.",
                feedback:
                  "Comparing with the quietest month can make almost any change look like an improvement. The review should use the same baseline as the request.",
              },
              {
                id: "b",
                text: "The same output measure from the line report, compared with the two-quarter baseline in the request.",
                correct: true,
                feedback:
                  "Yes. A post-investment review compares like with like, using the same measures, the same baseline, and the same source as the case. That is the only fair test of what was promised.",
              },
              {
                id: "c",
                text: "The supplier's own performance report for the palletiser over the ninety days.",
                feedback:
                  "The supplier measures its machine, not your line, and not against your baseline. Ask for the line report figure against the two quarters in the request.",
              },
            ],
          },
        ],
        why: "You applied the method across the whole of a request: the process and its baseline, the cost to own and the ramp-up, the people and the new work, the exceptions, questions aimed at the process, and a fair review.",
      },
      bridge:
        "You have passed the assessment. The final lesson asks you to apply the five questions to one real request and write the review that appears on your record.",
    },
    {
      id: "the-five-question-review",
      title: "The five-question review",
      emphasis: "review",
      place:
        "This is the final lesson. You will apply the five questions to one capital request and write the review, and that review is the work your record will show.",
      sections: [
        {
          heading: "What the review is",
          paragraphs: [
            "The five-question review is a one-page record of your challenge to one capital request. For each of the five questions, it records the question as you asked it, written for this request, and the answer the request gives or the words not yet answered. It ends with your view and the conditions or missing answers that go with it.",
            "It is not the approval, and it is not a financial model. It does not replace your organisation's process, the engineering review, or the risk assessment for the installation. It is the record of what a careful reader asked and found, written so that the author, the committee, and anyone who opens it later can see exactly what was and was not answered.",
          ],
        },
        {
          heading: "Choose a real request, and keep it shareable",
          paragraphs: [
            "Choose a real or recent capital request for automation if you have one, because you will know the process and you can use the review at your next meeting. If you do not have one, use the palletiser request from this course or a request you can describe from memory.",
            "The review will appear on a record that another person can open. Do not include anything confidential. Replace customer names, prices, and other sensitive figures with realistic examples that keep the same shape, so that the review still shows the questions you asked and what you found.",
          ],
        },
        {
          heading: "Write each question for this request",
          paragraphs: [
            "Each question should name something in this request: the line, the product, the people, or the figure. 'What is measured output on line 5 today, and from which report?' is written for a request. 'What is the process?' could be asked of anything, and it will not show a reader what you were looking for.",
            "None of the questions should have the supplier or the brand as its subject. If you find yourself asking about the supplier's reputation, turn the question round to ask what you would learn from the answer about your own process, and ask that instead.",
          ],
        },
        {
          heading: "Answered, or not yet answered",
          paragraphs: [
            "After each question, write the answer the request gives, in a sentence, or write not yet answered. Do not fill a gap with your own estimate, and do not soften it into partly answered. The value of the review is that it shows plainly where the request is silent.",
            "The process answer needs its source. If the request gives output from the line report for the last two quarters, say so. If it gives a figure with no source, write the figure and add that the source is not yet answered. The ninety-day answer needs at least one measure, such as output, overtime, rework, or the count of items handled by hand, compared with the baseline.",
          ],
        },
        {
          heading: "Your view, and how the review is checked",
          paragraphs: [
            "Your view is one of three: support, support with conditions, or not yet. Start the field with one of those words. If your view is support with conditions or not yet, name at least one condition or missing answer, so the author knows what to do next. A condition is specific, such as adding a ramp-up to the payback, rather than general, such as tightening up the numbers.",
            "In the practice below you will mark lines from a draft review with two labels. A line is Ready for the committee when it asks a question aimed at this request and records the answer or says not yet answered. A line Needs another pass when it asks about the brand, leaves the answer blank, or gives a view with no condition. When you submit the review itself, each part is checked for its substance: a source or not yet answered for the process, the exceptions, the costs of owning, the people affected, a measure for ninety days, and a view that says support or not yet.",
          ],
        },
      ],
      workedExample: {
        title: "A review of the palletiser request",
        inputLabel: "The request being reviewed",
        outputLabel: "The review the finance business partner wrote",
        prompt:
          "Tern Valley Drinks requests approval for a robotic palletiser on line 5, with guarding, conveyor changes, and a service contract in the cost, and the two packers per shift moving to the new line in spring.",
        output:
          "Process today: What is measured output and labour at end of line 5? Answer: 28 pallets per shift, two packers, from the line report for the last two quarters. Tasks and exceptions: Which pallets will the robot not build? Answer: mixed-product pallets for two customers, which will be hand-built by a packer on days. Cost to own: Does the cost include guarding, conveyor changes, service, and ramp-up? Answer: guarding and conveyor included; service contract included; ramp-up not yet answered. People: What will the two packers per shift do? Answer: move to the new line in spring, discussed with HR. Ninety days: What will we measure? Answer: not yet answered. View: support with conditions. Conditions: add a ramp-up period to the payback, and add a ninety-day review with output, labour, hand-built pallet count, and the packers' move, owned by the operations manager.",
        reading: [
          "The figures and names belong to the example. Each question names something on line 5, and none of them is about the supplier.",
          "The review records exactly what the request answered and what it did not. The ramp-up and the ninety-day measures are marked not yet answered rather than guessed.",
          "The view starts with support with conditions and names two conditions, each of which the author can act on. Those conditions would make the approval stronger, and they give the ninety-day review its measures.",
        ],
      },
      practice: {
        intro:
          "Here are four lines from a draft review of a request at Ashby Distribution for mobile robots. Mark each line with the two labels defined in the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each line of the draft review as Ready for the committee or Needs another pass.",
          passLabel: READY,
          failLabel: ANOTHER_PASS,
          sentences: [
            {
              id: "process",
              text: "Process today: How many trolley runs per shift are there between picking and packing? Answer: 140 per shift on average, from the warehouse system for the last quarter.",
              fail: false,
              why: "It asks a question about this process and records the answer with its source and period, so it is ready for the committee.",
            },
            {
              id: "brand",
              text: "Tasks and exceptions: Is this robot maker the best in the market? Answer: the supplier says so.",
              fail: true,
              why: "The question is aimed at the brand and the answer is the supplier's view. Ask which totes or routes the robots will not handle, so it needs another pass.",
            },
            {
              id: "people",
              text: "People: What will the four pickers on nights do? Answer: not yet answered.",
              fail: false,
              why: "It asks a specific question about the people and says plainly that the request is silent, so it is ready for the committee.",
            },
            {
              id: "view",
              text: "View: not yet.",
              fail: true,
              why: "A view of not yet must name at least one condition or missing answer, so the author knows what to bring back. It needs another pass.",
            },
          ],
          why: "That is right. The process and people lines ask about this request and record what it says, and the brand question and the bare view need another pass before the review goes to the committee.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the five-question review of a real or recent capital request for automation. Each question has to be specific to that request, and each answer has to be what the request says or not yet answered. Finish with your view and its conditions.",
        fields: [
          {
            id: "process",
            label: "The process today",
            hint: "Your question about the measured process, then the answer with its source and period, or not yet answered.",
            min: 40,
            any: ["report", "record", "system", "payroll", "log", "register", "timesheet", "invoice", "source", "not yet answered"],
            missing:
              "Your process answer has no source for its figures. Say where they come from, such as the line report or the production system, or write not yet answered.",
          },
          {
            id: "exceptions",
            label: "Tasks and exceptions",
            hint: "Your question about what the robot will take and what stays with people, then the answer or not yet answered.",
            min: 30,
            any: ["exception", "not handle", "will not", "won't", "stay with", "by hand", "hand-built", "manual", "remain with", "not yet answered"],
            missing:
              "Your tasks and exceptions part does not yet say what the robot will not handle. Ask which items stay with people and record the answer, or write not yet answered.",
          },
          {
            id: "cost",
            label: "Cost to own and ramp-up",
            hint: "Your question about the full cost of owning the system and the ramp-up, then what the request includes and what it leaves out.",
            min: 30,
            any: ["integration", "guarding", "training", "service", "maintenance", "ramp", "spares", "commissioning", "support contract", "cost to own"],
            missing:
              "Your cost part does not yet name any cost of owning the system. Ask about integration, guarding, training, service, or the ramp-up, and record which the request includes.",
          },
          {
            id: "people",
            label: "People",
            hint: "Your question about the people whose work changes and who is responsible, then the answer or not yet answered.",
            min: 30,
            any: ["operator", "packer", "picker", "welder", "setter", "staff", "people", "redeploy", "role", "human resources", "hr ", "hr,", "hr.", "consult", "technician"],
            missing:
              "Your people part does not yet name the people whose work changes. Ask what will happen to them and whether HR is involved, and record the answer.",
          },
          {
            id: "ninety",
            label: "Ninety days on",
            hint: "Your question about the ninety-day review, and at least one measure to compare with the baseline.",
            min: 30,
            any: ["output", "rework", "overtime", "labour", "downtime", "stops", "throughput", "scrap", "pallets", "frames", "cases", "hours", "per shift", "hand-built", "by hand"],
            missing:
              "Your ninety-day part has no measure. Name at least one measure, such as output per shift or overtime hours, to compare with the baseline.",
          },
          {
            id: "view",
            label: "My view and conditions",
            hint: "Start with support, support with conditions, or not yet, then name the conditions or missing answers.",
            min: 20,
            any: ["support", "not yet"],
            missing:
              "Your view does not begin with support, support with conditions, or not yet. Start with one of those, and name at least one condition or missing answer if it is not plain support.",
          },
        ],
        why: "Your review asks five questions about this process, records what the request answers and what it does not, and gives a view with its conditions and a ninety-day measure, so the author and the committee can see exactly what was asked and found.",
      },
      bridge:
        "Your review is ready. Sign your name below, and the record will show this review, the course, and the date to anyone who opens the reference.",
    },
  ],
};
