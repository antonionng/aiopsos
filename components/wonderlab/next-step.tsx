export function NextStep({
  title,
  children,
  steps,
  current = 0,
}: {
  title: string;
  children: React.ReactNode;
  steps?: readonly string[];
  current?: number;
}) {
  return (
    <aside className="wl-next-step" aria-label="What to do now">
      {steps && (
        <ol aria-label="Steps in this challenge">
          {steps.map((step, index) => (
            <li
              key={step}
              aria-current={index === current ? "step" : undefined}
            >
              <span aria-hidden="true">
                {index < current ? "✓" : index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      )}
      <div aria-live="polite" aria-atomic="true">
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </aside>
  );
}
