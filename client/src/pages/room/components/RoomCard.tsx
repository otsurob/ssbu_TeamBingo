import { Button, Card, CardBody, CardHeader, Text } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { ResponsePlayer } from '../../../types/restAPIResponse';
import { isBingoExisting, isRoomExisting } from '../../../services/existing';
import { createBingo } from '../../../api/bingoAPIs';
import { dividePlayers } from '../../../api/playerAPIs';
import { useAppToast } from '../../../hooks/useAppToast';
import { SettingButton } from '../../../components/CustomButton';

type RoomCardProps = {
  players: ResponsePlayer[];
  name: string;
  onToggleRoomSetting: () => void;
};

const RoomCard = ({ players, name, onToggleRoomSetting }: RoomCardProps) => {
  const [searchParams] = useSearchParams();
  const room = searchParams.get('room');
  const navigate = useNavigate();
  // const [newName, setNewName] = useState<string>('');
  const { showError } = useAppToast();

  const startGame = async () => {
    if (!room) return;
    if (!(await isRoomExisting(room))) {
      showError('部屋が存在しません');
      return;
    }
    if (await isBingoExisting(room)) {
      showError('ゲームは開始されています！画面をリロードしてください！');
      return;
    }
    await createBingo(room);
    navigate(`/game?name=${name}&room=${room}`);
  };

  const randomTeam = async () => {
    if (!window.confirm('チームをランダムに振り分けます')) return;
    if (!room) return;
    await dividePlayers(room);
  };

  if (!name || !room) {
    return <></>;
  }

  return (
    <Card.Root w="40vw">
      <CardHeader display="flex" flexDir="row" justifyContent="space-between" gap={2}>
        <Text textStyle="xl" fontWeight="bold">
          ゲーム開始前です！
        </Text>
        <SettingButton onClick={onToggleRoomSetting} />
        {/* <ChangeNameDialog name={name} room={room} /> */}
        {/* <RoomSettings players={players} /> */}
      </CardHeader>
      <CardBody gap="5">
        <Button onClick={startGame}>ゲーム開始</Button>
        <Button onClick={randomTeam}>ランダムチーム振り分け</Button>
        {/* <TeamSelection
          players={players}
          name={name}
          onChangeTeam={handleChangeTeam}
          onDeletePlayer={handleDeletePlayer}
        /> */}
      </CardBody>
    </Card.Root>
  );
};

export default RoomCard;
