package websocket

import (
	"log"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

// Client は1本の WebSocket 接続を表す。
type Client struct {
	hub  *Hub
	conn *websocket.Conn
	send chan []byte
	room string
}

func newClient(h *Hub, conn *websocket.Conn, room string) *Client {
	return &Client{
		hub:  h,
		conn: conn,
		send: make(chan []byte, 16),
		room: room,
	}
}

// readPump はクライアントからのメッセージを読み、エラーで終了したら unregister する。
// 今回は受信データを扱わないので破棄する。
func (c *Client) readPump() {
	defer func() {
		c.hub.Unregister(c)
		_ = c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	_ = c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		return c.conn.SetReadDeadline(time.Now().Add(pongWait))
	})
	for {
		if _, _, err := c.conn.ReadMessage(); err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("websocket read error: %v", err)
			}
			break
		}
	}
}

// writePump は send チャンネルの内容をクライアントへ書き込む。
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		_ = c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				_ = c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			if _, err := w.Write(message); err != nil {
				return
			}
			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// Serve は与えられた接続を Hub に登録し、入出力 goroutine を開始する。
func Serve(h *Hub, conn *websocket.Conn, room string) {
	client := newClient(h, conn, room)
	h.Register(client)
	go client.writePump()
	go client.readPump()
}
