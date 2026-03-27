"use client";

import { motion } from "framer-motion";
import { ArrowRight, X, Check } from "@phosphor-icons/react";

const beforeItems = [
  "Купа знань без розуміння, як їх масштабувати",
  "Ручні продажі та головний біль",
  "Нерозуміння наступного кроку",
  "Нестабільний дохід",
];

const afterItems = [
  "Зрозумілі смисли та чіткий напрямок",
  "Автоматична видача продуктів",
  "Система, що працює 24/7",
  "Стабільний пасивний дохід",
];

export function SolutionSection() {
  return (
    <section id="solution" className="py-24 px-6 bg-slate-50/50">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-medium text-foreground tracking-tight mb-6 text-balance">
            Від хаосу до визнання та стабільного доходу
          </h2>
          <p className="text-lg text-muted font-light leading-relaxed max-w-2xl mx-auto">
            Я — Алекс. Я не просто налаштовую сервіси. Я допомагаю дістати твої
            сильні сторони, запакувати їх у правильні смисли та перетворити на
            систему. Спочатку — стратегія, потім — техніка.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-card border border-border rounded-2xl p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <X size={20} weight="bold" className="text-slate-500" />
              </div>
              <h3 className="text-xl font-medium text-foreground">
                Життя «До»
              </h3>
            </div>
            <ul className="space-y-4">
              {beforeItems.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  </div>
                  <span className="text-muted font-light">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-card border border-accent/20 rounded-2xl p-8 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Check size={20} weight="bold" className="text-accent" />
                </div>
                <h3 className="text-xl font-medium text-foreground">
                  Життя «Після»
                </h3>
              </div>
              <ul className="space-y-4">
                {afterItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} weight="bold" className="text-accent" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Arrow indicator for desktop */}
        <div className="hidden lg:flex justify-center mt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-muted"
          >
            <span className="text-sm">Трансформація</span>
            <ArrowRight size={16} weight="bold" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
