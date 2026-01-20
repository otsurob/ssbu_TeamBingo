import { Button, Card, CardBody, CardFooter, CardHeader, Text } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { ResponsePlayer } from '../../../types/restAPIResponse';
import TeamSelection from './TeamSelection';
import { isBingoExisting, isPlayerExisting, isRoomExisting } from '../../../services/existing';
import { createBingo } from '../../../api/bingoAPIs';
import { dividePlayers, leavePlayer, updatePlayerTeam } from '../../../api/playerAPIs';
import { deleteRoom as deleteRoomAPI } from '../../../api/roomAPIs';
import { useAppToast } from '../../../hooks/useAppToast';
import { DeleteButton } from '../../../components/CustomButton';

type RoomCardProps = {
  players: ResponsePlayer[];
  name: string;
  isRoomSetting: boolean;
  onToggleRoomSetting: () => void;
};

const RoomCard = ({ players, name, isRoomSetting, onToggleRoomSetting }: RoomCardProps) => {
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

  const handleChangeTeam = async (team: number) => {
    if (!window.confirm('チームを変更しますか？')) return;
    if (!room || !name) return;
    await updatePlayerTeam(room, name, team);
  };

  const handleDeletePlayer = async (targetName: string) => {
    if (!window.confirm('このプレイヤーを削除しますか？')) return;
    if (room) {
      await leavePlayer(room, targetName);
    }
    if (targetName === name) {
      navigate(`/lobby?name=${name}`);
    }
  };

  const leaveRoom = async () => {
    if (!window.confirm('部屋を抜けますか？')) return;
    if (room && (await isPlayerExisting(room, name))) {
      await leavePlayer(room, name);
    }
    navigate(`/lobby?name=${name}`);
  };

  const deleteRoom = async () => {
    if (!window.confirm('部屋を解散しますか？')) return;
    if (room && (await isRoomExisting(room))) {
      await deleteRoomAPI(room);
    }
    navigate(`/lobby?name=${name}`);
  };

  if (!name || !room) {
    return <></>;
  }

  return (
    <Card.Root>
      <CardHeader display="flex" flexDir="row" justifyContent="space-between" gap={2}>
        <Text textStyle="xl" fontWeight="bold">
          ゲーム開始前です！
        </Text>
        <Button variant="outline" onClick={onToggleRoomSetting}>
          {isRoomSetting ? '戻る' : '設定'}
        </Button>
        {/* <ChangeNameDialog name={name} room={room} /> */}
        {/* <RoomSettings players={players} /> */}
      </CardHeader>
      <CardBody gap="5">
        <Button onClick={startGame}>ゲーム開始</Button>
        <Button onClick={randomTeam}>ランダムチーム振り分け</Button>
        <TeamSelection
          players={players}
          name={name}
          onChangeTeam={handleChangeTeam}
          onDeletePlayer={handleDeletePlayer}
        />
      </CardBody>
      <CardFooter display="flex" justifyContent="space-between" gap={2}>
        <Button onClick={leaveRoom}>退出</Button>
        <DeleteButton onClick={deleteRoom} />
      </CardFooter>
    </Card.Root>
  );
};

export default RoomCard;
