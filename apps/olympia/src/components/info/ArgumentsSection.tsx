import type { Argument } from "@/types/info";

interface ArgumentColumnProps {
  headline: string;
  arguments: Argument[];
  /** Purely visual label, no semantic colour-coding */
  marker: string;
}

function ArgumentColumn({ headline, arguments: args, marker }: ArgumentColumnProps) {
  return (
    <section className="flex-1">
      <h2 className="text-base font-bold text-neutral-900 mb-3 flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">
          {marker}
        </span>
        {headline}
      </h2>
      <ul className="flex flex-col gap-3">
        {args.map((arg) => (
          <li
            key={arg.id}
            className="bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-700 leading-relaxed"
          >
            {arg.text}
            {arg.sourceRef && (
              <span className="block mt-1 text-xs text-neutral-400">Quelle: {arg.sourceRef}</span>
            )}
          </li>
        ))}
        {args.length === 0 && (
          <li className="text-neutral-400 text-sm">Keine Einträge vorhanden.</li>
        )}
      </ul>
    </section>
  );
}

interface ArgumentsSectionProps {
  pro: { headline: string; arguments: Argument[] };
  contra: { headline: string; arguments: Argument[] };
}

export function ArgumentsSection({ pro, contra }: ArgumentsSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6">
      <ArgumentColumn headline={pro.headline} arguments={pro.arguments} marker="◇" />
      <ArgumentColumn headline={contra.headline} arguments={contra.arguments} marker="◇" />
    </div>
  );
}
