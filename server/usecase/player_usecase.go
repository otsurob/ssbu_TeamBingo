package usecase

import (
	"server/model"
	"server/repository"
)

type IPlayerUsecase interface {
	GetTeamPlayers(room string, team uint) ([]model.PlayerResponse, error)
	CreatePlayer(player model.Player) (model.PlayerResponse, error)
	DeletePlayer(room string) error
	DeleteOnePlayer(room string, name string, team uint) error
}

type playerUsecase struct {
	tr repository.IPlayerRepository
}

func NewPlayerUsecase(tr repository.IPlayerRepository) IPlayerUsecase {
	return &playerUsecase{tr}
}

func (pu *playerUsecase) GetTeamPlayers(room string, team uint) ([]model.PlayerResponse, error) {
	players := []model.Player{}
	if err := pu.tr.GetTeamPlayers(&players, room, team); err != nil {
		return nil, err
	}
	//クライアントへのレスポンス用
	resPlayers := []model.PlayerResponse{}
	for _, v := range players {
		t := model.PlayerResponse{
			ID:   v.ID,
			Name: v.Name,
			Team: v.Team,
		}
		resPlayers = append(resPlayers, t)
	}
	return resPlayers, nil
}

func (pu *playerUsecase) CreatePlayer(player model.Player) (model.PlayerResponse, error) {

	if err := pu.tr.CreatePlayer(&player); err != nil {
		return model.PlayerResponse{}, err
	}
	resPlayer := model.PlayerResponse{
		ID:   player.ID,
		Name: player.Name,
		Team: player.Team,
	}
	return resPlayer, nil
}

func (pu *playerUsecase) DeletePlayer(room string) error {
	if err := pu.tr.DeletePlayer(room); err != nil {
		return err
	}
	return nil
}

func (pu *playerUsecase) DeleteOnePlayer(room string, name string, team uint) error {
	if err := pu.tr.DeleteOnePlayer(room, name, team); err != nil {
		return err
	}
	return nil
}
