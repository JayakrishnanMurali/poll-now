import type { NextPage } from "next";
import { prisma } from "../server/db/client";

export default function Home(props: any) {
  return (
    <>
      <code>{props?.questions}</code>
    </>
  );
}

export const getServerSideProps = async () => {
  const questions = await prisma.pollQuestions.findMany();
  return {
    props: {
      questions: JSON.stringify(questions),
    },
  };
};
