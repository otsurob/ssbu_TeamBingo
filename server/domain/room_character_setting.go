package domain

import "time"

// RoomCharacterSetting stores the character filters used when generating a
// bingo board for one team in a room.
type RoomCharacterSetting struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	RoomID    uint      `json:"room_id" gorm:"not null;uniqueIndex:idx_room_character_settings_room_team"`
	Room      Room      `json:"-" gorm:"foreignKey:RoomID;constraint:OnDelete:CASCADE"`
	Team      Team      `json:"team" gorm:"not null;uniqueIndex:idx_room_character_settings_room_team"`
	Include   []uint    `json:"include" gorm:"type:jsonb;serializer:json;not null"`
	Exclude   []uint    `json:"exclude" gorm:"type:jsonb;serializer:json;not null"`
	Version   uint      `json:"version" gorm:"not null;default:1"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// 構造体が使うテーブル名を明示。GORMがよしなに推測してくれるので必須ではない
func (RoomCharacterSetting) TableName() string {
	return "room_character_settings"
}
