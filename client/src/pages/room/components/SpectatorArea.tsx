import { Card, Separator, Stack } from '@chakra-ui/react';
import type { ResponsePlayer } from '../../../types/restAPIResponse';
import NameBar from '../../../components/NameBar';
import { updatePlayerTeam } from '../../../api/playerAPIs';

type SpectatorAreaProps = {
  // room: string,
  // name: string,
  me: ResponsePlayer | undefined;
  spectatorNames: string[];
};

const SpectatorArea = ({ me, spectatorNames }: SpectatorAreaProps) => {
  const changeTeam = async () => {
    if (!me) return; //観戦者がチーム変更できないように
    if (me.team === 2) return;
    if (!window.confirm('チームを変更しますか？')) return;
    //呼ぶのにmeの値使っていいのかね
    await updatePlayerTeam(me.room_name, me.name, 2);
  };

  return (
    <Card.Root w={350} onClick={changeTeam}>
      <Card.Header
        display="flex"
        flexDir="row"
        justifyContent="space-between"
        gap={2}
        textStyle="2xl"
        backgroundColor="green.500"
      >
        未参加
      </Card.Header>
      <Separator />
      <Card.Body backgroundColor="green.200">
        <Stack>
          {spectatorNames.map((p) => (
            <NameBar name={p} myName={me?.name} truncateAt={20} key={p} />
          ))}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};

export default SpectatorArea;
