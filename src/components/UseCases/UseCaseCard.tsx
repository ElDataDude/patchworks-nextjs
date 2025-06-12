interface UseCaseCardProps {
  title: string;
  problem: string;
  solution: string;
  tool: string;
  result: string;
}

const UseCaseCard = ({
  title,
  problem,
  solution,
  tool,
  result,
}: UseCaseCardProps) => {
  return (
    <div className="wow fadeInUp rounded-md bg-white p-8 shadow-one dark:bg-gray-dark">
      <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
        {title}
      </h3>
      
      <div className="mb-5">
        <h4 className="mb-2 text-sm font-semibold text-black dark:text-white">
          Problem:
        </h4>
        <p className="text-sm text-body-color dark:text-body-color-dark">
          {problem}
        </p>
      </div>
      
      <div className="mb-5">
        <h4 className="mb-2 text-sm font-semibold text-black dark:text-white">
          Solution:
        </h4>
        <p className="text-sm text-body-color dark:text-body-color-dark">
          {solution}
        </p>
      </div>
      
      <div className="mb-5">
        <h4 className="mb-2 text-sm font-semibold text-black dark:text-white">
          Technology:
        </h4>
        <p className="text-sm text-body-color dark:text-body-color-dark">
          {tool}
        </p>
      </div>
      
      <div className="mb-1">
        <h4 className="mb-2 text-sm font-semibold text-primary">
          Results:
        </h4>
        <p className="text-sm font-medium text-body-color dark:text-body-color-dark">
          {result}
        </p>
      </div>
    </div>
  );
};

export default UseCaseCard;
