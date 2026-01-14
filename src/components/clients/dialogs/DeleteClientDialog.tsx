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
import { Modal } from "antd";
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
      <Modal
        open={showDialog}
        onCancel={() => setShowDialog(false)}
        onOk={handleDeleteClient}
        okText="Deletar"
        okButtonProps={{ danger: true, loading }}
        cancelText="Cancelar"
      >
        <h2 className="mb-4 text-lg font-semibold">Delete Client</h2>
        <div className="flex flex-col">
          <p>Você tem certeza que você quer deletar este cliente?</p>
        </div>
      </Modal>
    );
  }
);
