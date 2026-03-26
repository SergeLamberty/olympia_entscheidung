import type { Source, SourceType } from "@/types/info";

const TYPE_LABELS: Record<SourceType, string> = {
  official: "Offizielle Quelle",
  media: "Medienbericht",
  document: "Dokument / PDF",
  other: "Weitere Quelle",
};

interface SourceCardProps {
  source: Source;
}

export function SourceCard({ source }: SourceCardProps) {
  return (
    <article className="bg-white border border-neutral-200 rounded-xl px-4 py-4">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="font-semibold text-neutral-900 text-base leading-snug">
          {source.title}
        </h3>
        <span className="flex-shrink-0 text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
          {TYPE_LABELS[source.type]}
        </span>
      </div>
      <p className="text-sm text-neutral-600 leading-relaxed mb-3">
        {source.description}
      </p>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={[
          "inline-flex items-center gap-1 text-sm font-medium text-primary-700",
          "hover:text-primary-900 underline underline-offset-2",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded",
        ].join(" ")}
      >
        Zur Quelle
        <span aria-label="öffnet in neuem Tab">↗</span>
      </a>
      {source.accessedAt && (
        <p className="mt-2 text-xs text-neutral-400">
          Zuletzt geprüft: {source.accessedAt}
        </p>
      )}
    </article>
  );
}
