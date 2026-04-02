import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { getAnalyticsStats } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Interne Statistik",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

function formatValue(value: number | null, suffix = ""): string {
  return value === null ? "Noch keine Daten" : `${value}${suffix}`;
}

export default async function StatistikPage() {
  if (process.env.INTERNAL_STATS_ENABLED !== "true") {
    notFound();
  }
  const stats = await getAnalyticsStats();

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Interne Statistik</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500 mb-1">Eindeutige Besucher</p>
          <p className="text-3xl font-bold text-neutral-900">{stats.uniqueVisitors}</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500 mb-1">Abgeschlossene Durchläufe</p>
          <p className="text-3xl font-bold text-neutral-900">{stats.completedVisitors}</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500 mb-1">Durchschnittlicher Score</p>
          <p className="text-3xl font-bold text-neutral-900">
            {formatValue(stats.averageScore, " / 100")}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500 mb-1">Abschlussquote</p>
          <p className="text-3xl font-bold text-neutral-900">
            {formatValue(stats.completionRate, " %")}
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
