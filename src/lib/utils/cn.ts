import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `tailwind-merge` não conhece a escala tipográfica semântica do projeto
 * (`text-display`, `text-heading-1`...) e, por padrão, agrupava essas classes
 * junto com utilities de cor de texto (`text-foreground`, `text-primary`...) —
 * as duas "competiam" pelo mesmo slot e só a última sobrevivia, fazendo todo
 * `<Heading>`/`<Text>` perder o tamanho de fonte sempre que uma cor era
 * passada depois. Registrar essas classes no grupo `font-size` resolve isso.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-display-lg",
        "text-display",
        "text-heading-1",
        "text-heading-2",
        "text-heading-3",
        "text-heading-4",
        "text-body-lg",
        "text-body",
        "text-body-sm",
        "text-caption",
        "text-label",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
