import { AvatarFallback, AvatarImage, AvatarRoot } from "@ark-ui/react";
import { cn } from "@/lib/utils/cn";

const SIZE = {
  sm: "size-8 text-caption",
  md: "size-10 text-body-sm",
  lg: "size-12 text-body",
} as const;
export type AvatarSize = keyof typeof SIZE;

export type AvatarProps = {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("");
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  return (
    <AvatarRoot
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-medium text-primary select-none",
        SIZE[size],
        className,
      )}
    >
      {src && <AvatarImage src={src} alt={name} className="size-full object-cover" />}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </AvatarRoot>
  );
}
