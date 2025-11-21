import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/useToast";
import { deleteDriver } from "@/src/lib/drivers/requests";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

type DeleteDriverDialogProps = {
  onSubmitSuccess: () => void;
};

export const DeleteDriverDialog = forwardRef<any, DeleteDriverDialogProps>(
  (props, ref) => {
    const { onSubmitSuccess } = props;

    const driverIdRef = useRef<number>(-1);
    const { successToast, errorToast } = useToast();

    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const dialogButtonRef = useRef<HTMLButtonElement>(null);

    const handleDeleteClient = async () => {
      setLoading(true);

      const deleteResponse = await deleteDriver({ id: driverIdRef.current });
      setLoading(false);
      if (deleteResponse?.success) {
        dialogButtonRef.current?.click();
        successToast("Motorista deletado com sucesso!");
        onSubmitSuccess();
        return;
      }

      errorToast(
        deleteResponse?.message || "Erro ao deletar motorista. Tente novamente."
      );
      console.error(deleteResponse);
    };

    useImperativeHandle(ref, () => ({
      open: (id: number) => {
        driverIdRef.current = id;
        setShowDialog(true);
      },
    }));

    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col">
            <p>Você tem certeza que você quer deletar este motorista?</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button ref={dialogButtonRef} variant={"outline"}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={handleDeleteClient}
              className="bg-red-500 hover:bg-red-800"
              loading={loading}
            >
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
