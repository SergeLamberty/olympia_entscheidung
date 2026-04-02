/**
 * Datenstruktur für die Olympia-Informationsplattform
 * Stand: März 2026
 */

// Quellenverzeichnis mit vollständigen Referenzen
export const sources = [
  {
    id: "src-paris-legacy",
    shortRef: "[1]",
    title: "The Legacy of the Paris 2024 Olympic and Paralympic Games",
    description: "Offizieller Bericht zu Nachhaltigkeitskonzept, Nachnutzung und Auftragsvergabe (37% an KMUs, S.21).",
    url: "https://olympics.com/ioc/paris-2024-legacy",
    type: "report",
    accessedAt: "2026-03-28",
  },
  {
    id: "src-olympic-jobs",
    shortRef: "[2]",
    title: "The Olympic Job Market: Before And After The Games",
    description: "Analyse des Arbeitsmarkts vor und nach Olympischen Spielen. Mehrzahl der Jobs wurde ca. 8 Monate vor den Spielen ausgeschrieben.",
    url: "https://example.com/olympic-job-market",
    type: "study",
    accessedAt: "2026-03-28",
  },
  {
    id: "src-paris-carbon",
    shortRef: "[3]",
    title: "The Paris 2024 Games: a far lower carbon footprint than previous editions",
    description: "CO₂-Bilanz Paris 2024: ca. 2 Mt CO₂-Äquivalent.",
    url: "https://olympics.com/ioc/news/paris-2024-carbon-footprint",
    type: "report",
    accessedAt: "2026-03-28",
  },
  {
    id: "src-paris-economic",
    shortRef: "[4]",
    title: "Paris 2024 Olympic Games had modest economic impact",
    description: "Event-Budget ca. 3 Mrd. €, Infrastruktur ca. 3,6 Mrd. € (Budget-Überschreitung ~10%), BIP-Effekt nur ca. 0,07%.",
    url: "https://www.sportresolutions.com/paris-2024-economic-impact",
    type: "study",
    accessedAt: "2026-03-28",
  },
  {
    id: "src-mdr-kosten",
    shortRef: "[5a]",
    title: "MDR Aktuell – Olympia-Bewerbung ist eine Millioneninvestition",
    description: "Die vier deutschen Bewerberstädte planen gemeinsam ca. 50 Mio. € für die nationale Vorauswahlphase. Gesamtkosten der Bewerbung: 50-100 Mio. € (Schätzung).",
    url: "https://www.mdr.de/nachrichten/deutschland/wirtschaft/olympia-bewerbung-kosten-100.html",
    type: "media",
    accessedAt: "2026-03-27",
  },
  {
    id: "src-rechnungshof-hamburg",
    shortRef: "[5b]",
    title: "Rechnungshof Hamburg – Beratende Äußerung 2015",
    description: "Warnung vor 'erheblichen Planungs- und Kostensteigerungsrisiken'. Bewerbungsbudget bis 15 Mio. € (Tz. 87), Bürgerschaftsreferendum 4,8 Mio. € (Fn. 105), Sanierungsstau 4,7 Mrd. € (Tz. 64).",
    url: "https://www.hamburg.de/resource/blob/246228/9df3897982be73d249b983da69279c61/beratendeaeusserung-2015-olympia-pdf-data.pdf",
    type: "document",
    accessedAt: "2026-03-28",
  },
  {
    id: "src-tokyo-audit",
    shortRef: "[5c]",
    title: "Board of Audit Japan – Prüfbericht Tokyo 2020",
    description: "Kostentrend olympischer Sommerspiele: 1,7 Mrd. € (2008) → 3,2 Mrd. € (2024) – nur Ausrichtung, ohne Infrastruktur.",
    url: "https://www.espn.com/olympics/story/_/id/35303667/",
    type: "document",
    accessedAt: "2026-03-28",
  },
  {
    id: "src-airbnb-paris",
    shortRef: "[6]",
    title: "Airbnb – Buchungen Paris 2024",
    description: "Anstieg Airbnb-Angebote +40%, Buchungen +400%. Durchschnittliche Einnahmen ca. 2.000 € pro Gastgeber. Verschärfung der Wohnsituation.",
    url: "https://news.airbnb.com/bookings-in-the-paris-region-during-the-olympic-games-up-400/",
    type: "media",
    accessedAt: "2026-03-28",
  },
  {
    id: "src-olympiabewerbung-nrw",
    title: "Olympiabewerbung NRW – Düsseldorf",
    description: "Offizielle Informationsseite zu Kosten, Finanzierung und öffentlichen Mitteln.",
    url: "https://olympiabewerbung.nrw/duesseldorf",
    type: "official",
    accessedAt: "2026-03-25",
  },
  {
    id: "src-buergerfragen",
    title: "Bürgerfragen-Plattform – Düsseldorf Marketing",
    description: "Plattform für Bürgerfragen, betrieben im Rahmen der Kampagne 'Unsere Städte. Unsere Spiele.'",
    url: "https://stadtgestalten.duesseldorf-marketing.de",
    type: "official",
    accessedAt: "2026-03-28",
  },
  {
    id: "src-rat-sicherheitskosten",
    title: "Ratsanfrage RAT/038/2026 – Sicherheitskosten",
    description: "Anfrage der Fraktion Die Linke (Feb. 2026). Stadt antwortete: keine seriöse Angabe zu Sicherheitskosten möglich.",
    url: "https://www.duesseldorf.de/rat/buergerinfo",
    type: "document",
    accessedAt: "2026-03-28",
  },
];

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
      "Die genauen Kosten für Polizeieinsätze, Sicherheitstechnik und Eventschutz sind nicht beziffert. Die Stadt antwortete auf Anfrage RAT/038/2026 (Die Linke, Feb. 2026), dass zum jetzigen Zeitpunkt keine seriöse Angabe möglich ist.",
    status: "offen",
    category: "Sicherheit",
    sourceRef: "src-rat-sicherheitskosten",
  },
  {
    id: "finanzierungsschluessel",
    title: "Finanzierungsschlüssel",
    description:
      "Der exakte Verteilungsschlüssel zwischen Bund, Land und Kommune ist nicht abschließend geklärt. Es ist unklar, ob IOC-Zuschüsse fließen oder Zuwendungen an den IOC.",
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
      "Eine umfassende Umweltverträglichkeitsprüfung mit konkreten Kompensationsmaßnahmen liegt nicht vor. Paris 2024: ca. 2 Mt CO₂-Äquivalent.",
    status: "offen",
    category: "Umwelt",
    sourceRef: "src-paris-carbon",
  },
  {
    id: "buergerhaushalt",
    title: "Auswirkungen auf Bürgerhaushalt",
    description:
      "Welche städtischen Projekte müssten ggf. zurückgestellt werden? Gibt es Einschränkungen bei Investitionen in Schulen, ÖPNV oder Soziales? Die Stadt schreibt, dass aktuelle Investitionen nicht betroffen seien – lässt aber offen, ob spätere Auswirkungen möglich sind.",
    status: "offen",
    category: "Finanzen",
  },
  {
    id: "bewerbungskosten",
    title: "Bewerbungskosten",
    description:
      "Die vier deutschen Bewerberstädte planen gemeinsam ca. 50 Mio. € für die nationale Vorauswahlphase. Gesamtkosten werden auf 50-100 Mio. € geschätzt (MDR, 27.03.2026). Hamburg 2015: Bewerbungsbudget bis 15 Mio. €.",
    status: "unklar",
    category: "Finanzen",
    sourceRef: "src-mdr-kosten",
  },
  {
    id: "wohnungsmarkt",
    title: "Auswirkungen auf Wohnungsmarkt",
    description:
      "Paris 2024: Airbnb-Angebote +40%, Buchungen +400%. Die angespannte Wohnsituation wurde verschärft, Mieten stiegen. Ein Plan mit konkreten Maßnahmen zur Begrenzung von Kurzzeitvermietungen fehlt.",
    status: "offen",
    category: "Stadtentwicklung",
    sourceRef: "src-airbnb-paris",
  },
  {
    id: "entscheidungsprozess",
    title: "Weitere Entscheidungen im Prozess",
    description:
      "Es ist unklar, worüber im weiteren Prozess der Stadtrat und worüber die Einwohner:innen entscheiden. Liegt die finale Entscheidung bei der Stadt oder gibt es weitere Bürgerentscheide?",
    status: "offen",
    category: "Partizipation",
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
  {
    id: "q5",
    question: "Wer haftet für Mehrkosten und den Host City Contract des IOC?",
    category: "Finanzen",
    dateSubmitted: "2026-03-10",
    note: "Eingereicht über stadtgestalten.duesseldorf-marketing.de – Antwort bis Abstimmungsschluss ausgeschlossen",
  },
  {
    id: "q6",
    question: "Warum wurden die über die Bürgerfragen-Plattform eingereichten Fragen erst nach Auslieferung der Briefwahlunterlagen weitergeleitet?",
    category: "Partizipation",
    dateSubmitted: "2026-03-25",
  },
  {
    id: "q7",
    question: "Aus welchen Haushaltsmitteln werden die Plakat- und Werbemaßnahmen zur Olympiabewerbung finanziert?",
    category: "Finanzen",
    dateSubmitted: "2026-03-20",
  },
  {
    id: "q8",
    question: "Wurde die geplante Olympiabewerbung in den zuständigen Fachausschüssen des Rates oder im Landtag NRW beraten?",
    category: "Partizipation",
    dateSubmitted: "2026-03-22",
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
