"use client";

import Link from "next/link";
import { useState } from "react";
import type { SiteNavLink } from "@/types/content";

interface HeaderProps {
  title: string;
  navLinks: SiteNavLink[];
}

export function Header({ title, navLinks }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-100 shadow-md shadow-neutral-100/50">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-lg text-primary-700 tracking-tight">
          {title}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-6" aria-label="Hauptnavigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-neutral-600 hover:text-primary-700 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="sm:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menü öffnen"
          aria-expanded={menuOpen}
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          className="sm:hidden border-t border-neutral-200 bg-white px-4 py-3"
          aria-label="Mobile Navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-neutral-700 font-medium border-b border-neutral-100 last:border-0"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
