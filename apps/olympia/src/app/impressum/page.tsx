import { PageLayout } from "@/components/layout/PageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Impressum</h1>
      <div className="prose prose-neutral max-w-none text-neutral-600">
        <h2 className="text-lg font-semibold text-neutral-800 mb-2">Angaben gemäß § 5 TMG</h2>
        <p>
          Serge Lamberty
          <br />
          Haifastr. 8
          <br />
          40227 Düsseldorf
        </p>

        <h2 className="text-lg font-semibold text-neutral-800 mt-6 mb-2">Kontakt</h2>
        <p>
          E-Mail:{" "}
          <a href="mailto:olympia@lamberty.dev" className="text-primary-600 hover:underline">
            olympia@lamberty.dev
          </a>
        </p>

        <h2 className="text-lg font-semibold text-neutral-800 mt-6 mb-2">
          Verantwortlich gem. § 18 Abs. 2 MStV
        </h2>
        <p>
          Serge Lamberty
          <br />
          Haifastr. 8
          <br />
          40227 Düsseldorf
        </p>

        <h2 className="text-lg font-semibold text-neutral-800 mt-6 mb-2">Hinweis</h2>
        <p>
          Dieses Projekt ist ein privates, unabhängiges Angebot. Der Ersteller ist zwar Mitglied von
          Volt, die Website wurde jedoch nicht im Auftrag der Partei erstellt und widerspiegelt
          nicht die Meinung der Partei.
        </p>
      </div>
    </PageLayout>
  );
}
