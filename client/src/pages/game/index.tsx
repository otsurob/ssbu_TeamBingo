import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import type { ResponseBingo, ResponsePlayer } from '../../types/restAPIResponse';
import { fetchBingos } from '../../api/bingoAPIs';
import { fetchPlayers } from '../../api/playerAPIs';
import { toaster } from '../../components/ui/toaster';
import GameEnded from './components/GameEnded';
import type { wsEventType } from '../../types/websocketEvent';
import { connectRoomWebSocket } from '../../hooks/websocket';
import GameBoard from './components/Game';

export default function Game() {
  const [bingos, setBingos] = useState<ResponseBingo[]>([]);
  const [players, setPlayers] = useState<ResponsePlayer[]>([]);
  const [searchParams] = useSearchParams();
  const [locked, setLocked] = useState(false);
  const room = searchParams.get('room');
  const name = searchParams.get('name');
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      // Defer to microtask to avoid flushSync warning on unmount
      queueMicrotask(() => toaster.dismiss());
    };
  }, []);

  useEffect(() => {
    if (!room) return;
    const fetchData = async () => {
      const [bingoRes, playerRes] = await Promise.all([fetchBingos(room), fetchPlayers(room)]);
      setBingos(bingoRes);
      setPlayers(playerRes);
    };

    fetchData();
  }, [room]);

  const handleWsEvent = useCallback(
    (msg: wsEventType) => {
      if (msg.type === 'cell_updated') {
        const data = msg.data;
        setBingos((prev) =>
          prev.map((b) =>
            b.id === data.bingo_id
              ? {
                  ...b,
                  cell_reses: b.cell_reses.map((c) =>
                    c.id === data.id ? { ...c, status: data.new_status } : c,
                  ),
                }
              : b,
          ),
        );
      } else if (msg.type === 'game_ended') {
        setLocked(true);
        toaster.create({
          title: 'ゲームが終了しました！',
          description: '右のボタンで準備画面に戻ってください',
          type: 'success',
          duration: Infinity,
          action: {
            label: '準備画面に戻る',
            onClick: () => navigate(`/preGame?name=${name}&room=${room}`),
          },
        });
      }
    },
    [name, navigate, room],
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

  if (!room || !name) {
    navigate('/');
    return;
  }

  if (bingos.length === 0 || players.length === 0) {
    return <div>Loading...</div>;
  }

  const team1Players: ResponsePlayer[] = [];
  const team2Players: ResponsePlayer[] = [];

  for (const player of players) {
    if (player.team === 0) {
      team1Players.push(player);
    } else if (player.team === 1) {
      team2Players.push(player);
    }
  }

  return (
    <div>
      {locked && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.600"
          zIndex="skipNav" // 1600: modal/popover等より上、toast(1700)より下 :contentReference[oaicite:2]{index=2}
          pointerEvents="auto" // 操作を吸い込む
        />
      )}
      {!bingos[0].id ? (
        <>
          {/* {console.log("no data!")} */}
          <GameEnded name={name} room={room} />
        </>
      ) : (
        <GameBoard
          team1Bingo={bingos[0]}
          team2Bingo={bingos[1]}
          team1Players={team1Players}
          team2Players={team2Players}
          room={room}
          name={name}
          setBingos={setBingos}
          teamNumber1={0}
          teamNumber2={1}
        />
      )}
    </div>
  );
}
