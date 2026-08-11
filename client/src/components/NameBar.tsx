import { Container, Text } from '@chakra-ui/react';
import { useMedia } from 'use-media';

type NameBarProps = {
  name: string;
  myName?: string | undefined;
  wrapAt?: number;
  truncateAt?: number;
};

const NameBar = ({ name, myName, wrapAt, truncateAt }: NameBarProps) => {
  const isWide = useMedia({ minWidth: '1150px' });
  const characters = Array.from(name);
  const displayName =
    truncateAt && characters.length > truncateAt
      ? `${characters.slice(0, truncateAt).join('')}...`
      : name;
  const displayCharacters = Array.from(displayName);
  const lines =
    wrapAt && displayCharacters.length >= wrapAt
      ? Array.from({ length: Math.ceil(displayCharacters.length / wrapAt) }, (_, index) =>
          displayCharacters.slice(index * wrapAt, (index + 1) * wrapAt).join(''),
        )
      : [displayName];

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
      <Text
        fontSize={isWide ? 'md' : 'xs'}
        textAlign="center"
        lineHeight="1.2"
        overflowWrap={characters.length >= (wrapAt ?? Infinity) ? 'anywhere' : undefined}
      >
        {lines.map((line, index) => (
          <span key={index}>
            {index > 0 && <br />}
            {line}
          </span>
        ))}
      </Text>
    </Container>
  );
};

export default NameBar;
