import type { HowItWorksStep } from "@/types/content";

interface HowItWorksSectionProps {
  headline: string;
  steps: HowItWorksStep[];
}

export function HowItWorksSection({ headline, steps }: HowItWorksSectionProps) {
  return (
    <section aria-labelledby="how-it-works-heading" className="py-12">
      <h2
        id="how-it-works-heading"
        className="text-2xl font-bold text-neutral-900 mb-8 text-center"
      >
        {headline}
      </h2>
      <ol className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        {steps.map((step) => (
          <li key={step.number} className="flex-1 flex flex-col items-center text-center">
            <span className="w-10 h-10 rounded-full bg-primary-600 text-white font-bold text-lg flex items-center justify-center mb-3 flex-shrink-0">
              {step.number}
            </span>
            <h3 className="font-semibold text-neutral-900 mb-1">{step.title}</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
