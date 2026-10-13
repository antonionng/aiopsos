# Wonderlab: forty adventures that teach children to create with AI

Planning proposal, 9 October 2026. Curriculum revised on 10 October after family feedback: children could not clearly explain the app's purpose, and abstract task language obscured the AI learning. The new priority is practical creation: using AI to make presentations, stories, designs, games, websites and useful tools, with age-appropriate productivity and enterprise projects. All world and game names below are working titles. This document proposes a new first-person direction. It does not describe features already built or change the live platform.

## 1. The product we should make

Wonderlab becomes a collection of magical first-person adventures in which children learn to create with AI. There are four distinct age worlds and ten substantial, replayable games in each world. Each adventure leads to something the learner can keep and use, such as a picture book, slide presentation, playable game, website or working app. The worlds share an engine, account system and production tools.

The parent promise is: **Your child will learn how to use AI to turn their ideas into things they can use, from stories and presentations to games, websites and apps. As they grow, they will learn to save effort on routine tasks, build useful projects and explore how their skills can create value for other people.** Fiction makes these projects interesting to attempt. Every adventure names the practical ability and the finished creation before production starts.

The child-facing introduction starts with the purpose: “In Wonderlab, you will learn how to make things with AI. You can create stories, design things, build games and bring your own ideas to life.” Immediately show an age-appropriate creation the child can use. For the youngest children, split this introduction into short spoken turns alongside the actions. A particular game opens with a concrete promise such as “Today you will make a game that you can play.”

The central progression is from having an idea, to asking for useful assistance, to making and using the result, to adapting it for a new purpose. Understanding limitations, checking information and protecting privacy are taught when they matter to that project. They are essential supporting skills, not the main product promise or the subject of every adventure.

Prompting and revising a request run through all forty games. Players learn to express what they imagine, see how the helper interprets it, add a useful detail or change direction, and make something they want to use. We teach this through visible changes to a creation and its behaviour. There is no single perfect prompt to memorise and no score for merely including prescribed words.

Older learners also explore enterprise: finding a real need, making a useful prototype, explaining its value, understanding costs and responding to feedback. The aim is to develop useful capabilities and economic opportunity. Completion never implies guaranteed income. Younger children can practise these ideas through pretend shops and fictional customers; real sales and public publishing remain parent-managed.

Keep the agreed £20 per month, per child membership, covering all released Wonderlab games. Preserve existing complimentary lifetime access. Show which worlds and games are actually available; forty is the proposed catalogue, not a current availability claim. Authored play remains available without live generation, and the membership must explain any live-AI allowance clearly.

Each child owns a private home within their age world. Their workshop, garden, skyboat or studio changes as they finish projects. They return to useful creations they made, characters they helped and places they restored. A beautiful world needs things worth doing: building, investigating, experimenting, performing, organising and adapting to surprises.

## 2. The creative references should shape the experience

The requested references guide our design judgement:

- Rockstar-style attention to place means characters have routines, locations tell stories and completed work has visible consequences.
- Skyrim-inspired exploration means a distant observatory, curious sound or unusual object can lead to a worthwhile discovery.
- The Sims-inspired creativity means the child makes spaces and systems, then watches fictional residents use them.
- RuneScape-inspired progression means skills unlock useful tools and connected quests build a sense of belonging.
- The earlier Pokémon reference contributes a travelling companion, memorable places and discoveries worth collecting.

Wonderlab uses original characters, environments, music, creatures and interface design. The production scope is four compact, richly interactive worlds. Dense locations, good animation, responsive sound and meaningful interactions take priority over a vast landscape.

The common visual direction is stylised 3D: readable silhouettes, hand-painted textures, expressive creatures, warm lighting and tactile objects. Younger worlds are soft and bright. Teen worlds use more atmospheric architecture, subtle colour and sophisticated character design. First-person hands and tools provide immediate feedback when opening a book, building a device or testing an invention.

The main activities must be enjoyable to perform. At an arcade cabinet, the player edits a game and immediately plays the changed version. In the lantern theatre, they arrange their own slides and use the finished presentation to explain an idea. At a city studio, they build a tool and see fictional residents use its actual functions. Exploration supplies interesting characters, discoveries and reasons to create. The workbench belongs in that place, and the finished project changes it. Reading and dialogue support making and playing; a room containing a sequence of multiple-choice panels does not meet the design brief.

### Choose a character, then unlock the Avatar Forge

Every child chooses and customises an original avatar at the start. Offer expressive human, robot and fantasy character families with appropriate hairstyles, skin colours, clothing, accessories and assistive items. Identity choices and a useful wardrobe are available immediately. Players can change their appearance later without losing their projects or progress. Appearance does not change movement difficulty or access to learning.

First-person play still gives the avatar a presence. Show matching hands and sleeves, a wardrobe mirror, a character portrait and a private celebration scene after a project. Mirrors and previews can show the full body without changing the main gameplay perspective. Younger characters use softer proportions and playful animation; teen characters use more mature silhouettes, clothing and gestures within the same original art direction.

Proposed progression: after three completed creations and a supported exercise in describing and changing an idea, open the Avatar Forge. Validate this threshold with families rather than making a child repeat tasks for points. The reward is a new creative tool. It does not remove basic customisation from beginners or require an additional purchase.

The player can request: “Make a moon explorer with a green coat and silver boots.” Then they can revise it: “Keep the coat and boots, but replace the hat with a leaf crown.” The before-and-after preview identifies what changed. Manual editing, undo and saving favourite versions remain available. A request the system cannot support receives an understandable explanation and suitable alternatives instead of a false success message.

For ages 4–6, picture choices assemble a request and read it aloud. Ages 7–10 add more descriptive details and targeted revisions using prepared practice combinations. Ages 11–16 can use parent-enabled live AI to interpret a description and a follow-up request. Reaching a game level never overrides the existing age, parent and provider controls. Creations use imagined character descriptions; no selfie, real name or face scan is needed. The profile and saved looks remain private.

The recommended initial implementation is an original modular GLB avatar, with a compatible skeleton and tested clothing pieces. The AI proposes a structured appearance recipe made of approved part IDs, colours and supported settings. The server validates that recipe before applying it. This is AI-assisted character design and assembly, not generation of a complete new 3D body from scratch. Babylon supports skeletal animation and morph targets for such a system; integration and mobile performance still require prototyping. [Babylon.js capabilities](https://www.babylonjs.com/specifications/)

Use Blender and rigging tools to prepare the character families, then optimise meshes and textures through the asset pipeline. Generating a draft mesh does not automatically provide a usable skeleton, clothing fit or mobile performance. Later experiments can add generated emblems or patterns after the moderation, licence, age and provider arrangements for runtime images are established. Full generated meshes remain a separate production experiment. Optional VRM export can be investigated if avatar portability becomes useful; VRM's format does not grant rights to every model using it. [Rigify](https://docs.blender.org/manual/en/latest/addons/rigify/introduction.html), [glTF Transform](https://gltf-transform.dev/), [VRM format](https://vrm.dev/en/vrm/gltf/format/)

## 3. First-person play must suit each age

| Ages | World and role | Movement and interaction | Learning support and initial pacing targets |
| --- | --- | --- | --- |
| 4–6 | **Lumenwood.** A small helper brings an enchanted woodland to life. | Tap a destination to approach it. The camera faces the important object. Large objects are within reach. No simultaneous camera and movement demands. | Adult-supported play, spoken instructions, pictures and one action at a time. Three short scenes, with about 20–30 minutes including breaks or an offline activity. |
| 7–10 | **Asterhaven.** An apprentice maker helps rebuild a floating town. | Tap-to-walk remains available. Optional independent movement and looking around. A few meaningful tools can be picked up, placed and used. | Short demonstrations followed by room to experiment. Three chapters, roughly 30–45 minutes altogether, with natural stopping points. |
| 11–13 | **The Tideglass Isles.** An explorer restores a mysterious archipelago. | Free first-person exploration, inspection tools, a small inventory and hands-on construction. Assisted movement remains available. | Investigations with multiple leads, optional hints and bounded AI assistance where enabled. Chapters of around 8–12 minutes within longer adventures. |
| 14–16 | **Lumenfall.** A maker and investigator changes a living twilight city. | Free exploration, practical tools, workspaces and systems the player can build and test. | More independent projects, competing requirements and decisions to explain. Multi-session games with saved checkpoints. |

These are design targets to validate with families. Reading age, motor comfort and access preferences can differ from chronological age. Parents can choose suitable support without putting children on a public ability ladder.

On mobile, play fills the available screen. Native fullscreen is requested where available, with a browser-window fallback. Portrait remains usable; landscape can offer a wider view. Account navigation stays outside active play. A compact objective, nearby character dialogue, inventory and one clearly named interaction remain within the game view.

### Mobile is a requirement for the entire platform

Design and verify the complete journey on a phone first: landing pages, age-world discovery, game details, parent sign-in, child selection, membership and payment screens, family settings, learning insights, private collections, project editing, downloads and gameplay. A responsive game alone is insufficient. Each core task must be possible without a desktop, mouse, hover state or physical keyboard.

Page layouts must fit narrow phone viewports without page-level horizontal scrolling, clipped controls or unreadable cards. Use a 48 CSS pixel minimum target for primary touch controls, readable text, clear focus and generous spacing. On-screen keyboards must not cover the active field, validation message or next action. Long names, enlarged text, errors, empty states and loading states are part of the mobile design, not later additions.

Gameplay uses the available viewport, including safe-area spacing around notches and home indicators, and responds when browser bars appear or disappear. Request native fullscreen only where supported and keep a complete immersive fallback. Respect the user's orientation; offer a wider landscape view without making rotation mandatory to complete the main activity. Keep exit, pause, help and sound controls reachable without covering the play area.

Provide touch movement and camera controls for older players and tap-to-approach for younger players. All interactions also have a clear touch action. A tap that inspects or moves must never accidentally remove an object. Pause movement when a project field or keyboard is active. Handle interrupted touches, app switching and orientation changes without leaving movement stuck or losing an unsaved edit. Do not capture scrolling gestures outside the active game surface.

Creative tools need their own mobile design. Slides use a clear canvas with a collapsible slide strip. Websites and games have an easy switch between editing and playing. Present one focused set of tools at a time and keep the latest creation visible. Older learners can ask for a code change through a task-specific request, inspect the changed section and use undo; a tiny desktop code editor must not be their only route. Optional source views may scroll internally, but the surrounding interface stays within the screen.

Save meaningful actions and explain whether a creation is saved, saving or waiting for a connection. Restore the project after a reload, phone interruption or sign-in change as permitted by the existing ownership model. A failed AI request must preserve the learner's request and current project. Parent insight charts, membership actions and downloads must remain usable on a small screen. Returning from a download or parent screen must not silently restart a game.

The release matrix covers small and large phones, iOS Safari, Android Chrome and tablets, in portrait and landscape. Test real devices as well as browser emulation, including a mid-range phone, constrained bandwidth, touch gestures, text enlargement and a sustained play session. Compare the full parent and child journeys with desktop to find missing actions. Mobile completion, readability, performance and save recovery are release gates for every game and surrounding platform flow.

For free movement, use a left movement control and right-side looking on touch devices, with a separate context action. Desktop supports keyboard and mouse. The youngest players use guided approach points from the same first-person perspective. No headset is required. Head bob and camera shake are off by default. Provide adjustable turn speed, reduced motion, captions, narration, pause, large targets and a stationary inspection option. Never make success depend on a difficult jump or precise camera control when the learning objective concerns AI.

Movement, inspection, building and removal have distinct controls. Selecting an existing object never silently deletes it. A test runs the whole proposed plan automatically. The child observes the result and decides what to change; they never have to click through the route they have already created.

### The gameplay and prompting must grow together

Every adventure is entered and played from a first-person perspective. The youngest players still see through their character's eyes; assisted movement changes the control demands, not the perspective. Workbenches can bring a readable editor or project preview into focus without turning the adventure into a separate course page. Flat creations such as slides and websites remain easy to read and edit.

| Ages | What makes the game engaging | How prompting develops | What changes as a result |
| --- | --- | --- | --- |
| 4–6 | Discover expressive creatures, handle large objects, make playful transformations and keep creations in a cosy home. | Build a short request using pictures and optional adult-supported words. Add one meaningful detail at a time. | A story character, animation or design visibly changes. The child can replay it immediately. |
| 7–10 | Explore a connected town, collect useful design pieces, open places, customise equipment and build things other characters use. | Explain what to make, who it is for and one or two important details. Ask for a specific change after using the result. | A game gains a new rule, a website gains a section or a presentation tells the story the child intended. |
| 11–13 | Follow mysteries across islands, discover optional projects, choose tools and personalise a skyboat. Projects create new ways to interact with places. | Give context and examples, request different approaches and follow up while preserving parts of the creation they like. | A functioning project becomes more original or useful. The player can explain how their request changed it. |
| 14–16 | Explore an atmospheric city with connected stories, branching commissions, substantial creative freedom and systems that react to their projects. | Break an ambitious idea into parts, direct AI through several revisions, combine coding and design tools and manage trade-offs. | The player builds something with multiple working features, deploys it inside the private game world and adapts it for a purpose they choose. |

Increase agency, atmosphere, interacting systems and creative depth with age. Longer instructions, extra form fields and more difficult vocabulary do not constitute a more mature game. Teen dialogue should be concise and respectful. Pip offers tools and suggestions on request and responds to meaningful actions without narrating every click.

Each world's ten adventures form an unfolding story. Side discoveries, customisation, useful equipment and changes to the home provide reasons to explore between projects. Meaningful choices can lead to different successful creations and later character responses. Basic creative tools remain available so a player can return to making without repeatedly collecting resources or completing chores.

Each game design must specify an enjoyable activity outside the editor, an interesting decision inside it and a consequence the player can experience afterwards. Exploration must reveal useful possibilities or advance a story, rather than serve as compulsory walking between panels. When a character asks for a project, the player should have a reason to care about that character or what the project makes possible.

For teen playtests, observe whether players explore without a prompt, try their own approach, revisit a creation and choose to continue after a natural stopping point. Ask what they want to build or discover next. These are signals to investigate with multiple families, not assumptions that the art style alone makes the game appealing.

## 4. Children must know they are learning to use AI

The family feedback changes the educational starting point. Clearer wording alone will not make a generic building puzzle teach AI. Children first need to experience what the AI helper does, how their interaction changes its response and why that help is useful. Checking an answer is part of this understanding, but checking alone cannot stand in for the whole curriculum.

Introduce AI in plain language: “AI is a kind of computer tool. Some AI tools spot patterns, and some help make things such as stories or pictures. They can make mistakes.” Demonstrate one relevant ability rather than explaining every kind of AI at once. Explain that real AI is developed using examples; changing a request usually changes the response for that task, rather than retraining the tool. Pattern-learning games separately label their simplified example-training activity.

The first few minutes of each game establish three things through play: what the child wants to do, what the helper can contribute, and what remains the child's decision. The child then gets to ask, observe a useful response and use it in the world. A suggestion can work on the first attempt. A game may focus on creativity, learning, choosing useful help or understanding examples without manufacturing an error that the child must repair.

Every game needs an AI interaction that matters. Its design must state what goes into the helper, what comes back and what the child learns by changing or using it. If removing the helper leaves the activity and learning unchanged, redesign it or label it as a supporting activity. Walking a route teaches navigation. A fixed command sequence can teach sequencing. Neither automatically teaches how to use a generative AI tool.

The curriculum deliberately balances understanding AI, creating with it, learning with it, communicating an idea, choosing suitable help, protecting information and recognising unreliable answers. Every age world should include successful, enjoyable uses of AI alongside its limitations. The final adventure applies these abilities to a study, hobby or everyday planning task that the child understands.

| Ages | What the learner should be able to say in their own words |
| --- | --- |
| 4–6 | “The computer helper gave me an idea. I chose what to make.” They can also recognise a simple visible mistake with adult support. |
| 7–10 | “I told the AI what I wanted to make. When I added a useful detail, its idea fitted better.” |
| 11–13 | “I can use AI to help me create or understand something, and I can explain why I used or changed its answer.” |
| 14–16 | “I can choose a useful role for AI in my own project, use it effectively and explain where I still need reliable information or human judgement.” |

These statements guide the design and are not scripts children must memorise. Observe understanding through actions and a short conversation, not a vocabulary quiz.

The story provides a reason to use the helper, while teaching stays explicit and concrete. For example:

| Abstract instruction to avoid | Instruction that names the AI action and its purpose |
| --- | --- |
| Define the requirements. | “Tell the AI what the player should collect and how they win your game.” |
| Generate an output. | “Ask the AI to help you build the first slide.” |
| Check the work. | “Play your game. Does catching a firefly add a point?” |
| Refine your prompt. | “Ask the AI to add a button that starts your game again.” |
| Validate the source. | “Before you put that fact on your slide, see what the field guide says.” |
| Reflect on your learning. | “Show me something you added to your game and explain how the AI helped.” |

Use short complete sentences, demonstrate the action beside the relevant object and speak one instruction at a time. Older learners can meet terms such as “prompt” when the term helps them recognise a real tool: “The request you give an AI tool is often called a prompt.” Younger learners do not need to learn adult project-management language to make progress.

Prepared interactions need a truthful, understandable explanation: “This is a practice AI helper. Its replies were made for this game.” Do not imply that a real model generated a live response when the game selected an authored example. A fictional character can introduce the helper, but the child should still know that real-world AI is a computer tool, not magic or a person.

Every game definition contains:

1. A child-facing purpose and a parent-facing developmental outcome.
2. A distinctive activity that the player performs in first person.
3. A demonstration of the first unfamiliar action.
4. A visible AI interaction, its useful contribution and a reason the skill matters beyond the fictional problem.
5. Useful feedback shown through the world and explained in plain language.
6. A fresh challenge with a new situation, so the learner can apply the AI idea rather than repeat a remembered answer.
7. A saved, usable creation and a visible world change. A badge or screenshot alone is not the finished project. Include an age-appropriate private download or replay and a new topic the learner can build for.
8. Clear records of what was attempted independently and what needed help.

AI remains recognisable within the fiction. Some devices follow fixed instructions; others demonstrate pattern learning from examples; some older-player tools generate new text. We label and explain those differences. A magical visual effect must not teach that real AI knows everything, understands a child's feelings or deliberately lies whenever it makes an error. We teach that an answer can sound confident and still be wrong.

Each game is independently understandable. Optional recaps and loaned tools let a learner enter an adventure without completing unrelated games first. Story progression and cosmetic discoveries can connect the world without hiding all useful learning behind a long prerequisite chain.

## 5. Lumenwood: ten games for ages 4–6

An enchanted woodland gives children a place to make their first creations with adult support. Each project uses large picture controls, short spoken demonstrations and reviewed suggestions explicitly described as practice examples of how AI can help. The saved books, designs and games are real creations; prepared replies are not live AI generation. The child can revisit the same tool to make something different.

| Game | What the child does in the world | Usable creation | Practical AI ability |
| --- | --- | --- | --- |
| L01. **The Dragon's Bedtime Book** | Choose a dragon, act out its problem and shape a suggested ending. Place the pages in a book that a woodland character reads. | A short illustrated book that can be opened again and downloaded. | Turn a story idea into a creation with a helper, and choose what happens in it. |
| L02. **The Moonlight Invitation** | Prepare a celebration for creatures and give the writing helper the details guests need. Deliver the invitation to fictional guests. | A printable invitation using fictional event details. | Give an assistant useful information to help it write a message. |
| L03. **My Three Wonderful Things** | Collect three discoveries, ask for help arranging them and present them in a lantern theatre. | A three-slide show-and-tell presentation with pictures and captions. | Organise ideas into a presentation with a helper. |
| L04. **The Morning Spellbook** | Help a sleepy creature get ready by shaping a suggested picture plan, then watch the creature use it. | A printable visual routine that can be adapted with an adult. | Use a planning helper to organise a familiar activity. |
| L05. **The Pattern Garden** | Describe a visual idea with shape and colour objects, grow suggested designs and choose one for the garden's gifts. | A bookmark or wrapping-paper design. | Describe a creative idea and choose among the helper's suggestions. |
| L06. **The Dancing Moonling** | Ask the practice helper for a dance, arrange its suggested action blocks and watch the creature perform the whole sequence. | A replayable animation with visible action blocks. | Discover that AI can suggest code, while the animation follows the code's fixed instructions. |
| L07. **The Little Shelter Studio** | Describe a creature's home, select safe pieces from suggested designs and assemble its shelter. | A simple printable make-and-fold model with adult assembly instructions. | Use a design helper to turn an idea into a practical plan. |
| L08. **The Two-Door Adventure** | Develop two story possibilities with the helper, arrange the scenes and play both endings. | A playable choice story that can be saved and replayed. | Shape suggested ideas into an interactive creation. |
| L09. **The Treasure Trail** | Ask for clues that fit a pretend garden, place them and try the completed hunt. | Printable clue cards for an adult to adapt. | Ask for activity ideas that suit a place and the people playing. |
| L10. **The Woodland Soundtrack** | Describe a mood, listen to suggested reviewed musical phrases and arrange them for a creature's entrance. | A short downloadable soundtrack assembled from licensed or original phrases. | Direct a creative helper and make personal choices about the result. |

The world celebrates the actual project: an invitation starts a celebration, a presentation lights the theatre and an animation becomes a creature's performance. The next challenge changes the audience, subject or purpose so the child makes another creation rather than memorising one answer.

## 6. Asterhaven: ten games for ages 7–10

A floating town needs young makers to open its arcade, theatre, workshops and festival. Each place contains a working creative tool. Reviewed practice suggestions teach the pattern of working with AI; the game clearly explains that those suggestions were prepared. The website, game, presentation and other outputs remain functional, private creations. Learning with a simulation is recorded as practice, not as independent use of a live AI service.

| Game | What the player does in the world | Usable creation | Practical AI ability |
| --- | --- | --- | --- |
| A01. **The Comic Foundry** | Direct characters, arrange scenes, shape suggested dialogue and watch the panels come alive. | A downloadable comic and editable story panels. | Develop an idea with an AI writing helper and keep control of the story. |
| A02. **The Skyship Pitch** | Give the practice helper supplied notes, receive a prepared slide outline, shape it for the audience and present it in the town council's projection room. | A five-slide presentation with an introduction, illustrations and sources. | Turn information into a presentation that helps other people understand an idea. |
| A03. **The Portal Page** | Use a workshop's design desk to shape a suggested page, edit sections and open the page on in-world devices. | A working one-page website made from safe components, with a private download. | Describe the purpose of a website and use assisted building tools to create it. |
| A04. **The Arcade Apprentice** | Build a collection game, change its action blocks, play it on an arcade cabinet and invite characters to use it. | A playable game with editable block instructions. | Use suggested code to bring an idea to life, and understand how a changed instruction changes play. |
| A05. **The Creature Design Studio** | Develop a club's visual identity, explore suggested styles and put the resulting designs on its signs and equipment. | A logo, colour palette and poster made with reviewed assets. | Direct an AI design helper and produce a consistent set of designs. |
| A06. **The Quiz Observatory** | Turn supplied material into questions and explanations, then practise with the quiz and run it for fictional visitors. | A reusable quiz that the child can play outside the story. | Make a useful learning resource with AI assistance and learn from it. |
| A07. **The Festival Planner** | Ask for a starting plan, arrange stalls and activities, and run the celebration using the finished schedule. | An editable event plan and checklist. | Break a larger activity into manageable steps with an AI planning helper. |
| A08. **The Inventor's Handbook** | Build a model, use a writing helper to explain its construction and watch a character follow the illustrated instructions. | An illustrated instruction sheet and model plan. | Turn something the child understands into an explanation another person can use. |
| A09. **The Maker's Market** | Create a fictional product, develop its description and prepare a stall using a small supplied budget. | A pretend catalogue, product design and simple budget. | Use AI assistance to develop an idea for other people and understand basic costs. |
| A10. **The Town's Helpful Automaton** | Build a routine that sorts fictional requests and prepares suggested replies, then watch the whole routine run. | A working rule-based automation with editable steps and sample messages. | Use AI assistance to plan repetitive work while distinguishing fixed rules from prepared language suggestions. |

Children can return to the same tools with a new subject, club, character or game idea. The saved creation and the child's ability to change it provide stronger evidence than the number of questions answered correctly.

## 7. The Tideglass Isles: ten games for ages 11–13

Players travel between islands in a personal skyboat and learn to use AI for increasingly substantial projects. A code workbench, slide projector or design desk edits the actual saved project. Guided examples introduce the tools, then a second project gives the learner room to choose a useful topic. Live generation is optional and parent-enabled; a prepared practice version is clearly labelled and cannot be reported as live use.

| Game | What the player does in the world | Usable creation | Practical AI ability |
| --- | --- | --- | --- |
| T01. **The Skyboat Signal** | Help travellers find the skyboat by asking the AI to build a small website, editing its colours and sections and opening it on different in-world devices. | A working downloadable HTML website and its source. | Turn an idea into a website using AI-assisted HTML and CSS. |
| T02. **The Firefly Arcade** | Restore an arcade by creating a catching game. Change its speed, controls and scoring, then play the actual game. | A playable browser game with editable code. | Ask AI to write and explain code, change a feature and diagnose a concrete bug. |
| T03. **The Lighthouse Pitch** | Give the AI supplied facts and an audience, receive a proposed slide outline and speaker notes, reshape the presentation and deliver it in the council chamber. | An editable presentation, PDF and speaker notes. | Turn research into a clear presentation for a particular audience. |
| T04. **The Moonprint Studio** | Create posters, signs and a badge for an island celebration, then place them where residents will use them. | An editable SVG design pack and print-ready files. | Develop visual ideas with AI and produce a consistent design system. |
| T05. **The Tale Beneath the Tide** | Explore a library, invent characters with a writing helper and build a story where the reader's choices affect what happens. | A playable branching story and its script. | Develop ideas and turn a story outline into an interactive experience. |
| T06. **The Memory Observatory** | Use supplied navigator material to make questions, flashcards and explanations, then learn with the tool. | A private revision website and printable flashcards. | Use AI to make resources that support recall and understanding. |
| T07. **The Festival Countdown** | Organise a celebration with a timetable, supplies and fictional helpers, then let the simulation use the plan automatically. | An editable schedule, checklist and calendar file. | Use AI to organise time and turn a larger goal into workable steps. |
| T08. **The Creature Census** | Ask the AI to organise supplied fictional observations into a table and propose a useful chart. Edit the table, render the chart from its data and use it at the conservation centre. | A spreadsheet, charts and a short illustrated explanation. | Use AI to structure information and communicate a useful finding. |
| T09. **The Maker's Market** | Develop a fictional product, design its packaging and work out material costs before opening a simulated stall. | A product mock-up, cost sheet and product description. | Explore a customer's need, develop an offer and distinguish money received from profit. |
| T10. **The Captain's Invention** | Choose a study, hobby or club problem and make a tool such as a practice timer or reading organiser. | A working private mini-app, source code and a demonstration. | Combine AI-assisted planning, coding and design to make something useful. |

For each finished project, the learner can choose a new, non-sensitive topic and make another version outside the fictional commission. Changes should affect the actual website, program or document. A cosmetic world animation cannot substitute for a working deliverable.

## 8. Lumenfall: ten games for ages 14–16

Players establish a studio in a living twilight city. Commissions involve useful work for fictional clients. Players build with AI-assisted tools, develop their own judgement and accumulate a private portfolio. Economic opportunity is taught through practical value, costs, communication and delivery, without suggesting that AI or a course guarantees wealth.

| Game | What the player does in the world | Usable creation | Practical AI ability |
| --- | --- | --- | --- |
| F01. **The Empty Studio** | Choose a creative service, develop its identity and build a portfolio site that displays later projects. | A responsive portfolio website, design files and source code. | Combine AI-assisted writing, visual design and web development. |
| F02. **The Appwright's Commission** | Meet a fictional club organiser, build an equipment tracker and use it during a simulated club session. | A functional app with local data storage and editable code. | Break an app into features, work with AI-generated code and debug its behaviour. |
| F03. **The Midnight Circuit** | Explore an abandoned skyport, discover movement devices and use AI-assisted code to build a first-person challenge from a reviewed game kit. Play the course and reshape its rules. | A playable browser game, editable controller code and design notes. | Use AI as a programming collaborator while understanding important code and making design decisions. |
| F04. **The Festival Campaign** | Produce a poster, landing page, short animated trailer and messages for different audiences, then stage the campaign around the city. | A coordinated campaign pack, editable assets and a rendered clip made from reviewed assets. | Repurpose an idea across formats and direct AI towards a consistent voice and style. |
| F05. **The Council Presentation** | Give the AI supplied project records and audience concerns, use its proposed argument and spreadsheet formulas, run the calculations and shape a presentation for the council. | An editable presentation, speaker notes, cost model and source list. | Synthesise information, structure an argument and communicate numbers with AI assistance. |
| F06. **The Night Market Numbers** | Analyse supplied fictional stall data, build a dashboard and try a suggested change in a market simulation. | A functioning spreadsheet dashboard, formulas and a short report. | Use AI to organise data, write formulas and investigate useful patterns. |
| F07. **The Clockwork Office** | Build a workflow that turns fictional requests into draft replies and organised task records, then run varied inputs through it. | An executable private workflow with example inputs and outputs. | Automate repetitive work and decide which steps still need a person's decision. |
| F08. **The Learning Engine** | Use supplied subject material to build practice questions, explanations and a useful revision schedule. | A working revision app and editable learning resources. | Use AI to create learning software and support productive study habits. |
| F09. **The First Commission** | Develop a fictional service, make a sample deliverable, estimate effort and costs and respond to a client's requested change. | A service offer, sample work, quotation and project plan. | Use AI to create value, estimate work and explain a credible offer. |
| F10. **The Citymaker Project** | Identify a study, hobby or community need, choose tools and deliver a self-directed project for the studio exhibition. | A finished app, game, publication or creative tool, with editable source and a demonstration. | Plan and deliver useful work with AI and explain personal decisions. |

The final portfolio shows what the learner can make and improve. It records the AI contribution, the learner's decisions and support used. Simulated customers and character reactions provide practice, not evidence of real demand or expected earnings. Downloads stay private; public publishing and real transactions need the parent's involvement.

### A teen adventure must be worth playing: The Midnight Circuit

An abandoned skyport is reopening for a festival. The player explores its rooftops, rides lifts and discovers wind launchers, timed gates and light bridges. The first encounter is a playable first-person challenge that demonstrates those devices. Assisted movement and accessible routes are available; dexterity does not determine whether the learner can complete the AI project.

The player then creates a course of their own using the supported building kit. Their request might be: “Make a challenge where collecting three lanterns opens the finish gate.” The AI helps write a small controller, and the player immediately plays what it controls. A follow-up request can add a restart action, change lantern respawning, introduce a checkpoint or create a slower route. The code and the resulting behaviour remain inspectable. Prompting is how the player directs changes to something they are actively playing.

Different designs can succeed. The player can explore another rooftop for optional construction pieces, return to their course, change its atmosphere and try a new idea. Basic tools do not require repetitive collecting. The finished course remains an arcade in their district and an exportable project. Scripted festival characters can demonstrate specific supported paths, but their reactions must not be presented as independent human playtesting.

The world, movement system and supported devices are authored and reviewed. AI helps modify bounded behaviour within the game kit; it does not generate an unrestricted 3D world. Generated controller code runs within the restricted execution model, with only validated messages allowed to affect supported game devices. The technical spike must prove this interaction before the game is advertised.

## 9. The first polished game should be The Arcade Apprentice

This replaces the earlier Stormcloak Foundry flagship. A playable game is a recognisable outcome: the child can explain that the app helped them learn to build something, open what they made and change it later. The same idea scales from reviewed block suggestions for ages 7–10 to AI-assisted code for older learners. The first polished game still needs a complete first-person place, expressive characters, sound and meaningful interactions.

The child enters an abandoned floating arcade. One cabinet wakes up with a short, playable firefly-catching game. Pip explains: “Today you will learn how an AI helper can help you make your own game. Then you can play it here.” The child plays the tiny example before being asked to build anything.

At the cabinet's workbench, the child chooses what the player should collect and what should happen when it is collected. The practice coding helper suggests a small set of labelled action blocks. The game explicitly says those suggestions were prepared. Pip points to one block and explains its effect: “This tells the game to add one point when you catch a firefly.” The child adds it, presses Play and uses the game immediately.

Next, the child chooses something that makes the game theirs: a different collectible, a new background, a sound, a movement rule or a bonus item. Each choice changes the actual project. Pip can suggest the next tool or explain the relevant block while the child is working. Do not require a failure before the child can advance, and do not force them to re-enter a sequence they already built.

The finished cabinet plays the saved game. Other characters gather around it, with their scripted reactions driven by actual project events rather than invented claims about usability. The child can reopen the editable project, play it privately and download a standalone version. A second empty cabinet lets them create another game with less help.

The parent insight is concrete: “Your child made a playable game, changed how scoring works and added a new collectible using one hint.” The next activity is to show the game to a parent, explain one instruction and make a change based on the parent's idea. For ages 7–10, this is accurately described as guided practice with AI-style coding assistance, not independent live model use.

Alongside the first-person control spike, prove one older-learner tool path: ask the live, parent-enabled coding helper for a small feature, inspect the change, run it in an isolated preview, save it and export the source. This prevents the graphical world from concealing a missing practical AI capability. Do not expand to forty games until both the enjoyable game experience and the useful creation workflow work.

## 10. Pip teaches while the player is working

Pip is present in the world and reacts to meaningful events. The companion can point to the relevant object, demonstrate one action and explain a visible consequence. It waits while the learner thinks and can be muted or dismissed. The voice remains the current original voice unless separately changed.

Pip acts as a making coach. It can show how to add a slide, explain the block that controls scoring, suggest a useful next feature or help recover from a broken preview. Teaching follows a small ladder: describe what the learner is making; point to the relevant tool; demonstrate one part; let the learner make the next part. An independent project starts without a ready-made solution or automatic hint. Asking for help remains available and does not remove the reward; the parent record simply distinguishes supported and independent attempts.

For ages 4–10, use authored, state-aware teaching and prepared tool outputs. For ages 11–16, add optional live guidance and bounded generation through the existing parent-managed controls. The model receives an approved quest ID, relevant evidence IDs, the player's selected action and permitted tool results. It returns a short explanation, a hint level and an allowed object to highlight. Validate referenced evidence, allowed actions and output structure before showing the response. Generated wording can still be wrong; use authored factual explanations where accuracy cannot be reliably checked and test the guidance against misleading and incomplete inputs. The model has no authority to award completion or directly mutate game state.

Practical generation is a separate capability from coaching. An older learner can ask for a slide outline, an explanation, a website section, a code change or a draft workflow. The response creates a proposed project version that the learner can inspect, apply, run and undo. The server enforces the permitted file types, project size and tool capabilities. This is necessary to teach useful AI-assisted creation; a companion that only supplies hints cannot fulfil the practical curriculum. Parent enablement controls live generation. Prepared fallback projects stay playable and editable, with their status explained accurately.

Live guidance does not pause the game indefinitely. A reviewed response is available during latency, outages, moderation blocks or exhausted allowance. Essential hints must remain available without spending a generation. We must define and cost a fair membership allowance before advertising live coaching as unlimited.

No child's voice recording, real personal material or general browsing is required for the core experience. Start with object actions, task-specific written requests and supplied sources. Unrestricted chat or microphone features would need a separate design and safeguards. Existing parental enablement, moderation, retention and access controls remain in force. In particular, a band labelled 11–13 contains children under 13; provider requirements cannot be handled by the band label alone. OpenAI's guidance requires zero data retention before processing personal data of children under 13 or the applicable age of digital consent. Parent permission alone does not establish that configuration. [OpenAI under-18 guidance](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance)

## 11. Use a real 3D engine and a reviewed AI production pipeline

**Recommended first choice: Babylon.js with TypeScript.** It is an Apache-2.0 open-source game/rendering engine with cameras, meshes, animation, audio and WebGL/WebGPU support. This is a suitable starting point for first-person browser play within the existing Experrt website. That suitability is our engineering judgement; mobile performance still needs measurement. [Engine and licence](https://github.com/BabylonJS/Babylon.js), [official capabilities](https://www.babylonjs.com/specifications/)

Next.js continues to provide the catalogue, family accounts, membership and parent interface. Babylon owns the 3D world, movement, object interactions, animation and frame loop. React renders small accessible overlays and surrounding pages. Quest logic sits in a separate tested module; the renderer does not determine whether a learning objective was demonstrated.

Use WebGL2 as the initial tested rendering baseline and treat WebGPU as an optional enhancement. Load one region at a time. Use original low-poly models, baked lighting, compressed textures and modest effects. Deliver reviewed GLB assets through versioned bundles. Benchmark the exact model and texture pipeline rather than assuming an impressive desktop demo will run well on a phone.

| Candidate | Role in this plan | Important distinction |
| --- | --- | --- |
| **Babylon.js** | Preferred runtime for the technical spike and custom browser game. | Open-source engine; we still build quest systems, age controls, art production and integration. [Source](https://github.com/BabylonJS/Babylon.js) |
| **PlayCanvas** | Strong alternative if a visual scene-editing workflow proves more productive. | The engine and several editor components are open source. Hosted services and their plans are separate. [Open-source components](https://developer.playcanvas.com/user-manual/getting-started/open-source/), [AI development workflow](https://developer.playcanvas.com/user-manual/engine/developing-with-ai/) |
| **Godot** | Consider if downloadable native games become the main destination. | Its web export uses WebAssembly and WebGL2, with mobile constraints. Single-threaded web export is available; its native and web capabilities are not identical. [Current export documentation](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html) |
| **GDevelop AI** | Prototype individual mechanics and compare the authoring workflow during the spike. | It has first-person examples and AI-assisted authoring, but its hosted AI uses credits. An open-source engine does not imply a freely self-hosted generation service. [AI documentation](https://wiki.gdevelop.io/gdevelop5/interface/ai/), [first-person example](https://gdevelop.io/en-gb/game-example/free/starting-first-person) |

### Additional technology that serves the game

The distinctive product idea is a world increasingly filled with things the learner has made using AI. An avatar, a personal studio, working inventions and playable projects belong to one continuous experience. Choose technologies for these interactions and keep the number of independent runtime systems manageable.

| Capability | Technology to prototype | Why it matters to play and learning |
| --- | --- | --- |
| **An Avatar Forge** | Original rigged GLB parts in Babylon, with a validated AI appearance recipe. | A prompt becomes something the learner can wear. A precise follow-up changes selected details while keeping the rest. |
| **A world that remembers choices** | Ink and its JavaScript runtime, inkjs, for authored branching story, connected to validated quest state. Both projects publish MIT licences. [Ink](https://github.com/inkle/ink), [inkjs](https://github.com/y-lohse/inkjs) | Characters respond to projects the player actually finished, earlier choices open different story moments and creations gain a place in the world. This requires authored branches; it is not evidence that an AI character has personal feelings. |
| **Coding that visibly changes play** | Blockly as a candidate for visual programming, paired with the restricted project runtime. It is an open-source editor with blocks for programming concepts; it does not supply our game logic or security sandbox. [Blockly documentation](https://docs.blockly.com/), [source and licence](https://github.com/RaspberryPiFoundation/blockly) | Younger players see what a suggested instruction does. Older players can move towards code, using the same working project and a separate source editor where appropriate. Add tap-based editing and test mobile usability. |
| **Pip knows what the player is working on** | Structured game-state events and a bounded teaching service, using the existing narration where suitable. | Pip can refer to the selected object, latest request and actual preview result. It can demonstrate the next action without monitoring the camera or inventing what happened. |
| **Sound gives the world depth** | Babylon's current audio engine supports ambient, spatial and directional sound. [Audio documentation](https://doc.babylonjs.com/features/featuresDeepDive/audio/) | A machine can be heard working nearby and a character's voice can come from their location. Music and effects respond to authored game events. Essential information also has visual and caption equivalents. |
| **Creations become a personal museum** | Versioned project storage and in-world displays connected to actual saved files. | Games stay playable, presentations can be projected and designs decorate the home. Parents can open the real projects. This reuses the existing ownership model instead of introducing public profiles. |
| **A creation can appear in the room** | Later, investigate model-viewer with supported WebXR, Android Scene Viewer and iOS Quick Look modes. [AR documentation](https://modelviewer.dev/examples/augmentedreality/) | A parent and child could place a finished creature or invention on a real table. This is an optional display of a reviewed 3D creation. Device support and animation differ by mode; retain a normal 3D preview and test the exact asset. |
| **The phone experience feels like an app** | A progressive web app with an installation path where supported and deliberately scoped asset caching. [PWA guidance](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) | Open Wonderlab from the home screen, reload worlds efficiently and recover from interruptions. Live generation still needs a connection. Private data, membership expiry and shared-device sign-out need explicit cache rules; offline paid access is not promised by this proposal. |

Build the avatar chooser, mobile game runtime, practical project tools, game-aware Pip and persistent creations first. Add the Avatar Forge's AI interpretation once the approved recipe flow works. Branching stories and spatial sound support the first finished adventure. AR is an optional later experiment. None of these candidates is installed or approved as a production dependency by this document alone.

Open-source AI generation can help with production, but should have a specific job:

- **TripoSR** can turn an approved object image into a draft 3D prop. Its official repository identifies source and pretrained models as MIT-licensed and lists approximately 6GB VRAM for default inference. Use it for experiments with props, then clean up the mesh, textures and collision geometry. It does not generate a complete, reliable game. [Official repository](https://github.com/VAST-AI-Research/TripoSR)
- **ComfyUI** can organise repeatable concept-art and asset-generation workflows. Its open-source application licence does not replace the separate licences of models and extensions. Select and record exact model versions before production use. [Official repository](https://github.com/Comfy-Org/ComfyUI)
- **Blender and a reviewed modular asset library** provide mesh cleanup, rigging, animation, consistent materials and export. AI-generated draft objects still need a coherent art direction and game-ready construction.
- **AI-assisted coding and dialogue drafting** can accelerate reviewed platform scripts, scene definitions and test fixtures. These changes go through normal review and testing. Learner-generated projects have a separate restricted preview described below; they never execute with the main application's privileges.

Do not adopt a model simply because its repository has an open licence badge. TRELLIS.2's main code and models are MIT, but its linked default pipeline includes dependencies whose licences restrict commercial use. Hunyuan3D-2's published community licence excludes the UK. These are not approved production choices for this plan without resolving the specific restrictions. [TRELLIS.2](https://github.com/microsoft/TRELLIS.2), [nvdiffrast licence](https://github.com/NVlabs/nvdiffrast/blob/main/LICENSE.txt), [nvdiffrec licence](https://github.com/NVlabs/nvdiffrec/blob/main/LICENSE.txt), [Hunyuan3D-2 licence](https://github.com/Tencent-Hunyuan/Hunyuan3D-2/blob/main/LICENSE)

The world-production pipeline is: approve a concept, generate or model candidate assets, clean and animate them, check licences and provenance, build the interactive scene, author its learning and feedback, test with players, then publish a versioned game. World assets are reviewed before release. Older learners' project generation happens during play through restricted, parent-enabled tools; it cannot rewrite the host world or platform.

## 12. Shared game architecture and existing-platform integration

The new runtime should use typed definitions for worlds, regions, characters, interactable objects, inventory, quests, evidence, feedback, rewards and saved creations. A quest declares the actions allowed in each state and the evidence needed to finish. Physics can make play tactile, but completion uses stable authored conditions so small device differences do not change the learning result.

The project tools are as important as the 3D renderer. Every workbench opens a usable editor for the actual saved creation. The project remains visible as changes are applied. On phones, provide touch-friendly controls and guided requests; older learners can also inspect and edit code with a keyboard. Avoid forcing a child through explanatory panels between each edit and preview.

| Tool | Required practical behaviour |
| --- | --- |
| Story and design studio | Edit text, scenes, reviewed images, layout and colours. Save the source project and export a readable book, image, SVG or PDF as appropriate. |
| Presentation studio | Add, reorder and edit slides, use supplied or reviewed illustrations, rehearse and export an editable deck plus PDF. |
| Game and website workshop | Use safe components or action blocks for younger players. Older players can work with scoped AI-generated HTML, CSS and JavaScript. Run the real project and export its source and playable files. |
| Animation and sound studio | Arrange reviewed visual and audio assets on a simple timeline, replay and export the resulting clip or audio. Model-assisted planning and selection must not be mislabelled as live image or music generation. |
| Data and planning studio | Edit structured tables, formulas, charts, tasks and schedules. Export usable spreadsheet, CSV or calendar files according to the project. |
| Automation workshop | Execute a limited workflow against supplied fictional records, show each action and save an editable project. External messaging, payments and real account actions are outside the child's runtime. |

Learner-generated code runs in a separate, restricted preview with no access to authentication cookies, family data, payment APIs, host-page DOM or server secrets. Restrict network access and imports, bound execution and output, and terminate runaway previews. Use declarative actions for younger projects. Older code previews need an isolated origin or appropriately sandboxed frame and an explicitly reviewed security model before launch. Save versions and provide undo. This architecture is a proposed requirement, not a claim that a secure code runner already exists.

Reuse the existing family identity, membership and learning-insight services where their contracts fit. Verify the adapters rather than assuming that a new 3D event has the same meaning as an old lesson step. The existing garden prototype and 24-game catalogue remain separate until replacements pass their acceptance checks. Do not display two competing versions of a game as equal starting points.

Proposed event records contain a quest/content version, checkpoint, action type, relevant object or evidence IDs, hint level, revision and fresh-challenge result. Use idempotent event IDs so retries cannot duplicate rewards. The server validates access, permitted transitions and reward criteria. It never accepts a client-supplied “mastered” flag or an AI model's statement that the child passed.

Save after meaningful actions. Cache progress for interrupted connections, reconcile it on reconnect and show understandable save status. Keep conflict handling explicit when another device has newer progress. Content versions need a migration rule, or old saves must continue against their original content. Switching device, signing out or losing the browser tab must not erase a creation.

A live teaching endpoint receives only the approved context it needs. Credentials remain server-side. Membership and parent permissions are checked on each protected operation. Public demo play uses reviewed content and cannot bypass family ownership checks. Existing adult courses and checkout routes receive regression checks before any replacement is released.

## 13. Parent insights should explain learning

Each game defines the practical ability before it is built. Parents first see what the child made and can open the creation. Then show what the child did, what the AI or prepared helper contributed and how much support was used. Useful categories include made a presentation, changed a program's behaviour, organised information, designed for an audience, automated a repeated task and adapted a project to a new purpose. Explain reliability and privacy decisions where they occurred within that work.

An example insight is: “Your child built a playable collecting game, changed its scoring and added a new item using one hint. They can show which instruction adds a point.” Another is: “Your child used the AI to turn supplied notes into a five-slide presentation, then rewrote the introduction for a younger audience.” A next activity invites the child to make a new game or presentation about an interest they choose. Report guided practice and live AI use separately.

Show “tried with support”, “demonstrated in this challenge” and “revisited successfully” where supported by events. Do not label speed, retries or time in the world as intelligence, motivation or ability. Do not claim that a magical puzzle establishes broad real-life competence. Keep collections and progress private, with no rankings, streak penalties, paid random rewards or purchase prompts inside child play.

## 14. Build in stages with evidence at each stage

| Stage | Concrete deliverable | Gate before expanding |
| --- | --- | --- |
| 1. Prove the technology | A Babylon first-person room with a rigged character, an object interaction, mobile controls, narration and save/resume. Include guided movement for ages 4–6 and free movement for older players. Prove a safe older-learner code-generation, preview and export path alongside it. | Youngest children can approach and use objects. The older learner's generated project runs, saves and exports without host access. Measure performance on agreed phones and tablets. Choose the engine on those results. |
| 2. Establish the quality bar | A finished Arcade Apprentice game with original art, animation, sound, companion guidance, an editable playable creation, export and parent insight. | Families understand what the child is learning to make. The child enjoys the game and can change their creation for a new idea. |
| 3. Prove all four ages | One polished representative game per world: The Dragon's Bedtime Book, The Arcade Apprentice, The Lighthouse Pitch and The Appwright's Commission. | Every age group finishes something usable. Controls, reading demands, independence, live generation where enabled and downloads work for the intended learners. |
| 4. Establish production | Shared game framework, reviewed asset kits, quest-authoring templates, engine-to-platform adapters, learning rubrics and save migration tests. | A second game can be made efficiently without becoming a reskin of the first. |
| 5. Produce forty adventures | Complete each world's remaining games in tested batches, with genuine variety and reviewed feedback. | Every advertised game is playable, understandable, age-appropriate and complete. |
| 6. Replace the catalogue | Move families to one clear entry per game, migrate appropriate records, retain exports and release progressively. | Ownership, membership, retention, live-AI controls and adult-platform regression checks pass. |

Initial performance targets, to be confirmed during the spike: sustained 30 frames per second on representative mid-range iOS and Android hardware, a first playable download of roughly 8MB or less before optional assets, and responsive object feedback without waiting for AI. These are engineering budgets, not measured promises. Set final region, texture and memory budgets after profiling. Test a sustained session for memory growth and device heating, as well as the first minute.

Family playtests should include more than one household and children with different reading and motor needs. After the opening interaction, ask in age-appropriate language what the helper did and what the child did. After the game, ask what they could use an AI tool to help them do outside this world. Do not supply the answer first. A child who can finish the puzzle but cannot recognise the AI contribution has revealed a design gap, even if they enjoyed the animation. Observe whether the learner can discover the next useful action, understand a failure, recover without restarting and voluntarily try a fresh variation. Include a later return session to see whether the skill transfers. Use these observations to revise the game before increasing content volume.

First-person comfort and accessibility are release gates. Check touch, keyboard, captions, narration controls, text enlargement, reduced motion, portrait and landscape, browser fullscreen fallback, interruption and device change. A stationary accessible interaction path must practise the same objective. Validate that generated or prepared guidance never invents evidence, gives away an independent challenge automatically or blocks progress during an outage.

This is a studio-scale content programme. It needs game engineering, game and learning design, 3D art and animation, sound and voice, and family-focused QA. AI tools can assist those roles; they do not remove them. A responsible cost and delivery estimate follows the technical spike and the first finished game, using measured art time, authoring time, testing needs and generation cost per active child. Avoid committing to a date for all forty before that evidence exists.

The next implementation milestone is the first-person technical room, the practical creation tool spike and the Arcade Apprentice game design package. The plan is ready to guide that work; the live app has not been converted by this document.
