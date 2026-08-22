import axios from 'axios';
import { API_URL } from '../config/env';
import type { ResponsePlayer } from '../types/restAPIResponse';

export const fetchPlayers = async (room: string) => {
  const res = await axios.get<ResponsePlayer[]>(`${API_URL}/players?room=${room}`);
  return res.data;
};

export const fetchPlayer = async (room: string, name: string) => {
  const res = await axios.get<ResponsePlayer>(`${API_URL}/player?name=${name}&room=${room}`);
  return res.data;
};

export const joinPlayer = async (room: string, name: string, team: number) => {
  const res = await axios.post(`${API_URL}/joinPlayer?room=${room}`, {
    name: name,
    team: team,
    room_name: room,
  });
  return res.data;
};

export const updatePlayerTeam = async (room: string, name: string, team: number) => {
  const res = await axios.put(`${API_URL}/updatePlayerTeam?name=${name}&room=${room}`, {
    team: team,
  });
  return res.data;
};

export const updatePlayerName = async (room: string, name: string, newName: string) => {
  const res = await axios.put(`${API_URL}/updatePlayerTeam?name=${name}&room=${room}`, {
    name: newName,
  });
  return res.data;
};

export const dividePlayers = async (room: string) => {
  const res = await axios.put(`${API_URL}/dividePlayers?room=${room}`);
  return res.data as ResponsePlayer[] | unknown;
};

export const leavePlayer = async (room: string, name: string) => {
  const res = await axios.delete(`${API_URL}/deleteOnePlayer?room=${room}&name=${name}`);
  return res.data;
};
