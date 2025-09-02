package domain

type Bingo struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	RoomName string `json:"room_name" gorm:"not null"`
	Team     Team   `json:"team" gorm:"not null"`
	Room     Room   `json:"room" gorm:"foreignKey:RoomId; constraint:OnDelete:CASCADE"`
	RoomId   uint   `json:"room_id" gorm:"not null"`
}

type Status uint

const (
	NON_GOT Status = iota
	GOTTEN
)

type Cell struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	Row       uint   `json:"row" gorm:"not null"`
	Col       uint   `json:"col" gorm:"not null"`
	Status    Status `json:"status" gorm:"not null"`
	Character uint   `json:"character"`
	Bingo     Bingo  `json:"bingo" gorm:"foreignKey:BingoId; constraint:OnDelete:CASCADE"`
	BingoId   uint   `json:"bingo_id" gorm:"not null"`
}

type BingoResponse struct {
	ID        uint           `json:"id"`
	RoomName  string         `json:"room_name"`
	Team      Team           `json:"team"`
	CellReses []CellResponse `json:"cell_reses"`
}

type CellResponse struct {
	ID        uint   `json:"id"`
	Row       uint   `json:"row"`
	Col       uint   `json:"col"`
	Status    Status `json:"status"`
	Character uint   `json:"character"`
	BingoId   uint   `json:"bingo_id"`
}
