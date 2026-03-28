import type { Metadata } from "next";
import { loadProcessContent } from "@/lib/info-loader";
import { loadOverviewContent } from "@/lib/info-loader";
import { DisclaimerBanner } from "@/components/info/DisclaimerBanner";
import { ProcessSteps } from "@/components/info/ProcessSteps";

export const metadata: Metadata = { title: "Ablauf der Abstimmung" };

export default function InfoAblaufPage() {
  const content = loadProcessContent();
  const { disclaimer } = loadOverviewContent();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">{content.pageTitle}</h1>
      <p className="text-neutral-600 mb-6 leading-relaxed">{content.pageIntro}</p>

      <DisclaimerBanner text={disclaimer} />

      {content.steps.length > 0 ? (
        <ProcessSteps steps={content.steps} />
      ) : (
        <p className="text-neutral-400 text-sm">Keine Inhalte verfügbar.</p>
      )}
    </div>
  );
}
