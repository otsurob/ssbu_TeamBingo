import { IconButton } from '@chakra-ui/react';
import { MdOutlineDriveFileRenameOutline, MdExitToApp } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';

type CustomButtonProps = {
  onClick?: () => void;
};

export const DeleteButton = ({ onClick }: CustomButtonProps) => {
  return (
    <IconButton aria-label="Delete" colorPalette="red" variant="ghost" onClick={onClick}>
      <FaTrashAlt />
    </IconButton>
  );
};

export const RenameButton = ({ onClick }: CustomButtonProps) => {
  return (
    <IconButton aria-label="Rename" colorPalette="yellow" variant="ghost" onClick={onClick}>
      <MdOutlineDriveFileRenameOutline />
    </IconButton>
  );
};

export const ExitButton = ({ onClick }: CustomButtonProps) => {
  return (
    <IconButton aria-label="Exit" colorPalette="" variant="ghost" onClick={onClick}>
      <MdExitToApp />
    </IconButton>
  );
};
