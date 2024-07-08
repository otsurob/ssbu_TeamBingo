import { Button, Flex, IconButton, Img, Spacer } from "@chakra-ui/react"
import { ResponseBingo } from "../types"

type SmallBingoProps = {
    bingos: ResponseBingo[];
    leader: string;
    changeStatusTeam1: (locate: number)=> void;
    changeStatusTeam2: (locate: number)=> void;
    deleteGame: () => void;
    exitGame: () => void;
}

export const SmallBingoTable = ({bingos, leader, changeStatusTeam1, changeStatusTeam2, deleteGame, exitGame}: SmallBingoProps) => {


    return (
        <Flex flexWrap="wrap" flexDirection="column" marginTop={30}>
            <Flex flexWrap="wrap" w="350px" flexDirection="row" marginLeft={30}>
            {bingos?.map((bingo) => (
                <div>
                    {bingo.team === 1 ? (
                    <>
                    {bingo.status === 0 ? (
                        <IconButton
                        h="70px" w="70px"
                        backgroundColor= 'white'
                        value={bingo.status} 
                        onClick={() => changeStatusTeam1(bingo.locate)}
                        aria-label='bingo cell'
                        icon={<Img src={`./character_image/character_${bingo.character}.png`} alt={`${bingo.character}`} />}>
                            {bingo.character}
                        </IconButton>
                    ) : (
                        <IconButton h="60px" w="60px"
                        backgroundColor= 'red'
                        value={bingo.status} 
                        onClick={() => changeStatusTeam1(bingo.locate)}
                        aria-label='bingo cell'
                        icon={<Img src={`./character_image/character_${bingo.character}.png`} alt={`${bingo.character}`} />}>
                            {bingo.character}
                        </IconButton>
                    )}
                    </>) : (
                        //Team2の要素は表示しない
                        <></>
                    )}
                </div>
            ))}
            </Flex>
            <Spacer />
                <Button onClick={deleteGame}>終了</Button>
                <Button onClick={exitGame}>退出</Button>
            <Spacer />
            <Flex flexWrap="wrap" w="350px" flexDirection="row" marginLeft={30}>
            {bingos?.map((bingo) => (
                <div>
                    {bingo.team === 2 ? (
                    <>
                    {bingo.status === 0 ? (
                        <IconButton 
                        h="70px" w="70px"
                        backgroundColor= 'white'
                        value={bingo.status} 
                        onClick={() => changeStatusTeam2(bingo.locate)}
                        aria-label='bingo cell'
                        icon={<Img src={`./character_image/character_${bingo.character}.png`} alt={`${bingo.character}`} />}>
                            {bingo.character}
                        </IconButton>
                    ) : (
                        <IconButton h="70px" w="70px" 
                        backgroundColor= 'red'
                        value={bingo.status} 
                        onClick={() => changeStatusTeam2(bingo.locate)}
                        aria-label='bingo cell'
                        icon={<Img src={`./character_image/character_${bingo.character}.png`} alt={`${bingo.character}`} />}>
                            {bingo.character}
                        </IconButton>
                    )}
                    </>) : (
                        // Team1の要素は表示しない
                        <></>
                    )}
                </div>
            ))}
            </Flex>
        </Flex>
    )
}