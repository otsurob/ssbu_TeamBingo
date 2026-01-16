import { Button, Center, Flex, Spacer, Text } from '@chakra-ui/react';
import { useMedia } from 'use-media';
import { useNavigate } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';
import type { ResponseBingo, ResponsePlayer } from '../../../types/restAPIResponse';
import { BingoTable } from './BingoTable';
import { isPlayerExisting } from '../../../services/existing';
import { fetchBingos, deleteBingos, updateCell } from '../../../api/bingoAPIs';
import { leavePlayer } from '../../../api/playerAPIs';

type GameBoardProps = {
  team1Bingo: ResponseBingo;
  team2Bingo: ResponseBingo;
  team1Players: ResponsePlayer[];
  team2Players: ResponsePlayer[];
  room: string;
  name: string;
  setBingos: Dispatch<SetStateAction<ResponseBingo[]>>;
  teamNumber1: number;
  teamNumber2: number;
};

const GameBoard = ({
  team1Bingo,
  team2Bingo,
  team1Players,
  team2Players,
  room,
  name,
  setBingos,
  teamNumber1,
  teamNumber2,
}: GameBoardProps) => {
  const isWide = useMedia({ minWidth: '1000px' });
  const navigate = useNavigate();

  const deleteGame = async () => {
    if (!window.confirm('ゲームを終了しますか？')) return;
    const bingosRes = await fetchBingos(room);
    if (bingosRes[0].cell_reses) {
      await deleteBingos(room);
    }
    navigate(`/preGame?name=${name}&room=${room}`);
  };

  const exitGame = async () => {
    if (!window.confirm('部屋から退出します。よろしいですか？')) return;
    if (await isPlayerExisting(room, name)) {
      await leavePlayer(room, name);
    }
    navigate(`/lobby?name=${name}`);
  };

  const handleCellUpdate = async (
    row: number,
    col: number,
    nextStatus: number,
    cellId: number,
    bingoId: number,
    teamNumber: number,
  ) => {
    setBingos((prev) =>
      prev.map((b) =>
        b.id === bingoId
          ? {
              ...b,
              cell_reses: b.cell_reses.map((c) =>
                c.id === cellId ? { ...c, status: nextStatus } : c,
              ),
            }
          : b,
      ),
    );
    try {
      await updateCell(room, teamNumber, row, col, nextStatus);
    } catch (e) {
      console.error('cell update failed', e);
    }
  };

  if (isWide) {
    return (
      <Flex flexWrap="wrap" flexDirection="row" marginTop={30}>
        <Flex flexWrap="wrap" flexDirection="column">
          <BingoTable
            bingoProps={team1Bingo}
            bingoTableSize="500px"
            bingoCellSize="100px"
            teamNumber={teamNumber1}
            onCellUpdate={handleCellUpdate}
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
            onCellUpdate={handleCellUpdate}
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
  }

  return (
    <Flex flexWrap="wrap" flexDirection="column" marginTop={30}>
      <Flex flexWrap="wrap" w="350px" flexDirection="row">
        {team1Players?.map((player) => (
          <Center w="175px" h="10px" key={player.id} padding="15px">
            <Text fontSize="md">{player.name}</Text>
          </Center>
        ))}
      </Flex>
      <BingoTable
        bingoProps={team1Bingo}
        bingoTableSize="350px"
        bingoCellSize="70px"
        teamNumber={teamNumber1}
        onCellUpdate={handleCellUpdate}
      />
      <Spacer />
      <Button onClick={deleteGame}>終了</Button>
      <Button onClick={exitGame}>退出</Button>
      <Spacer />
      <Flex flexWrap="wrap" w="350px" flexDirection="row" marginTop="5px">
        {team2Players?.map((player) => (
          <Center w="175px" h="10px" key={player.id} padding="15px">
            <Text fontSize="md">{player.name}</Text>
          </Center>
        ))}
      </Flex>
      <BingoTable
        bingoProps={team2Bingo}
        bingoTableSize="350px"
        bingoCellSize="70px"
        teamNumber={teamNumber2}
        onCellUpdate={handleCellUpdate}
      />
    </Flex>
  );
};

export default GameBoard;
