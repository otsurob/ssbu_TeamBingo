package db

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// const GO_ENV = "dev"

// 実行時に"GO_ENV=dev"として、先に指定して実行する必要がある
func NewDB() *gorm.DB {
	//環境変数が"dev"(develop)の場合、.envの内容を読み込み
	if os.Getenv("GO_ENV") == "dev" {
		// if GO_ENV == "dev" {
		err := godotenv.Load()
		if err != nil {
			log.Fatalln(err)
		}
	}
	//データベースのurl
	url := fmt.Sprintf("postgres://%s:%s@%s:%s/%s", os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PW"), os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_PORT"), os.Getenv("POSTGRES_DB"))
	//gormパッケージ内のDBという名前の構造体のアドレスが返ってくる(dbに格納)
	db, err := gorm.Open(postgres.Open(url), &gorm.Config{})
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println("Connected")
	return db
}

// データベースをcloseする
func CloseDB(db *gorm.DB) {
	sqlDB, _ := db.DB()
	if err := sqlDB.Close(); err != nil {
		log.Fatalln(err)
	}
}
