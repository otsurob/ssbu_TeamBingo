package usecase

import (
	"errors"
	"server/domain"
	"server/repository"
)

var (
	ErrRoomAlreadyExists                     = errors.New("room already exists")
	ErrRoomNotFound                          = errors.New("room does not exist")
	ErrRoomCharacterSettingNotFound          = errors.New("room character setting does not exist")
	ErrRoomPlayerSeparationPairNotFound      = errors.New("room player separation pair does not exist")
	ErrRoomPlayerSeparationPairAlreadyExists = errors.New("room player separation pair already exists")
	ErrPlayerAlreadyInSeparationPair         = errors.New("player already belongs to a separation pair")
	ErrInvalidPlayerSeparationPair           = errors.New("invalid player separation pair")
	ErrPlayerAlreadyExists                   = errors.New("player already exists in the room")
	ErrInvalidTeam                           = errors.New("invalid team")
	ErrInvalidTeamSeparationPair             = errors.New("invalid team separation pair")
)

type IRoomUsecase interface {
	GetAllRooms() ([]domain.RoomResponse, error)
	GetRoom(roomName string) (domain.RoomResponse, error)
	CreateRoom(room domain.Room) (domain.RoomResponse, error)
	GetRoomCharacterSettings(roomName string) ([]domain.RoomCharacterSetting, error)
	UpdateRoomCharacterSetting(setting domain.RoomCharacterSetting, roomName string) error
	GetRoomPlayerSeparationPairs(roomName string) ([]domain.RoomPlayerSeparationPair, error)
	CreateRoomPlayerSeparationPair(pair domain.RoomPlayerSeparationPair, roomName string) (domain.RoomPlayerSeparationPair, error)
	DeleteRoomPlayerSeparationPair(pairID uint, roomName string) error
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

	// ルームと2チーム分のキャラクター設定を同じトランザクションで作成する。
	err := ru.tx.DoRoom(func(rr repository.IRoomRepository) error {
		if err := rr.CreateRoom(&room); err != nil {
			return err
		}

		settings := []domain.RoomCharacterSetting{
			{
				RoomID:  room.ID,
				Team:    domain.TeamA,
				Include: []uint{},
				Exclude: []uint{},
			},
			{
				RoomID:  room.ID,
				Team:    domain.TeamB,
				Include: []uint{},
				Exclude: []uint{},
			},
		}
		return rr.CreateRoomCharacterSettings(settings)
	})
	if err != nil {
		return domain.RoomResponse{}, err
	}
	resRoom := domain.RoomResponse{
		ID:       room.ID,
		RoomName: room.RoomName,
	}
	return resRoom, nil
}

func (ru *roomUsecase) GetRoomCharacterSettings(roomName string) ([]domain.RoomCharacterSetting, error) {
	room := domain.Room{}
	if err := ru.rr.GetRoom(&room, roomName); err != nil {
		return nil, err
	}
	if room.ID == 0 {
		return nil, ErrRoomNotFound
	}

	settings := []domain.RoomCharacterSetting{}
	if err := ru.rr.GetRoomCharacterSettings(&settings, room.ID); err != nil {
		return nil, err
	}
	return settings, nil
}

// updateなので一旦return nilで実装。更新した値必要そうなら返す
func (ru *roomUsecase) UpdateRoomCharacterSetting(
	setting domain.RoomCharacterSetting,
	roomName string,
) error {
	if setting.Team != domain.TeamA && setting.Team != domain.TeamB {
		return ErrInvalidTeam
	}

	room := domain.Room{}
	if err := ru.rr.GetRoom(&room, roomName); err != nil {
		return err
	}
	if room.ID == 0 {
		return ErrRoomNotFound
	}

	setting.RoomID = room.ID
	if err := ru.rr.UpdateRoomCharacterSetting(&setting); err != nil {
		if errors.Is(err, repository.ErrRoomCharacterSettingNotFound) {
			return ErrRoomCharacterSettingNotFound
		}
		return err
	}
	return nil
}

func (ru *roomUsecase) GetRoomPlayerSeparationPairs(
	roomName string,
) ([]domain.RoomPlayerSeparationPair, error) {
	room := domain.Room{}
	if err := ru.rr.GetRoom(&room, roomName); err != nil {
		return nil, err
	}
	if room.ID == 0 {
		return nil, ErrRoomNotFound
	}

	pairs := []domain.RoomPlayerSeparationPair{}
	if err := ru.rr.GetRoomPlayerSeparationPairs(&pairs, room.ID); err != nil {
		return nil, err
	}
	return pairs, nil
}

func (ru *roomUsecase) CreateRoomPlayerSeparationPair(
	pair domain.RoomPlayerSeparationPair,
	roomName string,
) (domain.RoomPlayerSeparationPair, error) {
	if pair.PlayerAID == 0 || pair.PlayerBID == 0 || pair.PlayerAID == pair.PlayerBID {
		return domain.RoomPlayerSeparationPair{}, ErrInvalidPlayerSeparationPair
	}
	if pair.PlayerAID > pair.PlayerBID {
		pair.PlayerAID, pair.PlayerBID = pair.PlayerBID, pair.PlayerAID
	}

	createdPair := domain.RoomPlayerSeparationPair{}
	err := ru.tx.DoRoom(func(rr repository.IRoomRepository) error {
		room := domain.Room{}
		if err := rr.GetRoomForUpdate(&room, roomName); err != nil {
			return err
		}
		if room.ID == 0 {
			return ErrRoomNotFound
		}

		players := []domain.Player{}
		if err := rr.GetPlayers(&players, roomName); err != nil {
			return err
		}
		playerIDs := make(map[uint]struct{}, len(players))
		for _, player := range players {
			playerIDs[player.ID] = struct{}{}
		}
		if _, exists := playerIDs[pair.PlayerAID]; !exists {
			return ErrInvalidPlayerSeparationPair
		}
		if _, exists := playerIDs[pair.PlayerBID]; !exists {
			return ErrInvalidPlayerSeparationPair
		}

		existingPairs := []domain.RoomPlayerSeparationPair{}
		if err := rr.GetRoomPlayerSeparationPairs(&existingPairs, room.ID); err != nil {
			return err
		}
		for _, existingPair := range existingPairs {
			if existingPair.PlayerAID == pair.PlayerAID && existingPair.PlayerBID == pair.PlayerBID {
				return ErrRoomPlayerSeparationPairAlreadyExists
			}
			if existingPair.PlayerAID == pair.PlayerAID ||
				existingPair.PlayerBID == pair.PlayerAID ||
				existingPair.PlayerAID == pair.PlayerBID ||
				existingPair.PlayerBID == pair.PlayerBID {
				return ErrPlayerAlreadyInSeparationPair
			}
		}

		pair.RoomID = room.ID
		if err := rr.CreateRoomPlayerSeparationPair(&pair); err != nil {
			return err
		}
		createdPair = pair
		return nil
	})
	if err != nil {
		return domain.RoomPlayerSeparationPair{}, err
	}
	return createdPair, nil
}

func (ru *roomUsecase) DeleteRoomPlayerSeparationPair(pairID uint, roomName string) error {
	return ru.tx.DoRoom(func(rr repository.IRoomRepository) error {
		room := domain.Room{}
		if err := rr.GetRoom(&room, roomName); err != nil {
			return err
		}
		if room.ID == 0 {
			return ErrRoomNotFound
		}

		if err := rr.DeleteRoomPlayerSeparationPair(pairID, room.ID); err != nil {
			if errors.Is(err, repository.ErrRoomPlayerSeparationPairNotFound) {
				return ErrRoomPlayerSeparationPairNotFound
			}
			return err
		}
		return nil
	})
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

		separationPairs := []domain.RoomPlayerSeparationPair{}
		if len(players) > 0 {
			if err := rr.GetRoomPlayerSeparationPairs(&separationPairs, players[0].RoomId); err != nil {
				return err
			}
		}

		newPlayers, err := domain.RandomTeamSeparator(players, separationPairs)
		if err != nil {
			if errors.Is(err, domain.ErrInvalidTeamSeparationPair) {
				return ErrInvalidTeamSeparationPair
			}
			return err
		}
		for _, v := range newPlayers {
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
	var leftPlayer domain.Player
	if err := ru.rr.GetPlayer(&leftPlayer, roomName, name); err != nil {
		return err
	}
	if err := ru.rr.DeleteOnePlayer(roomName, name); err != nil {
		return err
	}
	if ru.ep != nil {
		_ = ru.ep.PushPlayerLeft(roomName, leftPlayer)
	}
	return nil
}
