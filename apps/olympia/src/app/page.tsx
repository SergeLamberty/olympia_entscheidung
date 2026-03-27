import { loadSiteContent } from "@/lib/content-loader";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { HowItWorksSection } from "@/components/features/HowItWorksSection";

export default function HomePage() {
  const site = loadSiteContent();
  const { hero, howItWorks } = site;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.meta.title,
    description: site.meta.description,
    url: site.meta.siteUrl,
    inLanguage: site.meta.locale,
  };

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Hero */}
      <section
        className="hero-gradient -mx-4 px-4 py-16 sm:py-24 text-center rounded-b-3xl mb-8"
        aria-labelledby="hero-heading"
      >
        <div className="text-5xl mb-6" aria-hidden="true">
          🏛️
        </div>
        <h1
          id="hero-heading"
          className="text-3xl sm:text-5xl font-extrabold text-neutral-900 leading-tight mb-5 tracking-tight"
        >
          {hero.headline}
        </h1>
        <p className="text-lg sm:text-xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          {hero.subheadline}
        </p>
        <Button
          href="/fragen"
          size="lg"
          className="text-lg px-10 py-5 shadow-lg shadow-primary-200"
        >
          {hero.ctaLabel}
        </Button>
      </section>

      <hr className="border-neutral-200" />

      {/* How it works */}
      <HowItWorksSection headline={howItWorks.headline} steps={howItWorks.steps} />

      <hr className="border-neutral-200" />
    </PageLayout>
  );
}
