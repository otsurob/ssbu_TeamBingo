package repository

import (
	"fmt"
	"server/model"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ITaskRepository interface {
	GetAllTasks(tasks *[]model.Bingo, room string) error
	CreateTask(task *model.Bingo) error
	UpdateTask(task *model.Bingo, room string, team uint, locate uint) error
	DeleteTask(room string) error
}

type taskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) ITaskRepository {
	return &taskRepository{db}
}

func (tr *taskRepository) GetAllTasks(tasks *[]model.Bingo, room string) error {
	if err := tr.db.Where("room=?", room).Order("team").Order("locate").Find(tasks).Error; err != nil {
		return err
	}
	return nil
}

func (tr *taskRepository) CreateTask(task *model.Bingo) error {
	if err := tr.db.Create(task).Error; err != nil {
		return err
	}
	return nil
}

func (tr *taskRepository) UpdateTask(task *model.Bingo, room string, team uint, locate uint) error {
	result := tr.db.Model(task).Clauses(clause.Returning{}).Where("room=? AND team=? AND locate=?", room, team, locate).Update("status", task.Status)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return fmt.Errorf("object does not exist")
	}
	return nil
}

func (tr *taskRepository) DeleteTask(room string) error {
	result := tr.db.Where("room=?", room).Delete(&model.Bingo{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return fmt.Errorf("object does not exist")
	}
	return nil
}
