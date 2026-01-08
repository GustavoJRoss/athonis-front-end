"use client";
import { FC, useEffect, useState } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

interface GridProps {
  size?: ResponsiveValue<number>;
  gap?: ResponsiveValue<number>;
  children: React.ReactNode;
  className?: string;
}

interface GridCellProps {
  span?: ResponsiveValue<number>;
  children: React.ReactNode;
  className?: string;
}

// Hook para detectar breakpoint atual
const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xl");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint("xs");
      else if (width < 768) setBreakpoint("sm");
      else if (width < 1024) setBreakpoint("md");
      else if (width < 1280) setBreakpoint("lg");
      else setBreakpoint("xl");
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
};

// Função para resolver valor responsivo
const resolveResponsiveValue = <T,>(
  value: ResponsiveValue<T> | undefined,
  breakpoint: Breakpoint,
  defaultValue: T
): T => {
  if (value === undefined) return defaultValue;
  if (typeof value === "number") return value as T;

  const breakpointOrder: Breakpoint[] = ["xs", "sm", "md", "lg", "xl"];
  const currentIndex = breakpointOrder.indexOf(breakpoint);

  // Procura o valor do breakpoint atual ou o mais próximo menor
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (value && value[bp as keyof typeof value]) {
      return value[bp as keyof typeof value] as T;
    }
  }

  return defaultValue;
};

// Componente Grid
export const Grid: FC<GridProps> & { Cell: FC<GridCellProps> } = ({
  size = 12,
  gap = 4,
  children,
  className = "",
}) => {
  const breakpoint = useBreakpoint();
  const columns = resolveResponsiveValue(size, breakpoint, 12);
  const gapValue = resolveResponsiveValue(gap, breakpoint, 4);

  return (
    <div
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gapValue * 0.25}rem`,
      }}
    >
      {children}
    </div>
  );
};

export const GridCell: FC<GridCellProps> = ({
  span = 1,
  children,
  className = "",
}) => {
  const breakpoint = useBreakpoint();
  const columnSpan = resolveResponsiveValue(span, breakpoint, 1);

  return (
    <div
      className={className}
      style={{
        gridColumn: `span ${columnSpan}`,
      }}
    >
      {children}
    </div>
  );
};

Grid.Cell = GridCell;
