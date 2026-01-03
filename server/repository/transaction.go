package repository

import "gorm.io/gorm"

// Transaction は「トランザクション境界」を提供するためのインターフェースです。
// usecase 側は *gorm.DB を知らずに、Do の中で repo を使って更新処理を書けます。
type Transaction interface {
	DoRoom(fn func(rr IRoomRepository) error) error
	DoBingo(fn func(br IBingoRepository, rr IRoomRepository) error) error
}

type gormTransaction struct {
	db *gorm.DB
}

func NewGormTransaction(db *gorm.DB) Transaction {
	return &gormTransaction{db: db}
}

// DoRoom は RoomRepository を使う処理をトランザクションでまとめます。
func (gt *gormTransaction) DoRoom(fn func(rr IRoomRepository) error) error {
	return gt.db.Transaction(func(tx *gorm.DB) error {
		rr := NewRoomRepository(tx) // tx を使う repo を生成
		return fn(rr)
	})
}

// DoBingo は BingoRepository と RoomRepository を同一トランザクションで扱います。
func (gt *gormTransaction) DoBingo(fn func(br IBingoRepository, rr IRoomRepository) error) error {
	return gt.db.Transaction(func(tx *gorm.DB) error {
		br := NewBingoRepository(tx)
		rr := NewRoomRepository(tx)
		return fn(br, rr)
	})
}
