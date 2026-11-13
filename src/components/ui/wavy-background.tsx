"use client";

import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "@/lib/utils";

type WavyBackgroundProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
};

const DEFAULT_COLORS = ["#166534", "#86efac", "#7dd3fc", "#38bdf8"];
const WAVE_COUNT = 5;

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth = 50,
  backgroundFill = "black",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: WavyBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Callers usually pass an inline array; key on its contents so a parent
  // re-render doesn't restart the animation.
  const colorKey = (colors ?? DEFAULT_COLORS).join("|");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const noise = createNoise3D();
    const waveColors = colorKey.split("|");
    const step = speed === "fast" ? 0.002 : 0.001;

    // Safari ignores ctx.filter, so blur the element with CSS instead.
    const isSafari = navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
    if (isSafari) canvas.style.filter = `blur(${blur}px)`;

    let width = 0;
    let height = 0;
    let time = 0;
    let frame = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    const render = () => {
      ctx.fillStyle = backgroundFill;
      ctx.globalAlpha = waveOpacity;
      ctx.fillRect(0, 0, width, height);

      time += step;
      for (let i = 0; i < WAVE_COUNT; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        for (let x = 0; x < width; x += 5) {
          const y = noise(x / 800, 0.3 * i, time) * 100;
          // Slight upward diagonal from bottom-left to top-right.
          const base = height * 0.7;
          const tilt = (0.5 - x / width) * 60;
          ctx.lineTo(x, y + base + tilt);
        }
        ctx.stroke();
        ctx.closePath();
      }
      frame = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [colorKey, waveWidth, backgroundFill, blur, speed, waveOpacity]);

  return (
    <div className={cn("h-screen flex flex-col items-center justify-center", containerClassName)}>
      <canvas className="absolute inset-0 z-0" ref={canvasRef} />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
