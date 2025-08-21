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
	playerRepository := repository.NewRoomRepository(db)
	bingoRepository := repository.NewBingoRepository(db)
	playerUsecase := usecase.NewRoomUsecase(playerRepository)
	bingoUsecase := usecase.NewBingoUsecase(bingoRepository, playerRepository)
	playerController := controller.NewRoomController(playerUsecase)
	taskController := controller.NewBingoController(bingoUsecase)
	e := router.NewRouter(taskController, playerController)
	//echoのStart関数でサーバーを立ち上げる　今回はポート番号8080　エラーが起きたらlogに表示して強制終了
	e.Logger.Fatal(e.Start(":8080"))
}
