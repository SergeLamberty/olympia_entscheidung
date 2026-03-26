import type { InfoSection } from "@/types/info";

interface FactListProps {
  section: InfoSection;
}

export function FactList({ section }: FactListProps) {
  return (
    <section aria-labelledby={`section-${section.id}`} className="mb-8">
      <h2
        id={`section-${section.id}`}
        className="text-lg font-bold text-neutral-900 mb-2"
      >
        {section.headline}
      </h2>
      {section.intro && (
        <p className="text-sm text-neutral-500 mb-4">{section.intro}</p>
      )}
      <dl className="flex flex-col divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
        {section.facts.map((fact) => (
          <div key={fact.id} className="px-4 py-3 bg-white">
            <dt className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">
              {fact.label}
            </dt>
            <dd className="text-base text-neutral-900 leading-snug">
              {fact.value}
              {fact.sourceRef && (
                <span className="ml-2 text-xs text-neutral-400">
                  (Quelle: {fact.sourceRef})
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
