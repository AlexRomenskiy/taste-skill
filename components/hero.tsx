"use client";

import { motion } from "framer-motion";
import { PhoneMockup } from "./phone-mockup";

interface HeroProps {
  onBookClick: () => void;
}

export function Hero({ onBookClick }: HeroProps) {
  return (
    <section className="relative w-full min-h-[100dvh] flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-[-1] bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-[radial-gradient(circle_at_top,rgba(226,232,240,0.8),transparent_70%)] opacity-50 blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center z-10">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="flex flex-col items-start max-w-xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 text-xs font-normal text-muted mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
            Digital Strategy & Automation
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground tracking-tight leading-[1.1] mb-6 text-balance">
            Автоматизуй продажі своїх послуг: від Direct до оплати на рахунок
          </h1>

          <p className="text-lg sm:text-xl text-muted font-light leading-relaxed mb-8 max-w-[65ch]">
            Досить працювати менеджером з продажу у власному блозі. Налаштую
            чат-боти та воронки, які замість тебе прогрівають аудиторію, видають
            матеріали та приймають платежі 24/7.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBookClick}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-primary-foreground bg-primary rounded-full shadow-sm hover:bg-slate-800 transition-colors"
            >
              Забронювати розбір
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#packages"
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-foreground bg-card border border-border rounded-full shadow-sm hover:bg-slate-50 transition-colors text-center"
            >
              Переглянути пакети
            </motion.a>
          </div>
        </motion.div>

        {/* Phone Mockup */}
        <PhoneMockup />
      </div>
    </section>
  );
}
