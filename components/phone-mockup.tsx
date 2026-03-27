"use client";

import { motion } from "framer-motion";
import {
  InstagramLogo,
  ChatCircleDots,
  CreditCard,
  CheckCircle,
  Lightning,
} from "@phosphor-icons/react";

export function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
      className="relative w-full flex justify-center lg:justify-end"
    >
      <div className="animate-float relative w-[320px] h-[640px] bg-card rounded-[2.5rem] border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] p-2">
        {/* Screen */}
        <div className="w-full h-full bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col overflow-hidden relative">
          {/* Dynamic Island */}
          <div className="w-full h-12 flex justify-center items-start pt-3 relative z-20">
            <div className="w-24 h-6 bg-slate-900 rounded-full flex items-center justify-between px-2">
              <div className="w-2 h-2 rounded-full bg-slate-800 flex items-center justify-center">
                <div className="w-0.5 h-0.5 bg-blue-400 rounded-full" />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
            </div>
          </div>

          {/* UI Content */}
          <div className="flex-1 px-4 py-2 flex flex-col gap-3 relative z-10">
            <div className="mb-1">
              <h2 className="text-lg font-medium tracking-tight text-foreground">
                Automation
              </h2>
              <p className="text-xs text-muted font-normal">
                All systems active
              </p>
            </div>

            {/* Instagram DM Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="bg-card rounded-xl border border-border p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 via-fuchsia-500 to-amber-400 flex items-center justify-center">
                  <InstagramLogo size={20} weight="fill" className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">
                    New DM from @maria_coach
                  </p>
                  <p className="text-xs text-muted truncate">
                    Hi! I want to learn about your...
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bot Response Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
              className="bg-card rounded-xl border border-border p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <ChatCircleDots size={20} weight="light" className="text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">
                    Bot replied automatically
                  </p>
                  <p className="text-xs text-muted">
                    Lead captured + PDF sent
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <CheckCircle size={14} weight="fill" className="text-accent" />
                </div>
              </div>
            </motion.div>

            {/* Payment Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, type: "spring", stiffness: 100 }}
              className="bg-card rounded-xl border border-border p-3 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} weight="light" className="text-muted" />
                  <span className="text-xs font-medium text-muted uppercase tracking-widest">
                    Payment
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
                  <span className="text-xs text-accent font-medium">Live</span>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-medium tracking-tight text-foreground">
                    $149
                    <span className="text-sm text-muted font-normal">.00</span>
                  </p>
                  <p className="text-xs text-muted">Tripwire product sold</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Lightning size={18} weight="fill" className="text-accent" />
                </div>
              </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-auto grid grid-cols-3 gap-2"
            >
              <div className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-lg font-medium text-foreground">47</p>
                <p className="text-xs text-muted">Leads</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-lg font-medium text-foreground">12</p>
                <p className="text-xs text-muted">Sales</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-lg font-medium text-accent">$1.8k</p>
                <p className="text-xs text-muted">Revenue</p>
              </div>
            </motion.div>
          </div>

          {/* Bottom Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-200 rounded-full z-20" />
        </div>
      </div>
    </motion.div>
  );
}
