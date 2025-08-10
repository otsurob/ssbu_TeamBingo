package usecase

import (
	"server/domain"
	"server/repository"
)

type IRoomUsecase interface {
	GetAllRooms() ([]domain.RoomResponse, error)
	CreateRoom(room domain.Room) (domain.RoomResponse, error)
	DeleteRoom(roomName string) error
	GetTeamPlayers(room string, team uint) ([]domain.PlayerResponse, error)
	CreatePlayer(player domain.Player) (domain.PlayerResponse, error)
	DeletePlayer(room string) error
	DeleteOnePlayer(room string, name string, team uint) error
}

type roomUsecase struct {
	rr repository.IRoomRepository
}

func NewRoomUsecase(rr repository.IRoomRepository) IRoomUsecase {
	return &roomUsecase{rr}
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
			ID:   v.ID,
			Name: v.Name,
		}
		resRooms = append(resRooms, t)
	}
	return resRooms, nil
}

func (ru *roomUsecase) CreateRoom(room domain.Room) (domain.RoomResponse, error) {

	if err := ru.rr.CreateRoom(&room); err != nil {
		return domain.RoomResponse{}, err
	}
	resRoom := domain.RoomResponse{
		ID:   room.ID,
		Name: room.Name,
	}
	return resRoom, nil
}

func (ru *roomUsecase) DeleteRoom(roomName string) error {
	if err := ru.rr.DeleteRoom(roomName); err != nil {
		return err
	}
	return nil
}

func (ru *roomUsecase) GetTeamPlayers(room string, team uint) ([]domain.PlayerResponse, error) {
	players := []domain.Player{}
	if err := ru.rr.GetTeamPlayers(&players, room, team); err != nil {
		return nil, err
	}
	//クライアントへのレスポンス用
	resPlayers := []domain.PlayerResponse{}
	for _, v := range players {
		t := domain.PlayerResponse{
			ID:   v.ID,
			Name: v.Name,
			Team: v.Team,
		}
		resPlayers = append(resPlayers, t)
	}
	return resPlayers, nil
}

func (ru *roomUsecase) CreatePlayer(player domain.Player) (domain.PlayerResponse, error) {

	if err := ru.rr.CreatePlayer(&player); err != nil {
		return domain.PlayerResponse{}, err
	}
	resPlayer := domain.PlayerResponse{
		ID:   player.ID,
		Name: player.Name,
		Team: player.Team,
	}
	return resPlayer, nil
}

func (ru *roomUsecase) DeletePlayer(room string) error {
	if err := ru.rr.DeletePlayer(room); err != nil {
		return err
	}
	return nil
}

func (ru *roomUsecase) DeleteOnePlayer(room string, name string, team uint) error {
	if err := ru.rr.DeleteOnePlayer(room, name, team); err != nil {
		return err
	}
	return nil
}
