import { LucideIcon } from "lucide-react";
import { forwardRef, type MouseEvent, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Tooltip } from "../../../components/ui/tooltip";

type IconActionProps = {
  icon: LucideIcon;
  text: ReactNode;
  onClick?: (e: MouseEvent<SVGElement>) => void;
  className?: string;
  disabled?: boolean;
};

export const IconAction = forwardRef<SVGSVGElement, IconActionProps>(
  ({ icon: Icon, text, onClick, className, disabled }, ref) => {
    return (
      <Tooltip text={text}>
        <Icon
          ref={ref}
          onClick={(e) => {
            e.stopPropagation();
            if (onClick && !disabled) {
              onClick(e);
            }
          }}
          className={twMerge(
            "icon-sm",
            disabled ? "stroke-neutral-200" : "stroke-neutral-400",
            disabled ? "" : "hover:stroke-neutral-900",
            "cursor-pointer",
            className
          )}
          strokeWidth={2}
        />
      </Tooltip>
    );
  }
);
