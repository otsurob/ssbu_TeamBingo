package usecase

import "server/domain"

// IEventPublisher はユースケース層からイベント送信を依頼するための窓口。
// 具体的な送信手段 (WebSocket など) は domain.Pusher の実装に任せる。
type IEventPublisher interface {
	Push(push *domain.PushEvent) error
	PushCellUpdated(roomId string, cell domain.Cell) error
}

type eventPublisher struct {
	pusher domain.Pusher
}

func NewEventPublisher(p domain.Pusher) IEventPublisher {
	return &eventPublisher{pusher: p}
}

// Push は生成済みの PushEvent をそのまま委譲するシンプルな入り口。
func (ep *eventPublisher) Push(push *domain.PushEvent) error {
	return ep.pusher.Push(push)
}

// PushCellUpdated はセル更新イベントの組み立てと送信をまとめる。
func (ep *eventPublisher) PushCellUpdated(roomName string, cell domain.Cell) error {
	return ep.Push(&domain.PushEvent{
		RoomName: roomName,
		Event: &domain.Event{
			Type: domain.EventCellUpdated,
			Data: domain.CellUpdate{
				ID:        cell.ID,
				Row:       cell.Row,
				Col:       cell.Col,
				NewStatus: cell.Status,
				BingoId:   cell.BingoId,
			},
		},
	})
}
