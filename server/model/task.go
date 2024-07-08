package model

type Bingo struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	Room      string `json:"room" gorm:"not null"`
	Team      uint   `json:"team" gorm:"not null"`
	Locate    uint   `json:"locate" gorm:"not null"`
	Status    uint   `json:"status" gorm:"not null"`
	Character uint   `json:"character"`
}

type BingoResponse struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	Room      string `json:"room" gorm:"not null"`
	Team      uint   `json:"team" gorm:"not null"`
	Locate    uint   `json:"locate" gorm:"not null"`
	Status    uint   `json:"status" gorm:"not null"`
	Character uint   `json:"character"`
}
