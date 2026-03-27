import { AlertCircle, HelpCircle } from "lucide-react";
import { missingInfo, groupInfoByCategory } from "../data";

function InfoGaps() {
  const groupedInfo = groupInfoByCategory(missingInfo);

  const getStatusBadge = (status) => {
    if (status === "offen") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
          <AlertCircle className="w-3 h-3" />
          Information fehlt
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
        <HelpCircle className="w-3 h-3" />
        Teilweise bekannt
      </span>
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Offene Fragen & fehlende Informationen
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Diese Punkte sind bisher nicht ausreichend geklärt und sollten vor einer fundierten
            Entscheidung transparent gemacht werden.
          </p>
        </div>

        {Object.entries(groupedInfo).map(([category, items]) => (
          <div key={category} className="mb-10">
            <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
              {category}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="font-semibold text-slate-900 leading-tight">{item.title}</h4>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Hinweis:</strong> Diese Liste wird kontinuierlich aktualisiert. Sobald
            Informationen verfügbar sind, werden sie hier ergänzt.
          </p>
        </div>
      </div>
    </section>
  );
}

export default InfoGaps;
