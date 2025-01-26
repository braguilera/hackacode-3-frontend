import React, { useContext } from "react";
import Contexto from "../../contexto/Contexto";
import { cn } from "../../lib/utils";

const ShimmerButton = React.forwardRef(
  (
    {
      shimmerSize = "0.05em",
      shimmerColor = "#ffffff",
      shimmerDuration = "3s",
      borderRadius = "100px",
      className,
      children,
      funcion,
      ...props
    },
    ref
  ) => {
    const { darkMode } = useContext(Contexto);

    // Configuración dinámica basada en el modo
    const background = darkMode ? "rgba(30, 41, 59, 1)" : "rgba(0, 0, 0, 0.9)";
    const textColor = darkMode ? "text-gray-200" : "text-white";
    const borderColor = darkMode ? "border-gray-700" : "border-white/10";
    const hoverBgColor = darkMode ? "group-hover:bg-gray-700" : "group-hover:bg-gray-500";

    return (
      <button
        style={{
          "--spread": "90deg",
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
          "--bg": background,
        }}
        onClick={funcion}
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border px-6 py-3",
          borderColor,
          textColor,
          "[background:var(--bg)] [border-radius:var(--radius)]",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px hover:scale-105",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]"
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            "absolute inset-0 size-full",
            "rounded-2xl px-4 py-1.5 text-sm font-medium",
            "transform-gpu transition-all duration-300 ease-in-out",
            hoverBgColor,
            "opacity-25",
            "group-active:shadow-[inset_0_-10px_10px_rgba(255,255,255,0.1)]"
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };