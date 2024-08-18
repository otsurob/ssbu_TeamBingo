import { IconButton, Img } from '@chakra-ui/react'
import { ResponseBingo } from '../types'

type Bingoprops = {
  bingo: ResponseBingo
  changeStatus: (locate: number, team: number) => void
}

export const BingoTable = ({ bingo, changeStatus }: Bingoprops) => {
  // const {bingo, changeStatus} = Bingoprops;
  return (
    <IconButton
      h="100px"
      w="100px"
      backgroundColor={bingo.status === 0 ? 'white' : 'red'}
      value={bingo.status}
      onClick={() => changeStatus(bingo.locate, bingo.team)}
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
  )
}
