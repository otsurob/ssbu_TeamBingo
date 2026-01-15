import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMedia } from 'use-media';
import { SmallBingoTable } from './components/SmallBingoTable';
import { NormalBingoTable } from './components/NormalBingoTable';
import { WS_URL } from '../../constants/constants';
import { Box } from '@chakra-ui/react';
import type { ResponseBingo, ResponsePlayer } from '../../types/restAPIResponse';
import { isPlayerExisting } from '../../services/existing';
import { fetchBingos, deleteBingos, updateCell } from '../../api/bingoAPIs';
import { fetchPlayers, leavePlayer } from '../../api/playerAPIs';
import { toaster } from '../../components/ui/toaster';
import GameEnded from './components/GameEnded';
import type { wsEventType } from '../../types/websocketEvent';

export default function Game() {
  const [bingos, setBingos] = useState<ResponseBingo[]>([]);
  const [players, setPlayers] = useState<ResponsePlayer[]>([]);
  const [searchParams] = useSearchParams();
  const [locked, setLocked] = useState(false);
  const room = searchParams.get('room');
  const name = searchParams.get('name');

  useEffect(() => {
    return () => {
      toaster.dismiss(); // 全トースト閉じる
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

  useEffect(() => {
    if (!room) return;
    const ws = new WebSocket(`${WS_URL}/ws?room=${room}`);

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as wsEventType;
        if (msg.type === 'cell_updated') {
          // console.log("detect update!!!");
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
          // console.log("end game!");
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
      } catch (e) {
        console.error('ws message parse error', e);
      }
    };

    ws.onerror = () => {
      console.error('ws connection error');
    };

    return () => {
      ws.close();
    };
  }, [room]);

  const isWide = useMedia({ minWidth: '1000px' });

  const navigate = useNavigate();

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

  const deleteGame = async () => {
    if (!window.confirm('ゲームを終了しますか？')) return;
    const bingosRes = await fetchBingos(room);
    //空のオブジェクトの配列が返る(要素2つ)
    if (bingosRes[0].cell_reses) {
      await deleteBingos(room);
    }
    navigate(`/preGame?name=${name}&room=${room}`);
  };

  const exitGame = async () => {
    // if (window.confirm("部屋は残したまま退出しますか？")) {
    //   await axios
    //     .get(`${API_URL}/player?room=${room}&team=${team}`)
    //     .then(async (res) => {
    //       if (res.data.length !== 0) {
    //         await axios.delete(
    //           `${API_URL}/leaveOnePlayer?room=${room}&name=${name}&team=${team}`
    //         );
    //       }
    //     });
    //   navigate("/");
    // }
    if (!window.confirm('部屋から退出します。よろしいですか？')) return;
    if (await isPlayerExisting(room, name)) {
      await leavePlayer(room, name);
    }
    navigate(`/lobby?name=${name}`);
  };

  // BingoTableで定義していたセル更新関数をここで定義して子に渡す
  const handleCellUpdate = async (
    row: number,
    col: number,
    nextStatus: number,
    cellId: number,
    bingoId: number,
    teamNumber: number,
  ) => {
    // 楽観的に即時反映
    setBingos((prev) =>
      prev.map((b) =>
        // クリックしたビンゴのidを元に変更ビンゴを検知
        b.id === bingoId
          ? {
              ...b,
              cell_reses: b.cell_reses.map((c) =>
                // クリックしたセルのidを元に変更セルを検知
                c.id === cellId ? { ...c, status: nextStatus } : c,
              ),
            }
          : b,
      ),
    );
    try {
      await updateCell(room, teamNumber, row, col, nextStatus);
    } catch (e) {
      // 失敗したら元に戻すなどの処理を入れてもよい
      console.error('cell update failed', e);
    }
  };

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
        <>
          {isWide ? (
            <NormalBingoTable
              team1Bingo={bingos[0]}
              team2Bingo={bingos[1]}
              team1Players={team1Players}
              team2Players={team2Players}
              deleteGame={deleteGame}
              exitGame={exitGame}
              teamNumber1={0}
              teamNumber2={1}
              onCellUpdate={handleCellUpdate}
            />
          ) : (
            <SmallBingoTable
              team1Bingo={bingos[0]}
              team2Bingo={bingos[1]}
              team1Players={team1Players}
              team2Players={team2Players}
              deleteGame={deleteGame}
              exitGame={exitGame}
              teamNumber1={0}
              teamNumber2={1}
              onCellUpdate={handleCellUpdate}
            />
          )}
        </>
      )}
    </div>
  );
}
