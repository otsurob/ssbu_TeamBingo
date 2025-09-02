import { Flex, IconButton, Image } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { API_URL, NON_GOT_CELL } from "../constants/constants";
import type { ResponseBingo } from "../types";

type BingoTableProps = {
  bingoProps: ResponseBingo;
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
  const [bingos, setBingos] = useState<ResponseBingo>(bingoProps);
  const changeBingoStatus = (row: number, col: number) => {
    if (!window.confirm("状態を更新しますか？")) return;

    const idx = row * 5 + col;
    // 指定のセル
    const currentCell = bingos.cell_reses[idx];
    if (!currentCell) return;
    const nextStatus = currentCell.status ^ 1;

    setBingos((prev) => {
      const nextCells = prev.cell_reses.map((cell, i) =>
        i === idx ? { ...cell, status: cell.status ^ 1 } : cell
      );
      return { ...prev, cell_reses: nextCells };
    });
    console.log(room, teamNumber, row, col, nextStatus);
    axios.put(
      `${API_URL}/updateCell?room=${room}&team=${teamNumber}&row=${row}&col=${col}`,
      { status: nextStatus }
    );
  };

  // console.log(bingos);

  return (
    <Flex
      flexWrap="wrap"
      w={bingoTableSize}
      flexDirection="row"
      marginLeft={30}
    >
      {bingos.cell_reses?.map((cell) => (
        <div key={cell.id}>
          {/* {bingo.team === teamNumber && ( */}
          <IconButton
            h={bingoCellSize}
            w={bingoCellSize}
            backgroundColor={cell.status === NON_GOT_CELL ? "white" : "red"}
            value={cell.status}
            onClick={() => changeBingoStatus(cell.row, cell.col)}
            // aria-label={bingo.character}
          >
            <Image
              src={`/character_image/character_${cell.character}.png`}
              alt={`${cell.character}`}
            />
          </IconButton>
          {/*  )} */}
        </div>
      ))}
    </Flex>
  );
};
