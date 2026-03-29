"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  InstagramLogo,
  ChatCircleDots,
  CreditCard,
  CheckCircle,
  Lightning,
  Clock,
  Warning,
  XCircle,
  Envelope,
  Hourglass,
} from "@phosphor-icons/react";

type Scenario = "message" | "response" | "payment";
type Mode = "manual" | "auto";

const scenarioLabels: Record<Scenario, string> = {
  message: "Нове повідомлення",
  response: "Відповідь",
  payment: "Оплата",
};

export function PhoneMockup() {
  const [mode, setMode] = useState<Mode>("auto");
  const [scenario, setScenario] = useState<Scenario>("message");

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
      className="relative w-full flex flex-col items-center lg:items-end gap-4"
    >
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 p-1 bg-card rounded-full border border-border shadow-sm">
        <button
          onClick={() => setMode("manual")}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
            mode === "manual"
              ? "bg-rose-500 text-white shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          Вручну
        </button>
        <button
          onClick={() => setMode("auto")}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
            mode === "auto"
              ? "bg-accent text-white shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          З автоматизацією
        </button>
      </div>

      {/* Scenario Buttons */}
      <div className="flex items-center gap-2">
        {(["message", "response", "payment"] as Scenario[]).map((s) => (
          <button
            key={s}
            onClick={() => setScenario(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
              scenario === s
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {scenarioLabels[s]}
          </button>
        ))}
      </div>

      {/* Phone */}
      <div className="animate-float relative w-[320px] h-[640px] bg-card rounded-[2.5rem] border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] p-2">
        <div
          className={`w-full h-full rounded-[2rem] border flex flex-col overflow-hidden relative transition-colors duration-300 ${
            mode === "manual"
              ? "bg-rose-50/50 border-rose-100"
              : "bg-slate-50 border-slate-100"
          }`}
        >
          {/* Dynamic Island */}
          <div className="w-full h-12 flex justify-center items-start pt-3 relative z-20">
            <div className="w-24 h-6 bg-slate-900 rounded-full flex items-center justify-between px-2">
              <div className="w-2 h-2 rounded-full bg-slate-800 flex items-center justify-center">
                <div className="w-0.5 h-0.5 bg-blue-400 rounded-full" />
              </div>
              <div
                className={`w-1.5 h-1.5 rounded-full animate-pulse-dot ${
                  mode === "manual" ? "bg-rose-400" : "bg-accent"
                }`}
              />
            </div>
          </div>

          {/* UI Content */}
          <div className="flex-1 px-4 py-2 flex flex-col gap-3 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${scenario}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3 flex-1"
              >
                {/* Header */}
                <div className="mb-1">
                  <h2 className="text-lg font-medium tracking-tight text-foreground">
                    {mode === "manual" ? "Ручний режим" : "Автоматизація"}
                  </h2>
                  <p
                    className={`text-xs font-normal ${
                      mode === "manual" ? "text-rose-500" : "text-accent"
                    }`}
                  >
                    {mode === "manual"
                      ? "Потрібна твоя увага"
                      : "Все працює автоматично"}
                  </p>
                </div>

                {/* Content based on mode and scenario */}
                {mode === "manual" ? (
                  <ManualContent scenario={scenario} />
                ) : (
                  <AutoContent scenario={scenario} />
                )}

                {/* Stats Row */}
                <div className="mt-auto grid grid-cols-3 gap-2">
                  {mode === "manual" ? (
                    <>
                      <div className="bg-card rounded-xl border border-rose-200 p-3 text-center">
                        <p className="text-lg font-medium text-rose-500">23</p>
                        <p className="text-xs text-muted">Пропущено</p>
                      </div>
                      <div className="bg-card rounded-xl border border-rose-200 p-3 text-center">
                        <p className="text-lg font-medium text-rose-500">2</p>
                        <p className="text-xs text-muted">Продажі</p>
                      </div>
                      <div className="bg-card rounded-xl border border-rose-200 p-3 text-center">
                        <p className="text-lg font-medium text-foreground">3 год</p>
                        <p className="text-xs text-muted">Витрачено</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-card rounded-xl border border-border p-3 text-center">
                        <p className="text-lg font-medium text-foreground">47</p>
                        <p className="text-xs text-muted">Ліди</p>
                      </div>
                      <div className="bg-card rounded-xl border border-border p-3 text-center">
                        <p className="text-lg font-medium text-foreground">12</p>
                        <p className="text-xs text-muted">Продажі</p>
                      </div>
                      <div className="bg-card rounded-xl border border-border p-3 text-center">
                        <p className="text-lg font-medium text-accent">$1.8k</p>
                        <p className="text-xs text-muted">Дохід</p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-200 rounded-full z-20" />
        </div>
      </div>
    </motion.div>
  );
}

function ManualContent({ scenario }: { scenario: Scenario }) {
  if (scenario === "message") {
    return (
      <>
        {/* Unread messages pile */}
        <div className="bg-card rounded-xl border border-rose-200 p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 via-fuchsia-500 to-amber-400 flex items-center justify-center">
                <InstagramLogo size={20} weight="fill" className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">12</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">
                Нові повідомлення
              </p>
              <p className="text-xs text-rose-500">12 непрочитаних</p>
            </div>
            <Warning size={20} weight="fill" className="text-rose-500" />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-rose-200 p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
              <Clock size={20} weight="light" className="text-rose-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">
                @olena_fit написала 3 год тому
              </p>
              <p className="text-xs text-muted truncate">
                Привіт! Хочу дізнатись про...
              </p>
            </div>
          </div>
        </div>

        <div className="bg-rose-50 rounded-xl border border-rose-200 p-3">
          <div className="flex items-center gap-2 text-rose-600">
            <Hourglass size={16} weight="fill" />
            <p className="text-xs font-medium">
              Клієнт чекає... можливо вже пішов до конкурента
            </p>
          </div>
        </div>
      </>
    );
  }

  if (scenario === "response") {
    return (
      <>
        <div className="bg-card rounded-xl border border-rose-200 p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
              <Envelope size={20} weight="light" className="text-rose-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">
                Потрібно відповісти вручну
              </p>
              <p className="text-xs text-muted">Копіювати, вставляти, надсилати...</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-rose-200 p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
              <Clock size={20} weight="light" className="text-rose-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">
                Час на кожну відповідь
              </p>
              <p className="text-xs text-rose-500">~5-10 хвилин</p>
            </div>
          </div>
        </div>

        <div className="bg-rose-50 rounded-xl border border-rose-200 p-3">
          <div className="flex items-center gap-2 text-rose-600">
            <Warning size={16} weight="fill" />
            <p className="text-xs font-medium">
              Забула надіслати PDF... клієнт не отримав матеріали
            </p>
          </div>
        </div>
      </>
    );
  }

  // payment scenario
  return (
    <>
      <div className="bg-card rounded-xl border border-rose-200 p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CreditCard size={16} weight="light" className="text-rose-500" />
            <span className="text-xs font-medium text-rose-500 uppercase tracking-widest">
              Оплата
            </span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle size={14} weight="fill" className="text-rose-500" />
            <span className="text-xs text-rose-500 font-medium">Вручну</span>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-medium tracking-tight text-foreground">
              $0<span className="text-sm text-muted font-normal">.00</span>
            </p>
            <p className="text-xs text-rose-500">Поки розбиралась з оплатою...</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-rose-200 p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
            <Clock size={20} weight="light" className="text-rose-500" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground">
              Чекаю реквізити від клієнта
            </p>
            <p className="text-xs text-muted">Вже 2 дні без відповіді</p>
          </div>
        </div>
      </div>

      <div className="bg-rose-50 rounded-xl border border-rose-200 p-3">
        <div className="flex items-center gap-2 text-rose-600">
          <Warning size={16} weight="fill" />
          <p className="text-xs font-medium">
            Клієнт охолонув і передумав купувати
          </p>
        </div>
      </div>
    </>
  );
}

function AutoContent({ scenario }: { scenario: Scenario }) {
  if (scenario === "message") {
    return (
      <>
        <div className="bg-card rounded-xl border border-border p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 via-fuchsia-500 to-amber-400 flex items-center justify-center">
              <InstagramLogo size={20} weight="fill" className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">
                Нове повідомлення від @olena_fit
              </p>
              <p className="text-xs text-muted truncate">
                Привіт! Хочу дізнатись про курс...
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Lightning size={20} weight="fill" className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">
                Бот відповів миттєво
              </p>
              <p className="text-xs text-accent">За 2 секунди</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle size={14} weight="fill" className="text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-accent/5 rounded-xl border border-accent/20 p-3">
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle size={16} weight="fill" />
            <p className="text-xs font-medium">
              Клієнт отримав відповідь, поки ти спала
            </p>
          </div>
        </div>
      </>
    );
  }

  if (scenario === "response") {
    return (
      <>
        <div className="bg-card rounded-xl border border-border p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <ChatCircleDots size={20} weight="light" className="text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">
                Бот відповів автоматично
              </p>
              <p className="text-xs text-muted">Персоналізована відповідь</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle size={14} weight="fill" className="text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Envelope size={20} weight="light" className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">
                PDF надіслано автоматично
              </p>
              <p className="text-xs text-accent">Лід зафіксовано в базі</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle size={14} weight="fill" className="text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-accent/5 rounded-xl border border-accent/20 p-3">
          <div className="flex items-center gap-2 text-accent">
            <Lightning size={16} weight="fill" />
            <p className="text-xs font-medium">
              Воронка прогріває клієнта далі
            </p>
          </div>
        </div>
      </>
    );
  }

  // payment scenario
  return (
    <>
      <div className="bg-card rounded-xl border border-border p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CreditCard size={16} weight="light" className="text-muted" />
            <span className="text-xs font-medium text-muted uppercase tracking-widest">
              Оплата
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
            <span className="text-xs text-accent font-medium">Автоматично</span>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-medium tracking-tight text-foreground">
              $149<span className="text-sm text-muted font-normal">.00</span>
            </p>
            <p className="text-xs text-muted">Tripwire продукт продано</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Lightning size={18} weight="fill" className="text-accent" />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <CheckCircle size={20} weight="fill" className="text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground">
              Доступ видано автоматично
            </p>
            <p className="text-xs text-accent">Клієнт вже навчається</p>
          </div>
        </div>
      </div>

      <div className="bg-accent/5 rounded-xl border border-accent/20 p-3">
        <div className="flex items-center gap-2 text-accent">
          <Lightning size={16} weight="fill" />
          <p className="text-xs font-medium">
            Все це сталось, поки ти пила каву
          </p>
        </div>
      </div>
    </>
  );
}
