"use client";

import { HomeIcon, MenuIcon, UserIcon } from "lucide-react";
import { IconAction } from "../utils/IconAction";
import MenuList from "./MenuList";
import { Input } from "../../../components/ui/input";
import { useRouter } from "next/navigation";

export default function PrivateHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between p-4 bg-emerald-600">
      <div className="flex flex-nowrap gap-4 items-center">
        <MenuList />
        <HomeIcon
          className="stroke-white hover:scale-[102%] transition-all duration-200 cursor-pointer"
          onClick={() => router.push("/home")}
        />
        <h1 className="text-lg text-white">Fort Acessórios para móveis</h1>
      </div>
      <IconAction
        icon={UserIcon}
        text="Perfil"
        className="stroke-white hover:stroke-"
      />
    </div>
  );
}
