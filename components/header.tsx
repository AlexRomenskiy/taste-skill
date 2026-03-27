"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "@phosphor-icons/react";

interface HeaderProps {
  onBookClick: () => void;
}

const navLinks = [
  { href: "#problem", label: "Проблема" },
  { href: "#solution", label: "Рішення" },
  { href: "#packages", label: "Пакети" },
  { href: "#faq", label: "FAQ" },
];

export function Header({ onBookClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 w-full z-50 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative bg-card/70 backdrop-blur-md border border-border/50 rounded-full px-4 py-2 flex items-center justify-between shadow-sm"
        >
          <a href="#" className="flex items-center gap-2 pl-2">
            <span className="font-medium text-foreground tracking-tight text-sm uppercase">
              Alex
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-xs font-normal text-muted hover:text-foreground transition-colors rounded-full hover:bg-slate-100/50"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onBookClick}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-medium text-primary-foreground bg-primary rounded-full hover:bg-slate-800 transition-colors shadow-sm"
            >
              Забронювати розбір
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted hover:text-foreground focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X size={20} weight="light" />
              ) : (
                <List size={20} weight="light" />
              )}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="md:hidden mt-2 bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl p-4 shadow-lg"
            >
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm text-muted hover:text-foreground hover:bg-slate-100/50 rounded-xl transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onBookClick();
                  }}
                  className="mt-2 w-full px-4 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Забронювати розбір
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
