import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMedia } from "use-media";
import { SmallBingoTable } from "./SmallBingoTable";
import { NormalBingoTable } from "./NormalBingoTable";
import { API_URL } from "../constants/constants";
import { Button, Center } from "@chakra-ui/react";
import type { ResponseBingo, ResponsePlayer } from "../types";

export default function Game() {
  const [bingos, setBingos] = useState<ResponseBingo[]>([]);
  const [team1Players, setTeam1Players] = useState<ResponsePlayer[]>([]);
  const [team2Players, setTeam2Players] = useState<ResponsePlayer[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const [bingoRes, team1Res, team2Res] = await Promise.all([
        axios.get<ResponseBingo[]>(`${API_URL}/bingo?room=${room}`),
        axios.get<ResponsePlayer[]>(`${API_URL}/player?room=${room}&team=1`),
        axios.get<ResponsePlayer[]>(`${API_URL}/player?room=${room}&team=2`),
      ]);
      setBingos(bingoRes.data);
      setTeam1Players(team1Res.data);
      setTeam2Players(team2Res.data);
    };

    fetchData();
  }, []);

  const isWide = useMedia({ minWidth: "1000px" });
  const [searchParams] = useSearchParams();
  const room = searchParams.get("room");
  const team = searchParams.get("team");
  const name = searchParams.get("name");

  const navigate = useNavigate();

  if (!room || !name) {
    navigate("/");
    return null;
  }

  const deleteGame = async () => {
    if (window.confirm("部屋を解散しますか？")) {
      const fetchData = async () => {
        const [roomRes, team1Res, team2Res] = await Promise.all([
          axios.get(`${API_URL}/bingo?room=${room}`),
          axios.get(`${API_URL}/player?room=${room}&team=1`),
          axios.get(`${API_URL}/player?room=${room}&team=2`),
        ]);
        if (roomRes.data.length !== 0) {
          axios.delete(`${API_URL}/${room}`);
        }
        if (team1Res.data.length !== 0 || team2Res.data.length !== 0) {
          axios.delete(`${API_URL}/leavePlayer/${room}`);
        }
      };
      fetchData();
      navigate("/");
    }
  };

  const exitGame = async () => {
    if (window.confirm("部屋は残したまま退出しますか？")) {
      await axios
        .get(`${API_URL}/player?room=${room}&team=${team}`)
        .then(async (res) => {
          if (res.data.length !== 0) {
            await axios.delete(
              `${API_URL}/leaveOnePlayer?room=${room}&name=${name}&team=${team}`
            );
          }
        });
      navigate("/");
    }
  };

  return (
    <div>
      {bingos.length === 0 ? (
        <>
          <Center>
            <Button onClick={exitGame}>退出</Button>
          </Center>
        </>
      ) : (
        <>
          {isWide ? (
            <NormalBingoTable
              bingos={bingos}
              team1Players={team1Players}
              team2Players={team2Players}
              deleteGame={deleteGame}
              exitGame={exitGame}
              room={room}
            />
          ) : (
            <SmallBingoTable
              bingos={bingos}
              team1Players={team1Players}
              team2Players={team2Players}
              deleteGame={deleteGame}
              exitGame={exitGame}
              room={room}
            />
          )}
        </>
      )}
    </div>
  );
}
