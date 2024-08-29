package main

import (
	"server/controller"
	"server/db"
	"server/repository"
	"server/router"
	"server/usecase"
	"server/validator"
)

func main() {
	db := db.NewDB()
	// userValidator := validator.NewUserValidator()
	taskValidator := validator.NewTaskValidator()
	playerRepository := repository.NewPlayerRepository(db)
	taskRepository := repository.NewTaskRepository(db)
	playerUsecase := usecase.NewPlayerUsecase(playerRepository)
	taskUsecase := usecase.NewTaskUsecase(taskRepository, taskValidator)
	playerController := controller.NewPlayerController(playerUsecase)
	taskController := controller.NewTaskController(taskUsecase)
	e := router.NewRouter(taskController, playerController)
	//echoのStart関数でサーバーを立ち上げる　今回はポート番号8080　エラーが起きたらlogに表示して強制終了
	e.Logger.Fatal(e.Start(":8080"))
}
