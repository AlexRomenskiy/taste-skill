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
  Lightbulb,
  Users,
  ChatCircle,
  Target,
  Wallet,
  Warning,
  Info,
} from "@phosphor-icons/react";

type Package = 1 | 2;
type CalcMode = "manual" | "helper";
type Niche = "coaching" | "fitness" | "education" | "beauty" | "handmade" | "consulting" | "other";

const nicheLabels: Record<Niche, string> = {
  coaching: "Коучинг",
  fitness: "Фітнес",
  education: "Освіта",
  beauty: "Б'юті",
  handmade: "Хендмейд",
  consulting: "Консалтинг",
  other: "Інше",
};

// Real industry data from Instagram DM & Telegram funnel research (2025-2026)
// Sources:
// - Instagram DM: 90% open rate, 60% reply rate, 15-20% DM-to-sale (LeadResponse 2026, Unkoa, ManyChat)
// - Telegram: 80%+ open rate, 20-40% bot completion, 10% conversion (Botract, TelePilot Pro)
// - Tripwire: 20-40% landing page conversion, 20-30% upgrade to core offer (RebelGrowth 2025, Kate Toon case: 28%)
const nicheData: Record<Niche, { 
  dmToSaleRate: number; // % людей з DM що купують (tripwire або флагман)
  tripwireToFlagship: number; // % покупців tripwire що купують флагман
  suggestedTripwire: number;
  suggestedFlagship: number;
  source: string;
  insight: string;
}> = {
  coaching: { 
    dmToSaleRate: 0.15, // 15% - Instagram DM targeted campaigns
    tripwireToFlagship: 0.25, // 25% upgrade rate
    suggestedTripwire: 37,
    suggestedFlagship: 297,
    source: "LeadResponse 2026, Kate Toon Case Study",
    insight: "Instagram Direct: 90% відкривають, 15% купують. 25-28% покупців tripwire переходять на флагман."
  },
  fitness: { 
    dmToSaleRate: 0.18, // 18% - higher due to visual transformation content
    tripwireToFlagship: 0.28, // higher due to visual results
    suggestedTripwire: 27,
    suggestedFlagship: 197,
    source: "Unkoa Instagram 2025, Fitness Marketing Report",
    insight: "Фітнес-ніша: 60% відповідають на DM. Візуальні результати (до/після) підвищують конверсію до 18%."
  },
  education: { 
    dmToSaleRate: 0.12, // 12% - standard for education
    tripwireToFlagship: 0.22,
    suggestedTripwire: 27,
    suggestedFlagship: 247,
    source: "Creatorflow 2026, EarnifyHub",
    insight: "Освітні продукти: 12% конверсія через Instagram + Telegram воронку з прогрівом."
  },
  beauty: { 
    dmToSaleRate: 0.14, // 14% - Instagram is primary portfolio
    tripwireToFlagship: 0.20,
    suggestedTripwire: 17,
    suggestedFlagship: 147,
    source: "Napolify 2025, Instavipbio Beauty Report",
    insight: "76% клієнтів знаходять б'юті-майстрів через Instagram. 61% бронюють через Direct."
  },
  handmade: { 
    dmToSaleRate: 0.10, // 10% - lower price point items
    tripwireToFlagship: 0.18,
    suggestedTripwire: 15,
    suggestedFlagship: 97,
    source: "Etsy Statistics 2026, Instagram Creators Report",
    insight: "Персоналізовані товари: 10% конверсія. Instagram + Telegram для прийому замовлень підвищує довіру."
  },
  consulting: { 
    dmToSaleRate: 0.12, // 12% - Instagram + Telegram for experts
    tripwireToFlagship: 0.30, // higher for B2B/expert services
    suggestedTripwire: 47,
    suggestedFlagship: 497,
    source: "Creatorflow 2026, Expert Funnels Report",
    insight: "Експерти в Instagram: 12% конверсія. Після tripwire-аудиту 30% купують повний пакет послуг."
  },
  other: { 
    dmToSaleRate: 0.10, // 10% - conservative estimate
    tripwireToFlagship: 0.20,
    suggestedTripwire: 27,
    suggestedFlagship: 197,
    source: "ManyChat 2026, Telegram Funnels (Medium)",
    insight: "Telegram воронки: 80%+ відкривають, 10% конверсія після оптимізації."
  },
};

// Package data with full cost breakdown
const packageData = {
  1: { 
    name: "Один продукт", 
    investment: 495, 
    support: 150,
    platforms: 45,
    description: "Один флагманський продукт з автоматизованою воронкою",
    hasSecondProduct: false,
  },
  2: { 
    name: "Два продукти", 
    investment: 990, 
    support: 250,
    platforms: 45,
    description: "Tripwire + Флагман — повна продуктова лінійка",
    hasSecondProduct: true,
  },
};

type Product = { id: number; price: number; sales: number; type: "tripwire" | "flagship" };

// Animated number component
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
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

  const formatted = Math.abs(displayValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return <span suppressHydrationWarning>{prefix}{formatted}{suffix}</span>;
}

// Custom slider component
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
      <div className="absolute inset-x-0 h-2 bg-slate-700 rounded-full" />
      <div
        className="absolute left-0 h-2 bg-emerald-500 rounded-full"
        style={{ width: `${percentage}%` }}
      />
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
  const calculatorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CalcMode>("manual");
  const [selectedPackage, setSelectedPackage] = useState<Package>(1);
  const [products, setProducts] = useState<Product[]>([{ id: 1, price: 197, sales: 3, type: "flagship" }]);
  const [isLocked, setIsLocked] = useState(false);

  // Helper mode inputs
  const [followers, setFollowers] = useState(5000);
  const [messages, setMessages] = useState(50);
  const [niche, setNiche] = useState<Niche>("coaching");
  const [desiredIncome, setDesiredIncome] = useState(2000);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    tripwirePrice: number;
    tripwireSales: number;
    flagshipPrice: number;
    flagshipSales: number;
    package: Package;
    source: string;
    insight: string;
    expectedIncome: number;
    gap: number;
    neededMessages: number;
    suggestion: string;
    growthTip: string;
    dmToSaleRate: number;
    tripwireToFlagship: number;
  } | null>(null);

  // Calculate recommendations based on Instagram DM & Telegram funnel statistics
  const calculateRecommendations = () => {
    const nicheInfo = nicheData[niche];
    const { dmToSaleRate, tripwireToFlagship, suggestedTripwire, suggestedFlagship } = nicheInfo;
    
    // Calculate engagement rate (messages/followers)
    const currentEngagementRate = (messages / followers) * 100;
    const benchmarkEngagementRate = 1.0; // 1% is average for active accounts
    
    // Warm leads from DMs (70% of messages are potential buyers)
    const warmLeads = Math.round(messages * 0.7);
    
    // For Package 1: only flagship sales
    const flagshipOnlySales = Math.max(1, Math.round(warmLeads * dmToSaleRate));
    
    // For Package 2: tripwire sales, then flagship from tripwire buyers
    const tripwireSales = Math.max(1, Math.round(warmLeads * dmToSaleRate));
    const flagshipFromTripwire = Math.max(1, Math.round(tripwireSales * tripwireToFlagship));
    
    // Calculate incomes for both packages
    const package1Income = flagshipOnlySales * suggestedFlagship;
    const package2Income = (tripwireSales * suggestedTripwire) + (flagshipFromTripwire * suggestedFlagship);
    
    // Determine which package and calculate optimal prices
    let recommendedPackage: Package;
    let tripwirePrice = suggestedTripwire;
    let flagshipPrice = suggestedFlagship;
    let finalTripwireSales = tripwireSales;
    let finalFlagshipSales = flagshipOnlySales;
    let expectedIncome: number;
    
    if (desiredIncome <= package1Income * 1.1) {
      // Package 1 can achieve the goal
      recommendedPackage = 1;
      // Adjust flagship price to hit goal if needed
      const neededPrice = Math.round(desiredIncome / flagshipOnlySales);
      flagshipPrice = Math.max(100, Math.min(1000, neededPrice));
      finalFlagshipSales = flagshipOnlySales;
      expectedIncome = finalFlagshipSales * flagshipPrice;
    } else {
      // Need Package 2 for higher income
      recommendedPackage = 2;
      finalTripwireSales = tripwireSales;
      finalFlagshipSales = flagshipFromTripwire;
      
      // Adjust prices to hit goal
      // Target: 25% from tripwire, 75% from flagship
      const targetFromTripwire = desiredIncome * 0.25;
      const targetFromFlagship = desiredIncome * 0.75;
      
      tripwirePrice = Math.round(targetFromTripwire / finalTripwireSales);
      tripwirePrice = Math.max(10, Math.min(50, tripwirePrice));
      
      flagshipPrice = Math.round(targetFromFlagship / finalFlagshipSales);
      flagshipPrice = Math.max(200, Math.min(1000, flagshipPrice));
      
      expectedIncome = (finalTripwireSales * tripwirePrice) + (finalFlagshipSales * flagshipPrice);
    }
    
    const gap = Math.max(0, desiredIncome - expectedIncome);
    
    // Calculate needed messages and growth tips
    let neededMessages = messages;
    let suggestion = "";
    let growthTip = "";
    
    if (gap > 0) {
      // Goal NOT achievable with current traffic
      const incomePerMessage = expectedIncome / messages;
      neededMessages = Math.ceil(desiredIncome / incomePerMessage);
      
      suggestion = `З ${messages} повідомленнями досяжно ~$${expectedIncome.toLocaleString()}/міс. Для $${desiredIncome.toLocaleString()} потрібно ~${neededMessages} повідомлень.`;
      
      // Growth tip based on engagement
      if (currentEngagementRate < benchmarkEngagementRate) {
        const potentialMessages = Math.round(followers * benchmarkEngagementRate / 100);
        growthTip = `Зараз тобі пишуть ${currentEngagementRate.toFixed(1)}% підписників (середнє: 1%). Збільш активність через Reels та Stories — і отримаєш ~${potentialMessages} повідомлень/міс.`;
      } else {
        const followersNeeded = Math.ceil(neededMessages / (currentEngagementRate / 100));
        growthTip = `Твоя аудиторія активна (${currentEngagementRate.toFixed(1)}% пишуть). Для ${neededMessages} повідомлень потрібно ~${followersNeeded.toLocaleString()} підписників.`;
      }
    } else {
      suggestion = `Твоя ціль $${desiredIncome.toLocaleString()}/міс досяжна з поточним трафіком!`;
    }

    return {
      tripwirePrice,
      tripwireSales: finalTripwireSales,
      flagshipPrice,
      flagshipSales: finalFlagshipSales,
      package: recommendedPackage,
      source: nicheInfo.source,
      insight: nicheInfo.insight,
      expectedIncome,
      gap,
      neededMessages,
      suggestion,
      growthTip,
      dmToSaleRate: Math.round(dmToSaleRate * 100),
      tripwireToFlagship: Math.round(tripwireToFlagship * 100),
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
    
    if (recommendation.package === 1) {
      // Package 1: only flagship
      setProducts([
        { id: 1, price: recommendation.flagshipPrice, sales: recommendation.flagshipSales, type: "flagship" }
      ]);
    } else {
      // Package 2: tripwire + flagship
      setProducts([
        { id: 1, price: recommendation.tripwirePrice, sales: recommendation.tripwireSales, type: "tripwire" },
        { id: 2, price: recommendation.flagshipPrice, sales: recommendation.flagshipSales, type: "flagship" }
      ]);
    }
    
    setShowRecommendation(false);
    setMode("manual");
    
    setTimeout(() => {
      calculatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handlePackageChange = (pkg: Package) => {
    if (isLocked) return;
    setSelectedPackage(pkg);
    
    if (pkg === 1) {
      // Remove tripwire, keep only flagship
      const flagship = products.find(p => p.type === "flagship") || { id: 1, price: 197, sales: 3, type: "flagship" as const };
      setProducts([{ ...flagship, id: 1 }]);
    } else {
      // Add tripwire if not present
      if (products.length === 1) {
        const flagship = products[0];
        setProducts([
          { id: 1, price: 27, sales: 5, type: "tripwire" },
          { id: 2, price: flagship.price > 100 ? flagship.price : 297, sales: Math.max(1, Math.round(flagship.sales * 0.25)), type: "flagship" }
        ]);
      }
    }
  };

  const updateProduct = (id: number, field: "price" | "sales", value: number) => {
    if (isLocked) return;
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // Calculations
  const monthlyRevenue = products.reduce((sum, p) => sum + p.price * p.sales, 0);
  const pkg = packageData[selectedPackage];
  const monthlyCosts = pkg.support + pkg.platforms;
  const netProfit = monthlyRevenue - monthlyCosts;
  const investment = pkg.investment;
  const paybackDays = netProfit > 0 ? Math.round((investment / netProfit) * 30) : null;
  const yearlyIncome = (netProfit * 12) - investment;

  // Warning conditions and break-even advice
  const isNegativeProfit = netProfit < 0;
  
  const getBreakEvenAdvice = () => {
    if (!isNegativeProfit) return null;
    
    const deficit = Math.abs(netProfit);
    
    if (selectedPackage === 1) {
      const product = products[0];
      const salesNeeded = Math.ceil(monthlyCosts / product.price);
      const priceNeeded = Math.ceil(monthlyCosts / product.sales);
      return {
        type: "single" as const,
        salesNeeded,
        priceNeeded,
        currentSales: product.sales,
        currentPrice: product.price,
        deficit,
      };
    } else {
      // Package 2: show how to improve
      const tripwire = products.find(p => p.type === "tripwire");
      const flagship = products.find(p => p.type === "flagship");
      
      if (!tripwire || !flagship) return null;
      
      // Calculate what flagship sales would cover the deficit
      const additionalFlagshipSales = Math.ceil(deficit / flagship.price);
      const additionalTripwireSales = Math.ceil(deficit / tripwire.price);
      
      return {
        type: "double" as const,
        additionalFlagshipSales,
        additionalTripwireSales,
        currentFlagshipSales: flagship.sales,
        currentTripwireSales: tripwire.sales,
        deficit,
        flagshipPrice: flagship.price,
        tripwirePrice: tripwire.price,
      };
    }
  };

  const breakEvenAdvice = getBreakEvenAdvice();

  return (
    <section ref={calculatorRef} className="py-20 bg-slate-900 scroll-mt-4">
      <div className="max-w-4xl mx-auto px-6">
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
              onClick={() => { setMode("helper"); setShowRecommendation(false); }}
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
                    <span className="text-xs text-slate-500">Скільки підписників у тебе в Instagram?</span>
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
                    <span className="text-xs text-slate-500">Скільки повідомлень в Direct отримуєш на місяць?</span>
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {(["coaching", "fitness", "education", "beauty", "handmade", "consulting", "other"] as Niche[]).map((n) => (
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
                      {/* Header with goal comparison */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={20} weight="fill" className="text-emerald-400" />
                          <span className="text-sm font-medium text-emerald-400">Наша рекомендація</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Твоя ціль</p>
                          <p className="text-sm font-semibold text-white">${desiredIncome.toLocaleString()}/міс</p>
                        </div>
                      </div>

                      {/* Suggestion block */}
                      {recommendation.suggestion && (
                        <div className={`p-4 rounded-xl mb-4 ${(recommendation.gap ?? 0) > 0 ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-emerald-500/10 border border-emerald-500/30'}`}>
                          <p className={`text-sm ${(recommendation.gap ?? 0) > 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
                            {recommendation.suggestion}
                          </p>
                        </div>
                      )}

                      {/* Growth tip */}
                      {recommendation.growthTip && (recommendation.gap ?? 0) > 0 && (
                        <div className="p-4 rounded-xl mb-4 bg-blue-500/10 border border-blue-500/30">
                          <p className="text-xs text-blue-400 font-medium mb-1">Як збільшити трафік?</p>
                          <p className="text-sm text-blue-300">{recommendation.growthTip}</p>
                        </div>
                      )}

                      {/* Package recommendation with explanation */}
                      <div className="p-4 rounded-xl mb-4 bg-slate-800/50 border border-slate-700">
                        <p className="text-sm font-medium text-white mb-2">
                          Рекомендуємо: Пакет {recommendation.package} — {packageData[recommendation.package].name}
                        </p>
                        <p className="text-xs text-slate-400 mb-3">
                          {packageData[recommendation.package].description}
                        </p>
                        
                        {recommendation.package === 2 && (
                          <div className="space-y-2 pt-3 border-t border-slate-700">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              <p className="text-xs text-slate-400">
                                <span className="text-amber-400 font-medium">Tripwire (${recommendation.tripwirePrice})</span> — недорогий вхідний продукт, щоб клієнт зробив першу покупку і побудував довіру
                              </p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              <p className="text-xs text-slate-400">
                                <span className="text-emerald-400 font-medium">Флагман (${recommendation.flagshipPrice})</span> — основний продукт, який продається після tripwire ({recommendation.tripwireToFlagship}% покупців tripwire купують флагман)
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Products breakdown */}
                      <div className={`grid ${recommendation.package === 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-4 mb-4`}>
                        {recommendation.package === 2 && (
                          <div className="text-center p-4 rounded-xl bg-slate-800/50">
                            <p className="text-xs text-amber-400 mb-1">Tripwire</p>
                            <p className="text-xl font-semibold text-white">${recommendation.tripwirePrice}</p>
                            <p className="text-xs text-slate-400 mt-1">{recommendation.tripwireSales} продажів/міс</p>
                            <p className="text-[10px] text-slate-500 mt-1">= ${recommendation.tripwirePrice * recommendation.tripwireSales}/міс</p>
                          </div>
                        )}
                        <div className="text-center p-4 rounded-xl bg-slate-800/50">
                          <p className="text-xs text-emerald-400 mb-1">Флагман</p>
                          <p className="text-xl font-semibold text-white">${recommendation.flagshipPrice}</p>
                          <p className="text-xs text-slate-400 mt-1">{recommendation.flagshipSales} продажів/міс</p>
                          <p className="text-[10px] text-slate-500 mt-1">= ${recommendation.flagshipPrice * recommendation.flagshipSales}/міс</p>
                        </div>
                      </div>

                      {/* Total Expected Income */}
                      <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 mb-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-emerald-300">Очікуваний дохід:</p>
                          <p className="text-2xl font-semibold text-emerald-400">${recommendation.expectedIncome.toLocaleString()}/міс</p>
                        </div>
                      </div>

                      {/* Investment breakdown */}
                      {(() => {
                        const recPkg = packageData[recommendation.package];
                        const monthlyExpenses = recPkg.support + recPkg.platforms;
                        const totalInvestment = recPkg.investment;
                        const expectedProfit = recommendation.expectedIncome - monthlyExpenses;
                        const paybackMonths = expectedProfit > 0 ? Math.ceil(totalInvestment / expectedProfit) : null;
                        return (
                          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700 mb-6">
                            <p className="text-xs text-slate-400 mb-3">Твоя інвестиція:</p>
                            <div className="grid grid-cols-3 gap-3 text-center">
                              <div>
                                <p className="text-lg font-semibold text-white">${totalInvestment}</p>
                                <p className="text-[10px] text-slate-500">разово (старт)</p>
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-white">${monthlyExpenses}</p>
                                <p className="text-[10px] text-slate-500">щомісяця</p>
                              </div>
                              <div>
                                <p className={`text-lg font-semibold ${paybackMonths ? 'text-emerald-400' : 'text-amber-400'}`}>
                                  {paybackMonths ? `${paybackMonths} міс` : "—"}
                                </p>
                                <p className="text-[10px] text-slate-500">окупність</p>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-3 text-center">
                              Загалом за 1-й місяць: ${totalInvestment + monthlyExpenses}
                            </p>
                          </div>
                        );
                      })()}

                      {/* Source and Insight */}
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 mb-6">
                        <div className="flex items-start gap-2 mb-2">
                          <Info size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-emerald-400 font-medium">Звідки ці дані?</p>
                        </div>
                        <p className="text-xs text-slate-300 mb-2">{recommendation.insight}</p>
                        <p className="text-[10px] text-slate-500">Джерело: {recommendation.source}</p>
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
        {mode === "manual" && (
          <>
            {/* Step 1: Package Selection */}
            <div className="mb-10">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Крок 1 · Обери пакет</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {([1, 2] as Package[]).map((pkgNum) => {
                  const pkgInfo = packageData[pkgNum];
                  return (
                    <button
                      key={pkgNum}
                      onClick={() => handlePackageChange(pkgNum)}
                      disabled={isLocked}
                      className={`p-5 rounded-2xl border transition-all duration-300 text-left ${
                        selectedPackage === pkgNum
                          ? "bg-emerald-500/10 border-emerald-500/50"
                          : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                      } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <p className={`text-sm font-medium mb-1 ${selectedPackage === pkgNum ? "text-emerald-400" : "text-white"}`}>
                        Пакет {pkgNum} — {pkgInfo.name}
                      </p>
                      <p className="text-xs text-slate-400 mb-2">
                        {pkgInfo.description}
                      </p>
                      <p className="text-xs text-slate-500">
                        Інвестиція ${pkgInfo.investment} · Підтримка ${pkgInfo.support + pkgInfo.platforms}/міс
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Product Configuration */}
            <div className="mb-10">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">
                Крок 2 · {selectedPackage === 1 ? "Налаштуй свій продукт" : "Налаштуй свої продукти"}
              </p>
              
              <div className="space-y-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${product.type === "tripwire" ? "bg-amber-400" : "bg-emerald-400"}`} />
                        <p className="text-sm font-medium text-white">
                          {product.type === "tripwire" ? "Tripwire (вхідний продукт)" : "Флагман (основний продукт)"}
                        </p>
                      </div>
                      {product.type === "tripwire" && (
                        <span className="text-[10px] text-amber-400/70 bg-amber-400/10 px-2 py-1 rounded-full">
                          Для першої покупки
                        </span>
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
                        min={product.type === "tripwire" ? 10 : 100}
                        max={product.type === "tripwire" ? 50 : 1000}
                        step={product.type === "tripwire" ? 1 : 10}
                        disabled={isLocked}
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-slate-600">${product.type === "tripwire" ? 10 : 100}</span>
                        <span className="text-[10px] text-slate-600">${product.type === "tripwire" ? 50 : 1000}</span>
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

                    {/* Product Revenue */}
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Дохід від цього продукту:</span>
                        <span className="text-sm font-medium text-white">${(product.price * product.sales).toLocaleString()}/міс</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Warning for negative profit */}
            {isNegativeProfit && breakEvenAdvice && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30"
              >
                <div className="flex items-start gap-3">
                  <Warning size={20} weight="fill" className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-300 mb-2">
                      З такими параметрами буде мінус ${Math.abs(netProfit)}/міс
                    </p>
                    {breakEvenAdvice.type === "single" && (
                      <div className="text-xs text-amber-400/80 space-y-1">
                        <p>Для виходу в плюс потрібно одне з:</p>
                        <p>• Збільшити продажі до {breakEvenAdvice.salesNeeded}/міс (зараз {breakEvenAdvice.currentSales})</p>
                        <p>• Або підняти ціну до ${breakEvenAdvice.priceNeeded} (зараз ${breakEvenAdvice.currentPrice})</p>
                      </div>
                    )}
                    {breakEvenAdvice.type === "double" && (
                      <div className="text-xs text-amber-400/80 space-y-1">
                        <p>Для виходу в плюс потрібно одне з:</p>
                        <p>• Додати ще {breakEvenAdvice.additionalFlagshipSales} продажів флагмана (${breakEvenAdvice.flagshipPrice})</p>
                        <p>• Або додати ще {breakEvenAdvice.additionalTripwireSales} продажів tripwire (${breakEvenAdvice.tripwirePrice})</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Results */}
            <div className="mb-10">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Крок 3 · Твої результати</p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Monthly Revenue */}
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <CurrencyDollar size={16} weight="light" className="text-slate-400" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Дохід</span>
                  </div>
                  <p className="text-xl font-medium text-white">
                    <AnimatedNumber value={monthlyRevenue} prefix="$" />
                  </p>
                </div>

                {/* Costs Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowsClockwise size={16} weight="light" className="text-slate-400" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Витрати</span>
                  </div>
                  <p className="text-xl font-medium text-slate-300">
                    <AnimatedNumber value={monthlyCosts} prefix="$" />
                    <span className="text-xs font-normal text-slate-500">/міс</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    + ${investment} разова інвестиція
                  </p>
                </div>

                {/* Net Profit */}
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} weight="light" className="text-slate-400" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Чистий прибуток</span>
                  </div>
                  <p className={`text-xl font-medium ${netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {netProfit >= 0 ? "" : "-"}$<AnimatedNumber value={Math.abs(netProfit)} />
                  </p>
                </div>

                {/* Payback Days */}
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} weight="light" className="text-slate-400" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Окупність</span>
                  </div>
                  <p className="text-xl font-medium text-white">
                    {paybackDays ? (
                      <>
                        <AnimatedNumber value={paybackDays} />
                        <span className="text-sm font-normal text-slate-400"> днів</span>
                      </>
                    ) : (
                      <span className="text-red-400">—</span>
                    )}
                  </p>
                </div>

                {/* Yearly Income */}
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <ChartLineUp size={16} weight="light" className="text-slate-400" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">За рік</span>
                  </div>
                  <p className={`text-xl font-medium ${yearlyIncome >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {yearlyIncome >= 0 ? "" : "-"}$<AnimatedNumber value={Math.abs(yearlyIncome)} />
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <AnimatePresence mode="wait">
              {!isLocked ? (
                <motion.div
                  key="lock"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button
                    onClick={() => setIsLocked(true)}
                    className="w-full py-4 rounded-full bg-white text-slate-900 font-medium hover:bg-slate-100 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Lock size={18} weight="bold" />
                    Зафіксувати результат
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className="text-slate-400 mb-4">
                    {netProfit > 0 
                      ? `Готовий почати заробляти $${monthlyRevenue}/міс?`
                      : "Хочеш розібратися, як вийти в плюс?"
                    }
                  </p>
                  <button
                    onClick={onBookClick}
                    className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-medium transition-all duration-300"
                  >
                    Записатись на консультацію
                  </button>
                  <button
                    onClick={() => setIsLocked(false)}
                    className="block mx-auto mt-4 text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    Змінити параметри
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}
