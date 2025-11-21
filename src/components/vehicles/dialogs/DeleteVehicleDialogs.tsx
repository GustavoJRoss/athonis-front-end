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
import { deleteVehicle } from "@/src/lib/vehicles/requests";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

type DeleteVehicleDialogProps = {
  onSubmitSuccess: () => void;
};

export const DeleteVehicleDialog = forwardRef<any, DeleteVehicleDialogProps>(
  (props, ref) => {
    const { onSubmitSuccess } = props;

    const vehicleIdRef = useRef<number>(-1);
    const { successToast, errorToast } = useToast();

    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const dialogButtonRef = useRef<HTMLButtonElement>(null);

    const handleDeleteVehicle = async () => {
      setLoading(true);

      const deleteResponse = await deleteVehicle({ id: vehicleIdRef.current });
      setLoading(false);
      if (deleteResponse?.success) {
        dialogButtonRef.current?.click();
        successToast("Veículo deletado com sucesso!");
        onSubmitSuccess();
        return;
      }

      errorToast(
        deleteResponse?.message || "Erro ao deletar veículo. Tente novamente."
      );
      console.error(deleteResponse);
    };

    useImperativeHandle(ref, () => ({
      open: (id: number) => {
        vehicleIdRef.current = id;
        setShowDialog(true);
      },
    }));

    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar Veículo</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col">
            <p>Você tem certeza que você quer deletar este veículo?</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button ref={dialogButtonRef} variant={"outline"}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={handleDeleteVehicle}
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
