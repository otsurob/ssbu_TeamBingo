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
	bingo_id:   number
}

export type ResponseBingo = {
  id:        number   
  room_name: string
  team: number
  cell_reses : CellResponse[]
}

export type Info = {
  character: number
  status: number
}

export type ResponsePlayer = {
  id:number
  name:string
  room_name:string
  team:number
}

export type ResponseRoom = {
  id: number
  room_name:string
}
