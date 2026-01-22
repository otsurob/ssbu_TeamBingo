import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type AlertDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  trigger?: ReactNode;
  buttonTitle?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

const AlertDialog = ({
  title,
  message,
  onConfirm,
  trigger,
  buttonTitle = 'Open',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
}: AlertDialogProps) => {
  return (
    <Dialog.Root role="alertdialog">
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
              <Button colorPalette="red" onClick={onConfirm}>
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
