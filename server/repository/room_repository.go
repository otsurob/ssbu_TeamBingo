package repository

import (
	"fmt"
	"server/domain"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type IRoomRepository interface {
	GetRoom(room *domain.Room, roomName string) error
	GetAllRooms(rooms *[]domain.Room) error
	CreateRoom(room *domain.Room) error
	DeleteRoom(roomName string) error
	GetPlayer(plauers *domain.Player, roomName string, name string) error
	GetPlayers(players *[]domain.Player, roomName string) error
	CreatePlayer(player *domain.Player) error
	UpdatePlayerTeam(player *domain.Player, roomName string, name string) error
	DeletePlayer(roomName string) error
	DeleteOnePlayer(roomName string, name string, team uint) error
}

type roomRepository struct {
	db *gorm.DB
}

func NewRoomRepository(db *gorm.DB) IRoomRepository {
	return &roomRepository{db}
}

func (rr *roomRepository) GetRoom(room *domain.Room, roomName string) error {
	if err := rr.db.Where("room_name=?", roomName).Find(room).Error; err != nil {
		return err
	}
	return nil
}

func (rr *roomRepository) GetAllRooms(rooms *[]domain.Room) error {
	if err := rr.db.Find(rooms).Error; err != nil {
		return err
	}
	return nil
}

func (rr *roomRepository) CreateRoom(room *domain.Room) error {
	if err := rr.db.Create(room).Error; err != nil {
		return err
	}
	return nil
}

func (rr *roomRepository) DeleteRoom(roomName string) error {
	result := rr.db.Where("room_name=?", roomName).Delete(&domain.Room{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return fmt.Errorf("object does not exist")
	}
	return nil
}

func (rr *roomRepository) GetPlayer(player *domain.Player, roomName string, name string) error {
	if err := rr.db.Where("room_name=? AND name=?", roomName, name).Find(player).Error; err != nil {
		return err
	}
	return nil
}

func (rr *roomRepository) GetPlayers(players *[]domain.Player, roomName string) error {
	if err := rr.db.Where("room_name=?", roomName).Find(players).Error; err != nil {
		return err
	}
	return nil
}

func (rr *roomRepository) CreatePlayer(player *domain.Player) error {
	if err := rr.db.Create(player).Error; err != nil {
		return err
	}
	return nil
}

func (rr *roomRepository) UpdatePlayerTeam(player *domain.Player, roomName string, name string) error {
	result := rr.db.Model(player).Clauses(clause.Returning{}).Where("room_name=? AND name=?", roomName, name).Update("team", player.Team)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return fmt.Errorf("object does not exist")
	}
	return nil
}

func (rr *roomRepository) DeletePlayer(roomName string) error {
	result := rr.db.Where("room_name=?", roomName).Delete(&domain.Player{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return fmt.Errorf("object does not exist")
	}
	return nil
}

func (rr *roomRepository) DeleteOnePlayer(roomName string, name string, team uint) error {
	result := rr.db.Where("room_name=? AND name=? AND team=?", roomName, name, team).Delete(&domain.Player{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return fmt.Errorf("object does not exist")
	}
	return nil
}
