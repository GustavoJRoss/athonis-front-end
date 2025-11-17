import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogFooter as ShadFooter,
} from "@/components/ui/dialog";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export const DialogFooter = forwardRef<any, any>((_, ref) => {
  const [loading, setLoading] = useState(false);

  const closeRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(ref, () => ({
    close: () => closeRef.current?.click(),
    setLoading: (value: boolean) => setLoading(value),
  }));
  return (
    // <div className="flex justify-end">
    //   <div>
    //     <Button type="submit">Salvar</Button>
    //   </div>
    // </div>
    <ShadFooter className="flex justify-end gap-2">
      <DialogClose ref={closeRef} asChild>
        <Button>Cancelar</Button>
      </DialogClose>
      <Button type="submit" loading={loading}>
        Salvar
      </Button>
    </ShadFooter>
  );
});
