import {
  Container,
  Center,
  Card,
  CardBody,
  Input,
  Button,
  RadioGroup,
  Stack,
  Field,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toaster } from "./ui/toaster";
import { API_URL } from "../constants/constants";

export default function Home() {
  const navigate = useNavigate();
  const [team, setTeam] = useState<string | null>("0");
  let isRoomExisted = false;

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const showToast = (title: string) => {
    toaster.create({
      title: title,
      type: "error",
      closable: true,
      // placement: "top",
    });
  };

  const makeRoom = async () => {
    if (name == "" || room == "") {
      showToast("名前と部屋IDを入力してください");
      return;
    }
    const cb1 = {
      room: room,
      team: 1,
    };
    const cb2 = {
      room: room,
      team: 2,
    };
    await axios.get(`${API_URL}/bingo?room=${room}`).then(async (res) => {
      if (res.data.length !== 0) {
        showToast("その名前の部屋はすでに存在します！");
        isRoomExisted = true;
      } else {
        isRoomExisted = false;
      }
    });
    if (isRoomExisted) {
      return;
    }

    const player = {
      room: room,
      name: name,
      team: Number(team),
    };
    await axios.post(`${API_URL}/create`, cb1);

    await axios.post(`${API_URL}/create`, cb2);

    await axios.post(`${API_URL}/joinPlayer`, player);
    navigate(`game?room=${room}&name=${name}&team=${team}`);
  };

  const enterRoom = async () => {
    if (name == "" || room == "") {
      showToast("名前と部屋IDを入力してください");
      return;
    }
    await axios.get(`${API_URL}/bingo?room=${room}`).then(async (res) => {
      if (res.data.length === 0) {
        showToast("部屋が存在しません！");
        isRoomExisted = false;
      } else {
        isRoomExisted = true;
      }
    });
    if (!isRoomExisted) {
      return;
    }
    const player = {
      room: room,
      name: name,
      team: Number(team),
    };

    await axios.post(`${API_URL}/joinPlayer`, player);
    navigate(`game?room=${room}&name=${name}&team=${team}`);
  };

  const radioItems = [
    { label: "Team 1", value: "1" },
    { label: "Team 2", value: "2" },
    { label: "観戦として参加", value: "3" },
  ];

  return (
    <Container pt={20} centerContent minH="100vh">
      <Card.Root>
        <CardBody>
          <Field.Root>
            <Field.Label>名前</Field.Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field.Root>
          <Field.Root mt={4}>
            <Field.Label>部屋ID</Field.Label>
            <Input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </Field.Root>
          <RadioGroup.Root
            marginTop={10}
            value={team}
            onValueChange={(e) => setTeam(e.value)}
          >
            <Stack direction="row">
              {radioItems.map((item) => (
                <RadioGroup.Item key={item.value} value={item.value}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                </RadioGroup.Item>
              ))}
            </Stack>
          </RadioGroup.Root>
          <Center mt={8}>
            <Button
              marginRight={70}
              colorScheme="teal"
              size="lg"
              onClick={makeRoom}
            >
              部屋を作る
            </Button>
            <Button
              marginLeft={70}
              colorScheme="teal"
              size="lg"
              onClick={enterRoom}
            >
              部屋に入る
            </Button>
          </Center>
        </CardBody>
      </Card.Root>
    </Container>
  );
}
