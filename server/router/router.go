package router

import (
	"os"
	"server/controller"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func NewRouter(tc controller.ITaskController, pc controller.IPlayerController) *echo.Echo {
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		//アクセスを許可するフロントエンドのドメインを追加
		AllowOrigins: []string{"http://localhost:3000", os.Getenv("FE_URL")},
		//許可するヘッダーの一覧　ヘッダー経由でcsrfトークンを受け取れるようにする
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept,
			echo.HeaderAccessControlAllowHeaders},
		//許可したいメソッド
		AllowMethods: []string{"GET", "PUT", "POST", "DELETE"},
		//クッキーの送受信を可能にするための記述
		AllowCredentials: true,
	}))
	//作成したエコーのインスタンスに対してエンドポイントを追加していく
	//例えば、signupのエンドポイントにリクエストがあった場合はSignUpメソッドを呼び出す
	e.GET("/bingo", tc.GetAllTasks)
	e.POST("/create", tc.CreateTask)
	e.PUT("/update", tc.UpdateTask)
	e.DELETE("/:room", tc.DeleteTask)

	e.GET("/player", pc.GetTeamPlayers)
	e.POST("/joinPlayer", pc.CreatePlayer)
	e.DELETE("/leavePlayer/:room", pc.DeletePlayer)
	e.DELETE("/leaveOnePlayer", pc.DeleteOnePlayer)
	return e
}
