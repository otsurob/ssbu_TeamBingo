import {
  Button,
  Center,
  Flex,
  IconButton,
  Img,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { ResponseBingo, ResponsePlayer } from '../types'

type SmallBingoProps = {
  bingos: ResponseBingo[]
  team1Players: ResponsePlayer[]
  team2Players: ResponsePlayer[]
  leader: string
  changeStatusTeam: (locate: number, team: number) => void
  // changeStatusTeam2: (locate: number) => void
  deleteGame: () => void
  exitGame: () => void
}

const NON_GOT_CELL = 0

export const SmallBingoTable = ({
  bingos,
  team1Players,
  team2Players,
  changeStatusTeam,
  // changeStatusTeam2,
  deleteGame,
  exitGame,
}: SmallBingoProps) => {
  return (
    <Flex flexWrap="wrap" flexDirection="column" marginTop={30}>
      <Flex flexWrap="wrap" w="350px" flexDirection="row">
        {team1Players?.map((player) => (
          // <div key={player.id}>{player.name}</div>
          <Center w="175px" h="10px" key={player.id} padding="15px">
            <Text fontSize="md">{player.name}</Text>
          </Center>
        ))}
      </Flex>
      <Flex flexWrap="wrap" w="350px" flexDirection="row" marginLeft={30}>
        {bingos?.map((bingo) => (
          <div key={bingo.id}>
            {bingo.team === 1 && (
              <IconButton
                h="70px"
                w="70px"
                backgroundColor={
                  bingo.status === NON_GOT_CELL ? 'white' : 'red'
                }
                value={bingo.status}
                onClick={() => changeStatusTeam(bingo.locate, bingo.team)}
                aria-label="bingo cell"
                icon={
                  <Img
                    src={`./character_image/character_${bingo.character}.png`}
                    alt={`${bingo.character}`}
                  />
                }
              >
                {bingo.character}
              </IconButton>
            )}
          </div>
        ))}
      </Flex>
      <Spacer />
      <Button onClick={deleteGame}>終了</Button>
      <Button onClick={exitGame}>退出</Button>
      <Spacer />
      <Flex flexWrap="wrap" w="350px" flexDirection="row" marginTop="5px">
        {team2Players?.map((player) => (
          // <div key={player.id}>{player.name}</div>
          <Center w="175px" h="10px" key={player.id} padding="15px">
            <Text fontSize="md">{player.name}</Text>
          </Center>
        ))}
      </Flex>
      <Flex flexWrap="wrap" w="350px" flexDirection="row" marginLeft={30}>
        {bingos?.map((bingo) => (
          <div key={bingo.id}>
            {bingo.team === 2 && (
              <IconButton
                h="70px"
                w="70px"
                backgroundColor={
                  bingo.status === NON_GOT_CELL ? 'white' : 'red'
                }
                value={bingo.status}
                onClick={() => changeStatusTeam(bingo.locate, bingo.team)}
                aria-label="bingo cell"
                icon={
                  <Img
                    src={`./character_image/character_${bingo.character}.png`}
                    alt={`${bingo.character}`}
                  />
                }
              >
                {bingo.character}
              </IconButton>
            )}
          </div>
        ))}
      </Flex>
    </Flex>
  )
}
