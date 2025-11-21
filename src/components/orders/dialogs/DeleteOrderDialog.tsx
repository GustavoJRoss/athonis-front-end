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
import { deleteOrder } from "@/src/lib/orders/requests";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

type DeleteOrderDialogProps = {
  onSubmitSuccess: () => void;
};

export const DeleteOrderDialog = forwardRef<any, DeleteOrderDialogProps>(
  (props, ref) => {
    const { onSubmitSuccess } = props;

    const orderIdRef = useRef<number>(-1);
    const { successToast, errorToast } = useToast();

    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const dialogButtonRef = useRef<HTMLButtonElement>(null);

    const handleDeleteOrder = async () => {
      setLoading(true);

      const deleteResponse = await deleteOrder({ id: orderIdRef.current });
      setLoading(false);
      if (deleteResponse?.success) {
        dialogButtonRef.current?.click();
        successToast("Pedido deletado com sucesso!");
        onSubmitSuccess();
        return;
      }

      errorToast(
        deleteResponse?.message || "Erro ao deletar pedido. Tente novamente."
      );
      console.error(deleteResponse);
    };

    useImperativeHandle(ref, () => ({
      open: (id: number) => {
        orderIdRef.current = id;
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
            <p>Você tem certeza que você quer deletar este pedido?</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button ref={dialogButtonRef} variant={"outline"}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={handleDeleteOrder}
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
