"use client";

import { motion } from "framer-motion";
import {
  EyeSlash,
  WaveSine,
  Gear,
  Headset,
} from "@phosphor-icons/react";

const problems = [
  {
    icon: EyeSlash,
    title: "Про тебе мало знають",
    description:
      "Маєш потужний досвід, але через відсутність системи про це знає лише вузьке коло людей.",
  },
  {
    icon: WaveSine,
    title: "Немає системних продажів",
    description:
      "Дохід непередбачуваний. Сьогодні клієнти є, а завтра — тиша.",
  },
  {
    icon: Gear,
    title: "Відсутність пасивного доходу",
    description:
      "Заробіток іде лише тоді, коли ти працюєш особисто. Немає продуктів, які продаються самі.",
  },
  {
    icon: Headset,
    title: "Технічний хаос",
    description:
      "Ти класний фахівець, але не розумієш, як усе це втілити технічно. Витрачаєш час на рутину.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
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

export function ProblemSection() {
  return (
    <section id="problem" className="py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-medium text-foreground tracking-tight mb-4 text-balance">
            Твоя експертиза на висоті, але продажі не ростуть?
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-border flex items-center justify-center shrink-0 group-hover:bg-slate-100 transition-colors">
                  <problem.icon
                    size={24}
                    weight="light"
                    className="text-muted"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-muted font-light leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
