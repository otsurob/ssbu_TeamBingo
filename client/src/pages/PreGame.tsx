import { useEffect, useState } from "react";
import type { ResponseBingo, ResponsePlayer } from "../types";
import axios from "axios";
import { API_URL } from "../constants/constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CloseButton,
  Container,
  Dialog,
  Flex,
  Input,
  Portal,
  Spacer,
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

const PreGame = () => {
  const [bingos, setBingos] = useState<ResponseBingo[]>([]);
  const [players, setPlayers] = useState<ResponsePlayer[]>([]);
  const [player, setPlayer] = useState<ResponsePlayer>();
  //名前変更用変数
  const [newName, setNewName] = useState<string>("");
  useEffect(() => {
    const fetchData = async () => {
      const [bingosRes, playersRes, playerRes] = await Promise.all([
        axios.get<ResponseBingo[]>(`${API_URL}/bingos?room=${room}`),
        axios.get<ResponsePlayer[]>(`${API_URL}/players?room=${room}`),
        axios.get<ResponsePlayer>(
          `${API_URL}/player?name=${name}&room=${room}`
        ),
      ]);
      setBingos(bingosRes.data);
      setPlayers(playersRes.data);
      setPlayer(playerRes.data);
    };
    fetchData();
  }, []);
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const room = searchParams.get("room");
  const navigate = useNavigate();
  // console.log("bingos!", bingos);

  if (!room || !name) {
    navigate("/");
    return <></>;
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
    // await axios
    //   .get<ResponseBingo[]>(`${API_URL}/bingos?room=${room}`)
    //   .then(async (res) => {
    //     if (res.data.length !== 0) {
    //       //ビンゴが生成されています！
    //       window.location.reload();
    //       return;
    //     }
    //   });
    if (await isBingoExisting(room)) {
      showToast("ゲームは開始されています！画面をリロードしてください！");
      return;
    }
    await axios.post(`${API_URL}/createBingo`, { room_name: room });
    navigate(`/game?name=${name}&room=${room}`);
  };

  const randomTeam = async () => {
    if (!window.confirm("チームをランダムに振り分けます")) return;
    await axios.put(`${API_URL}/dividePlayers?room=${room}`);
  };

  const leaveRoom = async () => {
    if (!window.confirm("部屋を抜けますか？")) return;
    if (await isPlayerExisting) {
      await axios.delete(`${API_URL}/leaveOnePlayer?room=${room}&name=${name}`);
    }
    navigate(`/lobby?name=${name}`);
  };

  const deleteRoom = async () => {
    if (!window.confirm("部屋を解散しますか？")) return;
    if (await isRoomExisting) {
      await axios.delete(`${API_URL}/deleteRoom/${room}`);
    }
    navigate(`/lobby?name=${name}`);
  };

  // name, room はクエリパラメータから取得する。バグったら修正
  const handleChangeTeam = async (team: number) => {
    // TODO:リロードしないとチームの変更は反映されない
    if (!window.confirm("チームを変更しますか？")) return;
    await axios.put(`${API_URL}/updatePlayerTeam?name=${name}&room=${room}`, {
      team: team,
    });
  };

  const changeName = async () => {
    if (newName.length > 20) {
      showToast("名前が長すぎます！");
      return;
    }
    if (await isPlayerExisting) {
      await axios.delete(`${API_URL}/leaveOnePlayer?room=${room}&name=${name}`);
    }
    await axios.post(`${API_URL}/joinPlayer?room=${room}`, {
      name: newName,
      team: 2,
      room_name: room,
    });
    navigate(`/preGame?name=${newName}&room=${room}`);
    //リロードするかなんかしたいよね
    window.location.reload();
  };

  if (bingos.length === 0) {
    return <Spinner size="lg" />;
  }

  if (bingos[0].cell_reses && bingos[1].cell_reses) {
    return (
      <Container pt={20} centerContent w="350px">
        <Card.Root>
          <CardBody>
            <Text textStyle="xl" fontWeight="bold">
              ゲームが開始されています！
            </Text>
            {player?.team === 2 ? (
              <Text>あなたはゲームに参加していません</Text>
            ) : (
              <>
                <Text>あなたはチーム {player?.team} です</Text>
              </>
            )}
            <Button onClick={() => navigate(`/game?name=${name}&room=${room}`)}>
              ゲーム画面へ
            </Button>
            <Text textStyle="md">チームを指定して参加</Text>
            <Flex flexWrap="wrap" flexDirection="row">
              <Button onClick={() => handleChangeTeam(0)}>チーム：0</Button>
              <Spacer />
              <Button onClick={() => handleChangeTeam(1)}>チーム：1</Button>
            </Flex>
          </CardBody>
        </Card.Root>
      </Container>
    );
  }

  return (
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
          />
        </CardBody>
        <CardFooter display="flex" justifyContent="space-between" gap={2}>
          <Button onClick={leaveRoom}>退出</Button>
          <Button colorPalette="red" onClick={deleteRoom}>
            削除
          </Button>
        </CardFooter>
      </Card.Root>
    </Container>
  );
};
export default PreGame;
