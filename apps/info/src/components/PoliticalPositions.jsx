import { ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { politicalStatements, sortStatementsByResponseDate } from "../data";

function PoliticalPositions() {
  const sortedStatements = sortStatementsByResponseDate(politicalStatements);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Positionen der Parteien</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            Alle im Rat vertretenen Parteien wurden um Stellungnahme gebeten. Die Antworten sind
            chronologisch nach Eingang sortiert.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-slate-700">
                Geantwortet: {sortedStatements.filter((s) => s.status === "geantwortet").length}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-slate-700">
                Ausstehend: {sortedStatements.filter((s) => s.status === "angefragt").length}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sortedStatements.map((statement) => (
            <article
              key={statement.id}
              className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{statement.partyName}</h3>
                    {statement.status === "geantwortet" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Geantwortet
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" />
                        Angefragt
                      </span>
                    )}
                  </div>
                  {statement.responseDate && (
                    <p className="text-sm text-slate-500">
                      Eingegangen am {formatDate(statement.responseDate)}
                    </p>
                  )}
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed">{statement.statementSummary}</p>
              </div>

              {statement.sourceLink && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <a
                    href={statement.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Vollständige Stellungnahme lesen
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-10 p-6 bg-slate-100 border border-slate-300 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-2">Methodik & Transparenz</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Alle Parteien wurden identisch kontaktiert und gebeten, ihre Position zur
            Olympia-Bewerbung darzulegen. Die Reihenfolge richtet sich ausschließlich nach dem
            Eingangsdatum der Antworten. Stellungnahmen werden ungekürzt und im Originalwortlaut
            wiedergegeben.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PoliticalPositions;
