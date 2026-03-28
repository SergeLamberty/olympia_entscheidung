import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Methodik" };

export default function MethoPage() {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Methodik und Berechnung</h1>
      <p className="text-neutral-600 mb-8 leading-relaxed">
        Diese Seite erklärt transparent, wie das Ergebnis des Wahl-Checks berechnet wird.
      </p>

      <div className="flex flex-col gap-6">
        <Card as="section">
          <h2 className="font-bold text-neutral-900 mb-3">Antwortoptionen und Punktwerte</h2>
          <p className="text-sm text-neutral-600 mb-3 leading-relaxed">
            Jeder Antwort wird ein numerischer Wert zugewiesen:
          </p>
          <dl className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden text-sm">
            {[
              ["Dafür", "+2"],
              ["Eher dafür", "+1"],
              ["Egal", "0"],
              ["Eher dagegen", "−1"],
              ["Dagegen", "−2"],
              ["Übersprungen", "0 (wird nicht gewertet)"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col gap-1 px-4 py-2 bg-white sm:flex-row sm:items-center sm:justify-between"
              >
                <dt className="text-neutral-700">{label}</dt>
                <dd className="font-mono font-semibold text-neutral-900 sm:text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card as="section">
          <h2 className="font-bold text-neutral-900 mb-3">Fragerichtung (Pro / Contra)</h2>
          <p className="text-sm text-neutral-600 mb-3 leading-relaxed">
            Jede Frage hat eine Ausrichtung: Pro-Fragen sind so formuliert, dass Zustimmung eine
            Unterstützung der Bewerbung bedeutet. Contra-Fragen sind so formuliert, dass Zustimmung
            eine Ablehnung der Bewerbung bedeutet. Bei Contra-Fragen wird der Punktwert automatisch
            invertiert, damit das Ergebnis korrekt berechnet wird.
          </p>
          <p className="text-xs text-neutral-500 mt-2">
            Der Fragenkatalog enthält jeweils 10 Fragen mit Pro-Ausrichtung und 10 mit
            Contra-Ausrichtung für eine ausgewogene Abdeckung.
          </p>
        </Card>

        <Card as="section">
          <h2 className="font-bold text-neutral-900 mb-3">Relevanzgewichtung</h2>
          <p className="text-sm text-neutral-600 mb-3 leading-relaxed">
            Für jede Frage kannst du angeben, wie wichtig dir das Thema ist. Das beeinflusst, wie
            stark deine Antwort ins Gesamtergebnis einfließt:
          </p>
          <dl className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden text-sm">
            {[
              ["Wichtig", "Faktor ×2 (doppeltes Gewicht)"],
              ["Neutral", "Faktor ×1 (normales Gewicht)"],
              ["Unwichtig", "Faktor ×0,5 (halbes Gewicht)"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col gap-1 px-4 py-2 bg-white sm:flex-row sm:items-center sm:justify-between"
              >
                <dt className="text-neutral-700">{label}</dt>
                <dd className="text-neutral-600 sm:text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card as="section">
          <h2 className="font-bold text-neutral-900 mb-3">Berechnung des Prozentwerts</h2>
          <ol className="text-sm text-neutral-600 leading-relaxed space-y-2 list-decimal list-inside">
            <li>
              Für jede beantwortete Frage wird der Punktwert der Antwort mit dem Relevanzfaktor
              multipliziert: <span className="font-mono text-neutral-800">Punkte × Relevanz</span>
            </li>
            <li>
              Bei Contra-Fragen wird der Punktwert vor der Multiplikation invertiert (×&thinsp;−1).
            </li>
            <li>Die Einzelwerte werden zu einem Rohscore summiert.</li>
            <li>
              Der Rohscore wird auf eine Skala von 0 bis 100 normalisiert:{" "}
              <span className="font-mono text-neutral-800">
                (Rohscore − Minimum) ÷ (Maximum − Minimum) × 100
              </span>
            </li>
            <li>
              <span className="font-semibold text-neutral-800">0</span> bedeutet: maximale Ablehnung
              auf alle beantworteten Fragen.{" "}
              <span className="font-semibold text-neutral-800">100</span> bedeutet: maximale
              Zustimmung. <span className="font-semibold text-neutral-800">50</span> ist der
              neutrale Mittelpunkt.
            </li>
            <li>
              Übersprungene Fragen gehen nicht in die Berechnung ein und verändern Minimum und
              Maximum entsprechend.
            </li>
            <li>Wurden keine Fragen beantwortet, wird 50 (neutral) ausgegeben.</li>
          </ol>
        </Card>

        <Card as="section">
          <h2 className="font-bold text-neutral-900 mb-3">Einordnungsbänder</h2>
          <dl className="divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden text-sm">
            {[
              ["70 – 100", "deutlich zustimmend"],
              ["57 – 69", "eher zustimmend"],
              ["43 – 56", "ausgewogen"],
              ["30 – 42", "eher ablehnend"],
              ["0 – 29", "deutlich ablehnend"],
            ].map(([range, label]) => (
              <div
                key={range}
                className="flex flex-col gap-1 px-4 py-2 bg-white sm:flex-row sm:items-center sm:justify-between"
              >
                <dt className="font-mono text-neutral-500">{range}</dt>
                <dd className="text-neutral-700 sm:text-right">{label}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <div
          role="note"
          className="px-4 py-3 bg-neutral-100 border border-neutral-300 rounded-xl text-sm text-neutral-600"
        >
          <span className="font-semibold text-neutral-700">Wichtiger Hinweis: </span>
          Dieses Tool ist eine Orientierungshilfe. Das Ergebnis spiegelt die Tendenz deiner
          Antworten wider – es stellt keine politische Empfehlung dar und ersetzt keine eigene
          Urteilsbildung. Alle Inhalte und Fragen wurden nach bestem Wissen neutral formuliert.
        </div>
      </div>
    </PageLayout>
  );
}
