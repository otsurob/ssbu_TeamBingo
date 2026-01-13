import { Button, Center, Flex, Spacer, Text } from "@chakra-ui/react";
import { BingoTable } from "./BingoTable";
import type { ResponseBingo, ResponsePlayer } from "../types/restAPIResponse";

type NormalBingoProps = {
  team1Bingo: ResponseBingo;
  team2Bingo: ResponseBingo;
  team1Players: ResponsePlayer[];
  team2Players: ResponsePlayer[];
  deleteGame: () => void;
  exitGame: () => void;
  teamNumber1: number;
  teamNumber2: number;
  onCellUpdate: (
    row: number,
    col: number,
    nextStatus: number,
    cellId: number,
    bingoId: number,
    teamNumber: number
  ) => void;
};

export const NormalBingoTable = ({
  team1Bingo,
  team2Bingo,
  team1Players,
  team2Players,
  deleteGame,
  exitGame,
  teamNumber1,
  teamNumber2,
  onCellUpdate,
}: NormalBingoProps) => {
  return (
    <Flex flexWrap="wrap" flexDirection="row" marginTop={30}>
      <Flex flexWrap="wrap" flexDirection="column">
        <BingoTable
          bingoProps={team1Bingo}
          bingoTableSize="500px"
          bingoCellSize="100px"
          teamNumber={teamNumber1}
          onCellUpdate={onCellUpdate}
        />
        <Flex flexWrap="wrap" w="500px" flexDirection="row" marginTop="15px">
          {team1Players?.map((player) => (
            <Center w="250px" h="30px" key={player.id} padding="30px">
              <Text fontSize="3xl">{player.name}</Text>
            </Center>
          ))}
        </Flex>
      </Flex>
      <Spacer />
      <Button onClick={deleteGame}>終了</Button>
      <Button onClick={exitGame}>退出</Button>
      <Spacer />
      <Flex flexWrap="wrap" flexDirection="column">
        <BingoTable
          bingoProps={team2Bingo}
          bingoTableSize="500px"
          bingoCellSize="100px"
          teamNumber={teamNumber2}
          onCellUpdate={onCellUpdate}
        />
        <Flex flexWrap="wrap" w="500px" flexDirection="row" marginTop="15px">
          {team2Players?.map((player) => (
            <Center w="250px" h="30px" key={player.id} padding="30px">
              <Text fontSize="3xl">{player.name}</Text>
            </Center>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
