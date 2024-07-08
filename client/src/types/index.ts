export type CreateBingo = {
  room: string
  team: string
}

export type ResponseBingo = {
  id:        number   
	room:      string 
	team :     number
	locate:    number
	status:   number
	character: number
}

export type Info = {
  character: number
  status: number
}