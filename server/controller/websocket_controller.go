package controller

import (
	"net/http"
	"server/websocket"

	"github.com/labstack/echo/v4"
)

type IWebsocketController interface {
	Connect(c echo.Context) error
}

type websocketController struct {
	hub *websocket.Hub
}

func NewWebsocketController(hub *websocket.Hub) IWebsocketController {
	return &websocketController{hub: hub}
}

// Connect は HTTP を WebSocket にアップグレードし、ルームに参加させる。
func (wc *websocketController) Connect(c echo.Context) error {
	room := c.QueryParam("room")
	if room == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "room is required")
	}

	conn, err := websocket.Upgrade(c.Response(), c.Request())
	if err != nil {
		return err
	}

	websocket.Serve(wc.hub, conn, room)
	return nil
}
