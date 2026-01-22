import { useCallback, useEffect, useRef, useState } from 'react';
import type { ResponseBingo, ResponsePlayer } from '../../types/restAPIResponse';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Container, Spinner, Stack } from '@chakra-ui/react';
import TeamArea from './components/TeamArea';
import { fetchBingos } from '../../api/bingoAPIs';
import { fetchPlayers } from '../../api/playerAPIs';
import GameStarted from './components/GameStarted';
import SpectatorArea from './components/SpectatorArea';
import type { wsEventType } from '../../types/websocketEvent';
import RoomCard from './components/RoomCard';
import { connectRoomWebSocket } from '../../hooks/websocket';
import { useAppToast } from '../../hooks/useAppToast';
import RoomSettingCard from './components/RoomSettingCard';

const PreGame = () => {
  const [bingos, setBingos] = useState<ResponseBingo[]>([]);
  const [players, setPlayers] = useState<ResponsePlayer[]>([]);

  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const room = searchParams.get('room');
  const navigate = useNavigate();
  const startedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const [locked, setLocked] = useState(false);
  const { showToast } = useAppToast();
  const [isRoomSetting, setIsRoomSetting] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!room) return;
      const [bingosRes, playersRes] = await Promise.all([fetchBingos(room), fetchPlayers(room)]);
      setBingos(bingosRes);
      setPlayers(playersRes);
    };
    fetchData();
  }, [room]);

  const handleWsEvent = useCallback(
    (msg: wsEventType) => {
      if (msg.type === 'player_team_updated') {
        const data = msg.data;
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === data.id
              ? {
                  ...p,
                  team: data.new_team,
                }
              : p,
          ),
        );
      } else if (msg.type === 'teams_shuffled') {
        const data = msg.data;
        setPlayers((prev) =>
          prev.map((p) => {
            const found = data.players.find((upd) => upd.id === p.id);
            return found ? { ...p, team: found.new_team } : p;
          }),
        );
      } else if (msg.type === 'game_started') {
        if (startedRef.current) return; // 二重発火ガード
        startedRef.current = true;
        setLocked(true);
        showToast({
          title: 'ゲームが開始されました！',
          description: '3秒後にゲーム画面へ移動します',
          type: 'success',
          duration: 3000,
        });
        timerRef.current = window.setTimeout(() => {
          navigate(`/game?name=${name}&room=${room}`, {
            replace: true,
          });
        }, 3000);
      } else if (msg.type === 'player_joined') {
        const data = msg.data;
        setPlayers((prev) => [...prev, data]);
      } else if (msg.type === 'player_left') {
        const data = msg.data;
        setPlayers((prev) => prev.filter((p) => p.name !== data.name));
      }
    },
    [name, navigate, room, showToast],
  );

  useEffect(() => {
    if (!room) return;
    const cleanup = connectRoomWebSocket(room, {
      onEvent: handleWsEvent,
      onError: () => {
        console.error('ws connection error');
      },
    });
    return cleanup;
  }, [handleWsEvent, room]);

  // console.log("bingos!", bingos);

  if (!room || !name) {
    navigate('/');
    return <></>;
  }

  const me = players.find((p) => p.name === name);
  // チームごとの名前一覧だけの変数を用意
  const teamAPlayerNames = players.filter((p) => p.team === 0).map((p) => p.name);
  const teamBPlayerNames = players.filter((p) => p.team === 1).map((p) => p.name);
  const spectatorNames = players.filter((p) => p.team === 2).map((p) => p.name);

  //meがundefinedのエラー回避のための応急処置
  // if (!me) {
  //   return <>Loading...</>;
  // }

  if (bingos.length === 0) {
    return <Spinner size="lg" />;
  }

  if (bingos[0].cell_reses && bingos[1].cell_reses) {
    return <GameStarted room={room} name={name} me={me} />;
  }

  return (
    <>
      {locked && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.600"
          zIndex="skipNav" // 1600: modal/popover等より上、toast(1700)より下 :contentReference[oaicite:2]{index=2}
          pointerEvents="auto" // 操作を吸い込む
        />
      )}
      <Container pt={20} centerContent w="350px">
        <Stack gap={5} display="flex" flexDir="column" alignItems="center">
          {isRoomSetting ? (
            <RoomSettingCard
              name={name}
              room={room}
              players={players}
              //ここで前の値と切り替える処理の関数を渡している。ただのset関数を渡しているわけではない
              onToggleRoomSetting={() => setIsRoomSetting((prev) => !prev)}
            />
          ) : (
            <RoomCard
              players={players}
              name={name}
              onToggleRoomSetting={() => setIsRoomSetting((prev) => !prev)}
            />
          )}
          <TeamArea teamNum={0} playerNames={teamAPlayerNames} me={me} />
          <TeamArea teamNum={1} playerNames={teamBPlayerNames} me={me} />
          <SpectatorArea spectatorNames={spectatorNames} me={me} />
        </Stack>
      </Container>
    </>
  );
};
export default PreGame;
