"use client";
import React from "react";
import { motion } from "motion/react";

export function ColourfulText({ text }: { text: string }) {
  const colors = [
    "rgb(255, 153, 51)",   // Saffron
    "rgb(255, 140, 45)",   // Saffron-Orange blend
    "rgb(255, 128, 40)",   // Orange
    "rgb(255, 115, 35)",   // Orange-Yellow blend
    "rgb(255, 102, 30)",   // Deep Orange
    "rgb(204, 153, 51)",   // Orange-Green transition
    "rgb(153, 204, 51)",   // Yellow-Green
    "rgb(102, 204, 51)",   // Light Green
    "rgb(51, 153, 51)",    // Medium Green
    "rgb(19, 136, 8)",     // Deep Green (Indian flag green)
  ];

  const [currentColors, setCurrentColors] = React.useState(colors);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
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
        color: currentColors[index % currentColors.length],
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
