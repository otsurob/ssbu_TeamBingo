import axios from "axios"
import { API_URL } from "../constants/constants"
import { type ResponseBingo, type ResponsePlayer, type ResponseRoom } from "../types"

export const isRoomExisting = async(roomName: string) => {
    const roomRes = await axios.get<ResponseRoom>(`${API_URL}/room?room=${roomName}`)
    // room_nameが空文字なら存在しない
    return roomRes.data.room_name !== ""
}

export const isPlayerExisting = async(roomName: string, name: string) => {
    const playerRes = await axios.get<ResponsePlayer>(`${API_URL}/player?name=${name}&room=${roomName}`)
    // nameが空文字なら存在しない
    return playerRes.data.name !== ""
}

export const isBingoExisting = async(roomName: string) => {
    const bingoReses = await axios.get<ResponseBingo[]>(`${API_URL}/bingos?room=${roomName}`)
    // 各ビンゴのCellがnullなら存在しない
    return bingoReses.data[0].cell_reses && bingoReses.data[1].cell_reses
}