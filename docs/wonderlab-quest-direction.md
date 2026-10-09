# Wonderlab needs worlds with things to do.

## Why the current experience is failing

The player makes a plan, presses a button and then encounters another interaction mode. The world does not clearly communicate whether the next tap will move a character, build something or remove something. Improving the scenery leaves that underlying confusion in place. A successful automated test also arrives too late to make selecting route squares feel like an adventure.

The latest direction is an original top-down adventure, with Pokémon as a reference for exploration, a travelling companion, character encounters and collectible discoveries. The player arrives somewhere, meets someone who needs help, explores, uses tools and leaves the place changed. Wonderlab's characters, places, creatures, artwork and interface remain original.

The learning is the means of making progress. Checking a source can reveal why a greenhouse has stopped working. Improving instructions can make an invention behave as intended. A private collection records what the learner created or repaired. The reward should be visible in the world, rather than only appearing as a tick below a form.

## The game should fill the mobile screen

The target experience puts the explorable world across the available phone screen. A compact objective, companion, dialogue panel and interaction button sit inside that game view. Keep the character and the object being used visible when dialogue or controls open. Account navigation and parent explanations belong outside the active play area. The learner should not need to scroll between the world, an instruction form and its result.

Use large touch controls, safe spacing around phone edges and the same clear interaction vocabulary on desktop. Movement explores the world; an interaction button talks, inspects or operates the nearby object. Discoveries enter a small field notebook, and completing a quest changes a place or adds an original collectible. These are design targets to test on real phones, including portrait layouts, text enlargement and reduced motion.

## The first playable experiment

Fernwood Garden is the single playable prototype of that direction. It tests one learning objective: a confident AI answer still needs checking against relevant evidence, and a previously successful answer can become wrong when the task changes.

The player meets Rowan, explores a garden, sees Pip's prepared AI answer and collects care clues. The player then changes physical water, shade and drainage controls. Running the machine carries out the entire plan automatically. The visible flower responds to those settings. A different flower arrives with different needs, and the player operates the same machine again. Completing that fresh test earns a moonflower for the quest garden.

The garden's plants and care rules are fictional. The machine is an authored simulation that follows fixed instructions. Its prepared AI example illustrates unreliable advice; it is not a live model. The prototype does not send learner input to an AI provider or establish that a child has mastered an AI skill.

The prototype model lives in `lib/wonderlab/quest.ts`. It records explored places, collected evidence, chosen controls, tests and the fresh challenge. It restores a local action log by replaying valid actions. It does not change membership access, save family learning records or replace the existing lessons. Those integrations need explicit implementation and verification after this interaction is tested.

## The controls should have one meaning

- Tapping a place moves the player towards it and introduces its interaction. It never silently removes an object.
- Choosing a machine setting sets that control. Choosing it again leaves it selected.
- Pressing the machine's start button runs the complete process. The learner does not click through the same instructions again.
- The world remains visible while someone speaks. Dialogue is short enough to follow beside the relevant object.
- A failed test changes the world in a way that explains the problem. The player can inspect the relevant clue and retry without losing their work.
- Editing or removing a built object requires a labelled tool and a reversible action. Movement and construction must not share an ambiguous toggle.
- Every world interaction also has a keyboard control and a named, accessible action. Reduced motion shows the same sequence of results without continuous movement.

## Each age group needs its own experience

| Age   | World and player role                                                                                 | How the player acts                                                                                     | How teaching appears                                                                                                                                          | Appropriate challenge                                                                            |
| ----- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 4–6   | A small living garden with Pip and one neighbour who needs help.                                      | Tap a large destination, collect a pictured clue and use two large machine controls.                    | Pip demonstrates one action, describes the visible result and offers a replay. An adult can read alongside the child.                                         | Remember two clues and adapt one familiar action when a new object arrives.                      |
| 7–10  | Connected invention islands with a personal workshop.                                                 | Explore a compact area, collect components, assemble an invention and test it in the world.             | Pip points to the relevant object after a mistake and asks the learner to compare it with a clue.                                                             | Combine three requirements, repair a failed invention and use the same checking habit elsewhere. |
| 11–13 | A lively illustrated district with mysteries, studios and characters whose claims need investigating. | Choose which lead to follow, inspect records, alter a system and observe how the district responds.     | A companion helps compare claims with evidence and offers hints when requested.                                                                               | Resolve contradictory information and explain a useful revision through the actual changes made. |
| 14–16 | A creative district with commissions, research spaces and practical projects.                         | Negotiate a brief with fictional clients, build a useful prototype and test it against competing needs. | The guide asks focused questions about assumptions, evidence and testing. Optional bounded AI support must use the established account and provider controls. | Make and justify a trade-off, test the result and revise it when requirements change.            |

Fernwood currently shares one garden across four age settings: two controls and adult support for the youngest children, three requirements for older children, contradictory advice for young teens and a resource constraint for older teens. The future worlds in the table are separate design work. Progression should bring more freedom to explore, richer character encounters and harder decisions, while retaining a readable game view and useful companion. Changing the text alone does not create four age-appropriate games.

## Reimagine the curriculum as quests

The following are quest briefs to author and test, not claims that 24 new games already exist.

| Level | Quest                        | What the learner does in the world                                                                                       | What the action teaches                                                                     |
| ----- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| 4–6   | Pip's Picnic Parade          | Guide picnic items towards pictured homes and inspect a robot's wrong guess.                                             | A computer's guess can be wrong, and visible clues help us check it.                        |
| 4–6   | The Helpful Watering Machine | Move between the water and shade clues, set two controls and watch the whole machine run.                                | Instructions need to match the thing we are trying to help.                                 |
| 4–6   | The Story Tree               | Bring characters and props to a small stage, choose an event and watch the scene play.                                   | We can make creative choices and change a computer-assisted result.                         |
| 4–6   | The Mixed-up Museum          | Explore a tiny exhibition and return mistaken labels to the objects they describe.                                       | A confident answer needs checking against what we can see.                                  |
| 4–6   | Pip's Pretend Post Office    | Pack fictional picture cards for a message, keeping private cards in a treasure box.                                     | Some information needs a trusted adult's help before sharing.                               |
| 4–6   | My Garden Helper             | Assemble a helper from large parts and test it on a new garden job.                                                      | We can describe a useful task, try our instructions and change them.                        |
| 7–10  | Creature Crossing            | Explore habitats, choose example creatures and test the sorting gate on unfamiliar arrivals.                             | Learning from examples differs from following a fixed instruction.                          |
| 7–10  | The Creature Expedition      | Collect habitat clues, describe a suitable companion and equip it for an expedition.                                     | A useful request includes the requirements that matter.                                     |
| 7–10  | Comic Motion Workshop        | Direct characters in a small animated scene, inspect a mismatch and revise the sequence.                                 | A first creative result can be improved by comparing it with the intended story.            |
| 7–10  | The Missing Festival         | Interview fictional organisers and repair an unreliable announcement using their records.                                | Claims need supporting evidence before we repeat them.                                      |
| 7–10  | The Message Workshop         | Repair fictional messages before sending them through a visible practice machine.                                        | Personal details can be removed while keeping the useful task clear.                        |
| 7–10  | Build Club Day               | Equip a hobby workshop, ask for a plan, then run a simulated club session.                                               | A plan needs testing against time, materials and the people using it.                       |
| 11–13 | The Guessing Arcade          | Investigate a sorting exhibit, change its examples and test what it gets wrong.                                          | Training examples affect a pattern-based system's predictions.                              |
| 11–13 | The Greenhouse Investigation | Compare an AI care plan with evidence, reconfigure a machine and test another plant.                                     | Clear instructions still require evidence and testing.                                      |
| 11–13 | Worldsmith                   | Design a district, place inhabitants and objects, then test whether generated descriptions fit its rules.                | Generated creative material needs consistent constraints and human revision.                |
| 11–13 | Signal City Newsroom         | Follow leads, inspect fictional records and decide what can appear on the district's news board.                         | Repetition and confidence do not establish that a claim is true.                            |
| 11–13 | The Permission Heist         | Investigate a fictional app's access points and close permissions that its task does not need.                           | Permissions and personal information affect what a tool can access.                         |
| 11–13 | The Revision Forge           | Build a practice challenge from supplied material and play it to uncover a faulty answer.                                | AI-generated study activities need checking against the source.                             |
| 14–16 | Festival Control             | Run a small event by assigning jobs to a person, AI or a conventional tool.                                              | Different tasks need different kinds of assistance and oversight.                           |
| 14–16 | The Creative Commission      | Explore a client's space, identify constraints and direct a prototype through a test session.                            | A useful brief includes context, limits and observable success conditions.                  |
| 14–16 | Game Jam                     | Build a branching scene, play it as a visitor and repair a choice that breaks the story.                                 | Generated work improves through playtesting and precise revision.                           |
| 14–16 | The Investigation Desk       | Follow a proposed brief's citations through a fictional archive and repair unsupported claims.                           | A plausible citation must actually support the claim beside it.                             |
| 14–16 | Launch Night                 | Inspect a fictional project before its simulated release, repairing privacy, permission and misleading-content problems. | Responsible publication requires checking content and rights as well as technical function. |
| 14–16 | My Useful Machine            | Build a study, hobby or club tool and run changing scenarios against it.                                                 | Useful AI-assisted work has limits that should be tested and explained.                     |

## Pip should teach during the work

Pip needs access to meaningful game events: the clue just inspected, the machine setting changed, the visible failure and whether a hint was used. Pip should respond beside the relevant object rather than requiring the learner to leave the world and read another page.

Fernwood currently uses prepared guidance, not a live AI tutor. The planned companion responds to what the learner is doing without taking them out of the world. For older eligible accounts, optional bounded AI guidance could explain approved game context under the existing entitlement, parental enablement, moderation, usage and provider controls. That integration remains future work for this prototype.

Use a demonstration before the first unfamiliar action, a specific explanation after a failed test and progressively lighter help as the learner succeeds. The fresh challenge should not show the answer automatically. The player can still ask for help, and any later parent insight should distinguish a supported attempt from an independent one.

## How to decide whether this is worth expanding

Observe families using the prototype before converting the catalogue. Check whether a child can identify their task, travel to a useful place, understand what a tap will do, run the machine without extra movement clicks and explain why the result changed. Watch whether they choose to explore or retry without being told to continue.

For the learning check, ask the player to handle the second plant and describe which clue changed their plan. Record only the evidence that actually occurred: the sources inspected, changes made, retries, hints and success on the new task. Do not interpret speed, clicks or completion as intelligence or professional competence.

The production art and engine should follow the validated interaction. Phaser is a candidate for a richer animated world, while React remains useful for the surrounding accounts and accessible controls. A third-party generator can help prototype scenes or assets; it cannot decide whether the learning loop makes sense, remove the need for source review or justify shipping 24 untested copies of one mechanic.
