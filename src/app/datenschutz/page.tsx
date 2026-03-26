import { PageLayout } from "@/components/layout/PageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutz" };

export default function DatenschutzPage() {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Datenschutzerklärung</h1>
      <div className="space-y-6 text-neutral-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">1. Verantwortlicher</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
          </p>
          <p className="mt-2">
            Serge Lamberty
            <br />
            Haifastr. 8
            <br />
            40227 Düsseldorf
            <br />
            E-Mail:{" "}
            <a href="mailto:olympia@lamberty.dev" className="text-primary-600 hover:underline">
              olympia@lamberty.dev
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">
            2. Serverseitige Nutzungsstatistik
          </h2>
          <p>
            Diese Website speichert auf dem Server eine stark reduzierte, anonyme Nutzungsstatistik.
            Erfasst wird, ob ein Browser die Website aufgerufen hat, ob der Wahl-Check bis zum
            Ende durchgeklickt wurde und welcher Ergebnis-Score dabei berechnet wurde. Es gibt kein
            Kontaktformular, keine Registrierung und keine Nutzerkonten.
          </p>
          <p className="mt-2">
            Die Statistik dient ausschließlich dazu, die Anzahl der Besucherinnen und Besucher, die
            Zahl der abgeschlossenen Durchläufe und den durchschnittlichen Score auszuwerten. Die
            einzelnen Antworten des Wahl-Checks werden nicht serverseitig gespeichert.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">3. Lokale Datenspeicherung (localStorage)</h2>
          <p>
            Deine Antworten im Wahl-Check werden ausschließlich lokal in deinem Browser gespeichert
            (Web Storage / localStorage). Diese Daten werden nicht als Antwortsatz an den Server
            übertragen. Du kannst sie jederzeit löschen, indem du den Wahl-Check zurücksetzt oder
            die Browserdaten löschst. Niemand außer dir hat Zugriff auf diese lokalen Antworten.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">4. Cookies und Tracking</h2>
          <p>
            Diese Website verwendet ein technisch einfaches, eigenes Cookie, um wiederkehrende
            Browser anonym wiederzuerkennen und Mehrfachzählungen in der internen Statistik zu
            vermeiden. Es kommen keine externen Tracking-Dienste, Analyse-Tools
            (z.&thinsp;B. Google Analytics), Werbenetzwerke oder sonstige Dienste Dritter zum
            Einsatz.
          </p>
          <p className="mt-2">
            Das Cookie enthält lediglich eine zufällig erzeugte Kennung und keine Klardaten. Es
            dient nur der internen Zählung von Aufrufen und abgeschlossenen Ergebnissen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">5. Schriftarten</h2>
          <p>
            Die verwendeten Schriftarten (Inter) werden über Next.js lokal eingebunden und
            direkt von diesem Server ausgeliefert. Es findet keine Verbindung zu externen
            Schriftarten-Diensten (z.&thinsp;B. Google Fonts CDN) statt.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">6. Service Worker</h2>
          <p>
            Für die Offline-Funktionalität wird ein Service Worker eingesetzt. Dieser speichert
            ausschließlich statische Ressourcen (HTML, CSS, JavaScript, Bilder) im Browser-Cache,
            um die Anwendung auch ohne Internetverbindung verfügbar zu machen. Es werden keine
            personenbezogenen Daten durch den Service Worker verarbeitet.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">7. Externe Links</h2>
          <p>
            Diese Website enthält Links zu externen Websites. Für deren Inhalte und
            Datenschutzpraktiken übernehmen wir keine Verantwortung. Beim Klick auf einen externen
            Link verlässt du diese Website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">8. Deine Rechte nach DSGVO</h2>
          <p>
            Da wir keine personenbezogenen Daten erheben oder speichern, fallen die meisten
            Betroffenenrechte praktisch nicht an. Grundsätzlich stehen dir gemäß der
            Datenschutz-Grundverordnung (DSGVO) folgende Rechte zu:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
          </ul>
          <p className="mt-2">
            Für Anfragen wende dich bitte an:{" "}
            <a href="mailto:olympia@lamberty.dev" className="text-primary-600 hover:underline">
              olympia@lamberty.dev
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">9. Aufsichtsbehörde</h2>
          <p>
            Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
            Die zuständige Aufsichtsbehörde ist:
          </p>
          <p className="mt-2">
            Landesbeauftragte für Datenschutz und Informationsfreiheit
            Nordrhein-Westfalen (LDI NRW)
            <br />
            Postfach 20 04 44
            <br />
            40102 Düsseldorf
            <br />
            <a
              href="https://www.ldi.nrw.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              www.ldi.nrw.de
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">10. Änderungen</h2>
          <p>
            Diese Datenschutzerklärung kann bei Bedarf aktualisiert werden. Die aktuelle Fassung
            ist stets auf dieser Seite abrufbar.
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
