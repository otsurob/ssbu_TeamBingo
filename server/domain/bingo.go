package domain

type Bingo struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	RoomId string `json:"roomid" gorm:"not null"`
	Team   Team   `json:"team" gorm:"not null"`
}

type Cell struct {
	ID        uint `json:"id" gorm:"primaryKey"`
	Row       uint `json:"row" gorm:"not null"`
	Column    uint `json:"column" gorm:"not null"`
	Status    uint `json:"status" gorm:"not null"`
	Character uint `json:"character"`
}

// type BingoResponse struct {
// 	ID        uint `json:"id" gorm:"primaryKey"`
// 	Team      uint `json:"team" gorm:"not null"`
// 	Locate    uint `json:"locate" gorm:"not null"`
// 	Status    uint `json:"status" gorm:"not null"`
// 	Character uint `json:"character"`
// }
