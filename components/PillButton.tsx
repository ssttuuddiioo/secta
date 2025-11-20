'use client'

import { cn } from "@/lib/utils";
import { MouseEvent } from "react";

interface PillButtonProps {
  children: React.ReactNode;
  variant?: 'outline' | 'filled';
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export function PillButton({ 
  children, 
  variant = 'outline', 
  onClick, 
  className 
}: PillButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-8 py-3 rounded-full text-lg md:text-xl font-sofia transition-all duration-300 overflow-hidden group border",
        variant === 'filled' 
          ? "bg-secta-orange border-secta-orange text-white" 
          : "bg-transparent border-white text-white hover:bg-white hover:text-secta-black",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

