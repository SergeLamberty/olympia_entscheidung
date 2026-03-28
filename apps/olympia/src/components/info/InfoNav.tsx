import Link from "next/link";

const INFO_LINKS = [
  { label: "Überblick", href: "/info" },
  { label: "Ablauf", href: "/info/ablauf" },
  { label: "Argumente", href: "/info/argumente" },
  { label: "FAQ", href: "/info/faq" },
  { label: "Quellen", href: "/info/quellen" },
] as const;

export function InfoNav() {
  return (
    <nav
      aria-label="Informations-Navigation"
      className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-neutral-200"
    >
      {INFO_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={[
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
          ].join(" ")}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
