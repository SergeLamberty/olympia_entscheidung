import { Info, ArrowRight } from "lucide-react";

// In production, these would be proper domain URLs
const OLYMPIA_APP_URL = import.meta.env.PROD ? "/wahl-check" : "http://localhost:3000";

function Hero() {
  return (
    <header className="bg-gradient-to-b from-slate-100 to-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
        <div className="flex items-start gap-4 mb-6">
          <div className="mt-1 p-3 bg-slate-700 rounded-lg">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Entscheidungshilfe
              <br />
              <span className="text-slate-600">Olympia Düsseldorf</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
              Unabhängige Informationsplattform zum Ratsbürgerentscheid
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-blue-900 mb-1">
                Finde heraus, welche Position zu dir passt
              </h2>
              <p className="text-blue-700">
                Beantworte Fragen und erhalte eine Orientierung für den Ratsbürgerentscheid.
              </p>
            </div>
            <a
              href={OLYMPIA_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Wahl-Check starten
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
            Warum diese Seite?
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Bürger:innen in Düsseldorf stimmen über die Olympia-Bewerbung ab. Diese Plattform
            sammelt <strong>offene Fragen</strong>, benennt <strong>fehlende Informationen</strong>{" "}
            und dokumentiert die <strong>Positionen aller Parteien</strong> – neutral, transparent
            und übersichtlich.
          </p>
          <p className="text-sm text-slate-500 italic">
            Diese Seite ist unabhängig und nicht mit der Stadt Düsseldorf oder politischen Parteien
            verbunden.
          </p>
        </div>
      </div>
    </header>
  );
}

export default Hero;
