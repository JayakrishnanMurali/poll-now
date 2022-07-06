import Link from "next/link";
import { useRef } from "react";
import { trpc } from "../utils/trpc";

const QuestionCreator: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: () => {
      client.invalidateQueries("questions.get-all-my-questions");
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

export default QuestionCreator;
