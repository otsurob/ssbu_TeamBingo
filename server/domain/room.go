package domain

type Room struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Name     string `json:"name" gorm:"not null"`
	Password string `json:"password" gorm:"not null"`
}

type Team uint

const (
	TeamA Team = iota
	TeamB
)

type Player struct {
	ID     uint   `json:"id" gorm:"primaryKey"`
	Name   string `json:"name" gorm:"not null"`
	RoomId string `json:"roomid" gorm:"not null"`
	Team   Team   `json:"team" gorm:"not null"`
}

// type PlayerResponse struct {
// 	ID   uint   `json:"id" gorm:"primaryKey"`
// 	Name string `json:"name" gorm:"not null"`
// 	Team Team   `json:"team" gorm:"not null"`
// }
