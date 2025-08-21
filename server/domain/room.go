package domain

type Room struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	RoomName string `json:"room_name" gorm:"not null"`
	Password string `json:"password" gorm:"not null"`
}

type Team uint

const (
	TeamA Team = iota
	TeamB
)

type Player struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Name     string `json:"name" gorm:"not null"`
	RoomName string `json:"room_name" gorm:"not null"`
	Team     Team   `json:"team" gorm:"not null"`
	Room     Room   `json:"room" gorm:"foreignKey:RoomId; constraint:OnDelete:CASCADE"`
	RoomId   uint   `json:"room_id" gorm:"not null"`
}

type RoomResponse struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	RoomName string `json:"room_name" gorm:"not null"`
}

type PlayerResponse struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Name     string `json:"name" gorm:"not null"`
	RoomName string `json:"room_name" gorm:"not null"`
	Team     Team   `json:"team" gorm:"not null"`
}
