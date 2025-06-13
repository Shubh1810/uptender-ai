"use client";
import React from "react";
import { motion } from "motion/react";

export function ColourfulText({ text }: { text: string }) {
  const colors = [
    "rgb(255, 103, 31)",   // Deep Saffron
    "rgb(255, 115, 35)",   // Rich Saffron
    "rgb(255, 127, 39)",   // Saffron Blend
    "rgb(255, 139, 43)",   // Saffron Orange
    "rgb(255, 151, 47)",   // Golden Saffron
    "rgb(255, 163, 51)",   // Saffron Gold
    "rgb(255, 175, 55)",   // Rich Gold
    "rgb(255, 187, 59)",   // Deep Golden
    "rgb(255, 199, 63)",   // Golden Yellow
    "rgb(255, 211, 67)",   // Moderate Yellow (like "r")
  ];

  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return text.split("").map((char, index) => (
    <motion.span
      key={`${char}-${count}-${index}`}
      initial={{
        y: 0,
      }}
      animate={{
        color: colors[index % colors.length],
        y: [0, -3, 0],
        scale: [1, 1.01, 1],
        filter: ["blur(0px)", `blur(5px)`, "blur(0px)"],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
      }}
      className="inline-block whitespace-pre font-sans tracking-tight"
    >
      {char}
    </motion.span>
  ));
}
