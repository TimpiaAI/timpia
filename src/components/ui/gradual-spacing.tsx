
"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradualSpacingProps {
  text: string;
  duration?: number;
  delayMultiple?: number;
  framerProps?: Variants;
  className?: string;
  highlightWords?: { word: string; className: string }[];
}

export function GradualSpacing({
  text,
  duration = 0.5,
  delayMultiple = 0.04,
  framerProps = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  className,
  highlightWords = [],
}: GradualSpacingProps) {
  // Function to split text and apply highlighting
  const getSpans = () => {
    let remainingText = text;
    const spans: JSX.Element[] = [];
    let keyIndex = 0;

    // Sort highlightWords by length descending to match longer phrases first
    const sortedHighlights = [...highlightWords].sort((a, b) => b.word.length - a.word.length);

    while (remainingText.length > 0) {
      let foundHighlight = false;
      for (const highlight of sortedHighlights) {
        const regex = new RegExp(`^(${highlight.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i');
        const match = remainingText.match(regex);

        if (match) {
          const matchedWord = match[0];
          // Add highlighted part
          matchedWord.split("").forEach((char, charIndex) => {
            spans.push(
              <motion.span
                key={`char-${keyIndex}-${charIndex}`}
                initial="hidden"
                animate="visible"
                variants={framerProps}
                transition={{ duration, delay: (keyIndex + charIndex) * delayMultiple }}
                className={cn("drop-shadow-sm", className, highlight.className)}
              >
                {char === " " ? <span>&nbsp;</span> : char}
              </motion.span>
            );
          });
          keyIndex += matchedWord.length;
          remainingText = remainingText.substring(matchedWord.length);
          foundHighlight = true;
          break;
        }
      }

      if (!foundHighlight) {
        // Add non-highlighted character
        const char = remainingText[0];
        spans.push(
          <motion.span
            key={`char-${keyIndex}`}
            initial="hidden"
            animate="visible"
            variants={framerProps}
            transition={{ duration, delay: keyIndex * delayMultiple }}
            className={cn("drop-shadow-sm", className)}
          >
            {char === " " ? <span>&nbsp;</span> : char}
          </motion.span>
        );
        keyIndex++;
        remainingText = remainingText.substring(1);
      }
    }
    return spans;
  };

  return (
    <div className="flex justify-center lg:justify-center flex-wrap"> {/* Centered wrapping for long text */}
      <AnimatePresence>
        {getSpans()}
      </AnimatePresence>
    </div>
  );
}
