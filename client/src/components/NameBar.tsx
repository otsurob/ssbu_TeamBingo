import { Container } from '@chakra-ui/react';

type NameBarProps = {
  name: string;
};

const NameBar = ({ name }: NameBarProps) => {
  return <Container backgroundColor="gray.200">{name}</Container>;
};

export default NameBar;
