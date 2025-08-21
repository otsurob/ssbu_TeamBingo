package repository

import (
	"fmt"
	"server/domain"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type IBingoRepository interface {
	GetBingo(bingo *domain.Bingo, roomName string, team domain.Team) error
	GetCells(cells *[]domain.Cell, bingoId uint) error
	CreateBingo(bingo *domain.Bingo) error
	CreateCell(cell *domain.Cell) error
	UpdateCell(bingo *domain.Cell, bingoId uint, row uint, col uint) error
	DeleteBingos(room string) error
}

type bingoRepository struct {
	db *gorm.DB
}

func NewBingoRepository(db *gorm.DB) IBingoRepository {
	return &bingoRepository{db}
}

// 部屋名からビンゴ表を得る
func (tr *bingoRepository) GetBingo(bingo *domain.Bingo, roomName string, team domain.Team) error {
	if err := tr.db.Where("room_name=? AND team=?", roomName, team).Find(bingo).Error; err != nil {
		return err
	}
	return nil
}

// ビンゴIDからマス一覧を得る
func (tr *bingoRepository) GetCells(cells *[]domain.Cell, bingoId uint) error {
	if err := tr.db.Where("bingo_id=?", bingoId).Order("row").Order("col").Find(cells).Error; err != nil {
		return err
	}
	return nil
}

func (tr *bingoRepository) CreateBingo(bingo *domain.Bingo) error {
	if err := tr.db.Create(bingo).Error; err != nil {
		return err
	}
	return nil
}

func (tr *bingoRepository) CreateCell(cell *domain.Cell) error {
	if err := tr.db.Create(cell).Error; err != nil {
		return err
	}
	return nil
}

func (tr *bingoRepository) UpdateCell(cell *domain.Cell, bingoId uint, row uint, col uint) error {
	result := tr.db.Model(cell).Clauses(clause.Returning{}).Where("bingo_id=? AND row=? AND col=?", bingoId, row, col).Update("status", cell.Status)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return fmt.Errorf("object does not exist")
	}
	return nil
}

func (tr *bingoRepository) DeleteBingos(roomName string) error {
	result := tr.db.Where("room_name=?", roomName).Delete(&domain.Bingo{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return fmt.Errorf("object does not exist")
	}
	return nil
}
