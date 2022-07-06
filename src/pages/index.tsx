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
        <div className="header flex w-full justify-between">
          <div className="text-2xl font-bold">Your Questions</div>
          <Link href="/create">
            <a className="bg-gray-300 rounded text-gray-900 p-4">
              Create New Question
            </a>
          </Link>
        </div>
        <div className="flex flex-col">
          {data.map(({ question, id, createdAt }) => (
            <div key={id} className="flex flex-col my-2">
              <Link href={`/question/${id}`}>{question}</Link>
              <p>Created on {createdAt.toDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    );
}
