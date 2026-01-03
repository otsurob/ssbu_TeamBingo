package websocket

import (
	"encoding/json"
	"errors"

	"server/domain"
)

// Pusher は domain.Pusher を gorilla WebSocket Hub に橋渡しする。
type Pusher struct {
	hub *Hub
}

func NewPusher(h *Hub) *Pusher {
	return &Pusher{hub: h}
}

func (p *Pusher) Push(push *domain.PushEvent) error {
	if push == nil || push.Event == nil {
		return errors.New("push event is empty")
	}
	payload, err := json.Marshal(push.Event)
	if err != nil {
		return err
	}
	p.hub.Broadcast(push.RoomName, payload)
	return nil
}
