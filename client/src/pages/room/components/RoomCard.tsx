import { Button, Card, CardBody, CardFooter, CardHeader, Text } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import type { ResponsePlayer } from '../../../types/restAPIResponse';
import ChangeNameDialog from './ChangeNameDialog';
import RoomSettings from '../../../components/RoomSettings';
import TeamSelection from './TeamSelection';
import { toaster } from '../../../components/ui/toaster';
import { isBingoExisting, isPlayerExisting, isRoomExisting } from '../../../services/existing';
import { createBingo } from '../../../api/bingoAPIs';
import { dividePlayers, joinPlayer, leavePlayer, updatePlayerTeam } from '../../../api/playerAPIs';
import { deleteRoom as deleteRoomAPI } from '../../../api/roomAPIs';
import DeleteButton from '../../../components/DeleteButton';

type RoomCardProps = {
  players: ResponsePlayer[];
  name: string;
};

const RoomCard = ({ players, name }: RoomCardProps) => {
  const [searchParams] = useSearchParams();
  const room = searchParams.get('room');
  const navigate = useNavigate();
  const [newName, setNewName] = useState<string>('');

  const showToast = (title: string) => {
    toaster.create({
      title,
      type: 'error',
      closable: true,
    });
  };

  const startGame = async () => {
    if (!room) return;
    if (!(await isRoomExisting(room))) {
      showToast('部屋が存在しません');
      return;
    }
    if (await isBingoExisting(room)) {
      showToast('ゲームは開始されています！画面をリロードしてください！');
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

  const changeName = async () => {
    if (newName.length > 20) {
      showToast('名前が長すぎます！');
      return;
    }
    if (name && room) {
      await leavePlayer(room, name);
    }
    if (room) {
      await joinPlayer(room, newName, 2);
    }
    navigate(`/preGame?name=${newName}&room=${room}`);
    window.location.reload();
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

  return (
    <Card.Root>
      <CardHeader display="flex" flexDir="row" justifyContent="space-between" gap={2}>
        <Text textStyle="xl" fontWeight="bold">
          ゲーム開始前です！
        </Text>
        <ChangeNameDialog
          newName={newName}
          onChangeNameInput={(val) => setNewName(val)}
          onSubmit={changeName}
        />
        <RoomSettings players={players} />
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
