import type { Metadata } from "next";
import { loadArgumentsContent, loadOverviewContent } from "@/lib/info-loader";
import { DisclaimerBanner } from "@/components/info/DisclaimerBanner";
import { ArgumentsSection } from "@/components/info/ArgumentsSection";

export const metadata: Metadata = { title: "Argumente" };

export default function InfoArgumentePage() {
  const content = loadArgumentsContent();
  const { disclaimer } = loadOverviewContent();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">{content.pageTitle}</h1>
      <p className="text-neutral-600 mb-4 leading-relaxed">{content.pageIntro}</p>

      <DisclaimerBanner text={disclaimer} />

      {/* Editorial note about the debate */}
      <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        <span className="font-semibold">Redaktioneller Hinweis: </span>
        {content.debateNote}
      </div>

      <ArgumentsSection pro={content.pro} contra={content.contra} />
    </div>
  );
}
