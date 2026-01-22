import { Container } from '@chakra-ui/react';

type NameBarProps = {
  name: string;
};

const NameBar = ({ name }: NameBarProps) => {
  return (
    <Container
      backgroundColor="gray.200"
      borderRadius="2xl"
      px={3}
      // py={1}
      display="flex"
      alignItems="center"
    >
      {name}
    </Container>
  );
};

export default NameBar;
