/*
Course: Where a Robot Belongs in the Process
Slug: where-a-robot-belongs-in-the-process
For: Process owners, operations and continuous improvement engineers, and production managers who must decide where in a process automation should go. They know the process they will work on and can watch it or talk to the people who do it. No process mapping training is assumed.
Outcome: The learner breaks one process into tasks, records four facts about each task, marks each task Robot, Person, or Not yet with a reason, finds the step that looks easy for a machine but is not, describes what automating one task does to its neighbours, and writes a recommendation a colleague could challenge and they could defend.
Artefact: The recommendation, in five parts: the process and task list with marks and reasons, the task recommended, the easy step that is not, the knock-on effect, and the evidence still needed.
Record sentence: Wrote and signed a task-by-task recommendation for where a robot belongs in one process, which is not an engineering, safety, or financial approval.
Lessons (id, title, move, interaction, pass rule):
  1. split-into-tasks, Split the process into tasks, write a process as one action on one object per line, practice mark (One task / A stage, not a task) and check choose, pass when every line is marked correctly and the list at task level is chosen.
  2. four-facts, Four facts about each task, record how often, how much it varies, how the part arrives, and what judgement it needs, practice choose and check edit, pass when the record keeps its three facts and gains a how the part arrives line that describes presentation or says not yet measured.
  3. robot-person-or-not-yet, Robot, person, or not yet, mark each task with a reason drawn from the four facts, practice mark (Reason uses the four facts / Reason is an opinion) and check scenario of four tasks, pass when every reason is judged correctly and all four tasks carry the right mark.
  4. the-easy-step-that-is-not, The easy step that is not, find hidden work in a step that looks simple, practice mark (Visible motion / Hidden work) and check choose, pass when every sentence is marked correctly and the assessment that finds hidden work is chosen.
  5. the-knock-on-effect, The knock-on effect, describe what automating one task does to the tasks before and after it and to the person, practice choose and check mark (Stays within this task / Changes a neighbouring task), pass when the fuller knock-on note is chosen and every sentence is marked correctly.
  6. judge-a-process, Judge a process you have not seen, apply the whole method to new cases, practice choose and check scenario of eight questions, pass mark six of eight.
  7. the-recommendation, The recommendation, write the artefact, practice mark (Traceable to a fact / A claim with nothing behind it) and check build of five fields, each field with an any list and a missing sentence.
Sources: Mike Rother and John Shook, Learning to See (Lean Enterprise Institute); James P. Womack and Daniel T. Jones, Lean Thinking; International Federation of Robotics, World Robotics reports; UK Health and Safety Executive guidance on manual handling and the Manual Handling Operations Regulations 1992; manufacturer application notes from robot and gripper makers.
Tested on phone:          no
Tested returning learner: no
Pass rule tests written:  yes
*/
import type { CourseContent } from "./types.ts";

const ONE_TASK = "One task";
const A_STAGE = "A stage, not a task";
const FACT_REASON = "Reason uses the four facts";
const OPINION_REASON = "Reason is an opinion";
const VISIBLE = "Visible motion";
const HIDDEN = "Hidden work";
const STAYS = "Stays within this task";
const CHANGES = "Changes a neighbouring task";
const TRACEABLE = "Traceable to a fact";
const NOTHING_BEHIND = "A claim with nothing behind it";

export const COURSE: CourseContent = {
  slug: "where-a-robot-belongs-in-the-process",
  hours: 2.5,
  artefact: {
    lessonId: "the-recommendation",
    title: "The recommendation",
    recordLine:
      "Wrote and signed a task-by-task recommendation for where a robot belongs in one process, which is not an engineering, safety, or financial approval.",
  },
  lessons: [
    {
      id: "split-into-tasks",
      title: "Split the process into tasks",
      emphasis: "tasks",
      place:
        "This is the first of seven lessons and the start of the first module, The tasks. Everything later in the course is marked against the task list you make here, so the time you spend on it now is repaid in every lesson that follows.",
      sections: [
        {
          heading: "What a task is in this course",
          paragraphs: [
            "A task, in this course, is one action on one object, with a clear start and a clear end. 'Lift the housing from the tray and place it in the fixture' is a task. It has a verb, a thing being acted on, a moment when it begins, and a moment when it is finished. You could stand beside the person doing it with a stopwatch and time it, and a second observer standing next to you would agree on when to start and stop the watch.",
            "The reason for this discipline is practical. A robot takes one task at a time. It picks, places, turns, presses, or inspects, and each of those is a separate piece of work with its own conditions. If your list is written at any level above the task, you cannot say which piece of work a robot would take, and any recommendation built on the list will be vague in exactly the place where it needs to be precise.",
          ],
        },
        {
          heading: "What a task is not",
          paragraphs: [
            "A task is not a department, a job title, or a stage. 'Goods in', 'the packer', and 'assembly' each contain many tasks with very different characteristics. Assembly might include picking a screw from a bowl, holding two parts square while the screw goes in, and checking that a clip has seated. The first of those might suit a robot, the second might not, and the third might need a trained eye. When the list says only 'assembly', those differences are hidden.",
            "In this course we call a line like 'assembly' a stage. A stage is a group of tasks that people talk about as one thing, usually because it happens in one place or is done by one person. Stages are useful for talking about a process in a meeting, but they are too coarse to judge. When you find a stage on your list, the move is always the same: go and watch it, and write down the tasks inside it.",
          ],
          beforeAfter: {
            before: "3. Packing.",
            after:
              "3. Take the finished lamp from the conveyor. 4. Wrap the shade in a paper sleeve. 5. Place the lamp and shade in the carton. 6. Fold and tape the carton lid. 7. Apply the address label to the top face.",
            reading:
              "The first version is a stage. The second shows five tasks, and already you can see that wrapping a shade in paper is a very different kind of work from applying a label to a flat face.",
          },
        },
        {
          heading: "Write from what you see, not from the procedure",
          paragraphs: [
            "A good task list is written from what people actually do. The written procedure is a useful starting point, but it usually leaves out the small acts that keep the work going: the operator who taps a tray to settle the parts, the packer who turns every third carton so the label faces the aisle, the fitter who wipes a face before placing a gasket. These acts are real tasks, and some of them turn out to matter a great deal when a robot arrives.",
            "So watch the work for at least one full cycle, and ideally for long enough to see an interruption. If you cannot watch, ask the person who does the job to talk you through it while they do it, and write down every action they mention. Methods from lean practice, such as the value stream mapping in Learning to See by Mike Rother and John Shook, are a good guide to observing a process before changing it, but for this course you need only a plain numbered list.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to write the list at a desk, from memory, in the words the organisation already uses. That produces a list of stages, because stages are how people talk about work. It feels complete, it matches the org chart, and it cannot be judged.",
            "The test that catches this is simple. Read each line and ask whether you could time it with a stopwatch and whether a colleague would agree on where it starts and ends. If either answer is no, the line is a stage, and it needs to be split before you go any further.",
          ],
        },
      ],
      workedExample: {
        title: "Where could a robot go at Calder Electronics",
        inputLabel: "The first task list",
        prompt: "1. Kitting. 2. Assembly. 3. Test. 4. Packing.",
        outputLabel: "The test stage, after an hour on the line",
        output:
          "1. Pick circuit board from rack. 2. Place board in test fixture. 3. Close fixture and press start. 4. Read pass or fail on screen. 5. Remove board from fixture. 6. If pass, place board in outgoing tray. If fail, place board in red bin and write the fault on a tag.",
        reading: [
          "Ruth Hollis, the production engineer at Calder Electronics, was asked where a robot could go. Her first list names four stages. Nobody could say which of them a robot should take, because each one contains several different kinds of work.",
          "After an hour watching the test bench, her second list covers only the test stage, and it already tells her things the first list could not. Tasks 1, 2, and 5 are similar movements of the same board. Task 4 involves reading a screen. Task 6 is really two different actions depending on the result, and one of them includes writing by hand.",
          "Each line in the second list could be timed, and a colleague standing beside Ruth would agree on where each starts and ends. That is the level at which the rest of this course works.",
        ],
      },
      practice: {
        intro:
          "Here are five lines from a returns process at a homeware retailer. Mark each one as One task, meaning one action on one object with a clear start and end, or as A stage, not a task, meaning a group of tasks that needs splitting. The definitions are in the sections above.",
        check: {
          kind: "mark",
          prompt: "Mark each line of the returns list as One task or as A stage, not a task.",
          passLabel: ONE_TASK,
          failLabel: A_STAGE,
          sentences: [
            {
              id: "scan",
              text: "Scan the barcode on the returns label.",
              fail: false,
              why: "This is one action on one object, and it starts and ends at clear moments, so it is one task.",
            },
            {
              id: "inspection",
              text: "Inspection.",
              fail: true,
              why: "Inspection is a stage. It contains opening the parcel, looking at the item, and deciding its grade, and each of those is a separate task.",
            },
            {
              id: "cut",
              text: "Cut the tape on the parcel with the safety knife.",
              fail: false,
              why: "This line names one action on one object, and you could time it, so it is one task.",
            },
            {
              id: "goods-in",
              text: "Goods in.",
              fail: true,
              why: "Goods in is the name of an area and a stage of the work. It contains unloading, counting, and booking in, so it needs splitting.",
            },
            {
              id: "tote",
              text: "Place the item in the resale tote.",
              fail: false,
              why: "This is one action on one object with a clear end, so it is one task.",
            },
          ],
          why: "That is right. The three lines with a verb and an object are tasks, and Inspection and Goods in are stages that would each need watching and splitting before anyone could judge them.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two engineers at Marlow Drinks have written task lists for the same bottling line changeover. Choose the task list written at the level this lesson taught.",
        leftLabel: "List A",
        left: "1. Stop the line. 2. Changeover. 3. Restart and check.",
        rightLabel: "List B",
        right:
          "1. Stop the filler at the operator panel. 2. Remove the bottle guide rails for the old size. 3. Fit the guide rails for the new size. 4. Select the new recipe on the panel. 5. Run ten bottles and check the fill height.",
        correct: "right",
        why: "You chose the list you could time line by line. Each line in List B is one action on one object with a clear start and end, which is the level at which a task can be judged.",
        wrong:
          "List A names stages. Changeover contains several tasks with very different characteristics, from removing rails to selecting a recipe, so you could not mark it as a single task. Choose the list where each line is one action on one object.",
      },
      bridge:
        "A list of tasks is only the start. The next lesson gives each task the four facts you need before you can judge it.",
    },
    {
      id: "four-facts",
      title: "Four facts about each task",
      emphasis: "facts",
      place:
        "This lesson finishes the first module. You have a task list, and now you add the evidence that lets anyone judge each task on the same terms.",
      sections: [
        {
          heading: "The four facts",
          paragraphs: [
            "Every task on your list needs four facts before it can be judged. The first is how often: how many times the task happens in a shift or a day. The second is how much it varies: whether the part, the product, or the action changes, and how often it changes. The third is how the part arrives: whether it comes in a known place and orientation, such as in a fixture, a rack, or a tray, or whether it comes loose, stacked, piled, or tangled. The fourth is what judgement it needs: whether the person doing the task is deciding something, such as whether a part looks right or what to do next.",
            "Each fact answers a question a robot cannot answer for itself. A robot is worth its cost when a task happens often. It is easiest to apply when the task barely changes. It depends heavily on the part arriving where it expects and the right way up. And it has no judgement beyond what someone has designed into it. Those four facts together are the minimum you need to have a sensible argument about any task.",
          ],
        },
        {
          heading: "Observations, not opinions",
          paragraphs: [
            "The four facts are observations. 'About 400 times a shift' is an observation. 'Arrives in a rack, one board per slot, same way up' is an observation. 'Easy', 'boring', 'fiddly', and 'simple' are opinions. Opinions are not wrong to hold, but they cannot be checked, and two people with different opinions have nothing to settle the difference with.",
            "Where you do not know a fact, write not yet measured. That phrase is honest, and it is useful, because it tells the reader exactly where the evidence is thin. A task record with not yet measured in one line is better than a record with a confident guess in that line, because the guess will be read as a fact by everyone who picks up the record after you.",
          ],
          beforeAfter: {
            before: "How the part arrives: easy, they come in on the belt.",
            after: "How the part arrives: on a belt conveyor, single file, but about one in ten is lying on its side.",
            reading:
              "The first version gives an opinion and a vague location. The second says where the part is and how it is lying, including the exception that a robot would have to cope with.",
          },
        },
        {
          heading: "Why this matters at work",
          paragraphs: [
            "A task with all four facts can be argued about sensibly. If a colleague thinks a task should stay with a person, they have to point to one of the facts and say why it matters. If a supplier says the task is ideal for their robot, you can ask how their robot copes with the one part in ten that arrives on its side. The facts turn a discussion about taste into a discussion about evidence.",
            "The facts also protect you. Automation decisions are often revisited months later, when a project has run over or a machine is not delivering. A recommendation built on recorded facts can be checked against what was known at the time. A recommendation built on 'this looked easy' cannot, and the person who wrote it has nothing to stand on.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to leave out how the part arrives, because the person who does the task handles it without thinking. A packer reaches into a chute, finds a bag, and turns it the right way in a single movement. To them, that is not a fact worth mentioning. To a robot, it is often the hardest part of the job.",
            "The second common mistake is to record the judgement as none because nobody has written a rule for it. If the person ever decides anything, such as which crate, which bin, or whether this one looks right, then the task needs judgement, and the record should say what the decision is.",
          ],
        },
      ],
      workedExample: {
        title: "Four facts for one task at Calder Electronics",
        inputLabel: "The task as listed",
        prompt: "Task 2: place board in test fixture.",
        outputLabel: "The task record with four facts",
        output:
          "Task 2: place board in test fixture.\nHow often: about 400 times a shift.\nHow much it varies: two board types, changed about once a week.\nHow the part arrives: in a rack, one board per slot, same orientation.\nWhat judgement it needs: none, because the fixture only accepts the board one way.",
        reading: [
          "Ruth counted the boards over one shift, so the figure of about 400 is her own count for this example. The variation line gives both how many types there are and how often they change, which is what a robot integrator would ask next.",
          "The arrival line describes the rack, the slot, and the orientation. This is the fact that most often decides whether a robot can take a task, and it is stated as something anyone could go and look at.",
          "The judgement line says none, and it gives the reason. With these four facts, the task starts to look like a strong candidate, and anyone who disagrees has something specific to disagree with.",
        ],
      },
      practice: {
        intro:
          "Two supervisors at Penrose Foods have written a record for the same task, placing sealed pots of soup into outer cases. Choose the record that gives four observations rather than opinions. The section on observations and opinions is above if you want to read it again.",
        check: {
          kind: "choose",
          prompt: "Choose the task record that states the four facts as observations.",
          leftLabel: "Record A",
          left:
            "How often: about 1,800 pots a shift. How much it varies: one pot size, three recipes, changed twice a shift. How the part arrives: upright, single file on a belt conveyor. What judgement it needs: the packer puts aside any pot with a lifted lid.",
          rightLabel: "Record B",
          right:
            "How often: lots. How much it varies: not much really. How the part arrives: fine, they come down the line. What judgement it needs: none, it is an easy job.",
          correct: "left",
          why: "Record A gives a count, the number of sizes and changes, the position of the pot, and the decision the packer makes. Each line could be checked by someone who went to watch, which is what makes it an observation.",
          wrong:
            "Look again at Record B. Lots, not much really, fine, and easy are opinions, and none of them could be checked by someone who went to watch. Record A gives a count, a position, and the decision the packer actually makes.",
        },
      },
      check: {
        kind: "edit",
        prompt:
          "This task record from the Fairley Pharmacy dispatch warehouse is missing one of the four facts. Edit the record so that all four facts are present. Keep the three facts that are already there, and add the missing one as an observation, or write not yet measured.",
        label: "The task record you are completing",
        start:
          "Task: place filled prescription bag into the delivery crate for its route.\nHow often: about 900 times a day.\nHow much it varies: bag size varies from small to large, and the route changes with each bag.\nWhat judgement it needs: the packer reads the route label and chooses the crate.",
        unchanged:
          "You have not changed the record yet. It still has no line for how the part arrives. Add a line that says how the bags reach the packer, or write not yet measured.",
        keep: [
          {
            id: "often",
            any: ["900"],
            missing: "Keep how often. The record should still say that the task happens about 900 times a day.",
          },
          {
            id: "varies",
            any: ["varies", "route changes"],
            missing:
              "Keep how much it varies. The record should still say that bag size varies and the route changes with each bag.",
          },
          {
            id: "judgement",
            any: ["route label", "chooses the crate"],
            missing:
              "Keep what judgement it needs. The record should still say that the packer reads the route label and chooses the crate.",
          },
        ],
        limitWording: false,
        limits: [
          {
            id: "arrives-line",
            any: ["how the part arrives", "how the bag arrives", "how the bags arrive", "how it arrives"],
            missing:
              "The record still has no line for how the part arrives. Add a line that begins How the part arrives, and say how the bags are presented to the packer.",
          },
          {
            id: "arrives-observed",
            any: [
              "not yet measured",
              "chute",
              "loose",
              "conveyor",
              "belt",
              "tray",
              "tote",
              "rack",
              "orientation",
              "upright",
              "on its side",
              "flat",
              "stacked",
              "pile",
              "heap",
              "one at a time",
              "single file",
              "position",
              "bench",
              "shelf",
              "trolley",
              "cage",
            ],
            missing:
              "Your new line gives an opinion or a vague answer rather than an observation. Describe where the bag is and what position it is in when the packer reaches for it, for example loose in a chute in any orientation, or write not yet measured.",
          },
        ],
        why: "That is right. The record now has all four facts, and the new line says how the bag actually reaches the packer, so the task can be judged on evidence rather than on how easy it looks.",
        result: {
          label: "The complete task record",
          text: "Task: place filled prescription bag into the delivery crate for its route.\nHow often: about 900 times a day.\nHow much it varies: bag size varies from small to large, and the route changes with each bag.\nHow the part arrives: loose in a chute, in any orientation, sometimes two bags touching.\nWhat judgement it needs: the packer reads the route label and chooses the crate.",
        },
      },
      bridge:
        "With four facts on each task, you can now mark each one as Robot, Person, or Not yet, which is the next lesson.",
    },
    {
      id: "robot-person-or-not-yet",
      title: "Robot, person, or not yet",
      emphasis: "Robot",
      place:
        "This is the second module. It turns the four facts on each task into a mark, and every mark carries a reason that someone else can check.",
      sections: [
        {
          heading: "Three marks",
          paragraphs: [
            "Each task receives one of three marks. Robot means the task happens often, varies little, arrives in a known place and orientation, and needs no judgement, so a robot could reasonably take it as the process stands today. Person means the task needs judgement, varies a great deal, or happens too rarely to justify automating it, so a person should keep it.",
            "Not yet means the task could become a robot task if something else changed first, and the mark names what would have to change. Most often the thing in the way is how the part arrives. A task where parts come tipped loose into a tote may become a robot task once the parts come in a tray. A Not yet mark is not a polite no. It is a statement of what the process would need, and that is often a cheaper change than the robot itself.",
          ],
        },
        {
          heading: "Every mark needs a reason from the four facts",
          paragraphs: [
            "A mark without a reason is not acceptable in this course, and the reason must refer to one or more of the four facts. 'Robot, because it happens 3,000 times a shift, one size per run, arrives single file, and needs no judgement' is a reason. 'Robot, because it is the obvious one' is not. In the practice below, a reason that points to how often, how much it varies, how the part arrives, or what judgement it needs is a reason that uses the four facts. A reason that points to anything else, such as how dull the task is or what a supplier said, is a reason that is an opinion.",
            "Write each reason as a sentence with because in it, for example 'Task 3: Not yet, because the rolls arrive piled and touching.' This is a habit, not a formality. It forces you to name the fact, and it gives the reader something to disagree with if they think you have the fact wrong.",
          ],
          beforeAfter: {
            before: "Task 4: Person. It is too complicated.",
            after: "Task 4: Person, because every order is different and the picker decides which substitute to offer when an item is out of stock.",
            reading:
              "The first reason is an opinion that nobody could check. The second points to two of the four facts, variation and judgement, and names the decision the person makes.",
          },
        },
        {
          heading: "What the mark is and is not",
          paragraphs: [
            "The mark is a claim about this task, in this process, today. It is not a permanent judgement about the task in general. Picking from a bin is a Person task on many sites and a Robot task on others, because the parts, the volumes, and the bins are different. If the process changes, the mark may change too, and a good task list is revisited when it does.",
            "The mark is also not a decision to buy anything. Marking a task Robot says only that the four facts support automating it. Whether it is worth doing depends on the rest of the course: the hidden work in the task, the effect on its neighbours, and the evidence still needed.",
          ],
        },
        {
          heading: "The mistake people usually make",
          paragraphs: [
            "The usual mistake is to have only two marks in mind, yes or no. That pushes every uncertain task into one side or the other. Tasks that could be automated after a change upstream get marked Person and are forgotten, and tasks that are almost suitable get marked Robot and fail when the first awkward part arrives.",
            "Not yet exists to hold those tasks honestly. When you are tempted to mark a task Robot but one fact is against it, mark it Not yet, and write down the fact and what would have to change.",
          ],
        },
      ],
      workedExample: {
        title: "Three tasks at Fairley Pharmacy",
        inputLabel: "The three task records",
        prompt:
          "Task A: seal filled bags. 900 a day, one bag type, bags arrive upright on a conveyor, no judgement.\nTask B: check the medicine against the prescription. 900 a day, every prescription different, a pharmacist decides.\nTask C: place bags into route crates. 900 a day, bags arrive loose in a chute, the packer reads the route label.",
        outputLabel: "The marks and reasons",
        output:
          "Task A: Robot, because it is frequent, uniform, presented upright, and needs no judgement.\nTask B: Person, because it needs a pharmacist's judgement on every item.\nTask C: Not yet, because the bags arrive loose. It could become a robot task if bags arrived one at a time in a fixed position with a scannable route label.",
        reading: [
          "Omar Shah, the dispatch manager, gave every task a mark and a reason with because in it. Each reason names at least one of the four facts, so anyone reading the list can see why he reached each mark.",
          "Task B happens as often as the others, but frequency does not decide it. The pharmacist's judgement on every item is enough on its own to keep it with a person.",
          "Task C is the interesting one. It is not a no. It is a clear statement of what would need to change upstream, and a change to how bags leave the sealer may be far cheaper than the robot that would follow it.",
        ],
      },
      practice: {
        intro:
          "Here are four reasons written by a team leader at Brook Street Print for tasks in the finishing area. Mark each reason as Reason uses the four facts or as Reason is an opinion. The paragraph on reasons is above.",
        check: {
          kind: "mark",
          prompt: "Mark each reason as Reason uses the four facts or as Reason is an opinion.",
          passLabel: FACT_REASON,
          failLabel: OPINION_REASON,
          sentences: [
            {
              id: "stack",
              text: "Stack cut sheets on the pallet: Robot, because it happens 600 times a shift, one sheet size per job, and the sheets arrive squared on the guillotine table.",
              fail: false,
              why: "This reason names how often, how much it varies, and how the sheets arrive, so it uses the four facts.",
            },
            {
              id: "dull",
              text: "Fold leaflets by hand: Robot, because nobody enjoys doing it.",
              fail: true,
              why: "Nobody enjoying a task says nothing about how often it happens, how it varies, how the part arrives, or what judgement it needs, so it is an opinion.",
            },
            {
              id: "proof",
              text: "Approve the colour proof: Person, because the printer compares each proof against the customer's sample and decides whether it matches.",
              fail: false,
              why: "This reason names the judgement the printer makes, which is one of the four facts.",
            },
            {
              id: "supplier",
              text: "Load the stitcher: Robot, because the supplier said it would be straightforward.",
              fail: true,
              why: "What a supplier said is not one of the four facts. The reason should say how often the stitcher is loaded and how the work arrives.",
            },
          ],
          why: "That is right. The stacking and proof reasons each name a fact someone could go and check, and the folding and stitcher reasons rest on feeling and on a supplier's word.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Here are four tasks from the packing area at Hartwell Bakery, each with its four facts. Choose Robot, Person, or Not yet for each task.",
        passMark: 4,
        questions: [
          {
            id: "trays",
            situation:
              "Place sealed bread bags into trays. The task happens about 3,000 times a shift, with one bag size per run. The bags arrive single file on a conveyor, and the packer makes no decisions.",
            question: "Which mark do the four facts support?",
            options: [
              {
                id: "robot",
                text: "Robot",
                correct: true,
                feedback:
                  "Yes. It is frequent, uniform, presented in a known way, and needs no judgement, so all four facts point to a robot as the process stands.",
              },
              {
                id: "person",
                text: "Person",
                feedback:
                  "All four facts point the other way: frequent, uniform, presented single file, and no judgement. Nothing here needs a person, so it is a robot task as the process stands.",
              },
              {
                id: "not-yet",
                text: "Not yet",
                feedback:
                  "Not yet is for a task where something must change first, usually how the part arrives. These bags already arrive single file, so nothing needs to change.",
              },
            ],
          },
          {
            id: "cakes",
            situation:
              "Decorate celebration cakes to a customer's written instructions. About twenty cakes are decorated a day, and every design is different.",
            question: "Which mark do the four facts support?",
            options: [
              {
                id: "not-yet",
                text: "Not yet",
                feedback:
                  "There is no upstream change that would make this a robot task, because the difficulty is that every cake is different and the decorator interprets instructions. That needs judgement, so it stays with a person.",
              },
              {
                id: "robot",
                text: "Robot",
                feedback:
                  "Twenty a day is low, every design is different, and the decorator is interpreting written instructions. Each of those facts points to a person.",
              },
              {
                id: "person",
                text: "Person",
                correct: true,
                feedback: "Yes. Every cake is different and needs judgement, and the volume is low, so a person keeps it.",
              },
            ],
          },
          {
            id: "rolls",
            situation:
              "Pick rolls from the cooling rack into bags of six. The task happens about 2,000 times a shift, with one roll type per run. The rolls arrive piled and touching on the rack.",
            question: "Which mark do the four facts support?",
            options: [
              {
                id: "person",
                text: "Person",
                feedback:
                  "The volume and uniformity are there, and no judgement is needed. The only fact against a robot is how the rolls arrive, and that could change, which makes it not yet rather than person.",
              },
              {
                id: "not-yet",
                text: "Not yet",
                correct: true,
                feedback:
                  "Yes. The rolls arrive piled, which a robot handles poorly. If they arrived spaced in rows, the task could become a robot task, so the mark names that change.",
              },
              {
                id: "robot",
                text: "Robot",
                feedback:
                  "Look at how the part arrives. Rolls piled and touching are hard for a robot to pick one at a time, so something upstream has to change first. That makes it not yet.",
              },
            ],
          },
          {
            id: "blade",
            situation:
              "Swap the slicer blade when it dulls. This happens about once a fortnight and needs a trained engineer to judge when the blade is dull and to fit the new one safely.",
            question: "Which mark do the four facts support?",
            options: [
              {
                id: "robot",
                text: "Robot",
                feedback:
                  "This happens about once a fortnight and needs trained judgement. It is neither frequent nor free of judgement, so it stays with a person.",
              },
              {
                id: "not-yet",
                text: "Not yet",
                feedback:
                  "No change to how the part arrives would help, because the task is rare and needs a trained judgement. It stays with a person.",
              },
              {
                id: "person",
                text: "Person",
                correct: true,
                feedback: "Yes. It is rare and needs a trained engineer's judgement, so it stays with a person.",
              },
            ],
          },
        ],
        why: "You gave each task the mark its four facts support, and you used Not yet where the way the part arrives is what stands in the way.",
      },
      bridge:
        "Some tasks look like robot tasks until you watch them closely. The next lesson is about those tasks, and about the work people do in them without being asked.",
    },
    {
      id: "the-easy-step-that-is-not",
      title: "The easy step that is not",
      emphasis: "easy",
      place:
        "This is the third module. It protects your recommendation from the most common and most expensive mistake, which is marking a task Robot because it looks simple.",
      sections: [
        {
          heading: "Easy for a person, hard for a robot",
          paragraphs: [
            "Some tasks are easy for a person and hard for a robot, and they are easy to mismark precisely because they look so simple. A person does them without thinking, the four facts look favourable, and the task list shows nothing unusual. Then the robot arrives and cannot do the job reliably, or does the job and loses something nobody knew was there.",
            "The typical cases are well known to anyone who has read application notes from robot and gripper makers, which describe the conditions under which an application has worked. They include picking one item from a bin of tangled or overlapping items, handling anything soft or flexible such as bags, cables, and fabric, reading handwriting or damaged labels, and noticing in passing that something is wrong.",
          ],
        },
        {
          heading: "Hidden work",
          paragraphs: [
            "The last of those cases is the one most often missed. A person who places a part in a fixture is also, without being asked, looking at it. They will put aside a cracked part even though no procedure says to, straighten a bent tab, or mention to the supervisor that the last three boxes were damp. When the task moves to a robot, that noticing disappears unless someone designs it back in.",
            "In this course we call this hidden work. Hidden work is anything the person does while doing the task that is not on the task list: a look, a feel, a correction, a putting aside. In the practice below, a sentence that describes the movement the task list already shows is visible motion. A sentence that describes something extra the person does, especially noticing or putting aside, is hidden work.",
          ],
          beforeAfter: {
            before: "Place the cushion into the polythene bag. 600 a shift. No judgement.",
            after:
              "Place the cushion into the polythene bag. 600 a shift. The packer opens the bag by hand, eases the cushion in as it deforms, and puts aside any cushion with loose stitching.",
            reading:
              "The first version records only the visible motion. The second records two handling problems, the flexible bag and the soft cushion, and one piece of hidden inspection that the list never mentioned.",
          },
        },
        {
          heading: "What the easy step that is not is not",
          paragraphs: [
            "The easy step that is not is a step where a person does hidden work, or where the part is hard for a machine to handle, that the task list does not show. It is not simply a step that is tiring or dull. Tiring steps are often very good robot tasks, and the UK Health and Safety Executive's guidance on manual handling explains why repetitive lifting is a common reason for automating a task.",
            "It is also not a step that a supplier has said is difficult, or a step that someone on the floor does not want to lose. Those views may be worth hearing, but they are not what this lesson is about. The easy step that is not is found by watching the work, and it is described in terms of the part and the person's hidden work.",
          ],
        },
        {
          heading: "How to find it",
          paragraphs: [
            "Go back to every task you marked Robot. Watch it again, or ask the person who does it to describe everything they do, including the things they would not normally mention. Ask them what they do when something is wrong with the part. Ask them what they put aside, and why. Watch for a pause, a second look, or a movement that is not on the list.",
            "When you find hidden work, you have three honest choices. You can change the mark to Not yet and say what would have to change, you can keep the mark and say how the hidden work will be designed back in, or you can change the mark to Person. What you must not do is keep the mark Robot and say nothing, because that loses the hidden work without anybody deciding to lose it.",
          ],
        },
      ],
      workedExample: {
        title: "The cushion bag at Ashdown Furniture",
        inputLabel: "The task as listed",
        prompt:
          "Place the cushion into the polythene bag. The packer takes a cushion from the stack, opens a bag, slides the cushion in, and folds the end. 600 a shift. No judgement listed.",
        outputLabel: "What watching the packer showed",
        output:
          "The step looks like a robot task on volume, but the cushion is soft and deforms, the bag is flexible and has to be opened, and the packer also looks at each cushion and puts aside any with loose stitching, which is not on the list. This is an easy step that is not. Mark: Not yet, because the bag and cushion are both flexible and the stitching check would be lost.",
        reading: [
          "Graham Pike, the continuous improvement engineer at Ashdown Furniture, had marked this step Robot from the task list. The list was accurate as far as it went, and the volume was high.",
          "Watching the packer for half a shift showed two handling problems, a soft cushion and a flexible bag, and one piece of hidden inspection. The packer put aside four cushions with loose stitching in that time, and none of that was written anywhere.",
          "Any recommendation that kept this step marked Robot would have lost the inspection without anybody deciding to lose it. Graham changed the mark and wrote down why.",
        ],
      },
      practice: {
        intro:
          "Here are four sentences from Graham's notes on another step, placing a finished chair leg into a drilling jig. Mark each as Visible motion, meaning the movement the task list already shows, or as Hidden work, meaning something extra the person does. The section on hidden work is above.",
        check: {
          kind: "mark",
          prompt: "Mark each sentence as Visible motion or as Hidden work.",
          passLabel: VISIBLE,
          failLabel: HIDDEN,
          sentences: [
            {
              id: "lift",
              text: "The operator lifts a leg from the tray.",
              fail: false,
              why: "Lifting the leg from the tray is the movement the task list shows, so it is visible motion.",
            },
            {
              id: "grain",
              text: "She turns the leg so that any knot in the grain faces away from the drill.",
              fail: true,
              why: "Turning the leg to avoid a knot is a judgement the list does not mention, so it is hidden work.",
            },
            {
              id: "place",
              text: "She places the leg in the jig and closes the clamp.",
              fail: false,
              why: "Placing the leg and closing the clamp is the listed task, so it is visible motion.",
            },
            {
              id: "split",
              text: "If the end of the leg is split, she puts it in the offcuts bin.",
              fail: true,
              why: "Noticing a split and putting the leg aside is not on the list, so it is hidden work that a robot would lose.",
            },
          ],
          why: "That is right. Lifting and placing are the visible motion, and turning the grain and putting aside split legs are hidden work that would disappear if a robot took the task without anyone designing them back in.",
        },
      },
      check: {
        kind: "choose",
        prompt:
          "Two assessments have been written of the step 'place the cable loom into the box' at Tenby Controls. Choose the assessment that finds the easy step that is not.",
        leftLabel: "Assessment A",
        left:
          "Not yet. The box is in a fixed place, but the loom is flexible and tangles, and the packer untangles any knotted loom and checks that the connector clips are fitted, which is not on the task list.",
        rightLabel: "Assessment B",
        right:
          "Robot. The step happens 500 times a shift and the box is always in the same place, so it meets the conditions.",
        correct: "left",
        why: "You chose the assessment that looked for the hidden work, not only the visible motion. Assessment A finds the flexible part and the clip check the packer does, which are what make this easy step hard for a robot.",
        wrong:
          "Assessment B looks only at the volume and where the box is. It misses that the loom is flexible and tangles, and that the packer checks the clips. Look again for hidden work the person is doing.",
      },
      bridge:
        "Automating a task changes the tasks around it. The next lesson asks you to write down how.",
    },
    {
      id: "the-knock-on-effect",
      title: "The knock-on effect",
      emphasis: "knock-on",
      place:
        "This lesson sits between the easy step and the recommendation. It widens the view from the one task you might automate to the tasks on either side of it and to the person who does it now.",
      sections: [
        {
          heading: "One task changes its neighbours",
          paragraphs: [
            "When a robot takes a task, the tasks before and after it change. In this course we call that change the knock-on effect. The task before usually has to present parts more consistently than a person ever needed. A person can reach into a pile and sort it out, whereas a robot usually needs the part in a tray, a rack, or a fixed position on a conveyor. So the upstream task gains a new job.",
            "The task after has to accept the robot's pace. A robot is steady, but it is not flexible in the way a person is. It does not speed up to clear a backlog or slow down while a colleague fetches more cartons. So the downstream task may need a buffer, a new place to store work, or a different rhythm. Lean Thinking by James P. Womack and Daniel T. Jones is a good guide to thinking about flow between tasks rather than about tasks in isolation.",
          ],
        },
        {
          heading: "Where the exceptions go",
          paragraphs: [
            "Exceptions that the person handled quietly now arrive somewhere else. The hidden work you found in the last lesson does not vanish when the task is automated. The chipped jar, the loose stitch, and the bent pin still exist. If nobody designs a new place for them, they travel further down the process, often to the next person in line, to the customer, or to a new reject bin that nobody owns.",
            "So for every task you mark Robot, write down where its exceptions will now go and who will deal with them. That is a sentence about a neighbouring task, even if the neighbour is a new one such as clearing a reject bin, because it is work that did not exist in that place before.",
          ],
        },
        {
          heading: "The person's work changes",
          paragraphs: [
            "The person who did the task usually does different work afterwards, such as loading the robot, clearing stops, dealing with rejects, and watching for problems. That is a real change to their job, and it is not simply their old job minus one task. It needs different skills, it may need training that the manufacturer or the employer provides, and it will feel different to do. Your site's own procedures and the risk assessment for the installation will govern how that new work is done, and this course does not replace either.",
            "A recommendation that does not say what the person's work becomes is incomplete. It will also be surprised later, when the person is found to be spending half the shift clearing jams that nobody planned for.",
          ],
          beforeAfter: {
            before: "The robot will take over placing jars into cases, freeing up the packer.",
            after:
              "The robot will place jars into cases. The packer will reload the case magazine every twenty minutes, clear robot stops, and check the reject lane at the end of each run.",
            reading:
              "The first version treats the packer's time as simply released. The second says what the packer's work becomes, which is what a manager needs to plan the shift.",
          },
        },
        {
          heading: "What the knock-on effect is not",
          paragraphs: [
            "The knock-on effect is not a reason to avoid automation. Nearly every useful automation has one, and many are small and cheap to deal with. It is part of the cost and part of the design, and it belongs in the recommendation for that reason.",
            "The usual mistake is to describe only the robot's own task. That produces a note that says what the robot will do and nothing about what the rest of the process must now do. In the check below, a sentence about the robot's own action stays within this task, and a sentence about the task before, the task after, the exceptions, or the person's new work changes a neighbouring task.",
          ],
        },
      ],
      workedExample: {
        title: "Automating task 2 at Calder Electronics",
        inputLabel: "The proposed change",
        prompt: "Robot places boards in the test fixture (task 2).",
        outputLabel: "The knock-on note",
        output:
          "Task before: boards must arrive in racks in a consistent orientation, which they already do, but a damaged rack will now stop the robot.\nTask after: failed boards will still need a person to write the fault tag, so the tester operator becomes the person who handles fails and clears robot stops.\nExceptions: bent pins, which the operator notices when placing a board, will now be found only by the tester.",
        reading: [
          "Ruth wrote one sentence about the task before, one about the task after, and one about where the exceptions go. The person's new work is in the second sentence.",
          "None of this stops the recommendation. It does mean the recommendation must include a check on racks, a named person for fails and stops, and an honest note that bent pins will be caught later in the process.",
          "The third sentence is the one most often left out. It carries forward the hidden work from the last lesson and says where it will now happen.",
        ],
      },
      practice: {
        intro:
          "Two knock-on notes have been written for automating the task of stacking filled sacks onto pallets at Garside Animal Feeds. Choose the note that covers the neighbouring tasks and the person, as the sections above describe.",
        check: {
          kind: "choose",
          prompt: "Choose the knock-on note that describes what automating this task does to its neighbours.",
          leftLabel: "Note A",
          left: "The robot will stack eight sacks per layer and five layers per pallet, at a steady rate of one sack every eight seconds.",
          rightLabel: "Note B",
          right:
            "The sack filler before the robot must now deliver sacks flat and seam down. Split sacks, which the stacker used to put aside, will go to a new reject lane that the shift lead owns. The stacker will now change pallets, wrap full ones, and clear robot stops.",
          correct: "right",
          why: "Note B covers the task before, where the exceptions go and who owns them, and what the stacker's work becomes. Note A describes only the robot's own task.",
          wrong:
            "Look again at Note A. Every sentence is about the robot's own action, so it says nothing about the filler, the split sacks, or the stacker. Note B describes the knock-on effect.",
        },
      },
      check: {
        kind: "mark",
        prompt:
          "A robot will take the task of placing jars into cases at Wendover Preserves. Mark each sentence as Stays within this task or as Changes a neighbouring task.",
        passLabel: STAYS,
        failLabel: CHANGES,
        sentences: [
          {
            id: "labeller",
            text: "The labeller before the robot must now deliver jars upright and spaced, because the robot cannot pick jars that have fallen over.",
            fail: true,
            why: "This sentence is about the labeller, which is the task before. The robot has changed what that task must do.",
          },
          {
            id: "six",
            text: "The robot places six jars per case.",
            fail: false,
            why: "This describes the robot's own action and nothing else, so it stays within this task.",
          },
          {
            id: "chipped",
            text: "Chipped jars, which the packer used to put aside, will now go into cases and must be caught at the case check.",
            fail: true,
            why: "The chipped jars used to be caught by the packer and will now arrive at the case check, which changes a neighbouring task.",
          },
          {
            id: "packer",
            text: "The packer who did this task will now reload the case magazine and clear robot stops.",
            fail: true,
            why: "The packer now does new tasks around the robot. That is a knock-on change, not the robot's own task.",
          },
        ],
        why: "You saw where automating one task changes the work before it, after it, and for the person who used to do it, and you kept the robot's own action separate.",
      },
      bridge:
        "You now have the whole method. The next lesson draws it together and tests it on processes you have not seen before you write your own recommendation.",
    },
    {
      id: "judge-a-process",
      title: "Judge a process you have not seen",
      emphasis: "Judge",
      place:
        "This is the course assessment. It recaps the method from the first five lessons, works one mixed example, and then asks you to apply the method to eight situations you have not met before.",
      sections: [
        {
          heading: "The method, from start to finish",
          paragraphs: [
            "You start by splitting the process into tasks, each one action on one object with a clear start and end. You write the list from what people actually do, and you split any stage you find. You then give each task four facts: how often, how much it varies, how the part arrives, and what judgement it needs. Where a fact is unknown, you write not yet measured.",
            "With the facts in place, you mark each task Robot, Person, or Not yet, and you give a reason with because in it that points to one or more of the four facts. You then go back to every task marked Robot and look for the easy step that is not: a flexible or tangled part, a label that is hard to read, or hidden work such as noticing and putting aside.",
            "Finally, for each task still marked Robot, you write down the knock-on effect: what the task before must now do, what the task after must now accept, where the exceptions will go and who owns them, and what the person's work becomes.",
          ],
        },
        {
          heading: "How the method is tested",
          paragraphs: [
            "The assessment gives you eight short situations from different workplaces. Each describes a process owner at a decision point, with names, numbers, and a real document or conversation. Each question has three or four options, and every option is something a reasonable professional might do. Exactly one option follows the method this course has taught.",
            "You need six of the eight to pass. After you submit, every question shows whether your choice was right and why, so you can see which part of the method to look at again if you need a second attempt. The situations draw on every lesson, so read each one for the move it is really asking about.",
          ],
        },
        {
          heading: "Reading a situation",
          paragraphs: [
            "Most situations turn on one fact. It may be a line that names a stage, a record with an opinion in it, a part that arrives loose, a check that nobody wrote down, or a reject that has nowhere to go. Read the situation once for the story, and a second time to find that fact.",
            "Be wary of options that sound decisive but skip a step. In this course, a confident answer that is not traceable to a fact on the page is weaker than a careful one that is.",
          ],
        },
      ],
      workedExample: {
        title: "Goods in at Redmire Hardware",
        inputLabel: "The process notes",
        prompt:
          "Goods in, as described by the warehouse supervisor: 1. Unload. 2. Check the delivery. 3. Put away.\nAfter watching one morning: 1. Take a carton from the pallet. 2. Scan the carton barcode. 3. Cut the carton open. 4. Count the items against the delivery note and record any shortage. 5. Place items in a tote. 6. Take the tote to the pick face.\nCartons: about 350 a day, eleven different sizes, stacked on the pallet in any order, some with the barcode on the underside.",
        outputLabel: "The marked process and its weak points",
        output:
          "Task 2: Not yet, because the barcode is sometimes on the underside, so the carton must be turned first.\nTask 3: Person, because the carton sizes vary and the operator avoids cutting the contents.\nTask 4: Person, because counting against the note needs judgement when a shortage is found.\nTask 1: Not yet, because cartons arrive stacked in any order and in eleven sizes.\nEasy step that is not: task 3 looks simple, but the operator adjusts the depth of cut to each carton and stops if she sees the contents.\nKnock-on if task 2 were automated: the unloader would have to turn every carton barcode up, and missed scans would need a person to deal with them.",
        reading: [
          "Dev Mistry, the site manager, started from the supervisor's three stages and split them into six tasks by watching one morning. The facts he gathered show why none of the tasks is a clear Robot yet.",
          "The Not yet marks each name what stands in the way, which gives Dev something to ask the suppliers about. A request for barcodes on two faces of every carton might turn task 2 into a robot task at almost no cost.",
          "The easy step that is not, cutting cartons open, would have been marked Robot by anyone who had not watched the operator adjust the knife. The knock-on note shows that even the most promising task would add work upstream.",
        ],
      },
      practice: {
        intro:
          "Before the assessment, try one question in the same form. Choose the next step that follows the method for this situation.",
        check: {
          kind: "choose",
          prompt:
            "Aisha Kaur at Lindum Plastics has a task list for the moulding cell. One line reads 'Deflash and inspect'. A supplier has offered a robot to take that line. Choose the next step that follows the method.",
          leftLabel: "Step A",
          left: "Watch the operator and split 'Deflash and inspect' into its tasks, then give each one its four facts before marking any of them.",
          rightLabel: "Step B",
          right: "Mark 'Deflash and inspect' as Robot, because the supplier has offered a robot for it, and move on to the knock-on effect.",
          correct: "left",
          why: "'Deflash and inspect' is a stage that joins trimming, which may suit a robot, with inspection, which needs judgement. Splitting it and gathering the facts comes before any mark.",
          wrong:
            "Look again at Step B. 'Deflash and inspect' is a stage, and a supplier's offer is not one of the four facts. Split the stage and gather the facts before marking anything.",
        },
      },
      check: {
        kind: "scenario",
        prompt:
          "Read each situation and choose the option that follows the method this course has taught. You need six of the eight to pass.",
        passMark: 6,
        questions: [
          {
            id: "stages",
            situation:
              "Priya Nair runs the finishing area at Holt Ceramics. Her operations director has asked where a robot could go, and Priya's first list reads '1. Glazing. 2. Firing. 3. Packing.' The director wants an answer at Thursday's meeting.",
            question: "What should Priya do before Thursday?",
            options: [
              {
                id: "pick-packing",
                text: "Recommend packing, because packing is where robots are most often used.",
                feedback:
                  "Packing is a stage, and it contains tasks with very different characteristics. Recommending it tells the director nothing about which piece of work a robot would take. Watch the work and split the stages first.",
              },
              {
                id: "watch-split",
                text: "Watch each stage for at least one cycle and rewrite the list as one action on one object per line.",
                correct: true,
                feedback:
                  "Yes. The list names stages, and nobody can judge a stage. Splitting it by watching gives Priya tasks she can time, record facts for, and mark.",
              },
              {
                id: "ask-supplier",
                text: "Send the three stages to a robot supplier and ask which one they would automate.",
                feedback:
                  "A supplier cannot judge a stage any better than Priya can, and their answer will reflect what they sell. The move is to split the stages into tasks from what people actually do.",
              },
            ],
          },
          {
            id: "opinion",
            situation:
              "Dan Webb is recording facts for the task 'place tins on the labeller infeed' at Carrow Foods. He has written 'How the part arrives: easy, they are already on the belt.' He has not watched the infeed during a changeover.",
            question: "What should Dan write in the arrival line?",
            options: [
              {
                id: "leave",
                text: "Leave the line as it is, because the tins are on a belt and a robot can pick from a belt.",
                feedback:
                  "Easy is an opinion, and on a belt says nothing about spacing or orientation. A reader would take the line as a fact when Dan has not checked it.",
              },
              {
                id: "delete",
                text: "Delete the line, because it is not yet known.",
                feedback:
                  "Deleting the line hides the gap. Every task needs all four facts, and where one is unknown the record should say so plainly.",
              },
              {
                id: "observe",
                text: "Describe what he has seen, such as upright and single file, and add not yet measured for changeovers until he has watched one.",
                correct: true,
                feedback:
                  "Yes. The arrival line should be an observation, and not yet measured tells the reader exactly where the evidence is thin.",
              },
            ],
          },
          {
            id: "tote",
            situation:
              "At Sefton Auto Parts, the task 'place brake pads in the grinding fixture' happens 1,500 times a shift with one pad type per week and needs no judgement. The pads arrive tipped loose into a plastic tote from the press.",
            question: "Which mark and reason follow the method?",
            options: [
              {
                id: "robot",
                text: "Robot, because the volume is high and there is no judgement.",
                feedback:
                  "The volume and judgement support a robot, but the reason ignores how the pads arrive. Loose in a tote is the fact that stands in the way, so the mark should be Not yet.",
              },
              {
                id: "person",
                text: "Person, because loose parts are hard for a robot.",
                feedback:
                  "Loose parts are the only fact against a robot, and that could change. Person closes the door on a task that could become a robot task once the press delivers pads in a tray.",
              },
              {
                id: "not-yet",
                text: "Not yet, because the pads arrive loose in a tote. It could become a robot task if the press placed them in a tray in a fixed orientation.",
                correct: true,
                feedback:
                  "Yes. Not yet names the fact in the way and the change that would remove it, which gives the team a concrete upstream question to price.",
              },
              {
                id: "no-mark",
                text: "Leave the task unmarked until a supplier has seen it.",
                feedback:
                  "Every task gets a mark with a reason from the facts. The facts here are enough to mark it Not yet and name the change that would be needed.",
              },
            ],
          },
          {
            id: "neck",
            situation:
              "Callum Reid at Tay Spirits has marked 'load bottles into the labeller' as Robot: 4,000 a shift, one bottle size per run, bottles arrive upright on a conveyor. On a second visit he sees the operator run a thumb round each neck and put aside any with a chip.",
            question: "What should Callum do with the mark?",
            options: [
              {
                id: "record-hidden",
                text: "Record the neck check as hidden work, and either change the mark to Not yet or say how the check will be designed back in.",
                correct: true,
                feedback:
                  "Yes. The neck check is hidden work that would disappear with the robot. Callum must decide what happens to it rather than lose it without anybody deciding.",
              },
              {
                id: "keep",
                text: "Keep the mark Robot, because the four facts on the list still support it.",
                feedback:
                  "The four facts on the list were right, but the list missed the neck check. Keeping the mark and saying nothing loses that check without anybody deciding to lose it.",
              },
              {
                id: "person",
                text: "Change the mark to Person, because any task with a check in it should stay with a person.",
                feedback:
                  "A check does not automatically make a task a Person task. Callum can mark it Not yet or say how the check will be designed back in. What matters is that the hidden work is recorded and decided on.",
              },
            ],
          },
          {
            id: "supplier",
            situation:
              "A supplier has told Helen Ford at Brackley Fixings that their vision system makes picking washers from a mixed bin easy. Helen's record says the washers arrive tangled and overlapping in a bin of about 2,000, in four sizes.",
            question: "How should Helen treat the supplier's claim?",
            options: [
              {
                id: "accept",
                text: "Mark the task Robot on the supplier's word, because they know their equipment best.",
                feedback:
                  "What a supplier says is not one of the four facts, and tangled parts are one of the typical easy steps that are not. Helen needs evidence on her own parts before the mark can change.",
              },
              {
                id: "reject",
                text: "Mark the task Person and decline the conversation, because bin picking never works.",
                feedback:
                  "The mark is a claim about this task today, not a permanent judgement. Bin picking works on some sites, so the honest move is to ask for evidence rather than rule it out.",
              },
              {
                id: "trial",
                text: "Mark the task Not yet, and record a trial on her own washers from her own bins as evidence still needed.",
                correct: true,
                feedback:
                  "Yes. The facts point to a hard pick, and the supplier's claim can be tested. A trial on Helen's own parts is the evidence that would change the mark.",
              },
            ],
          },
          {
            id: "rejects",
            situation:
              "Tom Asante's recommendation at Kestrel Pet Foods automates placing pouches into cartons. Today the packer puts aside any pouch with a weak seal. His knock-on section says only that the robot will fill twelve cartons a minute.",
            question: "What is missing from Tom's knock-on section?",
            options: [
              {
                id: "speed",
                text: "A second figure for the robot's speed during changeovers.",
                feedback:
                  "That is still about the robot's own task. The section says nothing about where weak seals will go or what the packer's work becomes.",
              },
              {
                id: "neighbours",
                text: "Where weak-seal pouches will now go and who owns them, and what the packer's work becomes.",
                correct: true,
                feedback:
                  "Yes. The packer's check was hidden work, and without it weak seals will travel down the process. The section must say where they go, who owns them, and what the packer does instead.",
              },
              {
                id: "cost",
                text: "The cost of the robot and the saving in labour.",
                feedback:
                  "Costs belong in a later investment request. The knock-on section is about the tasks around the robot and the person, and Tom's describes neither.",
              },
            ],
          },
          {
            id: "challenge",
            situation:
              "Nadia Hussain has shared her recommendation for the dispatch area at Orwell Books. Her colleague Sean argues that task 5, sealing the mailer, should not be marked Robot. Nadia's record says 700 a shift, two mailer sizes, arriving flat on a bench, no judgement.",
            question: "How should Nadia respond?",
            options: [
              {
                id: "defer",
                text: "Change the mark to Person to keep the peace, since Sean works in dispatch.",
                feedback:
                  "Changing a mark without a fact leaves the recommendation weaker, not safer. Ask Sean which fact he disagrees with, and change the mark only if the fact changes.",
              },
              {
                id: "insist",
                text: "Keep the mark, because the recommendation has already been circulated.",
                feedback:
                  "A recommendation you could defend is one that can be challenged. If Sean has seen something Nadia has not, such as hidden work, the mark should change.",
              },
              {
                id: "fact",
                text: "Ask Sean which of the four facts he thinks is wrong, and go and watch the task with him if he has seen something she has not.",
                correct: true,
                feedback:
                  "Yes. Every mark is traced to facts, so a disagreement becomes a question about a fact that can be checked, and watching together may reveal hidden work.",
              },
              {
                id: "escalate",
                text: "Ask the operations director to decide between them.",
                feedback:
                  "The director has no better basis to decide than the facts on the page. The quicker move is to find which fact Sean disputes and check it.",
              },
            ],
          },
          {
            id: "evidence",
            situation:
              "Grace Olu is finishing her recommendation for Hanley Textiles, which automates folding hand towels. She has one supplier video of the robot folding a different towel, and no count of how many towels arrive twisted from the dryer.",
            question: "What should Grace write in the evidence still needed?",
            options: [
              {
                id: "video",
                text: "Nothing, because the supplier video shows the robot can fold towels.",
                feedback:
                  "The video shows a different towel in someone else's conditions. Towels are soft and flexible, so Grace needs evidence on her own towels as they come from her own dryer.",
              },
              {
                id: "trial-count",
                text: "A trial on Hanley's own towels as they leave the dryer, and a count of twisted towels over at least two weeks.",
                correct: true,
                feedback:
                  "Yes. Each item names a trial or a measurement that would confirm or overturn the recommendation, and both address the facts that are not yet measured.",
              },
              {
                id: "approval",
                text: "Approval from the finance director.",
                feedback:
                  "Approval is a later decision, not evidence. The evidence section names the trials and measurements that would show whether the recommendation holds.",
              },
            ],
          },
        ],
        why: "You applied the method to processes you had not seen: splitting stages, recording observations, marking with reasons, finding hidden work, following the knock-on effect, and naming the evidence still needed.",
      },
      bridge:
        "You have shown you can use the method on other people's processes. In the last lesson you write the recommendation for a process of your own, and that recommendation is the work your record will show.",
    },
    {
      id: "the-recommendation",
      title: "The recommendation",
      emphasis: "recommendation",
      place:
        "This is the final lesson and the fourth module. You write the artefact, a recommendation for where a robot belongs in one process you own, built from the work of every earlier lesson.",
      sections: [
        {
          heading: "What the recommendation is",
          paragraphs: [
            "The recommendation is a short document that says where, if anywhere, a robot belongs in this process and why. It has five parts. The first is the process and its task list, with each task marked Robot, Person, or Not yet and a reason. The second is the task you recommend, or a plain statement that no task should be automated yet. The third is the easy step that is not, if there is one, and what makes it hard. The fourth is the knock-on effect on the neighbouring tasks and on the person. The fifth is the evidence still needed before anyone commits, such as a trial on your own parts or a measurement of exceptions.",
            "A recommendation you could defend is one where every claim can be traced back to a fact on the page. A sceptical manager may disagree with a mark, but to do so they have to disagree with a specific fact, and that is a conversation you can have. In the practice below, a line that points to a recorded fact is traceable to a fact, and a line that asserts something with no fact behind it is a claim with nothing behind it.",
          ],
        },
        {
          heading: "What the recommendation is not",
          paragraphs: [
            "It is not a business case, and it does not need prices, although a later investment request should build on it. It is not an engineering design, a safety sign-off, or a risk assessment for an installation. Those come later, from people with the authority to give them, and your site's written procedures always take precedence over anything in this course.",
            "It is also not a vote for automation. A recommendation that says no task should be automated yet, and names the upstream change that would alter that, is a complete and useful recommendation. It saves the organisation from buying a robot for a process that is not ready for one.",
          ],
        },
        {
          heading: "Writing each part",
          paragraphs: [
            "Write the task list as numbered lines, and write each mark with because and a reason from the four facts, such as 'Task 3: Not yet, because the rolls arrive piled and touching.' Recommend a task you marked Robot, or explain why a Not yet task should be tackled first, or say plainly that nothing should be automated yet.",
            "For the easy step that is not, name the step and say what makes it hard, whether that is a flexible part, a tangled pick, a hard label, or hidden work. If you found none, write none found and say what you checked. For the knock-on effect, name at least one neighbouring task and say what the person who did the task will do instead. For the evidence, name at least one trial or measurement, with a number where you can.",
          ],
        },
        {
          heading: "How the recommendation is checked",
          paragraphs: [
            "When you continue, each part is checked in turn. The task list must contain numbered tasks and at least one mark written with because. The recommended task must say what to automate, or that nothing should be automated yet. The easy step must name a difficulty or hidden work, or say none found. The knock-on effect must say what happens to the person whose work changes. The evidence must name a trial, a count, or a measurement.",
            "Do not put anything confidential into the recommendation. It will appear on a record that a second person can open, so use names and figures you would be comfortable showing, or replace them with realistic examples that keep the same shape.",
          ],
        },
      ],
      workedExample: {
        title: "Ruth's recommendation for board test at Calder Electronics",
        inputLabel: "The facts gathered in this course",
        prompt:
          "Six tasks in the test stage. Tasks 1, 2, and 5: about 400 a shift, two board types changed weekly, boards in racks one per slot, no judgement. Task 4: operator reads pass or fail. Task 6: failed boards need a written fault tag. Hidden work: operator notices bent pins at task 2. Racks sometimes damaged.",
        outputLabel: "The recommendation",
        output:
          "Process and task list: board test, six tasks. Tasks 1, 2, and 5: Robot, because they are frequent, presented in racks, and need no judgement. Task 3: Robot, because it is a single button press on every board. Task 4: Person, because an operator reads the result. Task 6: Person, because failed boards need a written fault.\nThe task I recommend: automate tasks 1, 2, 3, and 5 as one robot task.\nThe easy step that is not: none found in handling, but bent pins are currently noticed at task 2 and would be lost.\nThe knock-on effect: racks must be checked for damage before loading; the operator becomes responsible for fails and robot stops; bent pins will be caught by the tester instead.\nEvidence still needed: a trial of 500 boards on our own racks, and a count of bent pins over one month.",
        reading: [
          "Every line refers to a fact already gathered. The marks carry reasons, the recommended tasks are the ones marked Robot, and the hidden work from lesson four has been carried through rather than dropped.",
          "The knock-on section names the task before, the rack check, and says what the operator's work becomes. The evidence section names a trial and a count, each with a number.",
          "A sceptical manager could disagree with a mark, but they would have to disagree with a specific fact to do it. That is what makes this a recommendation Ruth could defend.",
        ],
      },
      practice: {
        intro:
          "Here are four lines from a draft recommendation for the returns bench at Kenley Homeware. Mark each line as Traceable to a fact or as A claim with nothing behind it. The paragraph on what makes a recommendation defensible is above.",
        check: {
          kind: "mark",
          prompt: "Mark each line as Traceable to a fact or as A claim with nothing behind it.",
          passLabel: TRACEABLE,
          failLabel: NOTHING_BEHIND,
          sentences: [
            {
              id: "scan",
              text: "Task 2, scan the returns label: Robot, because it happens about 1,200 times a day and every label is printed in the same place on the bag.",
              fail: false,
              why: "The reason gives a count and says where the label is, so it is traceable to a fact.",
            },
            {
              id: "obvious",
              text: "The task I recommend: the sorting stage, because it is the obvious place to start.",
              fail: true,
              why: "Sorting is a stage, and obvious is not a fact. The recommendation should name a task marked Robot and its reason.",
            },
            {
              id: "stains",
              text: "The easy step that is not: task 4, folding returned clothing, because the garments are soft and the packer also checks each one for stains.",
              fail: false,
              why: "This names the task, the soft part, and the hidden stain check, so it is traceable to what was observed.",
            },
            {
              id: "fine",
              text: "Evidence still needed: none, because the team is confident it will work.",
              fail: true,
              why: "Confidence is not evidence. The line should name a trial or a measurement that would show whether the recommendation holds.",
            },
          ],
          why: "That is right. The scanning and folding lines each point to something observed, and the sorting and evidence lines rest on words like obvious and confident that nobody could check.",
        },
      },
      check: {
        kind: "build",
        prompt:
          "Write the recommendation for one process you own. Fill in all five parts, and make each part traceable to the facts you gathered in this course.",
        fields: [
          {
            id: "tasks",
            label: "Process and task list with marks and reasons",
            hint: "Name the process, then list the tasks with numbers. Give each task a mark of Robot, Person, or Not yet, written with because and a reason from how often, how much it varies, how the part arrives, or what judgement it needs.",
            min: 80,
            rule: "fact",
            any: [
              "robot because",
              "robot, because",
              "person because",
              "person, because",
              "not yet because",
              "not yet, because",
            ],
            missing:
              "Some tasks in your list have a mark but no reason, or the list has no marks yet. Number the tasks and write each mark with because and a reason, for example 'Task 3: Not yet, because the rolls arrive piled and touching.'",
          },
          {
            id: "recommend",
            label: "The task I recommend",
            hint: "Name the task or tasks marked Robot that you recommend automating, or explain why a Not yet task should be tackled first, or say that nothing should be automated yet.",
            min: 20,
            any: ["automate", "robot", "not yet", "nothing", "no task"],
            missing:
              "Your recommended task does not yet say what to automate. Recommend a task you marked Robot, explain why a Not yet task should be tackled first, or say plainly that nothing should be automated yet.",
          },
          {
            id: "easy-step",
            label: "The easy step that is not",
            hint: "Name the step that looks easy for a machine but is not, and say what makes it hard. If you found none, write none found and say what you checked.",
            min: 20,
            any: [
              "hidden",
              "soft",
              "flexible",
              "tangle",
              "overlap",
              "deform",
              "notic",
              "inspect",
              "check",
              "put aside",
              "puts aside",
              "none found",
              "label",
              "handwrit",
              "loose",
              "crack",
              "chip",
              "damage",
            ],
            missing:
              "Your easy step does not yet name a difficulty. Name one step and say what makes it hard, such as a flexible part or hidden work like a check nobody wrote down, or write none found and say what you checked.",
          },
          {
            id: "knock-on",
            label: "The knock-on effect",
            hint: "Say what the task before and the task after must now do, where the exceptions will go, and what the person who did the task will do instead.",
            min: 30,
            any: [
              "operator",
              "packer",
              "picker",
              "person",
              "their work",
              "his work",
              "her work",
              "becomes",
              "who did",
              "team",
              "staff",
              "colleague",
              "role",
              "job",
            ],
            missing:
              "Your knock-on field does not mention the person who did the task. Say what their work becomes, as well as what changes in the neighbouring tasks.",
          },
          {
            id: "evidence",
            label: "Evidence still needed",
            hint: "Name at least one trial or measurement still needed before anyone commits, with a number where you can.",
            min: 20,
            any: ["trial", "measure", "count", "test", "study", "record", "sample", "observ", "pilot", "weigh", "watch"],
            missing:
              "Your evidence field does not yet name a trial or a measurement. Name at least one, such as a trial on your own parts or a count of exceptions over a set period.",
          },
        ],
        why: "Your recommendation marks every task with a reason, names what to automate, looks for hidden work, describes the knock-on effect on the neighbouring tasks and the person, and says what evidence is still missing. You could defend it.",
      },
      bridge:
        "Your recommendation is ready. Sign your name below, and the record will show it, the course, and the date to anyone who opens the reference, as the work you wrote in this course and not as an engineering, safety, or financial approval.",
    },
  ],
};
