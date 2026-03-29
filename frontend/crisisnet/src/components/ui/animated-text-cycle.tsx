"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTextCycleProps {
  words: string[];
  interval?: number;
  className?: string;
}

const variants = {
  hidden: { y: -24, opacity: 0, filter: "blur(6px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: "easeOut" },
  },
  exit: {
    y: 24,
    opacity: 0,
    filter: "blur(6px)",
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

export function AnimatedTextCycle({
  words,
  interval = 5000,
  className = "",
}: AnimatedTextCycleProps) {
  const [index, setIndex] = useState(0);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Measure all words once mounted, take the widest — fixes layout shift permanently
  useEffect(() => {
    if (!measureRef.current) return;
    let max = 0;
    Array.from(measureRef.current.children).forEach((el) => {
      max = Math.max(max, (el as HTMLElement).getBoundingClientRect().width);
    });
    setMaxWidth(max);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval
    );
    return () => clearInterval(t);
  }, [interval, words.length]);

  return (
    <>
      {/* Hidden measurement layer — renders all words to find the widest */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none"
        style={{ visibility: "hidden", whiteSpace: "nowrap" }}
      >
        {words.map((w, i) => (
          <span key={i} className={className}>
            {w}
          </span>
        ))}
      </span>

      {/* Fixed-width container prevents any layout shift */}
      <span
        className="inline-block overflow-visible"
        style={{ width: maxWidth !== undefined ? maxWidth : "auto" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            className={`inline-block ${className}`}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ whiteSpace: "nowrap" }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}
