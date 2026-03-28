/**
 * Datenstruktur für die Olympia-Informationsplattform
 * Stand: März 2026
 */

// Fehlende oder unklare Informationen
export const missingInfo = [
  {
    id: "kosten-nutzen",
    title: "Kosten-Nutzen-Analyse",
    description:
      "Eine unabhängige, detaillierte Kosten-Nutzen-Analyse liegt nicht öffentlich vor. Welche langfristigen wirtschaftlichen Effekte sind zu erwarten?",
    status: "offen",
    category: "Finanzen",
  },
  {
    id: "sicherheitskosten",
    title: "Sicherheitskosten",
    description:
      "Die genauen Kosten für Polizeieinsätze, Sicherheitstechnik und Eventschutz sind nicht beziffert. Wer trägt diese Kosten?",
    status: "offen",
    category: "Sicherheit",
  },
  {
    id: "finanzierungsschluessel",
    title: "Finanzierungsschlüssel",
    description:
      "Der exakte Verteilungsschlüssel zwischen Bund, Land und Kommune ist nicht abschließend geklärt.",
    status: "unklar",
    category: "Finanzen",
  },
  {
    id: "nachnutzung",
    title: "Nachnutzungskonzept",
    description:
      "Konkrete Pläne zur Nachnutzung von olympischen Anlagen fehlen. Welche Verpflichtungen entstehen langfristig?",
    status: "unklar",
    category: "Stadtentwicklung",
  },
  {
    id: "umweltauswirkungen",
    title: "Umweltauswirkungen",
    description:
      "Eine umfassende Umweltverträglichkeitsprüfung mit konkreten Kompensationsmaßnahmen liegt nicht vor.",
    status: "offen",
    category: "Umwelt",
  },
  {
    id: "buergerhaushalt",
    title: "Auswirkungen auf Bürgerhaushalt",
    description:
      "Welche städtischen Projekte müssten ggf. zurückgestellt werden? Gibt es Einschränkungen bei Investitionen in Schulen, ÖPNV oder Soziales?",
    status: "offen",
    category: "Finanzen",
  },
];

// Fragen von Bürger:innen
export const citizenQuestions = [
  {
    id: "q1",
    question: "Wer haftet für eventuelle Mehrkosten, die über die Budget-Planung hinausgehen?",
    category: "Finanzen",
    dateSubmitted: "2026-02-15",
  },
  {
    id: "q2",
    question:
      "Wie wird sichergestellt, dass soziale Einrichtungen nicht unter der Finanzierung leiden?",
    category: "Soziales",
    dateSubmitted: "2026-02-18",
  },
  {
    id: "q3",
    question: "Welche Verkehrskonzepte gibt es, um Staus während der Spiele zu vermeiden?",
    category: "Verkehr",
    dateSubmitted: "2026-02-20",
  },
  {
    id: "q4",
    question: "Wie partizipieren Bürger:innen an den Planungen? Gibt es Beteiligungsformate?",
    category: "Partizipation",
    dateSubmitted: "2026-02-22",
  },
];

// Positionen der politischen Parteien
export const politicalStatements = [
  {
    id: "volt1",
    partyName: "Volt",
    partyColor: "#502379",
    statementSummary:
      "Volt fordert eine transparente Finanzplanung mit klaren Haftungsgrenzen für die Kommune. Die Partei betont die Notwendigkeit einer unabhängigen Kosten-Nutzen-Analyse und eines verbindlichen Nachnutzungskonzepts. Bürgerbeteiligung soll frühzeitig verankert werden.",
    sourceLink: "https://example.com/volt-statement",
    responseDate: "2026-03-15",
    status: "geantwortet",
  },
  {
    id: "spd1",
    partyName: "SPD",
    partyColor: "#E3000F",
    statementSummary:
      "Die SPD unterstützt die Olympia-Bewerbung als Chance für wirtschaftlichen Aufschwung und internationale Sichtbarkeit. Soziale Infrastruktur dürfe jedoch nicht vernachlässigt werden.",
    sourceLink: "https://example.com/spd-statement",
    responseDate: "2026-03-18",
    status: "geantwortet",
  },
  {
    id: "cdu1",
    partyName: "CDU",
    partyColor: "#000000",
    statementSummary:
      "Die CDU befürwortet die Bewerbung und hebt Potenziale für Infrastrukturausbau und Tourismus hervor. Die Partei verweist auf erfolgreiche olympische Spiele in anderen Städten.",
    sourceLink: "https://example.com/cdu-statement",
    responseDate: "2026-03-10",
    status: "geantwortet",
  },
  {
    id: "gruene1",
    partyName: "Bündnis 90/Die Grünen",
    partyColor: "#1AA037",
    statementSummary:
      "Die Grünen fordern ein klimaneutrales Olympia-Konzept mit strikten Umweltauflagen. Nachhaltige Mobilität und Flächennutzung seien zentral. Eine Bewerbung sei nur mit verbindlichen Klimazielen vertretbar.",
    sourceLink: "https://example.com/gruene-statement",
    responseDate: "2026-03-12",
    status: "geantwortet",
  },
  {
    id: "fdp1",
    partyName: "FDP",
    partyColor: "#FFED00",
    statementSummary:
      "Die FDP sieht Olympia als Wirtschaftsmotor und Innovations-Katalysator. Private Investitionen sollen gefördert, bürokratische Hürden abgebaut werden.",
    sourceLink: "https://example.com/fdp-statement",
    responseDate: "2026-03-20",
    status: "geantwortet",
  },
  {
    id: "linke1",
    partyName: "Die Linke",
    partyColor: "#BE3075",
    statementSummary:
      "Die Linke lehnt die Bewerbung ab und kritisiert fehlende soziale Absicherungen. Ressourcen sollten stattdessen in Bildung, Wohnungsbau und soziale Gerechtigkeit fließen.",
    sourceLink: "",
    responseDate: "2026-03-08",
    status: "geantwortet",
  },
  {
    id: "afd1",
    partyName: "AfD",
    partyColor: "#0489DB",
    statementSummary: "Anfrage gestellt, Antwort ausstehend.",
    sourceLink: "",
    responseDate: null,
    status: "angefragt",
  },
];

/**
 * Helper-Funktion: Sortiert Parteipositionen nach Antwortdatum (neueste zuerst)
 */
export const sortStatementsByResponseDate = (statements) => {
  return [...statements].sort((a, b) => {
    if (a.status === "angefragt" && b.status === "geantwortet") return 1;
    if (a.status === "geantwortet" && b.status === "angefragt") return -1;

    if (a.responseDate && b.responseDate) {
      return new Date(b.responseDate) - new Date(a.responseDate);
    }

    return 0;
  });
};

/**
 * Helper-Funktion: Gruppiert fehlende Informationen nach Kategorie
 */
export const groupInfoByCategory = (infoArray) => {
  return infoArray.reduce((acc, item) => {
    const category = item.category || "Sonstiges";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
};
