import { Card, Separator } from "@chakra-ui/react";
import NameBar from "./NameBar";

type TeamAreaProps = {
  teamNum: number;
  players: string[];
};

const TeamArea = ({ teamNum, players }: TeamAreaProps) => {
  const team = teamNum === 0 ? "A" : "B";
  const color = teamNum === 0 ? "red" : "blue";
  const teamColor = color + ".500";
  const playerColor = color + ".200";
  return (
    <Card.Root w={350}>
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
        {players.map((p) => (
          <NameBar name={p} />
        ))}
      </Card.Body>
    </Card.Root>
  );
};

export default TeamArea;
