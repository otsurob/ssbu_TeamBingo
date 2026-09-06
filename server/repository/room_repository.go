package repository

import (
	"errors"
	"fmt"
	"server/domain"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var ErrRoomCharacterSettingNotFound = errors.New("room character setting does not exist")

type IRoomRepository interface {
	GetRoom(room *domain.Room, roomName string) error
	GetAllRooms(rooms *[]domain.Room) error
	CreateRoom(room *domain.Room) error
	CreateRoomCharacterSettings(settings []domain.RoomCharacterSetting) error
	DeleteRoom(roomName string) error
	GetPlayer(plauers *domain.Player, roomName string, name string) error
	GetPlayers(players *[]domain.Player, roomName string) error
	CreatePlayer(player *domain.Player) error
	UpdatePlayer(player *domain.Player, roomName string, name string) error
	DeletePlayer(roomName string) error
	DeleteOnePlayer(roomName string, name string) error
	GetRoomCharacterSettings(settings *[]domain.RoomCharacterSetting, roomID uint) error
	UpdateRoomCharacterSetting(setting *domain.RoomCharacterSetting) error
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

func (rr *roomRepository) CreateRoomCharacterSettings(
	settings []domain.RoomCharacterSetting,
) error {
	for i := range settings {
		if settings[i].Include == nil {
			settings[i].Include = []uint{}
		}
		if settings[i].Exclude == nil {
			settings[i].Exclude = []uint{}
		}
	}

	return rr.db.Create(&settings).Error
}

func (rr *roomRepository) GetRoomCharacterSettings(
	settings *[]domain.RoomCharacterSetting,
	roomID uint,
) error {
	if err := rr.db.
		Where("room_id = ?", roomID).
		Order("team").
		Find(settings).Error; err != nil {
		return err
	}
	return nil
}

func (rr *roomRepository) UpdateRoomCharacterSetting(
	setting *domain.RoomCharacterSetting,
) error {
	// JSON serializer を確実に通すため、構造体で更新する。
	// room_id と team は検索条件に使い、更新対象は設定配列だけに限定する。
	updates := &domain.RoomCharacterSetting{
		Include: setting.Include,
		Exclude: setting.Exclude,
	}
	if updates.Include == nil {
		updates.Include = []uint{}
	}
	if updates.Exclude == nil {
		updates.Exclude = []uint{}
	}

	result := rr.db.
		Model(&domain.RoomCharacterSetting{}).
		Where("room_id = ? AND team = ?", setting.RoomID, setting.Team).
		Select("include", "exclude").
		Updates(updates)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected < 1 {
		return ErrRoomCharacterSettingNotFound
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

func (rr *roomRepository) UpdatePlayer(player *domain.Player, roomName string, name string) error {
	//mapで非ゼロのフィールドを更新できる。gormの仕様
	updates := map[string]interface{}{}

	// フロントの呼び出しは「チーム更新」または「名前更新」のどちらかのみ。
	// name が空でなければ名前変更として扱い、team の更新は行わない。
	// name が空ならチーム更新として扱う（team=0 も有効値のため無条件でセット）。
	if player.Name != "" {
		updates["name"] = player.Name
	} else {
		updates["team"] = player.Team
	}

	result := rr.db.Model(&domain.Player{}).Clauses(clause.Returning{}).Where("room_name=? AND name=?", roomName, name).Updates(updates)
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
	//存在しないレコード削除しようとしたらエラー。現在の仕様では使わないのでコメントアウト
	// if result.RowsAffected < 1 {
	// 	return fmt.Errorf("object does not exist")
	// }
	return nil
}

func (rr *roomRepository) DeleteOnePlayer(roomName string, name string) error {
	result := rr.db.Where("room_name=? AND name=?", roomName, name).Delete(&domain.Player{})
	if result.Error != nil {
		return result.Error
	}
	// if result.RowsAffected < 1 {
	// 	return fmt.Errorf("object does not exist")
	// }
	return nil
}
