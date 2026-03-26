import { loadFaqContent } from "@/lib/content-loader";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  const faq = loadFaqContent();
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">{faq.headline}</h1>
      {faq.intro && <p className="text-neutral-600 mb-8">{faq.intro}</p>}
      <div className="flex flex-col gap-4">
        {faq.items.map((item) => (
          <Card key={item.id} as="article">
            <h2 className="font-semibold text-neutral-900 mb-2">{item.question}</h2>
            <p className="text-neutral-600 text-sm leading-relaxed">{item.answer}</p>
          </Card>
        ))}
        {faq.items.length === 0 && (
          <p className="text-neutral-400">Noch keine FAQ-Einträge vorhanden.</p>
        )}
      </div>
    </PageLayout>
  );
}
