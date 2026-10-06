import { cn } from "@/lib/utils/cn";

export type PlaceholderImageProps = {
  label: string;
  className?: string;
};

/**
 * Bloco tracejado para espaços de imagem/logo sem asset real ainda.
 * TODO(asset): substituir por `next/image` real quando o material chegar.
 */
export function PlaceholderImage({ label, className }: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "border-border bg-surface-muted text-caption text-muted flex items-center justify-center rounded-md border border-dashed px-3 py-2 text-center",
        className,
      )}
    >
      {label}
    </div>
  );
}
