package websocket

import "sync"

// Hub は room 単位でクライアントを管理し、メッセージをブロードキャストする。
// gorilla/websocket の chat example をルーム対応させたもの。
type Hub struct {
	mu         sync.RWMutex
	rooms      map[string]map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan *message
}

type message struct {
	room string
	data []byte
}

func NewHub() *Hub {
	return &Hub{
		rooms:      make(map[string]map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan *message, 32),
	}
}

// Run は Hub のメインループ。別 goroutine で動かす。
func (h *Hub) Run() {
	for {
		select {
		case c := <-h.register:
			h.addClient(c)
		case c := <-h.unregister:
			h.removeClient(c)
		case m := <-h.broadcast:
			h.sendToRoom(m.room, m.data)
		}
	}
}

func (h *Hub) addClient(c *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if _, ok := h.rooms[c.room]; !ok {
		h.rooms[c.room] = make(map[*Client]bool)
	}
	h.rooms[c.room][c] = true
}

func (h *Hub) removeClient(c *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if clients, ok := h.rooms[c.room]; ok {
		if _, exists := clients[c]; exists {
			delete(clients, c)
			close(c.send)
		}
		if len(clients) == 0 {
			delete(h.rooms, c.room)
		}
	}
}

func (h *Hub) sendToRoom(room string, data []byte) {
	h.mu.RLock()
	clients := h.rooms[room]
	h.mu.RUnlock()

	for c := range clients {
		select {
		case c.send <- data:
		default:
			// バックプレッシャーがたまったクライアントは切断
			go func(cl *Client) { h.unregister <- cl }(c)
		}
	}
}

// Broadcast はルームを指定してメッセージを投入する。
func (h *Hub) Broadcast(room string, data []byte) {
	h.broadcast <- &message{room: room, data: data}
}

// Register/Unregister はクライアントの登録解除をキューに入れる。
func (h *Hub) Register(c *Client)   { h.register <- c }
func (h *Hub) Unregister(c *Client) { h.unregister <- c }
