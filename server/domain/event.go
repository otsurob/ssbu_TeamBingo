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
	EventCellUpdated EventType = "cell_updated"
	// EventPlayerJoined  EventType = "player_joined"
	// EventPlayerUpdated EventType = "player_updated"
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
