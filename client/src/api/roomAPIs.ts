import axios from 'axios';
import { API_URL } from '../config/env';
import type { ResponseRoom, RoomCharacterSetting } from '../types/restAPIResponse';

export const fetchRooms = async () => {
  const res = await axios.get<ResponseRoom[]>(`${API_URL}/rooms`);
  return res.data;
};

export const fetchRoom = async (roomName: string) => {
  const res = await axios.get<ResponseRoom>(`${API_URL}/room?room=${roomName}`);
  return res.data;
};

export const checkRoomPassword = async (roomName: string, password: string) => {
  const res = await axios.get<boolean>(
    `${API_URL}/roomPassword?room=${roomName}&password=${password}`,
  );
  return res.data;
};

export const createRoom = async (roomName: string, password: string) => {
  const res = await axios.post(`${API_URL}/createRoom`, {
    room_name: roomName,
    password: password,
  });
  return res.data;
};

export const deleteRoom = async (room: string) => {
  const res = await axios.delete(`${API_URL}/deleteRoom?room=${room}`);
  return res.data;
};

export const fetchRoomCharacterSettings = async (room: string) => {
  const res = await axios.get<RoomCharacterSetting[]>(`${API_URL}/roomCharacterSettings`, {
    params: { room },
  });
  return res.data;
};

export const updateRoomCharacterSetting = async (
  room: string,
  setting: RoomCharacterSetting,
): Promise<void> => {
  await axios.put(`${API_URL}/updateRoomCharacterSetting`, setting, {
    params: { room },
  });
};
