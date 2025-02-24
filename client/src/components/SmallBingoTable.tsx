import { Button, Center, Flex, Spacer, Text } from '@chakra-ui/react'
import { ResponseBingo, ResponsePlayer } from '../types'
import { BingoTable } from './BingoTable'

type SmallBingoProps = {
  bingos: ResponseBingo[]
  team1Players: ResponsePlayer[]
  team2Players: ResponsePlayer[]
  deleteGame: () => void
  exitGame: () => void
  room: string
}

export const SmallBingoTable = ({
  bingos,
  team1Players,
  team2Players,
  deleteGame,
  exitGame,
  room,
}: SmallBingoProps) => {
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
        bingoProps={bingos}
        room={room}
        bingoTableSize="350px"
        bingoCellSize="70px"
        teamNumber={1}
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
        bingoProps={bingos}
        room={room}
        bingoTableSize="350px"
        bingoCellSize="70px"
        teamNumber={2}
      />
    </Flex>
  )
}
