interface UseCaseCardProps {
  number: string;
  title: string;
  problem: string;
  solution: string;
  tool: string;
  result: string;
}

export default function UseCaseCard({
  number,
  title,
  problem,
  solution,
  tool,
  result,
}: UseCaseCardProps) {
  return (
    <article className="case-file">
      <span className="item-number" aria-hidden="true">
        {number}
      </span>
      <h3 className="item-title">{title}</h3>
      <dl className="case-copy">
        <div className="case-field">
          <dt>Problem:</dt>
          <dd>{problem}</dd>
        </div>
        <div className="case-field">
          <dt>Solution:</dt>
          <dd>{solution}</dd>
        </div>
      </dl>
      <dl className="case-outcome">
        <div className="case-field">
          <dt>Technology:</dt>
          <dd>{tool}</dd>
        </div>
        <div className="case-field case-field--result">
          <dt>Results:</dt>
          <dd>{result}</dd>
        </div>
      </dl>
    </article>
  );
}
