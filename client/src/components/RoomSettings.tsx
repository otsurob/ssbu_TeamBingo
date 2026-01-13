// 部屋の削除, プレイヤーの削除, プレイヤー名変更などを行うDialogを展開

import {
  Button,
  CloseButton,
  Container,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import type { ResponsePlayer } from "../types/restAPIResponse";
import NameBar from "./NameBar";

type RoomSettingsProps = {
  players: ResponsePlayer[];
};

const RoomSettings = ({ players }: RoomSettingsProps) => {
  return (
    <Dialog.Root placement="center" motionPreset="slide-in-bottom" modal={true}>
      <Dialog.Trigger asChild>
        <Button w="100px">設定</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>部屋を作成</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Container>
                {players.map((p) => (
                  <Container
                    display="flex"
                    flexDir="row"
                    justifyContent="space-between"
                    gap={2}
                  >
                    <NameBar name={p.name} />
                    <Button>削除</Button>
                  </Container>
                ))}
              </Container>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="md" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default RoomSettings;
