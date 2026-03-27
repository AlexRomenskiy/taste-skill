"use client";

import { motion } from "framer-motion";
import { CurrencyCircleDollar, Wrench } from "@phosphor-icons/react";

export function CostsSection() {
  return (
    <section className="py-16 px-6 bg-slate-50/50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="bg-card border border-border rounded-2xl p-8 shadow-sm"
        >
          <h3 className="text-xl font-medium text-foreground mb-6">
            Вартість утримання системи
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-border flex items-center justify-center shrink-0">
                <CurrencyCircleDollar
                  size={20}
                  weight="light"
                  className="text-muted"
                />
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Сервіси</p>
                <p className="text-sm text-muted leading-relaxed">
                  Оплата платформ (бот, конструктор, домен) — від{" "}
                  <span className="font-medium text-foreground">$30</span> до{" "}
                  <span className="font-medium text-foreground">$60</span> на
                  місяць.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-border flex items-center justify-center shrink-0">
                <Wrench size={20} weight="light" className="text-muted" />
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">
                  Твоя технічна опора
                </p>
                <p className="text-sm text-muted leading-relaxed">
                  Повний супровід мною (моніторинг та оновлення) — від{" "}
                  <span className="font-medium text-foreground">$150</span> до{" "}
                  <span className="font-medium text-foreground">$250</span> на
                  місяць.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
