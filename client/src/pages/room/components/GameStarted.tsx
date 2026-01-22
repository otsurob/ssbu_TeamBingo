import { useNavigate } from 'react-router-dom';
import type { ResponsePlayer } from '../../../types/restAPIResponse';
import { Button, Card, CardBody, Container, Flex, Spacer, Text } from '@chakra-ui/react';
import { updatePlayerTeam } from '../../../api/playerAPIs';

type GameStartedProps = {
  room: string;
  name: string;
  me: ResponsePlayer | undefined;
};

//TODO:meがundefined(観戦)の場合のチーム表示の処理が未実装
const GameStarted = ({ room, name, me }: GameStartedProps) => {
  const navigate = useNavigate();
  const TEAM: string[] = ['A', 'B']; //応急処置
  const handleChangeTeam = async (team: number) => {
    if (!window.confirm('チームを変更しますか？')) return;
    if (!room || !name) return;
    await updatePlayerTeam(room, name, team);
  };

  return (
    <Container pt={20} centerContent w="350px">
      <Card.Root>
        <CardBody>
          <Text textStyle="xl" fontWeight="bold">
            ゲームが開始されています！
          </Text>
          {me?.team === 2 ? (
            <Text>あなたはゲームに参加していません</Text>
          ) : (
            <>
              <Text>あなたはチーム {TEAM[me?.team ?? 0]} です</Text>
            </>
          )}
          <Button onClick={() => navigate(`/game?name=${name}&room=${room}`)}>ゲーム画面へ</Button>
          <Text textStyle="md">チームを指定して参加</Text>
          <Flex flexWrap="wrap" flexDirection="row">
            <Button onClick={() => handleChangeTeam(0)}>チーム：A</Button>
            <Spacer />
            <Button onClick={() => handleChangeTeam(1)}>チーム：B</Button>
          </Flex>
        </CardBody>
      </Card.Root>
    </Container>
  );
};

export default GameStarted;
