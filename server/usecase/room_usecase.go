package usecase

import (
	"errors"
	"server/domain"
	"server/repository"
)

var (
	ErrRoomAlreadyExists   = errors.New("room already exists")
	ErrPlayerAlreadyExists = errors.New("player already exists in the room")
)

type IRoomUsecase interface {
	GetAllRooms() ([]domain.RoomResponse, error)
	GetRoom(roomName string) (domain.RoomResponse, error)
	CreateRoom(room domain.Room) (domain.RoomResponse, error)
	DeleteRoom(roomName string) error
	CheckRoomPassword(roomName string, password string) (bool, error)
	GetPlayer(roomName string, name string) (domain.PlayerResponse, error)
	GetPlayers(room string) ([]domain.PlayerResponse, error)
	CreatePlayer(player domain.Player, roomName string) (domain.PlayerResponse, error)
	UpdatePlayer(player domain.Player, name string, roomName string) (domain.PlayerResponse, error)
	DividePlayerTeam(roomName string) ([]domain.PlayerResponse, error)
	DeletePlayer(room string) error
	DeleteOnePlayer(room string, name string) error
}

type roomUsecase struct {
	rr repository.IRoomRepository
	tx repository.Transaction
	ep IEventPublisher
}

func NewRoomUsecase(rr repository.IRoomRepository, tx repository.Transaction, ep IEventPublisher) IRoomUsecase {
	return &roomUsecase{rr: rr, tx: tx, ep: ep}
}

func (ru *roomUsecase) GetAllRooms() ([]domain.RoomResponse, error) {
	rooms := []domain.Room{}
	if err := ru.rr.GetAllRooms(&rooms); err != nil {
		return nil, err
	}
	//レスポンス
	resRooms := []domain.RoomResponse{}
	for _, v := range rooms {
		t := domain.RoomResponse{
			ID:       v.ID,
			RoomName: v.RoomName,
		}
		resRooms = append(resRooms, t)
	}
	return resRooms, nil
}

func (ru *roomUsecase) GetRoom(roomName string) (domain.RoomResponse, error) {
	room := domain.Room{}
	if err := ru.rr.GetRoom(&room, roomName); err != nil {
		return domain.RoomResponse{}, err
	}
	resRoom := domain.RoomResponse{
		ID:       room.ID,
		RoomName: room.RoomName,
	}
	return resRoom, nil
}

func (ru *roomUsecase) CreateRoom(room domain.Room) (domain.RoomResponse, error) {

	// 重複チェック（room_name はユニーク想定）
	existing := domain.Room{}
	if err := ru.rr.GetRoom(&existing, room.RoomName); err != nil {
		return domain.RoomResponse{}, err
	}
	if existing.ID != 0 {
		return domain.RoomResponse{}, ErrRoomAlreadyExists
	}

	if err := ru.rr.CreateRoom(&room); err != nil {
		return domain.RoomResponse{}, err
	}
	resRoom := domain.RoomResponse{
		ID:       room.ID,
		RoomName: room.RoomName,
	}
	return resRoom, nil
}

func (ru *roomUsecase) DeleteRoom(roomName string) error {
	if err := ru.rr.DeleteRoom(roomName); err != nil {
		return err
	}
	return nil
}

func (ru *roomUsecase) CheckRoomPassword(roomName string, password string) (bool, error) {
	room := domain.Room{}
	if err := ru.rr.GetRoom(&room, roomName); err != nil {
		return false, err

	}
	if room.Password == password {
		return true, nil
	}
	return false, nil
}

func (ru *roomUsecase) GetPlayer(roomName string, name string) (domain.PlayerResponse, error) {
	player := domain.Player{}
	if err := ru.rr.GetPlayer(&player, roomName, name); err != nil {
		return domain.PlayerResponse{}, err
	}
	resPlayer := domain.PlayerResponse{
		ID:       player.ID,
		Name:     player.Name,
		RoomName: player.RoomName,
		Team:     player.Team,
	}
	return resPlayer, nil
}

func (ru *roomUsecase) GetPlayers(roomName string) ([]domain.PlayerResponse, error) {
	players := []domain.Player{}
	if err := ru.rr.GetPlayers(&players, roomName); err != nil {
		return nil, err
	}
	//クライアントへのレスポンス用
	resPlayers := []domain.PlayerResponse{}
	for _, v := range players {
		t := domain.PlayerResponse{
			ID:       v.ID,
			Name:     v.Name,
			RoomName: v.RoomName,
			Team:     v.Team,
		}
		resPlayers = append(resPlayers, t)
	}
	return resPlayers, nil
}

func (ru *roomUsecase) CreatePlayer(player domain.Player, roomName string) (domain.PlayerResponse, error) {
	room := domain.Room{}
	if err := ru.rr.GetRoom(&room, roomName); err != nil {
		return domain.PlayerResponse{}, err
	}
	player.RoomId = room.ID

	// 同一ルーム内での名前重複チェック
	existing := domain.Player{}
	if err := ru.rr.GetPlayer(&existing, roomName, player.Name); err != nil {
		return domain.PlayerResponse{}, err
	}
	if existing.ID != 0 {
		return domain.PlayerResponse{}, ErrPlayerAlreadyExists
	}

	if err := ru.rr.CreatePlayer(&player); err != nil {
		return domain.PlayerResponse{}, err
	}
	resPlayer := domain.PlayerResponse{
		ID:       player.ID,
		Name:     player.Name,
		RoomName: player.RoomName,
		Team:     player.Team,
	}

	if ru.ep != nil {
		if err := ru.ep.PushPlayerJoined(roomName, player); err != nil {
			return domain.PlayerResponse{}, err
		}
	}

	return resPlayer, nil
}

func (ru *roomUsecase) UpdatePlayer(player domain.Player, name string, roomName string) (domain.PlayerResponse, error) {
	var updatedPlayer domain.Player

	err := ru.tx.DoRoom(func(rr repository.IRoomRepository) error {
		// まず更新
		if err := rr.UpdatePlayer(&player, roomName, name); err != nil {
			return err
		}
		// 更新後の正しい値を取得してイベント用に使う
		if err := rr.GetPlayer(&updatedPlayer, roomName, name); err != nil {
			return err
		}
		return nil
	})
	if err != nil {
		return domain.PlayerResponse{}, err
	}

	playerRes := domain.PlayerResponse{
		ID:       updatedPlayer.ID,
		Name:     updatedPlayer.Name,
		RoomName: updatedPlayer.RoomName,
		Team:     updatedPlayer.Team,
	}

	if ru.ep != nil {
		if err := ru.ep.PushPlayerTeamUpdated(roomName, updatedPlayer); err != nil {
			return domain.PlayerResponse{}, err
		}
	}

	return playerRes, nil
}

func (ru *roomUsecase) DividePlayerTeam(roomName string) ([]domain.PlayerResponse, error) {
	//部屋のプレイヤー一覧を取得
	// players := []domain.Player{}
	// if err := ru.rr.GetPlayers(&players, roomName); err != nil {
	// 	return []domain.PlayerResponse{}, err
	// }
	playerReses := []domain.PlayerResponse{}
	updates := []domain.PlayerTeamUpdate{}

	err := ru.tx.DoRoom(func(rr repository.IRoomRepository) error {
		players := []domain.Player{}
		if err := rr.GetPlayers(&players, roomName); err != nil {
			return err
		}

		newPlayers := domain.RandomTeamSepalator(players)
		for i, v := range newPlayers {
			v.Team = domain.Team(i % 2)
			// Divide はチームだけを更新したいので、Name は空にして team 更新を選択させる
			updateTarget := v
			updateTarget.Name = ""
			if err := rr.UpdatePlayer(&updateTarget, roomName, v.Name); err != nil {
				return err
			}
			playerRes := domain.PlayerResponse{
				ID:       v.ID,
				Name:     v.Name,
				RoomName: v.RoomName,
				Team:     v.Team,
			}
			playerReses = append(playerReses, playerRes)
			updates = append(updates, domain.PlayerTeamUpdate{
				ID:       v.ID,
				Name:     v.Name,
				RoomName: v.RoomName,
				NewTeam:  v.Team,
			})
		}
		return nil
	})
	if err != nil {
		return nil, err
	}

	if ru.ep != nil {
		if err := ru.ep.PushTeamsShuffled(roomName, updates); err != nil {
			return nil, err
		}
	}

	return playerReses, nil
}

func (ru *roomUsecase) DeletePlayer(roomName string) error {
	if err := ru.rr.DeletePlayer(roomName); err != nil {
		return err
	}
	return nil
}

func (ru *roomUsecase) DeleteOnePlayer(roomName string, name string) error {
	if err := ru.rr.DeleteOnePlayer(roomName, name); err != nil {
		return err
	}
	return nil
}
