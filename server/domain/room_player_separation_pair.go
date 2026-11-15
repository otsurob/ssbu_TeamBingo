package domain

import "time"

// RoomPlayerSeparationPair は、同じルーム内で別チームにするプレイヤーの
// ペアを保持する。
type RoomPlayerSeparationPair struct {
	ID uint `json:"id" gorm:"primaryKey"`

	RoomID uint `json:"room_id" gorm:"not null;uniqueIndex:idx_room_player_separation_pairs_players"`
	Room   Room `json:"-" gorm:"foreignKey:RoomID;constraint:OnDelete:CASCADE"`

	PlayerAID uint   `json:"player_a_id" gorm:"not null;uniqueIndex:idx_room_player_separation_pairs_players;check:player_separation_pair_order,player_a_id < player_b_id"`
	PlayerA   Player `json:"-" gorm:"foreignKey:PlayerAID;constraint:OnDelete:CASCADE"`
	PlayerBID uint   `json:"player_b_id" gorm:"not null;uniqueIndex:idx_room_player_separation_pairs_players"`
	PlayerB   Player `json:"-" gorm:"foreignKey:PlayerBID;constraint:OnDelete:CASCADE"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (RoomPlayerSeparationPair) TableName() string {
	return "room_player_separation_pairs"
}
