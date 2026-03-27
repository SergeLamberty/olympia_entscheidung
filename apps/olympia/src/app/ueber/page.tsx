import { loadSiteContent } from "@/lib/content-loader";
import { PageLayout } from "@/components/layout/PageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Über das Projekt" };

export default function UeberPage() {
  const site = loadSiteContent();
  const { about } = site;
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">{about.headline}</h1>
      {about.text.split("\n\n").map((para, i) => (
        <p key={i} className="text-neutral-600 leading-relaxed mb-4">
          {para}
        </p>
      ))}
    </PageLayout>
  );
}
