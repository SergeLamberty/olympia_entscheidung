import { loadQuestionsContent } from "@/lib/content-loader";
import { ResultsView } from "@/components/features/ResultsView";
import { PageLayout } from "@/components/layout/PageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ergebnis" };

export default function ErgebnisPage() {
  const questionsContent = loadQuestionsContent();
  return (
    <PageLayout>
      <ResultsView questionsContent={questionsContent} />
    </PageLayout>
  );
}
