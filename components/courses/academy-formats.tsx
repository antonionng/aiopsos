import { ArrowRight } from "lucide-react";

const ROWS: { label: string; selfPaced: string; trainerLed: string }[] = [
  {
    label: "How you learn",
    selfPaced: "Online, on your own, through lessons, worked examples, and practice on realistic material.",
    trainerLed: "Live with an Experrt trainer and colleagues, in person or online, using your organisation's own examples.",
  },
  {
    label: "When",
    selfPaced: "Start as soon as you buy, and continue at your own pace on any device.",
    trainerLed: "On dates agreed with your organisation, for a group booked together.",
  },
  {
    label: "Feedback",
    selfPaced: "Every check explains your answer, and a tutor gives written feedback on your drafts.",
    trainerLed: "Your trainer reviews your work in the session and grades the assessed task.",
  },
  {
    label: "Assessment",
    selfPaced: "A check in every lesson, a scenario assessment with a pass mark, and a piece of work you sign.",
    trainerLed: "Recorded attendance and an assessed task marked by the trainer.",
  },
  {
    label: "What you receive",
    selfPaced: "A signed record of the work you produced, which anyone you choose can verify online.",
    trainerLed: "A certificate that names the course, the dates, the trainer, your attendance, and your grade.",
  },
  {
    label: "Best suited to",
    selfPaced: "Individuals, and teams who need the same skill across different schedules.",
    trainerLed: "Teams who want to work through their own material together with an expert.",
  },
  {
    label: "How to buy",
    selfPaced: "Online with a card. The price is shown on each course.",
    trainerLed: "Through a conversation with us, followed by a quote for your group.",
  },
];

export function AcademyFormats({ selfPacedOn }: { selfPacedOn: boolean }) {
  return (
    <section className="academy-formats" aria-labelledby="academy-formats-title">
      <p className="academy-eyebrow">TWO WAYS TO LEARN</p>
      <h2 id="academy-formats-title">Choose the format that fits how your people work.</h2>
      <div className="academy-format-cards">
        {selfPacedOn ? (
          <article className="academy-format-card is-self">
            <span className="academy-format-tag">Self-paced</span>
            <h3>Self-paced courses</h3>
            <p>
              Online courses that each person takes in their own time. Every course teaches one professional skill in depth, gives feedback on each answer and on written drafts, and ends with an assessment and a piece of work the learner signs.
            </p>
            <a className="academy-button" href="#self-paced">
              Browse self-paced courses <ArrowRight size={18} />
            </a>
          </article>
        ) : null}
        <article className="academy-format-card is-trainer">
          <span className="academy-format-tag">Trainer-led</span>
          <h3>Trainer-led courses</h3>
          <p>
            Live courses delivered by an Experrt trainer to a group from your organisation, in person or online. The trainer works through your own examples, records attendance and assessed work, and issues a certificate to each learner who meets the standard.
          </p>
          <a className="academy-button academy-button-ink" href="#trainer-led">
            Browse trainer-led courses <ArrowRight size={18} />
          </a>
        </article>
      </div>
      {selfPacedOn ? (
        <div className="academy-compare" role="region" aria-label="How the two formats compare" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Compare</span>
                </th>
                <th scope="col">Self-paced</th>
                <th scope="col">Trainer-led</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>{row.selfPaced}</td>
                  <td>{row.trainerLed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <p className="academy-formats-note">
        Many organisations use both: self-paced courses to bring everyone to the same standard, and a trainer-led course for the teams who need to apply it to their own work. <a href="#enquire">Talk to us about combining them.</a>
      </p>
    </section>
  );
}
