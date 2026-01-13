import {
  Button,
  Center,
  Flex,
  HStack,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import type { ResponsePlayer } from "../../../types/restAPIResponse";

type TeamSelectionProps = {
  players: ResponsePlayer[];
  name: string;
  onChangeTeam?: (team: number) => void | Promise<void>;
  onDeletePlayer?: (playerName: string) => void | Promise<void>;
};

const TeamSelection = ({
  players,
  name,
  onChangeTeam,
  onDeletePlayer,
}: TeamSelectionProps) => {
  const items = [
    { label: "A", value: "0" },
    { label: "B", value: "1" },
    { label: "x", value: "2" },
  ];

  return (
    <Flex flexWrap="wrap" flexDirection="column" marginTop="15px">
      {players?.map((player) => (
        <Center key={player.id} padding="10px">
          <Flex flexDirection="row">
            <Text fontSize="sm">{player.name}</Text>
            <RadioGroup.Root
              // size="sm"
              value={player.team.toString()}
              // 変更があったときの処理
              //変更する対象の名前をクエリパラメータから取っているので注意
              onValueChange={({ value }) => {
                const team = Number(value);
                onChangeTeam?.(team);
              }}
            >
              <HStack gap="6">
                {items.map((item) => (
                  <RadioGroup.Item
                    key={item.value}
                    value={item.value}
                    disabled={name !== player.name} //これをなくす場合は名前のチームの変更対象に注意
                  >
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                  </RadioGroup.Item>
                ))}
              </HStack>
            </RadioGroup.Root>
            <Button
              marginLeft="10px"
              colorPalette="red"
              size="sm"
              onClick={() => onDeletePlayer?.(player.name)}
            >
              削除
            </Button>
          </Flex>
        </Center>
      ))}
    </Flex>
  );
};

export default TeamSelection;
