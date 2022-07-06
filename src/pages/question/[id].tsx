import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionPageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading, error } = trpc.useQuery([
    "questions.get-by-id",
    { id },
  ]);

  if (!isLoading && !data) return <div>Question Not Found!</div>;

  return (
    <div className="p-8 flex flex-col">
      {data?.isOwner && (
        <div className=" bg-red-700 rounded-md p-3 text-white">
          You made this!
        </div>
      )}
      <div className="text-2xl font-bold">{data?.question?.question}</div>
      <div>
        {(data?.question?.options as string[])?.map((option, index) => (
          <div key={index}>{option}</div>
        ))}
      </div>
    </div>
  );
};

const QuestionPage = () => {
  const { query } = useRouter();

  const { id } = query;

  if (!id || typeof id !== "string") return <div>No Id!!</div>;

  return <QuestionPageContent id={id} />;
};

export default QuestionPage;
