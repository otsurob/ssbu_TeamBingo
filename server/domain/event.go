package domain

// usecase から呼ぶ用のインターフェース
type Pusher interface {
	Push(push *PushEvent) error
}

// 誰を相手にイベントを送信するかのために必要。今回はRoomIdで部屋を指定してその部屋全員にEventの内容をブロードキャスト
type PushEvent struct {
	RoomName string
	Event    *Event
}

type EventType string

const (
	EventCellUpdated   EventType = "cell_updated"
	EventPlayerJoined  EventType = "player_joined"
	EventPlayerUpdated EventType = "player_team_updated"
	EventTeamsShuffled EventType = "teams_shuffled"
	EventGameStarted   EventType = "game_started"
	EventGameEnded     EventType = "game_ended"
)

// 実際にフロントへブロードキャストするデータの構造
type Event struct {
	Type EventType `json:"type"`
	Data any       `json:"data"`
}

type CellUpdate struct {
	ID        uint   `json:"id"`
	Row       uint   `json:"row"`
	Col       uint   `json:"col"`
	NewStatus Status `json:"new_status"`
	BingoId   uint   `json:"bingo_id"`
}

type PlayerTeamUpdate struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	RoomName string `json:"room_name"`
	NewTeam  Team   `json:"new_team"`
}

type TeamsShuffled struct {
	Players []PlayerTeamUpdate `json:"players"`
}

type PlayerJoined struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	RoomName string `json:"room_name"`
	Team     Team   `json:"team"`
}
