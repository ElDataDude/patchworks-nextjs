import type { Showcase } from "@/data/use-cases";

const KIND_LABEL: Record<Showcase["kind"], string> = {
  "decision-answer": "Decision engine answer",
  "live-call": "Live call workspace",
  "fund-shortlist": "Fund shortlist",
  "grant-guide": "Fundraising guide",
  "app-launcher": "App launcher",
};

/**
 * An HTML/CSS illustration of what the app shows. No screenshots: the
 * content is invented for illustration and labelled as such.
 */
export default function ShowcasePanel({
  showcase,
  title,
}: {
  showcase: Showcase;
  title: string;
}) {
  return (
    <figure
      className={`showcase-panel showcase-${showcase.kind}`}
      data-showcase={showcase.kind}
      aria-label={`Illustrative example: ${title}`}
    >
      <div className="showcase-bar">
        <span className="showcase-kind">{KIND_LABEL[showcase.kind]}</span>
        <span className="showcase-label">Illustrative</span>
      </div>
      <div className="showcase-body">
        <ShowcaseBody showcase={showcase} />
      </div>
      <figcaption className="showcase-caption">
        Illustrative example with invented data. It is not a screenshot.
      </figcaption>
    </figure>
  );
}

function ShowcaseBody({ showcase }: { showcase: Showcase }) {
  switch (showcase.kind) {
    case "decision-answer":
      return (
        <div className="showcase-decision">
          <p className="showcase-field-label">Question</p>
          <p className="showcase-question">{showcase.question}</p>
          <p className="showcase-field-label">Case text</p>
          <p className="showcase-excerpt">{showcase.excerpt}</p>
          <dl className="showcase-answer">
            <div>
              <dt>Answer</dt>
              <dd>{showcase.answer}</dd>
            </div>
            <div>
              <dt>Probability</dt>
              <dd>{showcase.probability}</dd>
            </div>
            <div>
              <dt>Routing</dt>
              <dd>{showcase.route}</dd>
            </div>
          </dl>
        </div>
      );
    case "live-call":
      return (
        <div className="showcase-call">
          <p className="showcase-call-title">
            <span className="showcase-live-dot" aria-hidden="true" />
            {showcase.callTitle}
          </p>
          <ol className="showcase-transcript" aria-label="Transcript">
            {showcase.transcript.map((line, index) => (
              <li key={index}>
                <span className="showcase-speaker">{line.speaker}</span>
                <span>{line.text}</span>
              </li>
            ))}
          </ol>
          <div className="showcase-call-grid">
            <dl className="showcase-draft" aria-label="Draft record">
              {showcase.draft.map((row) => (
                <div key={row.field}>
                  <dt>{row.field}</dt>
                  <dd>
                    {row.value}
                    <span className="showcase-status">{row.status}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <ul className="showcase-checklist" aria-label="Checklist">
              {showcase.checklist.map((row) => (
                <li key={row.item} data-done={row.done}>
                  <span className="showcase-check" aria-hidden="true">
                    {row.done ? "✓" : ""}
                  </span>
                  {row.item}
                  <span className="sr-only">
                    {row.done ? " (covered)" : " (outstanding)"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "fund-shortlist":
      return (
        <div className="showcase-funds">
          <p className="showcase-field-label">Brief</p>
          <p className="showcase-question">{showcase.brief}</p>
          <ul className="showcase-chips" aria-label="Criteria">
            {showcase.criteria.map((criterion) => (
              <li key={criterion}>{criterion}</li>
            ))}
          </ul>
          <table className="showcase-table">
            <caption className="sr-only">Ranked shortlist</caption>
            <thead>
              <tr>
                <th scope="col">Fund</th>
                <th scope="col">Risk</th>
                <th scope="col">Fit</th>
              </tr>
            </thead>
            <tbody>
              {showcase.rows.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  <td>{row.risk}</td>
                  <td>{row.fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "grant-guide":
      return (
        <div className="showcase-guide">
          <p className="showcase-question">{showcase.organisation}</p>
          <ul className="showcase-tabs" aria-label="Guide sections">
            {showcase.tabs.map((tab, index) => (
              <li key={tab} data-active={index === 1}>
                {tab}
              </li>
            ))}
          </ul>
          <ul className="showcase-guide-items">
            {showcase.items.map((item) => (
              <li key={item.title}>
                <span>{item.title}</span>
                <span className="showcase-status">{item.status}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "app-launcher":
      return (
        <ul className="showcase-launcher" aria-label="Apps">
          {showcase.tiles.map((tile) => (
            <li key={tile.name}>
              <span className="showcase-tile-mark" aria-hidden="true">
                {tile.name.charAt(0)}
              </span>
              <span className="showcase-tile-name">{tile.name}</span>
              <span className="showcase-status">{tile.tier}</span>
              <span className="showcase-tile-note">{tile.note}</span>
            </li>
          ))}
        </ul>
      );
  }
}
