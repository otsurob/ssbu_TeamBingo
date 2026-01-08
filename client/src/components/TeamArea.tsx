import { Card, Separator } from "@chakra-ui/react";
import NameBar from "./NameBar";
import type { ResponsePlayer } from "../types/restAPIResponse";
import { updatePlayerTeam } from "../api/playerAPIs";

type TeamAreaProps = {
  teamNum: number;
  playerNames: string[];
  me: ResponsePlayer;
};

const TeamArea = ({ teamNum, playerNames, me }: TeamAreaProps) => {
  const team = teamNum === 0 ? "A" : "B";
  const color = teamNum === 0 ? "red" : "blue";
  const teamColor = color + ".500";
  const playerColor = color + ".200";

  const changeTeam = async () => {
    if (me.team === teamNum) return;
    if (!window.confirm("チームを変更しますか？")) return;
    //呼ぶのにmeの値使っていいのかね
    await updatePlayerTeam(me.room_name, me.name, teamNum);
  };

  return (
    <Card.Root w={350} onClick={changeTeam}>
      <Card.Header
        display="flex"
        flexDir="row"
        justifyContent="space-between"
        gap={2}
        textStyle="2xl"
        backgroundColor={teamColor}
      >
        Team {team}
      </Card.Header>
      <Separator />
      <Card.Body backgroundColor={playerColor}>
        {playerNames.map((p) => (
          <NameBar name={p} key={p} />
        ))}
      </Card.Body>
    </Card.Root>
  );
};

export default TeamArea;
