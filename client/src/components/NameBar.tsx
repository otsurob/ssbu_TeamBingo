import { Container, Text } from '@chakra-ui/react';
import { useMedia } from 'use-media';

type NameBarProps = {
  name: string;
  myName?: string | undefined;
};

const NameBar = ({ name, myName }: NameBarProps) => {
  const isWide = useMedia({ minWidth: '1150px' });

  return (
    <Container
      backgroundColor={name === myName ? 'yellow.100' : 'gray.200'}
      borderRadius="2xl"
      px={3}
      py={2}
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="100%"
    >
      <Text fontSize={isWide ? 'md' : 'xs'} textAlign="center" lineHeight="1.2" title={name}>
        {name}
      </Text>
    </Container>
  );
};

export default NameBar;
