package websocket

import (
	"net/http"
	"os"
	"strings"

	gws "github.com/gorilla/websocket"
)

// defaultUpgrader は HTTP を WebSocket にアップグレードする。
// Echo などのフレームワーク層から呼び出すための薄いラッパー。
var defaultUpgrader = gws.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// 必要に応じてオリジン制限を調整
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		if origin == "" {
			return true
		}
		allowed := []string{
			"http://localhost:3000",
			"http://localhost:5173",
			os.Getenv("FE_URL"),
		}
		for _, a := range allowed {
			if a != "" && strings.EqualFold(origin, a) {
				return true
			}
		}
		return false
	},
}

// Upgrade は HTTP を WebSocket に変換する。
func Upgrade(w http.ResponseWriter, r *http.Request) (*gws.Conn, error) {
	return defaultUpgrader.Upgrade(w, r, nil)
}
