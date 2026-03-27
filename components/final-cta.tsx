"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";

interface FinalCTAProps {
  onBookClick: () => void;
}

export function FinalCTA({ onBookClick }: FinalCTAProps) {
  return (
    <section className="py-24 px-6 bg-slate-50/50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm text-center overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-100 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-medium text-foreground tracking-tight mb-4 text-balance">
              Не знаєш, з чого почати?
            </h2>
            <p className="text-lg text-muted font-light leading-relaxed mb-8 max-w-xl mx-auto">
              Давай проведемо розбір твоєї ситуації. Я покажу, як правильна
              упаковка та автоматизація допоможуть тобі зростати.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBookClick}
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-primary-foreground bg-primary rounded-full shadow-sm hover:bg-slate-800 transition-colors"
            >
              Записатися
              <ArrowRight size={18} weight="bold" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
