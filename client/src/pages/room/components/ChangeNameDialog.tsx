import { Button, CloseButton, Dialog, Input, Portal } from '@chakra-ui/react';

type ChangeNameDialogProps = {
  newName: string;
  onChangeNameInput: (value: string) => void;
  onSubmit: () => void;
};

const ChangeNameDialog = ({ newName, onChangeNameInput, onSubmit }: ChangeNameDialogProps) => {
  return (
    <Dialog.Root placement="center" motionPreset="slide-in-bottom" modal={true}>
      <Dialog.Trigger asChild>
        <Button colorPalette="orange">名前を変更</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>新しい名前を入力してください</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Input
                type="text"
                value={newName}
                onChange={(e) => onChangeNameInput(e.target.value)}
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={onSubmit}>Enter</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="md" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ChangeNameDialog;
