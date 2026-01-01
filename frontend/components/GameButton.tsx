import React from "react";

interface GameButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  backgroundColor?: string;
  className?: string;
  disabled?: boolean;
  width?: string; // e.g., "w-68", "w-full", "w-48"
  customShadow?: string; // Custom box-shadow value
  backdropBlur?: string; // e.g., "blur(309.74px)"
  border?: string;
}

export default function GameButton({
  onClick,
  children,
  backgroundColor = "#E65150",
  className = "",
  disabled = false,
  width = "w-68",
  customShadow,
  backdropBlur = "blur(349.19px)",
  border,
}: GameButtonProps) {
  // Default shadow if not provided
  const defaultShadow = `-1.4px -2.1px 4.89px 0px rgba(191, 51, 46, 0.8) inset, 4.19px 2.1px 4.89px 0px rgba(252, 113, 108, 0.25) inset`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative ${width} h-12 
        border-${border} border-[#D0EEF5] rounded-[9.08px] 
        px-4 py-3 
        font-lilitaone text-[#F9F9F9]
        flex items-center justify-center
        transition-transform active:scale-95
        overflow-hidden
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      style={{
        backgroundColor,
        boxShadow: customShadow || defaultShadow,
        backdropFilter: backdropBlur,
      }}
    >
      {/* Button Text */}
      <span className="relative z-10 text-center">{children}</span>

      {/* Bubble decoration in top-right corner */}
      <img
        src="/btnbob.svg"
        alt=""
        className="absolute top-0 right-0 w-6 h-6 pointer-events-none"
      />
    </button>
  );
}
