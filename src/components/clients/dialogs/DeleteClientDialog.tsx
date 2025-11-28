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
import { deleteClient } from "@/src/lib/clients/requests";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

type DeleteClientDialogProps = {
  onSubmitSuccess: () => void;
};

export const DeleteClientDialog = forwardRef<any, DeleteClientDialogProps>(
  (props, ref) => {
    const { onSubmitSuccess } = props;

    const clientIdRef = useRef<number>(-1);
    const { successToast, errorToast } = useToast();

    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const dialogButtonRef = useRef<HTMLButtonElement>(null);

    const handleDeleteClient = async () => {
      setLoading(true);

      const deleteResponse = await deleteClient({ id: clientIdRef.current });
      console.log({ deleteResponse, clientIdRef: clientIdRef.current });
      setLoading(false);
      if (deleteResponse?.success) {
        dialogButtonRef.current?.click();
        successToast("Cliente deletado com sucesso!");
        onSubmitSuccess();
        return;
      }

      errorToast(
        deleteResponse?.message || "Erro ao deletar cliente. Tente novamente."
      );
      console.error(deleteResponse);
    };

    useImperativeHandle(ref, () => ({
      open: (id: number) => {
        clientIdRef.current = id;
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
            <p>Você tem certeza que você quer deletar este cliente?</p>
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
