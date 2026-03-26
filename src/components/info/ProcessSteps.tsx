import type { ProcessStep } from "@/types/info";

interface ProcessStepsProps {
  steps: ProcessStep[];
}

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <ol className="flex flex-col gap-0">
      {steps.map((step, idx) => (
        <li key={step.id} className="flex gap-4">
          {/* Step indicator */}
          <div className="flex flex-col items-center">
            <span className="w-8 h-8 rounded-full bg-neutral-800 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
              {step.order}
            </span>
            {idx < steps.length - 1 && (
              <span className="w-px flex-1 bg-neutral-200 my-1" aria-hidden="true" />
            )}
          </div>
          {/* Content */}
          <div className="pb-6">
            <h3 className="font-semibold text-neutral-900 mb-1 leading-snug">
              {step.title}
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {step.description}
            </p>
            {step.sourceRef && (
              <p className="text-xs text-neutral-400 mt-1">
                Quelle: {step.sourceRef}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
