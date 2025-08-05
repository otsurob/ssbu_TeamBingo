import { Flex, IconButton, Image } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { BINGO_SIZE, API_URL, NON_GOT_CELL } from "../constants/constants";
import type { ResponseBingo } from "../types";

type BingoTableProps = {
  bingoProps: ResponseBingo[];
  room: string;
  bingoTableSize: string;
  bingoCellSize: string;
  teamNumber: number;
};

export const BingoTable = ({
  bingoProps,
  room,
  bingoTableSize,
  bingoCellSize,
  teamNumber,
}: BingoTableProps) => {
  const [bingos, setBingos] = useState<ResponseBingo[]>(bingoProps);
  const changeBingoStatus = (locate: number, team: number) => {
    if (window.confirm("状態を更新しますか？")) {
      const tempBingos = bingos.concat();
      const changedStatusNumber =
        tempBingos[locate + BINGO_SIZE * (team - 1)].status ^ 1;
      tempBingos[locate + BINGO_SIZE * (team - 1)].status = changedStatusNumber;
      const updateElement = {
        status: changedStatusNumber,
      };
      axios.put(
        `${API_URL}/update?room=${room}&team=${team}&locate=${locate}`,
        updateElement
      );
      setBingos(tempBingos);
    }
  };

  return (
    <Flex
      flexWrap="wrap"
      w={bingoTableSize}
      flexDirection="row"
      marginLeft={30}
    >
      {bingos?.map((bingo) => (
        <div key={bingo.id}>
          {bingo.team === teamNumber && (
            <IconButton
              h={bingoCellSize}
              w={bingoCellSize}
              backgroundColor={bingo.status === NON_GOT_CELL ? "white" : "red"}
              value={bingo.status}
              onClick={() => changeBingoStatus(bingo.locate, bingo.team)}
              aria-label="bingo cell"
              icon={
                <Image
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
  );
};
