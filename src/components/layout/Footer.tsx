import Link from "next/link";
import type { SiteNavLink } from "@/types/content";

interface FooterProps {
  copyright: string;
  links: SiteNavLink[];
}

export function Footer({ copyright, links }: FooterProps) {
  return (
    <footer className="bg-gradient-to-b from-white to-neutral-50 border-t border-neutral-200 mt-16">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-sm text-neutral-500 mb-4">
          Ein unabhängiges Orientierungstool zum Ratsbürgerentscheid Olympia-Bewerbung Düsseldorf.
        </p>
        <p className="text-sm text-neutral-500 mb-4">
          Inhalte wurden teilweise mit KI-Unterstützung erstellt und anschließend von Menschen
          geprüft.
        </p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 mb-5" aria-label="Footer Navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-neutral-400">{copyright}</p>
      </div>
    </footer>
  );
}
