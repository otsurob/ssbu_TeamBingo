package websocket

import (
	"net/http"
	"net/url"
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
			"http://127.0.0.1:3000",
			"http://127.0.0.1:5173",
			os.Getenv("FE_URL"),
		}

		for _, a := range allowed {
			if a == "" {
				continue
			}
			if strings.EqualFold(origin, a) {
				return true
			}
			au, err1 := url.Parse(a)
			ou, err2 := url.Parse(origin)
			if err1 == nil && err2 == nil && strings.EqualFold(au.Host, ou.Host) {
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
