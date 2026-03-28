import { Card } from "@/components/ui/Card";
import type { PositionScore } from "@/types/quiz";
import type { ResultsContent } from "@/types/content";
import { getScoreLabel } from "@/lib/matching";

interface ResultCardProps {
  score: PositionScore;
  position: ResultsContent["positions"][number];
  isTop?: boolean;
}

export function ResultCard({ score, position, isTop = false }: ResultCardProps) {
  const label = getScoreLabel(score.matchPercent);

  return (
    <Card className={isTop ? "border-2 border-primary-400" : ""}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: position.color }}
            aria-hidden="true"
          />
          <h3 className="font-bold text-neutral-900 text-lg">{position.label}</h3>
        </div>
        {isTop && (
          <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
            Beste Übereinstimmung
          </span>
        )}
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm text-neutral-500 mb-1">
          <span>{label}</span>
          <span className="font-semibold text-neutral-800">{score.matchPercent} %</span>
        </div>
        <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${score.matchPercent}%`, backgroundColor: position.color }}
          />
        </div>
      </div>

      <p className="text-sm text-neutral-600 leading-relaxed">{position.shortDescription}</p>
    </Card>
  );
}
