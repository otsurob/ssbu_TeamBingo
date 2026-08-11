// 部屋の削除, プレイヤーの削除, プレイヤー名変更などを行うDialogを展開
//今使ってません!!!

import { Button, CloseButton, Container, Dialog, Portal } from '@chakra-ui/react';
import type { ResponsePlayer } from '../../../types/restAPIResponse';
import NameBar from '../../../components/NameBar';
import { DeleteButton, ExitButton, RenameButton } from '../../../components/CustomButton';

type RoomSettingsProps = {
  players: ResponsePlayer[];
};

const RoomSettings = ({ players }: RoomSettingsProps) => {
  const handleDeleteRoom = () => {
    return;
  };
  const handleDeletePlayer = () => {
    return;
  };
  const handleExitRoom = () => {
    return;
  };
  const handleRename = () => {
    return;
  };
  return (
    <Dialog.Root placement="center" motionPreset="slide-in-bottom" modal={true}>
      <Dialog.Trigger asChild>
        <Button w="100px">設定</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>設定</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Container gap={5}>
                {players.map((p) => (
                  <Container
                    display="flex"
                    flexDir="row"
                    justifyContent="space-between"
                    gap={3}
                    key={p.id}
                  >
                    <NameBar name={p.name} truncateAt={20} />
                    <DeleteButton onClick={handleDeletePlayer} />
                  </Container>
                ))}
              </Container>
            </Dialog.Body>
            <Dialog.Footer>
              {/* <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger> */}
              <Container display="flex" flexDir="row" justifyContent="space-between" gap={3}>
                <ExitButton onClick={handleExitRoom} />
                <RenameButton onClick={handleRename} />
                <DeleteButton onClick={handleDeleteRoom} />
              </Container>
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

export default RoomSettings;
