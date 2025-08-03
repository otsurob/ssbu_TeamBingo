package domain

type BingoResponse struct {
	ID        uint `json:"id" gorm:"primaryKey"`
	Team      uint `json:"team" gorm:"not null"`
	Locate    uint `json:"locate" gorm:"not null"`
	Status    uint `json:"status" gorm:"not null"`
	Character uint `json:"character"`
}

type Bingo struct {
	team uint
	grid []Grid
}

type Grid struct {
	Column    uint //ビンゴ表の列番号
	Row       uint //ビンゴ表の行番号
	Character uint
	Status    uint
}
