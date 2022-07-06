import Link from "next/link";
import { useRef } from "react";
import { trpc } from "../utils/trpc";
import QuestionCreator from "./create";

export default function Home() {
  const { data, isLoading } = trpc.useQuery(["questions.get-all-my-questions"]);
  if (isLoading) return <div>Loading...</div>;

  if (data)
    return (
      <div className="p-6 flex flex-col">
        <div className="flex flex-col">
          <div className="text-2xl font-bold">Your Questions</div>
          {data.map(({ question, id, createdAt }) => (
            <div key={id} className="flex flex-col my-2">
              <Link href={`/question/${id}`}>{question}</Link>
              <p>Created on {createdAt.toDateString()}</p>
            </div>
          ))}
        </div>
        <Link href="/create">Create New Question</Link>
      </div>
    );
}
