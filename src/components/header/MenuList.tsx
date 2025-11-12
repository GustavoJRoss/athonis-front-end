import { MenuIcon, UsersIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../../components/ui/navigation-menu";
import { useRouter } from "next/navigation";

export default function MenuList() {
  const router = useRouter();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-emerald-600 hover:bg-emerald-600">
            <MenuIcon className="stroke-white hover:stroke-emerald-600" />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink onClick={() => router.push("/clients")}>
              <div className="flex space-x-2 items-center">
                <UsersIcon />
                <span>Clientes</span>
              </div>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
