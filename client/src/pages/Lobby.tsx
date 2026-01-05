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
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { WS_URL } from "../constants/constants";
import type { ResponseRoom } from "../types";
import { toaster } from "../components/ui/toaster";
import { isPlayerExisting, isRoomExisting } from "../services/existing";
import { fetchRooms, fetchRoom, createRoom, checkRoomPassword } from "../api/roomAPIs";
import { joinPlayer } from "../api/playerAPIs";

const Lobby = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState<string>("");
  const [rooms, setRooms] = useState<ResponseRoom[]>();
  const [password, setPassword] = useState<string>("");
  //部屋作成用の変数
  const [newRoom, setNewRoom] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const roomDatas = await fetchRooms();
      setRooms(roomDatas);
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

  if (!name) {
    navigate("/");
    return;
  }

  const connectWebSocket = async (roomName: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        const ws = new WebSocket(`${WS_URL}/ws?room=${roomName}`);
        ws.onopen = () => {
          console.log("websocket is opening");
          ws.close();
          resolve();
        };
        ws.onerror = () => reject(new Error("WebSocket connection failed"));
      } catch (e) {
        reject(e);
      }
    });
  };

  const makeRoom = async () => {
    if (!newRoom || !newPassword) {
      showToast("入力内容が不正です");
      return;
    }
    const RoomRes = await fetchRoom(newRoom);
    console.log(RoomRes);
    // 部屋名が存在しない場合は空文字列が返る
    if (RoomRes.room_name !== "") {
      showToast("同名の部屋が存在します");
      return;
    }
    await createRoom(newRoom, newPassword);
    if (name) {
      await joinPlayer(newRoom, name, 2);
    }
    navigate(`/preGame?name=${name}&room=${newRoom}`);
  };

  const enterRoom = async () => {
    if (!(await isRoomExisting(room))) {
      showToast("部屋が存在しません");
      return;
    }
    const isValidPasswordRes = await checkRoomPassword(room, password);
    console.log(isValidPasswordRes, password, room);
    if (isValidPasswordRes) {
      //同じ名前のチェック
      if (await isPlayerExisting(room, name)) {
        showToast("同じ名前のプレイヤーが部屋に存在します！");
        return;
      }
      //joinplayer
      if (name) {
        await joinPlayer(room, name, 2);
      }
      try {
        await connectWebSocket(room);
      } catch (e) {
        showToast("WebSocket 接続に失敗しました");
        return;
      }
      navigate(`/preGame?name=${name}&room=${room}`);
    } else {
      showToast("パスワードが間違っています");
      // navigate(`/lobby?name=${name}`);
      // window.location.reload();
    }
  };

  if (!rooms) {
    return <div>Loading...</div>;
  }

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
      {rooms?.length !== 0 ? (
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
                <Button
                  colorPalette="cyan"
                  onClick={() =>
                    navigate(`/preGame?name=${name}&room=${room.room_name}`)
                  }
                >
                  観戦
                </Button>
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
