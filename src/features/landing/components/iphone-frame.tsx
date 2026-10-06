import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type IphoneFrameProps = {
  children: ReactNode;
  className?: string;
  /** Aplica leve rotação 3D — a seção que usa o frame decide quando animar isso. */
  tilt?: boolean;
};

/** Moldura decorativa de iPhone em CSS puro — sem asset de imagem, só tokens do design system. */
export function IphoneFrame({
  children,
  className,
  tilt = false,
}: IphoneFrameProps) {
  return (
    <div
      className={cn(
        "border-foreground bg-foreground shadow-overlay aspect-[9/19.5] w-full max-w-64 overflow-hidden rounded-2xl border-8",
        tilt && "[transform:perspective(1200px)_rotateX(4deg)_rotateY(10deg)]",
        className,
      )}
    >
      <div className="bg-surface relative h-full w-full overflow-hidden rounded-xl">
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-2">
          <span className="bg-foreground h-5 w-20 rounded-full" />
        </div>
        <div className="h-full w-full overflow-hidden pt-8">{children}</div>
        <div className="absolute inset-x-0 bottom-1.5 z-10 flex justify-center">
          <span className="bg-foreground/20 h-1 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
