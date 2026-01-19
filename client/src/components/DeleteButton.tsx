import { IconButton } from '@chakra-ui/react';
import { FaTrashAlt } from 'react-icons/fa';

type DeleteButtonProps = {
  onClick: () => void;
};

const DeleteButton = ({ onClick }: DeleteButtonProps) => {
  return (
    <IconButton aria-label="Delete" colorPalette="red" variant="ghost" onClick={onClick}>
      <FaTrashAlt />
    </IconButton>
  );
};

export default DeleteButton;
