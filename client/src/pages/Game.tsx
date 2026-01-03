import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMedia } from "use-media";
import { SmallBingoTable } from "../components/SmallBingoTable";
import { NormalBingoTable } from "../components/NormalBingoTable";
import { API_URL, WS_URL } from "../constants/constants";
import { Button, Center } from "@chakra-ui/react";
import type { ResponseBingo, ResponsePlayer } from "../types";
import { isPlayerExisting } from "../services/existing";

export default function Game() {
  const [bingos, setBingos] = useState<ResponseBingo[]>([]);
  const [players, setPlayers] = useState<ResponsePlayer[]>([]);
  const [searchParams] = useSearchParams();
  const room = searchParams.get("room");
  const name = searchParams.get("name");

  useEffect(() => {
    if (!room) return;
    const fetchData = async () => {
      const [bingoRes, playerRes] = await Promise.all([
        axios.get<ResponseBingo[]>(`${API_URL}/bingos?room=${room}`),
        axios.get<ResponsePlayer[]>(`${API_URL}/players?room=${room}`),
      ]);
      setBingos(bingoRes.data);
      setPlayers(playerRes.data);
    };

    fetchData();
  }, [room]);

  useEffect(() => {
    if (!room) return;
    const ws = new WebSocket(`${WS_URL}/ws?room=${room}`);

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as { type: string; data: any };
        if (msg.type === "cell_updated") {
          // console.log("detect update!!!");
          const data = msg.data as {
            id: number;
            row: number;
            col: number;
            new_status: number;
            bingo_id: number;
          };
          setBingos((prev) =>
            prev.map((b) =>
              b.id === data.bingo_id
                ? {
                    ...b,
                    cell_reses: b.cell_reses.map((c) =>
                      c.id === data.id ? { ...c, status: data.new_status } : c
                    ),
                  }
                : b
            )
          );
        }
      } catch (e) {
        console.error("ws message parse error", e);
      }
    };

    ws.onerror = () => {
      console.error("ws connection error");
    };

    return () => {
      ws.close();
    };
  }, [room]);

  const isWide = useMedia({ minWidth: "1000px" });

  const navigate = useNavigate();

  if (!room || !name) {
    navigate("/");
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
    if (!window.confirm("ゲームを終了しますか？")) return;
    const bingosRes = await axios.get<ResponseBingo[]>(
      `${API_URL}/bingos?room=${room}`
    );
    // console.log(bingosRes);
    //空のオブジェクトの配列が返る(要素2つ)
    if (bingosRes.data[0].cell_reses) {
      axios.delete(`${API_URL}/bingos/${room}`);
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
    if (!window.confirm("部屋から退出します。よろしいですか？")) return;
    if (await isPlayerExisting(room, name)) {
      await axios.delete(`${API_URL}/leaveOnePlayer?room=${room}&name=${name}`);
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
    teamNumber: number
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
                c.id === cellId ? { ...c, status: nextStatus } : c
              ),
            }
          : b
      )
    );
    try {
      await axios.put(
        `${API_URL}/updateCell?room=${room}&team=${teamNumber}&row=${row}&col=${col}`,
        { status: nextStatus }
      );
    } catch (e) {
      // 失敗したら元に戻すなどの処理を入れてもよい
      console.error("cell update failed", e);
    }
  };

  return (
    <div>
      {bingos.length === 0 ? (
        <>
          <Center>
            <Button onClick={exitGame}>退出</Button>
          </Center>
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
