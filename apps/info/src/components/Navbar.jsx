import { Menu, X } from "lucide-react";
import { useState } from "react";

// In production, these would be proper domain URLs
const OLYMPIA_APP_URL = import.meta.env.PROD
  ? "/wahl-check" // Production: same domain, different path
  : "http://localhost:3000"; // Development: different port

const navLinks = [
  { label: "Informationen", href: "#info-gaps", internal: true },
  { label: "Parteipositionen", href: "#political-positions", internal: true },
  { label: "Wahl-Check starten", href: OLYMPIA_APP_URL, internal: false, highlight: true },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <span className="font-semibold text-slate-900 hidden sm:inline">
              Olympia Düsseldorf
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.internal ? undefined : "_blank"}
                rel={link.internal ? undefined : "noopener noreferrer"}
                className={
                  link.highlight
                    ? "px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    : "text-slate-600 hover:text-slate-900 transition-colors"
                }
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            aria-label="Menü öffnen"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.internal ? undefined : "_blank"}
                  rel={link.internal ? undefined : "noopener noreferrer"}
                  onClick={() => setIsOpen(false)}
                  className={
                    link.highlight
                      ? "px-4 py-3 bg-blue-600 text-white rounded-lg font-medium text-center"
                      : "px-4 py-2 text-slate-600 hover:text-slate-900"
                  }
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
