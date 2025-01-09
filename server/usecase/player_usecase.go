package usecase

import (
	"server/domain"
	"server/repository"
)

type IPlayerUsecase interface {
	GetTeamPlayers(room string, team uint) ([]domain.PlayerResponse, error)
	CreatePlayer(player domain.Player) (domain.PlayerResponse, error)
	DeletePlayer(room string) error
	DeleteOnePlayer(room string, name string, team uint) error
}

type playerUsecase struct {
	tr repository.IPlayerRepository
}

func NewPlayerUsecase(tr repository.IPlayerRepository) IPlayerUsecase {
	return &playerUsecase{tr}
}

func (pu *playerUsecase) GetTeamPlayers(room string, team uint) ([]domain.PlayerResponse, error) {
	players := []domain.Player{}
	if err := pu.tr.GetTeamPlayers(&players, room, team); err != nil {
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

func (pu *playerUsecase) CreatePlayer(player domain.Player) (domain.PlayerResponse, error) {

	if err := pu.tr.CreatePlayer(&player); err != nil {
		return domain.PlayerResponse{}, err
	}
	resPlayer := domain.PlayerResponse{
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
