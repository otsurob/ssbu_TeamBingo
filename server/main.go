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
	// userRepository := repository.NewUserRepository(db)
	taskRepository := repository.NewTaskRepository(db)
	// userUsecase := usecase.NewUserUsecase(userRepository, userValidator)
	taskUsecase := usecase.NewTaskUsecase(taskRepository, taskValidator)
	// userController := controller.NewUserController(userUsecase)
	taskController := controller.NewTaskController(taskUsecase)
	e := router.NewRouter(taskController)
	//echoのStart関数でサーバーを立ち上げる　今回はポート番号8080　エラーが起きたらlogに表示して強制終了
	e.Logger.Fatal(e.Start(":8080"))
}
