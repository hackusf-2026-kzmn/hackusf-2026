"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const isSpanish = language === "es";

  return (
    <div className="flex items-center gap-2">
      <span
        className={`font-mono text-[11px] md:text-[12px] tracking-widest uppercase transition-colors duration-200 ${
          !isSpanish ? "text-[#16a34a] font-semibold" : "text-[#52665e]"
        }`}
      >
        EN
      </span>
      <button
        onClick={() => setLanguage(isSpanish ? "en" : "es")}
        aria-label="Toggle language"
        className={`relative h-6 w-12 rounded-full p-[3px] transition-colors duration-300 ${
          isSpanish ? "bg-[#16a34a]" : "bg-gray-300"
        }`}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className={`h-[18px] w-[18px] rounded-full bg-white shadow-md ${
            isSpanish ? "ml-auto" : ""
          }`}
        />
      </button>
      <span
        className={`font-mono text-[11px] md:text-[12px] tracking-widest uppercase transition-colors duration-200 ${
          isSpanish ? "text-[#16a34a] font-semibold" : "text-[#52665e]"
        }`}
      >
        ES
      </span>
    </div>
  );
}
