package main

import (
	"server/controller"
	"server/db"
	"server/repository"
	"server/router"
	"server/usecase"
	// "server/validator"
)

func main() {
	db := db.NewDB()
	// userValidator := validator.NewUserValidator()
	// taskValidator := validator.NewTaskValidator()
	roomRepository := repository.NewRoomRepository(db)
	bingoRepository := repository.NewBingoRepository(db)
	tx := repository.NewGormTransaction(db)
	roomUsecase := usecase.NewRoomUsecase(roomRepository, tx)
	bingoUsecase := usecase.NewBingoUsecase(bingoRepository, roomRepository, tx)
	roomController := controller.NewRoomController(roomUsecase)
	bingoController := controller.NewBingoController(bingoUsecase)
	e := router.NewRouter(bingoController, roomController)
	//echoのStart関数でサーバーを立ち上げる　今回はポート番号8080　エラーが起きたらlogに表示して強制終了
	e.Logger.Fatal(e.Start(":8080"))
}
