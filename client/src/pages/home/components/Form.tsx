import { Button, Card, CardBody, Center, Container, Field, Text, Textarea } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppToast } from '../../../hooks/useAppToast';

const MAX_NAME_LENGTH = 100;

const Form = () => {
  const [name, setName] = useState<string>('');
  const navigate = useNavigate();
  const { showError } = useAppToast();
  const resister = async () => {
    if (name == '') {
      showError('名前を入力してください');
      return;
    }
    if (name.length > MAX_NAME_LENGTH) {
      showError('名前が長すぎます！');
      return;
    }
    navigate(`lobby?name=${name}`);
  };
  return (
    <Container pt={20} centerContent minH="100vh">
      <Card.Root>
        <CardBody>
          <Field.Root>
            <Field.Label>名前</Field.Label>
            <Textarea
              autoresize
              rows={1}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                }
              }}
            />
            <Text
              alignSelf="flex-end"
              color={name.length > MAX_NAME_LENGTH ? 'red.500' : 'fg.muted'}
              fontSize="sm"
            >
              {name.length} / {MAX_NAME_LENGTH}文字
            </Text>
          </Field.Root>
          <Center mt={8}>
            <Button marginRight={70} colorScheme="teal" size="lg" onClick={resister}>
              参加
            </Button>
          </Center>
        </CardBody>
      </Card.Root>
    </Container>
  );
};
export default Form;
