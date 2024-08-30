package repository

import (
	"fmt"
	"server/model"

	"gorm.io/gorm"
)

type IPlayerRepository interface {
	GetTeamPlayers(players *[]model.Player, room string, team uint) error
	CreatePlayer(player *model.Player) error
	// UpdatePlayer(player *model.Player, room string, team uint, locate uint) error
	DeletePlayer(room string) error
	DeleteOnePlayer(room string, name string, team uint) error
}

type playerRepository struct {
	db *gorm.DB
}

func NewPlayerRepository(db *gorm.DB) IPlayerRepository {
	return &playerRepository{db}
}

func (pr *playerRepository) GetTeamPlayers(players *[]model.Player, room string, team uint) error {
	// if err := pr.db.Joins("User").Where("user_id=?", userId).Order("created_at").Find(players).Error; err != nil {
	if err := pr.db.Where("room=? AND team=?", room, team).Find(players).Error; err != nil {
		return err
	}
	return nil
}

func (pr *playerRepository) CreatePlayer(player *model.Player) error {
	if err := pr.db.Create(player).Error; err != nil {
		return err
	}
	return nil
}

// func (pr *playerRepository) UpdatePlayer(player *model.Player, room string, team uint, locate uint) error {
// 	result := pr.db.Model(player).Clauses(clause.Returning{}).Where("room=? AND team=? AND locate=?", room, team, locate).Update("status", player.Status)
// 	if result.Error != nil {
// 		return result.Error
// 	}
// 	if result.RowsAffected < 1 {
// 		return fmt.Errorf("object does not exist")
// 	}
// 	return nil
// }

func (pr *playerRepository) DeletePlayer(room string) error {
	// result := pr.db.Where("id=? AND user_id=?", playerId, userId).Delete(&model.Player{})
	result := pr.db.Where("room=?", room).Delete(&model.Player{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return fmt.Errorf("object does not exist")
	}
	return nil
}

func (pr *playerRepository) DeleteOnePlayer(room string, name string, team uint) error {
	// result := pr.db.Where("id=? AND user_id=?", playerId, userId).Delete(&model.Player{})
	result := pr.db.Where("room=? AND name=? AND team=?", room, name, team).Delete(&model.Player{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return fmt.Errorf("object does not exist")
	}
	return nil
}
