"use client";

import { MenuIcon, UserIcon } from "lucide-react";
import { IconAction } from "../utils/IconAction";
import MenuList from "./MenuList";
import { Input } from "../../../components/ui/input";

export default function PrivateHeader() {
  return (
    <div className="flex items-center justify-between p-4 bg-emerald-600">
      <MenuList />
      <Input className="max-w-md" placeholder="Pesquisar pedido, cliente...." />
      <IconAction
        icon={UserIcon}
        text="Perfil"
        className="stroke-white hover:stroke-"
      />
    </div>
  );
}
