package main

import (
	"server/controller"
	"server/db"
	"server/repository"
	"server/router"
	"server/usecase"
	"server/websocket"
	// "server/validator"
)

func main() {
	db := db.NewDB()
	// userValidator := validator.NewUserValidator()
	// taskValidator := validator.NewTaskValidator()
	roomRepository := repository.NewRoomRepository(db)
	bingoRepository := repository.NewBingoRepository(db)
	tx := repository.NewGormTransaction(db)
	hub := websocket.NewHub()
	go hub.Run()
	pusher := websocket.NewPusher(hub)
	eventPublisher := usecase.NewEventPublisher(pusher)
	roomUsecase := usecase.NewRoomUsecase(roomRepository, tx, eventPublisher)
	bingoUsecase := usecase.NewBingoUsecase(bingoRepository, roomRepository, tx, eventPublisher)
	roomController := controller.NewRoomController(roomUsecase)
	bingoController := controller.NewBingoController(bingoUsecase)
	websocketController := controller.NewWebsocketController(hub)
	e := router.NewRouter(bingoController, roomController, websocketController)
	//echoのStart関数でサーバーを立ち上げる　今回はポート番号8080　エラーが起きたらlogに表示して強制終了
	e.Logger.Fatal(e.Start(":8080"))
}
