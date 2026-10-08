/*
Course: Robotics for Non-Engineers
Slug: robotics-for-non-engineers
For: Managers, planners, finance partners, and team leaders who have been asked whether a robot could do part of a
  process they own or oversee. They know the process well enough to describe it step by step and can find out how
  often it runs and what goes wrong. They know nothing about robots and are not asked to become engineers.
Outcome: The learner takes one process they own, describes the step a robot might take in terms of what repeats and
  what varies, names what a robot cannot do there and what is only claimed, names the exception that decides the case
  and who handles it, names who owns the stop, and writes a one-page brief that ends with go or not yet and the
  evidence that would change that decision. A manager can read the brief and watch the decision being defended.
Artefact: The go or not-yet brief, written in nine labelled parts.
Record sentence: Wrote and signed a go or not-yet brief for one process, naming the exception that decides the case,
  who owns the stop, and the evidence that would change the decision.
Why it is worth paying for: Most first conversations about robots start with a supplier's demonstration and end with a
  decision nobody can defend. A seat on this course gives a manager one page, about one real process, that states what
  a robot could take, what it could not, which exception decides the case, and what evidence is still missing. That
  page is the thing a finance partner or an operations director needs before any money is spent on a study or a trial.
Lessons (id, title, move, interaction, pass rule):
  1. what-a-robot-does, What a robot actually does, split a task into steps that repeat and steps that vary,
     mark with Repeats and Varies, every sentence marked correctly.
  2. what-it-could-take, What it could take, apply the three conditions for a candidate step, practice mark with
     Could take and Not a candidate yet, check choose between two steps, the step that meets all three conditions.
  3. what-it-cannot-do, What it cannot do, and what has not been shown, separate a claim from evidence on your own
     parts, practice choose, check mark with Shown on our parts and Claimed, not yet shown, every sentence correct.
  4. the-exception, The exception that decides the case, write an exception with what it is, how often, and who
     handles it, practice choose, check edit, the edited note contains a frequency or "not yet measured" and a named
     role, and still names the mixed bin.
  5. go-or-not-yet, Go or not yet, write a decision that states its reason in the terms of the process, practice mark
     with Go and Not yet, check choose, the decision that names the facts, the evidence, the handlers, and the owner.
  6. course-assessment, Judge a new case from start to finish, apply every move to unseen situations, scenario of six
     questions, five of six correct.
  7. the-brief, Write the go or not-yet brief, produce the artefact, build of nine fields, each field has an `any`
     list or a rule and a missing sentence: process names a step, repeats and varies each contain a word of their
     kind, the limit field names a cannot or a claim, the exception gives a frequency or "not yet measured", the
     handler names a role, the stop owner names a role or "not yet named", the decision starts with go or not yet,
     and the change field states a condition.
Sources: International Federation of Robotics, World Robotics reports and public summaries, for common applications.
  UK Health and Safety Executive web guidance on industrial robots and on the Provision and Use of Work Equipment
  Regulations 1998, for why the space around a robot has to be made safe. ISO 10218-1 and ISO 10218-2, named so the
  learner knows they exist and that an integrator works to them. Mike Rother and John Shook, Learning to See (Lean
  Enterprise Institute), for describing a process step by step before changing it. Manufacturer application pages
  from ABB, FANUC, KUKA, and Universal Robots, read as claims until shown on your parts. No figures are cited from
  any source. Every number in a worked example belongs to that example.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const REPEATS = "Repeats";
const VARIES = "Varies";
const SHOWN = "Shown on our parts";
const CLAIMED = "Claimed, not yet shown";

const ROLE_WORDS = [
  "manager",
  "leader",
  "lead",
  "supervisor",
  "engineer",
  "controller",
  "setter",
  "team",
  "operator",
  "planner",
  "head of",
  "director",
  "officer",
  "technician",
  "picker",
  "packer",
  "clerk",
  "coordinator",
  "driver",
  "owner",
];

export const COURSE: CourseContent = {
  slug: "robotics-for-non-engineers",
  hours: 2.5,
  artefact: {
    lessonId: "the-brief",
    title: "The go or not-yet brief",
    recordLine:
      "Wrote and signed a go or not-yet brief for one process, naming the exception that decides the case, who owns the stop, and the evidence that would change the decision.",
  },
  lessons: [
    {
      id: "what-a-robot-does",
      title: "What a robot actually does",
      emphasis: "robot",
      place:
        "This is the first of seven lessons. It gives you the two words the rest of the course uses to describe any task, which are what repeats and what varies.",
      sections: [
        {
          heading: "A machine that repeats a motion",
          paragraphs: [
            "An industrial robot is a machine that moves through positions it has been programmed to reach, and it does the same thing each time it is told to. It is very good at repeating a motion precisely, at speed, and for long periods, on parts that arrive in the same place and the same orientation. Moving a moulded part from a machine to a conveyor, stacking cartons on a pallet in a fixed pattern, and moving tubes from one rack to another are all tasks of that kind.",
            "The International Federation of Robotics publishes an annual report, World Robotics, that describes where industrial robots are installed and what they are used for. If you read its public summaries, you will see the same kinds of task again and again: handling, welding, assembly, and palletising. What those tasks have in common is not that they are difficult. It is that the same motion happens on the same kind of part, many times a day.",
          ],
        },
        {
          heading: "What a robot is not",
          paragraphs: [
            "A robot is not a general worker that looks at a situation and works out what to do. When a robot appears to adapt, for example by picking a part it has located with a camera, it is still following rules that someone set up for a known range of cases. Inside that range it can be fast and reliable. Outside that range it stops, or it makes a mistake, and it does not know that it has made one.",
            "This matters because a person doing the same task is quietly handling cases outside the normal range all day. They notice a torn label, they turn a part the right way up, and they put a damaged carton to one side. None of that appears in the job description, and none of it happens automatically when a robot takes over the motion. So the first question about any task is not whether a robot is clever enough. The first question is how much of the task repeats in exactly the same way, and how much varies from one time to the next.",
          ],
        },
        {
          heading: "Two words for every step",
          paragraphs: [
            "In this course, every step of a task is described with one of two words. A step repeats when the part, the position, and the action are the same each time. The part is the thing being handled, such as a carton, a tray, or a tube. The position is where it arrives and which way round it is. The action is what is done to it. If all three are the same every time, the step repeats.",
            "A step varies when any of those three changes in a way that a person currently notices and handles. A date that changes on every delivery varies, because someone reads it and judges it. A tray that has slipped in transit varies, because it is no longer where the normal layout puts it. A step can involve the same movement as yesterday and still vary, because what matters is whether someone is noticing a difference and dealing with it.",
            "The two labels you will use on the buttons are Repeats and Varies, and they mean exactly what this section says. Write each step of the task as one plain sentence, then give each sentence one label. When a sentence contains both, split it into two sentences, because the split is usually where the interesting part of the task hides.",
          ],
          beforeAfter: {
            before: "The packer loads pallets all day and deals with any problems.",
            after:
              "Cartons arrive on the conveyor one at a time in three fixed sizes. The packer lifts each carton onto the pallet in the same pattern. About once an hour a carton arrives with a split corner, and the packer puts it aside.",
            reading:
              "The first version hides the exception inside the words any problems. The second version gives two sentences that repeat and one that varies, and the one that varies is the sentence a robot would not handle on its own.",
          },
        },
        {
          heading: "Why this matters at work, and the usual mistake",
          paragraphs: [
            "When someone asks whether a robot could do part of your process, they are usually picturing the normal case, because that is what they see when they walk past. The decision about the robot is made in the steps that vary, because those are the steps it will not handle unless someone designs for them. A description that separates the two gives everyone in the room the same picture, including the people who have never stood at the line.",
            "The usual mistake is to describe the task at the level of the job title, such as the packer packs or the technician loads the analyser. At that level every task sounds as if it repeats. Describe it instead the way you would explain it to a new starter on their first morning, one sentence per action, including the things they must look out for. The things they must look out for are almost always the steps that vary.",
          ],
        },
      ],
      workedExample: {
        title: "The end of a packing line at Calder Distribution",
        inputLabel: "The site manager's description",
        prompt:
          "Sealed cartons come down the conveyor one at a time, always the same three sizes. A packer lifts each carton onto a pallet in a fixed pattern. About once an hour a carton arrives with a split corner and the packer puts it aside. When a pallet is full the packer calls a forklift driver.",
        outputLabel: "The description, marked step by step",
        output:
          "Sealed cartons come down the conveyor one at a time, always the same three sizes: Repeats.\nA packer lifts each carton onto a pallet in a fixed pattern: Repeats.\nAbout once an hour a carton arrives with a split corner and the packer puts it aside: Varies.\nWhen a pallet is full the packer calls a forklift driver: Repeats in its timing, but it involves another person, so it is noted separately.",
        reading: [
          "Joanne Firth, the site manager, wrote four sentences, and each one describes a single action. That is why they can be marked at all. If she had written that the packer palletises the output, there would have been nothing to mark.",
          "Most of this task repeats, which is why palletising is one of the common robot applications. The cartons, their positions, and the stacking pattern are the same every time. The once-an-hour figure is Joanne's own estimate and belongs to this example.",
          "The split carton is the step that varies. The packer handles it without thinking about it, and a robot would not notice a split corner unless something was added to detect it. That single sentence is where the rest of this course will spend its attention.",
        ],
      },
      practice: {
        intro:
          "Here is a short description of the post room at a housing association. Mark each sentence with Repeats or Varies. The section on the two words and the worked example are still above you. Afterwards, write four or five sentences about a task you own in the same way, because you will use it in every lesson that follows.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence of the post room description with Repeats or Varies.",
          passLabel: REPEATS,
          failLabel: VARIES,
          sentences: [
            {
              id: "franking",
              text: "Each morning the franking machine is loaded with the same size of envelope from the same tray.",
              fail: false,
              why: "The envelope, where it comes from, and what is done with it are the same every morning, so this step repeats.",
            },
            {
              id: "handwritten",
              text: "Letters with handwritten addresses are read by the clerk, who decides which department they belong to.",
              fail: true,
              why: "The clerk is reading an address that is different on every letter and making a judgement about it, so this step varies.",
            },
            {
              id: "bags",
              text: "At four o'clock the sealed bags are placed in the same cage for collection.",
              fail: false,
              why: "The bags, the cage, and the time are the same each day, so this step repeats.",
            },
          ],
          why: "That is right. Loading the franking machine and filling the cage are the same every day, and reading handwritten addresses is the step where a person notices a difference and decides what to do.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "Here is a description of the goods-in task at Harlow Dairy, a food manufacturer. Mark each sentence with Repeats or Varies.",
        passLabel: REPEATS,
        failLabel: VARIES,
        sentences: [
          {
            id: "trays",
            text: "Trays of the same yoghurt pot arrive on the same pallet type every morning.",
            fail: false,
            why: "The same pot arrives on the same pallet at the same time, which is what repeats means in this lesson.",
          },
          {
            id: "dates",
            text: "An operator checks the use-by date on each tray against the delivery note.",
            fail: true,
            why: "The movement is similar each time, but the operator is reading a date that changes and deciding whether it is acceptable. When a person is noticing and judging a changing detail, the step varies.",
          },
          {
            id: "lift",
            text: "Trays are lifted from the pallet onto a conveyor in the same order each time.",
            fail: false,
            why: "This sentence describes the same motion in the same order every time. That is the definition of a step that repeats.",
          },
          {
            id: "shifted",
            text: "Sometimes a tray has shifted in transit and is lying at an angle across two others.",
            fail: true,
            why: "The position of the tray has changed, and a robot programmed for the normal layout would not reach it correctly. A changed position is what varies means here.",
          },
        ],
        why: "You separated the steps that are the same every time from the steps where a person is noticing and handling a difference. The date check and the shifted tray are the two sentences a robot would not deal with on its own, and that split is the first thing anyone judging automation needs to see.",
      },
      bridge:
        "Now that you can see what repeats, the next lesson asks which of those steps a robot could realistically take.",
    },
    {
      id: "what-it-could-take",
      title: "What it could take",
      emphasis: "take",
      place:
        "This lesson turns the steps that repeat into a short list of candidates. It is the first module in the course outline, and it uses the description you wrote in the first lesson.",
      sections: [
        {
          heading: "Three conditions for a candidate",
          paragraphs: [
            "A step is a candidate for a robot when three things are true together. First, the step repeats, in the sense you learned in the last lesson. Second, it happens often enough to matter, which usually means many times a shift rather than a few times a week. Third, the part arrives in a known place and orientation, so the robot can reach it without first working out where it is and which way round it lies.",
            "When all three are true, this course says the robot could take the step, and the label on the buttons is Could take. When any of the three is missing, the label is Not a candidate yet. The word yet is deliberate. A step that fails the third condition today might pass it after a change upstream, such as a fixture that presents the part the same way every time, and that change is often cheaper than the robot.",
          ],
        },
        {
          heading: "A candidate is not a decision",
          paragraphs: [
            "Being a candidate is not the same as being a good investment, and it is not a decision. It means only that the step is worth describing in more detail, and that it deserves the questions in the next three lessons about limits, claims, and exceptions. Many candidates turn out to be not yet, and that is a useful result, because it was reached before anyone spent money.",
            "It also does not mean the robot would take the whole job. A person who removes parts from a machine may also inspect them, clear a jam, and tell the setter when the tool is wearing. If the robot takes the removal, those other duties still exist, and someone still has to do them. Write the candidate as a single step, not as a person's job.",
          ],
        },
        {
          heading: "How often is often enough",
          paragraphs: [
            "There is no single number that makes a step frequent enough. A useful test is to ask how much of a person's shift the step takes, and whether it happens on every shift. A step that runs every forty seconds all day is plainly frequent. A step that happens twice a week is rarely worth the cost of the engineering, the guarding, and the programming, however unpleasant it is to do.",
            "Where you do not know how often a step happens, say so, and find out before you go further. A count kept for a week on a sheet by the machine is better evidence than anyone's memory, including your own. The rest of the course will ask you to separate what you know from what you assume, and frequency is the first place that habit pays off.",
          ],
        },
        {
          heading: "The usual mistake: the step people dislike most",
          paragraphs: [
            "Many first conversations about robots go wrong because someone picks the step that is most tiring or most disliked, rather than the step that meets the three conditions. Those are not always the same step. The disliked step is often disliked precisely because it varies, because it needs judgement, or because it happens rarely and nobody has had the practice to become quick at it.",
            "There is nothing wrong with wanting to take a hard job away from people. The point is that the conditions decide whether a robot is suited to a step, and the complaint does not. If the disliked step fails the conditions, the answer might be a better tool, a lifting aid, or a change to the process, and that is worth saying plainly in your brief.",
          ],
          beforeAfter: {
            before: "Automate the tool change, because the team hates it and it takes most of a shift.",
            after:
              "The tool change is disliked, but it happens once a week and each one is slightly different, so it is not a candidate yet. Part removal happens every forty seconds from the same position, so the robot could take it.",
            reading:
              "The first version chooses the step by the complaint. The second version tests each step against the three conditions and still records the complaint, so nobody thinks it was ignored.",
          },
        },
      ],
      workedExample: {
        title: "Three steps on a moulding machine at Ashby Mouldings",
        inputLabel: "The plant manager's three steps",
        prompt:
          "Step A: the operator removes each moulded part from the machine every 40 seconds, from the same position, and places it on a conveyor.\nStep B: the operator inspects a sample of parts each hour for flash and short shots.\nStep C: once a week the operator changes the tool, which takes most of a shift.",
        outputLabel: "The note that went to the operations director",
        output:
          "Step A: Could take. It repeats, it happens every 40 seconds, and the part is always presented in the same place when the mould opens.\nStep B: Not a candidate yet. The operator is judging defects, so the step varies.\nStep C: Not a candidate yet. It is disliked and slow, but it happens once a week and every changeover is slightly different.",
        reading: [
          "Rob Kaur, the plant manager, tested each step against all three conditions in turn, and wrote the reason beside each label. The operations director can disagree with a reason, but cannot mistake what was decided.",
          "Step C is the step people complain about most, yet Step A is the candidate, because it meets all three conditions. Removing parts from moulding machines is a long-established robot task for exactly that reason. The cycle times in this example are illustrative and belong to it.",
          "Step B is left for later, not dismissed. Inspection can sometimes be automated with a camera, but that is a different project with its own evidence, and a separate Experrt course covers it.",
        ],
      },
      practice: {
        intro:
          "Here are three steps from a bakery. Mark each one with Could take or Not a candidate yet, using the three conditions above. Then do the same for the steps you marked as Repeats in your own task.",
        check: {
          kind: "mark",
          prompt: "Mark each bakery step with Could take or Not a candidate yet.",
          passLabel: "Could take",
          failLabel: "Not a candidate yet",
          sentences: [
            {
              id: "rolls",
              text: "A tray of 24 rolls leaves the oven every two minutes and is moved to the same position on the cooling rack.",
              fail: false,
              why: "This step repeats, happens every two minutes, and the tray arrives in a known place, so it meets all three conditions and the robot could take it.",
            },
            {
              id: "proving",
              text: "Once a fortnight the head baker adjusts the proving time for a new batch of flour.",
              fail: true,
              why: "This step happens once a fortnight and depends on the baker's judgement of the flour, so it fails two of the three conditions.",
            },
            {
              id: "heap",
              text: "Returned trays are stacked in a loose heap by the back door, dozens of times a day, ready for washing.",
              fail: true,
              why: "The step is frequent, but the trays lie in a heap in no fixed position, so the third condition is missing and it is not a candidate yet.",
            },
          ],
          why: "That is right. Only the cooling rack step meets all three conditions. The proving adjustment is rare and needs judgement, and the heap of trays is busy but has no known position.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Megan Hollis, the laboratory manager at Tamar Pathology, has written two descriptions of steps that might be automated. Choose the step a robot could take.",
        leftLabel: "Step A",
        left: "Technicians move capped tubes from a fixed rack of 96 positions into the analyser's rack of 96 positions, several hundred times a day, in the same pattern.",
        rightLabel: "Step B",
        right:
          "Technicians open incoming sample boxes, which arrive from dozens of clinics in different box sizes, and take out tubes that may be loose, taped together, or inside bags.",
        correct: "left",
        why: "Step A repeats, happens hundreds of times a day, and the tubes sit in known positions in a fixed rack. It meets all three conditions for a step a robot could take. You chose it rather than the step that is simply busy.",
        wrong:
          "Step B happens often, but the boxes and the tubes arrive in a different state each time. The tubes are not in a known place and orientation, so the third condition is missing. Look again at how the tubes are presented in each step.",
      },
      bridge:
        "A step that a robot could take still sits inside a process with limits, and the next lesson names what a robot cannot do in yours and what a supplier has only claimed.",
    },
    {
      id: "what-it-cannot-do",
      title: "What it cannot do, and what has not been shown",
      emphasis: "cannot",
      place:
        "This lesson is the second module. It deals with the limits of the machine and with the gap between a claim and evidence, so that your candidate step is judged on facts rather than on a demonstration.",
      sections: [
        {
          heading: "The limits that come up again and again",
          paragraphs: [
            "Robots in ordinary industrial use are limited in some predictable ways. They struggle with parts that are soft, flexible, or tangled, such as cables, bags, and fabric. They struggle when the thing they handle changes often, for example when a line runs many product variants on short runs. They do not notice things they were not set up to look for, so a split carton or a wrong label passes through unless something was added to detect it.",
            "They also need the space around them to be safe for people. The UK Health and Safety Executive publishes guidance on industrial robots and on the Provision and Use of Work Equipment Regulations 1998, and the international standards ISO 10218-1 and ISO 10218-2 set out safety requirements that an integrator will work to. You do not need to know their content for this course. You need to know that guarding or other safeguards are part of the cost and the floor space of any robot, and that the people who design them are specialists.",
          ],
        },
        {
          heading: "A claim and a demonstration",
          paragraphs: [
            "Suppliers work hard to overcome these limits, and some demonstrations are impressive. A demonstration is still a claim about the supplier's parts in the supplier's conditions. It shows what the machine did on that day, with those items, set up by the people who know it best. It does not show what the machine will do with your mix of parts, at your volumes, with your staff.",
            "This course uses two labels for every statement about what a robot can do. A statement is Shown on our parts only when it describes something done with your own parts, at your own volumes, in conditions like yours, and ideally with a quantity, a date, and a measured result. Every other statement is Claimed, not yet shown. The second label covers trade show figures, typical results at other customers, and general statements about what a system can do.",
          ],
        },
        {
          heading: "What the label is not",
          paragraphs: [
            "Claimed, not yet shown is not an accusation of dishonesty. Most claims are made in good faith, and many turn out to be true. The label is a note that the evidence you need for your decision does not exist yet. It keeps the claim in the brief, where it belongs, and it marks the claim as something to test rather than something to rely on.",
            "The label also tells you what to ask for next. A claim becomes evidence when it is repeated with your parts, in a stated quantity, with the difficult items included, and with the result measured and written down. That is a reasonable request to make of any supplier, and a good supplier will expect it.",
          ],
        },
        {
          heading: "The usual mistake: someone else's figure in your plan",
          paragraphs: [
            "The most common mistake is to carry a supplier's figure straight into your own numbers. A pick rate from a trade show, or a changeover time that customers typically see, ends up in a spreadsheet as if it were your rate. The spreadsheet then looks precise, and nobody remembers where the figure came from.",
            "Read each sentence of a supplier's material and ask whose parts it describes. If the answer is not yours, or if nobody can say, the sentence is claimed, not yet shown. Keep it, label it, and write down what would turn it into evidence. That habit protects you from the figure that nobody can later defend.",
          ],
          beforeAfter: {
            before: "The supplier runs 1,200 picks an hour, so one robot covers the evening shift.",
            after:
              "The supplier ran 1,200 picks an hour at a trade show with its own items, which is claimed, not yet shown. We will ask for a timed run with 300 of our own items, including the soft and bagged ones, before any rate goes into the plan.",
            reading:
              "The first version turns a demonstration into a staffing plan. The second keeps the figure, says whose items it came from, and names the test that would make it evidence.",
          },
        },
      ],
      workedExample: {
        title: "A supplier's email to Brennan Home Retail",
        inputLabel: "The supplier's email",
        prompt:
          "Our system picks any item from any tote. At the trade show we ran at 1,200 picks an hour. We ran 50 of your SKUs in our lab last week with no failures. It will fit into your existing layout.",
        outputLabel: "The email, marked sentence by sentence",
        output:
          "Our system picks any item from any tote: Claimed, not yet shown.\nAt the trade show we ran at 1,200 picks an hour: Claimed, not yet shown, because the items were not ours.\nWe ran 50 of your SKUs in our lab last week with no failures: Shown on our parts, for those 50 items in lab conditions.\nIt will fit into your existing layout: Claimed, not yet shown.",
        reading: [
          "Aisha Mensah, the operations director, received this email and marked each sentence before she forwarded it to the finance partner. An SKU is a stock-keeping unit, which is one product line in the warehouse system.",
          "One sentence carries real evidence, and even that one is limited to 50 items and a lab. The pick rate belongs to the supplier's own example and says nothing about Brennan's range, which includes soft and bagged items.",
          "The useful next step is to ask which of Brennan's items were not in the 50, and how the system handled the difficult ones. Aisha's reply asked for exactly that, and for someone to walk the site and confirm the layout claim.",
        ],
      },
      practice: {
        intro:
          "A supplier of carton-handling robots has sent two sentences to Oldham Parcel Services. Choose the sentence that is shown on our parts, using the definition above. Then find one claim you have heard about automation in your own area, label it, and write one sentence saying what would turn it into evidence.",
        check: {
          kind: "choose",
          prompt: "Choose the sentence that is Shown on our parts.",
          leftLabel: "Sentence A",
          left: "Our gripper handles every common carton type used in parcel distribution.",
          rightLabel: "Sentence B",
          right:
            "On 4 June we ran 300 of your own mixed cartons, sent from your Wakefield depot, through our test cell and recorded every drop.",
          correct: "right",
          why: "Sentence B names your own cartons, a quantity, a date, and a recorded result, so it is shown on our parts. Sentence A is a general statement about capability and describes no test with your cartons.",
          wrong:
            "Look again at Sentence A. It says what the gripper can do in general, but it does not say it was ever tried with your cartons, so it is claimed, not yet shown. Sentence B names your cartons, a quantity, and a date.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A supplier has sent these sentences to Wrekin Fabrications about a robot for loading a press brake, which is the machine that bends sheet metal. Mark each sentence with Shown on our parts or Claimed, not yet shown.",
        passLabel: SHOWN,
        failLabel: CLAIMED,
        sentences: [
          {
            id: "size",
            text: "The robot handles sheet up to the size of your largest blank.",
            fail: true,
            why: "Nothing in this sentence says the robot was run with your sheet. A statement of capacity is claimed, not yet shown, until it has been done on your parts.",
          },
          {
            id: "brackets",
            text: "We bent 200 of your bracket blanks, supplied by your team, in our demonstration cell on 12 March, and measured every angle.",
            fail: false,
            why: "This sentence names your parts, a quantity, a date, and a measurement. That is what shown on our parts means in this lesson.",
          },
          {
            id: "changeover",
            text: "Customers typically see changeovers under ten minutes.",
            fail: true,
            why: "The words customers and typically refer to someone else's results. It is claimed, not yet shown, until it has been timed on your changeovers.",
          },
          {
            id: "learns",
            text: "The system learns new parts automatically.",
            fail: true,
            why: "No test is described. A general statement about the system is claimed, not yet shown, until it is shown on your parts.",
          },
        ],
        why: "You kept the one sentence with evidence on Wrekin's own blanks apart from the three sentences that describe capacity, other customers, and general capability. Only the bracket trial could go into the plan as it stands.",
      },
      bridge:
        "Limits and claims are only half the picture, because the case is usually decided by the thing that goes wrong, which is the subject of the next lesson.",
    },
    {
      id: "the-exception",
      title: "The exception that decides the case",
      emphasis: "exception",
      place:
        "This is the third module, and it is the lesson that most often changes a learner's decision. It takes the steps you marked as Varies in the first lesson and turns each one into a written exception.",
      sections: [
        {
          heading: "What an exception is",
          paragraphs: [
            "An exception is any case that departs from the normal flow of the task: a damaged carton, a missing label, a part that arrives upside down, or a customer order with a special instruction. People handle exceptions constantly, and they often do not notice they are doing it, because the handling is simply part of the job. Ask an experienced packer what goes wrong and they may say nothing, and then spend a minute of every hour putting split cartons aside.",
            "An exception is not the same as a breakdown of the robot. A breakdown is a fault in the machine. An exception is something in the work that does not fit the pattern the robot was set up for, and it would still arrive even if the robot ran perfectly.",
          ],
        },
        {
          heading: "Exceptions do not disappear",
          paragraphs: [
            "When a robot takes the normal case, the exceptions do not go away. They go to one of three places. They stop the robot, so someone has to clear them. They pass through the robot wrongly, so a damaged item reaches a customer. Or they are moved to a person somewhere else, who now handles all the difficult cases and none of the easy ones.",
            "This is why a process is decided by its exceptions rather than by its average. If exceptions are rare and simple, the robot takes most of the work and a person handles the rest. If exceptions are common or need judgement, the robot takes the easy part and the team keeps the hard part, often with less time and less support than before.",
          ],
        },
        {
          heading: "Three facts for every exception",
          paragraphs: [
            "For each exception you need three facts. The first is what it is, in one plain sentence. The second is how often it happens, as a count over a stated period, or the words not yet measured when nobody knows. The third is who handles it today, named as a role or a team, such as the stock controller, the returns team, or the setter on nights.",
            "The words not yet measured are an honest answer, and they are far better than a guess. They make the gap visible, and they tell the reader what has to happen before a decision can be made. A frequency that someone remembers is useful as a starting point, but say that it is an estimate.",
          ],
          beforeAfter: {
            before: "Exception: some labels are missing.",
            after:
              "Exception: cartons arrive at despatch with no shipping label. How often: not yet measured. Handled by: the despatch supervisor, who reprints the label from the order system.",
            reading:
              "The first note names the exception but leaves the reader unable to judge it. The second gives what it is, admits that nobody has counted it, and names the person who deals with it today.",
          },
        },
        {
          heading: "The usual mistake",
          paragraphs: [
            "The usual mistake is to judge the process on its average day and to leave the exceptions for later. Later, after the equipment has been bought, the exceptions arrive exactly as before, and the people who handled them have been moved or were never asked. The robot is then blamed for a problem that was in the process all along.",
            "The second mistake is to name the exception but not the person who handles it. That person is usually the best source of the frequency, and they are the person whose work will change most. Name them in the note, and talk to them before you write the brief.",
          ],
        },
      ],
      workedExample: {
        title: "Returns put-away at Pennine Home Goods",
        inputLabel: "The returns manager's description",
        prompt:
          "Most returns are unopened, in their original packaging, with a readable barcode. Some are opened, some have no barcode, and some are a different item from the one on the returns note. My team sorts these into a separate cage.",
        outputLabel: "The exceptions, written with three facts each",
        output:
          "Opened items. How often: not yet measured. Handled by: the returns team, who inspect each item and decide whether it can go back into stock.\nMissing barcode. How often: not yet measured. Handled by: the returns team, who look the item up by its description.\nWrong item. How often: not yet measured. Handled by: the returns team, who raise a query with customer service.",
        reading: [
          "Claire Dobson, the returns manager, wrote one exception per line and gave each the same three facts. Writing them in the same shape makes it obvious where the gaps are.",
          "Every exception is handled by the same team using judgement, and none has been counted. That does not mean the answer is no. It means the decision cannot be made until someone counts the cage for a few weeks.",
          "If the cage turns out to be a large share of the flow, the robot takes only the easy part and the team keeps the hard part. If it is small, the case for a trial becomes much stronger. Either way, the count is the evidence.",
        ],
      },
      practice: {
        intro:
          "Two supervisors at Sefton Print have written the same exception. Choose the note that gives all three facts from this lesson. Then list every exception in your own task with what it is, how often or not yet measured, and who handles it today.",
        check: {
          kind: "choose",
          prompt: "Choose the exception note that gives what it is, how often, and who handles it today.",
          leftLabel: "Note A",
          left: "Exception: a reel of paper arrives with a damaged edge. How often: 7 reels in the four weeks to 28 February, from the goods-in log. Handled by: the press minder, who trims the reel before it is loaded.",
          rightLabel: "Note B",
          right: "Exception: damaged reels come in now and again and get sorted out on the shop floor.",
          correct: "left",
          why: "Note A says what the exception is, gives a count over a stated period with its source, and names the press minder as the person who handles it. A reader can judge it without asking anyone.",
          wrong:
            "Look again at Note B. Now and again is not a frequency, and sorted out on the shop floor does not name who handles it. Note A gives a count, a period, and a role.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "This process note from Mercia Components, a parts warehouse, is missing information about its exception. Edit the note so the exception has all three facts the lesson named: what it is, how often it happens or not yet measured, and who handles it today.",
        label: "The process note you are editing",
        start:
          "Robot to pick small parts from bins into order totes. Exception: some bins are mixed after a miscount.",
        unchanged:
          "You have not changed the note yet. Add how often mixed bins occur, or write not yet measured, and name who handles a mixed bin today.",
        keep: [
          {
            id: "exception",
            any: ["mixed", "miscount"],
            missing:
              "Keep what the exception is. The note should still say that some bins are mixed after a miscount.",
          },
        ],
        limits: [
          {
            id: "frequency",
            any: [
              "not yet measured",
              "not measured",
              "per ",
              "a day",
              "a week",
              "a shift",
              "a month",
              "an hour",
              "each week",
              "each day",
              "each shift",
              "every",
              "once",
              "twice",
              "times",
              "daily",
              "weekly",
              "%",
              "per cent",
              "in the week",
              "in the month",
            ],
            missing:
              "Your note does not say how often a mixed bin happens. Add a frequency such as 4 a week, or write not yet measured so the gap is visible.",
          },
          {
            id: "handler",
            any: ROLE_WORDS,
            missing:
              "Your note does not say who handles a mixed bin today. Name the role or the team, for example the stock controller or the picker.",
          },
        ],
        limitWording: false,
        why: "That note now says what the exception is, how often it happens or that nobody knows yet, and who handles it today. A reader can see what the robot would leave behind and who would be left handling it.",
        result: {
          label: "A note that passes",
          text: "Robot to pick small parts from bins into order totes. Exception: some bins are mixed after a miscount. How often: not yet measured. Handled by: the stock controller, who recounts the bin and corrects the stock record.",
        },
      },
      bridge:
        "You now have a candidate step, its limits and claims, and its exceptions, and the next lesson shows you how to turn those into a decision.",
    },
    {
      id: "go-or-not-yet",
      title: "Go or not yet",
      emphasis: "Go",
      place:
        "This lesson prepares the decision that your brief will carry. It sits between the exception and the brief, and it uses everything you have written so far.",
      sections: [
        {
          heading: "Two values, and what each one means",
          paragraphs: [
            "In this course a decision has two possible values, and those are the two labels on the buttons. Go means it is worth spending money and time on the next stage, such as a paid feasibility study or a trial on your own parts. Go does not mean buy a robot. It means the case is strong enough to justify the next, larger piece of evidence.",
            "Not yet means that something specific must be true first. It is written with the one missing piece and the person who will get it. Not yet is a complete decision in its own right, and it is often the most useful one, because it tells everyone exactly what to do next and stops money being spent before the answer is known.",
          ],
        },
        {
          heading: "The four things a go needs",
          paragraphs: [
            "A go needs four things to be true. The step meets the three conditions from the second lesson. The main claim has been shown on your parts, or there is an agreed plan to show it in the next stage. Each exception has a named person or team who will handle it. And someone has been named to own the stop.",
            "The owner of the stop is the person who decides when the robot stops, who is told when it stops on its own, and who decides when it restarts. On a site that runs more than one shift, that means a named role on every shift. Without an owner, a stopped robot waits until someone happens to notice, and the work that was flowing through it backs up behind it.",
            "If any of the four is missing, the decision is not yet. That rule can feel strict, but it is what makes a go worth something. A finance partner who sees go on your brief should be able to trust that all four are in place.",
          ],
        },
        {
          heading: "Not yet is not no",
          paragraphs: [
            "A not-yet decision is not a refusal. It says that the case is open and names what would close it. Count the exception cage for four weeks. Ask the supplier to run 200 of our blanks. Agree an owner for the stop on nights. Each of those is a piece of work with a person attached to it.",
            "A good not-yet decision names one missing piece rather than five. If there are several gaps, name the one that would change the answer most, and put it first. The others can be listed underneath, but the reader should know what to do on Monday.",
          ],
        },
        {
          heading: "The usual mistake: a decision without its reason",
          paragraphs: [
            "A weak decision in either direction is one that does not say its reason. Go, because robots are widely used in our sector, is not a reason about your process. Not yet, because it feels risky, gives nobody anything to act on. Both of those decisions may turn out to be right, but neither can be checked or defended.",
            "State the reason in the terms of the four things above. Say what repeats and how often, what has been shown on your parts, who handles the exceptions, and who owns the stop. A reader who disagrees can then point to the exact fact they doubt.",
          ],
          beforeAfter: {
            before: "Go. Palletising is a proven application and the team hates the lifting.",
            after:
              "Not yet. The step repeats and runs all day, and split cartons are set aside by the packer about once an hour. Nobody has yet been named to own the stop and restart on nights. Go once the night shift manager agrees to own it.",
            reading:
              "The first decision gives a general truth and a real complaint, but no fact about this line. The second tells the reader what is true, what is missing, and who has to act.",
          },
        },
      ],
      workedExample: {
        title: "Two decisions about the same palletising step at Calder Distribution",
        inputLabel: "The first decision",
        prompt: "Go. Palletising is a proven application and the team hates the lifting.",
        outputLabel: "The second decision",
        output:
          "Not yet. The step repeats and runs all day, and split cartons are set aside by the packer about once an hour. The supplier has stacked 400 of our cartons at their site on 9 May. Nobody has yet been named to own the stop and restart on nights. Go to a paid trial once Dev Sharma, the night shift manager, agrees to own it.",
        reading: [
          "Both decisions are about Joanne Firth's line from the first lesson. The first was written by a project sponsor after a trade show. The second was written by Joanne after working through the four things a go needs.",
          "The first decision is not wrong about palletising in general, and the complaint about lifting is real. But a finance partner reading it learns nothing about this line, and cannot tell whether the split cartons, the evidence, or the night shift have been considered.",
          "The second decision is less exciting and far more useful. It shows three of the four things in place, names the one that is missing, names the person who can supply it, and says what the decision becomes when he does.",
        ],
      },
      practice: {
        intro:
          "Each sentence below sums up the position on one step. Mark each one with Go or Not yet, using the four things a go needs. Then write a one-line decision for your own process and a second line giving its reason.",
        check: {
          kind: "mark",
          prompt: "Mark each position with Go or Not yet.",
          passLabel: "Go",
          failLabel: "Not yet",
          sentences: [
            {
              id: "complete",
              text: "The step repeats all day, the supplier has run 150 of our parts, rejected parts go to the setter, and the day shift leader owns the stop.",
              fail: false,
              why: "All four things are in place: the conditions, evidence on our parts, a handler for the exceptions, and an owner for the stop. That is a go.",
            },
            {
              id: "uncounted",
              text: "The step repeats all day and the supplier is confident, but nobody has counted how often labels are missing or said who fixes them.",
              fail: true,
              why: "The exception has no frequency and no handler, and the supplier's confidence is a claim. The decision is not yet until the exception is counted and a handler is named.",
            },
            {
              id: "nights",
              text: "Everything is in place except that nobody on the night shift has agreed to own the stop.",
              fail: true,
              why: "An owner for the stop is one of the four things a go needs, and it is missing on nights, so the decision is not yet.",
            },
          ],
          why: "That is right. Only the first position has all four things. The second is missing its exception facts, and the third is missing an owner for the stop on one shift.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two decisions have been written about robot loading for a CNC lathe at Tansley Precision. A CNC lathe is a computer-controlled machine that turns metal bar into round parts. Choose the decision you could defend to your finance partner.",
        leftLabel: "Decision A",
        left: "Go. Robot loading of lathes is widely used, and our competitors are doing it.",
        rightLabel: "Decision B",
        right:
          "Go to a paid trial. The load step repeats on two part numbers that make up most of the lathe's work, the supplier has run 100 of our blanks, bar ends and bent stock are set aside by the setter, and the cell leader has agreed to own the stop.",
        correct: "right",
        why: "Decision B gives the facts about this lathe, the evidence on your own blanks, who handles the exceptions, and who owns the stop. It states its reason in the terms of this process, so a finance partner can check each part of it.",
        wrong:
          "Decision A may be true in general, but it gives no fact about your lathe, no evidence on your parts, and no owner for the exceptions or the stop. Look for the decision that names those things.",
      },
      bridge:
        "You have now practised every move on its own. The next lesson brings them together on cases you have not seen, and ends with the course assessment.",
    },
    {
      id: "course-assessment",
      title: "Judge a new case from start to finish",
      emphasis: "case",
      place:
        "This is the course assessment, and it comes before the brief. It recaps the method, works one mixed example, and then asks you to judge six new situations.",
      sections: [
        {
          heading: "The method in one place",
          paragraphs: [
            "Every case in this course is judged in the same order. First, describe the task one action per sentence, and mark each sentence as repeats or varies. Second, test the steps that repeat against the three conditions, and pick the step the robot could take. Third, separate what a robot cannot do in this process, and label every statement of capability as shown on our parts or claimed, not yet shown.",
            "Fourth, write each exception with what it is, how often it happens or not yet measured, and who handles it today. Fifth, decide go or not yet, using the four things a go needs, and state the reason in the terms of this process. The brief in the final lesson carries the result of all five moves on one page.",
          ],
        },
        {
          heading: "What the assessment looks for",
          paragraphs: [
            "The assessment has six situations, each set in a workplace you have not met in the course. Each question has several options, and each option is something a reasonable professional might do. Exactly one is right, and it is right for a reason this course taught. You need five of the six to pass.",
            "After you submit, each question shows whether your choice was right and what that choice would cause at work. If you do not reach five, read the feedback on the questions you missed, go back to the lesson it points to, and try again. Your earlier answers stay on the page.",
          ],
        },
        {
          heading: "How to read a situation",
          paragraphs: [
            "Read each situation twice. On the first reading, find the step and the decision being made. On the second, look for the detail that changes the answer, which is usually a frequency, a word such as typically or at the trade show, or a gap such as nobody on nights.",
            "Where two options both sound sensible, ask which one this course would write in a brief. The right option usually names a fact, a person, or a piece of evidence. The wrong options usually rely on a general truth, a complaint, or someone else's result.",
          ],
        },
      ],
      workedExample: {
        title: "Box folding at Stourbridge Print Finishers",
        inputLabel: "The team leader's note",
        prompt:
          "Flat carton blanks are fed into the folder from a squared stack in the same tray, about 2,000 an hour. About twice a shift a blank is creased badly and the operator pulls it out. The supplier says its robot feeder handles any board weight. Nobody has asked who would clear the feeder on the late shift.",
        outputLabel: "The case, judged move by move",
        output:
          "Repeats: feeding flat blanks from a squared stack in the same tray. Varies: the badly creased blank.\nCould take: the feed step, which repeats, runs about 2,000 an hour, and has a known position.\nClaimed, not yet shown: handles any board weight. Ask for a run with our three heaviest boards.\nException: badly creased blank. How often: about twice a shift, the operator's estimate. Handled by: the folder operator.\nDecision: Not yet. Go to a trial once the late shift supervisor agrees to own the stop and the heavy boards have been run.",
        reading: [
          "Kieran Walsh, the team leader, wrote four sentences, and the working note takes each through the five moves in order. Nothing in the note is new information. It is the same facts, sorted so that a reader can see what is known and what is not.",
          "The supplier's sentence stays in the note, labelled as a claim with the test that would turn it into evidence. The frequency is marked as the operator's estimate, which is honest and still useful.",
          "The decision is not yet for two reasons, and the note names both with the person or test that closes each. That is the standard every answer in the assessment is judged against.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, choose between two first lines that Kieran's operations manager might have written. The method above is still on the page.",
        check: {
          kind: "choose",
          prompt: "Choose the line that is ready to go into the brief.",
          leftLabel: "Line A",
          left: "Not yet. The feed step could take a robot, but nobody owns the stop on the late shift and the heavy boards have not been run.",
          rightLabel: "Line B",
          right: "Go. The supplier says the feeder handles any board weight, and folding is a common robot task.",
          correct: "left",
          why: "Line A states the decision, names the step, and names both missing pieces in the terms of this process. Line B relies on a claim that has not been shown on Stourbridge's boards and on a general truth about folding.",
          wrong:
            "Look again at Line B. Handles any board weight is claimed, not yet shown, and nobody owns the stop on the late shift, so a go cannot be defended. Line A names both gaps.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose what you would do. You need five of the six to pass. Each answer draws on one of the moves from this course.",
        passMark: 5,
        questions: [
          {
            id: "filling",
            situation:
              "Priya Nair, the planning manager at Kestrel Foods, is describing a sandwich line. Bread slices arrive on the belt in the same place every four seconds. An operator adds the filling by hand, and the filling changes five times a shift as the product changes.",
            question: "How should Priya mark the filling step?",
            options: [
              {
                id: "repeats",
                text: "Repeats, because the operator does it every four seconds.",
                feedback:
                  "The timing repeats, but the filling itself changes five times a shift and the operator adjusts to each product. A step varies when the part or the action changes in a way a person handles. Look again at the first lesson.",
              },
              {
                id: "varies",
                text: "Varies, because the filling changes five times a shift and the operator adjusts to each product.",
                correct: true,
                feedback:
                  "Right. The movement is frequent, but the product changes during the shift and the operator handles each change. That is what varies means, and it is the step a robot would not handle without being set up for every product.",
              },
              {
                id: "omit",
                text: "Leave the step out of the description, because robots are not used in food.",
                feedback:
                  "Leaving the step out hides the part of the task most likely to decide the case, and robots are used in food production. Describe every step and mark it, as in the first lesson.",
              },
            ],
          },
          {
            id: "folder",
            situation:
              "Tom Hughes runs operations at Linden Print. He has three steps: feeding flat sheets into a folder from a stack squared in the same tray, about 3,000 times a shift; hand-inserting leaflets whose number varies by customer; and loading the guillotine once a week for a special trim. His director wants the guillotine automated because staff dislike it.",
            question: "Which step should Tom put forward as the candidate?",
            options: [
              {
                id: "guillotine",
                text: "The guillotine loading, because it is the step staff dislike most.",
                feedback:
                  "The guillotine is disliked, but it happens once a week and each trim is special. It fails two of the three conditions. The second lesson warns against choosing the step people dislike most.",
              },
              {
                id: "feed",
                text: "The folder feed, because it repeats, runs about 3,000 times a shift, and the sheets sit in a known position.",
                correct: true,
                feedback:
                  "Right. The folder feed meets all three conditions. You can still record the director's point about the guillotine in the brief, so it is not ignored.",
              },
              {
                id: "leaflets",
                text: "The leaflet inserting, because it is the most manual of the three.",
                feedback:
                  "Being manual does not make a step a candidate. The number of leaflets varies by customer, so the step varies. Look again at the three conditions in the second lesson.",
              },
              {
                id: "all",
                text: "All three together, so that the cost of the robot is spread across more work.",
                feedback:
                  "Bundling steps that fail the conditions makes the project harder, not cheaper, because each step brings its own exceptions. Put forward the one step that meets all three conditions.",
              },
            ],
          },
          {
            id: "picks",
            situation:
              "Grace Okoro is the finance partner at Northgate Home. A supplier's proposal states that its vision picking system handles 99 per cent of retail items, a figure from its own customer sites. Grace is building the business case for a picking robot in the Leicester warehouse, which stocks bagged textiles and loose cushions.",
            question: "What should Grace do with the figure?",
            options: [
              {
                id: "use",
                text: "Put 99 per cent into the business case, because it comes from real customer sites.",
                feedback:
                  "The figure comes from other people's items in other conditions, so it is claimed, not yet shown. Putting it into the case is how someone else's figure ends up in your plan. Look again at the third lesson.",
              },
              {
                id: "references",
                text: "Ask for two customer references and treat the figure as shown once they confirm it.",
                feedback:
                  "References are worth having, but they still describe other people's items. Shown on our parts means your own items at your own volumes, including the textiles and cushions.",
              },
              {
                id: "test",
                text: "Label the figure claimed, not yet shown, and ask for a timed run with a sample of Northgate's own items, including the bagged textiles and cushions.",
                correct: true,
                feedback:
                  "Right. You kept the claim, labelled it honestly, and named the test that would turn it into evidence, with the soft items that a robot usually struggles with included.",
              },
              {
                id: "reject",
                text: "Drop the supplier, because a figure that high is probably not honest.",
                feedback:
                  "Claimed, not yet shown is not an accusation of dishonesty. The figure may be true for other sites. The better move is to ask for evidence on your own items.",
              },
            ],
          },
          {
            id: "cage",
            situation:
              "Helen Price leads the returns team at Brook and Vale. A robot is proposed to scan and shelve returned items. Items that are opened, unlabelled, or wrong go into a cage that her team sorts by hand, and nobody has counted how many go in each week.",
            question: "What should Helen do before a decision is made?",
            options: [
              {
                id: "count",
                text: "Count the cage for four weeks, write down who handles each kind of item, and decide once the count is in.",
                correct: true,
                feedback:
                  "Right. The cage is the exception that decides the case. A count gives its frequency, and naming the handler shows who keeps the hard part if the robot takes the easy part.",
              },
              {
                id: "feel",
                text: "Say go now, because the cage feels small to the team.",
                feedback:
                  "A feeling is not a frequency. If the cage is larger than it feels, the robot takes the easy part and the team keeps the hard part. Write not yet measured and count it.",
              },
              {
                id: "vanish",
                text: "Leave the cage out, because the robot will simply reject anything it cannot scan.",
                feedback:
                  "Rejected items do not disappear. They go to a person somewhere else. The fourth lesson explains why the exception has to be written down with its handler.",
              },
              {
                id: "estimate",
                text: "Ask the supplier to estimate the cage size from similar sites.",
                feedback:
                  "The supplier's estimate would describe other sites, so it is claimed, not yet shown. Helen's own team can count her own cage.",
              },
            ],
          },
          {
            id: "nights",
            situation:
              "At Dunmore Plastics, a robot to remove parts from a moulding machine meets all three conditions. The supplier has run 500 of Dunmore's parts on 2 April with every cycle recorded. Short shots go to the setter. The day shift leader owns the stop, but nobody on the night shift has agreed to.",
            question: "What decision should go in the brief?",
            options: [
              {
                id: "go",
                text: "Go, because the night shift will sort out the stop once the robot is installed.",
                feedback:
                  "Owning the stop is one of the four things a go needs, and it is missing on nights. A stopped robot with no owner waits until someone notices. Look again at the fifth lesson.",
              },
              {
                id: "no",
                text: "No, because a project with a gap should not go ahead.",
                feedback:
                  "Not yet is not no. Three of the four things are in place, and the missing one can be closed. Write not yet, name the gap, and name who will close it.",
              },
              {
                id: "days",
                text: "Go on the day shift only, and switch the robot off at night without telling anyone.",
                feedback:
                  "Running on days only may be a sensible option, but it has to be a stated decision that the night shift knows about. Unannounced changes create exactly the gap an owner of the stop is there to prevent.",
              },
              {
                id: "notyet",
                text: "Not yet. Name the missing owner for the stop on nights, and say who will get the night shift manager's agreement.",
                correct: true,
                feedback:
                  "Right. You named the one missing piece and the person who will close it, so everyone knows what has to happen before the decision becomes a go.",
              },
            ],
          },
          {
            id: "reason",
            situation:
              "Sam Whitfield, a planner at Ferndale Engineering, has drafted a brief. His decision field reads: Go. Robots are widely used in our sector and the team is keen. He asks you to review it before it goes to the operations director on Friday.",
            question: "What should you suggest?",
            options: [
              {
                id: "more",
                text: "Add a paragraph on how common robots are in the sector, to strengthen the case.",
                feedback:
                  "More general truth does not make the reason any stronger for this process. The operations director needs facts about Ferndale's step, not the sector.",
              },
              {
                id: "short",
                text: "Cut it to the single word Go, so the director reads the decision first.",
                feedback:
                  "A decision without its reason cannot be checked or defended. The fifth lesson asks for the reason in the terms of the process.",
              },
              {
                id: "rewrite",
                text: "Rewrite the reason in terms of this step: what repeats and how often, what has been shown on Ferndale's parts, who handles the exceptions, and who owns the stop, then say what would change the decision.",
                correct: true,
                feedback:
                  "Right. That turns a general opinion into a decision a reader can check, and it is the shape the brief in the final lesson asks for.",
              },
            ],
          },
        ],
        why: "You applied every move in the course to cases you had not seen: marking what varies, choosing the candidate by the three conditions, labelling a claim, counting the exception, and writing a decision with its reason. You are ready to write the brief.",
      },
      bridge:
        "The last lesson asks you to write the whole brief for your own process, and that brief is what appears on your record.",
    },
    {
      id: "the-brief",
      title: "Write the go or not-yet brief",
      emphasis: "brief",
      place:
        "This is the final lesson and the fourth module in the course outline. You write the artefact, sign it, and it becomes your record.",
      sections: [
        {
          heading: "What the brief is",
          paragraphs: [
            "The go or not-yet brief is one page about one process. It is not an introduction to robotics and it is not a sales case. It records the five moves you have practised, applied to a process you own, and it ends with a decision and the evidence that would change it.",
            "A colleague who has never met you should be able to read it and understand why you decided as you did. It should use facts you know, and it should say not yet measured or not yet named wherever you do not know. A brief that admits two gaps and says how to close them is worth more than a brief that sounds certain.",
          ],
        },
        {
          heading: "The nine parts",
          paragraphs: [
            "The brief has nine parts, and each one is a heading on your record. The process and step says which process you considered and which single step. What repeats and what varies are two separate parts, each with at least one step of its kind. What it cannot do, and what is only claimed, names a limit of the machine in this process or a claim that has not been shown on your parts.",
            "The exception that decides the case says what it is and how often it happens, or not yet measured. Who handles it today names a role or a team. Who owns the stop names a role, or says not yet named. The decision and its reason starts with Go or Not yet and gives the reason in the terms of this process. What would change it names the one piece of evidence or the one action that would move the decision.",
          ],
        },
        {
          heading: "Ready to act on, or a colleague would have to ask",
          paragraphs: [
            "Test each part with one question: could a colleague act on it as it stands. If they could, the part is Ready to act on, which is the first label in the practice. If they would have to come back to you and ask what you meant, the part is A colleague would have to ask, which is the second label.",
            "The returns team is ready to act on, and my lot is not. Not yet measured is ready to act on, because it tells the reader that someone must count, and quite a few is not. Go once the night shift manager owns the stop is ready to act on, and go when things settle down is not.",
          ],
        },
        {
          heading: "What the brief is not, and how it is checked",
          paragraphs: [
            "The brief is not a feasibility study, an engineering assessment, or a safety assessment, and your record will say so. It does not replace the manufacturer's training, your employer's authorisation, your site's own procedures, or the risk assessment for a specific installation. Do not put anything confidential into it, because a second person can open your record. Use names and figures you would be comfortable showing, or realistic examples with the same shape.",
            "When you continue, each part is checked for its substance. The repeats and varies parts must each describe a step of that kind. The limit part must name something the robot cannot do or something only claimed. The exception must give a frequency or not yet measured, the handler and the owner of the stop must name a role or say not yet named, the decision must start with Go or Not yet, and the last part must state a condition. If a part is missing, the note names it and says what to add.",
          ],
        },
      ],
      workedExample: {
        title: "Claire Dobson's brief for returns put-away",
        inputLabel: "Her notes from the earlier lessons",
        prompt:
          "Unopened items with readable barcodes go to known shelf locations. Opened, unlabelled, and wrong items go to the cage. The supplier says its system reads damaged barcodes. The returns team sorts the cage. Nobody owns the stop yet.",
        outputLabel: "The brief she signed",
        output:
          "Process and step: returns put-away at Pennine Home Goods, the step of placing restockable items onto shelves.\nWhat repeats: unopened items with readable barcodes, placed onto the same known locations every day.\nWhat varies: opened items, missing barcodes, and wrong items, which arrive in no fixed pattern.\nWhat it cannot do, and what is only claimed: it cannot judge whether an opened item can be resold. Claimed, not yet shown: that the system reads damaged barcodes.\nThe exception that decides the case: the cage of opened, unlabelled, and wrong items. How often: not yet measured.\nWho handles it today: the returns team, who inspect, look up, or query each item.\nWho owns the stop: not yet named.\nDecision and its reason: Not yet. The step repeats and the parts arrive in known places, but the cage has not been counted and nobody owns the stop.\nWhat would change it: if a four-week count shows the cage is small and the returns shift leader agrees to own the stop, return with a go for a trial.",
        reading: [
          "Every part is one or two sentences, and every part could be read aloud in a meeting. The brief uses only facts Claire knows, and it says not yet measured and not yet named where she does not.",
          "The claim about damaged barcodes is kept and labelled, so a reader knows it is the next thing to test. The limit about resale judgement tells the reader why the cage exists at all.",
          "The decision is honest about two gaps and says exactly what will close them. A finance partner could approve the four-week count on the strength of this page, which is the kind of next step a not-yet brief should produce.",
        ],
      },
      practice: {
        intro:
          "Here are four lines from a first draft by a transport planner at Hebden Freight. Mark each one with Ready to act on or A colleague would have to ask, using the test above. Then draft your own brief in the fields that follow.",
        check: {
          kind: "mark",
          prompt: "Mark each line of the draft brief as Ready to act on or A colleague would have to ask.",
          passLabel: "Ready to act on",
          failLabel: "A colleague would have to ask",
          sentences: [
            {
              id: "step",
              text: "Process and step: trailer unloading at the Halifax depot, the step of moving pallets from the trailer onto the dock conveyor.",
              fail: false,
              why: "This line names the process, the site, and the single step, so a colleague could act on it as it stands.",
            },
            {
              id: "exception",
              text: "The exception that decides the case: some pallets are a bit awkward.",
              fail: true,
              why: "A bit awkward does not say what the exception is, and there is no frequency or not yet measured. A colleague would have to ask what awkward means and how often it happens.",
            },
            {
              id: "owner",
              text: "Who owns the stop: not yet named.",
              fail: false,
              why: "Not yet named is an honest answer that shows the gap, so a colleague knows an owner must be found before a go.",
            },
            {
              id: "change",
              text: "What would change it: when things settle down.",
              fail: true,
              why: "When things settle down names no evidence and no action. A colleague would have to ask what has to happen and who will do it.",
            },
          ],
          why: "That is right. The step and the owner of the stop are ready to act on, because one is specific and the other admits a gap plainly. The exception and the change condition would send a colleague back to ask what was meant.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the go or not-yet brief for one process you own. Fill in all nine parts so that a colleague could act on each one without asking you what you meant.",
        fields: [
          {
            id: "process",
            label: "Process and step",
            hint: "The process you considered and the single step within it, for example the step of loading cartons onto pallets at the end of line 2.",
            min: 20,
            any: ["step", "task", "stage", "line", "process", "loading", "unloading", "picking", "packing", "moving", "placing", "feeding", "removing"],
            missing:
              "Process and step does not yet name a step. Say which process you considered and the single step within it, for example the step of moving pallets onto the dock conveyor.",
          },
          {
            id: "repeats",
            label: "What repeats",
            hint: "At least one step where the part, the position, and the action are the same each time.",
            min: 16,
            any: ["same", "each", "every", "repeat", "fixed", "always", "known", "identical", "one at a time", "pattern"],
            missing:
              "What repeats does not yet describe a step that is the same every time. Name at least one step and say what is the same about the part, its position, or the action.",
          },
          {
            id: "varies",
            label: "What varies",
            hint: "At least one step where something changes and a person notices and handles it.",
            min: 16,
            any: ["vary", "varies", "different", "change", "sometimes", "some ", "damaged", "missing", "wrong", "occasional", "mixed", "odd", "split", "judge", "decide", "no fixed"],
            missing:
              "What varies does not yet describe a step that changes. Name at least one step where the part, its position, or the action is different and a person notices and handles it.",
          },
          {
            id: "limits",
            label: "What it cannot do, and what is only claimed",
            hint: "A limit of the machine in this process, or a claim that has not been shown on your own parts.",
            min: 20,
            any: ["cannot", "can't", "can not", "unable", "not able", "claimed", "not yet shown", "not shown", "struggle", "would not notice", "will not notice"],
            missing:
              "What it cannot do, and what is only claimed does not yet state a limit or a claim. Say what the robot cannot do in this process, or name a claim and write that it is claimed, not yet shown.",
          },
          {
            id: "exception",
            label: "The exception that decides the case",
            hint: "What the exception is and how often it happens, as a count over a period, or the words not yet measured.",
            min: 20,
            any: [
              "not yet measured",
              "not measured",
              "per ",
              "a day",
              "a week",
              "a shift",
              "a month",
              "an hour",
              "each week",
              "each day",
              "each shift",
              "every",
              "once",
              "twice",
              "times",
              "daily",
              "weekly",
              "%",
              "per cent",
              "in the week",
              "in the month",
            ],
            missing:
              "Your exception field does not say how often it happens. Add a frequency such as 6 a week, or write not yet measured.",
          },
          {
            id: "handler",
            label: "Who handles it today",
            hint: "The role or team that deals with the exception now, for example the returns team or the setter on nights.",
            min: 6,
            rule: "role",
            any: ROLE_WORDS,
            missing:
              "Your exception does not yet say who handles it today. Name the role or team, for example the stock controller or the returns team.",
          },
          {
            id: "stopOwner",
            label: "Who owns the stop",
            hint: "The role that decides when the robot stops and restarts, on every shift, or the words not yet named.",
            min: 6,
            any: [...ROLE_WORDS, "not yet named", "not named"],
            missing:
              "The owner of the stop is not yet named as a role. Name the role on each shift, or write not yet named so the gap is visible.",
          },
          {
            id: "decision",
            label: "Decision and its reason",
            hint: "Start with Go or Not yet, then give the reason in the terms of this process.",
            min: 24,
            any: ["go.", "go,", "go ", "go:", "not yet"],
            missing:
              "Your decision field does not start with go or not yet. Start it with one of those words, then give the reason in the terms of this process.",
          },
          {
            id: "change",
            label: "What would change it",
            hint: "The one piece of evidence or the one action that would move the decision, and who will get it.",
            min: 20,
            any: ["if ", "once", "until", "when ", "unless", "after", "as soon as", "provided"],
            missing:
              "Your brief does not say what would change the decision. Add the one piece of evidence or the one action that would move it, for example once the cage has been counted for four weeks.",
          },
        ],
        why: "Your brief names the step, separates what repeats from what varies, states a limit or a claim, names the deciding exception with how often it happens and who handles it, names who owns the stop or says it is not yet named, and ends with a decision and what would change it. A colleague could act on this.",
      },
      bridge:
        "Your brief is ready. Sign your name below, and the record will show this brief, the course, and the date to anyone who opens the reference, together with a note that it is not a feasibility study, an engineering assessment, or a safety assessment.",
    },
  ],
};
