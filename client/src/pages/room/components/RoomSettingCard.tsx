import { Button, Card, CardBody, CardFooter, CardHeader, Container, Text } from '@chakra-ui/react';
import type { ResponsePlayer } from '../../../types/restAPIResponse';
import NameBar from '../../../components/NameBar';
import { DeleteButton, ExitButton } from '../../../components/CustomButton';
import ChangeNameDialog from './ChangeNameDialog';

type RoomSettingCardProps = {
  name: string;
  room: string;
  players: ResponsePlayer[];
  isRoomSetting: boolean;
  onToggleRoomSetting: () => void;
};

const RoomSettingCard = ({
  name,
  room,
  players,
  isRoomSetting,
  onToggleRoomSetting,
}: RoomSettingCardProps) => {
  const handleDeleteRoom = () => {
    return;
  };
  const handleDeletePlayer = () => {
    return;
  };
  const handleExitRoom = () => {
    return;
  };
  return (
    <Card.Root>
      <CardHeader display="flex" flexDir="row" justifyContent="space-between" gap={2}>
        <Text textStyle="xl" fontWeight="bold">
          部屋の設定を行えます
        </Text>
        <Button variant="outline" onClick={onToggleRoomSetting}>
          {isRoomSetting ? '戻る' : '設定'}
        </Button>
      </CardHeader>
      <CardBody gap="5">
        <Container gap={5}>
          {players.map((p) => (
            <Container
              display="flex"
              flexDir="row"
              justifyContent="space-between"
              gap={3}
              key={p.id}
            >
              <NameBar name={p.name} />
              <DeleteButton onClick={handleDeletePlayer} />
            </Container>
          ))}
        </Container>
      </CardBody>
      <CardFooter display="flex" justifyContent="space-between" gap={2}>
        <Container display="flex" flexDir="row" justifyContent="space-between" gap={3}>
          <ExitButton onClick={handleExitRoom} />
          <ChangeNameDialog name={name} room={room} />
          <DeleteButton onClick={handleDeleteRoom} />
        </Container>
      </CardFooter>
    </Card.Root>
  );
};

export default RoomSettingCard;
