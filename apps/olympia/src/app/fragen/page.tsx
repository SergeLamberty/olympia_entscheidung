import { loadQuestionsContent } from "@/lib/content-loader";
import { QuestionsFlow } from "@/components/features/QuestionsFlow";
import { PageLayout } from "@/components/layout/PageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Fragen" };

export default function FragenPage() {
  const questionsContent = loadQuestionsContent();
  return (
    <PageLayout>
      <QuestionsFlow questionsContent={questionsContent} />
    </PageLayout>
  );
}
