"use client";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Undo2Icon } from "lucide-react";
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
      />
    </Tooltip>
  );
}
