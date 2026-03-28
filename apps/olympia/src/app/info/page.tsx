import type { Metadata } from "next";
import { loadOverviewContent } from "@/lib/info-loader";
import { DisclaimerBanner } from "@/components/info/DisclaimerBanner";
import { FactList } from "@/components/info/FactList";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Überblick" };

export default function InfoOverviewPage() {
  const content = loadOverviewContent();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">{content.pageTitle}</h1>
      <p className="text-neutral-600 mb-6 leading-relaxed">{content.pageIntro}</p>

      <DisclaimerBanner text={content.disclaimer} />

      {content.sections.map((section) => (
        <FactList key={section.id} section={section} />
      ))}

      {content.sections.length === 0 && (
        <p className="text-neutral-400 text-sm">Keine Inhalte verfügbar.</p>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button href="/info/ablauf" variant="secondary" size="md">
          Abstimmungsablauf →
        </Button>
        <Button href="/info/argumente" variant="ghost" size="md">
          Argumente ansehen
        </Button>
      </div>
    </div>
  );
}
