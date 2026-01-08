import { Flex, IconButton, Image } from "@chakra-ui/react";
import { NON_GOT_CELL } from "../constants/constants";
import type { ResponseBingo } from "../types/restAPIResponse";

type BingoTableProps = {
  bingoProps: ResponseBingo;
  bingoTableSize: string;
  bingoCellSize: string;
  teamNumber: number;
  onCellUpdate: (
    row: number,
    col: number,
    nextStatus: number,
    cellId: number,
    bingoId: number,
    teamNumber: number
  ) => void;
};

export const BingoTable = ({
  bingoProps,
  bingoTableSize,
  bingoCellSize,
  teamNumber,
  onCellUpdate,
}: BingoTableProps) => {
  const changeBingoStatus = (row: number, col: number) => {
    if (!window.confirm("状態を更新しますか？")) return;

    const idx = row * 5 + col;
    // 指定のセル
    const currentCell = bingoProps.cell_reses[idx];
    if (!currentCell) return;
    const nextStatus = currentCell.status ^ 1;

    onCellUpdate(
      row,
      col,
      nextStatus,
      currentCell.id,
      currentCell.bingo_id,
      teamNumber
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
      {bingoProps.cell_reses?.map((cell) => (
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
