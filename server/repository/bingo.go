package repository

type Bingo struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	RoomId string `json:"roomId" gorm:"not null"`
	Team   uint   `json:"team" gorm:"not null"`
	Grids  []Grid `json:"grid" gorm:"not null"`
}

type Grid struct {
	ID        uint `json:"id" gorm:"primaryKey"`
	BingoId   uint `json:"bingoId" gorm:"not null"`
	Column    uint `json:"column" gorm:"not null"` //ビンゴ表の列番号
	Row       uint `json:"row" gorm:"not null"`    //ビンゴ表の行番号
	Character uint `json:"character"`
	Status    uint `json:"status"`
}
