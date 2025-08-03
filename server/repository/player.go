package repository

type Team uint

const (
	TeamA Team = iota
	TeamB
)

type Player struct {
	ID         uint   `json:"id" gorm:"primaryKey"`
	PlayerName string `json:"playerName" gorm:"not null"`
	RoomId     string `json:"roomId" gorm:"not null"`
	Team       Team   `json:"team" gorm:"not null"`
}

type PlayerResponse struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name" gorm:"not null"`
	Team Team   `json:"team" gorm:"not null"`
}
