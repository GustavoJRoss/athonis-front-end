"use client";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Redo2Icon, Undo2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackToButtonProps {
  link: string;
  title?: string;
}

export function BackToButton({ link, title }: BackToButtonProps) {
  const router = useRouter();
  return (
    <Tooltip text={title || ""}>
      <Button
        onClick={() => router.push(link)}
        className="mb-1"
        variant="ghost"
        tabIndex={-1}
      >
        <Redo2Icon className="stroke-emerald-500 rotate-180" />
      </Button>
    </Tooltip>
  );
}
