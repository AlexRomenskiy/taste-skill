"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";

const faqs = [
  {
    question: "Я не розуміюся на техніці. Чи підійде мені це?",
    answer:
      "Звісно! Я створюю все «під капотом» і надаю просту відеоінструкцію. Тобі потрібно лише розуміти свій продукт та аудиторію — технічну частину я беру на себе повністю.",
  },
  {
    question: "Як швидко це окупиться?",
    answer:
      "Зазвичай система окупається з 2-4 продажів твого продукту. Якщо твій продукт коштує $200+, то вже після 2-3 клієнтів ти виходиш у плюс.",
  },
  {
    question: "У мене немає продуктової лінійки. Що робити?",
    answer:
      "Це не проблема! Ми розробимо її разом на стратегічній сесії. Я допоможу структурувати твої знання у продукти різних цінових категорій.",
  },
  {
    question: "Чи можу я змінювати контент самостійно після запуску?",
    answer:
      "Так, я налаштовую систему так, щоб ти міг самостійно оновлювати тексти, ціни та матеріали. Плюс надаю детальну відеоінструкцію.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-medium text-foreground tracking-tight mb-4">
            Часті запитання
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
          className="space-y-3"
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
              >
                <span className="font-medium text-foreground pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="shrink-0"
                >
                  <CaretDown size={20} weight="bold" className="text-muted" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4">
                      <p className="text-muted leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
