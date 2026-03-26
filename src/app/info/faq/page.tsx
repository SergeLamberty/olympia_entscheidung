import type { Metadata } from "next";
import { loadInfoFaqContent, loadOverviewContent } from "@/lib/info-loader";
import { DisclaimerBanner } from "@/components/info/DisclaimerBanner";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "FAQ" };

export default function InfoFaqPage() {
  const content = loadInfoFaqContent();
  const { disclaimer } = loadOverviewContent();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">{content.pageTitle}</h1>
      <p className="text-neutral-600 mb-6 leading-relaxed">{content.pageIntro}</p>

      <DisclaimerBanner text={disclaimer} />

      <div className="flex flex-col gap-4">
        {content.items.map((item) => (
          <Card key={item.id} as="article">
            <h2 className="font-semibold text-neutral-900 mb-2 leading-snug">
              {item.question}
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">{item.answer}</p>
            {item.sourceRef && (
              <p className="mt-2 text-xs text-neutral-400">Quelle: {item.sourceRef}</p>
            )}
          </Card>
        ))}
        {content.items.length === 0 && (
          <p className="text-neutral-400 text-sm">Keine FAQ-Einträge verfügbar.</p>
        )}
      </div>
    </div>
  );
}
