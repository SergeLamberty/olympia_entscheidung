import type { Metadata } from "next";
import { loadSourcesContent, loadOverviewContent } from "@/lib/info-loader";
import { DisclaimerBanner } from "@/components/info/DisclaimerBanner";
import { SourceCard } from "@/components/info/SourceCard";

export const metadata: Metadata = { title: "Quellen" };

export default function InfoQuellenPage() {
  const content = loadSourcesContent();
  const { disclaimer } = loadOverviewContent();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">{content.pageTitle}</h1>
      <p className="text-neutral-600 mb-6 leading-relaxed">{content.pageIntro}</p>

      <DisclaimerBanner text={disclaimer} />

      <div className="flex flex-col gap-4">
        {content.sources.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
        {content.sources.length === 0 && (
          <p className="text-neutral-400 text-sm">Keine Quellen verfügbar.</p>
        )}
      </div>
    </div>
  );
}
