import { Card, CardBody, CardFooter, CardHeader, Container, Stack, Text } from '@chakra-ui/react';
import type { ResponsePlayer } from '../../../types/restAPIResponse';
import NameBar from '../../../components/NameBar';
import { DeleteButton, ExitButton, ReturnButton } from '../../../components/CustomButton';
import ChangeNameDialog from './ChangeNameDialog';
import AlertDialog from '../../../components/AlertDialog';
import { useNavigate } from 'react-router-dom';
import { deleteRoom } from '../../../api/roomAPIs';
import { leavePlayer } from '../../../api/playerAPIs';

type RoomSettingCardProps = {
  name: string;
  me: ResponsePlayer | undefined;
  room: string;
  players: ResponsePlayer[];
  onToggleRoomSetting: () => void;
};

const RoomSettingCard = ({
  name,
  me,
  room,
  players,
  onToggleRoomSetting,
}: RoomSettingCardProps) => {
  const navigate = useNavigate();
  const handleDeleteRoom = async () => {
    await deleteRoom(room);
    navigate(`/lobby?name=${name}`);
    return;
  };
  const handleDeletePlayer = async (player: string) => {
    await leavePlayer(room, player);
    return;
  };
  const handleExitRoom = async () => {
    await leavePlayer(room, name);
    navigate(`/lobby?name=${name}`);
    return;
  };
  return (
    <Card.Root w="350px">
      <CardHeader display="flex" flexDir="row" justifyContent="space-between" gap={2}>
        <Text textStyle="xl" fontWeight="bold">
          部屋の設定を行えます
        </Text>
        <ReturnButton onClick={onToggleRoomSetting} />
      </CardHeader>
      <CardBody gap="5">
        <Stack>
          {players.map((p) => (
            <Container
              display="flex"
              flexDir="row"
              justifyContent="space-between"
              gap={2}
              key={p.id}
            >
              <NameBar name={p.name} myName={me?.name} truncateAt={20} />
              <AlertDialog
                trigger={<DeleteButton />}
                title="プレイヤーを削除しますか？"
                message={`${p.name} さんを部屋から削除します。`}
                confirmLabel="削除"
                cancelLabel="キャンセル"
                onConfirm={() => handleDeletePlayer(p.name)}
              />
            </Container>
          ))}
        </Stack>
      </CardBody>
      <CardFooter display="flex" justifyContent="space-between" gap={2}>
        <Container display="flex" flexDir="row" justifyContent="space-between" gap={3}>
          <AlertDialog
            trigger={<ExitButton />}
            title="部屋から退出しますか？"
            message="部屋から退出します。部屋自体は残ります。"
            confirmLabel="退出する"
            cancelLabel="キャンセル"
            onConfirm={handleExitRoom}
          />
          <ChangeNameDialog name={name} room={room} />
          <AlertDialog
            trigger={<DeleteButton />}
            title="部屋を削除しますか？"
            message="この部屋を完全に削除します。"
            confirmLabel="削除する"
            cancelLabel="キャンセル"
            onConfirm={handleDeleteRoom}
          />
        </Container>
      </CardFooter>
    </Card.Root>
  );
};

export default RoomSettingCard;
