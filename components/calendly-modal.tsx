"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendlyUrl?: string;
}

export function CalendlyModal({
  isOpen,
  onClose,
  calendlyUrl = "https://calendly.com/your-username/consultation",
}: CalendlyModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative w-full max-w-3xl h-[80vh] bg-card rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  Забронювати розбір
                </h3>
                <p className="text-sm text-muted">
                  Обери зручний час для консультації
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X size={20} weight="bold" className="text-foreground" />
              </button>
            </div>

            {/* Calendly Embed */}
            <div className="h-[calc(100%-73px)] bg-slate-50">
              <iframe
                src={`${calendlyUrl}?hide_gdpr_banner=1&background_color=fafafa&text_color=0f172a&primary_color=10b981`}
                width="100%"
                height="100%"
                frameBorder="0"
                title="Schedule a consultation"
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
