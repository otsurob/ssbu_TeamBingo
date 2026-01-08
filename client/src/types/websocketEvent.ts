export type PlayerTeamUpdated = {
  id: number;
  name: string;
  room_name: string;
  new_team: number;
}

export type TeamsShuffled = {
  players : {
    id: number;
    new_team: number;
  }[]
}

export type PlayerJoined = {
  id: number;
  name: string;
  room_name: string;
  team: number;
}

export type PlayerExited = {
  id: number;
  name: string;
  room_name: string;
  team: number;
}

export type CellUpdated = {
  id: number;
  row: number;
  col: number;
  new_status: number;
  bingo_id: number;
}

export type GameStarted = {}

export type GameEnded = {}

export type wsEventType = 
  | { type: "player_team_updated"; data: PlayerTeamUpdated }
  | { type: "teams_shuffled"; data: TeamsShuffled }
  | { type: "player_joined"; data: PlayerJoined }
  | { type: "player_exited"; data: PlayerExited }
  | { type: "cell_updated"; data: CellUpdated }
  | { type: "game_started"; data: GameStarted }
  | { type: "game_ended"; data: GameEnded }