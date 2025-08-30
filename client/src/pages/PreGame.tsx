import { useEffect, useState } from "react";
import type { ResponseBingo, ResponsePlayer } from "../types";
import axios from "axios";
import { API_URL } from "../constants/constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Center,
  Container,
  Flex,
  Spinner,
  Text,
} from "@chakra-ui/react";

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

  if (bingos.length === 0) {
    return <Spinner size="lg" />;
  }

  if (bingos[0].CellReses && bingos[1].CellReses) {
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
        <CardBody>
          <Text fontSize="2xl">Tinpo!!!</Text>
          <Button onClick={startGame}>ゲームを開始します！</Button>
          <Flex flexWrap="wrap" flexDirection="row" marginTop="15px">
            {players?.map((player) => (
              <Center w="250px" h="30px" key={player.id} padding="30px">
                <Text fontSize="sm">{player.name}</Text>
              </Center>
            ))}
          </Flex>
        </CardBody>
      </Card.Root>
    </Container>
  );
};
export default PreGame;
