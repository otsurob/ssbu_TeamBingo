import axios from 'axios';
import { API_URL } from '../constants/constants';
import type { CellResponse, ResponseBingo } from '../types/restAPIResponse';

export const fetchBingos = async (room: string) => {
  const res = await axios.get<ResponseBingo[]>(`${API_URL}/bingos?room=${room}`);
  return res.data;
};

// 部屋が存在するかのチェックなどで使うシンプルな取得（EnterRoomModal で length 判定している想定）
export const fetchBingo = async (room: string) => {
  const res = await axios.get<ResponseBingo[]>(`${API_URL}/bingo?room=${room}`);
  return res.data;
};

export const createBingo = async (room: string) => {
  const res = await axios.post<ResponseBingo[]>(`${API_URL}/createBingo`, { room_name: room });
  return res.data;
};

export const updateCell = async (
  room: string,
  team: number,
  row: number,
  col: number,
  status: number,
) => {
  const res = await axios.put<CellResponse>(
    `${API_URL}/updateCell?room=${room}&team=${team}&row=${row}&col=${col}`,
    { status },
  );
  return res.data;
};

export const deleteBingos = async (room: string) => {
  const res = await axios.delete(`${API_URL}/deleteBingos?room=${room}`);
  return res.data;
};
