"use client";

import { InstagramLogo, TelegramLogo } from "@phosphor-icons/react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-medium text-foreground tracking-tight text-sm uppercase">
              Alex
            </span>
            <p className="text-sm text-muted">
              Digital Strategy & Automation
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <InstagramLogo size={20} weight="light" className="text-foreground" />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <TelegramLogo size={20} weight="light" className="text-foreground" />
            </a>
          </div>

          <p className="text-sm text-muted">
            {currentYear} Alex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
