import { useNavigate } from 'react-router-dom';
import type { ResponsePlayer } from '../../../types/restAPIResponse';
import { Button, Card, CardBody, Container, Flex, Spacer, Text } from '@chakra-ui/react';
import { updatePlayerTeam } from '../../../api/playerAPIs';
import AlertDialog from '../../../components/AlertDialog';

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
    // if (!window.confirm('チームを変更しますか？')) return;
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
          {!me || me?.team === 2 ? (
            <Text>あなたはゲームに参加していません</Text>
          ) : (
            <>
              <Text>あなたはチーム {TEAM[me?.team ?? 0]} です</Text>
            </>
          )}
          <Button onClick={() => navigate(`/game?name=${name}&room=${room}`)}>ゲーム画面へ</Button>
          <Text textStyle="md">チームを指定して参加</Text>
          <Flex flexWrap="wrap" flexDirection="row">
            <AlertDialog
              title="チーム変更"
              message="チームをAに変更します。よろしいですか？（このボタンでは画面の切り替えは行われないので、上部ボタンでゲーム画面に移動してください）"
              confirmColor="green"
              confirmLabel="変更"
              onConfirm={() => handleChangeTeam(0)}
              trigger={<Button backgroundColor="red.500">チーム：A</Button>}
            />
            <Spacer />
            <AlertDialog
              title="チーム変更"
              message="チームをBに変更します。よろしいですか？（このボタンでは画面の切り替えは行われないので、上部ボタンでゲーム画面に移動してください）"
              confirmColor="green"
              confirmLabel="変更"
              onConfirm={() => handleChangeTeam(1)}
              trigger={<Button backgroundColor="blue.500">チーム：B</Button>}
            />
          </Flex>
        </CardBody>
      </Card.Root>
    </Container>
  );
};

export default GameStarted;
