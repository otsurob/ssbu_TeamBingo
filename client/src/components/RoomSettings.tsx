// 部屋の削除, プレイヤーの削除, プレイヤー名変更などを行うDialogを展開

import { Button, CloseButton, Container, Dialog, Portal } from '@chakra-ui/react';
import type { ResponsePlayer } from '../types/restAPIResponse';
import NameBar from './NameBar';
import DeleteButton from './DeleteButton';

type RoomSettingsProps = {
  players: ResponsePlayer[];
};

const RoomSettings = ({ players }: RoomSettingsProps) => {
  const handleDeleteRoom = () => {
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
              <Dialog.Title>部屋の設定</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Container gap={5}>
                {players.map((p) => (
                  <Container display="flex" flexDir="row" justifyContent="space-between" gap={3}>
                    <NameBar name={p.name} />
                    <Button>削除</Button>
                  </Container>
                ))}
              </Container>
            </Dialog.Body>
            <Dialog.Footer>
              {/* <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger> */}
              <Container display="flex" flexDir="row" justifyContent="space-between" gap={3}>
                <Button>部屋から退出</Button>
                <Button>自分の名前を変更</Button>
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
