package main

import (
	"fmt"
	"server/db"
	"server/model"
)

func main() {
	dbConn := db.NewDB()
	defer fmt.Println("Successfully Migrated")
	defer db.CloseDB(dbConn)
	//引数にはデータベースに反映させたいモデル構造を渡す
	dbConn.AutoMigrate(&model.Bingo{}, &model.Player{})
}
