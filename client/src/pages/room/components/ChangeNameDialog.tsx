import { Button, CloseButton, Dialog, Input, Portal } from '@chakra-ui/react';
import { useState } from 'react';
import { useAppToast } from '../../../hooks/useAppToast';
import { updatePlayerName } from '../../../api/playerAPIs';
import { useNavigate } from 'react-router-dom';
import { RenameButton } from '../../../components/CustomButton';

type ChangeNameDialogProps = {
  name: string;
  room: string;
};

// { newName, onChangeNameInput, onSubmit }: ChangeNameDialogProps)

const ChangeNameDialog = ({ name, room }: ChangeNameDialogProps) => {
  const [newName, setNewName] = useState<string>('');
  const { showError } = useAppToast();
  const navigate = useNavigate();

  const changeName = async () => {
    if (newName.length > 20) {
      showError('名前が長すぎます！');
      return;
    }
    if (name && room) {
      await updatePlayerName(room, name, newName);
    }
    navigate(`/preGame?name=${newName}&room=${room}`);
    window.location.reload();
  };

  return (
    <Dialog.Root placement="center" motionPreset="slide-in-bottom" modal={true}>
      <Dialog.Trigger asChild>
        {/* <Button colorPalette="orange">名前を変更</Button> */}
        <RenameButton />
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>プレイヤーネームの変更</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              新しい名前を入力してください
              <Input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={changeName}>Enter</Button>
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
