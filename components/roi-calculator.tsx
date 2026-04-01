"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CurrencyDollar,
  ArrowsClockwise,
  CheckCircle,
  Calendar,
  ChartLineUp,
  Lock,
  Plus,
  X,
} from "@phosphor-icons/react";

type Package = 1 | 2;

interface Product {
  id: number;
  price: number;
  sales: number;
}

const packageData = {
  1: { name: "Система продажів", investment: 495, support: 150 },
  2: { name: "Продуктова лінійка", investment: 990, support: 250 },
};

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    const start = previousValue.current;
    const end = value;
    const duration = 400;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousValue.current = value;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
}

function CustomSlider({
  value,
  onChange,
  min,
  max,
  step,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full h-2 group">
      <div className="absolute inset-0 bg-slate-700 rounded-full" />
      <div
        className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-150"
        style={{ width: `${percentage}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${disabled ? "cursor-not-allowed" : ""}`}
      />
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-150 ${
          disabled ? "opacity-50" : "group-hover:scale-110"
        }`}
        style={{ left: `calc(${percentage}% - 8px)` }}
      />
    </div>
  );
}

export function ROICalculator({ onBookClick }: { onBookClick?: () => void }) {
  const [selectedPackage, setSelectedPackage] = useState<Package>(1);
  const [products, setProducts] = useState<Product[]>([{ id: 1, price: 100, sales: 3 }]);
  const [isLocked, setIsLocked] = useState(false);

  const addProduct = () => {
    if (products.length < 2) {
      setProducts([...products, { id: Date.now(), price: 100, sales: 3 }]);
    }
  };

  const removeProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateProduct = (id: number, field: "price" | "sales", value: number) => {
    if (isLocked) {
      setIsLocked(false);
    }
    setProducts(products.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handlePackageChange = (pkg: Package) => {
    if (isLocked) {
      setIsLocked(false);
    }
    setSelectedPackage(pkg);
    if (pkg === 1 && products.length > 1) {
      setProducts([products[0]]);
    }
  };

  // Calculations
  const monthlyRevenue = products.reduce((sum, p) => sum + p.price * p.sales, 0);
  const supportCosts = packageData[selectedPackage].support + 45;
  const netProfit = monthlyRevenue - supportCosts;
  const investment = packageData[selectedPackage].investment;
  const paybackDays = netProfit > 0 ? Math.round((investment / netProfit) * 30) : null;
  const yearlyIncome = netProfit * 12;

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-3">
            Калькулятор окупності
          </h2>
          <p className="text-slate-400 font-light">
            Дізнайся, як швидко окупиться твоя інвестиція
          </p>
        </div>

        {/* Step 1: Package Selection */}
        <div className="mb-10">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Крок 1 — Вибір пакету</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {([1, 2] as Package[]).map((pkg) => (
              <button
                key={pkg}
                onClick={() => handlePackageChange(pkg)}
                disabled={isLocked}
                className={`p-5 rounded-2xl border transition-all duration-300 text-left ${
                  selectedPackage === pkg
                    ? "bg-emerald-500/10 border-emerald-500/50"
                    : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <p className={`text-sm font-medium mb-1 ${selectedPackage === pkg ? "text-emerald-400" : "text-white"}`}>
                  Пакет {pkg} — {packageData[pkg].name}
                </p>
                <p className="text-xs text-slate-400">
                  Інвестиція ${packageData[pkg].investment} · Підтримка ${packageData[pkg].support}/міс
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Sliders */}
        <div className="mb-10">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Крок 2 — Твій продукт</p>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-5 rounded-2xl border transition-all duration-300 ${
                    isLocked ? "bg-slate-800/30 border-slate-700/50 opacity-50" : "bg-slate-800/50 border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-sm text-slate-300 font-medium">
                      {products.length > 1 ? `Продукт ${index + 1}` : "Твій продукт"}
                    </p>
                    {products.length > 1 && (
                      <button
                        onClick={() => removeProduct(product.id)}
                        disabled={isLocked}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
                      >
                        <X size={12} weight="bold" className="text-slate-400" />
                      </button>
                    )}
                  </div>

                  {/* Price Slider */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-500">Ціна продукту</span>
                      <span className="text-sm font-medium text-emerald-400">${product.price}</span>
                    </div>
                    <CustomSlider
                      value={product.price}
                      onChange={(v) => updateProduct(product.id, "price", v)}
                      min={15}
                      max={1500}
                      step={5}
                      disabled={isLocked}
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] text-slate-600">$15</span>
                      <span className="text-[10px] text-slate-600">$1500</span>
                    </div>
                  </div>

                  {/* Sales Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-500">Продажів на місяць</span>
                      <span className="text-sm font-medium text-emerald-400">{product.sales}</span>
                    </div>
                    <CustomSlider
                      value={product.sales}
                      onChange={(v) => updateProduct(product.id, "sales", v)}
                      min={1}
                      max={30}
                      step={1}
                      disabled={isLocked}
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] text-slate-600">1</span>
                      <span className="text-[10px] text-slate-600">30</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add Product Button */}
            <AnimatePresence>
              {selectedPackage === 2 && products.length < 2 && !isLocked && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  onClick={addProduct}
                  className="w-full p-4 rounded-2xl border border-dashed border-slate-600 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300 flex items-center justify-center gap-2 text-slate-400 hover:text-emerald-400"
                >
                  <Plus size={16} weight="bold" />
                  <span className="text-sm">Додати ще продукт</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Step 3: Results */}
        <div className="mb-8">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Крок 3 — Результат</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Monthly Revenue */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <CurrencyDollar size={16} weight="light" className="text-emerald-400" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Місячний дохід</span>
              </div>
              <p className="text-xl font-medium text-white">
                <AnimatedNumber value={monthlyRevenue} prefix="$" />
              </p>
            </div>

            {/* Support Costs */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <ArrowsClockwise size={16} weight="light" className="text-slate-400" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Витрати</span>
              </div>
              <p className="text-xl font-medium text-slate-300">
                <AnimatedNumber value={supportCosts} prefix="$" />
              </p>
            </div>

            {/* Net Profit */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} weight="fill" className="text-emerald-400" />
                <span className="text-[10px] text-emerald-400/70 uppercase tracking-wider">Чистий прибуток</span>
              </div>
              <p className={`text-xl font-medium ${netProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                <AnimatedNumber value={netProfit} prefix="$" />
                <span className="text-xs font-normal text-slate-500">/міс</span>
              </p>
            </div>

            {/* Payback Period */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} weight="light" className="text-slate-400" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Окупність</span>
              </div>
              <p className="text-xl font-medium text-white">
                {paybackDays !== null ? (
                  <>
                    <AnimatedNumber value={paybackDays} />
                    <span className="text-xs font-normal text-slate-500"> днів</span>
                  </>
                ) : (
                  <span className="text-slate-500">—</span>
                )}
              </p>
            </div>

            {/* Yearly Income */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <ChartLineUp size={16} weight="light" className="text-emerald-400" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Дохід за рік</span>
              </div>
              <p className={`text-xl font-medium ${yearlyIncome >= 0 ? "text-white" : "text-rose-400"}`}>
                <AnimatedNumber value={yearlyIncome} prefix="$" />
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <AnimatePresence mode="wait">
            {!isLocked ? (
              <motion.button
                key="lock"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsLocked(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-all duration-300"
              >
                <Lock size={16} weight="bold" />
                Зафіксувати результат
              </motion.button>
            ) : (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <p className="text-lg text-white font-light">Хочеш такий результат?</p>
                <button
                  onClick={onBookClick}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-emerald-500/20"
                >
                  Записатися на безкоштовний розбір
                  <span className="text-emerald-200 text-xs">(20-30 хв)</span>
                </button>
                <p className="text-xs text-slate-500">
                  Натисни на слайдери, щоб змінити значення
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
