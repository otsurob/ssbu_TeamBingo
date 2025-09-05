import {
  Container,
  Card,
  CardHeader,
  CardFooter,
  Button,
  Dialog,
  Portal,
  Input,
  CloseButton,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../constants/constants";
import type { ResponseRoom } from "../types";
import { toaster } from "../components/ui/toaster";
import { isRoomExisting } from "../services/existing";

const Lobby = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState<string>("");
  const [rooms, setRooms] = useState<ResponseRoom[]>();
  const [password, setPassword] = useState<string>("");
  const [newRoom, setNewRoom] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const roomDatas = await axios.get<ResponseRoom[]>(`${API_URL}/rooms`);
      setRooms(roomDatas.data);
    };
    fetchData();
  }, []);

  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  const showToast = (title: string) => {
    toaster.create({
      title: title,
      type: "error",
      closable: true,
      // placement: "top",
    });
  };

  const makeRoom = async () => {
    if (!newRoom || !newPassword) {
      showToast("入力内容が不正です");
      return;
    }
    const RoomRes = await axios.get<ResponseRoom>(
      `${API_URL}/room?room=${newRoom}`
    );
    console.log(RoomRes.data);
    // 部屋名が存在しない場合は空文字列が返る
    if (RoomRes.data.room_name !== "") {
      showToast("同名の部屋が存在します");
      return;
    }
    await axios.post(`${API_URL}/createRoom`, {
      room_name: newRoom,
      password: newPassword,
    });
    await axios.post(`${API_URL}/joinPlayer?room=${newRoom}`, {
      name: name,
      team: 2,
      room_name: newRoom,
    });
    navigate(`/preGame?name=${name}&room=${newRoom}`);
  };

  const enterRoom = async () => {
    if (!(await isRoomExisting(room))) {
      showToast("部屋が存在しません");
      return;
    }
    const isValidPasswordRes = await axios.get<boolean>(
      `${API_URL}/roomPassword?room=${room}&password=${password}`
    );
    console.log(isValidPasswordRes, password, room);
    if (isValidPasswordRes.data) {
      //joinplayer
      navigate(`/preGame?name=${name}&room=${room}`);
    } else {
      showToast("パスワードが間違っています");
      // navigate(`/lobby?name=${name}`);
      // window.location.reload();
    }
  };

  // console.log(rooms);
  return (
    <Container pt={20} centerContent minH="100vh" gap="7">
      <Dialog.Root
        placement="center"
        motionPreset="slide-in-bottom"
        modal={true}
      >
        <Dialog.Trigger asChild>
          <Button w="100px">部屋を作成</Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>部屋を作成</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text textStyle="lg">部屋名</Text>
                <Input
                  type="text"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                />
                <Text textStyle="lg">パスワード</Text>
                <Input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button onClick={makeRoom}>Enter</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="md" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      {rooms ? (
        <>
          {rooms.map((room) => (
            <Card.Root key={room.id} size="lg">
              <CardHeader>{room.room_name}</CardHeader>

              <CardFooter justifyContent="flex-end">
                <Dialog.Root
                  placement="center"
                  motionPreset="slide-in-bottom"
                  modal={true}
                >
                  <Dialog.Trigger asChild>
                    <Button onClick={() => setRoom(room.room_name)}>
                      入室
                    </Button>
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content>
                        <Dialog.Header>
                          <Dialog.Title>パスワード入力</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                          <Input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.ActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                          </Dialog.ActionTrigger>
                          <Button onClick={enterRoom}>Enter</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                          <CloseButton size="md" />
                        </Dialog.CloseTrigger>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root>
                <Button size="2xs">削除</Button>
              </CardFooter>
            </Card.Root>
          ))}
        </>
      ) : (
        <>入室可能な部屋が存在しません</>
      )}
    </Container>
  );
};

export default Lobby;
