"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("nav_home") },
    { href: "/consultation", label: t("nav_consultation") },
    { href: "/mood", label: t("nav_mood") },
    { href: "/test-check", label: t("nav_test_check") },
    { href: "/about", label: t("nav_about") },
  ];

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-card bg-primary flex items-center justify-center text-white font-semibold text-sm">
            МП
          </div>
          <span className="text-primary font-semibold text-sm sm:text-base leading-tight">
            {t("site_title")}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-card text-sm font-medium transition-colors ${
                  active
                    ? "bg-panel text-primary"
                    : "text-slate-600 hover:bg-panel hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <LanguageSwitcher />
      </div>

      <nav className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-3">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-card text-xs font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-panel text-primary"
                  : "text-slate-600 hover:bg-panel hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
