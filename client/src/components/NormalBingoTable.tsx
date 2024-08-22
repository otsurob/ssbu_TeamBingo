import { Button, Flex, IconButton, Img, Spacer } from '@chakra-ui/react'
import { ResponseBingo } from '../types'

type NormalBingoProps = {
  bingos: ResponseBingo[]
  leader: string
  changeStatusTeam: (locate: number, team: number) => void
  // changeStatusTeam2: (locate: number) => void
  deleteGame: () => void
  exitGame: () => void
}

const NON_GOT_CELL = 0

export const NormalBingoTable = ({
  bingos,
  changeStatusTeam,
  // changeStatusTeam2,
  deleteGame,
  exitGame,
}: NormalBingoProps) => {
  return (
    <Flex flexWrap="wrap" flexDirection="row" marginTop={30}>
      <Flex flexWrap="wrap" w="500px" flexDirection="row" marginLeft={30}>
        {bingos?.map((bingo) => (
          <div key={bingo.id}>
            {bingo.team === 1 && (
              <IconButton
                h="100px"
                w="100px"
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
      <Flex flexWrap="wrap" w="500px" flexDirection="row" marginLeft={30}>
        {bingos?.map((bingo) => (
          <div key={bingo.id}>
            {bingo.team === 2 && (
              <IconButton
                h="100px"
                w="100px"
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
