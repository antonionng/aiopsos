"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  Droplets,
  Leaf,
  Play,
  RotateCcw,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  Maximize,
  Menu,
  X,
} from "lucide-react";
import {
  createQuestState,
  QUEST_CONFIG,
  QUEST_VERSION,
  reduceQuest,
  restoreQuest,
  type QuestAction,
  type QuestBand,
  type QuestPlace,
} from "@/lib/wonderlab/quest";
import { GardenWorld, GARDEN_PLACES } from "./garden-world";
import { useNarration } from "@/components/wonderlab/use-narration";
import { useGameScreen } from "@/components/wonderlab/use-game-screen";

const ages: { id: QuestBand; label: string; name: string }[] = [
  { id: "explorers", label: "4–6", name: "Little Explorers" },
  { id: "inventors", label: "7–10", name: "Inventors" },
  { id: "creators", label: "11–13", name: "Creators" },
  { id: "studio", label: "14–16", name: "Future Studio" },
];
const icons = { water: Droplets, light: Sun, soil: Leaf };
const startPosition = { x: 445, y: 550 };

function PictureClue({ kind }: { kind: "water" | "sun" | "new-plant" }) {
  const cups = kind === "new-plant" ? 3 : 1;
  return (
    <div
      className="wq-picture-clue"
      role="img"
      aria-label={
        kind === "water"
          ? "The moonflower needs one cup of water."
          : kind === "sun"
            ? "The moonflower needs shade."
            : "The new flower needs three cups of water and bright sunshine."
      }
    >
      {kind !== "sun" && (
        <span>
          {Array.from({ length: cups }, (_, i) => (
            <svg
              aria-hidden="true"
              key={i}
              width="29"
              height="35"
              viewBox="0 0 36 42"
            >
              <path
                d="M7 5h22l-3 31H10Z"
                fill="#eefbfb"
                stroke="#497b81"
                strokeWidth="2.5"
              />
              <path d="M9 19q4-3 9 0t9 0l-2 15H11Z" fill="#63bacc" />
            </svg>
          ))}
          <b>{cups === 1 ? "One cup" : "Three cups"}</b>
        </span>
      )}
      {kind !== "water" && (
        <span>
          {kind === "new-plant" ? (
            <Sun size={36} />
          ) : (
            <svg aria-hidden="true" width="44" height="40" viewBox="0 0 44 40">
              <path
                d="M6 19Q22-6 38 19Z"
                fill="#80a867"
                stroke="#4f7348"
                strokeWidth="2"
              />
              <path d="M22 19v18M12 37h20" stroke="#4f7348" strokeWidth="3" />
              <path d="M10 23h24l-4 8H14Z" fill="#b8cea0" />
            </svg>
          )}
          <b>{kind === "new-plant" ? "Bright sunshine" : "Shade"}</b>
        </span>
      )}
    </div>
  );
}

export function QuestPreview() {
  const [band, setBand] = useState<QuestBand>("inventors");
  const screen = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const enterButton = useRef<HTMLButtonElement>(null);
  const exitButton = useRef<HTMLButtonElement>(null);
  const wasExpanded = useRef(false);
  const gameScreen = useGameScreen(screen);
  useEffect(() => {
    if (gameScreen.isFullscreen)
      exitButton.current?.focus({ preventScroll: true });
    else if (wasExpanded.current) {
      menu.current?.close();
      enterButton.current?.focus({ preventScroll: true });
    }
    wasExpanded.current = gameScreen.isFullscreen;
  }, [gameScreen.isFullscreen]);
  return (
    <div
      ref={screen}
      className={`wq wq-${band} ${gameScreen.isFullscreen ? "is-playing" : ""}`}
    >
      <div className="wq-play-bar">
        <button
          ref={exitButton}
          onClick={() => void gameScreen.exit()}
          aria-label="Leave full-screen play"
        >
          <ArrowLeft size={20} />
          <span>Exit</span>
        </button>
        <strong>
          Wonderlab <span>Fernwood Garden</span>
        </strong>
        <button
          onClick={() => menu.current?.showModal()}
          aria-label="Open game menu"
        >
          <Menu size={21} />
        </button>
      </div>
      <div className="wq-preview-bar">
        <Link href="/wonderlab/games">
          <ArrowLeft size={16} /> Wonderlab games
        </Link>
        <span>Playtest · One new quest</span>
        <button
          className="wq-screen-button"
          ref={enterButton}
          onClick={() => void gameScreen.enter()}
        >
          <Maximize size={17} />
          Play full screen
        </button>
        <label>
          Play for ages
          <select
            value={band}
            onChange={(event) => setBand(event.target.value as QuestBand)}
          >
            {ages.map((age) => (
              <option value={age.id} key={age.id}>
                {age.label} · {age.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <GardenQuest
        key={band}
        band={band}
        expanded={gameScreen.isFullscreen}
        enterScreen={gameScreen.enter}
      />
      <dialog className="wq-menu" ref={menu} aria-labelledby="quest-menu-title">
        <header>
          <h2 id="quest-menu-title">Your adventure</h2>
          <button
            aria-label="Close game menu"
            onClick={() => menu.current?.close()}
          >
            <X size={20} />
          </button>
        </header>
        <p>
          Pip helps you explore, check ideas and collect discoveries. Each age
          level keeps its own progress in this browser.
        </p>
        <label>
          Choose an age level
          <select
            value={band}
            onChange={(event) => {
              setBand(event.target.value as QuestBand);
              menu.current?.close();
            }}
          >
            {ages.map((age) => (
              <option key={age.id} value={age.id}>
                {age.label} · {age.name}
              </option>
            ))}
          </select>
        </label>
        <p>
          Tap a place to walk there. On a phone, slide your finger across the
          world to look around, or open the map to choose a destination.
        </p>
        {gameScreen.message && (
          <p className="wq-screen-note">{gameScreen.message}</p>
        )}
        <button className="wq-primary" onClick={() => menu.current?.close()}>
          Keep playing
          <ArrowRight size={17} />
        </button>
        <button
          className="wq-menu-exit"
          onClick={() => {
            menu.current?.close();
            void gameScreen.exit();
          }}
        >
          Leave full-screen play
        </button>
      </dialog>
    </div>
  );
}

function GardenQuest({
  band,
  expanded,
  enterScreen,
}: {
  band: QuestBand;
  expanded: boolean;
  enterScreen: () => Promise<void>;
}) {
  const config = QUEST_CONFIG[band];
  const [quest, setQuest] = useState(() => createQuestState(band));
  const current = useRef(quest);
  const log = useRef<QuestAction[]>([]);
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [active, setActive] = useState<QuestPlace | null>(null);
  const [position, setPosition] = useState(startPosition);
  const [walking, setWalking] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testMessage, setTestMessage] = useState(false);
  const [hint, setHint] = useState(false);
  const [spokenGuidance, setSpokenGuidance] = useState(false);
  const speechAllowed = useRef(false);
  const lastSpoken = useRef("");
  const [bag, setBag] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const interaction = useRef(false);
  const dialogue = useRef<HTMLElement>(null);
  const dialogueBody = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const { speak, stop, message: voiceMessage } = useNarration(band);
  const storageKey = `wonderlab-garden-playtest-v1:${band}`;
  useEffect(() => {
    if (!expanded) {
      speechAllowed.current = false;
      stop();
      const timer = setTimeout(() => setSpokenGuidance(false), 0);
      return () => clearTimeout(timer);
    }
  }, [expanded, stop]);

  function enterMobileScreen() {
    if (!expanded && window.matchMedia("(max-width: 1000px)").matches)
      void enterScreen();
  }

  useEffect(() => {
    const activeTimers = timers.current;
    const timer = setTimeout(() => {
      try {
        const saved: unknown = JSON.parse(
          localStorage.getItem(storageKey) || "[]",
        );
        const restored = restoreQuest(band, saved);
        current.current = restored;
        log.current = restored.visited.length
          ? (saved as { actions: QuestAction[] }).actions
          : [];
        setQuest(restored);
      } catch {
        setSaveError(true);
      }
      setReady(true);
    }, 0);
    return () => {
      clearTimeout(timer);
      activeTimers.forEach(clearTimeout);
    };
  }, [band, storageKey]);

  useEffect(() => {
    if (active && !walking) dialogue.current?.focus({ preventScroll: true });
  }, [active, walking]);

  useEffect(() => {
    if (dialogueBody.current) dialogueBody.current.scrollTop = 0;
  }, [active, quest.successful, quest.transferComplete, testMessage]);

  function send(action: QuestAction) {
    const next = reduceQuest(current.current, action);
    current.current = next;
    setQuest(next);
    log.current = [...log.current, action];
    if (log.current.length > 2000) {
      setSaveError(true);
      return next;
    }
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ version: QUEST_VERSION, band, actions: log.current }),
      );
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
    return next;
  }

  function arrive(id: string) {
    send({ type: "explore", id });
    setActive(id as QuestPlace);
    setWalking(false);
    interaction.current = false;
  }

  function explore(id: string) {
    if (!ready || interaction.current) return;
    const place = GARDEN_PLACES.find((item) => item.id === id);
    if (!place) return;
    enterMobileScreen();
    stop();
    setHint(false);
    setTestMessage(false);
    setBag(false);
    if (id === "guide") {
      arrive(id);
      return;
    }
    interaction.current = true;
    setWalking(true);
    setPosition({ x: place.x, y: Math.min(place.y + 65, 580) });
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!expanded && !window.matchMedia("(max-width: 1000px)").matches)
      world.current?.scrollIntoView({
        behavior: reduced ? "instant" : "smooth",
        block: "start",
      });
    timers.current.push(setTimeout(() => arrive(id), reduced ? 0 : 700));
  }

  function testGarden() {
    if (interaction.current || !ready) return;
    enterMobileScreen();
    interaction.current = true;
    stop();
    setTesting(true);
    setTestMessage(false);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!expanded && !window.matchMedia("(max-width: 1000px)").matches)
      world.current?.scrollIntoView({
        behavior: reduced ? "instant" : "smooth",
        block: "start",
      });
    timers.current.push(
      setTimeout(
        () => {
          send(
            current.current.successful
              ? { type: "transfer", choice: "test" }
              : { type: "test" },
          );
          setTesting(false);
          setTestMessage(true);
          interaction.current = false;
        },
        reduced ? 100 : 2400,
      ),
    );
  }

  const missing = config.requiredSources.find(
    (id) => !quest.evidence.includes(id),
  );
  const readyToTest =
    !missing &&
    quest.visited.includes("keeper") &&
    quest.visited.includes("guide");
  const source = config.sources.find((item) => item.id === active);
  const nextPlace = !quest.visited.includes("keeper")
    ? "keeper"
    : !quest.visited.includes("guide")
      ? "guide"
      : missing || "console";
  const nextName =
    GARDEN_PLACES.find((place) => place.id === nextPlace)?.name.replace(
      /^The /,
      "the ",
    ) || "the greenhouse";
  const complete = quest.transferComplete;
  const stageNumber = complete ? 3 : quest.successful ? 2 : readyToTest ? 1 : 0;
  const line =
    active === "console" && !readyToTest
      ? reduceQuest(quest, { type: "test" }).lastFeedback
      : testMessage && !source
        ? quest.lastFeedback
        : quest.successful &&
            (active === "seed" ||
              active === "guide" ||
              active === "console" ||
              !active)
          ? config.transfer.question
          : source
            ? source.text
            : active
              ? config.dialogue[active] || config.intro
              : config.intro;
  const panelTitle = complete
    ? config.reward.title
    : quest.successful && (active === "console" || active === "seed" || !active)
      ? "A new plant needs your help."
      : active === "console"
        ? "Bring the greenhouse back to life."
        : active === "guide"
          ? "Pip has a suggestion. Can you trust it?"
          : source?.title ||
            (active === "keeper" ? "Meet your garden keeper." : config.title);
  const grouped = ["water", "light", "soil"] as const;
  const machinePlan = quest.successful ? quest.transferPlan : quest.plan;
  const spokenLine = complete
    ? config.reward.description
    : quest.successful && active === "console"
      ? testMessage
        ? quest.lastFeedback
        : config.transfer.question
      : line;
  useEffect(() => {
    if (
      !speechAllowed.current ||
      !spokenGuidance ||
      !active ||
      walking ||
      testing ||
      lastSpoken.current === spokenLine
    )
      return;
    lastSpoken.current = spokenLine;
    speak(spokenLine);
  }, [spokenGuidance, active, walking, testing, spokenLine, speak]);

  function machineControls() {
    return (
      <div className="wq-controls" aria-label="Greenhouse controls">
        {grouped.map((group) => {
          const choices = config.options.filter(
            (option) => option.group === group,
          );
          if (!choices.length) return null;
          const Icon = icons[group];
          return (
            <fieldset key={group}>
              <legend>
                <Icon size={18} />
                {group === "soil"
                  ? "Plant bed"
                  : group === "light"
                    ? "Canopy"
                    : "Water valve"}
              </legend>
              <div>
                {choices.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    aria-pressed={machinePlan.includes(option.id)}
                    disabled={testing || walking}
                    onClick={() => {
                      if (quest.successful)
                        send({ type: "transfer", choice: option.id });
                      else {
                        const kept = quest.plan.filter(
                          (id) => !choices.some((entry) => entry.id === id),
                        );
                        send({
                          type: "set-plan",
                          choices: [...kept, option.id],
                        });
                      }
                      setTestMessage(false);
                    }}
                  >
                    <span className="wq-switch" aria-hidden="true" />
                    <b>{option.label}</b>
                    {!quest.successful && <small>{option.description}</small>}
                  </button>
                ))}
              </div>
            </fieldset>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <header className="wq-heading">
        <div>
          <span className="wq-eyebrow">WONDERLAB / THE GLASSHOUSE MYSTERY</span>
          <h1>
            {complete
              ? "You brought the garden back to life."
              : "Something is wrong in the garden."}
          </h1>
        </div>
        <p>{config.goal}</p>
      </header>
      <div className="wq-game" aria-busy={!ready}>
        <div className="wq-toolbar">
          <div className="wq-location">
            <Compass size={18} />
            <span>
              Fernwood Garden
              <small>
                {complete
                  ? "Your garden is growing."
                  : "Tap a character or object to walk over and investigate."}
              </small>
            </span>
          </div>
          <div
            className="wq-quest-dots"
            aria-label={`Quest stage ${Math.min(stageNumber + 1, 3)} of 3`}
          >
            {["Discover", "Experiment", "Restore"].map((step, index) => (
              <span
                className={index <= stageNumber ? "is-current" : ""}
                key={step}
              >
                <i>{stageNumber > index ? <Check size={11} /> : index + 1}</i>
                {step}
              </span>
            ))}
          </div>
          <button
            className="wq-bag-button"
            aria-label={`Your field notes, ${quest.evidence.length} ${quest.evidence.length === 1 ? "clue" : "clues"}`}
            aria-expanded={bag}
            onClick={() => setBag(!bag)}
          >
            <BookOpen size={19} />
            <span>Your field notes</span>
            <b>{quest.evidence.length}</b>
          </button>
        </div>
        <div className="wq-stage" ref={world}>
          <GardenWorld
            band={band}
            active={active}
            position={position}
            restored={quest.successful}
            flowering={complete}
            visited={quest.visited}
            onExplore={explore}
            disabled={!ready || walking || testing}
            testing={testing}
            waterOn={testing}
            waterLarge={machinePlan.includes("water-large")}
            shadeOn={machinePlan.includes("light-shade")}
            drainOn={band === "explorers" || machinePlan.includes("soil-drain")}
            newPlant={quest.successful && !complete}
          />
          {walking && (
            <div className="wq-travel" role="status">
              You are walking over to investigate.
            </div>
          )}
          {testing && (
            <div className="wq-travel" role="status">
              Watch the water, the shade and the plants.
            </div>
          )}
          {!testing &&
            testMessage &&
            active === "console" &&
            quest.attempts > 0 && (
              <div className="wq-world-result" role="status">
                <span>
                  {quest.lastFeedback.split(". ")[0].replace(/\.$/, "")}.
                </span>
                <button
                  onClick={() => {
                    if (dialogueBody.current)
                      dialogueBody.current.scrollTop = 0;
                    if (!expanded)
                      dialogue.current?.scrollIntoView({
                        behavior: "auto",
                        block: "nearest",
                      });
                    dialogue.current?.focus({ preventScroll: true });
                  }}
                >
                  {complete
                    ? "See your discovery"
                    : quest.successful
                      ? "Meet the new plant"
                      : "Adjust the controls"}
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          {!active && !walking && !bag && !complete && (
            <div className="wq-start-prompt">
              <Sparkles size={17} />
              {quest.visited.length
                ? "Your discoveries are saved. Choose a place to carry on."
                : "Your adventure starts with the garden keeper."}
              <button disabled={!ready} onClick={() => explore(nextPlace)}>
                {quest.visited.length
                  ? "Continue the quest"
                  : "Meet the keeper"}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
          {bag && (
            <aside className="wq-notebook" aria-label="Your field notes">
              <div>
                <h2>Your field notes</h2>
                <button
                  onClick={() => setBag(false)}
                  aria-label="Close field notes"
                >
                  ×
                </button>
              </div>
              <p>
                Keep the evidence you find. Compare it with Pip’s suggestion.
              </p>
              {config.sources
                .filter((item) => quest.evidence.includes(item.id))
                .map((item) => (
                  <article key={item.id}>
                    <span>
                      <Check size={15} />
                      {item.title}
                    </span>
                    <p>{item.text}</p>
                  </article>
                ))}
              {!quest.evidence.length && (
                <p>
                  Visit the seed cabinet, sun sensor or waterwheel. Save what
                  you find here.
                </p>
              )}
              {quest.earned.length > 0 && (
                <article className="wq-reward-note">
                  <Sparkles size={18} />
                  <strong>{config.reward.title}</strong>
                  <p>{config.reward.description}</p>
                </article>
              )}
              {quest.successful && (
                <article>
                  <span>The new plant’s care card</span>
                  <p>{config.transfer.question}</p>
                </article>
              )}
            </aside>
          )}
        </div>
        <section
          className={`wq-dialogue ${complete ? "wq-dialogue-complete" : ""}`}
          tabIndex={-1}
          ref={dialogue}
          aria-label="Your current interaction"
        >
          <div className="wq-speaker">
            <span aria-hidden="true">
              {active === "keeper" ? "✿" : complete ? "✦" : "◎"}
            </span>
            <b>{active === "keeper" ? "Garden keeper" : "Pip"}</b>
            <small>
              {active === "keeper" ? "Needs your help" : "Your fictional guide"}
            </small>
          </div>
          <div className="wq-dialogue-body" ref={dialogueBody}>
            <h2>{panelTitle}</h2>
            {complete ? (
              <>
                <p>{config.reward.description}</p>
                <p>{config.transfer.feedback}</p>
                <div className="wq-earned">
                  <Sparkles size={18} /> Added to your field notes. The garden
                  now belongs in your collection.
                </div>
              </>
            ) : quest.successful && active === "console" ? (
              <>
                <p>{config.transfer.question}</p>
                {band === "explorers" && <PictureClue kind="new-plant" />}
                {machineControls()}
                <button
                  className="wq-primary"
                  disabled={testing || walking}
                  onClick={testGarden}
                >
                  <Play size={17} />
                  {testing
                    ? "Watch the new plant…"
                    : "Run the plan for the new plant"}
                </button>
                {testMessage && (
                  <p className="wq-feedback" role="status">
                    {quest.lastFeedback}
                  </p>
                )}
              </>
            ) : (
              <>
                <p>{line}</p>
                {band === "explorers" &&
                  (active === "water" ||
                    active === "sun" ||
                    (active === "seed" && quest.successful)) && (
                    <PictureClue
                      kind={active === "seed" ? "new-plant" : active}
                    />
                  )}
                {active === "console" && readyToTest ? (
                  <>
                    <details className="wq-ai-advice">
                      <summary>The AI advice you are checking</summary>
                      <p>{config.dialogue.guide}</p>
                    </details>
                    {machineControls()}
                    <button
                      className="wq-primary"
                      onClick={testGarden}
                      disabled={testing || walking}
                    >
                      <Play size={17} />
                      {testing
                        ? "The greenhouse is running…"
                        : "Run my growing plan"}
                    </button>
                    <span className="wq-controls-help">
                      Your settings tell the greenhouse what to do. Watch the
                      result before deciding it works.
                    </span>
                  </>
                ) : (
                  <div className="wq-actions">
                    {source &&
                    !quest.evidence.includes(source.id) &&
                    !quest.successful ? (
                      <button
                        className="wq-primary"
                        disabled={walking || testing}
                        onClick={() => {
                          send({ type: "collect", id: source.id });
                          setTestMessage(true);
                        }}
                      >
                        <BookOpen size={16} />
                        Keep this clue
                      </button>
                    ) : (
                      <button
                        className="wq-primary"
                        disabled={walking || !ready}
                        onClick={() => explore(nextPlace)}
                      >
                        {nextPlace === "console"
                          ? "Go to the greenhouse"
                          : `Visit ${nextName}`}
                        <ArrowRight size={16} />
                      </button>
                    )}
                    {source && quest.evidence.includes(source.id) && (
                      <span className="wq-collected">
                        <Check size={16} />
                        This clue is in your field notes.
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="wq-guide-tools">
            <button
              aria-label="Listen and turn on spoken guidance"
              title="Listen with an AI-generated voice. Guidance follows your actions until you stop it."
              aria-pressed={spokenGuidance}
              onClick={() => {
                speechAllowed.current = true;
                setSpokenGuidance(true);
                lastSpoken.current = spokenLine;
                speak(spokenLine);
              }}
            >
              <Volume2 size={18} />
            </button>
            <button
              aria-label="Stop spoken guidance"
              onClick={() => {
                speechAllowed.current = false;
                setSpokenGuidance(false);
                stop();
              }}
            >
              <VolumeX size={18} />
            </button>
            {!complete && (
              <button
                className="wq-hint-button"
                onClick={() => setHint(!hint)}
                aria-expanded={hint}
              >
                Help me
              </button>
            )}
          </div>
        </section>
        {hint && (
          <div className="wq-help" role="status">
            <button
              className="wq-close-help"
              aria-label="Close Pip’s hint"
              onClick={() => setHint(false)}
            >
              <X size={17} />
            </button>
            <strong>Pip’s next-step hint</strong>
            <p>
              {quest.successful
                ? "This plant has different needs. Read its label before choosing what to change."
                : !quest.visited.includes("keeper") ||
                    !quest.visited.includes("guide")
                  ? `Visit ${nextName} to find out whose problem you are solving and what the AI suggested.`
                  : missing
                    ? `You still need evidence. Visit ${nextName} and keep the clue you find.`
                    : "Open your field notes. Compare each setting with the evidence, then run the greenhouse to test your plan."}
            </p>
          </div>
        )}
        {voiceMessage && (
          <p className="wq-save-note" role="status">
            {voiceMessage}
          </p>
        )}
        {saveError && (
          <p className="wq-save-warning" role="status">
            This browser could not save your latest step. Keep the game open to
            continue.
          </p>
        )}
      </div>
      <div className="wq-under-game">
        <p>
          {saveError
            ? "This browser could not save your playtest. Keep this page open to continue."
            : "This playtest saves on this browser only. It does not change a child’s membership or learning record."}
        </p>
        <button onClick={() => setConfirmRestart(!confirmRestart)}>
          <RotateCcw size={15} />
          Restart this playtest
        </button>
        {confirmRestart && (
          <div className="wq-reset">
            <p>
              Start this age level again? Only this browser’s garden playtest
              will reset.
            </p>
            <button
              onClick={() => {
                timers.current.forEach(clearTimeout);
                interaction.current = false;
                stop();
                log.current = [];
                send({ type: "restart" });
                setActive(null);
                setPosition(startPosition);
                setWalking(false);
                setTesting(false);
                setTestMessage(false);
                setBag(false);
                setHint(false);
                setConfirmRestart(false);
              }}
            >
              Start again
            </button>
            <button onClick={() => setConfirmRestart(false)}>
              Keep playing
            </button>
          </div>
        )}
      </div>
      <details className="wq-parent-note">
        <summary>What is your child learning in this quest?</summary>
        <p>{config.parentOutcome}</p>
        <p>
          Pip’s AI suggestion was written in advance so every player can
          investigate it. Pip responds to your actions with prepared guidance.
          This preview does not use live AI chat. The plant rules are fictional
          rules for this game.
        </p>
        <p>
          The optional voice is AI-generated. Choose the speaker to turn on
          spoken guidance, or the muted speaker to stop it.
        </p>
        <p>
          {band === "explorers"
            ? "Play together with a grown-up. Listen to the guidance and investigate one object at a time."
            : config.instructions}
        </p>
        <p>
          This is one playable experiment in the new quest direction. It is not
          a replacement for all 24 learning games.
        </p>
      </details>
    </>
  );
}
