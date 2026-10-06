import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type MacbookFrameProps = {
  children: ReactNode;
  className?: string;
  /** Aplica leve rotação 3D — a seção que usa o frame decide quando animar isso. */
  tilt?: boolean;
};

/** Moldura decorativa de MacBook em CSS puro — sem asset de imagem, só tokens do design system. */
export function MacbookFrame({
  children,
  className,
  tilt = false,
}: MacbookFrameProps) {
  return (
    <div
      className={cn(
        "w-full",
        tilt && "[transform:perspective(1400px)_rotateX(6deg)_rotateY(-8deg)]",
        className,
      )}
    >
      <div className="border-border-subtle bg-foreground shadow-overlay rounded-2xl border p-2 sm:p-3">
        <div className="flex items-center justify-center pb-1.5">
          <span className="bg-background/40 size-1.5 rounded-full" />
        </div>
        <div className="bg-surface aspect-[16/10] overflow-hidden rounded-md">
          {children}
        </div>
      </div>
      <div className="border-border-subtle bg-surface-muted mx-auto h-2.5 w-[88%] rounded-b-xl border-x border-b sm:h-3" />
      <div className="bg-border mx-auto h-1 w-2/5 rounded-b-full" />
    </div>
  );
}
