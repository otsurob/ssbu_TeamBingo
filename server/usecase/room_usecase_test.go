package usecase

import (
	"testing"

	"server/domain"
)

type rejoinRoomRepository struct {
	existing    domain.Player
	createCalls int
}

func (r *rejoinRoomRepository) GetRoom(room *domain.Room, roomName string) error {
	*room = domain.Room{ID: 1, RoomName: roomName}
	return nil
}

func (r *rejoinRoomRepository) GetPlayer(player *domain.Player, roomName, name string) error {
	*player = r.existing
	return nil
}

func (r *rejoinRoomRepository) CreatePlayer(player *domain.Player) error {
	r.createCalls++
	return nil
}

func (r *rejoinRoomRepository) GetAllRooms(*[]domain.Room) error                  { return nil }
func (r *rejoinRoomRepository) CreateRoom(*domain.Room) error                     { return nil }
func (r *rejoinRoomRepository) DeleteRoom(string) error                           { return nil }
func (r *rejoinRoomRepository) GetPlayers(*[]domain.Player, string) error         { return nil }
func (r *rejoinRoomRepository) UpdatePlayer(*domain.Player, string, string) error { return nil }
func (r *rejoinRoomRepository) DeletePlayer(string) error                         { return nil }
func (r *rejoinRoomRepository) DeleteOnePlayer(string, string) error              { return nil }

type rejoinEventPublisher struct {
	playerJoinedCalls int
}

func (p *rejoinEventPublisher) Push(*domain.PushEvent) error { return nil }
func (p *rejoinEventPublisher) PushCellUpdated(string, domain.Cell) error {
	return nil
}
func (p *rejoinEventPublisher) PushPlayerTeamUpdated(string, domain.Player) error {
	return nil
}
func (p *rejoinEventPublisher) PushTeamsShuffled(string, []domain.PlayerTeamUpdate) error {
	return nil
}
func (p *rejoinEventPublisher) PushPlayerJoined(string, domain.Player) error {
	p.playerJoinedCalls++
	return nil
}
func (p *rejoinEventPublisher) PushPlayerLeft(string, domain.Player) error { return nil }
func (p *rejoinEventPublisher) PushGameStarted(string) error               { return nil }
func (p *rejoinEventPublisher) PushGameEnded(string) error                 { return nil }

func TestCreatePlayerReturnsExistingPlayerOnRejoin(t *testing.T) {
	existing := domain.Player{
		ID:       10,
		Name:     "player1",
		RoomName: "room1",
		Team:     domain.TeamB,
		RoomId:   1,
	}
	repository := &rejoinRoomRepository{existing: existing}
	publisher := &rejoinEventPublisher{}
	usecase := NewRoomUsecase(repository, nil, publisher)

	got, err := usecase.CreatePlayer(
		domain.Player{Name: existing.Name, RoomName: existing.RoomName},
		existing.RoomName,
	)

	if err != nil {
		t.Fatalf("CreatePlayer returned an error on rejoin: %v", err)
	}
	if got.ID != existing.ID || got.Name != existing.Name ||
		got.RoomName != existing.RoomName || got.Team != existing.Team {
		t.Fatalf("CreatePlayer returned unexpected player: %+v", got)
	}
	if repository.createCalls != 0 {
		t.Fatalf("CreatePlayer created a duplicate record: calls = %d", repository.createCalls)
	}
	if publisher.playerJoinedCalls != 0 {
		t.Fatalf("CreatePlayer published a duplicate join event: calls = %d", publisher.playerJoinedCalls)
	}
}
