import { ReactNode } from "react";

interface FieldsetProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Fieldset({ title, children, className = "" }: FieldsetProps) {
  return (
    <div className="relative border border-gray-300 rounded p-4 pt-6 mt-2">
      <span className="absolute font-semibold -top-4 left-3 bg-white px-2 text-lg text-gray-700">
        {title}
      </span>

      {children}
    </div>
  );
}
