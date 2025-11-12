import { HelpCircleIcon, LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { BackToButton } from "./BackToButton";

interface HeaderPageProps {
  title: string;
  help?: ReactNode;
  icon?: LucideIcon;
  action?: ReactNode;
  backTo?: {
    link: string;
    title?: string;
  };
}

export default function HeaderPage({
  title,
  icon,
  action,
  backTo,
}: HeaderPageProps) {
  const Icon = icon;

  return (
    <div className="flex justify-between flex-nowrap border-b-2 border-emerald-600 dark:border-emerald-700 h-12 !mt-0">
      <div className=" flex mb-1 mx-2 space-x-2 items-center flex-nowrap">
        {Icon && (
          <Icon
            className="icon-md stroke-emerald-600 dark:stroke-emerald-emerald-200"
            strokeWidth={2.5}
          />
        )}
        <h1 className="inline-flex space-x-1 text-nowrap text-3xl text-emerald-600  dark:text-emerald-200">
          {title}
        </h1>
      </div>
      <div className="justify-end space-x-1">
        {action}
        {backTo && <BackToButton {...backTo} />}
      </div>
    </div>
  );
}
