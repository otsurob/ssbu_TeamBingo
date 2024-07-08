import { Button, Flex, HStack, IconButton, Img, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { ResponseBingo } from "../types";

type Bingoprops = {
    bingo: ResponseBingo;
    changeStatus: (locate: number)=> void;
};


export const BingoTable = ({bingo, changeStatus}: Bingoprops) => {
    // const {bingo, changeStatus} = Bingoprops;
    return (
        <IconButton 
        h="100px" w="100px"
        backgroundColor= {bingo.status===0?'white':'red'}
        value={bingo.status} 
        onClick={() => changeStatus(bingo.locate)}
        aria-label='bingo cell'
        icon={<Img src={`./character_image/character_${bingo.character}.png`} alt={`${bingo.character}`}/>}>
            {bingo.character}
        </IconButton>
    )
}