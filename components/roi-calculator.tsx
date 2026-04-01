"use client";

// v2 - fixed hydration
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
  Lightbulb,
  Users,
  ChatCircle,
  Target,
  Wallet,
} from "@phosphor-icons/react";

type Package = 1 | 2;
type CalcMode = "manual" | "helper";

type Niche = "coaching" | "fitness" | "education" | "other";

const nicheLabels: Record<Niche, string> = {
  coaching: "Коучинг",
  fitness: "Фітнес",
  education: "Освіта",
  other: "Інше",
};

// Conversion rates and price suggestions by niche
const nicheData: Record<Niche, { conversionRate: number; suggestedPrice: number }> = {
  coaching: { conversionRate: 0.025, suggestedPrice: 150 },
  fitness: { conversionRate: 0.03, suggestedPrice: 80 },
  education: { conversionRate: 0.02, suggestedPrice: 100 },
  other: { conversionRate: 0.02, suggestedPrice: 100 },
};

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
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousValue.current = value;
      return;
    }

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

  const formatted = displayValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return <span suppressHydrationWarning>{prefix}{formatted}{suffix}</span>;
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
  const trackRef = useRef<HTMLDivElement>(null);

  const handleInteraction = (clientX: number) => {
    if (disabled || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + percent * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    onChange(clampedValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    handleInteraction(e.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleInteraction(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    handleInteraction(e.touches[0].clientX);

    const handleTouchMove = (moveEvent: TouchEvent) => {
      handleInteraction(moveEvent.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div
      ref={trackRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={`relative w-full h-6 flex items-center group ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      {/* Track background */}
      <div className="absolute inset-x-0 h-2 bg-slate-700 rounded-full" />
      {/* Filled track */}
      <div
        className="absolute left-0 h-2 bg-emerald-500 rounded-full"
        style={{ width: `${percentage}%` }}
      />
      {/* Thumb */}
      <div
        className={`absolute w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${
          disabled ? "opacity-50" : "group-hover:scale-110 group-active:scale-125"
        }`}
        style={{ left: `calc(${percentage}% - 10px)` }}
      />
    </div>
  );
}

export function ROICalculator({ onBookClick }: { onBookClick?: () => void }) {
  const [mode, setMode] = useState<CalcMode>("manual");
  const [selectedPackage, setSelectedPackage] = useState<Package>(1);
  const [products, setProducts] = useState<Product[]>([{ id: 1, price: 100, sales: 3 }]);
  const [isLocked, setIsLocked] = useState(false);

  // Helper mode inputs
  const [followers, setFollowers] = useState(5000);
  const [messages, setMessages] = useState(50);
  const [niche, setNiche] = useState<Niche>("coaching");
  const [desiredIncome, setDesiredIncome] = useState(2000);
  const [helperApplied, setHelperApplied] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState<{ price: number; sales: number; package: Package } | null>(null);

  // Calculate recommendations based on helper inputs
  const calculateRecommendations = () => {
    const { conversionRate, suggestedPrice } = nicheData[niche];
    
    // Estimate monthly leads from messages (assuming 60% of messages are potential leads)
    const potentialLeads = Math.round(messages * 0.6);
    
    // Calculate expected sales based on conversion rate
    const expectedSales = Math.max(1, Math.round(potentialLeads * conversionRate * 10));
    
    // Adjust price based on desired income
    let recommendedPrice = suggestedPrice;
    if (desiredIncome > 0 && expectedSales > 0) {
      const priceForGoal = Math.round(desiredIncome / expectedSales);
      // Blend suggested price with goal-based price
      recommendedPrice = Math.round((suggestedPrice + priceForGoal) / 2);
      // Clamp to slider range
      recommendedPrice = Math.max(15, Math.min(1500, recommendedPrice));
    }

    // Determine package: if desired income is high, suggest package 2
    const recommendedPackage: Package = desiredIncome > 3000 ? 2 : 1;

    return {
      price: recommendedPrice,
      sales: Math.max(1, Math.min(30, expectedSales)),
      package: recommendedPackage,
    };
  };

  const showRecommendations = () => {
    const rec = calculateRecommendations();
    setRecommendation(rec);
    setShowRecommendation(true);
  };

  const applyRecommendations = () => {
    if (!recommendation) return;
    setSelectedPackage(recommendation.package);
    setProducts([{ id: 1, price: recommendation.price, sales: recommendation.sales }]);
    setHelperApplied(true);
    setShowRecommendation(false);
    setMode("manual");
  };

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
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-3">
            Калькулятор окупності
          </h2>
          <p className="text-slate-400 font-light">
            Дізнайся, як швидко окупиться твоя інвестиція
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1 p-1 bg-slate-800 rounded-full border border-slate-700">
            <button
              onClick={() => setMode("manual")}
              className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                mode === "manual"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Знаю свої дані
            </button>
            <button
              onClick={() => { setMode("helper"); setHelperApplied(false); setShowRecommendation(false); }}
              className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-2 ${
                mode === "helper"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Lightbulb size={16} weight={mode === "helper" ? "fill" : "regular"} />
              Допоможіть порахувати
            </button>
          </div>
        </div>

        {/* Helper Mode Content */}
        <AnimatePresence mode="wait">
          {mode === "helper" && (
            <motion.div
              key="helper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-10"
            >
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-6">
                <p className="text-sm text-slate-300 font-medium mb-4">
                  Відповідай на питання — ми підберемо оптимальні параметри
                </p>

                {/* Followers */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={16} weight="light" className="text-emerald-400" />
                    <span className="text-xs text-slate-500">Скільки підписників у тебе?</span>
                    <span className="ml-auto text-sm font-medium text-emerald-400">{followers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                  </div>
                  <CustomSlider
                    value={followers}
                    onChange={setFollowers}
                    min={1000}
                    max={100000}
                    step={1000}
                    disabled={false}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-slate-600">1k</span>
                    <span className="text-[10px] text-slate-600">100k</span>
                  </div>
                </div>

                {/* Messages */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ChatCircle size={16} weight="light" className="text-emerald-400" />
                    <span className="text-xs text-slate-500">Скільки повідомлень отримуєш на місяць?</span>
                    <span className="ml-auto text-sm font-medium text-emerald-400">{messages}</span>
                  </div>
                  <CustomSlider
                    value={messages}
                    onChange={setMessages}
                    min={10}
                    max={500}
                    step={10}
                    disabled={false}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-slate-600">10</span>
                    <span className="text-[10px] text-slate-600">500</span>
                  </div>
                </div>

                {/* Niche Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={16} weight="light" className="text-emerald-400" />
                    <span className="text-xs text-slate-500">Яка твоя ніша?</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(["coaching", "fitness", "education", "other"] as Niche[]).map((n) => (
                      <button
                        key={n}
                        onClick={() => setNiche(n)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                          niche === n
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        {nicheLabels[n]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desired Income */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet size={16} weight="light" className="text-emerald-400" />
                    <span className="text-xs text-slate-500">Бажаний дохід на місяць?</span>
                    <span className="ml-auto text-sm font-medium text-emerald-400">${desiredIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                  </div>
                  <CustomSlider
                    value={desiredIncome}
                    onChange={setDesiredIncome}
                    min={500}
                    max={10000}
                    step={100}
                    disabled={false}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-slate-600">$500</span>
                    <span className="text-[10px] text-slate-600">$10,000</span>
                  </div>
                </div>

                {/* Show Recommendations Button */}
                {!showRecommendation && (
                  <button
                    onClick={showRecommendations}
                    className="w-full py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Lightbulb size={18} weight="fill" />
                    Показати рекомендацію
                  </button>
                )}

                {/* Recommendation Result Card */}
                <AnimatePresence>
                  {showRecommendation && recommendation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="mt-6 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle size={20} weight="fill" className="text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-400">Наша рекомендація для тебе</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 rounded-xl bg-slate-800/50">
                          <p className="text-2xl font-semibold text-white">${recommendation.price}</p>
                          <p className="text-xs text-slate-400 mt-1">Ціна продукту</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-slate-800/50">
                          <p className="text-2xl font-semibold text-white">{recommendation.sales}</p>
                          <p className="text-xs text-slate-400 mt-1">Продажів/міс</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-slate-800/50">
                          <p className="text-2xl font-semibold text-white">Пакет {recommendation.package}</p>
                          <p className="text-xs text-slate-400 mt-1">{packageData[recommendation.package].name}</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-800/30 mb-6">
                        <p className="text-xs text-slate-400 mb-2">Очікуваний дохід на місяць:</p>
                        <p className="text-3xl font-semibold text-emerald-400">
                          ${(recommendation.price * recommendation.sales).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowRecommendation(false)}
                          className="flex-1 py-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all duration-300"
                        >
                          Змінити дані
                        </button>
                        <button
                          onClick={applyRecommendations}
                          className="flex-1 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-medium transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <ChartLineUp size={18} weight="bold" />
                          Розрахувати детально
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual Mode Content */}
        {(mode === "manual" || helperApplied) && (
          <>
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
        </>
        )}
      </div>
    </section>
  );
}
