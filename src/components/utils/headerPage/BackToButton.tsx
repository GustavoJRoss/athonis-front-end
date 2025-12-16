"use client";

import { Button, Tooltip } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface BackToButtonProps {
  link: string;
  title?: string;
}

export function BackToButton({ link, title }: BackToButtonProps) {
  const router = useRouter();
  return (
    <Tooltip title={title || ""}>
      <Button
        onClick={() => router.push(link)}
        className="mb-1"
        size="large"
        type="link"
        tabIndex={-1}
        icon={<ArrowLeftOutlined className="!text-emerald-600" />}
      />
    </Tooltip>
  );
}
