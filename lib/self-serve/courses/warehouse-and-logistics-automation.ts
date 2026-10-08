/*
Course: Warehouse and Logistics Automation
Slug: warehouse-and-logistics-automation
For: Warehouse managers, logistics and supply chain leads, and operations analysts who are being asked
  about conveyors, sortation, mobile robots, automated storage, or robotic picking. They know one goods
  flow in their site well, or can walk it and talk to the people who work it, and they can get basic
  volume figures from the warehouse management system or from supervisors. No engineering knowledge.
Outcome: The learner draws one goods flow from arrival to dispatch, marks where the unit of handling
  changes, separates measured figures from assumed ones, points to the step where automation would pay
  and says why in terms of volume, uniformity, and travel, names the pile of exceptions the system will
  leave for people, and says where automation would make the flow worse and what the fallback is, all on
  a one-page map a colleague could put in front of a supplier.
Artefact: The goods flow map, in six labelled parts.
Record sentence: Mapped one goods flow from arrival to dispatch, separated measured figures from assumed
  ones, and showed where automation would pay, what it would leave for people, and where it would make
  the flow worse.
Lessons (id, title, move, interaction, pass rule):
  1. one-goods-flow, One goods flow, narrow a site to one path with its unit changes.
     Practice: mark (every step marked correctly). Check: choose (Description B, the single path).
  2. measured-or-assumed, Measured or assumed, label each figure by where it came from.
     Practice: choose (Note B, source and period named). Check: mark (all four figures correct).
  3. where-it-pays, Where it pays, find the step where volume, uniformity, and travel meet.
     Practice: mark (every sentence correct). Check: choose (Step B, the carton moves).
  4. the-pile-it-will-not-touch, The pile it will not touch, name what the system leaves for people.
     Practice: choose (Proposal A, which describes its pile). Check: mark (all four sentences correct,
     including the conditional polybag sentence).
  5. where-it-makes-it-worse, Where it makes the flow worse, give every risk a fallback.
     Practice: choose (Fallback B, which says what people do). Check: edit (keeps the robots and the
     outage, adds a fallback, and names what people would do to move the goods).
  6. course-assessment, The course assessment, apply the whole method to new situations.
     Practice: choose (Reading A). Check: scenario of seven questions, pass mark six.
  7. the-map, The map, write the artefact.
     Practice: mark (every line correct). Check: build of six fields, each with an `any` list or a rule.
Sources: UK Health and Safety Executive, Warehousing and storage: A guide to health and safety (HSG76).
  ISO 3691-4, Industrial trucks: Safety requirements and verification, Part 4: Driverless industrial
  trucks and their systems, named only so the learner knows which standard applies to many mobile robots.
  Alan Rushton, Phil Croucher, and Peter Baker, The Handbook of Logistics and Distribution Management
  (Kogan Page). Edward H. Frazelle, World-Class Warehousing and Material Handling. Supplier documentation,
  read with the measured-or-assumed test from lesson 2. No statistics are quoted in the lessons.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/

import type { CourseContent } from "./types.ts";

const UNIT_CHANGES = "The unit changes here";
const UNIT_SAME = "The unit stays the same";
const MEASURED = "Measured";
const ASSUMED = "Assumed";
const PAYS = "A reason it pays";
const NOT_PAYS = "Not a reason it pays";
const HANDLED = "Handled by the system";
const LEFT = "Left for people";
const READY = "Ready for the supplier meeting";
const IGNORE = "A supplier could talk past it";

export const COURSE: CourseContent = {
  slug: "warehouse-and-logistics-automation",
  hours: 2.5,
  artefact: {
    lessonId: "the-map",
    title: "The goods flow map",
    recordLine:
      "Mapped one goods flow from arrival to dispatch, separated measured figures from assumed ones, and showed where automation would pay, what it would leave for people, and where it would make the flow worse.",
  },
  lessons: [
    {
      id: "one-goods-flow",
      title: "One goods flow",
      emphasis: "flow",
      place:
        "This is the first of seven lessons and the start of the first module, The flow. It fixes what your map will cover, so that every later lesson has one path of goods to work on.",
      sections: [
        {
          heading: "What a goods flow is",
          paragraphs: [
            "A goods flow is the path that one kind of goods takes through your site, from the moment it arrives to the moment it leaves. For many sites it runs through receive, check, put away, store, replenish, pick, pack, and dispatch. Your own flow may skip some of those steps, merge two of them, or add one that nobody else has, such as labelling for a particular retailer or kitting components for a production line.",
            "You write the flow as a sequence of steps, each one a short sentence saying what happens to the goods. The test of a step is that a supervisor could walk to it and watch it happen. Receive pallets at door 4 is a step. Operations is not, because nobody can watch it happen to a carton.",
            "One kind of goods means a group that travels the same path, for example e-commerce orders for small items, or bagged cement for trade customers. If two groups share most of the path but split at picking, choose one of them for now. You can draw the second flow later, and it will be easier once the first is on paper.",
          ],
        },
        {
          heading: "Where the unit of handling changes",
          paragraphs: [
            "The most important thing to mark on the flow is where the unit of handling changes. The unit of handling is the thing a person or a machine picks up, moves, or scans at that step. Goods might arrive as pallets, be broken into cases at put-away, be picked as single items, and leave as parcels. Each of those is a different unit.",
            "In this lesson, a step where the unit going out is different from the unit coming in is marked The unit changes here. A step where the same unit arrives and leaves is marked The unit stays the same. Moving a pallet from the dock to the racking leaves it a pallet, so the unit stays the same. Breaking that pallet into cases on the pick face means the unit changes here.",
            "Unit changes matter because work and errors concentrate at them. Counting, labelling, splitting, and consolidating all happen where the unit changes, and so do most of the mistakes. They matter for automation too, because equipment that suits one unit rarely suits the next. A conveyor built for cases does not carry pallets, and a pallet shuttle does not pick single lipsticks.",
          ],
        },
        {
          heading: "What a goods flow is not",
          paragraphs: [
            "A goods flow is not the whole site. A description such as the yard, the main shed, the mezzanine, and returns lists places, but it does not follow any goods through them, so it cannot tell you where the work is or where it changes. A whole-site description also cannot fit on one page, and a map that cannot fit on one page will not be read in a supplier meeting.",
            "A goods flow is also not a layout drawing. The layout shows where the racking and the doors are. The flow shows what happens to the goods, in order. You will often need the layout later, but the questions automation raises are questions about the flow: how much, how often, in what unit, and with how much walking in between.",
          ],
          beforeAfter: {
            before: "Our whole warehouse: 20,000 SKUs, two mezzanines, returns, e-commerce and store orders.",
            after:
              "E-commerce orders for small items. Receive pallets. Break pallets into cases and put away to mezzanine shelving. Pick single items into totes. Pack each order into a mailer bag. Sort mailer bags by carrier. Dispatch.",
            reading:
              "The first version describes a building. The second follows one kind of goods from the door to the lorry, and it already shows three places where the unit changes: pallet to case, case to single item, and single items to a parcel.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to start from the part of the site that hurts the most, or from the product a supplier has just demonstrated, and to describe that part in isolation. The result is a note about returns or about a sorter that never says what arrives before it or what happens after it. Without the steps either side, nobody can tell whether fixing it would move the queue somewhere else.",
            "The second mistake is to leave the unit changes out because they seem obvious. They are obvious to the person who works the floor. They are not obvious to a supplier, a finance director, or a colleague reading the map six months later, and they are the first thing an automation proposal will quietly assume.",
          ],
        },
      ],
      workedExample: {
        title: "Narrowing a whole site to one flow",
        inputLabel: "What the manager was asked to describe",
        prompt:
          "Priya Nair runs the Hollins Health and Beauty distribution centre near Daventry. Her operations director asks for a note on automation. Her first draft reads: 'Our whole warehouse: 20,000 SKUs, two mezzanines, returns, e-commerce and store orders.'",
        outputLabel: "The flow she drew instead",
        output:
          "E-commerce orders for small items. Receive pallets from the supplier at doors 1 to 3. Break pallets into cases and put away to shelving on the mezzanine. Pick single items into totes. Pack each order into a mailer bag. Sort mailer bags by carrier into cages. Dispatch. Unit changes: pallet to case at put-away, case to single item at picking, single items to parcel at packing.",
        reading: [
          "The first draft could not be mapped on a page. It names a building, a count of items, and several kinds of order, but it does not follow any goods, so it gives the operations director nothing to decide.",
          "The flow Priya drew instead chooses one kind of goods, e-commerce small items, and follows it from the doors to the carrier cages in seven steps. Each step is something a supervisor could walk to and watch.",
          "The last line marks three unit changes. Each one is a separate question for automation, because a system that handles cases at put-away is a different system from one that handles single items at picking or parcels at sortation.",
        ],
      },
      practice: {
        intro:
          "Here is a flow for chilled store orders at a food distribution centre. Mark each step to show whether the unit changes there or stays the same. The section on units of handling above is still on the page if you want it.",
        check: {
          kind: "mark",
          prompt: "Mark each step of the chilled store orders flow as The unit changes here or The unit stays the same.",
          material: {
            label: "The flow",
            text: "Chilled store orders at Kestrel Foods, Wakefield. Pallets arrive from suppliers, move to chilled racking, are picked as cases onto roll cages for each store, and the roll cages are loaded onto store lorries.",
          },
          passLabel: UNIT_SAME,
          failLabel: UNIT_CHANGES,
          sentences: [
            {
              id: "racking",
              text: "Move full pallets from the dock to chilled racking.",
              fail: false,
              why: "A pallet arrives at this step and a pallet leaves it, so the unit stays the same.",
            },
            {
              id: "pick",
              text: "Pick cases from the pallet onto a roll cage for each store.",
              fail: true,
              why: "A pallet goes in and cases come out onto a cage, so the unit changes here.",
            },
            {
              id: "load",
              text: "Load the roll cages onto the store lorry.",
              fail: false,
              why: "The roll cage is the unit coming in and going out, so the unit stays the same.",
            },
          ],
          why: "That is right. Moving pallets and loading cages leave the unit as it was, and picking cases from a pallet onto a store cage is the one step where the unit changes.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two descriptions have been written of a flow at Castleford Build Supplies, a building supplies depot. Choose the one that describes one goods flow as this lesson taught.",
        leftLabel: "Description A",
        left: "The yard, the main shed, the trade counter, and deliveries.",
        rightLabel: "Description B",
        right:
          "Bagged cement for trade customers. Receive full pallets from the supplier. Store pallets in the yard racking. Pick part pallets by the bag for trade orders. Load onto customer vehicles or our own delivery lorries. Unit changes: full pallet to bag at picking.",
        correct: "right",
        why: "Description B follows one kind of goods from arrival to dispatch in steps a supervisor could watch, and it marks where the unit changes from a full pallet to a bag. That is a flow you can put figures against in the next lesson.",
        wrong:
          "Description A lists areas of the depot. It does not follow any goods through them or show where the unit of handling changes. Choose the description that follows one path for one kind of goods.",
      },
      bridge:
        "A flow needs figures before anyone can judge it, and the next lesson asks, for each figure, whether it has been measured or only assumed.",
    },
    {
      id: "measured-or-assumed",
      title: "Measured or assumed",
      emphasis: "assumed",
      place:
        "This lesson completes the first module, The flow. You have one path of goods on paper, and now you put numbers against it and say honestly where each number came from.",
      sections: [
        {
          heading: "Automation is sized to volumes",
          paragraphs: [
            "Every piece of warehouse automation is sized to a volume. A sorter has a number of parcels it can handle in an hour, a storage system has a number of totes it can present to a picker, and a fleet of mobile robots has a number of trips it can make. If the volume you give the supplier is wrong, the system you buy is sized for a different warehouse from yours.",
            "For each step you need four figures: the volume per hour or per day, the peak as well as the average, the number of different items that pass through it, and the size and weight range of the unit. Most sites can give some of these quickly. Very few can give all of them from a record without someone going to look.",
          ],
        },
        {
          heading: "Two labels for every figure",
          paragraphs: [
            "In this course, a figure is Measured when it comes from a record, such as the warehouse management system, a carrier manifest, a weigh scale log, a physical count, or a time study, and when you know the period it covers. Twelve months of daily pick totals from the warehouse management system is measured. So is a count of cages on the dock at 6pm every day last week.",
            "A figure is Assumed when it comes from memory, a budget, a sales forecast, a supplier's estimate, or an average someone once quoted in a meeting. Words such as about, probably, roughly, and we usually are often a sign of an assumed figure, although a measured figure can be rounded too. The test is not how precise it sounds. The test is whether you can name the record and the period.",
            "Assumed figures are not wrong in themselves, and every early map has some. They become dangerous only when nobody knows they are assumed, because then they are passed to a supplier as if they were facts and the system is sized on them. Marking a figure Assumed is a note to yourself about what to measure next.",
          ],
          beforeAfter: {
            before: "We pick about 8,000 items a day and peak is about double.",
            after:
              "About 8,000 items a day: measured, the warehouse management system daily average over the last twelve months. Peak about double: assumed, from memory of last November.",
            reading:
              "The first version gives two numbers with the same confidence. The second shows that only one of them has a record behind it, and that the one without a record is the peak.",
          },
        },
        {
          heading: "Why the peak matters most",
          paragraphs: [
            "Many flows run at a comfortable average for most of the year and then far above it for a few weeks, at Christmas, in a promotion, or when a large customer changes its ordering pattern. People absorb a peak by working overtime, bringing in agency staff, and filling every trolley. A machine absorbs a peak only up to its rated capacity, and above that the queue grows.",
            "A system sized to the average therefore fails at exactly the moment it matters most. That is why the peak is the figure most worth measuring, and it is also the figure most often assumed, because peaks are remembered rather than recorded. When you find that your peak is assumed, the next job is to pull the daily volumes for the busiest weeks of last year.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to treat a supplier's figure as a measurement. A supplier who says their system handles volumes like yours is giving you an estimate about your flow, and it is assumed until you have checked it against your own records. The same applies to a figure from the budget, which records what someone hoped would happen rather than what did.",
            "The second mistake is to mark a figure measured without knowing the period. A daily average from the last twelve months tells a different story from a daily average from the last quiet month. Write the period next to every measured figure, so that anyone reading the map can see what it covers.",
          ],
        },
      ],
      workedExample: {
        title: "Priya puts figures on the flow",
        inputLabel: "The figures as first given",
        prompt: "We pick about 8,000 items a day. Peak is about double. Most items are small. There are 20,000 SKUs.",
        outputLabel: "The figures, marked",
        output:
          "About 8,000 items a day: measured, the warehouse management system daily average over the last twelve months. Peak about double: assumed, the shift manager's memory of last November. Most items are small: assumed, no size data has been pulled. 20,000 SKUs: measured, the current item master, though about a third have not moved in six months.",
        reading: [
          "The figures belong to this example and are not industry figures. Two of the four are measured, and each names the record and the period it covers.",
          "Two are assumed, including the peak, which is the figure a system must be sized for. The claim that most items are small sounds harmless, but it will decide whether items fit a standard tote, and nobody has pulled the dimensions.",
          "Priya's next job is clear from the marks alone: pull the daily volumes for last November from the warehouse management system, and pull the dimensions from the item master.",
        ],
      },
      practice: {
        intro:
          "Two notes have been written about the same figure for a returns flow. Choose the note that makes the figure Measured as this lesson defined it. The definitions are in the section above.",
        check: {
          kind: "choose",
          prompt: "Choose the note that makes the returns figure Measured.",
          leftLabel: "Note A",
          left: "We get roughly 600 returns a day, which is what the team leader reckons.",
          rightLabel: "Note B",
          right: "We received an average of 612 returns a day, from the warehouse management system returns log for January to June this year.",
          correct: "right",
          why: "Note B names the record, the returns log, and the period it covers, January to June, so the figure is measured. Note A comes from a team leader's estimate, which makes it assumed however reasonable it sounds.",
          wrong:
            "Look again at Note A. A team leader's reckoning is a memory, not a record, and no period is given, so the figure is assumed. Note B names the returns log and the months it covers.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Owen Pryce, a transport manager at Tamar Parcels, has given these figures about a parcel sortation flow. Mark each one as Measured or Assumed.",
        passLabel: MEASURED,
        failLabel: ASSUMED,
        sentences: [
          {
            id: "manifest",
            text: "We handle about 12,000 parcels a day, from the carrier manifest totals for the last six months.",
            fail: false,
            why: "This figure names its source, the carrier manifests, and the period it covers, so it is measured even though it is rounded.",
          },
          {
            id: "christmas",
            text: "Christmas is probably three times a normal day.",
            fail: true,
            why: "No record is named and the word probably shows it is an estimate, so it is assumed. Because it is the peak, it is the figure most in need of measuring.",
          },
          {
            id: "supplier",
            text: "The supplier says a sorter like theirs handles our volume easily.",
            fail: true,
            why: "A supplier's view is an estimate about your flow rather than a record of it, so it is assumed.",
          },
          {
            id: "scale",
            text: "Parcels range from 0.1 kilograms to 25 kilograms, from the weigh scale log for March.",
            fail: false,
            why: "This names the weigh scale log and the month it covers, so it is measured.",
          },
        ],
        why: "That is the right reading. The manifest totals and the weigh scale log are records with a stated period, so those figures are measured. The Christmas multiple and the supplier's claim come from memory and from someone else's estimate, so they are assumed, and the Christmas peak is the one to measure first.",
      },
      bridge:
        "With the flow drawn and its figures honest, the next lesson looks for the step where automation would actually pay.",
    },
    {
      id: "where-it-pays",
      title: "Where it pays",
      emphasis: "pays",
      place:
        "This lesson is the second module, Where it pays. You have a flow with honest figures, and now you point to the one or two steps where automation is worth considering and say why.",
      sections: [
        {
          heading: "Three conditions that come together",
          paragraphs: [
            "Automation tends to pay in a warehouse where three things come together. The first is steady volume: work that happens at a high and fairly predictable rate, so that the equipment is busy most of the time it is running. Equipment that stands idle for half the shift costs the same to buy and maintain as equipment that is busy.",
            "The second is uniformity: units of a similar size, shape, weight, and packaging, so that one type of equipment can handle nearly all of them. Standard cartons, totes, and pallets are uniform. Opened returns, loose garments, and mixed bags of fixings are not.",
            "The third is travel. In many warehouses a large share of labour is spent walking or driving between locations rather than handling goods, which is why goods-to-person systems, which bring stock to a picker at a fixed station, and mobile robots that carry totes or cases between zones are so common in proposals. Where people spend most of their time walking, removing the walk is often where the saving lies.",
          ],
        },
        {
          heading: "The step that constrains the flow",
          paragraphs: [
            "The step that pays is also usually the step that constrains the whole flow, meaning the step where work queues because it cannot keep up. If picking is the constraint and packing benches stand idle waiting for totes, a faster packing machine does nothing for dispatch times. It only moves the queue, or makes the idle time at packing longer.",
            "You can usually find the constraint by walking the flow at the busiest hour and asking where goods are waiting. Totes stacked at the end of a pick aisle, cages lined up at a sorter, and pallets on the dock floor are all signs of a step that cannot keep up with the one before it.",
          ],
        },
        {
          heading: "What is and is not a reason it pays",
          paragraphs: [
            "When you write about a candidate step, each sentence is either A reason it pays or Not a reason it pays. A reason it pays is a statement about steady volume, uniform units, travel, or the step being the constraint. Pickers walk most of the shift between mezzanine bays is a reason it pays. Every order passes through this step at a steady rate is a reason it pays.",
            "Not a reason it pays covers everything else that often drives the conversation: the step everyone complains about, the step a supplier happens to have a product for, the step a competitor has automated, or the step that looks old-fashioned to visitors. Those may all be true, and some may matter for other reasons, but none of them tells you that a machine would be busy, able to handle the units, and saving real labour.",
          ],
          beforeAfter: {
            before: "Returns is the step everyone complains about, so we should automate returns.",
            after:
              "Returns varies with every item and needs inspection, so it lacks uniformity. Picking has steady volume, boxed items, and most of the labour is walking, so picking is where automation would pay.",
            reading:
              "The first version picks a step because it hurts. The second tests each step against volume, uniformity, and travel, and arrives at a different answer with a reason attached.",
          },
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to choose the step where the manager's pain is loudest. Pain is a real signal that something needs attention, but the step that causes the most complaints is often the one with the most variety, and variety is what automation handles worst. The painful step may need better processes, more space, or a different team structure rather than a machine.",
            "The second mistake is to start from the product. A supplier who sells sorters will find a sortation problem in any warehouse they visit. Your flow, with its measured figures, is what tells you where the money is, and the product conversation comes after that.",
          ],
        },
      ],
      workedExample: {
        title: "Priya weighs two candidate steps",
        inputLabel: "The two steps she considered",
        prompt:
          "Step A: pickers walk the mezzanine to pick single items into totes. This takes most of the labour in the flow. Items are small and mostly boxed. Step B: returns processing, which is the step everyone complains about, with items arriving opened, unlabelled, and mixed.",
        outputLabel: "What she wrote on the map",
        output:
          "Step A is where automation would pay. Volume is steady, items are fairly uniform, and most of the labour is travel. A goods-to-person system or mobile robots bringing totes to pickers could be considered. Step B is painful but varies too much to pay. It stays with people.",
        reading: [
          "Priya wanted to solve returns, because returns is what her team raises at every shift briefing. She tested both steps against the three conditions instead of starting from the complaint.",
          "Step A meets all three. The volume is steady across the day, the items are mostly boxed and small, and the labour is mostly walking between bays. Step B fails on uniformity, because every return arrives in a different condition and needs a person to judge it.",
          "That does not make returns less important. It means returns needs a different answer, and the map now says so in a sentence rather than leaving the question open.",
        ],
      },
      practice: {
        intro:
          "Here are sentences from a manager's note about the case replenishment step at a hardware distribution centre. Mark each one as A reason it pays or Not a reason it pays. The definitions are in the section above.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence as A reason it pays or Not a reason it pays.",
          passLabel: PAYS,
          failLabel: NOT_PAYS,
          sentences: [
            {
              id: "walk",
              text: "Reach truck drivers spend most of each shift driving between the reserve racking and the pick faces.",
              fail: false,
              why: "Most of the labour is travel, which is one of the three conditions, so this is a reason it pays.",
            },
            {
              id: "cartons",
              text: "Nearly every case is one of three standard carton sizes.",
              fail: false,
              why: "Standard carton sizes are uniform units, so this is a reason it pays.",
            },
            {
              id: "competitor",
              text: "Our main competitor put in an automated system last year.",
              fail: true,
              why: "What a competitor did says nothing about your volume, your units, or your travel, so it is not a reason it pays.",
            },
            {
              id: "demo",
              text: "A supplier showed us a shuttle system at a trade show that looked impressive.",
              fail: true,
              why: "A product looking impressive is not a statement about your flow, so it is not a reason it pays.",
            },
          ],
          why: "That is right. The driving and the standard cartons are statements about travel and uniformity in this flow. The competitor and the trade show are reasons people talk about automation, not reasons it would pay here.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "The warehouse manager at Wren and Hale, a clothing retailer, is choosing where automation would pay. Choose the step where volume, uniformity, and travel come together.",
        leftLabel: "Step A",
        left: "Sorting single items from e-commerce returns, which arrive in any condition and are inspected one by one.",
        rightLabel: "Step B",
        right:
          "Moving cases of folded garments in a standard carton size from goods-in to the pick face, many times a day, across a long building.",
        correct: "right",
        why: "Step B has steady volume, because it happens many times a day. The cartons are a standard size, so they are uniform. Most of the effort is travel across a long building. All three conditions come together, which is where automation would pay.",
        wrong:
          "Step A varies with every item and needs a person to inspect each one, so it lacks uniformity, however much it is complained about. Look again for the step with steady volume, uniform units, and long travel.",
      },
      bridge:
        "Every system leaves some goods for people to handle, and the next lesson names the pile the automation will not touch.",
    },
    {
      id: "the-pile-it-will-not-touch",
      title: "The pile it will not touch",
      emphasis: "pile",
      place:
        "This lesson is the third module, The pile it will not touch. You have a step where automation would pay, and now you name the goods that step's system will leave behind. It is the part of the map that suppliers rarely draw.",
      sections: [
        {
          heading: "Every system has goods it cannot handle",
          paragraphs: [
            "Every piece of warehouse automation is designed for a range of goods, and every range has an edge. Common examples of goods outside the edge are oversized or overweight items, items in soft polythene bags, fragile items, damaged packaging, unreadable or missing labels, mixed pallets, and returns. A sorter designed for boxed parcels may reject a soft bag that folds over the edge of a tilt tray, and a tote store cannot hold an item longer than the tote.",
            "In this course, goods the system was designed to handle are Handled by the system. Goods it will reject, bypass, divert, or handle only under a condition are Left for people. When a proposal says a system handles something only when it is presented flat, labelled, or below a weight, the goods that do not meet the condition are left for people.",
          ],
        },
        {
          heading: "The pile is part of the design",
          paragraphs: [
            "What is left for people usually ends up in a pile, a cage, or a side lane, and it keeps needing space, labour, and management attention after the automation goes live. Someone has to decide where that lane is, how big it is at peak, which team works it, and how its goods rejoin the flow before the lorry leaves.",
            "The pile is not a sign that the system has failed. It is part of the design, and it has to be sized, located, and staffed like any other step. A proposal that does not describe its pile has not been finished, and a map that does not show the pile will surprise you on the first day, usually when the exception lane is full and the people who used to do that work have been moved elsewhere.",
          ],
          beforeAfter: {
            before: "The sorter handles our parcels.",
            after:
              "The sorter handles boxed parcels with a readable label up to 30 kilograms. Unlabelled parcels, parcels over 30 kilograms, and polybags that are not flat go to a manual lane beside door 6, worked by two people from the dispatch team on each shift.",
            reading:
              "The first version implies everything is handled. The second says what is handled, what is left for people, where it goes, and who deals with it.",
          },
        },
        {
          heading: "Reading a proposal for its pile",
          paragraphs: [
            "Read each sentence of a supplier proposal and ask which goods it describes, and whether those goods are handled by the system or left for people. Pay close attention to conditions. Words such as when, if, provided, within, and up to often mark the edge of the range, and whatever falls outside the condition is left for people.",
            "Then look for a summary sentence such as the system supports your full range. A sentence like that is neither handled nor left until you have checked it against the conditions stated elsewhere in the proposal. If the same document names an exception station, a bypass, or conventional shelving for some items, the full range includes a pile, whatever the summary says.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to count the pile as a small percentage and move on. A small share of lines can still be a large share of labour, because exceptions are handled one at a time by a person who has to read, judge, and decide. The share of lines in the pile tells you very little until you know how long each one takes.",
            "The second mistake is to leave the pile without a place or a team. Write down where the goods go and who handles them. If you cannot answer either, you have found a question for the supplier and a question for your own operation.",
          ],
        },
      ],
      workedExample: {
        title: "Priya reads a goods-to-person proposal",
        inputLabel: "The supplier's proposal",
        prompt:
          "The system stores and presents all standard totes. Items above the tote size are stored in conventional shelving. Items that fail the weight check are rejected to an exception station. The system supports your full range.",
        outputLabel: "Her marked reading",
        output:
          "'The system stores and presents all standard totes' is handled by the system. 'Items above the tote size are stored in conventional shelving' is left for people. 'Items that fail the weight check are rejected to an exception station' is left for people. 'The system supports your full range' is neither until it has been checked against the two sentences before it.",
        reading: [
          "The first sentence describes what the system was built for, standard totes, so those goods are handled by the system.",
          "The second and third sentences each describe a pile. Oversized items go to shelving and weight failures go to an exception station, and in both cases a person has to deal with them.",
          "The last sentence sounds as though everything is handled, but the proposal itself names two piles. Priya's next question is how many of her 20,000 SKUs are above tote size, which is a measured figure she can pull from the item master.",
        ],
      },
      practice: {
        intro:
          "Two suppliers have described the same mobile robot system for Brackley Home Goods. Choose the paragraph that describes its pile as this lesson taught. The section on reading a proposal is above if you want it.",
        check: {
          kind: "choose",
          prompt: "Choose the proposal paragraph that says what the system leaves for people.",
          leftLabel: "Proposal A",
          left: "Robots carry standard totes up to 25 kilograms between pick zones and packing. Items too long for a tote, and totes over 25 kilograms, are moved by the zone team on trolleys to a marked bay beside packing.",
          rightLabel: "Proposal B",
          right: "Robots carry your goods between pick zones and packing, supporting your full range with a flexible and scalable fleet.",
          correct: "left",
          why: "Proposal A says what the robots carry, names two kinds of goods they leave for people, and says where those goods go and who moves them. Proposal B claims the full range without saying where its edge is.",
          wrong:
            "Look again at Proposal B. Supporting your full range is a summary sentence, and it does not say which goods the robots cannot carry, where those go, or who moves them. Proposal A names the pile, the bay, and the team.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Here are sentences from a proposal for automated parcel sortation. Mark each one as Handled by the system or Left for people.",
        passLabel: HANDLED,
        failLabel: LEFT,
        sentences: [
          {
            id: "readable",
            text: "Parcels with a readable label and within the size limits are sorted to the carrier chute.",
            fail: false,
            why: "These are the parcels the sorter was designed for, so they are handled by the system.",
          },
          {
            id: "unlabelled",
            text: "Parcels with no readable label are diverted to a manual lane.",
            fail: true,
            why: "These parcels go to a manual lane, where a person has to deal with them, so they are left for people.",
          },
          {
            id: "heavy",
            text: "Items over 30 kilograms bypass the sorter.",
            fail: true,
            why: "Bypassing the sorter means these items are handled some other way, usually by people, so they are left for people.",
          },
          {
            id: "polybags",
            text: "Polybags are sorted when presented flat.",
            fail: true,
            why: "Read the condition. Polybags that are not presented flat will not be sorted, so some of them are left for people, and the next question is how many.",
          },
        ],
        why: "That is a careful reading. Only the labelled parcels within the size limits are handled by the system. The unlabelled parcels, the heavy items, and the polybags that are not flat are all left for people, and the polybag sentence hides its pile behind a condition.",
      },
      bridge:
        "The pile is one way automation leaves work behind, and the next lesson looks at the ways it can make the whole flow worse.",
    },
    {
      id: "where-it-makes-it-worse",
      title: "Where it makes the flow worse",
      emphasis: "worse",
      place:
        "This lesson prepares the part of the map that the course promise names directly. You have a step where automation would pay and the pile it leaves, and now you say where it would make the flow worse and how the goods keep moving when it does.",
      sections: [
        {
          heading: "Four ways a working system makes a flow worse",
          paragraphs: [
            "Automation can make a flow worse even when it works exactly as designed. The first way is rigidity. A sudden peak, a new product shape, or a change in order profile can be absorbed by extra people and trolleys, but a machine runs at its rated capacity and handles the units it was built for. When the business changes faster than the equipment, the equipment becomes the constraint.",
            "The second way is a single point of failure. When a sorter, a storage system, or the network that controls a robot fleet stops, every order that depends on it stops too. Before automation, one broken trolley slowed one picker. After it, one fault can hold the whole dispatch.",
            "The third way is a fixed layout. Conveyors, mezzanines, and storage grids are expensive to move, so changing the building later, adding a new flow, or giving floor space back costs far more than it did. The fourth way is concentrated exceptions. The pile from the last lesson can overwhelm a small team at peak, because all of the goods the system rejects arrive in one place at once.",
          ],
        },
        {
          heading: "What a fallback is",
          paragraphs: [
            "For each way automation could make the flow worse, a good map says what would happen and what the fallback is. A fallback is how the flow keeps going, at least partly, while the automation is down or overloaded. It says what people would do, with what equipment, and for how long, so that goods continue to reach the lorry.",
            "A fallback is not a hope. The supplier will fix it quickly, it should not happen, and we have a maintenance contract are statements about the repair. They do not say how the goods keep moving while the repair is under way. A fallback such as pickers push totes to packing on trolleys kept at each zone, enough to cover half a shift, describes what people would do.",
          ],
          beforeAfter: {
            before: "Makes it worse at: a sorter stop. Fallback: the supplier has a four-hour response time.",
            after:
              "Makes it worse at: a sorter stop, when no parcels reach the carrier cages. Fallback: the dispatch team hand-sorts to cages at the old benches, which are kept in place and set up for the three largest carriers.",
            reading:
              "The first fallback describes the repair. The second describes how parcels keep moving while the sorter is stopped, who does it, and where.",
          },
        },
        {
          heading: "Saying where it is worse is part of the case",
          paragraphs: [
            "Saying where automation makes a flow worse is not the same as arguing against it. It is how you make sure the design includes the answers before the contract is signed, when changes are cheap, rather than after go-live, when they are not. A supplier who sees these points on your map can price the fallback into the proposal.",
            "Some of what you write here will send you back to earlier lessons. A rigidity risk at peak often leads to the assumed peak figure from lesson 2. A concentrated exceptions risk leads to the pile from lesson 4. That is a sign the map is working, because each part is testing the others.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to leave this part out because it feels negative, or because the supplier's proposal does not mention it. The proposal is written to sell the system. Your map is written to run the flow, and the flow has to keep going on the day the system stops.",
            "The second mistake is to write a risk without a fallback. A list of things that could go wrong is useful for a meeting, but it does not tell the shift manager what to do at 3am when the robots stop. Every risk on the map needs a line that says how the goods keep moving.",
          ],
        },
      ],
      workedExample: {
        title: "Priya adds the risks to her option",
        inputLabel: "Her option before",
        prompt: "Goods-to-person for small items.",
        outputLabel: "What she added to the map",
        output:
          "Makes it worse at: peak, if the system's hourly capacity is below the peak we have not yet measured; a stop of the system, when no small items can be picked at all; new product shapes above tote size, which go to shelving. Fallback: keep a manual pick face for the fastest-moving items, sized to cover a stop of half a shift; measure last November's peak before sizing.",
        reading: [
          "Priya names three ways the system could make the flow worse: rigidity at peak, a single point of failure when the system stops, and new shapes that end up in the pile.",
          "The fallback says what people would do. A manual pick face for the fastest movers lets the pick team keep going through a stop of half a shift, which is a statement about goods moving rather than about the repair.",
          "None of these risks is a reason to stop. Each has become a design requirement, and the first one sends Priya back to measure the peak she marked as assumed in lesson 2.",
        ],
      },
      practice: {
        intro:
          "A map note for an automated tote store says the store could stop during a software update. Choose the fallback that says how the goods keep moving. The section on what a fallback is sits above.",
        check: {
          kind: "choose",
          prompt: "Choose the fallback for a stop of the tote store during a software update.",
          leftLabel: "Fallback A",
          left: "Fallback: updates are scheduled carefully and the supplier has said a stop should not happen.",
          rightLabel: "Fallback B",
          right: "Fallback: the pick team works from the overflow shelving by goods-in, which holds a day's stock of the 200 fastest-moving lines.",
          correct: "right",
          why: "Fallback B says what people would do and where, with enough stock to keep orders moving while the store is stopped. Fallback A is a hope about the update, and it says nothing about the goods.",
          wrong:
            "Look again at Fallback A. Careful scheduling and a supplier's assurance describe the update, not how orders keep moving if the store stops anyway. Fallback B names the shelving, the stock, and the team.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "This map note for a mobile robot system at Brackley Home Goods says what goes wrong but is missing a part the lesson named. Edit the note so it has a fallback that says what people would do to keep the totes moving. Keep the robots and the outage in the note.",
        label: "The map note you are editing",
        start:
          "Mobile robots carry totes from pick zones to packing. Makes it worse at: a network outage, when robots stop and totes stay in the pick zones.",
        unchanged:
          "You have not changed the note yet. Add a line that begins Fallback and says what people would do to get the totes to packing while the robots are stopped.",
        keep: [
          {
            id: "robots",
            any: ["robot"],
            missing: "Keep the robots in the note. It should still say that mobile robots carry totes from the pick zones to packing.",
          },
          {
            id: "outage",
            any: ["outage", "network"],
            missing: "Keep the risk in the note. It should still say that a network outage stops the robots.",
          },
        ],
        limits: [
          {
            id: "fallback",
            any: ["fallback", "fall back"],
            missing:
              "Your note says what would happen during an outage but not how the flow keeps going. Add a line that begins Fallback.",
          },
          {
            id: "people",
            any: [
              "trolley",
              "push",
              "by hand",
              "hand-carry",
              "manual",
              "pickers",
              "staff",
              "team",
              "walk",
              "cart",
              "cage",
              "operative",
            ],
            missing:
              "Your fallback does not yet say what people would do. A fallback such as the supplier will fix it or it should not happen describes the repair. Say how people would move the totes, for example on trolleys kept at each zone.",
          },
        ],
        limitWording: false,
        why: "That repair works. The note still says what the robots do and what goes wrong in an outage, and it now says how people keep the totes moving to packing while the robots are stopped.",
        result: {
          label: "The note as it would sit on the map",
          text: "Mobile robots carry totes from pick zones to packing. Makes it worse at: a network outage, when robots stop and totes stay in the pick zones. Fallback: pickers push totes to packing on trolleys, which are kept at each zone and cover a stop of half a shift.",
        },
      },
      bridge:
        "You now have every part of the method. The next lesson tests it across situations you have not seen, before you write your own map in the last lesson.",
    },
    {
      id: "course-assessment",
      title: "The course assessment",
      emphasis: "assessment",
      place:
        "This is the second-to-last lesson. It sets out the whole method in one place, works one mixed example, and then asks you to apply the method to seven situations you have not seen before. You need six of the seven to pass.",
      sections: [
        {
          heading: "The method in one place",
          paragraphs: [
            "The method has five moves, and each one answers a question a supplier or a finance director will ask. First, choose one goods flow and write it as steps from arrival to dispatch, marking where the unit of handling changes. Second, put figures against the flow and mark each one measured or assumed, naming the record and the period for every measured figure.",
            "Third, find the step where steady volume, uniform units, and travel come together, and check that it is the step that constrains the flow. Fourth, name the pile the system will not touch, with where those goods go and who handles them. Fifth, say where automation would make the flow worse, through rigidity, a single point of failure, a fixed layout, or concentrated exceptions, and write a fallback for each that says what people would do.",
          ],
        },
        {
          heading: "How the moves test each other",
          paragraphs: [
            "The moves are not a checklist to complete once. Each one tests the others. A pile you name in the fourth move may turn out to be larger than you thought once you measure it, which changes whether the third move still holds. A peak you marked assumed in the second move becomes the first question when the fifth move shows that the system could be undersized.",
            "In the assessment, several situations will look as if they are about one move but will turn on another. Read each situation for the figure that has not been checked, the step that is not the constraint, or the risk that has no fallback. The right option is always the one a careful practitioner would choose on the day, with the evidence they have.",
          ],
        },
        {
          heading: "How the assessment works",
          paragraphs: [
            "Each question gives you a short situation from a warehouse or a transport operation and three or four things a reasonable professional might do. Exactly one of them follows the method this course has taught. When you submit, each question shows whether your choice was right and why, and the result states your score against the pass mark of six out of seven.",
            "If you do not reach six, you stay on this lesson. The feedback for each question you missed names the move you need to look at again, and you can change your answers and submit again.",
          ],
        },
      ],
      workedExample: {
        title: "A mixed case from a pet supplies warehouse",
        inputLabel: "The situation",
        prompt:
          "Callum Reid manages the Fernside Pet Supplies warehouse in Swindon. A supplier has proposed a conveyor and sorter for outbound parcels, sized to 'about 5,000 parcels a day, rising to 9,000 at Christmas'. Bags of dry food up to 15 kilograms make up a large part of the orders. The packing team currently waits for totes from picking for part of every shift.",
        outputLabel: "What Callum wrote back",
        output:
          "Flow: e-commerce orders, receive pallets, put away, pick to tote, pack, sort by carrier, dispatch. The 5,000 figure is measured from our carrier manifests for the last year, but the 9,000 at Christmas is assumed and must be measured before any sizing. Packing waits for picking, so picking is the constraint, and a sorter after packing would not shorten dispatch times. Bags of dry food are soft and heavy, so the proposal needs to say whether they are sorted or left for people, and where they go. Before we go further, please size against our measured Christmas peak and tell us how a sorter stop would be covered.",
        reading: [
          "Callum used every move. He wrote the flow, separated the measured daily figure from the assumed peak, and noticed from the idle packing team that picking, not sortation, is the constraint.",
          "He read the proposal for its pile and found the soft, heavy bags that a sorter may not handle, and he asked where they would go.",
          "His last sentence asks for a fallback and for sizing against a measured peak, which are the two questions a supplier has to answer to stay in the conversation.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, try one short judgement. Two readings of the same proposal have been written. Choose the one that follows the method.",
        check: {
          kind: "choose",
          prompt:
            "A supplier proposes automated storage for a spare parts warehouse, sized to the budgeted volume for next year. Choose the reading that follows the method.",
          leftLabel: "Reading A",
          left: "The budgeted volume is assumed, because a budget is a forecast rather than a record. Before sizing, we should pull last year's picks by week from the warehouse management system and give the supplier the measured peak.",
          rightLabel: "Reading B",
          right: "The budgeted volume has been signed off by the finance director, so it is a reliable figure to size the storage against.",
          correct: "left",
          why: "Reading A marks the budgeted figure as assumed, because a budget records what someone expects rather than what happened, and it names the record to measure instead. Reading B treats approval as if it were measurement.",
          wrong:
            "Look again at Reading B. A signed-off budget is still a forecast, so the figure is assumed. Reading A names the record and the period that would make it measured.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. Each one draws on a different part of the method, and some draw on more than one.",
        passMark: 6,
        questions: [
          {
            id: "which-flow",
            situation:
              "Hannah Okoro has just joined Marlow Cold Chain as operations manager at its Doncaster site. On her second day the operations director asks her to prepare an automation note for a supplier meeting in three weeks. The site handles chilled store orders, frozen store orders, and a small online grocery flow.",
            question: "What should Hannah put on paper first?",
            options: [
              {
                id: "a",
                text: "A description of the whole site, with every area, every order type, and the total number of SKUs.",
                feedback:
                  "A whole-site description cannot be mapped on one page and does not follow any goods, so it gives the supplier nothing to respond to. Start with one flow written as steps.",
              },
              {
                id: "b",
                text: "The chilled store orders flow as steps from arrival to dispatch, with the points where pallets become cases and cases go onto roll cages.",
                correct: true,
                feedback:
                  "Yes. One flow, written as steps with its unit changes marked, is something she can put figures against and test, and it fits on one page.",
              },
              {
                id: "c",
                text: "The site layout drawing from facilities, marked with where the doors and the racking are.",
                feedback:
                  "The layout shows where things are, not what happens to the goods. It will be useful later, but the automation questions are about the flow. Write one flow as steps first.",
              },
              {
                id: "d",
                text: "A list of the automation products the supplier has already sent, with a note on which ones look promising.",
                feedback:
                  "Starting from the products lets the supplier decide what the problem is. Start from one flow of your own, and let the products answer it later.",
              },
            ],
          },
          {
            id: "peak-figure",
            situation:
              "A supplier has sized a sorter for Tamar Parcels at three times the normal daily volume for Christmas. When Owen Pryce asks where the multiple came from, the sales director says it is what he remembers from last year. The carrier manifests for every day of last December are held in the transport system.",
            question: "What should Owen do before the sizing is agreed?",
            options: [
              {
                id: "a",
                text: "Accept the figure, because the sales director knows the business and three times is a sensible margin.",
                feedback:
                  "The figure comes from memory, so it is assumed however experienced the person is, and it is the peak the sorter must be sized for. Measure it from the manifests before agreeing.",
              },
              {
                id: "b",
                text: "Ask the supplier to add a safety margin of its own on top of the three times figure.",
                feedback:
                  "A margin on top of an assumed figure is still an assumed figure, and it may make the sorter too large or still too small. Measure the peak from the manifests first.",
              },
              {
                id: "c",
                text: "Mark the three times figure as assumed and pull last December's daily totals from the carrier manifests to give the supplier a measured peak.",
                correct: true,
                feedback:
                  "Yes. The record exists, so the peak can be measured with its period stated, and the sorter can be sized to what actually happened rather than to a memory.",
              },
            ],
          },
          {
            id: "loud-step",
            situation:
              "At the Northgate Homeware warehouse, the returns bench is the subject of every shift briefing, with opened boxes and missing labels piling up. Separately, the warehouse management system shows that pickers spend most of each shift walking between bays to pick boxed items in a few standard sizes, at a steady rate through the day. The general manager wants a recommendation for where automation would pay.",
            question: "Which step should the recommendation point to?",
            options: [
              {
                id: "a",
                text: "Picking, because the volume is steady, the items are boxed in standard sizes, and most of the labour is walking.",
                correct: true,
                feedback:
                  "Yes. Picking is where volume, uniformity, and travel come together. Returns needs attention, but its variety means a different answer.",
              },
              {
                id: "b",
                text: "Returns, because it causes the most complaints and so will give the biggest improvement in morale.",
                feedback:
                  "Complaints show where there is pain, not where a machine would pay. Returns varies with every item and needs inspection, so it lacks uniformity. Look for the step where volume, uniformity, and travel come together.",
              },
              {
                id: "c",
                text: "Both steps equally, so that the proposal covers every problem the site has.",
                feedback:
                  "Treating both steps the same ignores what the flow shows. Returns lacks uniformity and picking has all three conditions. Point to the step where they come together and give returns a different answer.",
              },
            ],
          },
          {
            id: "constraint",
            situation:
              "At Fernside Pet Supplies, the packing team stands idle for part of every shift waiting for totes to arrive from picking. A supplier has proposed an automatic bagging machine that would make packing twice as fast. Dispatch cut-off is regularly missed on busy days.",
            question: "What is the best response to the bagging proposal?",
            options: [
              {
                id: "a",
                text: "Buy the bagging machine, because faster packing will bring orders to the lorry sooner.",
                feedback:
                  "Packing already waits for picking, so it is not the constraint. A faster bagger would only lengthen the idle time at packing. Look at the step where goods queue.",
              },
              {
                id: "b",
                text: "Hold the bagging proposal and look first at picking, because packing waits for picking and so picking is the step that constrains dispatch.",
                correct: true,
                feedback:
                  "Yes. Speeding up a step that is not the constraint only moves the queue. The idle packing team shows that picking is where the flow cannot keep up.",
              },
              {
                id: "c",
                text: "Buy the bagging machine and move some packers to picking, so both steps improve at once.",
                feedback:
                  "Moving packers may help picking, but the bagger itself still speeds up a step that is waiting. Deal with the constraint, picking, and leave packing until it becomes the step that queues.",
              },
              {
                id: "d",
                text: "Ask the supplier for a faster bagging machine, because twice as fast may not be enough on busy days.",
                feedback:
                  "A faster machine at packing still waits for totes from picking. The problem is upstream. Look at picking, where the goods queue.",
              },
            ],
          },
          {
            id: "full-range",
            situation:
              "A proposal for a tote-based storage system at Hollins Health and Beauty says the system handles 95 per cent of order lines, and later says that items above tote size and items that fail the weight check go to an exception station. It does not say how big the station is or who works it. The operations director asks Priya whether the proposal is complete.",
            question: "What should Priya tell the operations director?",
            options: [
              {
                id: "a",
                text: "The proposal is complete, because 95 per cent of lines is close enough to the full range to go ahead.",
                feedback:
                  "The remaining lines are a pile, and a small share of lines can be a large share of labour because exceptions are handled one at a time. The proposal needs to size and staff the pile before it is complete.",
              },
              {
                id: "b",
                text: "The proposal is complete for the system, and the exception station is an operational detail to sort out after go-live.",
                feedback:
                  "The pile is part of the design, not a detail for later. After go-live the space and the people may no longer be available. It needs a size, a place, and a team now.",
              },
              {
                id: "c",
                text: "The proposal is not finished, because it names a pile but does not say how much goes there at peak, where the station sits, or which team handles it.",
                correct: true,
                feedback:
                  "Yes. A proposal that does not describe its pile has not been finished. The next step is to measure how many SKUs are above tote size and ask the supplier to size the station against that.",
              },
            ],
          },
          {
            id: "fallback",
            situation:
              "Wren and Hale is planning a single sorter that will send every outbound parcel to its carrier cage. The draft map says: 'Makes it worse at: a sorter stop, when no parcels reach the cages. Fallback: the supplier offers a four-hour engineer response.' The old manual sort benches are due to be removed to make room for the sorter.",
            question: "What should the fallback line say instead?",
            options: [
              {
                id: "a",
                text: "Fallback: the supplier offers a two-hour engineer response under a premium contract.",
                feedback:
                  "A faster response still describes the repair, not how parcels reach the cages while the sorter is stopped. A fallback says what people would do.",
              },
              {
                id: "b",
                text: "Fallback: keep two of the manual sort benches in place, and the dispatch team hand-sorts to cages for the largest carriers during a stop.",
                correct: true,
                feedback:
                  "Yes. This says how the goods keep moving, who does it, and with what, and it keeps the benches the plan was about to remove.",
              },
              {
                id: "c",
                text: "Fallback: sorter stops are rare, so no separate arrangement is needed.",
                feedback:
                  "A stop being rare is a hope, not a fallback, and a single sorter holds every parcel when it does stop. Say what people would do to keep parcels moving.",
              },
            ],
          },
          {
            id: "supplier-meeting",
            situation:
              "Hannah Okoro has finished her map for Marlow Cold Chain. At the supplier meeting the account manager opens with a brochure and a case study from another grocer, and suggests a system that the case study says doubled throughput. Hannah's map shows that her peak has now been measured and that the pile of mixed cases has no agreed home.",
            question: "What should Hannah do in the meeting?",
            options: [
              {
                id: "a",
                text: "Let the supplier present the case study first, then decide whether the system suits her site.",
                feedback:
                  "The case study describes someone else's flow and figures. Starting from it lets the supplier set the terms. Put your own map on the table and ask them to respond to it.",
              },
              {
                id: "b",
                text: "Ask the supplier for the throughput figures from the case study so she can compare them with her own.",
                feedback:
                  "Another grocer's throughput is an assumed figure for your site. The useful question is how the system performs against your measured peak and your pile.",
              },
              {
                id: "c",
                text: "Accept the suggested system, since doubling throughput would cover her measured peak with room to spare.",
                feedback:
                  "A claim from a case study is assumed for your site, and it says nothing about the mixed cases. Ask the supplier to respond to your map first.",
              },
              {
                id: "d",
                text: "Put her map on the table and ask the supplier for hourly capacity at her measured peak and for where the mixed cases would go and who would handle them.",
                correct: true,
                feedback:
                  "Yes. The map turns the meeting into a response to her flow. A supplier has to answer the peak and the pile to stay in the conversation.",
              },
            ],
          },
        ],
        why: "You applied the method across situations you had not seen. You kept to one flow, measured the peak instead of trusting memory, chose the step where the conditions come together and that constrains the flow, treated the pile as part of the design, wrote fallbacks that keep goods moving, and used your own map to lead a supplier meeting.",
      },
      bridge:
        "You have shown you can apply the method to other people's flows. In the last lesson you write the map for a flow on your own site, and that map is the work your record will show.",
    },
    {
      id: "the-map",
      title: "The map",
      emphasis: "map",
      place:
        "This is the last lesson and the fourth module, The map. You bring every move together on one page about one flow on your own site, and that page is the work your record will show.",
      sections: [
        {
          heading: "Six parts on one page",
          paragraphs: [
            "The map is one page about one goods flow, and it has six parts. The first is the flow as a sequence of steps, with the unit changes marked. The second is the figures, each one marked measured or assumed, with the record and the period for every measured figure. The third is the step where automation would pay and why, in terms of volume, uniformity, and travel.",
            "The fourth is the pile the system will not touch, with where those goods go and who handles them. The fifth is where automation would make the flow worse, with a fallback for each risk that says what people would do. The sixth is the next measurement to take or the next question to put to a supplier.",
          ],
        },
        {
          heading: "Ready for the supplier meeting",
          paragraphs: [
            "The map is written so that you can put it on the table at a supplier meeting and ask them to respond to it, rather than responding to their brochure. In this lesson, a line is Ready for the supplier meeting when a supplier would have to answer it with a figure, a place, or a commitment. Pick is the constraint because most labour is walking between 40 bays is ready. Every assumed figure with its gap admitted is ready too, because it tells the supplier what you will be checking.",
            "A line is A supplier could talk past it when it is general enough that any system could be said to meet it. We need something efficient and flexible is one of those. So is a pile described as exceptions, handled as needed, because it says neither where they go nor who handles them.",
          ],
        },
        {
          heading: "Keep it to what is true on your site",
          paragraphs: [
            "Use a flow you know and figures you can stand behind. Where you do not yet have a figure, write it as assumed and say what you would measure. An honest gap is more useful to a supplier, and to your own manager, than a confident figure nobody can trace.",
            "The record will show the map exactly as you write it to anyone who opens the reference, so leave out customer names, contract prices, or anything else your organisation would not want shown. Replace them with a realistic description that keeps the same shape. The record states that this is the goods flow map you wrote in this course. It is not a system design, a safety assessment, or a recommendation to buy any product.",
          ],
        },
        {
          heading: "How the map is checked",
          paragraphs: [
            "When you continue, each part is checked in turn. The flow must mark where the unit of handling changes. The figures must include at least one number or named record and use the words measured or assumed. Where it pays must give its reason in terms of volume, uniformity, travel, or the constraint. The pile must say who handles the goods it leaves, such as a team, a station, or people in a manual lane.",
            "Where it makes the flow worse must include a fallback. The next part must name a measurement to take or a question to ask. If a part is missing, the note names it and says what to add. When every part is present, you can sign your name against the map.",
          ],
        },
      ],
      workedExample: {
        title: "Priya's map, in text form",
        inputLabel: "The flow she chose",
        prompt: "E-commerce small items at the Hollins Health and Beauty distribution centre, Daventry.",
        outputLabel: "The map she took to the supplier meeting",
        output:
          "Flow: receive pallets, break to cases, put away, pick singles to tote, pack to mailer, sort by carrier, dispatch. Unit changes at put-away, pick, and pack.\nFigures: daily average 8,000 items, measured, twelve months of warehouse management system data; peak assumed, to be measured from November; 20,000 SKUs, measured, with a third slow-moving.\nPays at: picking, because most labour there is travel, the volume is steady, and items are mostly boxed.\nPile: items above tote size go to shelving and weight failures go to an exception station, both handled by the pick team.\nWorse at: peak if undersized; a full stop if the system stops; new large items. Fallback: a manual pick face for the fastest movers, worked by the pick team for up to half a shift.\nNext: measure the November peak and pull item dimensions, then ask each supplier for hourly capacity at that peak.",
        reading: [
          "The map is short, and every line is either a fact with its source or an admitted gap. A supplier cannot answer it with a brochure.",
          "Each part does one job. The flow shows the unit changes, the figures show which ones can be trusted, and the paying step is justified by travel, volume, and uniformity rather than by a complaint.",
          "The pile, the risks, and the fallback show what the system would leave and how the flow keeps going without it. The last line gives the meeting its first question, and a supplier has to answer the peak question to stay in the conversation.",
        ],
      },
      practice: {
        intro:
          "Before you write your own map, read these lines from a draft map for a spare parts flow and mark each one. You will use the same test on your own map in a moment.",
        check: {
          kind: "mark",
          prompt: "Mark each line as Ready for the supplier meeting or A supplier could talk past it.",
          passLabel: READY,
          failLabel: IGNORE,
          sentences: [
            {
              id: "pays",
              text: "Pays at: case replenishment, because reach truck drivers spend most of each shift travelling between reserve and pick faces.",
              fail: false,
              why: "This names the step and gives the reason in terms of travel, so a supplier would have to answer it.",
            },
            {
              id: "pile",
              text: "Pile: exceptions, handled as needed.",
              fail: true,
              why: "This does not say which goods are left, where they go, or who handles them, so a supplier could talk past it.",
            },
            {
              id: "figures",
              text: "Figures: 1,400 order lines a day, measured, warehouse management system, last six months; peak assumed, to be measured.",
              fail: false,
              why: "The figure names its record and period, and the gap in the peak is admitted, so this is ready for the meeting.",
            },
            {
              id: "worse",
              text: "Worse at: we need the system to be efficient and flexible.",
              fail: true,
              why: "Efficient and flexible could describe any system, and there is no risk or fallback here, so a supplier could talk past it.",
            },
          ],
          why: "That is right. The paying step and the figures give a supplier something specific to answer. The pile and the worse lines are general enough that any system could be said to meet them.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the one-page map for one goods flow on your site. Each part has to be something you could put in front of a supplier and expect an answer to.",
        fields: [
          {
            id: "flow",
            label: "The flow and its unit changes",
            hint: "One kind of goods, as steps from arrival to dispatch, and where the unit of handling changes, for example pallet to case at put-away.",
            min: 60,
            any: ["unit", "changes from", "broken into", "break to", "breaks into", "pallet to", "case to", "carton to", "tote to", "to parcel"],
            missing:
              "Your flow does not mark any unit change. Say where the unit of handling changes, for example pallet to case at put-away or single items to parcel at packing.",
          },
          {
            id: "figures",
            label: "Figures, measured or assumed",
            hint: "Volumes, the peak, the number of items, and sizes, each marked measured or assumed, with the record and period for measured figures.",
            min: 40,
            rule: "fact",
            any: ["measured", "assumed"],
            missing:
              "Some of your figures are not marked measured or assumed, or no figure is given. Give at least one figure and mark each one, naming the record and period for any figure you call measured.",
          },
          {
            id: "pays",
            label: "Where it pays and why",
            hint: "The step where automation would pay, with the reason in terms of volume, uniformity, travel, or the constraint.",
            min: 40,
            any: ["volume", "uniform", "travel", "walk", "driving", "constraint", "bottleneck", "queue", "standard size", "standard carton"],
            missing:
              "Your where it pays part does not give a reason in terms of volume, uniformity, or travel. Say which of those the step has, or that it is the step that constrains the flow.",
          },
          {
            id: "pile",
            label: "The pile it will not touch",
            hint: "The goods the system would leave for people, where they would go, and who would handle them.",
            min: 40,
            any: ["team", "people", "person", "staff", "operator", "operative", "supervisor", "pickers", "packers", "manual", "station", "left for", "by hand"],
            missing:
              "Your pile part does not say where the goods go or who handles them. Name the goods, the place they go, and the team or people who deal with them.",
          },
          {
            id: "worse",
            label: "Where it makes the flow worse, and the fallback",
            hint: "At least one way automation could make the flow worse, and a fallback that says what people would do to keep goods moving.",
            min: 50,
            any: ["fallback", "fall back"],
            missing:
              "Your worse part has a risk without a fallback. Add a line that begins Fallback and says how people would keep the goods moving while the system is down or overloaded.",
          },
          {
            id: "next",
            label: "Next measurement or question",
            hint: "One figure to measure next, or one question to put to a supplier.",
            min: 20,
            any: ["measure", "pull", "count", "time study", "ask", "question", "capacity", "confirm", "check"],
            missing:
              "Your next part does not yet name a measurement or a question. Say what you will measure next, or what you will ask each supplier to answer.",
          },
        ],
        why: "Your map follows one flow and marks its unit changes, is honest about which figures are measured and which are assumed, says where automation would pay and why, names the pile and who handles it, gives a fallback for the way it could make things worse, and ends with a next step a supplier has to answer.",
      },
      bridge:
        "Your map is ready. Sign your name below, and the record will show this map, the course, and the date to anyone who opens the reference.",
    },
  ],
};
