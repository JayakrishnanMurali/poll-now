import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionPageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading, error } = trpc.useQuery([
    "questions.get-by-id",
    { id },
  ]);

  if (!isLoading && !data) return <div>Question Not Found!</div>;

  return <div>{data?.question}</div>;
};

const QuestionPage = () => {
  const { query } = useRouter();

  const { id } = query;

  if (!id || typeof id !== "string") return <div>No Id!!</div>;

  return <QuestionPageContent id={id} />;
};

export default QuestionPage;