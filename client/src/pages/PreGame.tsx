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
  Container,
  Spinner,
  Text,
} from "@chakra-ui/react";
import TeamSelection from "../components/TeamSelection";

const PreGame = () => {
  const [bingos, setBingos] = useState<ResponseBingo[]>([]);
  const [players, setPlayers] = useState<ResponsePlayer[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const [bingosRes, playersRes] = await Promise.all([
        axios.get<ResponseBingo[]>(`${API_URL}/bingos?room=${room}`),
        axios.get<ResponsePlayer[]>(`${API_URL}/players?room=${room}`),
      ]);
      setBingos(bingosRes.data);
      setPlayers(playersRes.data);
    };
    fetchData();
  }, []);
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const room = searchParams.get("room");
  const navigate = useNavigate();
  console.log("bingos!", bingos);

  if (!room || !name) {
    navigate("/");
    return <></>;
  }

  const startGame = async () => {
    //ビンゴ生成・チーム振り分け処理
    await axios
      .get<ResponseBingo[]>(`${API_URL}/bingos?room=${room}`)
      .then(async (res) => {
        if (res.data.length !== 0) {
          //ビンゴが生成されています！
        }
      });
    await axios.post(`${API_URL}/createBingo`, { room_name: room });
    navigate(`/game?name=${name}&room=${room}`);
  };

  const randomTeam = async () => {
    if (!window.confirm("チームをランダムに振り分けます")) return;
    await axios.put(`${API_URL}/dividePlayers?room=${room}`);
  };

  const leaveRoom = async () => {
    await axios.delete(`${API_URL}/leaveOePlayer?room=${room}&name=${name}`);
    navigate(`/lobby?name=${name}`);
  };

  const deleteRoom = async () => {
    await axios.delete(`${API_URL}/deleteRoom/${room}`);
    navigate(`/lobby?name=${name}`);
  };

  if (bingos.length === 0) {
    return <Spinner size="lg" />;
  }

  if (bingos[0].cell_reses && bingos[1].cell_reses) {
    return (
      <Container pt={20} centerContent minH="100vh">
        <Card.Root>
          <CardBody>
            <Text textStyle="xl" fontWeight="bold">
              ゲームが開始されています！
            </Text>
            <Text>
              あなたは [チーム1 : チーム2 : ゲームに参加していません] です
            </Text>
          </CardBody>
        </Card.Root>
      </Container>
    );
  }

  return (
    <Container pt={20} centerContent minH="100vh">
      <Card.Root>
        <CardBody gap="5">
          <Text textStyle="xl" fontWeight="bold">
            ゲーム開始前です！
          </Text>
          <Button onClick={startGame}>ゲーム開始</Button>
          <Button onClick={randomTeam}>ランダムチーム振り分け</Button>
          <TeamSelection players={players} name={name} />
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
