import {
  Container,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Button,
  Dialog,
  Portal,
  Input,
  CloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../constants/constants";
import type { ResponseRoom } from "../types";

const Lobby = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<ResponseRoom[]>();

  useEffect(() => {
    const fetchData = async () => {
      const roomDatas = await axios.get<ResponseRoom[]>(`${API_URL}/rooms`);
      setRooms(roomDatas.data);
    };
    fetchData();
  }, []);

  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  const enterRoom = () => {};

  console.log(rooms);
  return (
    <Container pt={20} centerContent minH="100vh">
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
                    <Button>入室</Button>
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content>
                        <Dialog.Header>
                          <Dialog.Title>パスワード入力</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                          <Input />
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.ActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                          </Dialog.ActionTrigger>
                          <Button
                            onClick={() =>
                              navigate(
                                `/preGame?name=${name}&room=${room.room_name}`
                              )
                            }
                          >
                            Enter
                          </Button>
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
