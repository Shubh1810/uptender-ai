"use client";
import React from "react";
import { motion } from "motion/react";

export function ColourfulText({ text }: { text: string }) {
  const colors = [
    "rgb(30, 58, 138)",    // Deep Navy Blue
    "rgb(35, 70, 155)",    // Navy Blue
    "rgb(40, 82, 172)",    // Dark Blue
    "rgb(45, 94, 189)",    // Medium Dark Blue
    "rgb(50, 106, 206)",   // Medium Blue
    "rgb(55, 118, 223)",   // Rich Blue
    "rgb(70, 130, 240)",   // Bright Blue
    "rgb(85, 142, 247)",   // Light Blue
    "rgb(100, 154, 254)",  // Sky Blue
    "rgb(115, 166, 255)",  // Light Sky Blue
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
      className="inline-block whitespace-pre font-sans tracking-tight text-white"
    >
      {char}
    </motion.span>
  ));
}
