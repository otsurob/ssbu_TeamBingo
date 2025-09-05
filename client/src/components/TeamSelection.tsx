import { Center, Flex, HStack, RadioGroup, Text } from "@chakra-ui/react";
import type { ResponsePlayer } from "../types";

type TeamSelectionProps = {
  players: ResponsePlayer[];
  name: string;
};

const TeamSelection = ({ players, name }: TeamSelectionProps) => {
  const items = [
    { label: "TeamA", value: "0" },
    { label: "TeamB", value: "1" },
    { label: "不参加", value: "2" },
  ];

  return (
    <Flex flexWrap="wrap" flexDirection="column" marginTop="15px">
      {players?.map((player) => (
        <Center h="30px" key={player.id} padding="30px">
          <Flex flexDirection="row">
            <Text fontSize="2xl">{player.name}</Text>
            <RadioGroup.Root defaultValue={player.team.toString()}>
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
