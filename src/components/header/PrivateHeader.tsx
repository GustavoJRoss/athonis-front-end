"use client";

import { HomeIcon, UserIcon } from "lucide-react";
import { IconAction } from "../utils/IconAction";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MenuList } from "./MenuList";

export default function PrivateHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between p-4 bg-emerald-600">
      <div className="flex flex-nowrap gap-4 items-center">
        <MenuList />
        {/* <HomeIcon
          className="stroke-white hover:scale-[102%] transition-all duration-200 cursor-pointer"
          onClick={() => router.push("/home")}
        /> */}
        <Image
          height={50}
          width={50}
          alt="Forte logo"
          src={"/FORTE.png"}
          className="rounded border-2 border-emerald-800"
          onClick={() => router.push("/home")}
        />
        <h1 className="text-lg text-white font-semibold">
          Forte Acessórios para Moveis
        </h1>
      </div>
      <IconAction
        icon={UserIcon}
        text="Perfil"
        className="stroke-white hover:stroke-"
      />
    </div>
  );
}
