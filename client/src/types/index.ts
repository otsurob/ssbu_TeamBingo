export type CreateBingo = {
  room: string
  team: string
}

export type CellResponse = {
	id:        number
	row:       number
	col:       number
	status:    number
	character: number
	bingoId:   number
}

export type ResponseBingo = {
  id:        number   
  roomame: string
  team: number
  CellReses : CellResponse[]
}

export type Info = {
  character: number
  status: number
}

export type ResponsePlayer = {
  id:number
  name:string
  roomName:string
  team:string
}

export type ResponseRoom = {
  id: number
  room_name:string
}
