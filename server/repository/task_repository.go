package repository

import (
	"fmt"
	"server/domain"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ITaskRepository interface {
	GetAllTasks(tasks *[]domain.Bingo, room string) error
	CreateTask(task *domain.Bingo) error
	UpdateTask(task *domain.Bingo, room string, team uint, locate uint) error
	DeleteTask(room string) error
}

type taskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) ITaskRepository {
	return &taskRepository{db}
}

// Find で見つけたtasksの構造体を、引数で受け取ったtasksのポインタが指し示す先に書き込む
// そのために引数はポインタだった
func (tr *taskRepository) GetAllTasks(tasks *[]domain.Bingo, room string) error {
	if err := tr.db.Where("room=?", room).Order("team").Order("locate").Find(tasks).Error; err != nil {
		return err
	}
	return nil
}

func (tr *taskRepository) CreateTask(task *domain.Bingo) error {
	if err := tr.db.Create(task).Error; err != nil {
		return err
	}
	return nil
}

func (tr *taskRepository) UpdateTask(task *domain.Bingo, room string, team uint, locate uint) error {
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
	result := tr.db.Where("room=?", room).Delete(&domain.Bingo{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return fmt.Errorf("object does not exist")
	}
	return nil
}
