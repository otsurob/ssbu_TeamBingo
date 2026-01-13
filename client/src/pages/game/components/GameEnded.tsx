import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

type GameEndedProps = {
  name: string;
  room: string;
};

const GameEnded = ({ name, room }: GameEndedProps) => {
  const navigate = useNavigate();
  return (
    <>
      ゲームは終了されています！
      <Button onClick={() => navigate(`/preGame?name=${name}&room=${room}`)}>
        準備画面に戻る
      </Button>
    </>
  );
};

export default GameEnded;
