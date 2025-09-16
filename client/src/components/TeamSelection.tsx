import { Center, Flex, HStack, RadioGroup, Text } from "@chakra-ui/react";
import type { ResponsePlayer } from "../types";

type TeamSelectionProps = {
  players: ResponsePlayer[];
  name: string;
  onChangeTeam?: (team: number) => void | Promise<void>;
};

const TeamSelection = ({ players, name, onChangeTeam }: TeamSelectionProps) => {
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
                    disabled={name !== player.name}
                  >
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                  </RadioGroup.Item>
                ))}
              </HStack>
            </RadioGroup.Root>
          </Flex>
        </Center>
      ))}
    </Flex>
  );
};

export default TeamSelection;
