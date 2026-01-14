import { Container } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ResponseRoom } from "../../types/restAPIResponse";
import { fetchRooms } from "../../api/roomAPIs";
import MakeRoomDialog from "./components/MakeRoomDialog";
import RoomCard from "./components/RoomCard";
import Loading from "../../components/Loading";

const Lobby = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<ResponseRoom[]>();
  //部屋作成用の変数

  useEffect(() => {
    const fetchData = async () => {
      const roomDatas = await fetchRooms();
      setRooms(roomDatas);
    };
    fetchData();
  }, []);

  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  if (!name) {
    navigate("/");
    return;
  }

  if (!rooms) {
    return <Loading />;
  }

  // console.log(rooms);
  return (
    <Container pt={20} centerContent minH="100vh" gap="7">
      <MakeRoomDialog name={name} />
      {rooms?.length !== 0 ? (
        <>
          {rooms.map((room) => (
            <RoomCard name={name} room={room} key={room.id} />
          ))}
        </>
      ) : (
        <>入室可能な部屋が存在しません</>
      )}
    </Container>
  );
};

export default Lobby;
