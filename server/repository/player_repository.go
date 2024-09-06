package repository

import (
	"fmt"
	"server/model"

	"gorm.io/gorm"
)

type IPlayerRepository interface {
	GetTeamPlayers(players *[]model.Player, room string, team uint) error
	CreatePlayer(player *model.Player) error
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

func (pr *playerRepository) DeletePlayer(room string) error {
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
	result := pr.db.Where("room=? AND name=? AND team=?", room, name, team).Delete(&model.Player{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return fmt.Errorf("object does not exist")
	}
	return nil
}
