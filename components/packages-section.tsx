"use client";

import { motion } from "framer-motion";
import { Check, X, Star, Clock, Gift } from "@phosphor-icons/react";

interface PackagesProps {
  onBookClick: () => void;
}

const packages = [
  {
    name: "Стратегія та Смисли",
    subtitle: "Консультація",
    price: "$150",
    term: null,
    description:
      "Глибокий аналіз точки «А», розробка позиціонування та план масштабування на 3 місяці.",
    outcome: "Чітка дорожня карта розвитку.",
    features: [
      { text: "Аналіз поточної ситуації", included: true },
      { text: "Розробка позиціонування", included: true },
      { text: "План на 3 місяці", included: true },
      { text: "Посадкова сторінка", included: false },
      { text: "Чат-бот для збору контактів", included: false },
      { text: "Автоматичний прийом оплат", included: false },
    ],
    bonus: null,
    highlighted: false,
  },
  {
    name: "Базовий фундамент",
    subtitle: "Пакет 1",
    price: "$495",
    term: "5-7 робочих днів",
    description:
      "Стратегія + 1 посадкова сторінка + бот для видачі безкоштовного матеріалу та збору контактів.",
    outcome: "Ти перестаєш втрачати клієнтів завдяки зрозумілій точці входу.",
    features: [
      { text: "Стратегія з Пакету 0", included: true },
      { text: "1 посадкова сторінка", included: true },
      { text: "Чат-бот для збору контактів", included: true },
      { text: "Видача безкоштовного матеріалу", included: true },
      { text: "Автоматизація пробного продукту", included: false },
      { text: "Автоматичний прийом оплат", included: false },
    ],
    bonus: "14 днів технічного супроводу",
    highlighted: false,
  },
  {
    name: "Генератор продажів",
    subtitle: "Пакет 2",
    price: "від $990",
    term: "до 14 робочих днів",
    description:
      "Стратегія + комплекс сторінок + бот + автоматичний прийом оплат + повна воронка.",
    outcome:
      "Пасивний дохід із недорогих продуктів. Система окупається з 2-3 продажів.",
    features: [
      { text: "Стратегія з Пакету 0", included: true },
      { text: "Комплекс посадкових сторінок", included: true },
      { text: "Чат-бот із повною воронкою", included: true },
      { text: "Автоматичний прийом оплат", included: true },
      { text: "Основний та пробний продукти", included: true },
      { text: "Повна автоматизація продажів", included: true },
    ],
    bonus: "14 днів технічного супроводу",
    highlighted: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export function PackagesSection({ onBookClick }: PackagesProps) {
  return (
    <section id="packages" className="py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-medium text-foreground tracking-tight mb-4 text-balance">
            Обери свій пакет
          </h2>
          <p className="text-lg text-muted font-light">
            Стратегія та технічна реалізація
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`relative flex flex-col bg-card border rounded-2xl p-6 shadow-sm transition-shadow hover:shadow-md ${
                pkg.highlighted
                  ? "border-accent/30 ring-1 ring-accent/20"
                  : "border-border"
              }`}
            >
              {pkg.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                  <Star size={12} weight="fill" />
                  Популярний
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs text-muted uppercase tracking-widest mb-2">
                  {pkg.subtitle}
                </p>
                <h3 className="text-xl font-medium text-foreground mb-3">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-medium text-foreground">
                    {pkg.price}
                  </span>
                </div>
                {pkg.term && (
                  <div className="flex items-center gap-1.5 mt-2 text-muted">
                    <Clock size={14} weight="light" />
                    <span className="text-sm">{pkg.term}</span>
                  </div>
                )}
              </div>

              <p className="text-muted font-light text-sm mb-4 leading-relaxed">
                {pkg.description}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-border mb-6">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Результат:</span> {pkg.outcome}
                </p>
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2.5">
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <Check
                          size={12}
                          weight="bold"
                          className="text-accent"
                        />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <X size={12} weight="bold" className="text-slate-400" />
                      </div>
                    )}
                    <span
                      className={`text-sm ${
                        feature.included
                          ? "text-foreground"
                          : "text-muted line-through"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {pkg.bonus && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/5 border border-accent/10 mb-6">
                  <Gift size={16} weight="fill" className="text-accent" />
                  <span className="text-sm text-foreground">{pkg.bonus}</span>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBookClick}
                className={`w-full py-3 rounded-full text-sm font-medium transition-colors ${
                  pkg.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-slate-800"
                    : "bg-slate-100 text-foreground hover:bg-slate-200"
                }`}
              >
                Обрати пакет
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
