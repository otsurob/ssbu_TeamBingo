import { IconButton } from '@chakra-ui/react';
import {
  MdOutlineDriveFileRenameOutline,
  MdExitToApp,
  MdKeyboardReturn,
  MdOutlineSettings,
} from 'react-icons/md';
import { FaHome, FaTrashAlt } from 'react-icons/fa';

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
    <IconButton aria-label="Exit" colorPalette="green" variant="ghost" onClick={onClick}>
      <MdExitToApp />
    </IconButton>
  );
};

export const ReturnButton = ({ onClick }: CustomButtonProps) => {
  return (
    <IconButton aria-label="return" variant="ghost" onClick={onClick}>
      <MdKeyboardReturn />
    </IconButton>
  );
};

export const SettingButton = ({ onClick }: CustomButtonProps) => {
  return (
    <IconButton aria-label="setting" variant="ghost" onClick={onClick}>
      <MdOutlineSettings />
    </IconButton>
  );
};

export const HomeButton = ({ onClick }: CustomButtonProps) => {
  return (
    <IconButton aria-label="setting" variant="ghost" onClick={onClick}>
      <FaHome />
    </IconButton>
  );
};
