import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { useState } from 'react';
import type { ReactNode } from 'react';

type AlertDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  trigger?: ReactNode;
  buttonTitle?: string;
  confirmLabel?: string;
  confirmColor?: string;
  cancelLabel?: string;
};

const AlertDialog = ({
  title,
  message,
  onConfirm,
  trigger,
  buttonTitle = 'Open',
  confirmLabel = 'Delete',
  confirmColor = 'red',
  cancelLabel = 'Cancel',
}: AlertDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setOpen(false);
  };

  return (
    <Dialog.Root role="alertdialog" open={open} onOpenChange={(details) => setOpen(details.open)}>
      <Dialog.Trigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            {buttonTitle}
          </Button>
        )}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>{message}</Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{cancelLabel}</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette={confirmColor} onClick={handleConfirm}>
                {confirmLabel}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AlertDialog;
