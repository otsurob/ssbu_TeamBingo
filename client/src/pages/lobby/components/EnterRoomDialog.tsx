import { Button, CloseButton, Dialog, Input, Portal } from "@chakra-ui/react";
import { useState } from "react";
import type { ResponseRoom } from "../../../types/restAPIResponse";
import { isPlayerExisting, isRoomExisting } from "../../../services/existing";
import { toaster } from "../../../components/ui/toaster";
import { checkRoomPassword } from "../../../api/roomAPIs";
import { joinPlayer } from "../../../api/playerAPIs";
import { WS_URL } from "../../../constants/constants";
import { useNavigate } from "react-router-dom";

type EnterRoomDialogProps = {
  name: string;
  room: ResponseRoom;
};

const EnterRoomDialog = ({ name, room }: EnterRoomDialogProps) => {
  const [enterRoomName, setEnterRoomName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const showToast = (title: string) => {
    toaster.create({
      title: title,
      type: "error",
      closable: true,
      // placement: "top",
    });
  };
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
  const enterRoom = async () => {
    if (!(await isRoomExisting(enterRoomName))) {
      showToast("部屋が存在しません");
      return;
    }
    const isValidPasswordRes = await checkRoomPassword(enterRoomName, password);
    console.log(isValidPasswordRes, password, enterRoomName);
    if (isValidPasswordRes) {
      //同じ名前のチェック
      if (await isPlayerExisting(enterRoomName, name)) {
        showToast("同じ名前のプレイヤーが部屋に存在します！");
        return;
      }
      //joinplayer
      if (name) {
        await joinPlayer(enterRoomName, name, 2);
      }
      try {
        await connectWebSocket(enterRoomName);
      } catch (e) {
        showToast("WebSocket 接続に失敗しました");
        console.log(e);
        return;
      }
      navigate(`/preGame?name=${name}&room=${room}`);
    } else {
      showToast("パスワードが間違っています");
      // navigate(`/lobby?name=${name}`);
      // window.location.reload();
    }
  };
  return (
    <>
      <Dialog.Root
        placement="center"
        motionPreset="slide-in-bottom"
        modal={true}
      >
        <Dialog.Trigger asChild>
          <Button onClick={() => setEnterRoomName(room.room_name)}>入室</Button>
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
    </>
  );
};

export default EnterRoomDialog;
