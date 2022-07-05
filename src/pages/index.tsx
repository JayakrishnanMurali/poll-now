import Link from "next/link";
import { useRef } from "react";
import { trpc } from "../utils/trpc";

const QuestionCreator: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: () => {
      client.invalidateQueries("questions.get-all");
      if (!inputRef.current) return;
      inputRef.current.value = "";
    },
  });

  return (
    <input
      ref={inputRef}
      disabled={isLoading}
      className="border-2"
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          console.log("Enter!! ", event.currentTarget.value);
          mutate({ question: event.currentTarget.value });
        }
      }}
    ></input>
  );
};

export default function Home() {
  const { data, isLoading } = trpc.useQuery(["questions.get-all"]);
  if (isLoading) return <div>Loading...</div>;

  if (data)
    return (
      <div className="p-6 flex flex-col">
        <div className="flex flex-col">
          <div className="text-2xl font-bold">Questions</div>
          {data.map(({ question, id }) => (
            <Link href={`/question/${id}`} key={id}>
              {question}
            </Link>
          ))}
        </div>
        <QuestionCreator />
      </div>
    );
}
