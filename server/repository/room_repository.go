package repository

import (
	"fmt"
	"server/domain"

	"gorm.io/gorm"
)

type IRoomRepository interface {
	GetRoom(room *domain.Room, roomName string) error
	GetAllRooms(rooms *[]domain.Room) error
	CreateRoom(room *domain.Room) error
	DeleteRoom(roomName string) error
	GetTeamPlayers(players *[]domain.Player, room string, team uint) error
	CreatePlayer(player *domain.Player) error
	DeletePlayer(room string) error
	DeleteOnePlayer(room string, name string, team uint) error
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

func (rr *roomRepository) GetTeamPlayers(players *[]domain.Player, room string, team uint) error {
	if err := rr.db.Where("room_name=? AND team=?", room, team).Find(players).Error; err != nil {
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

func (rr *roomRepository) DeletePlayer(room string) error {
	result := rr.db.Where("room_name=?", room).Delete(&domain.Player{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return fmt.Errorf("object does not exist")
	}
	return nil
}

func (rr *roomRepository) DeleteOnePlayer(room string, name string, team uint) error {
	result := rr.db.Where("room_name=? AND name=? AND team=?", room, name, team).Delete(&domain.Player{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return fmt.Errorf("object does not exist")
	}
	return nil
}
