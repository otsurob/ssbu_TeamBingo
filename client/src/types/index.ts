export type CreateBingo = {
  room: string
  team: string
}

export type ResponseBingo = {
  id:        number   
	team :     number
	locate:    number
	status:   number
	character: number
}

export type Info = {
  character: number
  status: number
}

export type ResponsePlayer = {
  id:number
  name:string
  team:string
}

export type ResponseRoom = {
  id: number
  room_name:string
}