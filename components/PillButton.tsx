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
        "relative px-8 py-3 rounded-full text-lg md:text-xl font-sofia transition-all duration-300 overflow-hidden group border-2",
        variant === 'filled' 
          ? "border-black text-white" 
          : "bg-transparent border-black text-black",
        className
      )}
      style={{
        backgroundColor: variant === 'filled' ? '#4760DA' : 'transparent'
      }}
      onMouseEnter={(e) => {
        if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = '#4760DA'
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = 'transparent'
        }
      }}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

