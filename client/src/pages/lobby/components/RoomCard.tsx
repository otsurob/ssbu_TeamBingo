import { Button, Card, CardFooter, CardHeader } from "@chakra-ui/react";
import type { ResponseRoom } from "../../../types/restAPIResponse";
import EnterRoomDialog from "./EnterRoomDialog";
import { useNavigate } from "react-router-dom";

type RoomCardProps = {
  name: string;
  room: ResponseRoom;
};

const RoomCard = ({ name, room }: RoomCardProps) => {
  const navigate = useNavigate();
  return (
    <Card.Root key={room.id} size="lg">
      <CardHeader>{room.room_name}</CardHeader>

      <CardFooter justifyContent="flex-end">
        <EnterRoomDialog name={name} room={room} />
        <Button
          colorPalette="cyan"
          onClick={() =>
            navigate(`/preGame?name=${name}&room=${room.room_name}`)
          }
        >
          観戦
        </Button>
        <Button size="2xs">削除</Button>
      </CardFooter>
    </Card.Root>
  );
};

export default RoomCard;
