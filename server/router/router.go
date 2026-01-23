package router

import (
	"os"
	"server/controller"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func NewRouter(bc controller.IBingoController, rc controller.IRoomController, wc controller.IWebsocketController) *echo.Echo {
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		//アクセスを許可するフロントエンドのドメインを追加
		AllowOrigins: []string{"http://localhost:3000", "http://localhost:5173", os.Getenv("FE_URL")},
		//許可するヘッダーの一覧　ヘッダー経由でcsrfトークンを受け取れるようにする
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept,
			echo.HeaderAccessControlAllowHeaders},
		//許可したいメソッド
		AllowMethods: []string{"GET", "PUT", "POST", "DELETE"},
		//クッキーの送受信を可能にするための記述
		AllowCredentials: true,
	}))
	e.GET("/bingos", bc.GetTwoBingos)
	e.POST("/createBingo", bc.CreateBingos)
	e.PUT("/updateCell", bc.UpdateCell)
	e.DELETE("/deleteBingos", bc.DeleteBingos)

	e.GET("/rooms", rc.GetAllRooms)
	e.GET("/room", rc.GetRoom)
	e.POST("/createRoom", rc.CreateRoom)
	e.DELETE("/deleteRoom", rc.DeleteRoom)
	e.GET("roomPassword", rc.CheckRoomPassword)
	e.GET("/player", rc.GetPlayer)
	e.GET("/players", rc.GetPlayers)
	e.POST("/joinPlayer", rc.CreatePlayer)
	e.PUT("/updatePlayerTeam", rc.UpdatePlayer)
	e.PUT("/dividePlayers", rc.DividePlayerTeam)
	e.DELETE("/deletePlayer", rc.DeletePlayer)
	e.DELETE("/deleteOnePlayer", rc.DeleteOnePlayer)

	e.GET("/ws", wc.Connect)
	return e
}
