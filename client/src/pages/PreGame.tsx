import { useEffect, useRef, useState } from "react";
import type { ResponseBingo, ResponsePlayer } from "../types/restAPIResponse";
import { WS_URL } from "../constants/constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CloseButton,
  Container,
  Dialog,
  Input,
  Portal,
  Spinner,
  Text,
} from "@chakra-ui/react";
import TeamSelection from "../components/TeamSelection";
import {
  isBingoExisting,
  isPlayerExisting,
  isRoomExisting,
} from "../services/existing";
import { toaster } from "../components/ui/toaster";
import TeamArea from "../components/TeamArea";
import { fetchBingos, createBingo } from "../api/bingoAPIs";
import {
  dividePlayers,
  fetchPlayers,
  joinPlayer,
  leavePlayer,
  updatePlayerTeam,
} from "../api/playerAPIs";
import { deleteRoom as deleteRoomAPI } from "../api/roomAPIs";
import GameStarted from "../components/GameStarted";
import SpectatorArea from "../components/SpectatorArea";
import type { wsEventType } from "../types/websocketEvent";

const PreGame = () => {
  const [bingos, setBingos] = useState<ResponseBingo[]>([]);
  const [players, setPlayers] = useState<ResponsePlayer[]>([]);
  //名前変更用変数
  const [newName, setNewName] = useState<string>("");

  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const room = searchParams.get("room");
  const navigate = useNavigate();
  const startedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!room) return;
      const [bingosRes, playersRes] = await Promise.all([
        fetchBingos(room),
        fetchPlayers(room),
      ]);
      setBingos(bingosRes);
      setPlayers(playersRes);
    };
    fetchData();
  }, [room]);

  useEffect(() => {
    if (!room) return;
    const ws = new WebSocket(`${WS_URL}/ws?room=${room}`);

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as wsEventType;
        if (msg.type === "player_team_updated") {
          const data = msg.data;
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === data.id
                ? {
                    ...p,
                    team: data.new_team,
                  }
                : p
            )
          );
        } else if (msg.type === "teams_shuffled") {
          const data = msg.data;
          setPlayers((prev) =>
            prev.map((p) => {
              const found = data.players.find((upd) => upd.id === p.id);
              return found ? { ...p, team: found.new_team } : p;
            })
          );
        } else if (msg.type === "game_started") {
          // console.log("game started!!!");
          if (startedRef.current) return; // 二重発火ガード
          startedRef.current = true;
          setLocked(true);
          toaster.create({
            title: "ゲームが開始されました！",
            description: "3秒後にゲーム画面へ移動します",
            type: "success",
            duration: 3000,
          });
          timerRef.current = window.setTimeout(() => {
            navigate(`/game?name=${name}&room=${room}`, {
              replace: true,
            });
          }, 3000);
        } else if (msg.type === "player_joined") {
          console.log("new player joined!");
          const data = msg.data;
          // prevを使わないと古いplayersを参照してしまう！要確認
          setPlayers((prev) => [...prev, data]);
        } else if (msg.type === "player_exited") {
          console.log("player exited!");
          const data = msg.data;
          // 退出したプレイヤーのidと一致するplayerをfilter
          setPlayers((prev) => prev.filter((p) => p.id !== data.id));
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

  // console.log("bingos!", bingos);

  if (!room || !name) {
    navigate("/");
    return <></>;
  }

  const me = players.find((p) => p.name === name);
  // チームごとの名前一覧だけの変数を用意
  const teamAPlayerNames = players
    .filter((p) => p.team === 0)
    .map((p) => p.name);
  const teamBPlayerNames = players
    .filter((p) => p.team === 1)
    .map((p) => p.name);
  const spectatorNames = players.filter((p) => p.team === 2).map((p) => p.name);

  //meがundefinedのエラー回避のための応急処置
  if (!me) {
    return <>Loading...</>;
  }

  const showToast = (title: string) => {
    toaster.create({
      title: title,
      type: "error",
      closable: true,
      // placement: "top",
    });
  };

  const startGame = async () => {
    if (!(await isRoomExisting(room))) {
      showToast("部屋が存在しません");
      return;
    }
    //ビンゴ生成・チーム振り分け処理
    if (await isBingoExisting(room)) {
      showToast("ゲームは開始されています！画面をリロードしてください！");
      return;
    }
    await createBingo(room);
    navigate(`/game?name=${name}&room=${room}`);
  };

  const randomTeam = async () => {
    if (!window.confirm("チームをランダムに振り分けます")) return;
    if (!room) return;
    await dividePlayers(room);
  };

  const leaveRoom = async () => {
    if (!window.confirm("部屋を抜けますか？")) return;
    if (await isPlayerExisting(room, name)) {
      console.log("existing");
      await leavePlayer(room, name);
    }
    navigate(`/lobby?name=${name}`);
  };

  const deleteRoom = async () => {
    if (!window.confirm("部屋を解散しますか？")) return;
    if (room) {
      if (await isRoomExisting(room)) {
        await deleteRoomAPI(room);
      }
    }
    navigate(`/lobby?name=${name}`);
  };

  // name, room はクエリパラメータから取得する。バグったら修正
  const handleChangeTeam = async (team: number) => {
    if (!window.confirm("チームを変更しますか？")) return;
    if (!room || !name) return;
    await updatePlayerTeam(room, name, team);
  };

  const changeName = async () => {
    if (newName.length > 20) {
      showToast("名前が長すぎます！");
      return;
    }
    // 現在の自分を削除して新しい名前で参加し直す
    if (name && room) {
      await leavePlayer(room, name);
    }
    if (room) {
      await joinPlayer(room, newName, 2);
    }
    navigate(`/preGame?name=${newName}&room=${room}`);
    //リロードするかなんかしたいよね
    window.location.reload();
  };

  const handleDeletePlayer = async (targetName: string) => {
    if (!window.confirm("このプレイヤーを削除しますか？")) return;
    if (room) {
      await leavePlayer(room, targetName);
    }
    // 自分自身を削除した場合はロビーへ遷移
    if (targetName === name) {
      navigate(`/lobby?name=${name}`);
      return;
    }
    // それ以外は一覧を即時更新
    setPlayers((prev) => prev.filter((p) => p.name !== targetName));
  };

  if (bingos.length === 0) {
    return <Spinner size="lg" />;
  }

  if (bingos[0].cell_reses && bingos[1].cell_reses) {
    return (
      <GameStarted
        room={room}
        name={name}
        me={me}
        handleChangeTeam={handleChangeTeam}
      />
    );
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
        <Card.Root>
          <Card.Header
            display="flex"
            flexDir="row"
            justifyContent="space-between"
            gap={2}
          >
            <Text textStyle="xl" fontWeight="bold">
              ゲーム開始前です！
            </Text>
            {/* <Button colorPalette="orange">名前を変える</Button> */}
            <Dialog.Root
              placement="center"
              motionPreset="slide-in-bottom"
              modal={true}
            >
              <Dialog.Trigger asChild>
                <Button colorPalette="orange">名前を変更</Button>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>新しい名前を入力してください</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.ActionTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                      </Dialog.ActionTrigger>
                      <Button onClick={changeName}>Enter</Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size="md" />
                    </Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          </Card.Header>
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
            <Button colorPalette="red" onClick={deleteRoom}>
              削除
            </Button>
          </CardFooter>
        </Card.Root>
        <TeamArea teamNum={0} playerNames={teamAPlayerNames} me={me} />
        <TeamArea teamNum={1} playerNames={teamBPlayerNames} me={me} />
        <SpectatorArea spectatorNames={spectatorNames} me={me} />
      </Container>
    </>
  );
};
export default PreGame;
