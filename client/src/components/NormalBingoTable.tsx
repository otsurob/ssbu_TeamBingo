import { Button, Center, Flex, Spacer, Text } from '@chakra-ui/react'
import { ResponseBingo, ResponsePlayer } from '../types'
import { BingoTable } from './BingoTable'

type NormalBingoProps = {
  bingos: ResponseBingo[]
  team1Players: ResponsePlayer[]
  team2Players: ResponsePlayer[]
  deleteGame: () => void
  exitGame: () => void
  room: string
}

export const NormalBingoTable = ({
  bingos,
  team1Players,
  team2Players,
  deleteGame,
  exitGame,
  room,
}: NormalBingoProps) => {
  return (
    <Flex flexWrap="wrap" flexDirection="row" marginTop={30}>
      <Flex flexWrap="wrap" flexDirection="column">
        <BingoTable
          bingoProps={bingos}
          room={room}
          bingoTableSize="500px"
          bingoCellSize="100px"
          teamNumber={1}
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
          bingoProps={bingos}
          room={room}
          bingoTableSize="500px"
          bingoCellSize="100px"
          teamNumber={2}
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
  )
}
