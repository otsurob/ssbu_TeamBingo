package model

type Player struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name" gorm:"not null"`
	Room string `json:"room" gorm:"not null"`
	Team uint   `json:"team" gorm:"not null"`
}

type PlayerResponse struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name" gorm:"not null"`
	Team uint   `json:"team" gorm:"not null"`
}
