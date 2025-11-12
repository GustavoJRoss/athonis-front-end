"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type HomePageCardsProps = {
  route: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function HomePageCards({
  description,
  icon,
  route,
  title,
}: HomePageCardsProps) {
  const Icon = icon;

  const router = useRouter();

  return (
    <Card
      className="cursor-pointer shadow-md hover:scale-[102%] transition-all duration-300"
      onClick={() => router.push(route)}
    >
      <CardContent>
        <div className="flex flex-nowrap gap-6 items-center justify-between">
          <div className="flex flex-col gap-2 w-2/3">
            <CardTitle className="text-2xl text-emerald-600 text-nowrap">
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Icon size={32} className="stroke-emerald-600" />
        </div>
      </CardContent>
    </Card>
  );
}
