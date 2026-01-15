import { Button, CloseButton, Dialog, Input, Portal, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toaster } from '../../../components/ui/toaster';
import { createRoom, fetchRoom } from '../../../api/roomAPIs';
import { joinPlayer } from '../../../api/playerAPIs';

type MakeRoomDialogProps = {
  name: string;
};

const MakeRoomDialog = ({ name }: MakeRoomDialogProps) => {
  const [newRoom, setNewRoom] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const navigate = useNavigate();
  const showToast = (title: string) => {
    toaster.create({
      title: title,
      type: 'error',
      closable: true,
      // placement: "top",
    });
  };
  const makeRoom = async () => {
    if (!newRoom || !newPassword) {
      showToast('入力内容が不正です');
      return;
    }
    const RoomRes = await fetchRoom(newRoom);
    console.log(RoomRes);
    // 部屋名が存在しない場合は空文字列が返る
    if (RoomRes.room_name !== '') {
      showToast('同名の部屋が存在します');
      return;
    }
    await createRoom(newRoom, newPassword);
    if (name) {
      await joinPlayer(newRoom, name, 2);
    }
    navigate(`/preGame?name=${name}&room=${newRoom}`);
  };
  return (
    <Dialog.Root placement="center" motionPreset="slide-in-bottom" modal={true}>
      <Dialog.Trigger asChild>
        <Button w="100px">部屋を作成</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>部屋を作成</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text textStyle="lg">部屋名</Text>
              <Input type="text" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} />
              <Text textStyle="lg">パスワード</Text>
              <Input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={makeRoom}>Enter</Button>
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

export default MakeRoomDialog;
