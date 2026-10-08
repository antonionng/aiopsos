import type { LearningInsights } from "@/lib/wonderlab/learning-insights";
import { BookOpen, Lightbulb, Sparkles } from "lucide-react";
import { Pip } from "./art";

export function LearningWelcomeArt() {
  return (
    <div className="wl-learning-welcome-art" aria-hidden="true">
      <span className="wl-welcome-orbit" />
      <span className="wl-welcome-spark">
        <Sparkles />
      </span>
      <span className="wl-welcome-book">
        <BookOpen />
      </span>
      <span className="wl-welcome-idea">
        <Lightbulb />
      </span>
      <Pip small />
    </div>
  );
}

export function LearningInsightsPanel({
  nickname,
  insights,
  onStartMission,
  busy = false,
}: {
  nickname: string;
  insights: LearningInsights;
  onStartMission?: (slug: string) => void;
  busy?: boolean;
}) {
  return (
    <section
      className="wl-learning-insights"
      aria-label={`Learning insights for ${nickname}`}
    >
      <h3>See how {nickname} is learning.</h3>
      {insights.started > 0 ? (
        <p className="wl-caption">
          These notes describe saved activities and creations. They help you
          start a conversation about learning; they do not measure ability or
          compare children.
        </p>
      ) : (
        <div className="wl-learning-welcome">
          <LearningWelcomeArt />
          <h4>A first game can spark a new idea.</h4>
          <p className="wl-caption">
            {nickname} can try an idea, see what happens and have another go.
            Their discoveries and creations will build a learning story here as
            they play.
          </p>
          <p className="wl-caption">
            Start from their mission map so each activity is saved to their
            profile. There are no scores to compare or deadlines to keep up
            with.
          </p>
        </div>
      )}
      {insights.started > 0 && (
        <dl className="wl-learning-counts">
          <div>
            <dt>Missions explored</dt>
            <dd>{insights.started}</dd>
          </div>
          <div>
            <dt>Missions completed</dt>
            <dd>{insights.completed}</dd>
          </div>
          <div>
            <dt>Activities checked</dt>
            <dd>{insights.activitiesChecked}</dd>
          </div>
          <div>
            <dt>Creations saved</dt>
            <dd>{insights.creations}</dd>
          </div>
        </dl>
      )}
      {insights.recent ? (
        <p className="wl-caption">
          Most recently, {nickname} worked on{" "}
          <strong>{insights.recent.title}</strong>. This mission practises how
          to{" "}
          {insights.recent.outcome.charAt(0).toLowerCase() +
            insights.recent.outcome.slice(1)}
          .
        </p>
      ) : null}
      <details>
        <summary>Explore the skills they are practising</summary>
        <ul className="wl-learning-skills">
          {insights.skills.map((item) => (
            <li key={item.title}>
              <strong>{item.skill}</strong>
              <span>{item.status}.</span>
              <p>{item.outcome}.</p>
            </li>
          ))}
        </ul>
      </details>
      {insights.next && (
        <div className="wl-learning-next">
          <h4>Try this together next.</h4>
          <p>
            <strong>{insights.next.title}</strong>
          </p>
          <p className="wl-caption">{insights.next.action}</p>
          <p className="wl-caption">
            <strong>Away from the screen: </strong>
            {insights.next.together}
          </p>
          {onStartMission && (
            <button
              className="wl-button wl-button-small"
              disabled={busy}
              onClick={() => onStartMission(insights.next!.slug)}
            >
              {insights.started
                ? "Continue this game"
                : "Play their first game"}
              <span aria-hidden="true">↗</span>
            </button>
          )}
        </div>
      )}
      <p className="wl-caption">
        Free games played outside a child’s mission map stay in that browser and
        do not appear in these insights.
      </p>
    </section>
  );
}
