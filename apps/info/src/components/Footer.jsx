import { Scale, Mail, FileText } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid gap-8 sm:grid-cols-3 mb-10">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <FileText className="w-4 h-4" />
              Über diese Seite
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Unabhängige Bürgerinitiative zur transparenten Information über die Olympia-Bewerbung
              Düsseldorf. Keine Verbindung zu Parteien oder der Stadt.
            </p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <Scale className="w-4 h-4" />
              Methodik
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Wir sammeln öffentlich verfügbare Informationen, stellen Anfragen an alle Parteien und
              dokumentieren Lücken in der Informationslage.
            </p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
              <Mail className="w-4 h-4" />
              Kontakt
            </h3>
            <p className="text-sm leading-relaxed text-slate-400 mb-3">
              Hinweise, Korrekturen oder Fragen?
            </p>
            <a
              href="mailto:info@olympia-info-duesseldorf.de"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              info@olympia-info-duesseldorf.de
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-wrap gap-6 text-xs text-slate-500">
            <a href="#impressum" className="hover:text-slate-300 transition-colors">
              Impressum
            </a>
            <a href="#datenschutz" className="hover:text-slate-300 transition-colors">
              Datenschutz
            </a>
            <a href="#barrierefreiheit" className="hover:text-slate-300 transition-colors">
              Barrierefreiheit
            </a>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            © 2026 Olympia Info Düsseldorf · Diese Seite ist politisch unabhängig
          </p>
        </div>

        <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Disclaimer:</strong> Diese Website ist eine
            unabhängige Informationsplattform und keine offizielle Seite der Stadt Düsseldorf oder
            einer politischen Partei. Alle Angaben erfolgen nach bestem Wissen und Gewissen, jedoch
            ohne Gewähr auf Vollständigkeit.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
